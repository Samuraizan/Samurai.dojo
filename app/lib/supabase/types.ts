export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          type: 'ai' | 'human' | 'quantum-ai'
          role: 'master' | 'subordinate'
          status: 'active' | 'inactive'
          description: string
          capabilities: string[]
          avatar_url: string | null
          config: Json
          owner_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          type: 'ai' | 'human' | 'quantum-ai'
          role: 'master' | 'subordinate'
          status?: 'active' | 'inactive'
          description: string
          capabilities?: string[]
          avatar_url?: string | null
          config?: Json
          owner_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          type?: 'ai' | 'human' | 'quantum-ai'
          role?: 'master' | 'subordinate'
          status?: 'active' | 'inactive'
          description?: string
          capabilities?: string[]
          avatar_url?: string | null
          config?: Json
          owner_id?: string | null
        }
      }
      chats: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          agent_id: string
          user_id: string
          title: string | null
          messages: Json[]
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          agent_id: string
          user_id: string
          title?: string | null
          messages?: Json[]
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          agent_id?: string
          user_id?: string
          title?: string | null
          messages?: Json[]
          metadata?: Json | null
        }
      }
      agent_tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          agent_id: string
          status: 'pending' | 'processing' | 'completed' | 'failed'
          type: string
          data: Json
          result: Json | null
          error: string | null
          priority: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          agent_id: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          type: string
          data: Json
          result?: Json | null
          error?: string | null
          priority?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          agent_id?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          type?: string
          data?: Json
          result?: Json | null
          error?: string | null
          priority?: number
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark'
          notifications_enabled: boolean
          preferred_agent_id: string | null
          settings: Json
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark'
          notifications_enabled?: boolean
          preferred_agent_id?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark'
          notifications_enabled?: boolean
          preferred_agent_id?: string | null
          settings?: Json
        }
      }
    }
    Views: {
      active_agents: {
        Row: {
          id: string
          name: string
          type: string
          role: string
          status: string
        }
      }
    }
    Functions: {
      get_agent_metrics: {
        Args: { agent_id: string }
        Returns: {
          total_tasks: number
          completed_tasks: number
          failed_tasks: number
          average_completion_time: number
        }
      }
    }
    Enums: {
      agent_type: 'ai' | 'human' | 'quantum-ai'
      agent_role: 'master' | 'subordinate'
      agent_status: 'active' | 'inactive'
      task_status: 'pending' | 'processing' | 'completed' | 'failed'
    }
  }
} 