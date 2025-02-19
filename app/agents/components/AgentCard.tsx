'use client'

import { memo } from 'react'
import Link from 'next/link'
import type { Agent } from '@/lib/types'

const AgentCard = memo(function AgentCard({ id, name, status }: Partial<Agent>) {
  return (
    <Link 
      href={`/agents/${id}`} 
      className="p-6 border border-white/10 hover:border-white/20 transition-colors group"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-sm lowercase text-white/90 group-hover:text-white transition-colors">{name}</h2>
        <span className={`text-xs lowercase ${
          status === 'active' ? 'text-green-400/70' : 'text-gray-400/70'
        }`}>
          {status}
        </span>
      </div>
    </Link>
  )
})

export default AgentCard 