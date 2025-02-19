import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Helper to get user skills with progress
export async function getUserSkills(userId: string) {
  const { data, error } = await supabase
    .from('user_skills')
    .select(`
      *,
      skill:skills(*)
    `)
    .eq('user_id', userId)
    .order('last_activity', { ascending: false })

  if (error) throw error
  return data
}

// Helper to update skill progress
export async function updateSkillProgress(userId: string, skillId: string, points: number) {
  const { data, error } = await supabase
    .from('user_skills')
    .upsert({
      user_id: userId,
      skill_id: skillId,
      current_points: points,
      last_activity: new Date().toISOString()
    })
    .select()

  if (error) throw error
  return data
} 