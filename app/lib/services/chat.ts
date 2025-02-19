import { supabase } from './supabase'
import { deepseekClient } from './api/deepseek'
import type { ChatMessage, ChatResponse } from '@/lib/types'

export async function sendMessage(content: string): Promise<ChatResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      return {
        message: {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'DeepSeek API is not configured. Please add your API key to continue.',
          timestamp: Date.now()
        },
        error: 'DeepSeek API key not configured'
      }
    }

    // Store user message in Supabase
    const { error: messageError } = await supabase
      .from('messages')
      .insert([{
        role: 'user',
        content,
        timestamp: Date.now()
      }])

    if (messageError) {
      console.error('Failed to store message:', messageError)
    }

    // Call DeepSeek API using the client
    const aiResponse = await deepseekClient.chat(content)

    // Store AI response in Supabase
    const { error: responseError } = await supabase
      .from('messages')
      .insert([{
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }])

    if (responseError) {
      console.error('Failed to store AI response:', responseError)
    }

    return {
      message: {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
    return {
      message: {
        id: Date.now().toString(),
        role: 'assistant',
        content: error instanceof Error ? 
          `Error: ${error.message}` : 
          'An unexpected error occurred while processing your message.',
        timestamp: Date.now()
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 