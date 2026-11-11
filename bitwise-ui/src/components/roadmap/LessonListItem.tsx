import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Lock, Brain } from 'lucide-react'
import type { Lesson, LessonStatus } from './types'

interface LessonListItemProps {
  lesson: Lesson
  lessonStatus: LessonStatus
  lessonImage: string
  onSelect: (lesson: Lesson) => void
  onPractice?: (lessonId: number) => void
}

export function LessonListItem({
  lesson,
  lessonStatus,
  lessonImage,
  onSelect,
  onPractice,
}: LessonListItemProps) {
  const { status, progress, isLocked, quizScore, quizStatus } = lessonStatus
  const nextLessonNum = lesson.id + 1

  return (
    <div 
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md transition-colors group relative ${
        isLocked ? 'opacity-75 grayscale-[0.5]' : 'hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      {/* Lock Overlay for interactions */}
      {isLocked && (
        <div className="absolute inset-0 z-10 bg-gray-50/50 dark:bg-gray-900/50 cursor-not-allowed flex items-center justify-center rounded-md" />
      )}
      <div className="p-4 flex items-center gap-4">
        {/* Status Icon */}
        <div className="shrink-0 relative">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img
              src={lessonImage}
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
              Lesson {lesson.id}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
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
        <div className="shrink-0 w-44">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-xs font-medium ${
                status === 'completed'
                  ? 'text-green-600 dark:text-green-400'
                  : status === 'in-progress'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {status === 'not-started' ? 'Not Started' : `${progress}%`}
            </span>

            {status === 'completed' && quizStatus && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                  quizStatus === 'passed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : quizStatus === 'failed'
                      ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                {quizStatus === 'passed' && `Quiz: ${quizScore}%`}
                {quizStatus === 'failed' && `Quiz: ${quizScore}% (Failed)`}
                {quizStatus === 'not_taken' && 'Quiz Pending'}
              </span>
            )}
          </div>
          <Progress value={progress} className="h-1.5 mb-1" />
          {status === 'completed' && quizStatus === 'failed' && (
            <p className="text-[10px] text-red-600 dark:text-red-400 truncate">
              Need 80% to unlock L{nextLessonNum}
            </p>
          )}
          {status === 'completed' && quizStatus === 'not_taken' && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 truncate">
              Quiz needed for L{nextLessonNum}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="shrink-0 relative z-20 flex items-center gap-2">
          {status === 'completed' && onPractice && (
            <Button
              onClick={() => onPractice(lesson.id)}
              size="sm"
              className={`text-white text-xs ${
                quizStatus === 'passed'
                  ? 'bg-gray-700 hover:bg-gray-800'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <Brain className="w-3 h-3 mr-1" />
              {quizStatus === 'failed'
                ? 'Retake'
                : quizStatus === 'not_taken'
                  ? 'Quiz'
                  : 'Practice'}
            </Button>
          )}
          <Button
            onClick={() => {
              if (!isLocked) onSelect(lesson)
            }}
            variant={status === 'completed' ? 'outline' : 'default'}
            size="sm"
            disabled={isLocked}
          >
            {isLocked ? (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            ) : status === 'completed' ? (
              'Review'
            ) : status === 'in-progress' ? (
              'Continue'
            ) : (
              'Start'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
