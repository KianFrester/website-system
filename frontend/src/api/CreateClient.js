import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://tfmnymkoyrzdhtabwsxv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbW55bWtveXJ6ZGh0YWJ3c3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzU5MzksImV4cCI6MjA2MDI1MTkzOX0.Vzk5umkXNQxVOEli_epnGNUpAeNDV6p6-aHyqArzSxQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)