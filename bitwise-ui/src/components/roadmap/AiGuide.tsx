import { useEffect } from 'react'
import introJs from 'intro.js'
import 'intro.js/introjs.css'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'

export function AiGuide() {
  useEffect(() => {
    const seen = localStorage.getItem('bitwise-roadmap-tour') === 'true'

    // A small delay allows the UI to render completely before the tour starts
    if (!seen) {
      const timer = setTimeout(() => {
        startTour()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const startTour = () => {
    const intro = introJs()
    intro.setOptions({
      steps: [
        {
          element: '#adaptive-practice-card',
          intro: 'Ready to test your skills? Start an Adaptive Practice assessment here to see what topics you need to work on!',
          position: 'right',
        },
        {
          element: '#analytics-card',
          intro: 'Keep an eye on your progress! This card shows your overall mastery and focus areas.',
          position: 'left',
        },
        {
          element: '#lessons-filter',
          intro: 'Use these filters to easily find lessons you haven\'t started, are currently working on, or have already completed.',
          position: 'bottom',
        },
        {
          element: '#lesson-list',
          intro: 'Here are your lessons. Note: You must complete them in order. The next lesson will unlock as soon as you complete the previous one!',
          position: 'top',
        },
      ],
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: false,
      keyboardNavigation: true,
    })

    intro.oncomplete(() => {
      localStorage.setItem('bitwise-roadmap-tour', 'true')
    })
    
    intro.onexit(() => {
      localStorage.setItem('bitwise-roadmap-tour', 'true')
    })

    intro.start()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
      onClick={startTour}
    >
      <HelpCircle className="w-4 h-4" />
      Take a Tour
    </Button>
  )
}
