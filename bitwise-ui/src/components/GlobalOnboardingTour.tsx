import { useEffect, useCallback, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import introJs from 'intro.js'
import 'intro.js/introjs.css'
import '@/tools/simulator/components/introjs.css'
import { useAuth } from '@/hooks/useAuth'
import rightPointSvg from '@/assets/bitbot/right-point.svg?url'

const getTourStorageKey = (userId?: string) => `bitwise-homepage-tour-seen-${userId || 'guest'}`

/**
 * GlobalOnboardingTour – auto-starts for first-time visitors on the homepage.
 * Detects desktop vs mobile and shows appropriate steps.
 */
export function GlobalOnboardingTour() {
  const location = useLocation()
  const isHomepage = location.pathname === '/'
  const [isMobile, setIsMobile] = useState(false)
  const { user, loading } = useAuth()
  const storageKey = getTourStorageKey(user?.id)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const startTour = useCallback(() => {
    if (!isHomepage) return

    const timer = setTimeout(() => {
      const intro = introJs()

      // Desktop steps target nav links; mobile steps are all floating (no element)
      const desktopSteps = [
        {
          title: 'Welcome to Bitwise!',
          intro: makeStepHtml('Let me show you around so you can get started quickly.', true),
        },
        {
          element: '#nav-learn',
          title: 'Start Learning',
          intro: makeStepHtml('Click <strong>Learn</strong> to access your roadmap of lessons. This is the best place to start!'),
          position: 'bottom' as const,
        },
        {
          element: '#nav-calculator',
          title: 'Boolean Calculator',
          intro: makeStepHtml('Use the <strong>Calculator</strong> to simplify Boolean expressions, generate truth tables, and evaluate logic.'),
          position: 'bottom' as const,
        },
        {
          element: '#nav-converter',
          title: 'Number Converter',
          intro: makeStepHtml('Convert numbers between <strong>Binary, Octal, Decimal, and Hex</strong> systems instantly.'),
          position: 'bottom' as const,
        },
        {
          element: '#nav-karnaugh',
          title: 'Karnaugh Maps',
          intro: makeStepHtml('Visualize how <strong>Karnaugh Maps</strong> simplify Boolean expressions — a must-know tool!'),
          position: 'bottom' as const,
        },
        {
          element: '#nav-digital',
          title: 'Digital Circuit',
          intro: makeStepHtml('Design and analyze <strong>digital circuits</strong> with our interactive simulator.'),
          position: 'bottom' as const,
        },
        {
          title: 'BitBot Assistant',
          intro: makeStepHtml('See the <strong>purple circle</strong> at the bottom-right? That\'s BitBot — your AI assistant! Click it anytime for help.', true),
        },
        {
          title: 'You\'re all set!',
          intro: makeStepHtml('Start by clicking <strong>Learn</strong> to begin your first lesson. Have fun!', true),
        },
      ]

      const mobileSteps = [
        {
          title: 'Welcome to Bitwise!',
          intro: makeStepHtml('Let me give you a quick tour of what you can do here.', true),
        },
        {
          title: 'Explore Lessons',
          intro: makeStepHtml('Open the <strong>menu ☰</strong> at the top right to find <strong>Learn, Calculator, Converter, K-Maps</strong> and <strong>Digital Circuit</strong>.', true),
        },
        {
          title: 'Start Learning',
          intro: makeStepHtml('<strong>Learn</strong> opens your roadmap of Boolean algebra lessons — the best place to begin!', true),
        },
        {
          title: 'Tools at Your Fingertips',
          intro: makeStepHtml('Use the <strong>Calculator</strong> to simplify expressions, the <strong>Converter</strong> for number systems, and <strong>K-Maps</strong> to visualize simplification.', true),
        },
        {
          title: 'BitBot Assistant',
          intro: makeStepHtml('See the <strong>purple circle</strong> at the bottom-right? That\'s BitBot — your AI assistant! Tap it anytime for help.', true),
        },
        {
          title: 'You\'re all set!',
          intro: makeStepHtml('Open the menu and tap <strong>Learn</strong> to begin your first lesson. Have fun!', true),
        },
      ]

      intro.setOptions({
        steps: isMobile ? mobileSteps : desktopSteps,
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: false,
        exitOnEsc: true,
        nextLabel: 'Next',
        prevLabel: 'Back',
        doneLabel: 'Got it!',
        skipLabel: 'Skip',
        keyboardNavigation: true,
        scrollToElement: true,
        scrollPadding: 80,
        disableInteraction: false,
        overlayOpacity: 0.8,
        autoPosition: true,
        positionPrecedence: ['bottom', 'top', 'left', 'right'],
      } as any)

      intro.oncomplete(() => {
        localStorage.setItem(storageKey, 'true')
      })

      intro.onexit(() => {
        localStorage.setItem(storageKey, 'true')
      })

      intro.start()
    }, 1000)

    return () => {
      clearTimeout(timer)
      // The intro instance is returned by the timeout, but since we can't easily access it here,
      // we can just call introJs().exit() to forcefully close any active tours.
      try {
        introJs().exit()
      } catch (e) {
        // ignore
      }
    }
  }, [isHomepage, isMobile, storageKey])

  useEffect(() => {
    if (loading) return
    const alreadySeen = localStorage.getItem(storageKey) === 'true'
    if (!alreadySeen && isHomepage) {
      const cleanup = startTour()
      return cleanup
    }
  }, [isHomepage, startTour, storageKey, loading])

  return null
}

/** Helper to build consistent step HTML */
function makeStepHtml(description: string, centered = false): string {
  return `
    <img src="${rightPointSvg}" class="intro-bitbot-left" alt="Bitbot" />
    <div class="space-y-2">
      <p style="margin: 0; font-size: 13px; color: #c5cad3; line-height: 1.6; text-align: ${centered ? 'center' : 'left'};">${description.replace(/<strong>/g, '<strong style="color: #dac3ff;">')}</p>
    </div>
  `
}

/**
 * Resets the tour so it will auto-start again on next homepage visit.
 */
export function resetHomepageTour(userId?: string) {
  localStorage.removeItem(getTourStorageKey(userId))
}
