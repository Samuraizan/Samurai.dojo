'use client'

import Link from 'next/link'

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold">AI Assistant</h1>
          <Link
            href="/dashboard"
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Messages will go here */}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4">
        <div className="container mx-auto max-w-4xl">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-white/5 text-white border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>
    </div>
  )
} 