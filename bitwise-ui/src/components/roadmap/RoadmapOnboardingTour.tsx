import { useEffect, useCallback, useState } from 'react'
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const startTour = useCallback(() => {
    if (!isRoadmapPage) return

    const timer = setTimeout(() => {
      const intro = introJs()

      const desktopSteps = [
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

      const mobileSteps = [
        {
          title: 'Your Learning Roadmap',
          intro: makeStepHtml('Welcome to the core of Bitwise! Here is a quick overview of your learning journey.', true),
        },
        {
          title: 'Adaptive AI Practice',
          intro: makeStepHtml('Once you complete lessons, you can take <strong>AI-powered adaptive assessments</strong> that adjust to your skill level.', true),
        },
        {
          title: 'Progress & Analytics',
          intro: makeStepHtml('Your mastery across different topics will be <strong>visualized</strong> as you progress through lessons.', true),
        },
        {
          title: 'Sequential Lessons',
          intro: makeStepHtml('Lessons are unlocked sequentially. Complete a lesson 100% to unlock the next one. Scroll down and tap <strong>Start</strong> on Lesson 1 to begin!', true),
        },
      ]

      const stepsToUse = isMobile ? mobileSteps : desktopSteps

      // Filter out elements that don't exist in the DOM right now
      const validSteps = stepsToUse.filter(
        (step) => !(step as any).element || document.querySelector((step as any).element) !== null
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
        scrollToElement: !isMobile,
        scrollPadding: 80,
        disableInteraction: false,
        overlayOpacity: 0.8,
        autoPosition: true,
        positionPrecedence: ['bottom', 'top', 'right', 'left'],
        ...(isMobile && { tooltipPosition: 'floating' }),
      } as any)

      // Hide the BitBot floating button while tour is active (prevents overlap on mobile)
      const botTrigger = document.getElementById('global-ai-bot-trigger')
      const botContainer = botTrigger?.closest('.fixed') as HTMLElement | null
      if (botContainer) botContainer.style.display = 'none'

      const restoreBotButton = () => {
        if (botContainer) botContainer.style.display = ''
      }

      // Dynamically reposition BitBot to face the highlighted element
      const updateBitbotPosition = () => {
        requestAnimationFrame(() => {
          const tooltip = document.querySelector('.introjs-tooltip') as HTMLElement
          if (!tooltip) return

          const arrow = tooltip.querySelector('.introjs-arrow') as HTMLElement
          let pos = 'floating'

          if (arrow) {
            const arrowClasses = arrow.className
            const arrowDisplay = window.getComputedStyle(arrow).display
            if (arrowDisplay !== 'none') {
              if (arrowClasses.includes('top')) pos = 'top'
              else if (arrowClasses.includes('bottom')) pos = 'bottom'
              else if (arrowClasses.includes('left')) pos = 'left'
              else if (arrowClasses.includes('right')) pos = 'right'
            }
          }

          tooltip.setAttribute('data-bitbot-pos', pos)
        })
      }

      intro.onafterchange(updateBitbotPosition)

      intro.oncomplete(() => {
        localStorage.setItem(storageKey, 'true')
        restoreBotButton()
      })

      intro.onexit(() => {
        localStorage.setItem(storageKey, 'true')
        restoreBotButton()
      })

      intro.start()
      // Set initial position for the first step
      setTimeout(updateBitbotPosition, 150)
    }, 1000)

    return () => {
      clearTimeout(timer)
      try {
        introJs().exit()
      } catch (e) {}
    }
  }, [isRoadmapPage, storageKey, isMobile])

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
