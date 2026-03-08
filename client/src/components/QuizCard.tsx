// QuizCard — interactive mini-test component
// Design: "Golden Hour Study Retreat" — warm feedback animations

import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { QuizQuestion } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';

interface QuizCardProps {
  question: QuizQuestion;
  chapterId: string;
  questionNumber: number;
  totalQuestions: number;
  onNext?: () => void;
}

export function QuizCard({ question, chapterId, questionNumber, totalQuestions, onNext }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { recordAnswer } = useProgress();

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === question.correctIndex;
    recordAnswer(question.id, question.topicId, chapterId, correct);
    setSubmitted(true);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    onNext?.();
  };

  const isCorrect = submitted && selected === question.correctIndex;
  const isWrong = submitted && selected !== question.correctIndex;

  return (
    <div className="quiz-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'oklch(0.92 0.06 75)', color: 'oklch(0.38 0.10 50)', fontFamily: 'Lora, serif' }}>
          Question {questionNumber} of {totalQuestions}
        </span>
        {submitted && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="mb-4 font-medium" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.22 0.04 40)', fontSize: '1rem', lineHeight: '1.6' }}>
        {question.question}
      </p>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {question.options.map((option, idx) => {
          let borderColor = 'oklch(0.86 0.04 75)';
          let bgColor = 'oklch(1 0.01 85)';
          let textColor = 'oklch(0.35 0.05 50)';

          if (submitted) {
            if (idx === question.correctIndex) {
              borderColor = 'oklch(0.55 0.12 145)';
              bgColor = 'oklch(0.95 0.06 145)';
              textColor = 'oklch(0.25 0.08 145)';
            } else if (idx === selected && idx !== question.correctIndex) {
              borderColor = 'oklch(0.65 0.15 25)';
              bgColor = 'oklch(0.96 0.04 20)';
              textColor = 'oklch(0.35 0.12 25)';
            }
          } else if (selected === idx) {
            borderColor = 'oklch(0.72 0.15 65)';
            bgColor = 'oklch(0.96 0.05 75)';
            textColor = 'oklch(0.28 0.06 40)';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className="w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-start gap-3"
              style={{
                borderColor,
                background: bgColor,
                color: textColor,
                fontFamily: 'Lora, serif',
                fontSize: '0.9rem',
                cursor: submitted ? 'default' : 'pointer',
              }}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ borderColor, color: textColor }}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {submitted && idx === question.correctIndex && (
                <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
              )}
              {submitted && idx === selected && idx !== question.correctIndex && (
                <XCircle className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {submitted && (
        <div className={isCorrect ? 'answer-correct mb-4' : 'answer-wrong mb-4'}>
          <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
            {isCorrect ? '🌟 Excellent!' : '💡 Explanation'}
          </p>
          <p className="text-sm" style={{ fontFamily: 'Lora, serif', lineHeight: '1.6' }}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
            style={{
              background: selected !== null ? 'oklch(0.58 0.14 35)' : 'oklch(0.86 0.04 75)',
              color: selected !== null ? 'white' : 'oklch(0.60 0.06 60)',
              fontFamily: 'Lora, serif',
              cursor: selected !== null ? 'pointer' : 'not-allowed',
            }}
          >
            Submit Answer
          </button>
        ) : (
          onNext && (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
              style={{
                background: 'oklch(0.58 0.14 35)',
                color: 'white',
                fontFamily: 'Lora, serif',
              }}
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
