import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zgnpgsqpgahjwxvjeeio.supabase.co'
const supabaseAnonKey = 'ANON_KEY_GAAGA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
})
