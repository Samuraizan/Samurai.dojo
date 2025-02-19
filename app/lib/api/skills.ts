import type { Skill } from '../types/skill'

const skills: Record<string, Skill> = {
  rag_mastery: {
    id: 'rag_mastery',
    name: 'RAG Mastery',
    description: 'Advanced knowledge retrieval and generation capabilities powered by vector embeddings and LLM integration',
    level: 'advanced',
    category: 'technique',
    icon: '🧠',
    progress: 75,
    requiredPoints: 100,
    currentPoints: 75
  }
} satisfies Record<string, Skill>

export const getSkillById = async (id: string): Promise<Skill | null> =>
  skills[id as keyof typeof skills] ?? null

export const getAllSkills = async (): Promise<Skill[]> =>
  Object.values(skills)

export const getSkillsByCategory = async (category: string): Promise<Skill[]> =>
  Object.values(skills).filter(skill => skill.category === category) 