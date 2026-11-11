import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Lock, AlertCircle, Brain, CheckCircle2 } from 'lucide-react'
import type { Lesson, LessonStatus } from './types'

interface LessonCardProps {
  lesson: Lesson
  lessonStatus: LessonStatus
  lessonImage: string
  onSelect: (lesson: Lesson) => void
  onPractice?: (lessonId: number) => void
}

export function LessonCard({
  lesson,
  lessonStatus,
  lessonImage,
  onSelect,
  onPractice,
}: LessonCardProps) {
  const { status, progress, isLocked, quizScore, quizStatus } = lessonStatus
  const nextLessonNum = lesson.id + 1

  return (
    <div 
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 group flex flex-col relative ${
        isLocked ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-lg'
      }`}
    >
      {/* Lock Overlay for interactions */}
      {isLocked && (
        <div className="absolute inset-0 z-10 bg-gray-50/50 dark:bg-gray-900/50 cursor-not-allowed flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-gray-500">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      )}
      {/* Card Header / Image */}
      <div
        className={`h-32 w-full relative overflow-hidden ${
          status === 'completed'
            ? 'bg-green-100 dark:bg-green-900/20'
            : status === 'in-progress'
              ? 'bg-blue-100 dark:bg-blue-900/20'
              : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <img
          src={lessonImage}
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
            Lesson {lesson.id}
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
        <div className="space-y-2.5 mt-auto">
          <div className="flex justify-between items-center text-xs font-medium">
            <span
              className={
                status === 'completed'
                  ? 'text-green-600 dark:text-green-400'
                  : status === 'in-progress'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500'
              }
            >
              {status === 'not-started'
                ? 'Not Started'
                : `${progress}% Complete`}
            </span>

            {status === 'completed' && quizStatus && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  quizStatus === 'passed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : quizStatus === 'failed'
                      ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                {quizStatus === 'passed' && (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Quiz: {quizScore}% Passed
                  </>
                )}
                {quizStatus === 'failed' && (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                    Quiz: {quizScore}% Failed
                  </>
                )}
                {quizStatus === 'not_taken' && (
                  <>
                    <Brain className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    Quiz Pending
                  </>
                )}
              </span>
            )}
          </div>

          <Progress value={progress} className="h-1.5" />


          {isLocked ? (
            <Button
              variant="default"
              className="w-full mt-2"
              disabled
            >
              Locked
            </Button>
          ) : status === 'completed' ? (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                onClick={() => onSelect(lesson)}
                variant="outline"
                className="w-full"
              >
                Review
              </Button>
              <Button
                onClick={() => onPractice ? onPractice(lesson.id) : onSelect(lesson)}
                className={`w-full text-white font-medium ${
                  quizStatus === 'passed'
                    ? 'bg-gray-700 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Brain className="w-3.5 h-3.5 mr-1" />
                {quizStatus === 'failed'
                  ? 'Retake Quiz'
                  : quizStatus === 'not_taken'
                    ? 'Take Quiz'
                    : 'Practice'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onSelect(lesson)}
              variant={status === 'in-progress' ? 'default' : 'default'}
              className="w-full mt-2"
            >
              {status === 'in-progress' ? 'Continue' : 'Start'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
