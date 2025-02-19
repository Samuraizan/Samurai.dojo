import { memo, useState, useEffect, useRef } from 'react'
import { getChatThreads, createChatThread, deleteChatThread, updateChatThreadTitle } from '@/lib/services/chat-threads'
import type { Database } from '@/lib/supabase/types'

type ChatThread = Database['public']['Tables']['chats']['Row']

interface ChatThreadsProps {
  agentId: string
  currentThreadId: string | null
  onSelectThread: (threadId: string) => void
}

const ChatThreads = memo(function ChatThreads({ 
  agentId, 
  currentThreadId, 
  onSelectThread 
}: ChatThreadsProps) {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadThreads() {
      try {
        console.log('Loading threads for agent:', agentId)
        const data = await getChatThreads(agentId)
        console.log('Received threads:', data)
        setThreads(data)
      } catch (err) {
        console.error('Error loading threads:', err)
        setError(err instanceof Error ? err : new Error('Failed to load chat threads'))
      } finally {
        setLoading(false)
      }
    }
    loadThreads()
  }, [agentId])

  useEffect(() => {
    // Focus input when editing starts
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingId])

  const handleNewChat = async () => {
    try {
      console.log('Creating new chat for agent:', agentId)
      const newThread = await createChatThread(agentId)
      console.log('Created new thread:', newThread)
      setThreads(prev => [newThread, ...prev])
      onSelectThread(newThread.id)
    } catch (err) {
      console.error('Error creating new chat:', err)
      setError(err instanceof Error ? err : new Error('Failed to create new chat'))
    }
  }

  const handleDeleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      console.log('Deleting thread:', threadId)
      await deleteChatThread(threadId)
      setThreads(prev => prev.filter(thread => thread.id !== threadId))
      if (currentThreadId === threadId) {
        const nextThread = threads[0]
        if (nextThread) {
          onSelectThread(nextThread.id)
        }
      }
    } catch (err) {
      console.error('Error deleting thread:', err)
      setError(err instanceof Error ? err : new Error('Failed to delete chat'))
    }
  }

  const startEditing = (thread: ChatThread, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setEditingId(thread.id)
    setEditingTitle(thread.title || 'New Chat')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value)
  }

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    try {
      const updatedThread = await updateChatThreadTitle(editingId, editingTitle)
      setThreads(prev => prev.map(thread => 
        thread.id === editingId ? updatedThread : thread
      ))
      setEditingId(null)
    } catch (err) {
      console.error('Error updating thread title:', err)
      setError(err instanceof Error ? err : new Error('Failed to update chat title'))
    }
  }

  const handleKeyDown = (threadId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelectThread(threadId)
    }
  }

  if (loading) {
    return (
      <p className="p-4 text-white/50 text-sm" aria-live="polite">
        Loading chats...
      </p>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-400/70 text-sm" role="alert">
        <p>Error: {error.message}</p>
        <button 
          type="button"
          onClick={() => setError(null)}
          className="mt-2 text-xs text-white/50 hover:text-white"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        onClick={handleNewChat}
        className="m-4 p-2 border border-white/10 rounded text-sm text-white/70 hover:text-white hover:border-white/20 transition-colors"
      >
        New Chat
      </button>
      <nav className="flex-1 overflow-auto">
        <ul className="list-none m-0 p-0" aria-label="Chat threads">
          {threads.length === 0 ? (
            <li className="p-4 text-white/30 text-sm text-center">
              No chats yet. Click "New Chat" to start.
            </li>
          ) : (
            threads.map(thread => (
              <li
                key={thread.id}
                className={`group p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                  currentThreadId === thread.id ? 'bg-white/5' : ''
                }`}
                onClick={() => editingId !== thread.id && onSelectThread(thread.id)}
              >
                <div className="flex items-center justify-between">
                  {editingId === thread.id ? (
                    <form onSubmit={handleTitleSubmit} className="flex-1 mr-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleSubmit}
                        className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white/90 focus:outline-none focus:border-white/40"
                        aria-label="Edit chat title"
                      />
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => startEditing(thread, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          startEditing(thread, e)
                        }
                      }}
                      className="flex-1 text-left text-sm text-white/70 hover:text-white"
                      aria-label={`Edit title: ${thread.title || 'New Chat'}`}
                    >
                      {thread.title || 'New Chat'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteThread(thread.id, e)}
                    className="hidden group-hover:block text-xs text-white/30 hover:text-white/70 ml-2"
                    aria-label={`Delete chat ${thread.title || 'New Chat'}`}
                  >
                    Delete
                  </button>
                </div>
                <div className="text-xs text-white/30 mt-1">
                  {new Date(thread.created_at).toLocaleDateString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </nav>
    </div>
  )
})

export default ChatThreads 