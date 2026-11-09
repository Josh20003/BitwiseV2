import { useEffect, useState } from 'react'
import { type Session, type User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'
import { authService } from '../services/auth.service'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let locallySignedOut = false
    let active = true
    const clearLocalSession = () => {
      locallySignedOut = true
      setSession(null)
      setUser(null)
      setLoading(false)
    }
    window.addEventListener('bitwise:signed-out', clearLocalSession)
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (active && !locallySignedOut) {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (locallySignedOut && session && _event !== 'SIGNED_IN') return
      if (_event === 'SIGNED_IN') locallySignedOut = false
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
      window.removeEventListener('bitwise:signed-out', clearLocalSession)
    }
  }, [])

  const signOut = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    session,
    user,
    loading,
    signOut,
    isAuthenticated: !!session
  }
}
