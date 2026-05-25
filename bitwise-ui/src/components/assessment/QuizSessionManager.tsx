import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, LayoutDashboard, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function QuizSessionManager({
  userId,
  topic,
  onComplete,
  nextLessonId,
}: {
  userId: string;
  topic: string;
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

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/assessment/ai-quiz/${userId}/${topic}`, {
        signal: AbortSignal.timeout(60000), // 60s for AI generation
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setQuestions(data.data);
        setQuizState('IN_PROGRESS');
        setCurrentIndex(0);
        setSelectedAnswers({});
        setSubmittedQuestion(null);
        setScoreData(null);
      } else {
        setError(data.error || 'Failed to generate quiz questions. Please try again.');
      }
    } catch (e: any) {
      setError(e.name === 'TimeoutError' ? 'Quiz generation timed out. Please try again.' : 'Failed to connect to server.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (submittedQuestion === questions[currentIndex].id) return; // locked
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: option
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

  const submitQuiz = async () => {
    setLoading(true);
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = correctCount / questions.length;

    try {
      const res = await fetch(`${API_BASE}/assessment/ai-quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        if (onComplete) onComplete();
      } else {
        setError(data.error || 'Failed to submit quiz.');
      }
    } catch (e) {
      setError('Failed to submit quiz. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (quizState === 'IDLE') {
    return (
      <Card className="max-w-xl mx-auto text-center py-8">
        <CardHeader>
          <CardTitle>AI Adaptive Assessment</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Test your knowledge on <strong>{topic}</strong>. The difficulty will dynamically adjust based on your historical Exponential Moving Average (EMA) mastery.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}
          <Button size="lg" onClick={startQuiz} disabled={loading} className="mt-4">
            {loading ? 'Generating AI Quiz...' : 'Start Assessment'}
          </Button>
          {loading && (
            <p className="text-xs text-muted-foreground mt-3">This may take up to 30 seconds while AI generates your questions...</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (quizState === 'COMPLETED') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-xl border border-border">
            <div className="text-5xl font-bold font-mono text-primary mb-2">
              {Math.round(scoreData.score * 100)}%
            </div>
            <div className="text-muted-foreground">
              {scoreData.correct} out of {scoreData.total} correct
            </div>
          </div>
          
          {scoreData.emaData && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg flex justify-between items-center text-sm">
              <div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400">Mastery Updated</div>
                <div className="text-muted-foreground">Your Exponential Moving Average (EMA) adjusted.</div>
              </div>
              <div className="text-right font-mono">
                <div className="text-muted-foreground line-through opacity-70">{(scoreData.emaData.previousEMA * 100).toFixed(1)}%</div>
                <div className="text-emerald-600 font-bold text-lg">{(scoreData.emaData.newEMA * 100).toFixed(1)}%</div>
              </div>
            </div>
          )}

          {/* Answer review */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Answer Review</h3>
            {scoreData.questions.map((q: QuizQuestion, idx: number) => {
              const userAnswer = scoreData.selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={`p-3 rounded-lg border text-sm ${isCorrect ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'}`}>
                  <p className="font-medium text-foreground mb-1">{idx + 1}. {q.question}</p>
                  <p className={`text-xs ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    Your answer: {userAnswer || '(not answered)'} {isCorrect ? '✓' : '✗'}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-green-700 dark:text-green-400">Correct: {q.correctAnswer}</p>
                  )}
                  {q.explanation && (
                    <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setQuizState('IDLE')} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Take Again
            </Button>
            {nextLessonId && (
              <Link to="/lesson/$lessonId" params={{ lessonId: String(nextLessonId) }}>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                  Continue to Lesson {nextLessonId}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
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

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between text-sm text-muted-foreground mb-4 font-mono">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Topic: {topic}</span>
        </div>
        <CardTitle className="text-xl leading-relaxed">{currentQ.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {currentQ.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === currentQ.correctAnswer;
            let cls = 'p-4 border-2 rounded-lg transition-all duration-200 ';
            if (!isSubmitted) {
              cls += isSelected
                ? 'border-primary bg-primary/10 text-primary font-medium cursor-pointer'
                : 'border-border bg-card hover:border-primary/50 hover:bg-muted cursor-pointer';
            } else {
              if (isCorrect) cls += 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 font-medium cursor-default';
              else if (isSelected) cls += 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 cursor-default';
              else cls += 'border-border opacity-50 cursor-default';
            }
            return (
              <div
                key={i}
                onClick={() => !isSubmitted && handleSelectOption(opt)}
                className={cls}
              >
                <span className="font-mono text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {isSubmitted && isCorrect && <span className="ml-2 text-green-600">✓</span>}
                {isSubmitted && isSelected && !isCorrect && <span className="ml-2 text-red-600">✗</span>}
              </div>
            );
          })}
        </div>

        {isSubmitted && currentQ.explanation && (
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-900/20 text-sm">
            <span className="font-semibold text-blue-900 dark:text-blue-300">💡 Explanation: </span>
            <span className="text-blue-800 dark:text-blue-200">{currentQ.explanation}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => { setCurrentIndex(prev => prev - 1); setSubmittedQuestion(null); }}
          >
            Previous
          </Button>

          {!isSubmitted ? (
            <Button onClick={handleSubmitAnswer} disabled={!selected}>
              Submit Answer
            </Button>
          ) : isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? 'Submitting...' : 'Finish Quiz'}
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next Question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuizSessionManager;
