import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../../core/logger';
import { memoryManager } from './index';
import { vectorStore } from './vector-store';
import { MemoryType } from './types';

export class KnowledgeLoader {
  private static instance: KnowledgeLoader;
  private knowledgeBasePath: string;

  private constructor() {
    this.knowledgeBasePath = join(process.cwd(), 'app/ogsenpai/knowledge-base');
  }

  static getInstance(): KnowledgeLoader {
    if (!KnowledgeLoader.instance) {
      KnowledgeLoader.instance = new KnowledgeLoader();
    }
    return KnowledgeLoader.instance;
  }

  /**
   * Load all markdown files from the knowledge base
   */
  async loadKnowledgeBase(): Promise<void> {
    try {
      const files = await fs.readdir(this.knowledgeBasePath);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      logger.info('KnowledgeLoader', `Found ${mdFiles.length} knowledge base files`);

      for (const file of mdFiles) {
        await this.loadFile(file);
      }

      logger.info('KnowledgeLoader', 'Knowledge base loaded successfully');
    } catch (error) {
      logger.error('KnowledgeLoader', 'Error loading knowledge base', { error });
      throw error;
    }
  }

  /**
   * Load a single markdown file into memory
   */
  private async loadFile(filename: string): Promise<void> {
    try {
      const filePath = join(this.knowledgeBasePath, filename);
      const content = await fs.readFile(filePath, 'utf-8');

      // Split content into sections based on headers
      const sections = this.parseSections(content);

      // Store each section as a separate memory
      for (const section of sections) {
        const memoryId = memoryManager.store(
          MemoryType.KNOWLEDGE,
          section.content,
          {
            source: filename,
            importance: 0.8,
            context: section.title,
            associations: ['knowledge', 'documentation', ...section.tags]
          }
        );

        // Add to vector store
        const memory = memoryManager.retrieve(memoryId);
        if (memory) {
          await vectorStore.addMemory(memory);
        }
      }

      logger.debug('KnowledgeLoader', `Loaded file: ${filename}`);
    } catch (error) {
      logger.error('KnowledgeLoader', `Error loading file: ${filename}`, { error });
      throw error;
    }
  }

  /**
   * Parse markdown content into sections
   */
  private parseSections(content: string): Array<{
    title: string;
    content: string;
    tags: string[];
  }> {
    const sections: Array<{
      title: string;
      content: string;
      tags: string[];
    }> = [];

    const lines = content.split('\n');
    let currentSection: {
      title: string;
      content: string[];
      tags: string[];
    } | null = null;

    for (const line of lines) {
      // Check for headers
      if (line.startsWith('#')) {
        // Save previous section if it exists
        if (currentSection) {
          sections.push({
            title: currentSection.title,
            content: currentSection.content.join('\n').trim(),
            tags: currentSection.tags
          });
        }

        // Start new section
        const title = line.replace(/^#+\s*/, '').trim();
        currentSection = {
          title,
          content: [],
          tags: [title.toLowerCase().replace(/[^a-z0-9]+/g, '-')]
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push({
        title: currentSection.title,
        content: currentSection.content.join('\n').trim(),
        tags: currentSection.tags
      });
    }

    return sections;
  }
}

// Export singleton instance
export const knowledgeLoader = KnowledgeLoader.getInstance(); 