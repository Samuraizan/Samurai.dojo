import { ElizaCore } from './elizaCore';
import { DeepSeekService } from './deepSeekService';
import { OpenAIService } from './openaiService';

export interface ElizaResponse {
  response: string;
  final: boolean;
}

export interface ElizaState {
  context?: string;
  memory?: string[];
  mode: 'eliza' | 'deepseek' | 'openai';
}

class ElizaService {
  private eliza = new ElizaCore();
  private deepseek: DeepSeekService | null = null;
  private openai: OpenAIService | null = null;
  private memory: string[] = [];
  private context = '';
  private mode: 'eliza' | 'deepseek' | 'openai' = 'openai';

  constructor() {
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const deepseekApiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

    if (openaiApiKey) {
      this.openai = new OpenAIService({
        apiKey: openaiApiKey,
        model: 'gpt-3.5-turbo',
        temperature: 0.7
      });
    } else if (deepseekApiKey) {
      // Fall back to DeepSeek if OpenAI is not available
      this.deepseek = new DeepSeekService({
        apiKey: deepseekApiKey,
        model: 'deepseek-chat-67b-instruct',
        temperature: 0.7
      });
      this.mode = 'deepseek';
      console.warn('OpenAI API key not found, falling back to DeepSeek mode');
    } else {
      // Fall back to ELIZA if no API keys are available
      this.mode = 'eliza';
      console.warn('No API keys found, falling back to ELIZA mode');
    }
  }

  private init() {
    this.memory = [];
    this.context = '';
    this.deepseek?.reset();
    this.openai?.reset();
  }

  public getInitialMessage(): string {
    if (this.mode === 'openai' && !this.openai) {
      if (this.deepseek) {
        this.mode = 'deepseek';
        return "Hello! I'm OGSenpai running in DeepSeek mode. How can I assist you today? (Type 'help' for available commands)";
      }
      this.mode = 'eliza';
      return `${this.eliza.getInitial()}\nNote: Advanced AI modes are not available. Running in ELIZA mode.`;
    }

    switch (this.mode) {
      case 'eliza':
        return this.eliza.getInitial();
      case 'deepseek':
        return "Hello! I'm OGSenpai running in DeepSeek AI mode. How can I assist you today? (Type 'help' for available commands)";
      default:
        return "Hello! I'm OGSenpai running in OpenAI mode. How can I assist you today? (Type 'help' for available commands)";
    }
  }

  public getFinalMessage(): string {
    return this.mode === 'eliza'
      ? this.eliza.getFinal()
      : "Goodbye! Thank you for chatting with me.";
  }

  public async processInput(input: string): Promise<ElizaResponse> {
    // Store input in memory
    this.memory.push(input);

    // Check for mode switch commands
    const command = input.toLowerCase().trim();
    
    if (command === 'mode openai') {
      if (!this.openai) {
        return {
          response: "OpenAI mode is not available. Please configure the API key.",
          final: false
        };
      }
      this.mode = 'openai';
      return {
        response: "Switched to OpenAI mode. How can I assist you?",
        final: false
      };
    }

    if (command === 'mode deepseek') {
      if (!this.deepseek) {
        return {
          response: "DeepSeek mode is not available. Please configure the API key.",
          final: false
        };
      }
      this.mode = 'deepseek';
      return {
        response: "Switched to DeepSeek mode. How can I assist you?",
        final: false
      };
    }

    if (command === 'mode eliza') {
      this.mode = 'eliza';
      return {
        response: `Switched to ELIZA mode. ${this.eliza.getInitial()}`,
        final: false
      };
    }

    // Process input based on current mode
    try {
      switch (this.mode) {
        case 'openai': {
          if (this.openai) {
            return await this.openai.processInput(input);
          }
          if (this.deepseek) {
            this.mode = 'deepseek';
            return await this.deepseek.processInput(input);
          }
          this.mode = 'eliza';
          break;
        }
        case 'deepseek': {
          if (this.deepseek) {
            return await this.deepseek.processInput(input);
          }
          this.mode = 'eliza';
          break;
        }
      }
      
      // Default ELIZA behavior
      const response = this.eliza.transform(input);
      if (!response.final) {
        this.context = response.response;
      }
      return response;
    } catch (error) {
      console.error(`Error in ${this.mode} mode:`, error);
      // Fall back to ELIZA on error
      this.mode = 'eliza';
      return {
        response: `An error occurred. Falling back to ELIZA mode.\n${this.eliza.getInitial()}`,
        final: false
      };
    }
  }

  public reset(): void {
    this.init();
  }

  public getState(): ElizaState {
    return {
      context: this.context,
      memory: [...this.memory],
      mode: this.mode
    };
  }

  public setState(state: ElizaState): void {
    if (state.memory) {
      this.memory = [...state.memory];
    }
    if (state.context) {
      this.context = state.context;
    }
    if (state.mode) {
      this.mode = state.mode;
    }
  }

  public getCurrentMode(): 'eliza' | 'deepseek' | 'openai' {
    return this.mode;
  }
}

// Export a singleton instance
export const elizaService = new ElizaService();

// Export command constants
export const ELIZA_COMMANDS = {
  HELP: 'help',
  RESET: 'reset',
  QUIT: 'quit',
  EXIT: 'exit',
  CLEAR: 'clear',
  MODE_ELIZA: 'mode eliza',
  MODE_DEEPSEEK: 'mode deepseek',
  MODE_OPENAI: 'mode openai'
} as const;

export type ElizaCommand = keyof typeof ELIZA_COMMANDS; 