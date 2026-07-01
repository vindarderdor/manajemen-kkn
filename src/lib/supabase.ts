import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Fallback to dummy URL/Key if environment variables are not set yet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
