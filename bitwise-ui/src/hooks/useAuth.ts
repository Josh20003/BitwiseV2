import { useEffect, useState } from 'react'
import { type Session, type User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'
import { authService } from '../services/auth.service'
import { clearUserSessionData } from '../queryClient'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let currentUserId: string | null = null

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        currentUserId = session?.user?.id ?? null
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUserId = session?.user?.id ?? null
      if (event === 'SIGNED_OUT' || (currentUserId && newUserId !== currentUserId)) {
        clearUserSessionData()
      }
      currentUserId = newUserId
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      clearUserSessionData()
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
