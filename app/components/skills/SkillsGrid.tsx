import { getAllSkills } from '../../lib/api/skills'
import { SkillCard } from './SkillCard'

export async function SkillsGrid() {
  const skills = await getAllSkills()
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
} 