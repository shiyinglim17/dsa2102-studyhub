// QuizView — full chapter or all-topics practice quiz
// Design: "Golden Hour Study Retreat" — immersive quiz experience

import { useState, useMemo } from 'react';
import { chapters, allQuestions, QuizQuestion } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';
import { QuizCard } from '@/components/QuizCard';
import { Shuffle, BarChart3, ChevronLeft } from 'lucide-react';

interface QuizViewProps {
  chapterId: string;
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

export default function QuizView({ chapterId, onNavigate }: QuizViewProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>(chapterId || 'all');
  const [shuffled, setShuffled] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const { recordAnswer } = useProgress();

  const questions = useMemo<QuizQuestion[]>(() => {
    let qs = selectedChapter === 'all'
      ? allQuestions
      : allQuestions.filter(q => {
          const ch = chapters.find(c => c.id === selectedChapter);
          return ch?.topics.some(t => t.id === q.topicId);
        });
    if (shuffled) {
      qs = [...qs].sort(() => Math.random() - 0.5);
    }
    return qs;
  }, [selectedChapter, shuffled]);

  const handleNext = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizCompleted(false);
    setSessionCorrect(0);
    setSessionTotal(0);
  };

  const currentQuestion = questions[quizIndex];

  // Find chapterId for current question
  const getChapterForQuestion = (q: QuizQuestion): string => {
    for (const ch of chapters) {
      if (ch.topics.some(t => t.id === q.topicId)) return ch.id;
    }
    return 'ch1';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b flex-shrink-0" style={{ background: 'oklch(0.98 0.02 85)', borderColor: 'oklch(0.86 0.04 75)' }}>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
          🎯 Practice Quiz
        </h1>
        <p className="text-sm mb-4" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
          Test your understanding across all topics.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            {['all', 'ch1', 'ch2', 'ch3'].map(id => {
              const ch = chapters.find(c => c.id === id);
              const count = id === 'all' ? allQuestions.length : allQuestions.filter(q => {
                const c = chapters.find(cc => cc.id === id);
                return c?.topics.some(t => t.id === q.topicId);
              }).length;
              return (
                <button
                  key={id}
                  onClick={() => { setSelectedChapter(id); resetQuiz(); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedChapter === id ? 'oklch(0.58 0.14 35)' : 'transparent',
                    color: selectedChapter === id ? 'white' : 'oklch(0.55 0.06 60)',
                    border: `1px solid ${selectedChapter === id ? 'oklch(0.58 0.14 35)' : 'oklch(0.82 0.06 60)'}`,
                    fontFamily: 'Lora, serif',
                  }}
                >
                  {id === 'all' ? `All (${count})` : `Ch ${ch?.number} (${count})`}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => { setShuffled(!shuffled); resetQuiz(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: shuffled ? 'oklch(0.72 0.15 65)' : 'transparent',
              color: shuffled ? 'white' : 'oklch(0.55 0.06 60)',
              border: `1px solid ${shuffled ? 'oklch(0.72 0.15 65)' : 'oklch(0.82 0.06 60)'}`,
              fontFamily: 'Lora, serif',
            }}
          >
            <Shuffle className="w-3 h-3" />
            Shuffle
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-2xl">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>No questions available.</p>
          </div>
        ) : quizCompleted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🌴</div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
              Quiz Complete!
            </h2>
            <p className="text-lg mb-6" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.45 0.06 55)' }}>
              You completed all {questions.length} questions.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-xl font-medium"
                style={{ background: 'oklch(0.58 0.14 35)', color: 'white', fontFamily: 'Lora, serif' }}
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate('progress')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium border"
                style={{ borderColor: 'oklch(0.82 0.06 60)', color: 'oklch(0.35 0.06 50)', fontFamily: 'Lora, serif' }}
              >
                <BarChart3 className="w-4 h-4" />
                View Progress
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
                  Question {quizIndex + 1} of {questions.length}
                </span>
                <span className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
                  {Math.round((quizIndex / questions.length) * 100)}% complete
                </span>
              </div>
              <div className="progress-tropical">
                <div className="progress-tropical-fill" style={{ width: `${(quizIndex / questions.length) * 100}%` }} />
              </div>
            </div>

            <QuizCard
              question={currentQuestion}
              chapterId={getChapterForQuestion(currentQuestion)}
              questionNumber={quizIndex + 1}
              totalQuestions={questions.length}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
