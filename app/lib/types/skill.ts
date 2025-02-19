export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'master'
export type SkillCategory = 'combat' | 'strategy' | 'wisdom' | 'technique'

export interface Skill {
  id: string
  name: string
  description: string
  level: SkillLevel
  category: SkillCategory
  icon: string
  progress: number
  requiredPoints: number
  currentPoints: number
}

export const getSkillLevelColor = (level: SkillLevel) => {
  const colors = {
    beginner: 'from-green-400 to-green-500',
    intermediate: 'from-blue-400 to-blue-500',
    advanced: 'from-purple-400 to-purple-500',
    master: 'from-amber-400 to-amber-500'
  }
  return colors[level]
} 