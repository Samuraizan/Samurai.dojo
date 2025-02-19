import { useState } from 'react'
import { useAgentState } from './useAgentState'
import { useChatMessages } from './useChatMessages'
import { useAgentTasks } from './useAgentTasks'
import type { Database } from '@/lib/supabase/types'

type Agent = Database['public']['Tables']['agents']['Row']
type Message = Database['public']['Tables']['messages']['Row']
type Task = Database['public']['Tables']['agent_tasks']['Row']

interface UseAgentInteractionOptions {
  agentId: string
  chatId: string
}

export function useAgentInteraction({ agentId, chatId }: UseAgentInteractionOptions) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { agent, updateStatus } = useAgentState({ agentId })
  const { messages, sendMessage } = useChatMessages({ chatId })
  const { createTask, updateTask } = useAgentTasks({ agentId })

  // Send a message to the agent and handle the response
  const interact = async (content: string, metadata: Record<string, unknown> = {}) => {
    if (!agent) throw new Error('Agent not found')
    if (isProcessing) throw new Error('Agent is already processing a request')

    try {
      setIsProcessing(true)
      setError(null)

      // Update agent status to processing
      await updateStatus('processing')

      // Create a new task for this interaction
      const task = await createTask({
        type: 'interaction',
        status: 'processing',
        metadata: {
          chat_id: chatId,
          request: content,
          ...metadata
        }
      })

      // Send the user message
      await sendMessage(content, {
        type: 'user',
        task_id: task.id,
        ...metadata
      })

      // Process the message (this would typically call your AI service)
      const response = await processAgentResponse(content, metadata)

      // Send the agent's response
      await sendMessage(response.content, {
        type: 'agent',
        task_id: task.id,
        ...response.metadata
      })

      // Update task status
      await updateTask(task.id, {
        status: 'completed',
        metadata: {
          ...task.metadata,
          response: response
        }
      })

      // Update agent status back to active
      await updateStatus('active')

      return response
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process interaction'))
      
      // Update agent status to error
      await updateStatus('error')
      
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  // Process the agent's response (placeholder for AI service integration)
  const processAgentResponse = async (
    content: string,
    metadata: Record<string, unknown>
  ): Promise<{
    content: string
    metadata: Record<string, unknown>
  }> => {
    // This is where you would integrate with your AI service
    // For now, we'll return a mock response
    return {
      content: `I received your message: "${content}"`,
      metadata: {
        processed_at: new Date().toISOString(),
        original_metadata: metadata
      }
    }
  }

  // Get the conversation history
  const getConversationHistory = () => {
    return messages?.map(message => ({
      role: message.metadata.type === 'user' ? 'user' : 'assistant',
      content: message.content
    })) ?? []
  }

  // Check if the agent can handle a specific capability
  const canHandle = (capability: string) => {
    return agent?.capabilities.includes(capability) ?? false
  }

  return {
    agent,
    isProcessing,
    error,
    interact,
    getConversationHistory,
    canHandle
  }
} 