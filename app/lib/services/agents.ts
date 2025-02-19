import { supabase, getErrorMessage } from './supabase'
import type { Agent, AgentResponse, AgentsResponse } from '../types'

export async function getAgents(): Promise<AgentsResponse> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name')

    if (error) throw error
    return { data: data as Agent[] }
  } catch (error) {
    return { error: { message: getErrorMessage(error), code: 'FETCH_ERROR' } }
  }
}

export async function getAgentById(id: string): Promise<AgentResponse> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data: data as Agent }
  } catch (error) {
    return { error: { message: getErrorMessage(error), code: 'FETCH_ERROR' } }
  }
}

// Initial agents data for development
export const initialAgents: Agent[] = [
  {
    id: 'ogsenpai',
    name: 'og senpai',
    description: 'master ai with command authority',
    type: 'ai',
    status: 'active',
    capabilities: ['command', 'strategy', 'training'],
    config: {
      model: 'deepseek-coder-33b-instruct',
      temperature: 0.7,
      maxTokens: 2048
    }
  },
  {
    id: 'eliza',
    name: 'eliza',
    description: 'social engagement and community',
    type: 'ai',
    status: 'active',
    capabilities: ['conversation', 'support', 'engagement'],
    config: {
      model: 'eliza-gpt',
      temperature: 0.8,
      maxTokens: 1024
    }
  }
] 