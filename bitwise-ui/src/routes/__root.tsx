import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import HomeHeader from '@/components/HomeHeader'
import GlobalAiBot from '@/components/GlobalAiBot'
import { GlobalOnboardingTour } from '@/components/GlobalOnboardingTour'

function RootComponent() {
  const location = useLocation()
  const isLesson = location.pathname.startsWith('/lesson')
  const isAuth =
    location.pathname === '/login' || location.pathname === '/signup'
  return (
    <>
      {!isLesson && <HomeHeader />}
      <main>
        <Outlet />
      </main>
      {/* Global AI guides — hidden on auth pages */}
      {!isAuth && (
        <>
          <GlobalOnboardingTour />
          <GlobalAiBot />
        </>
      )}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
