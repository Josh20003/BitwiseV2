import { useEffect, useCallback } from 'react'
import { useLocation } from '@tanstack/react-router'
import introJs from 'intro.js'
import 'intro.js/introjs.css'
import '@/tools/simulator/components/introjs.css'
import { useAuth } from '@/hooks/useAuth'
import rightPointSvg from '@/assets/bitbot/right-point.svg?url'

const getRoadmapTourStorageKey = (userId?: string) => `bitwise-roadmap-tour-seen-${userId || 'guest'}`

export function RoadmapOnboardingTour() {
  const location = useLocation()
  const isRoadmapPage = location.pathname.includes('/roadmap')
  const { user, loading } = useAuth()
  const storageKey = getRoadmapTourStorageKey(user?.id)

  const startTour = useCallback(() => {
    if (!isRoadmapPage) return

    const timer = setTimeout(() => {
      const intro = introJs()

      const steps = [
        {
          title: 'Your Learning Roadmap',
          intro: makeStepHtml('Welcome to the core of Bitwise! Let me show you how to navigate your learning journey.', true),
        },
        {
          element: '#adaptive-practice-card',
          title: 'Adaptive AI Practice',
          intro: makeStepHtml('Once you complete lessons, you can take AI-powered adaptive assessments that adjust to your skill level.'),
          position: 'right' as const,
        },
        {
          element: '#analytics-card',
          title: 'Progress & Analytics',
          intro: makeStepHtml('Your mastery across different topics will be visualized here as you progress.'),
          position: 'left' as const,
        },
        {
          element: '#lessons-filter',
          title: 'Filter & View Modes',
          intro: makeStepHtml('Easily filter lessons by status and toggle between grid and list views.'),
          position: 'bottom' as const,
        },
        {
          element: '#lesson-card-1',
          title: 'Sequential Lessons',
          intro: makeStepHtml('Lessons are unlocked sequentially. Complete a lesson 100% to unlock the next one. Click <strong>Start</strong> on Lesson 1 to begin!'),
          position: 'auto' as const,
        },
      ]

      // Filter out elements that don't exist in the DOM right now
      const validSteps = steps.filter(
        (step) => !step.element || document.querySelector(step.element) !== null
      )

      intro.setOptions({
        steps: validSteps,
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
        positionPrecedence: ['bottom', 'top', 'right', 'left'],
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
      try {
        introJs().exit()
      } catch (e) {}
    }
  }, [isRoadmapPage, storageKey])

  useEffect(() => {
    if (loading) return
    const alreadySeen = localStorage.getItem(storageKey) === 'true'
    if (!alreadySeen && isRoadmapPage) {
      const cleanup = startTour()
      return cleanup
    }
  }, [isRoadmapPage, startTour, storageKey, loading])

  return null
}

function makeStepHtml(description: string, centered = false): string {
  return `
    <img src="${rightPointSvg}" class="intro-bitbot-left" alt="Bitbot" />
    <div class="space-y-2">
      <p style="margin: 0; font-size: 13px; color: #c5cad3; line-height: 1.6; text-align: ${centered ? 'center' : 'left'};">${description.replace(/<strong>/g, '<strong style="color: #dac3ff;">')}</p>
    </div>
  `
}
