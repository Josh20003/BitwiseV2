import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from '@tanstack/react-router'
import logoArrow from '@/assets/icons/outline-logo.svg'
import { useSignInWithGoogle, useSignUp, useResendVerification } from '@/hooks/useAuthQueries'
import { authService } from '@/services/auth.service'
import { FcGoogle } from 'react-icons/fc'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { supabase } from '@/utils/supabase'

const SignUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const signUpMutation = useSignUp()
  const resendVerificationMutation = useResendVerification()
  const signInWithGoogleMutation = useSignInWithGoogle()
  const navigate = useNavigate()

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [cooldown, setCooldown] = useState<number>(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 30-second cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Check verification status periodically and on tab focus
  useEffect(() => {
    if (!submittedEmail || isConfirmed) return

    let isMounted = true
    const checkStatus = async () => {
      try {
        const confirmed = await authService.checkEmailConfirmed(submittedEmail)
        if (confirmed && isMounted) {
          setIsConfirmed(true)
          toast.success('Email confirmed! Your account is active.')
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
  }, [submittedEmail, isConfirmed])

  // Listen to Supabase auth state change (e.g. user confirmed email in another tab)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setIsConfirmed(true)
        toast.success('Email confirmed! Welcome to Bitwise.')
        navigate({ to: '/' })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  })

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    signUpMutation.mutate({
      email: data.email,
      username: data.username,
      password: data.password,
    }, {
      onSuccess: (res) => {
        if (res.session) {
          navigate({ to: '/' })
        } else {
          setSubmittedEmail(data.email)
          setIsConfirmed(false)
          setCooldown(30)
        }
      }
    })
  }

  const handleResend = () => {
    if (!submittedEmail || cooldown > 0 || resendVerificationMutation.isPending) return
    resendVerificationMutation.mutate(submittedEmail, {
      onSuccess: () => {
        setCooldown(30)
      }
    })
  }

  if (submittedEmail) {
    if (isConfirmed) {
      return (
        <div className={cn('flex flex-col gap-6 text-center animate-in fade-in zoom-in-95 duration-300', className)} {...props}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2">
              <CheckCircle2 className="size-8 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Email Confirmed!</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your email <span className="font-semibold text-foreground">{submittedEmail}</span> has been verified. Your account is now active!
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-xs text-emerald-500 text-left flex items-start gap-2.5">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>Verification complete. You can now log in to access your Bitwise roadmap and lessons.</span>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="bluez"
              size="lg"
              type="button"
              onClick={() => navigate({ to: '/login' })}
              className="w-full"
            >
              Log in to your account
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className={cn('flex flex-col gap-6 text-center', className)} {...props}>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-2">
            <Mail className="size-7" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            We sent a verification link to{' '}
            <span className="font-semibold text-foreground">{submittedEmail}</span>.
            Please verify your email to activate your account.
          </p>
        </div>

        <div className="bg-muted/50 border rounded-lg p-4 text-xs text-muted-foreground text-left flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Click the verification link sent to your inbox.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="size-4 shrink-0 font-bold text-center leading-none text-muted-foreground">•</span>
            <span>If you don&apos;t see it within a minute, check your Spam or Junk folder.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="bluez"
            size="lg"
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resendVerificationMutation.isPending}
            className="w-full"
          >
            {resendVerificationMutation.isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="size-4 animate-spin" />
                Resending...
              </span>
            ) : cooldown > 0 ? (
              `Resend email (${cooldown}s)`
            ) : (
              'Resend verification email'
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setSubmittedEmail(null)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Use a different email
          </Button>
        </div>

        <div className="text-center text-sm border-t pt-4">
          Already confirmed?{' '}
          <Link to="/login" className="underline underline-offset-4">
            <Button variant="link" className="p-0">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    )
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
            <p className="text-3xl font-bold">Welcome to bitwise!</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-blue-500/10 text-blue-500 text-sm p-3 rounded-md flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <p>
                An email confirmation will be sent to your inbox after signing up. 
                Please verify your account to continue.
              </p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                inputMode="email"
                {...register('email')}
                disabled={signUpMutation.isPending}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                autoComplete="username"
                {...register('username')}
                disabled={signUpMutation.isPending}
              />
              {errors.username && (
                <span className="text-red-500 text-sm">
                  {errors.username.message}
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
                  autoComplete="new-password"
                  {...register('password')}
                  disabled={signUpMutation.isPending}
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
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  disabled={signUpMutation.isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <Button
              variant={'bluez'}
              size={'lg'}
              type="submit"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? (
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
                  Signing Up...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>
            <Button
              variant={'default'}
              size={'lg'}
              type="button"
              onClick={() => signInWithGoogleMutation.mutate()}
              disabled={signUpMutation.isPending}
            >
              <FcGoogle className="mr-2 z-10" />
              Sign up with Google
            </Button>
          </div>
        </div>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="underline underline-offset-4">
          <Button variant={'link'} className="p-0">
            Log in Instead
          </Button>
        </Link>
      </div>
    </div>
  )
}
