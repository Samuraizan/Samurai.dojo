export enum SkillCategory {
  TECHNICAL = 'TECHNICAL',
  STRATEGIC = 'STRATEGIC',
  PHILOSOPHICAL = 'PHILOSOPHICAL',
  MARTIAL = 'MARTIAL',
  LEADERSHIP = 'LEADERSHIP'
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  description: string;
}

export interface SkillMetrics {
  totalSkills: number;
  skillsByCategory: Record<SkillCategory, number>;
  averageLevel: number;
}