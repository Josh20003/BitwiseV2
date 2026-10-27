import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import HomeHeader from '@/components/HomeHeader'
import GlobalAiBot from '@/components/GlobalAiBot'
import { GlobalOnboardingTour } from '@/components/GlobalOnboardingTour'

function RootComponent() {
  const location = useLocation()

  useEffect(() => {
    // If a password recovery hash lands on any other page, redirect to /reset-password while preserving the hash
    const hash = window.location.hash || ''
    if (hash.includes('type=recovery') && location.pathname !== '/reset-password') {
      window.location.replace('/reset-password' + hash)
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && location.pathname !== '/reset-password') {
        const currentHash = window.location.hash || ''
        window.location.replace('/reset-password' + currentHash)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [location.pathname])

  const isLesson = location.pathname.startsWith('/lesson')
  const isAuth =
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/forgot-password' || 
    location.pathname === '/reset-password'
  return (
    <>
      {!isLesson && !isAuth && <HomeHeader />}
      <main>
        <Outlet />
      </main>
      {/* Global AI guides — hidden on auth pages */}
      {!isAuth && (
        <>
          <GlobalOnboardingTour />
          <GlobalAiBot currentPath={location.pathname} />
        </>
      )}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
