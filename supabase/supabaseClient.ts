'use client'
import { createClient } from '@supabase/supabase-js'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_KEY as string | undefined

if (!supabase_url || !supabase_key) {
  throw new Error('Missing Supabase environment variables.')
}

export const supabase = createClient(supabase_url, supabase_key)
