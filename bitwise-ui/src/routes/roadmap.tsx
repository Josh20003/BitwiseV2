import { useEffect, useMemo, useState, useCallback } from 'react'
import { createFileRoute, useNavigate, Link, redirect } from '@tanstack/react-router'
import { supabase } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRoadmapData } from '@/hooks/useRoadmapData'
import { Brain, CheckCircle2, Target, LayoutGrid, List, BookOpen, TrendingUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog'

import bitboCongrats from '@/assets/bitbot/congrats.svg'
import introPhoto from '@/assets/photos/intro.png'
import logicGatesPhoto from '@/assets/photos/logic gates.png'
import truthTablesPhoto from '@/assets/photos/truth tables.png'
import simplificationPhoto from '@/assets/photos/simplification.png'
import numberSystemsPhoto from '@/assets/photos/intro number systems.png'
import typesNumberSystemsPhoto from '@/assets/photos/types number systems2.png'
import conversionPhoto from '@/assets/photos/conversion.png'
import binaryArithmeticPhoto from '@/assets/photos/binary arithmetic.png'
import complementsPhoto from '@/assets/photos/complements.png'
import signedUnsignedPhoto from '@/assets/photos/signed unsigned.png'
import binaryCodesPhoto from '@/assets/photos/binary codes.png'
import { LessonMasteryRadar } from '@/components/LessonMasteryRadar'
import { toast } from 'sonner'

// Define types for better TypeScript support
interface RoadmapTopic {
  id: string
  title: string
  description: string
}

interface Lesson {
  id: number
  title: string
  description: string
  details: string
  topics: RoadmapTopic[]
}

interface LessonTopicDisplay {
  id: number
  title: string
  description: string
  status: string
  timeSpent?: number
}

interface LessonProgress {
  lessonId: number
  status: string
  progress: number
  masteryScore?: number
}

interface TopicProgress {
  topicId: string | number
  status: string
  timeSpent: number
  topic?: {
    title: string
    description: string
  }
}

interface TopicMastery {
  topicId: string | number
  mastery: number
  attempts: number
  level: number
}

// Lessons with topics — IDs now match display order (1-7 Number Systems, 8-11 Boolean Algebra)
const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Introduction to Number Systems',
    description: 'Basics of radix systems, positional values, and digit representation.',
    details:
      'Number systems define how we represent quantities using symbols and positional values. Learn the foundations of binary, decimal, octal, and hexadecimal systems.',
    topics: [
      {
        id: '1-1',
        title: 'Binary',
        description: 'The base-2 number system used by all digital computers.',
      },
      {
        id: '1-2',
        title: 'Decimal',
        description: 'The base-10 system we use in everyday life.',
      },
      {
        id: '1-3',
        title: 'Octal',
        description: 'The base-8 system used in Unix permissions.',
      },
      {
        id: '1-4',
        title: 'Hexadecimal',
        description: 'The base-16 system used in programming and memory.',
      },
    ],
  },
  {
    id: 2,
    title: 'Types of Number Systems',
    description: 'Learn the relationships between number systems.',
    details:
      'Explore how binary, decimal, octal, and hexadecimal relate to each other through grouping patterns and direct conversion shortcuts.',
    topics: [
      {
        id: '2-1',
        title: 'Binary ↔ Decimal',
        description: 'The relationship between base-2 and base-10.',
      },
      {
        id: '2-2',
        title: 'Binary ↔ Hex',
        description: 'The 4-bit grouping connection between binary and hex.',
      },
      {
        id: '2-3',
        title: 'Digit Groupings',
        description: 'Nibbles, bytes, and words explained.',
      },
    ],
  },
  {
    id: 3,
    title: 'Conversion of Number Systems',
    description: 'Convert numbers manually and automatically.',
    details:
      'Master the techniques to convert between decimal, binary, hexadecimal, and octal using division, expansion, and regrouping methods.',
    topics: [
      {
        id: '3-1',
        title: 'Decimal to Binary',
        description: 'Division-remainder and subtraction methods.',
      },
      {
        id: '3-2',
        title: 'Binary to Decimal',
        description: 'Positional expansion and doubling methods.',
      },
      {
        id: '3-3',
        title: 'Hex Conversion',
        description: 'Convert between hex, binary, decimal, and octal.',
      },
    ],
  },
  {
    id: 4,
    title: 'Binary Arithmetic',
    description: 'Perform arithmetic operations using binary values.',
    details:
      'Master the four fundamental arithmetic operations in binary: addition, subtraction, multiplication, and division, including carry and borrow mechanics.',
    topics: [
      {
        id: '4-1',
        title: 'Binary Addition',
        description: 'Add binary numbers with carry rules.',
      },
      {
        id: '4-2',
        title: 'Subtraction',
        description: 'Subtract binary numbers with borrow.',
      },
      {
        id: '4-3',
        title: 'Multiplication',
        description: 'Shift-and-add multiplication method.',
      },
      {
        id: '4-4',
        title: 'Division',
        description: 'Binary long division step by step.',
      },
    ],
  },
  {
    id: 5,
    title: 'Complements',
    description: 'Understand signed binary transformations.',
    details:
      "Learn how computers represent negative numbers using 1's and 2's complement, and understand the bit inversion and cascading carry mechanics behind them.",
    topics: [
      {
        id: '5-1',
        title: "1's Complement",
        description: 'Invert all bits to represent negatives.',
      },
      {
        id: '5-2',
        title: "2's Complement",
        description: 'The standard signed number representation.',
      },
      {
        id: '5-3',
        title: 'Bit Inversion',
        description: 'The NOT operation foundation.',
      },
    ],
  },
  {
    id: 6,
    title: 'Signed and Unsigned Numbers',
    description: 'Interpret binary values in different contexts.',
    details:
      'Learn how the same binary pattern can represent different values depending on whether it is interpreted as signed or unsigned, and the role of the MSB.',
    topics: [
      {
        id: '6-1',
        title: 'MSB (Most Significant Bit)',
        description: 'The leftmost bit and its dual role.',
      },
      {
        id: '6-2',
        title: 'Signed Representation',
        description: 'Representing positive and negative values.',
      },
      {
        id: '6-3',
        title: 'Unsigned Representation',
        description: 'Non-negative values with wider range.',
      },
    ],
  },
  {
    id: 7,
    title: 'Binary Codes (BCD & ASCII)',
    description: 'Encode numbers and characters in binary.',
    details:
      'Learn how BCD encodes decimal digits and ASCII encodes text characters in binary, and compare their approaches side by side.',
    topics: [
      {
        id: '7-1',
        title: 'BCD Encoding',
        description: 'Represent each decimal digit with 4 bits.',
      },
      {
        id: '7-2',
        title: 'ASCII Conversion',
        description: 'Map characters to 7-bit binary codes.',
      },
      {
        id: '7-3',
        title: 'Character-to-Binary Translator',
        description: 'Convert text to binary and back.',
      },
    ],
  },
  {
    id: 8,
    title: 'Intro to Boolean Algebra',
    description: 'Basics, history, and importance in logic.',
    details:
      "Boolean Algebra deals with true/false values. It's key in computer science and circuit design.",
    topics: [
      {
        id: '8-1',
        title: 'What is Boolean Algebra?',
        description: 'Definition and origins.',
      },
      {
        id: '8-2',
        title: 'Boolean Values',
        description: 'True/False, 1/0, and their meaning.',
      },
      {
        id: '8-3',
        title: 'Applications',
        description: 'Where Boolean Algebra is used.',
      },
    ],
  },
  {
    id: 9,
    title: 'Logic Gates',
    description: 'Learn AND, OR, NOT, and more.',
    details:
      'Logic gates are digital circuit components that execute Boolean functions.',
    topics: [
      {
        id: '9-1',
        title: 'AND, OR, NOT',
        description: 'Basic gates and their symbols.',
      },
      {
        id: '9-2',
        title: 'NAND, NOR',
        description: 'Universal gates and their uses.',
      },
      {
        id: '9-3',
        title: 'XOR, XNOR',
        description: 'Exclusive gates and applications.',
      },
    ],
  },
  {
    id: 10,
    title: 'Truth Tables',
    description: 'Make and read truth tables.',
    details:
      'Truth tables show all possible input/output combinations for logical expressions.',
    topics: [
      {
        id: '10-1',
        title: 'Constructing Truth Tables',
        description: 'Step-by-step process.',
      },
      {
        id: '10-2',
        title: 'Reading Truth Tables',
        description: 'How to interpret results.',
      },
      {
        id: '10-3',
        title: 'Truth Tables for Gates',
        description: 'Examples for each gate.',
      },
    ],
  },
  {
    id: 11,
    title: 'Simplification',
    description: 'Reduce logic expressions efficiently.',
    details:
      'Simplifying logic reduces circuit complexity and improves performance.',
    topics: [
      {
        id: '11-1',
        title: 'Boolean Laws',
        description: 'Commutative, Associative, Distributive.',
      },
      {
        id: '11-2',
        title: 'Karnaugh Maps',
        description: 'Visual simplification method.',
      },
      {
        id: '11-3',
        title: 'Practical Examples',
        description: 'Simplifying real expressions.',
      },
    ],
  },
]

// Map lesson id -> photo (IDs now match display order)
const lessonImages: Record<number, string> = {
  1: numberSystemsPhoto,
  2: typesNumberSystemsPhoto,
  3: conversionPhoto,
  4: binaryArithmeticPhoto,
  5: complementsPhoto,
  6: signedUnsignedPhoto,
  7: binaryCodesPhoto,
  8: introPhoto,
  9: logicGatesPhoto,
  10: truthTablesPhoto,
  11: simplificationPhoto,
}

export const Route = createFileRoute('/roadmap')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: RouteComponent,
})

// Inspirational quotes from computer science pioneers
const csQuotes = [
  {
    text: 'The only way to learn a new programming language is by writing programs in it.',
    author: 'Dennis Ritchie',
  },
  {
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
  },
  {
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
  },
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
  },
  {
    text: 'Logic is the beginning of wisdom, not the end.',
    author: 'Leonard Nimoy',
  },
]



// interface LessonMasteryRadarProps {
//   analytics: {
//     skillsByLesson?: Array<{
//       lessonId: number
//       lessonTitle: string
//       skills: Array<{ mastery: number }>
//     }>
//   } | null
//   compact?: boolean
// }

// function LessonMasteryRadar({ analytics, compact = false }: LessonMasteryRadarProps) {
//   // Prepare data for radar chart - all 4 lessons
//   const radarData = useMemo(() => {
//     const lessons = [1, 2, 3, 4]
//     return lessons.map((lessonId) => {
//       const lessonData = analytics?.skillsByLesson?.find(
//         (l) => l.lessonId === lessonId
//       )
//       const mastery = lessonData?.skills?.length
//         ? lessonData.skills.reduce((sum, s) => sum + s.mastery, 0) /
//           lessonData.skills.length
//         : 0
//       return {
//         lesson: lessonShortNames[lessonId],
//         mastery: Math.round(mastery * 100),
//         fullMark: 100,
//       }
//     })
//   }, [analytics])

//   if (compact) {
//     return (
//       <div className="w-full h-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
//             <PolarGrid stroke="#e5e7eb" />
//             <PolarAngleAxis dataKey="lesson" tick={false} />
//             <Radar
//               name="Mastery"
//               dataKey="mastery"
//               stroke="#8b5cf6"
//               fill="#8b5cf6"
//               fillOpacity={0.5}
//             />
//           </RadarChart>
//         </ResponsiveContainer>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full h-[180px]">
//       <ResponsiveContainer width="100%" height="100%">
//         <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
//           <PolarGrid stroke="#e5e7eb" />
//           <PolarAngleAxis
//             dataKey="lesson"
//             tick={{ fill: '#6b7280', fontSize: 11 }}
//           />
//           <PolarRadiusAxis
//             angle={90}
//             domain={[0, 100]}
//             tick={{ fill: '#9ca3af', fontSize: 9 }}
//             tickCount={5}
//           />
//           <Radar
//             name="Mastery"
//             dataKey="mastery"
//             stroke="#8b5cf6"
//             fill="#8b5cf6"
//             fillOpacity={0.5}
//           />
//           <Tooltip
//             formatter={(value: number) => [`${value}%`, 'Mastery']}
//             contentStyle={{
//               backgroundColor: 'rgba(255, 255, 255, 0.95)',
//               border: '1px solid #e5e7eb',
//               borderRadius: '8px',
//               fontSize: '12px',
//             }}
//           />
//         </RadarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

function RouteComponent() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<string>('All Status')
  const [showLessonSelectModal, setShowLessonSelectModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthContext() || {}
  const ALLOW_ANON = import.meta.env.VITE_ALLOW_ANON_ASSESSMENT === 'true'
  const FALLBACK_USER_ID =
    import.meta.env.VITE_FALLBACK_USER_ID ??
    '5ed45890-4804-46fd-bfa1-5695515375ea'
  const effectiveUser = user ?? (ALLOW_ANON ? { id: FALLBACK_USER_ID } : null)

  const lessonIds = useMemo(() => lessons.map((lesson) => lesson.id), [])
  const {
    lessonProgress,
    topicsProgress,
    topicMastery,
    analytics,
    statistics,
    error: roadmapError,
  } = useRoadmapData(user?.id, lessonIds)

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const showQuote = () => {
      const randomQuote = csQuotes[Math.floor(Math.random() * csQuotes.length)]
      toast.custom(
        (t) => (
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4 flex items-start gap-4 max-w-md pointer-events-auto">
            <img
              src={bitboCongrats}
              alt="BitBot"
              className="w-12 h-12 shrink-0"
            />
            <div className="flex-1">
              <p className="font-bold text-amber-600 dark:text-amber-400 text-sm mb-1">
                BitBot's Travel Tip
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "{randomQuote.text}"
              </p>
              <p className="text-xs text-gray-500 mt-1">
                - {randomQuote.author}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
        ),
        { duration: 8000, position: 'bottom-right' }
      )
    }

    // Show one on mount after a delay
    const timer = setTimeout(showQuote, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (roadmapError) {
      toast.error(roadmapError)
    }
  }, [roadmapError])

  // Open lesson selection modal
  const handleOpenLessonSelect = () => {
    if (!effectiveUser) {
      toast.error('Please log in to start an assessment')
      return
    }
    setShowLessonSelectModal(true)
  }

  // Map lesson ID → quiz topic slug (same as in $lessonId.tsx)
  const lessonToQuizTopic: Record<number, string> = {
    1: 'number-systems',
    2: 'number-systems',
    3: 'number-systems',
    4: 'binary-arithmetic',
    5: 'complements',
    6: 'number-systems',
    7: 'number-systems',
    8: 'boolean-algebra',
    9: 'logic-gates',
    10: 'truth-tables',
    11: 'karnaugh-maps',
  }

  // Start lesson-specific practice — reuses the post-lesson quiz pipeline
  const handleStartLessonPractice = (lessonId: number) => {
    if (!effectiveUser) {
      toast.error('Please log in to start an assessment')
      return
    }
    const topic = lessonToQuizTopic[lessonId]
    if (!topic) {
      toast.error('No quiz available for this lesson yet')
      return
    }
    setShowLessonSelectModal(false)
    navigate({ to: '/quiz/$topic', params: { topic }, search: { lessonId } })
  }

  // Get topic mastery info for a specific lesson
  const getLessonTopicMastery = useCallback((lessonId: number) => {
    const lessonMasteryData = topicMastery[lessonId] as TopicMastery[] | undefined
    if (!lessonMasteryData || lessonMasteryData.length === 0) {
      return { topics: [], averageMastery: 0, hasData: false }
    }
    
    const averageMastery = lessonMasteryData.reduce((sum, t) => sum + t.mastery, 0) / lessonMasteryData.length
    return {
      topics: lessonMasteryData,
      averageMastery: Math.round(averageMastery * 100),
      hasData: true
    }
  }, [topicMastery])

  // Get difficulty label based on mastery
  const getDifficultyFromMastery = (mastery: number): { label: string; color: string } => {
    if (mastery < 0.4) return { label: 'Easy', color: 'text-green-600 bg-green-100' }
    if (mastery < 0.7) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' }
    return { label: 'Hard', color: 'text-red-600 bg-red-100' }
  }

  const getLessonStatus = useCallback(
    (lessonId: number) => {
      const progress = lessonProgress.find(
        (p: LessonProgress) => p.lessonId === lessonId
      )
      const isCompleted =
        progress?.status === 'completed' || (progress?.progress || 0) >= 1
      const isStarted = (progress?.progress || 0) > 0

      // Calculate mastery from adaptive practice for this lesson
      const lessonMastery = topicMastery[lessonId] as TopicMastery[] | undefined
      const masteryScore = lessonMastery?.length
        ? Math.round(
            (lessonMastery.reduce((sum, topic) => sum + topic.mastery, 0) /
              lessonMastery.length) *
              100
          )
        : progress?.masteryScore
          ? Math.round(progress.masteryScore * 100)
          : null

      return {
        status: isCompleted
          ? 'completed'
          : isStarted
            ? 'in-progress'
            : 'not-started',
        progress: progress?.progress !== undefined 
          ? Math.round(progress.progress > 1 ? progress.progress : progress.progress * 100)
          : 0,
        masteryScore,
        isLocked: false, // No locks - all lessons accessible
      }
    },
    [lessonProgress, topicMastery]
  )

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const { status } = getLessonStatus(lesson.id)
      if (statusFilter === 'All Status') return true
      if (statusFilter === 'Not Started') return status === 'not-started'
      if (statusFilter === 'In Progress') return status === 'in-progress'
      if (statusFilter === 'Completed') return status === 'completed'
      return true
    })
  }, [statusFilter, getLessonStatus])

  const getTopicsForLesson = (lesson: Lesson): LessonTopicDisplay[] => {
    const dynamicTopics = topicsProgress[lesson.id] as
      | TopicProgress[]
      | undefined
    if (dynamicTopics?.length) {
      return dynamicTopics.map((topic, index) => ({
        id:
          typeof topic.topicId === 'string'
            ? parseInt(topic.topicId)
            : topic.topicId,
        title:
          topic.topic?.title ||
          lesson.topics[index]?.title ||
          `Topic ${index + 1}`,
        description:
          topic.topic?.description || lesson.topics[index]?.description || '',
        status: topic.status || 'not-started',
        timeSpent: topic.timeSpent,
      }))
    }

    return lesson.topics.map((topic, index) => ({
      id: parseInt(topic.id.split('-')[1]) || index + 1,
      title: topic.title,
      description: topic.description,
      status: 'not-started',
      timeSpent: 0,
    }))
  }

  const toTopicIdParam = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'number') return value
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  const selectedLessonTopics = selectedLesson
    ? getTopicsForLesson(selectedLesson)
    : []
  // These analytics values are available for future use but currently not rendered
  const _recommendedDifficulty = analytics?.recommendedDifficulty ?? null
  const _focusTopics = analytics?.focusAreas?.slice(0, 2) ?? []
  const _totalAdaptiveAttempts =
    statistics?.totalAttempts ?? analytics?.totalAttempts ?? 0
  // Silence unused variable warnings - these will be used in upcoming features
  void _recommendedDifficulty
  void _focusTopics
  void _totalAdaptiveAttempts

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 mt-5">
        {/* Top Section: Adaptive & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adaptive Practice Card */}
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white relative overflow-hidden shadow-lg group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    <Brain className="w-3 h-3 mr-1" /> AI Powered
                  </Badge>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Adaptive AI Practice
                </h2>
                <p className="text-blue-100 max-w-md">
                  Master Boolean Algebra with personalized questions that adapt
                  to your skill level in real-time.
                </p>
              </div>

              <div className="mt-8 flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-blue-100">
                    10 Questions Per Lesson
                  </p>
                  <p className="font-semibold text-lg capitalize">
                    Topic-Specific Difficulty
                  </p>
                </div>
                <Button
                  onClick={handleOpenLessonSelect}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  Start Practice
                </Button>
              </div>
            </div>

            {/* Background Decorations */}
            <Brain className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Analytics Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <div className="flex gap-4">
              {/* Left Side - 1/2: Title and Focus Areas */}
              <div className="w-1/2 flex flex-col">
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="mb-2 border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400"
                  >
                    <Target className="w-3 h-3 mr-1" /> Insights
                  </Badge>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Progress & Analytics
                  </h2>
                </div>

                {/* Focus Areas */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Focus Areas
                  </p>
                  <div className="space-y-1.5">
                    {(() => {
                      // Build topic list from ALL lessons with progress from multiple sources
                      const allTopicsList = lessons.flatMap(lesson =>
                        lesson.topics.map((topic, idx) => {
                          // 1. Check topic completion progress (from viewing/completing topics)
                          const lessonTopics = topicsProgress[lesson.id] as Array<{
                            topicId: string | number
                            status: string
                            topic?: { title: string }
                          }> | undefined
                          const topicProgress = lessonTopics?.find(
                            (t) => t.topicId === idx + 1 || String(t.topicId) === topic.id.split('-')[1]
                          )
                          const completionProgress = topicProgress?.status === 'completed' ? 1.0
                            : topicProgress?.status === 'viewed' ? 0.5
                            : 0

                          // 2. Check assessment mastery (from AI practice)
                          const lessonAnalytics = analytics?.skillsByLesson?.find(
                            (l) => l.lessonId === lesson.id
                          )
                          const skillData = lessonAnalytics?.skills?.find(
                            (s) => s.topicId === idx + 1 || String(s.topicId) === topic.id.split('-')[1]
                          )
                          const assessmentMastery = skillData?.mastery ?? 0

                          // Use the higher of the two
                          const effectiveProgress = Math.max(completionProgress, assessmentMastery)

                          return {
                            id: topic.id,
                            title: topic.title,
                            progress: effectiveProgress,
                            lessonId: lesson.id,
                          }
                        })
                      )

                      // Sort by lowest progress first (focus areas = weakest topics)
                      const sorted = [...allTopicsList].sort((a, b) => a.progress - b.progress)

                      const hasAnalyticsData = allTopicsList.some(t => t.progress > 0)

                      if (!hasAnalyticsData) {
                        return (
                          <div className="flex flex-col items-center justify-center py-4 px-3 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/30 dark:bg-gray-900/10 my-1">
                            <Brain className="w-6 h-6 text-purple-400 dark:text-purple-500 mb-2 animate-pulse" />
                            <p className="text-[10px] text-muted-foreground leading-normal font-medium max-w-[180px]">
                              No mastery data available yet. Start a practice assessment or complete lesson topics to see your focus areas!
                            </p>
                          </div>
                        )
                      }

                      return sorted.slice(0, 5).map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-600 dark:text-gray-400 truncate mr-2 font-medium">
                            {topic.title}
                          </span>
                          <span className={`font-semibold shrink-0 ${
                            topic.progress >= 0.7 ? 'text-green-600' :
                            topic.progress >= 0.4 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round(topic.progress * 100)}%
                          </span>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>

              {/* Right Side - 1/2: Radar Chart */}
              <div 
                className="w-3/5 cursor-pointer transition-transform hover:scale-105 relative group"
                onClick={() => setShowAnalyticsModal(true)}
                title="Click to view detailed analytics"
              >
                <LessonMasteryRadar analytics={analytics} lessonProgress={lessonProgress} />
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Click to view details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All Materials Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                All Lessons
              </h2>
              <Badge variant="secondary" className="rounded-md px-2.5">
                {filteredLessons.length}
              </Badge>
            </div>
          </div>

          {/* Controls: Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['All Status', 'Not Started', 'In Progress', 'Completed'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      statusFilter === status
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* View Toggle - Tab Style */}
            <div className="inline-flex h-9 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50'
                    : 'hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 ml-1 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-gray-50'
                    : 'hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lessons Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLessons.map((lesson) => {
                const { status, progress } = getLessonStatus(lesson.id)
                return (
                  <div
                    key={lesson.id}
                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
                  >
                    {/* Card Header / Image Placeholder */}
                    <div
                      className={`h-32 w-full relative overflow-hidden ${
                        status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : status === 'in-progress'
                            ? 'bg-blue-100 dark:bg-blue-900/20'
                            : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {/* Photo background */}
                      <img
                        src={lessonImages[lesson.id]}
                        alt={lesson.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/6 dark:bg-black/20" />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 dark:bg-black/50 backdrop-blur-sm"
                        >
                          {lesson.topics.length} Topics
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Lesson {lessons.findIndex(l => l.id === lesson.id) + 1}
                        </span>
                        {status === 'in-progress' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                        {lesson.description}
                      </p>

                      {/* Progress */}
                      <div className="space-y-3 mt-auto">
                        <div className="flex justify-between text-xs font-medium">
                          <span
                            className={
                              status === 'completed'
                                ? 'text-green-600'
                                : status === 'in-progress'
                                  ? 'text-blue-600'
                                  : 'text-gray-500'
                            }
                          >
                            {status === 'not-started'
                              ? 'Not Started'
                              : `${progress}% Complete`}
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />

                        <Button
                          onClick={() => setSelectedLesson(lesson)}
                          variant={
                            status === 'completed' ? 'outline' : 'default'
                          }
                          className="w-full mt-2"
                        >
                          {status === 'completed'
                            ? 'Review'
                            : status === 'in-progress'
                              ? 'Continue'
                              : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLessons.map((lesson) => {
                const { status, progress } = getLessonStatus(lesson.id)
                return (
                  <div
                    key={lesson.id}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-300 dark:hover:border-gray-700 transition-colors group"
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Status Icon */}
                      <div className="shrink-0 relative">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <img
                            src={lessonImages[lesson.id]}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {status === 'in-progress' && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Lesson {lessons.findIndex(l => l.id === lesson.id) + 1}
                          </span>
                          <span className="text-gray-300 dark:text-gray-700">
                            •
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {lesson.topics.length} Topics
                          </span>
                        </div>
                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Progress Section */}
                      <div className="shrink-0 w-32">
                        <div className="text-right mb-2">
                          <span
                            className={`text-xs font-medium ${
                              status === 'completed'
                                ? 'text-green-600 dark:text-green-400'
                                : status === 'in-progress'
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {status === 'not-started'
                              ? 'Not Started'
                              : `${progress}%`}
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0">
                        <Button
                          onClick={() => setSelectedLesson(lesson)}
                          variant={
                            status === 'completed' ? 'outline' : 'default'
                          }
                          size="sm"
                        >
                          {status === 'completed'
                            ? 'Review'
                            : status === 'in-progress'
                              ? 'Continue'
                              : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lesson Selection Modal for Practice */}
      <Dialog
        open={showLessonSelectModal}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setShowLessonSelectModal(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                <Brain className="w-3 h-3 mr-1" /> AI Powered
              </Badge>
              <Badge variant="outline" className="text-xs">
                10 Questions
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Choose a Lesson to Master
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Select a lesson to start a focused practice session. Questions will adapt to your mastery level for each topic.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson) => {
                const masteryInfo = getLessonTopicMastery(lesson.id)
                const lessonTopics = lesson.topics

                return (
                  <div
                    key={lesson.id}
                    className="relative border rounded-xl p-4 transition-all duration-200 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md cursor-pointer"
                    onClick={() => handleStartLessonPractice(lesson.id)}
                  >
                    {/* Lesson Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                        <img
                          src={lessonImages[lesson.id]}
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            LESSON {lessons.findIndex(l => l.id === lesson.id) + 1}
                          </span>
                          {masteryInfo.hasData && (
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                              {masteryInfo.averageMastery}% mastery
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {lesson.title}
                        </h3>
                      </div>
                    </div>

                    {/* Topics with Difficulty */}
                    <div className="space-y-2 mb-4">
                      {lessonTopics.map((topic, idx) => {
                        // Match by index position within the lesson's topics array
                        // Database topicIds are sequential: Lesson 1 = 1,2,3, Lesson 2 = 4,5,6, etc.
                        const dbTopicId = (lesson.id - 1) * 3 + idx + 1
                        const topicMasteryData = masteryInfo.topics.find(
                          (t) => t.topicId === dbTopicId || 
                                 String(t.topicId) === String(dbTopicId) ||
                                 t.topicId === parseInt(topic.id.split('-')[1])
                        )
                        // Default to 0 mastery (Easy) when no data, not 0.5 (Medium)
                        const mastery = topicMasteryData?.mastery ?? 0
                        const difficulty = getDifficultyFromMastery(mastery)

                        return (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-gray-400 text-xs w-4">{idx + 1}.</span>
                              <span className="text-gray-700 dark:text-gray-300 truncate">
                                {topic.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-gray-500">
                                {Math.round(mastery * 100)}%
                              </span>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${difficulty.color}`}>
                                {difficulty.label}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Start Button */}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartLessonPractice(lesson.id)
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice This Lesson
                    </Button>

                    {/* Question Distribution Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500">
                        <TrendingUp className="w-3 h-3" />
                        <span>3 questions per topic • Weakest topic gets +1 bonus</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Questions difficulty adapts to your topic mastery
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLessonSelectModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Details Dialog */}
      <Dialog
        open={!!selectedLesson}
        onOpenChange={(open: boolean) => !open && setSelectedLesson(null)}
      >
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0 gap-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          {/* Compact Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                Lesson {selectedLesson?.id}
              </span>
            </div>

            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {selectedLesson?.description}
            </DialogDescription>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-4 overflow-y-auto flex-1 custom-scrollbar">
            <div className="space-y-6">
              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {selectedLesson?.details}
              </p>

              {/* Topics List - Compact */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Curriculum
                </h4>

                <div className="space-y-1">
                  {selectedLessonTopics.map((topic, index) => {
                    const topicStatus = (
                      topicsProgress[selectedLesson?.id || 0] as
                        | TopicProgress[]
                        | undefined
                    )?.find((t) => t.topicId === topic.id)
                    const mastery = (
                      topicMastery[selectedLesson?.id || 0] as
                        | TopicMastery[]
                        | undefined
                    )?.find((m) => m.topicId === topic.id)
                    const isTopicCompleted =
                      topic.status === 'completed' ||
                      topicStatus?.status === 'completed'
                    const isTopicViewed =
                      isTopicCompleted ||
                      topic.status === 'viewed' ||
                      topicStatus?.status === 'viewed'
                    const masteryPercent = mastery
                      ? Math.round(mastery.mastery * 100)
                      : 0

                    return (
                      <Link
                        to="/lesson/$lessonId"
                        params={{
                          lessonId: selectedLesson
                            ? selectedLesson.id.toString()
                            : '1',
                        }}
                        search={{ topicId: toTopicIdParam(topic.id) }}
                        key={`${selectedLesson?.id}-${topic.id}`}
                        className="group flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
                      >
                        {/* Status Dot */}
                        <div className="shrink-0 flex items-center justify-center w-5 h-5">
                          {isTopicCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {topic.title}
                          </h5>
                        </div>

                        {/* Meta */}
                        <div className="shrink-0 flex items-center gap-2">
                          {masteryPercent > 0 && (
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-sm">
                              {masteryPercent}%
                            </span>
                          )}
                          {isTopicViewed && !isTopicCompleted && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* BitBot - Compact */}
              <div className="flex gap-3 items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <img
                  src={bitboCongrats}
                  alt="BitBot"
                  className="w-6 h-6 opacity-80 grayscale hover:grayscale-0 transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  "{!user ? 'Log in to track progress.' : 'Ready to start?'}"
                </p>
              </div>
            </div>
          </div>

          {/* Footer - Compact & Sticky */}
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLesson(null)}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 h-9"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!selectedLesson) return

                if (!user) {
                  navigate({ to: '/login' })
                  return
                }

                navigate({
                  to: '/lesson/$lessonId',
                  params: { lessonId: selectedLesson.id.toString() },
                  search: {
                    topicId: parseInt(
                      selectedLesson.topics[0].id.split('-')[1]
                    ),
                  },
                })
              }}
              className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 h-9 px-6"
            >
              Start Lesson
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Detail Modal */}
      <Dialog
        open={showAnalyticsModal}
        onOpenChange={(open: boolean) => !open && setShowAnalyticsModal(false)}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none">
                <Target className="w-3 h-3 mr-1" /> Mastery Analysis
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Lesson Mastery Overview
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Your progress and difficulty levels across all lessons
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Enlarged Radar Chart */}
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Overall Mastery Distribution
                </h3>
                <div className="bg-linear-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-purple-100 dark:border-purple-900/30">
                  <div className="w-full h-[400px]">
                    <LessonMasteryRadar analytics={analytics} lessonProgress={lessonProgress} />
                  </div>
                </div>
              </div>

              {/* Right: Lesson Details */}
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Lesson Breakdown
                </h3>
                <div className="space-y-3">
                  {lessons.map((lesson) => {
                    const masteryInfo = getLessonTopicMastery(lesson.id)
                    const lessonTopics = lesson.topics
                    const averageMastery = masteryInfo.averageMastery

                    return (
                      <div
                        key={lesson.id}
                        className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/50"
                      >
                        {/* Lesson Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">
                              LESSON {lesson.id}
                            </span>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {lesson.title}
                            </h4>
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {averageMastery}% avg
                          </span>
                        </div>

                        {/* Topics */}
                        <div className="space-y-2">
                          {lessonTopics.map((topic, idx) => {
                            const dbTopicId = (lesson.id - 1) * 3 + idx + 1
                            const topicMasteryData = masteryInfo.topics.find(
                              (t) => t.topicId === dbTopicId || 
                                     String(t.topicId) === String(dbTopicId) ||
                                     t.topicId === parseInt(topic.id.split('-')[1])
                            )
                            const mastery = topicMasteryData?.mastery ?? 0
                            const difficulty = getDifficultyFromMastery(mastery)

                            return (
                              <div
                                key={topic.id}
                                className="flex items-center justify-between text-sm bg-white dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span className="text-gray-400 text-xs w-4">{idx + 1}.</span>
                                  <span className="text-gray-700 dark:text-gray-300 text-xs truncate">
                                    {topic.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                    {Math.round(mastery * 100)}%
                                  </span>
                                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${difficulty.color}`}>
                                    {difficulty.label}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-3 h-3" />
              <span>Difficulty adapts based on your mastery level</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
