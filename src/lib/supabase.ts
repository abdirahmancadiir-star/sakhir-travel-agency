import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
})
