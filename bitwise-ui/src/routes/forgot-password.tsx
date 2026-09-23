import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@tanstack/react-router'
import logoArrow from '@/assets/icons/outline-logo.svg'
import RightLanding001 from '@/assets/bg-icon/right_landing001.svg'
import LeftLanding001 from '@/assets/bg-icon/left_landing001.svg'
import { useResetPassword } from '@/hooks/useAuthQueries'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordRoute,
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

function ForgotPasswordRoute() {
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
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const resetPasswordMutation = useResetPassword()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    toast.info('Sending reset link...')
    resetPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        setIsSuccess(true)
      },
    })
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
            <p className="text-3xl font-bold">Reset Password</p>
          </div>
          
          {isSuccess ? (
            <div className="bg-emerald-500/10 text-emerald-500 text-sm p-4 rounded-md text-center">
              <p className="mb-4">Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
              <Link to="/login">
                <Button variant="outline" className="w-full">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  inputMode="email"
                  {...register('email')}
                  disabled={resetPasswordMutation.isPending}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <Button
                variant={'bluez'}
                size={'lg'}
                type="submit"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
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
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          )}
        </div>
      </form>

      {!isSuccess && (
        <div className="text-center text-sm">
          Remember your password?{' '}
          <Link to="/login" className="underline underline-offset-4">
            <Button variant={'link'} className="p-0">
              Log in
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
