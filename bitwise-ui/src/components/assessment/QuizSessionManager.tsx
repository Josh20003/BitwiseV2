import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function QuizSessionManager({ userId, topic, onComplete }: { userId: string, topic: string, onComplete?: () => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState<'IDLE' | 'IN_PROGRESS' | 'COMPLETED'>('IDLE');
  const [scoreData, setScoreData] = useState<any>(null);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assessment/ai-quiz/${userId}/${topic}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setQuestions(data.data);
        setQuizState('IN_PROGRESS');
        setCurrentIndex(0);
        setSelectedAnswers({});
        setScoreData(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: option
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
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
      const res = await fetch('/api/assessment/ai-quiz/submit', {
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
          emaData: data.data
        });
        if (onComplete) onComplete();
      }
    } catch (e) {
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
          <Button size="lg" onClick={startQuiz} disabled={loading} className="mt-4">
            {loading ? 'Generating AI Quiz...' : 'Start Assessment'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === 'COMPLETED') {
    return (
      <Card className="max-w-xl mx-auto">
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

          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => setQuizState('IDLE')}>Return</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentIndex];
  const selected = selectedAnswers[currentQ.id];

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
          {currentQ.options.map((opt, i) => (
            <div 
              key={i}
              onClick={() => handleSelectOption(opt)}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${selected === opt 
                  ? 'border-primary bg-primary/10 text-primary font-medium' 
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted'}
              `}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-border mt-8">
          <Button 
            variant="outline" 
            disabled={currentIndex === 0} 
            onClick={() => setCurrentIndex(prev => prev - 1)}
          >
            Previous
          </Button>
          
          {currentIndex === questions.length - 1 ? (
            <Button 
              onClick={submitQuiz} 
              disabled={!selected || loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button onClick={nextQuestion} disabled={!selected}>
              Next Question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuizSessionManager;
