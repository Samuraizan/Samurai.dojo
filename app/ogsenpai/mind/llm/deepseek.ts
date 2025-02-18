'use client'

import type { LLMRequest, LLMResponse } from '../../core/types';
import { configManager } from '../../core/config';
import { logger } from '../../core/logger';

export class DeepSeekClient {
  private static instance: DeepSeekClient;
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  private constructor() {
    this.apiKey = configManager.getConfig().deepseek.apiKey;
  }

  static getInstance(): DeepSeekClient {
    if (!DeepSeekClient.instance) {
      DeepSeekClient.instance = new DeepSeekClient();
    }
    return DeepSeekClient.instance;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      logger.info('DeepSeek', 'Generating response', { model: request.model });

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are OGSenpai, a helpful and knowledgeable AI assistant.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('DeepSeek', 'API error', { 
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`DeepSeek API error: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      logger.debug('DeepSeek', 'Response received', { data });

      return {
        text: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage?.prompt_tokens ?? 0,
          completionTokens: data.usage?.completion_tokens ?? 0,
          totalTokens: data.usage?.total_tokens ?? 0
        },
        metadata: {
          model: data.model,
          systemFingerprint: data.system_fingerprint
        }
      };
    } catch (error) {
      logger.error('DeepSeek', 'Error generating response', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const deepseek = DeepSeekClient.getInstance(); 