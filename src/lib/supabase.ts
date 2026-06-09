import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zgnpgsqpgahjwxvjeeio.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYWtlamxsd2N6YnNxdWhwd2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjQ5MTcsImV4cCI6MjA5NjYwMDkxN30.lcgRGvBqsdJ58I-70gM5Ke46o-YM4URjF2Udu9qHSdA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
})
