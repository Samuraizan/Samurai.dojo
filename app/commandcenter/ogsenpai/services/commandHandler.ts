import { elizaService, ELIZA_COMMANDS, type ElizaCommand } from './elizaService';

export interface CommandResponse {
  content: string;
  type: 'system' | 'output' | 'error';
  final?: boolean;
}

const HELP_TEXT = `
Available commands:
  help         - Show this help message
  reset        - Reset the conversation
  clear        - Clear the terminal
  exit         - End the conversation
  mode openai   - Switch to OpenAI mode (primary)
  mode deepseek - Switch to DeepSeek AI mode (fallback)
  mode eliza   - Switch to classic ELIZA mode (rule-based)
  
OpenAI is the primary mode, with DeepSeek as fallback and ELIZA as final fallback.
Type your message and press Enter to chat.
`.trim();

export class CommandHandler {
  private isFirstMessage = true;

  constructor() {
    this.init();
  }

  private init() {
    this.isFirstMessage = true;
  }

  public async processCommand(input: string): Promise<CommandResponse> {
    // Handle first message
    if (this.isFirstMessage) {
      this.isFirstMessage = false;
      return {
        content: elizaService.getInitialMessage(),
        type: 'system'
      };
    }

    // Process built-in commands
    const command = input.toLowerCase().trim();
    
    switch (command as ElizaCommand) {
      case ELIZA_COMMANDS.HELP:
        return {
          content: HELP_TEXT,
          type: 'system'
        };
        
      case ELIZA_COMMANDS.RESET:
        elizaService.reset();
        this.init();
        return {
          content: `Conversation reset. ${elizaService.getInitialMessage()}`,
          type: 'system'
        };
        
      case ELIZA_COMMANDS.CLEAR:
        return {
          content: 'clear',
          type: 'system'
        };
        
      case ELIZA_COMMANDS.EXIT:
      case ELIZA_COMMANDS.QUIT:
        return {
          content: elizaService.getFinalMessage(),
          type: 'output',
          final: true
        };

      case ELIZA_COMMANDS.MODE_ELIZA:
      case ELIZA_COMMANDS.MODE_DEEPSEEK:
        try {
          const response = await elizaService.processInput(command);
          return {
            content: response.response,
            type: 'system'
          };
        } catch (error) {
          return {
            content: `Error switching mode: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'error'
          };
        }
        
      default:
        try {
          const response = await elizaService.processInput(input);
          return {
            content: response.response,
            type: 'output',
            final: response.final
          };
        } catch (error) {
          return {
            content: `Error processing input: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'error'
          };
        }
    }
  }

  public reset(): void {
    elizaService.reset();
    this.init();
  }
} 