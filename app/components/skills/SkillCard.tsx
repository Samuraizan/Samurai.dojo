import type { Skill } from '../../lib/types/skill'
import { getSkillLevelColor } from '../../lib/types/skill'
import { useState } from 'react'

const NEURAL_NODES = [
  { id: 'node-1', delay: 2 },
  { id: 'node-2', delay: 3 },
  { id: 'node-3', delay: 4 }
]

export const SkillCard = ({ skill }: { skill: Skill }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const levelColor = getSkillLevelColor(skill.level)
  const progressPercent = (skill.currentPoints / skill.requiredPoints) * 100

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <span className="text-4xl animate-pulse">{skill.icon}</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          </div>
          <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-gradient-to-r ${levelColor} text-white transform transition-transform duration-300 hover:scale-105`}>
            {skill.level}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {skill.name}
          </h3>
          <p className={`text-sm text-gray-600 dark:text-gray-300 transition-all duration-300 ${
            isExpanded ? 'line-clamp-none' : 'line-clamp-2'
          }`}>
            {skill.description}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Mastery Progress</span>
            <span className="font-mono">{skill.currentPoints}/{skill.requiredPoints} points</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div
              className={`h-full bg-gradient-to-r ${levelColor} transition-all duration-1000 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
          Active Learning in Progress
        </div>
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {NEURAL_NODES.map(node => (
          <div
            key={node.id}
            className="absolute w-16 h-16 border border-blue-500/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${node.delay}s infinite`
            }}
          />
        ))}
      </div>
    </div>
  )
} 