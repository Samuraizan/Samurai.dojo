import type { ApiClientConfig, ChatMessage, ChatResponse } from '@/lib/types'

export class DeepSeekClient {
  private config: ApiClientConfig

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.deepseek.com/v1'
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async chat(content: string): Promise<string> {
    const response = await this.request<any>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content }],
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    return response.choices[0].message.content
  }

  async checkStatus(): Promise<boolean> {
    try {
      await this.request('/models')
      return true
    } catch {
      return false
    }
  }
}

// Singleton instance
export const deepseekClient = new DeepSeekClient(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '') 