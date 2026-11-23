import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userProgressService } from '@/services/user-progress.service'

export const USER_PROGRESS_QUERY_KEYS = {
  all: (userId?: string) => ['user-progress', userId || 'anonymous'] as const,
  allProgress: (userId?: string) => [...USER_PROGRESS_QUERY_KEYS.all(userId), 'lessons'] as const,
  lesson: (lessonId: number, userId?: string) => [...USER_PROGRESS_QUERY_KEYS.all(userId), 'lesson', lessonId] as const,
  topics: (lessonId: number, userId?: string) => [...USER_PROGRESS_QUERY_KEYS.all(userId), 'topics', lessonId] as const,
  statistics: (userId?: string) => [...USER_PROGRESS_QUERY_KEYS.all(userId), 'statistics'] as const,
} as const

export function useAllUserProgress(
  userIdOrEnabled?: string | boolean,
  enabledArg?: boolean
) {
  const userId = typeof userIdOrEnabled === 'string' ? userIdOrEnabled : undefined
  const enabled = typeof userIdOrEnabled === 'boolean' ? userIdOrEnabled : (enabledArg ?? true)

  return useQuery({
    queryKey: USER_PROGRESS_QUERY_KEYS.allProgress(userId),
    queryFn: async () => {
      const data = await userProgressService.getAllProgress()
      if (userId && Array.isArray(data)) {
        try {
          localStorage.setItem(`bitwise_progress_${userId}`, JSON.stringify(data))
        } catch {}
      }
      return data
    },
    initialData: () => {
      if (!userId) return undefined
      try {
        const cached = localStorage.getItem(`bitwise_progress_${userId}`)
        if (cached) return JSON.parse(cached)
      } catch {}
      return undefined
    },
    enabled: enabled && (userId !== undefined ? !!userId : true),
  })
}

export function useLessonProgress(
  lessonId: number | undefined,
  userIdOrEnabled?: string | boolean,
  enabledArg?: boolean
) {
  const userId = typeof userIdOrEnabled === 'string' ? userIdOrEnabled : undefined
  const enabled = typeof userIdOrEnabled === 'boolean' ? userIdOrEnabled : (enabledArg ?? true)

  return useQuery({
    queryKey: USER_PROGRESS_QUERY_KEYS.lesson(lessonId!, userId),
    queryFn: () => userProgressService.getLessonProgress(lessonId!),
    enabled: enabled && !!lessonId && (userId !== undefined ? !!userId : true),
  })
}

export function useTopicsForLesson(
  lessonId: number | undefined,
  userIdOrEnabled?: string | boolean,
  enabledArg?: boolean
) {
  const userId = typeof userIdOrEnabled === 'string' ? userIdOrEnabled : undefined
  const enabled = typeof userIdOrEnabled === 'boolean' ? userIdOrEnabled : (enabledArg ?? true)

  return useQuery({
    queryKey: USER_PROGRESS_QUERY_KEYS.topics(lessonId!, userId),
    queryFn: () => userProgressService.getTopicsForLesson(lessonId!),
    enabled: enabled && !!lessonId && (userId !== undefined ? !!userId : true),
  })
}

export function useUserStatistics(userId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: USER_PROGRESS_QUERY_KEYS.statistics(userId),
    queryFn: () => userProgressService.getStatistics(),
    enabled,
  })
}

export function useMarkTopicViewed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicId: number) => userProgressService.markTopicViewed(topicId),
    onSuccess: () => {
      // Invalidate all progress queries to refetch
      queryClient.invalidateQueries({ queryKey: ['user-progress'] })
    },
  })
}

export function useMarkLessonCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: number) => userProgressService.markLessonCompleted(lessonId),
    onSuccess: () => {
      // Invalidate all progress queries to refetch
      queryClient.invalidateQueries({ queryKey: ['user-progress'] })
    },
  })
}

export function useMarkTopicCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicId: number) => userProgressService.markTopicCompleted(topicId),
    onSuccess: () => {
      // Invalidate all progress queries to refetch
      queryClient.invalidateQueries({ queryKey: ['user-progress'] })
    },
  })
}
