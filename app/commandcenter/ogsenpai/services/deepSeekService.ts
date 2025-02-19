interface DeepSeekResponse {
  response: string;
  final: boolean;
}

interface DeepSeekConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export class DeepSeekService {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private conversationHistory: { role: 'user' | 'assistant', content: string }[] = [];
  private systemPrompt = "You are OGSenpai, a knowledgeable and helpful AI assistant. You provide clear, concise, and accurate responses while maintaining a professional and friendly demeanor.";

  constructor(config: DeepSeekConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'deepseek-chat-67b-instruct';
    this.maxTokens = config.maxTokens || 2000;
    this.temperature = config.temperature || 0.7;
    
    // Initialize conversation with system prompt
    this.conversationHistory = [{
      role: 'system',
      content: this.systemPrompt
    }];
  }

  public async processInput(input: string): Promise<DeepSeekResponse> {
    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: input });

      const response = await fetch('https://api.deepseek.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.conversationHistory,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error: ${response.statusText}. ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0]?.message?.content || 'I apologize, but I am unable to process that request.';

      // Add assistant response to history
      this.conversationHistory.push({ role: 'assistant', content: assistantResponse });

      // Keep conversation history manageable (but keep system prompt)
      if (this.conversationHistory.length > 11) {
        this.conversationHistory = [
          this.conversationHistory[0],
          ...this.conversationHistory.slice(-10)
        ];
      }

      return {
        response: assistantResponse,
        final: false
      };
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      return {
        response: 'I apologize, but I encountered an error. Falling back to ELIZA mode.',
        final: false
      };
    }
  }

  public reset(): void {
    this.conversationHistory = [{
      role: 'system',
      content: this.systemPrompt
    }];
  }

  public getState() {
    return {
      history: [...this.conversationHistory]
    };
  }

  public setState(history: typeof this.conversationHistory) {
    this.conversationHistory = [...history];
  }
} 