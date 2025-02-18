'use client'

import type { LLMRequest, LLMResponse } from '../../core/types';
import { configManager } from '../../core/config';
import { logger } from '../../core/logger';

export class OpenRouterClient {
  private static instance: OpenRouterClient;
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  private constructor() {
    this.apiKey = configManager.getConfig().openRouter.apiKey;
  }

  static getInstance(): OpenRouterClient {
    if (!OpenRouterClient.instance) {
      OpenRouterClient.instance = new OpenRouterClient();
    }
    return OpenRouterClient.instance;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      logger.info('OpenRouter', 'Generating response', { model: request.model });

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://samurai.dojo',
          'X-Title': 'Samurai.Dojo'
        },
        body: JSON.stringify({
          model: request.model,
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
          temperature: request.temperature ?? configManager.getConfig().openRouter.temperature,
          max_tokens: request.maxTokens ?? configManager.getConfig().openRouter.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('OpenRouter', 'API error', { 
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`OpenRouter API error: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      // Log raw response for debugging
      logger.debug('OpenRouter', 'Raw response', { data });
      
      if (!data) {
        throw new Error('Empty response from OpenRouter');
      }

      if (!data.choices) {
        throw new Error('No choices in OpenRouter response');
      }

      if (!data.choices[0]) {
        throw new Error('Empty choices array in OpenRouter response');
      }

      if (!data.choices[0].message) {
        throw new Error('No message in OpenRouter response choice');
      }

      logger.debug('OpenRouter', 'Response received', { 
        usage: data.usage,
        model: data.model 
      });

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
      logger.error('OpenRouter', 'Error generating response', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const openRouter = OpenRouterClient.getInstance(); 