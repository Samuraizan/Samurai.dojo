export interface AgentSkill {
  name: string
  status: 'active' | 'inactive' | 'error'
  error?: string
}

async function testDeepSeekConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`
      }
    })
    return response.ok
  } catch {
    return false
  }
}

export async function checkDeepSeekStatus(): Promise<AgentSkill> {
  const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY

  if (!DEEPSEEK_API_KEY) {
    return {
      name: 'deepseek chat',
      status: 'inactive',
      error: 'API key not configured'
    }
  }

  const isConnected = await testDeepSeekConnection()
  
  return {
    name: 'deepseek chat',
    status: isConnected ? 'active' : 'error',
    error: isConnected ? undefined : 'Unable to connect to DeepSeek API'
  }
}

export async function getAgentSkills(agentId: string): Promise<AgentSkill[]> {
  const deepseekStatus = await checkDeepSeekStatus()
  
  return [deepseekStatus]
} 