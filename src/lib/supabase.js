import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Custom storage adapter using js-cookie with 7 days expiration
const cookieStorage = {
  getItem: (key) => {
    return Cookies.get(key) || null
  },
  setItem: (key, value) => {
    Cookies.set(key, value, { expires: 7 })
  },
  removeItem: (key) => {
    Cookies.remove(key)
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
