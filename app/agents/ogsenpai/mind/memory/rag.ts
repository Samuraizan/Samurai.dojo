import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import { deepseek } from '../llm/deepseek';
import { memoryManager } from './index';
import { vectorStore } from './vector-store';
import type { MemoryEntry, MemoryType } from './types';

export class RAGSystem {
  private static instance: RAGSystem;
  private contextWindowSize: number;

  private constructor() {
    this.contextWindowSize = 5; // Number of relevant memories to include in context
  }

  static getInstance(): RAGSystem {
    if (!RAGSystem.instance) {
      RAGSystem.instance = new RAGSystem();
    }
    return RAGSystem.instance;
  }

  /**
   * Generate a response using RAG
   */
  async generateResponse(input: string): Promise<string> {
    try {
      // 1. Find relevant memories
      const relevantMemoryIds = await vectorStore.findSimilar(input, this.contextWindowSize);
      const relevantMemories = relevantMemoryIds
        .map(id => memoryManager.retrieve(id))
        .filter((memory): memory is MemoryEntry => memory !== null);

      // 2. Build context from memories
      const context = this.buildContext(relevantMemories);

      // 3. Generate response using context-enhanced prompt
      const prompt = this.buildPrompt(input, context);
      const response = await deepseek.generateResponse({
        prompt,
        model: 'deepseek-chat'
      });

      // 4. Store the interaction in memory
      await this.storeInteraction(input, response.text, relevantMemories);

      return response.text;
    } catch (error) {
      logger.error('RAGSystem', 'Error generating response', { error });
      throw error;
    }
  }

  /**
   * Build context from relevant memories
   */
  private buildContext(memories: MemoryEntry[]): string {
    // Sort memories by importance and recency
    const sortedMemories = memories.sort((a, b) => {
      const importanceDiff = b.metadata.importance - a.metadata.importance;
      if (importanceDiff !== 0) return importanceDiff;
      return b.timestamp - a.timestamp;
    });

    // Build context string
    return sortedMemories.map(memory => {
      const content = typeof memory.content === 'string' 
        ? memory.content 
        : JSON.stringify(memory.content);
      
      return `[${memory.type}] ${content}`;
    }).join('\n\n');
  }

  /**
   * Build prompt with context
   */
  private buildPrompt(input: string, context: string): string {
    return `Context:
${context}

Current Input: ${input}

Based on the above context and the current input, provide a relevant and informed response.`;
  }

  /**
   * Store interaction in memory
   */
  private async storeInteraction(
    input: string,
    response: string,
    relatedMemories: MemoryEntry[]
  ): Promise<void> {
    try {
      // Store the conversation
      const conversationId = memoryManager.store(
        MemoryType.CONVERSATION,
        {
          input,
          response,
          relatedMemoryIds: relatedMemories.map(m => m.id)
        },
        {
          importance: 0.7,
          context: 'conversation',
          associations: ['interaction', 'dialogue']
        }
      );

      // Add to vector store for future retrieval
      const memory = memoryManager.retrieve(conversationId);
      if (memory) {
        await vectorStore.addMemory(memory);
      }

      logger.debug('RAGSystem', 'Interaction stored', { conversationId });
    } catch (error) {
      logger.error('RAGSystem', 'Error storing interaction', { error });
      throw error;
    }
  }

  /**
   * Set the context window size
   */
  setContextWindowSize(size: number): void {
    this.contextWindowSize = size;
    logger.debug('RAGSystem', `Context window size set to ${size}`);
  }
}

// Export singleton instance
export const ragSystem = RAGSystem.getInstance(); 