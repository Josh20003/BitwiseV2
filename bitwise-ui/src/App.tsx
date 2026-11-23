import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from '@/contexts/AuthContext'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors />
        <RouterProvider router={router} />
        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools router={router} position="bottom-right" />
            <ReactQueryDevtools />
          </>
        )}
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
