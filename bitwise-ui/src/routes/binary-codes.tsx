import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/binary-codes')({
  beforeLoad: () => {
    throw redirect({ to: '/calculator' })
  },
  component: () => null,
})
