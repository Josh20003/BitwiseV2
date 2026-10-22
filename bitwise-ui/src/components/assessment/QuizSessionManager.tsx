import { useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  LayoutDashboard,
  RotateCcw,
  Table,
  Grid3X3,
  Brain,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Volume2,
  Lock,
} from 'lucide-react';
import CircuitRenderer from '@/components/CircuitRenderer';
import { cleanLatexNotation } from '@/utils/mathFormat';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  topic?: string;
  topicId?: number;
  lessonId?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  question?: string;
  stem?: string | any;
  questionType?: string;
  tags?: string[];
  options: any[]; // string[] or Array<{ id, text, isCorrect, rationale }>
  correctAnswer?: string;
  answerId?: string;
  explanation?: string;
  solutionSteps?: string[];
}

// Component to render truth tables
const TruthTableRenderer = ({ tableData }: { tableData: any }) => {
  return (
    <div className="my-6 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50 border-gray-200 dark:border-gray-800">
        <Table className="w-4 h-4 text-muted-foreground" />
        <h4 className="font-semibold text-sm text-foreground">
          {tableData.caption || 'Truth Table'}
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-muted/50 border-gray-200 dark:border-gray-800 transition-colors hover:bg-muted/60">
              {(tableData.headers || tableData.rows[0] || []).map(
                (header: string, idx: number) => (
                  <th
                    key={idx}
                    className="h-10 px-4 align-middle font-medium text-muted-foreground"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {tableData.rows
              .slice(tableData.headers ? 0 : 1)
              .map((row: string[], rowIdx: number) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-muted/50"
                >
                  {row.map((cell: string, cellIdx: number) => (
                    <td key={cellIdx} className="p-4 align-middle font-mono">
                      {cell === '0' || cell === '1' ? (
                        <span
                          className={`font-semibold ${cell === '1' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                        >
                          {cell}
                        </span>
                      ) : (
                        <span className="text-foreground">{cell}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component to render Karnaugh maps
const KarnaughMapRenderer = ({ kMapData }: { kMapData: any }) => {
  return (
    <div className="my-6 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50 border-gray-200 dark:border-gray-800">
        <Grid3X3 className="w-4 h-4 text-muted-foreground" />
        <h4 className="font-semibold text-sm text-foreground">
          {kMapData.caption || 'Karnaugh Map'}
        </h4>
      </div>
      <div className="p-6 flex justify-center bg-background">
        <div className="inline-block">
          <div className="flex mb-2">
            <div className="w-12" />
            {(kMapData.headers || []).map((header: string, idx: number) => (
              <div
                key={idx}
                className="w-12 text-center font-semibold text-muted-foreground text-xs"
              >
                {header}
              </div>
            ))}
          </div>
          {kMapData.rows.map((row: string[], rowIdx: number) => (
            <div key={rowIdx} className="flex items-center mb-1">
              <div className="w-12 text-center font-semibold text-muted-foreground text-xs pr-2">
                {kMapData.sideLabels
                  ? kMapData.sideLabels[rowIdx]
                  : `Row ${rowIdx}`}
              </div>
              {row.map((cell: string, cellIdx: number) => (
                <div
                  key={cellIdx}
                  className="w-12 h-12 border border-gray-200 dark:border-gray-800 bg-card flex items-center justify-center font-mono text-sm transition-colors hover:bg-accent"
                >
                  {cell === '0' || cell === '1' ? (
                    <span
                      className={`font-bold ${
                        cell === '1'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {cell}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{cell}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component to render question stem
const QuestionStemRenderer = ({ stem }: { stem: any }) => {
  if (typeof stem === 'string') {
    return (
      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 leading-relaxed">
        {cleanLatexNotation(stem)}
      </h2>
    );
  }
  if (typeof stem === 'object' && stem !== null) {
    const titleText = cleanLatexNotation(stem.text || '');
    return (
      <div>
        {titleText && (
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 leading-relaxed">
            {titleText}
          </h2>
        )}
        {stem.type === 'table' && stem.table && (
          <TruthTableRenderer tableData={stem.table} />
        )}
        {stem.type === 'karnaughMap' && stem.karnaughMap && (
          <KarnaughMapRenderer kMapData={stem.karnaughMap} />
        )}
        {stem.type === 'circuit' && stem.circuit && (
          <div className="w-full flex justify-center bg-gray-50/50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-xl p-4 my-6">
            <CircuitRenderer circuit={stem.circuit} />
          </div>
        )}
      </div>
    );
  }
  return null;
};

const LESSON_METADATA: Record<number, { title: string; topics: string[] }> = {
  1: {
    title: 'Introduction to Number Systems',
    topics: ['Binary', 'Decimal', 'Octal', 'Hexadecimal'],
  },
  2: {
    title: 'Types of Number Systems',
    topics: ['Binary ↔ Decimal', 'Binary ↔ Hex', 'Digit Groupings'],
  },
  3: {
    title: 'Conversion of Number Systems',
    topics: ['Decimal to Binary', 'Binary to Decimal', 'Hex Conversion'],
  },
  4: {
    title: 'Binary Arithmetic',
    topics: ['Binary Addition', 'Subtraction', 'Multiplication', 'Division'],
  },
  5: {
    title: 'Complements',
    topics: ["1's Complement", "2's Complement", 'Bit Inversion'],
  },
  6: {
    title: 'Signed and Unsigned Numbers',
    topics: ['MSB', 'Signed Representation', 'Unsigned Representation'],
  },
  7: {
    title: 'Binary Codes (BCD & ASCII)',
    topics: ['BCD Encoding', 'ASCII Conversion', 'Character-to-Binary'],
  },
  8: {
    title: 'Intro to Boolean Algebra',
    topics: ['What is Boolean Algebra?', 'Boolean Values', 'Applications'],
  },
  9: {
    title: 'Logic Gates',
    topics: ['AND, OR, NOT', 'NAND, NOR', 'XOR, XNOR'],
  },
  10: {
    title: 'Truth Tables',
    topics: ['Constructing Truth Tables', 'Reading Truth Tables', 'Truth Tables for Gates'],
  },
  11: {
    title: 'Simplification & Karnaugh Maps',
    topics: ['Boolean Laws', 'Karnaugh Maps', 'Practical Examples'],
  },
};

export function QuizSessionManager({
  userId,
  topic,
  lessonId,
  onComplete,
  nextLessonId,
}: {
  userId: string;
  topic: string;
  lessonId?: number;
  onComplete?: () => void;
  nextLessonId?: number;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState<'IDLE' | 'IN_PROGRESS' | 'COMPLETED'>('IDLE');
  const [scoreData, setScoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [lessonInfo, setLessonInfo] = useState<{
    lessonId: number;
    lessonTitle: string;
    topicMasteries?: Array<{
      topicId: number;
      topicTitle: string;
      mastery: number;
      difficulty: string;
      questionCount: number;
    }>;
  } | null>(null);

  const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const API_BASE = rawApiBase.replace(/\/+$/, '');

  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      if (lessonId) {
        // Use the premium lesson practice route (with BKT + visuals)
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/assessment/start-lesson-practice`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ uid: userId, lessonId }),
          signal: AbortSignal.timeout(120000),
        });
        const data = await res.json().catch(() => ({ success: false, error: `Server returned HTTP ${res.status}` }));
        if (!res.ok) {
          setError(data.message || data.error || `Server error (${res.status}). Please check your connection or login session.`);
          return;
        }
        if (data.success && data.data && data.data.questions?.length > 0) {
          setQuestions(data.data.questions);
          setAttemptId(data.data.attemptId);
          if (data.data.lessonInfo) {
            setLessonInfo(data.data.lessonInfo);
          }
          setQuizState('IN_PROGRESS');
          setCurrentIndex(0);
          setSelectedAnswers({});
          setSubmittedQuestion(null);
          setScoreData(null);
        } else {
          setError(data.error || 'Failed to start adaptive lesson practice. Please try again.');
        }
      } else {
        // Fallback for direct url navigation (without lessonId)
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/assessment/ai-quiz/${userId}/${topic}`, {
          headers,
          signal: AbortSignal.timeout(120000),
        });
        const data = await res.json().catch(() => ({ success: false, error: `Server returned HTTP ${res.status}` }));
        if (!res.ok) {
          setError(data.message || data.error || `Server error (${res.status}). Please check your connection or login session.`);
          return;
        }
        if (data.success && data.data && data.data.length > 0) {
          setQuestions(data.data);
          setAttemptId(null);
          setQuizState('IN_PROGRESS');
          setCurrentIndex(0);
          setSelectedAnswers({});
          setSubmittedQuestion(null);
          setScoreData(null);
        } else {
          setError(data.error || 'Failed to generate quiz questions. Please try again.');
        }
      }
    } catch (e: any) {
      setError(e.name === 'TimeoutError' ? 'Quiz generation timed out. Please try again.' : (e.message || 'Failed to connect to server.'));
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIdOrText: string) => {
    const currentQ = questions[currentIndex];
    if (submittedQuestion === currentQ.id) return; // locked
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdOrText
    }));
  };

  const handleSubmitAnswer = () => {
    setSubmittedQuestion(questions[currentIndex].id);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSubmittedQuestion(null);
    }
  };

  // Helper getters
  const getOptionText = (opt: any) => cleanLatexNotation(typeof opt === 'string' ? opt : opt.text);
  const getOptionId = (opt: any) => (typeof opt === 'string' ? opt : opt.id);
  
  const getCorrectAnswerText = (currentQ: QuizQuestion) => {
    if (currentQ.correctAnswer) return cleanLatexNotation(currentQ.correctAnswer);
    const correctOpt = currentQ.options.find(o => o.isCorrect === true);
    return correctOpt ? cleanLatexNotation(correctOpt.text) : '';
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      if (attemptId) {
        // Submit using adaptive practice endpoint (BKT updates)
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/assessment/submit-adaptive-practice`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            attemptId,
            responses: selectedAnswers
          })
        });
        const data = await res.json();
        if (data.success) {
          setQuizState('COMPLETED');
          
          let correctCount = 0;
          questions.forEach(q => {
            const answer = selectedAnswers[q.id];
            const isCorrect = q.options.find(o => o.id === answer && o.isCorrect);
            if (isCorrect) correctCount++;
          });
          const score = correctCount / questions.length;

          setScoreData({
            score,
            correct: correctCount,
            total: questions.length,
            emaData: data.data.emaData, // synced in backend
            questions,
            selectedAnswers,
          });

          if (score >= 0.8) {
            confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
          }

          if (onComplete) onComplete();
        } else {
          setError(data.error || 'Failed to submit adaptive assessment.');
        }
      } else {
        // Submit using simple quiz endpoint
        let correctCount = 0;
        questions.forEach(q => {
          if (selectedAnswers[q.id] === q.correctAnswer) {
            correctCount++;
          }
        });
        const finalScore = correctCount / questions.length;

        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/assessment/ai-quiz/submit`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId,
            topic,
            score: finalScore,
            answersJson: selectedAnswers
          })
        });
        const data = await res.json();
        if (data.success) {
          setQuizState('COMPLETED');
          setScoreData({
            score: finalScore,
            correct: correctCount,
            total: questions.length,
            emaData: data.data,
            questions,
            selectedAnswers,
          });

          if (finalScore >= 0.8) {
            confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
          }

          if (onComplete) onComplete();
        } else {
          setError(data.error || 'Failed to submit quiz.');
        }
      }
    } catch (e) {
      setError('Failed to submit quiz. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (quizState === 'IDLE') {
    const currentLesson = lessonId ? LESSON_METADATA[lessonId] : null;

    return (
      <Card className="max-w-2xl mx-auto text-center py-10 px-6 border border-gray-200 dark:border-gray-800 shadow-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">
              <Brain className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {currentLesson
              ? `Lesson ${lessonId}: ${currentLesson.title}`
              : 'AI Adaptive Assessment'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {currentLesson ? (
              <>
                Focused practice session exclusively for{' '}
                <span className="font-semibold text-foreground">{currentLesson.title}</span>.
                Questions are 100% focused on{' '}
                <span className="font-semibold text-foreground">
                  {currentLesson.topics.join(', ')}
                </span>{' '}
                and dynamically adapt to your personal mastery skill level.
              </>
            ) : (
              <>
                Test your knowledge on{' '}
                <span className="font-semibold text-foreground capitalize">
                  {topic.replace(/-/g, ' ')}
                </span>
                . The difficulty will dynamically adjust based on your mastery level.
              </>
            )}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button
            size="lg"
            onClick={startQuiz}
            disabled={loading}
            className="mt-4 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {currentLesson
                  ? `Generating Lesson ${lessonId} Assessment...`
                  : 'Generating Assessment...'}
              </span>
            ) : currentLesson ? (
              `Start Lesson ${lessonId} Practice`
            ) : (
              'Start Assessment'
            )}
          </Button>
          {loading && (
            <p className="text-xs text-muted-foreground mt-4 animate-pulse">
              {currentLesson
                ? `Please wait: AI is generating 10 questions focused exclusively on ${currentLesson.title}...`
                : 'Please wait: AI is engineering customized practice questions for your current mastery...'}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (quizState === 'COMPLETED') {
    const percent = Math.round(scoreData.score * 100);
    const isPassed = percent >= 80;

    return (
      <Card className="max-w-2xl mx-auto border border-gray-200 dark:border-gray-800 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`flex flex-col items-center justify-center p-8 rounded-2xl border ${
            isPassed 
              ? 'bg-emerald-500/10 border-emerald-500/20' 
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className={`text-5xl font-extrabold font-mono mb-2 ${
              isPassed 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {percent}%
            </div>
            <div className="text-sm font-semibold text-muted-foreground">
              {scoreData.correct} out of {scoreData.total} correct
            </div>

            {/* 80% Passing threshold indicator */}
            <div className="mt-4">
              {isPassed ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passed (80% Passing Mark Reached)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Passing Mark Not Met (80% Required to Continue)</span>
                </div>
              )}
            </div>

            {!isPassed && nextLessonId && (
              <p className="text-xs text-amber-700 dark:text-amber-300 text-center mt-3 max-w-md">
                You need at least 80% (8 out of 10) on this quiz to unlock and continue to Lesson {nextLessonId}. Review the explanations below and try again!
              </p>
            )}
          </div>
          
          {scoreData.emaData && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex justify-between items-center text-sm">
              <div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mastery Updated
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">Your Exponential Moving Average (EMA) adjusted.</div>
              </div>
              <div className="text-right font-mono shrink-0">
                <div className="text-muted-foreground text-xs line-through opacity-70">{(scoreData.emaData.previousEMA * 100).toFixed(1)}%</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{(scoreData.emaData.newEMA * 100).toFixed(1)}%</div>
              </div>
            </div>
          )}

          {/* Answer review */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Detailed Answer Review</h3>
            {scoreData.questions.map((q: QuizQuestion, idx: number) => {
              const userAnswerIdOrText = scoreData.selectedAnswers[q.id];
              const isRichFormat = q.answerId !== undefined;
              
              const isCorrect = isRichFormat
                ? q.options.find(o => o.id === userAnswerIdOrText && o.isCorrect === true)
                : userAnswerIdOrText === q.correctAnswer;
                
              const userAnswerText = isRichFormat
                ? q.options.find(o => o.id === userAnswerIdOrText)?.text || '(not answered)'
                : userAnswerIdOrText || '(not answered)';
                
              const correctAnswerText = getCorrectAnswerText(q);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-sm transition-all ${
                    isCorrect
                      ? 'border-green-200 bg-green-50/20 dark:border-green-950 dark:bg-green-950/10'
                      : 'border-red-200 bg-red-50/20 dark:border-red-950 dark:bg-red-950/10'
                  }`}
                >
                  <p className="font-bold text-foreground mb-2">
                    {idx + 1}. {typeof q.stem === 'string' ? q.stem : (q.stem?.text || q.question || 'Visual Question')}
                  </p>
                  <p className={`text-xs font-semibold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    Your answer: {userAnswerText} {isCorrect ? '✓' : '✗'}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
                      Correct answer: {correctAnswerText}
                    </p>
                  )}
                  {q.explanation && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-gray-800 text-xs text-muted-foreground leading-relaxed flex items-start gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant={isPassed ? "outline" : "default"}
              onClick={() => setQuizState('IDLE')}
              className={`gap-2 font-medium ${!isPassed ? 'bg-purple-600 hover:bg-purple-700 text-white font-semibold' : ''}`}
            >
              <RotateCcw className="w-4 h-4" />
              {isPassed ? 'Take Again' : 'Try Again to Pass (80%)'}
            </Button>
            {nextLessonId && isPassed && (
              <Link to="/lesson/$lessonId" params={{ lessonId: String(nextLessonId) }} search={{ topicId: undefined }}>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full font-semibold">
                  Continue to Lesson {nextLessonId}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            {nextLessonId && !isPassed && (
              <Button disabled variant="outline" className="gap-2 opacity-50 cursor-not-allowed w-full">
                <Lock className="w-4 h-4" />
                Lesson {nextLessonId} Locked (Requires 80%)
              </Button>
            )}
            <Link to="/roadmap">
              <Button variant="ghost" className="gap-2 text-muted-foreground w-full">
                <LayoutDashboard className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentIndex];
  const selected = selectedAnswers[currentQ.id];
  const isSubmitted = submittedQuestion === currentQ.id;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Determine if it is rich question object format
  const isRichFormat = currentQ.answerId !== undefined;

  const currentTopicName = (() => {
    if (lessonInfo?.topicMasteries && currentQ.topicId) {
      const match = lessonInfo.topicMasteries.find(
        (t) => t.topicId === currentQ.topicId,
      );
      if (match) return match.topicTitle;
    }
    if (currentQ.topic) {
      return currentQ.topic.replace(/-/g, ' ');
    }
    return null;
  })();

  const currentLessonTitle =
    lessonInfo?.lessonTitle ||
    (lessonId && LESSON_METADATA[lessonId]?.title) ||
    null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="pb-6 mb-6">
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Adaptive Assessment</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-sm font-semibold capitalize">
                {currentQ.difficulty || 'Easy'}
              </span>
              <span className="text-sm font-medium text-muted-foreground">Mastery: 0%</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="w-48 h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-sm font-semibold text-blue-800 dark:text-blue-300">
              Lesson {lessonId || '1'}{currentLessonTitle ? `: ${currentLessonTitle}` : ''}
            </span>
            {currentTopicName && (
              <span className="px-4 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                Topic: {currentTopicName}
              </span>
            )}
            <span className="px-4 py-1.5 rounded-full bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold capitalize">
               {currentQ.difficulty || 'Easy'}
            </span>
          </div>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6 pt-2">
        <div className="prose dark:prose-invert max-w-none mb-8">
          <QuestionStemRenderer stem={currentQ.stem || currentQ.question} />
        </div>
        <div className="grid gap-3">
          {currentQ.options.map((opt, i) => {
            const optId = getOptionId(opt);
            const optText = getOptionText(opt);
            
            const isSelected = selected === optId;
            const isCorrect = isRichFormat ? (opt.isCorrect === true) : (optId === currentQ.correctAnswer);
            
            let cls = 'flex w-full items-center rounded-xl border p-4 text-left text-sm font-medium transition-all duration-200 ';
            
            if (!isSubmitted) {
              cls += isSelected
                ? 'border-purple-600 bg-purple-500/5 text-purple-700 dark:text-purple-400 font-semibold cursor-pointer ring-1 ring-purple-600'
                : 'border-gray-200 dark:border-gray-800 bg-card hover:border-purple-400/50 hover:bg-muted cursor-pointer';
            } else {
              if (isCorrect) {
                cls += 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-bold cursor-default';
              } else if (isSelected) {
                cls += 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 cursor-default';
              } else {
                cls += 'border-gray-100 dark:border-gray-900 opacity-40 cursor-default';
              }
            }

            return (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(optId)}
                className={cls}
              >
                <span className="font-mono text-xs text-muted-foreground mr-3 bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{optText}</span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 ml-2" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Visual feedback explanation */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-900/50 dark:bg-blue-900/10 text-xs">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Explanation
              </h4>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                {cleanLatexNotation(
                  isRichFormat 
                    ? (currentQ.options.find(o => o.id === selected)?.rationale || currentQ.options.find(o => o.isCorrect)?.rationale || currentQ.explanation || '') 
                    : (currentQ.explanation || 'Option evaluated successfully.')
                )}
              </p>
            </div>

            {/* Visual solution steps on incorrect answer */}
            {!isRichFormat ? null : !currentQ.options.find(o => o.id === selected && o.isCorrect) && currentQ.solutionSteps && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/20 p-4 dark:border-purple-900/40 dark:bg-purple-900/5 text-xs">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  Step-by-Step Derivation
                </h4>
                <ol className="list-decimal ml-4 space-y-1.5 text-purple-800 dark:text-purple-300 font-medium">
                  {currentQ.solutionSteps.map((step, idx) => (
                    <li key={idx} className="pl-1 leading-relaxed">{cleanLatexNotation(step)}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-5 mt-6 shrink-0">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selected}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold min-w-[140px] rounded-xl"
            >
              Submit Answer
            </Button>
          ) : isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold min-w-[140px] rounded-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Finish Quiz'
              )}
            </Button>
          ) : (
            <Button onClick={nextQuestion} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold min-w-[140px] rounded-xl">
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizSessionManager;
