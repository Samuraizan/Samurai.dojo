import { ElizaOS } from '../../lib/eliza'
import type { SocialPlatform } from '../types/agent'

interface FeatureParams {
  [key: string]: string | number | boolean | object
}

class ElizaIntegration {
  private static instance: ElizaIntegration
  private eliza: typeof ElizaOS
  private initialized = false

  private constructor() {
    this.eliza = ElizaOS
  }

  static getInstance(): ElizaIntegration {
    if (!ElizaIntegration.instance) {
      ElizaIntegration.instance = new ElizaIntegration()
    }
    return ElizaIntegration.instance
  }

  async initialize(platforms: SocialPlatform[]): Promise<void> {
    if (this.initialized) return

    try {
      await this.eliza.init({
        platforms: platforms.map(platform => ({
          name: platform,
          config: this.getPlatformConfig(platform)
        }))
      })
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize ElizaOS:', error)
      throw error
    }
  }

  private getPlatformConfig(platform: SocialPlatform) {
    // Platform-specific configurations would be loaded from environment variables
    return {
      apiKey: process.env[`NEXT_PUBLIC_${platform.toUpperCase()}_API_KEY`],
      apiSecret: process.env[`${platform.toUpperCase()}_API_SECRET`]
    }
  }

  getFeatures() {
    return this.eliza.getAvailableFeatures()
  }

  async executeFeature(featureName: string, params: FeatureParams) {
    if (!this.initialized) {
      throw new Error('ElizaOS not initialized')
    }
    return await this.eliza.execute(featureName, params)
  }
}

export const elizaIntegration = ElizaIntegration.getInstance() 