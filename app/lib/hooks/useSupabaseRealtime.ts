import { useEffect, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type TableName = keyof Database['public']['Tables']
type RowType<T extends TableName> = Database['public']['Tables'][T]['Row']

interface UseRealtimeOptions<T extends TableName> {
  table: T
  filter?: {
    column: keyof RowType<T>
    value: RowType<T>[keyof RowType<T>]
  }
  onInsert?: (payload: RowType<T>) => void
  onUpdate?: (payload: RowType<T>) => void
  onDelete?: (payload: RowType<T>) => void
}

export function useSupabaseRealtime<T extends TableName>({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        ...(filter && {
          filter: `${filter.column}=eq.${filter.value}`,
        }),
      }, (payload) => {
        try {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new as RowType<T>)
              break
            case 'UPDATE':
              onUpdate?.(payload.new as RowType<T>)
              break
            case 'DELETE':
              onDelete?.(payload.old as RowType<T>)
              break
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      })
      .subscribe()

    setChannel(subscription)

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  return { error }
} 