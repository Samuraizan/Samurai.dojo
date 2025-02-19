/**
 * Dashboard Page (/dashboard)
 * 
 * Main dashboard interface accessed through the OGSenpai link.
 * Currently displays a minimal header with potential for future expansion.
 */

'use client'

import { useState } from 'react'
import ChatPopup from '../components/chat/ChatPopup'

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Command Center Text */}
      <div className="absolute top-6 left-6">
        <h1 className="text-xl font-mono font-bold tracking-wider">COMMAND CENTER</h1>
      </div>

      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-transform transform hover:scale-105 font-mono"
          type="button"
          aria-label="Open chat"
        >
          💬
        </button>
      </div>

      {/* Chat Popup */}
      <ChatPopup 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
} 