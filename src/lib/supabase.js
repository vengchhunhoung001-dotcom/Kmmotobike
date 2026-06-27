import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vlettaxewktmnubsmkbv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXR0YXhld2t0bW51YnNta2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1ODA4NzgsImV4cCI6MjA5NzE1Njg3OH0.GVolWyDGImO23XLVeIHuM9A-lNNvUZ-NCF43Eo6CxvM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)