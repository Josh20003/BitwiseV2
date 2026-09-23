import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@tanstack/react-router'
import logoArrow from '@/assets/icons/outline-logo.svg'
import RightLanding001 from '@/assets/bg-icon/right_landing001.svg'
import LeftLanding001 from '@/assets/bg-icon/left_landing001.svg'
import { useUpdatePassword } from '@/hooks/useAuthQueries'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { supabase } from '@/utils/supabase'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordRoute,
})

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function ResetPasswordRoute() {
  return (
    <div className="relative bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <img
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable="false"
        src={RightLanding001}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none hidden md:flex absolute h-full bottom-0 md:bottom-auto right-0 z-0"
      />
      <img
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable="false"
        src={LeftLanding001}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none hidden md:flex absolute h-full left-0 z-0"
      />
      <div className="relative z-10 w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  )
}

function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const updatePasswordMutation = useUpdatePassword()
  const navigate = useNavigate()
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Invalid or expired reset link. Please try again.')
        navigate({ to: '/forgot-password' })
      } else {
        setCheckingSession(false)
      }
    })
  }, [navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    updatePasswordMutation.mutate(data.password, {
      onSuccess: async () => {
        await authService.signOut()
        navigate({ to: '/login' })
      },
    })
  }

  if (checkingSession) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/login"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-md mb-4">
                <img src={logoArrow} alt="bitwise logo" />
              </div>
              <span className="sr-only">Bitwise Inc,</span>
            </Link>
            <p className="text-3xl font-bold">New Password</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password')}
                disabled={updatePasswordMutation.isPending}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirmPassword')}
                disabled={updatePasswordMutation.isPending}
              />
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
              disabled={updatePasswordMutation.isPending}
            >
              {updatePasswordMutation.isPending ? (
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
                  Updating...
                </span>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
