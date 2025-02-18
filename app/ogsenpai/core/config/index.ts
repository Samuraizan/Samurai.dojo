/**
 * Configuration Management for OGSenpai
 */

interface Config {
  // DeepSeek Configuration
  deepseek: {
    apiKey: string;
    defaultModel: string;
    maxTokens: number;
    temperature: number;
  };

  // Agent Configuration
  agent: {
    name: string;
    version: string;
    maxConcurrentTasks: number;
    responseTimeout: number;
  };

  // Logging Configuration
  logging: {
    level: string;
    maxLogs: number;
    persistLogs: boolean;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    // Default configuration
    this.config = {
      deepseek: {
        apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '',
        defaultModel: 'deepseek-chat',
        maxTokens: 2000,
        temperature: 0.7,
      },
      agent: {
        name: 'OGSenpai',
        version: '0.1.0',
        maxConcurrentTasks: 1,
        responseTimeout: 30000, // 30 seconds
      },
      logging: {
        level: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO',
        maxLogs: 1000,
        persistLogs: false,
      },
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig(): Config {
    return this.config;
  }

  updateConfig(partialConfig: Partial<Config>): void {
    this.config = {
      ...this.config,
      ...partialConfig,
    };
  }

  validateConfig(): boolean {
    const { deepseek } = this.config;
    
    if (!deepseek.apiKey) {
      console.warn('DeepSeek API key not found in environment variables');
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Export types
export type { Config }; 