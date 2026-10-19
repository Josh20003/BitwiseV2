import { useMemo } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface LessonProgressItem {
  lessonId: number
  progress: number
  status: string
  masteryScore?: number | null
}

interface LessonMasteryRadarProps {
  analytics: {
    skillsByLesson?: Array<{
      lessonId: number
      lessonTitle: string
      skills: Array<{
        topicId?: number
        topicTitle?: string
        mastery: number
        attempts?: number
      }>
    }>
  } | null
  lessonProgress?: LessonProgressItem[]
  compact?: boolean
}

const lessonShortNames: Record<number, string> = {
  1: 'Intro',     // Introduction to Number Systems
  2: 'Types',     // Types of Number Systems
  3: 'Convert',   // Conversion of Number Systems
  4: 'Arith',     // Binary Arithmetic
  5: 'Compl',     // Complements
  6: 'Sign',      // Signed and Unsigned Numbers
  7: 'BCD',       // Binary Codes (BCD & ASCII)
  8: 'Boolean',   // Intro to Boolean Algebra
  9: 'Gates',     // Logic Gates
  10: 'Truth',    // Truth Tables
  11: 'Simplify', // Simplification & K-Maps
}

const chartConfig = {
  mastery: {
    label: 'Mastery(%)',
  },
} satisfies ChartConfig

export function LessonMasteryRadar({ analytics, lessonProgress = [] }: LessonMasteryRadarProps) {
  // Prepare data for radar chart - all 11 lessons
  // Mastery progresses ONLY from quizzes taken in Adaptive AI Practice
  const radarData = useMemo(() => {
    const lessonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    return lessonIds.map((lessonId) => {
      const shortName = lessonShortNames[lessonId] || `L${lessonId}`

      // Check if UserLesson has assessment-based masteryScore from adaptive practice
      const progressData = lessonProgress.find((p) => p.lessonId === lessonId)
      if (progressData?.masteryScore != null) {
        return {
          lesson: shortName,
          mastery: Math.round(progressData.masteryScore * 100),
        }
      }

      // Check assessment skills data from adaptive analytics
      const lessonData = analytics?.skillsByLesson?.find(
        (l) => l.lessonId === lessonId
      )

      if (lessonData?.skills?.length) {
        const attemptedSkills = lessonData.skills.filter(
          (s) => (s.attempts ?? 0) > 0
        )
        // Only show mastery if user has actually attempted questions for this lesson
        if (attemptedSkills.length > 0) {
          const totalMastery = attemptedSkills.reduce((sum, s) => sum + s.mastery, 0)
          const mastery = totalMastery / lessonData.skills.length
          return {
            lesson: shortName,
            mastery: Math.round(mastery * 100),
          }
        }
      }

      // If no adaptive practice quizzes have been taken for this lesson, mastery is strictly 0%
      return {
        lesson: shortName,
        mastery: 0,
      }
    })
  }, [analytics, lessonProgress])


  return (
    <div className="w-full h-[240px] relative">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <defs>
              <radialGradient id="layer1">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.05" />
              </radialGradient>
              <radialGradient id="layer2">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.05" />
              </radialGradient>
              <radialGradient id="layer3">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient id="layer4">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.10" />
              </radialGradient>
              <radialGradient id="layer5">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.12" />
              </radialGradient>
            </defs>
            
            {/* Circular background fills */}
            <circle cx="50%" cy="50%" r="40%" fill="url(#layer5)" />
            <circle cx="50%" cy="50%" r="32%" fill="url(#layer4)" />
            <circle cx="50%" cy="50%" r="24%" fill="url(#layer3)" />
            <circle cx="50%" cy="50%" r="16%" fill="url(#layer2)" />
            <circle cx="50%" cy="50%" r="8%" fill="url(#layer1)" />
            
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            
     
            <PolarGrid
              gridType="circle"
            stroke="#0000FF"
              strokeOpacity={0.1}
            />
            <PolarAngleAxis 
              dataKey="lesson"
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 400}}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              stroke="#8b5cf6"
              strokeOpacity={0.3}
            />
  
            <Radar
              dataKey="mastery"
              fill="#8b5cf6"
              fillOpacity={0.5}
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}