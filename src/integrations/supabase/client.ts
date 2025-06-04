
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmtfiuhvwgtpgaswowgu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdGZpdWh2d2d0cGdhc3dvd2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODQxNzYsImV4cCI6MjA2Mzk2MDE3Nn0.ZL7LX7SNkjXDZTPveDMEY9wZhmjZ2s7fp6YbWYOibBI'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
