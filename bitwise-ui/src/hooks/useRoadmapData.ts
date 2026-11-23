import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAllUserProgress } from '@/hooks/useUserProgress'
import {
  roadmapService,
  type AdaptiveAnalytics,
  type AssessmentStatistics,
  type TopicsProgressMap,
} from '@/services/roadmap.service'

interface TopicMastery {
  topicId: number
  topicTitle?: string
  mastery: number
  level: number
  attempts: number
}

interface UseRoadmapDataResult {
  lessonProgress: any[]
  topicsProgress: TopicsProgressMap
  topicMastery: Record<number, TopicMastery[]>
  analytics: AdaptiveAnalytics | null
  statistics: AssessmentStatistics | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useRoadmapData(userId: string | undefined, lessonIds: number[]): UseRoadmapDataResult {
  const { data: lessonProgress = [], isLoading: progressLoading } = useAllUserProgress(userId, !!userId)
  const [topicsProgress, setTopicsProgress] = useState<TopicsProgressMap>({})
  const [topicMastery, setTopicMastery] = useState<Record<number, TopicMastery[]>>(() => {
    if (!userId) return {}
    try {
      const cached = localStorage.getItem(`bitwise_mastery_${userId}`)
      if (cached) return JSON.parse(cached)
    } catch {}
    return {}
  })
  const [analytics, setAnalytics] = useState<AdaptiveAnalytics | null>(() => {
    if (!userId) return null
    try {
      const cached = localStorage.getItem(`bitwise_analytics_${userId}`)
      if (cached) return JSON.parse(cached)
    } catch {}
    return null
  })
  const [statistics, setStatistics] = useState<AssessmentStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setTopicsProgress({})
      setTopicMastery({})
      setAnalytics(null)
      setStatistics(null)
      setError(null)
    } else {
      try {
        const cachedMastery = localStorage.getItem(`bitwise_mastery_${userId}`)
        if (cachedMastery) setTopicMastery(JSON.parse(cachedMastery))
        const cachedAnalytics = localStorage.getItem(`bitwise_analytics_${userId}`)
        if (cachedAnalytics) setAnalytics(JSON.parse(cachedAnalytics))
      } catch {}
    }
  }, [userId])

  const lessonKey = useMemo(() => [...lessonIds].sort().join('-'), [lessonIds])

  const loadRoadmapData = useCallback(async () => {
    if (!userId) {
      setTopicsProgress({})
      setTopicMastery({})
      setAnalytics(null)
      setStatistics(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [analyticsData, statsData] = await Promise.all([
        roadmapService.getAdaptiveAnalytics(userId),
        roadmapService.getAssessmentStats(userId),
      ])

      setAnalytics(analyticsData)
      setStatistics(statsData)
      if (userId && analyticsData) {
        try {
          localStorage.setItem(`bitwise_analytics_${userId}`, JSON.stringify(analyticsData))
        } catch {}
      }

      if (analyticsData?.skillsByLesson?.length) {
        type LessonSkillSummary = AdaptiveAnalytics['skillsByLesson'][number]
        const masteryMap = (analyticsData.skillsByLesson as LessonSkillSummary[]).reduce(
          (acc: Record<number, TopicMastery[]>, lessonSummary: LessonSkillSummary) => {
            acc[lessonSummary.lessonId] = lessonSummary.skills.map((skill) => ({
              topicId: skill.topicId,
              topicTitle: skill.topicTitle,
              mastery: skill.mastery,
              level: skill.level,
              attempts: skill.attempts,
            }))
            return acc
          },
          {} as Record<number, TopicMastery[]>
        )
        setTopicMastery(masteryMap)
        if (userId) {
          try {
            localStorage.setItem(`bitwise_mastery_${userId}`, JSON.stringify(masteryMap))
          } catch {}
        }
      } else {
        setTopicMastery({})
      }
    } catch (err) {
      console.error('Failed to load roadmap data', err)
      setError(err instanceof Error ? err.message : 'Failed to load roadmap data')
    } finally {
      setLoading(false)
    }
  }, [lessonKey, lessonIds, userId])

  useEffect(() => {
    loadRoadmapData()
  }, [loadRoadmapData])

  return {
    lessonProgress,
    topicsProgress,
    topicMastery,
    analytics,
    statistics,
    loading: loading || progressLoading,
    error,
    refresh: loadRoadmapData,
  }
}
