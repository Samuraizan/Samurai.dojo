import { SkillCategory } from './types';
import type { Skill, SkillMetrics } from './types';

class SkillManager {
  private static instance: SkillManager;
  private skills: Map<string, Skill>;

  private constructor() {
    this.skills = new Map();
    this.initializeBaseSkills();
  }

  static getInstance(): SkillManager {
    if (!SkillManager.instance) {
      SkillManager.instance = new SkillManager();
    }
    return SkillManager.instance;
  }

  private initializeBaseSkills(): void {
    // Initialize with core skills
    this.addSkill({
      name: 'Strategic Analysis',
      category: SkillCategory.STRATEGIC,
      level: 0.9,
      description: 'Ability to analyze situations and formulate effective strategies'
    });

    this.addSkill({
      name: 'Wisdom Integration',
      category: SkillCategory.PHILOSOPHICAL,
      level: 0.85,
      description: 'Integration of philosophical principles in decision making'
    });

    this.addSkill({
      name: 'Technical Mastery',
      category: SkillCategory.TECHNICAL,
      level: 0.95,
      description: 'Deep understanding of technical systems and implementation'
    });
  }

  addSkill(params: Omit<Skill, 'id'>): string {
    const id = `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const skill: Skill = {
      id,
      ...params
    };
    this.skills.set(id, skill);
    return id;
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.getAllSkills().filter(skill => skill.category === category);
  }

  getMetrics(): SkillMetrics {
    const skills = this.getAllSkills();
    const skillsByCategory = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {} as Record<SkillCategory, number>);

    return {
      totalSkills: skills.length,
      skillsByCategory,
      averageLevel: skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
    };
  }
}

export const skillManager = SkillManager.getInstance(); 