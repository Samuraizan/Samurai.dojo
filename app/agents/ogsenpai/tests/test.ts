'use client'

import { openRouter } from '../mind/llm/openrouter'
import { logger } from '../core/logger'
import { configManager } from '../core/config'

async function runTests() {
  try {
    // Test 1: Configuration
    logger.info('Test', 'Testing configuration...')
    const config = configManager.getConfig()
    console.log('Configuration loaded:', {
      agentName: config.agent.name,
      model: config.openRouter.defaultModel
    })

    // Test 2: Logger
    logger.debug('Test', 'Testing debug message')
    logger.info('Test', 'Testing info message')
    logger.warn('Test', 'Testing warn message')
    logger.error('Test', 'Testing error message')

    // Test 3: OpenRouter Integration
    logger.info('Test', 'Testing OpenRouter integration...')
    const response = await openRouter.generateResponse({
      prompt: 'Hello, I am testing the OGSenpai agent. Please respond with a short greeting.',
      model: config.openRouter.defaultModel
    })

    console.log('OpenRouter Response:', {
      text: response.text,
      usage: response.usage,
      metadata: response.metadata
    })

    logger.info('Test', 'All tests completed successfully')
  } catch (error) {
    logger.error('Test', 'Test failed', { error })
    console.error('Test failed:', error)
  }
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">OGSenpai Test Page</h1>
      <button
        onClick={() => runTests()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Run Tests
      </button>
      <p className="mt-4">Check the console for test results</p>
    </div>
  )
} 