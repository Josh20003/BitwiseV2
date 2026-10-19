import { useState, useEffect } from 'react'
import { Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from '@tanstack/react-router'
import logoArrow from '@/assets/icons/outline-logo.svg'
import { useSignIn, useSignInWithGoogle, useResendVerification } from '@/hooks/useAuthQueries'
import { authService } from '@/services/auth.service'
import { supabase } from '@/utils/supabase'
import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const signInMutation = useSignIn()
  const logInWithGoogleMutation = useSignInWithGoogle()
  const resendVerificationMutation = useResendVerification()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // 30-second cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Listen for session established via email confirmation link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        toast.success('Email confirmed! Welcome back.')
        navigate({ to: '/' })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  // When email is unconfirmed, poll to check if user clicks confirmation link
  useEffect(() => {
    if (!unconfirmedEmail) return

    let isMounted = true
    const checkStatus = async () => {
      try {
        const confirmed = await authService.checkEmailConfirmed(unconfirmedEmail)
        if (confirmed && isMounted) {
          setUnconfirmedEmail(null)
          setEmailVerified(true)
          toast.success('Email confirmed! You can now log in.')
        }
      } catch {
        // ignore errors
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 3000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkStatus()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)

    return () => {
      isMounted = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleVisibility)
    }
  }, [unconfirmedEmail])

  useEffect(() => {
    if (signInMutation.isSuccess) {
      navigate({ to: '/' })
    }
  }, [signInMutation.isSuccess, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    setUnconfirmedEmail(null)
    setEmailVerified(false)
    signInMutation.mutate(
      { email: data.email, password: data.password },
      {
        onError: (err) => {
          if (
            err.message.toLowerCase().includes('not confirmed') ||
            err.message.toLowerCase().includes('verification link') ||
            err.message.toLowerCase().includes('check your inbox')
          ) {
            setUnconfirmedEmail(data.email)
          }
        },
      }
    )
  }

  const handleResend = () => {
    if (!unconfirmedEmail || cooldown > 0 || resendVerificationMutation.isPending) return
    resendVerificationMutation.mutate(unconfirmedEmail, {
      onSuccess: () => {
        setCooldown(30)
      },
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-md mb-4">
                <img src={logoArrow} alt="bitwise logo" />
              </div>
              <span className="sr-only">Bitwise Inc,</span>
            </a>
            <p className="text-3xl font-bold">Welcome back!</p>
          </div>
          <div className="flex flex-col gap-6">
            {emailVerified && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3.5 rounded-lg text-sm flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-500" />
                <div>
                  <p className="font-medium text-foreground">Email verified!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your email address has been verified. You can now log in below.
                  </p>
                </div>
              </div>
            )}
            {unconfirmedEmail && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-3.5 rounded-lg text-sm flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Email not verified yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your account requires email verification before logging in.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resendVerificationMutation.isPending}
                  className="w-full text-xs h-8 border-amber-500/30 hover:bg-amber-500/10"
                >
                  {resendVerificationMutation.isPending ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="size-3.5 animate-spin" />
                      Resending...
                    </span>
                  ) : cooldown > 0 ? (
                    `Resend verification email (${cooldown}s)`
                  ) : (
                    'Resend verification email'
                  )}
                </Button>
              </div>
            )}
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                inputMode="email"
                {...register('email')}
                disabled={signInMutation.isPending}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  disabled={signInMutation.isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button
              variant={'bluez'}
              size={'lg'}
              type="submit"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-background"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
            <Button
              variant={'default'}
              size={'lg'}
              type="button"
              onClick={() => logInWithGoogleMutation.mutate()}
              disabled={signInMutation.isPending}
            >
              <FcGoogle className="mr-2 z-10" />
              Log in with Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-center text-sm">
        Didn&apos;t have an account yet?{' '}
        <Link to="/signup" className="underline underline-offset-4">
          <Button variant={'link'} className="p-0">
            Sign up now
          </Button>
        </Link>
      </div>
    </div>
  )
}
