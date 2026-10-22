import { supabase } from '../utils/supabase'
import { apiService } from './api.service'

export interface AuthCredentials {
  email: string
  username?: string
  password?: string
}

export interface AuthResponse {
  user: any
  session: any
  message?: string
}

export interface BackendUser {
  id: string
  email: string
  metadata: any
  created_at: string
}

export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.'
  const message = error.message || String(error)
  const status = error.status || error.statusCode

  // Supabase / SMTP rate-limit errors
  if (
    status === 429 ||
    message.toLowerCase().includes('rate limit') ||
    message.toLowerCase().includes('over_email_send_rate_limit') ||
    error.code === 'over_email_send_rate_limit'
  ) {
    return 'Email rate limit reached. Please wait a few minutes before trying again.'
  }

  // Supabase 30-second anti-abuse cooldown
  if (message.includes('once every') || message.includes('security purposes')) {
    return 'For security, you can only request an email once every 30 seconds. Please wait before trying again.'
  }

  if (message.includes('Email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox or resend the confirmation link.'
  }

  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }

  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Please log in or reset your password.'
  }

  if (message.includes('Error sending confirmation email')) {
    return 'Could not send confirmation email. If using Resend test mode, emails can only be delivered to the verified account owner. To send to all users, verify a custom domain in your email provider.'
  }

  return message
}

export const authService = {
  async signUp(credentials: AuthCredentials): Promise<AuthResponse> {
    const redirectUrl = `${import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin}/login`
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password!,
      options: {
        data: { display_name: credentials.username },
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) throw new Error(formatAuthError(error))
    return { user: data.user, session: data.session }
  },

  async resendVerification(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin + '/',
      },
    })

    if (error) throw new Error(formatAuthError(error))
  },

  async checkEmailConfirmed(email: string): Promise<boolean> {
    try {
      const res = await apiService.get<{ email: string; confirmed: boolean }>(
        `/auth/status?email=${encodeURIComponent(email)}`,
        false
      )
      return !!res?.confirmed
    } catch {
      return false
    }
  },

  async signIn(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password!,
    })

    if (error) throw new Error(formatAuthError(error))
    return { user: data.user, session: data.session }
  },

  async signInWithOtp(email: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
      },
    })

    if (error) throw new Error(formatAuthError(error))
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)

    apiService.setAuthToken(null)
  },

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/',
      },
    })

    if (error) throw new Error(error.message)
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(formatAuthError(error))
  },

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(error.message)
  },

  async getProfile(): Promise<BackendUser> {
    try {
      return await apiService.get<BackendUser>('/auth/profile', true)
    } catch (error) {
      throw new Error(
        `Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  async verifyToken(): Promise<{ valid: boolean; user: BackendUser }> {
    try {
      return await apiService.post('/auth/verify', {}, true)
    } catch (error) {
      throw new Error(
        `Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      return await apiService.post<AuthResponse>('/auth/refresh', {}, true)
    } catch (error) {
      throw new Error(
        `Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  },

  async getCurrentSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    return session
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return user
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession()
      return !!session
    } catch {
      return false
    }
  },
}
