import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

type Task = Database['public']['Tables']['agent_tasks']['Row']

interface UseAgentTasksOptions {
  agentId: string
  status?: Task['status']
  limit?: number
}

export function useAgentTasks({ agentId, status, limit = 10 }: UseAgentTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Subscribe to real-time updates
  useSupabaseRealtime({
    table: 'agent_tasks',
    filter: {
      column: 'agent_id',
      value: agentId
    },
    onInsert: (newTask) => {
      if (!status || newTask.status === status) {
        setTasks(prev => [newTask, ...prev])
      }
    },
    onUpdate: (updatedTask) => {
      setTasks(prev => {
        if (!status || updatedTask.status === status) {
          return prev.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        }
        return prev.filter(task => task.id !== updatedTask.id)
      })
    },
    onDelete: (deletedTask) => {
      setTasks(prev => 
        prev.filter(task => task.id !== deletedTask.id)
      )
    }
  })

  // Initial fetch
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let query = supabase
          .from('agent_tasks')
          .select('*')
          .eq('agent_id', agentId)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (status) {
          query = query.eq('status', status)
        }

        const { data, error } = await query

        if (error) throw error

        setTasks(data)
        setHasMore(data.length === limit)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [agentId, status, limit])

  // Load more tasks
  const loadMore = async () => {
    if (!hasMore || isLoading) return

    try {
      setIsLoading(true)
      const lastTask = tasks[tasks.length - 1]

      let query = supabase
        .from('agent_tasks')
        .select('*')
        .eq('agent_id', agentId)
        .lt('created_at', lastTask.created_at)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error

      setTasks(prev => [...prev, ...data])
      setHasMore(data.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more tasks'))
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new task
  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = {
        ...taskData,
        agent_id: agentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('agent_tasks')
        .insert(newTask)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create task'))
      throw err
    }
  }

  // Update a task
  const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'))
      throw err
    }
  }

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('agent_tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'))
      throw err
    }
  }

  return {
    tasks,
    isLoading,
    error,
    hasMore,
    loadMore,
    createTask,
    updateTask,
    deleteTask
  }
} 