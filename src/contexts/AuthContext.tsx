import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

type AuthUser = {
  id: string
  email: string | null
  full_name?: string | null
  role: 'customer' | 'admin' | 'super_admin' | 'agent'
} | null

interface AuthContextValue {
  user: AuthUser
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, full_name: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
})

async function loadProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: userId,
    email: null,
    full_name: data.full_name,
    role: (data.role as 'customer' | 'admin' | 'super_admin' | 'agent') || 'customer',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await loadProfile(session.user.id)
        setUser(profile ? { ...profile, email: session.user.email } : null)
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadProfile(session.user.id)
        setUser(profile ? { ...profile, email: session.user.email } : null)
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error && data.session?.user) {
      const profile = await loadProfile(data.session.user.id)
      setUser(profile ? { ...profile, email: data.session.user.email } : null)
    }

    return { error }
  }

  const signUp = async (email: string, password: string, full_name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (!error && data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name,
        role: 'customer',
      })

      if (profileError) {
        return { error: profileError }
      }

      const profile = await loadProfile(data.user.id)
      setUser(profile ? { ...profile, email: data.user.email } : null)
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
