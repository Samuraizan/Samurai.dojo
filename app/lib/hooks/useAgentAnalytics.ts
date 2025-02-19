import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Task = Database['public']['Tables']['agent_tasks']['Row']
type Message = Database['public']['Tables']['messages']['Row']

interface UseAgentAnalyticsOptions {
  agentId: string
  timeframe?: 'day' | 'week' | 'month' | 'year'
}

interface AnalyticsSummary {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  averageResponseTime: number
  messageCount: number
  successRate: number
  topCapabilities: Array<{
    capability: string
    count: number
  }>
}

export function useAgentAnalytics({ agentId, timeframe = 'week' }: UseAgentAnalyticsOptions) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get the start date based on timeframe
        const startDate = new Date()
        switch (timeframe) {
          case 'day':
            startDate.setDate(startDate.getDate() - 1)
            break
          case 'week':
            startDate.setDate(startDate.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1)
            break
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1)
            break
        }

        // Fetch tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('agent_tasks')
          .select('*')
          .eq('agent_id', agentId)
          .gte('created_at', startDate.toISOString())

        if (tasksError) throw tasksError

        // Fetch messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('metadata->agent_id', agentId)
          .gte('created_at', startDate.toISOString())

        if (messagesError) throw messagesError

        // Calculate analytics
        const completedTasks = tasks.filter(task => task.status === 'completed')
        const failedTasks = tasks.filter(task => task.status === 'error')

        // Calculate average response time
        const responseTimes = tasks.map(task => {
          const startTime = new Date(task.created_at).getTime()
          const endTime = new Date(task.updated_at).getTime()
          return endTime - startTime
        })

        const averageResponseTime = responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : 0

        // Calculate success rate
        const successRate = tasks.length > 0
          ? (completedTasks.length / tasks.length) * 100
          : 0

        // Calculate top capabilities
        const capabilityCounts = new Map<string, number>()
        for (const task of tasks) {
          const capability = task.metadata?.capability
          if (capability) {
            capabilityCounts.set(
              capability,
              (capabilityCounts.get(capability) || 0) + 1
            )
          }
        }

        const topCapabilities = Array.from(capabilityCounts.entries())
          .map(([capability, count]) => ({ capability, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setSummary({
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          failedTasks: failedTasks.length,
          averageResponseTime,
          messageCount: messages.length,
          successRate,
          topCapabilities
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [agentId, timeframe])

  // Get task distribution over time
  const getTaskDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('created_at, status')
        .eq('agent_id', agentId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group tasks by day
      const distribution = new Map<string, { completed: number; failed: number }>()
      for (const task of data) {
        const date = new Date(task.created_at).toISOString().split('T')[0]
        const current = distribution.get(date) || { completed: 0, failed: 0 }

        if (task.status === 'completed') {
          current.completed++
        } else if (task.status === 'error') {
          current.failed++
        }

        distribution.set(date, current)
      }

      return Array.from(distribution.entries()).map(([date, stats]) => ({
        date,
        ...stats
      }))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch task distribution'))
      throw err
    }
  }

  // Get performance metrics
  const getPerformanceMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('created_at, updated_at, status')
        .eq('agent_id', agentId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      if (error) throw error

      const metrics = data.map(task => {
        const processingTime = new Date(task.updated_at).getTime() - new Date(task.created_at).getTime()
        return {
          date: new Date(task.created_at).toISOString().split('T')[0],
          processingTime,
          success: task.status === 'completed'
        }
      })

      return metrics
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch performance metrics'))
      throw err
    }
  }

  return {
    summary,
    isLoading,
    error,
    getTaskDistribution,
    getPerformanceMetrics
  }
} 