// TopicView — detailed topic content page
// Design: "Golden Hour Study Retreat" — cozy study desk aesthetic with warm cards

import { useState, useEffect } from 'react';
import { chapters, ContentBlock } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';
import { FormulaBox, MathDisplay } from '@/components/MathDisplay';
import { QuizCard } from '@/components/QuizCard';
import { ChevronLeft, BookOpen, HelpCircle, Video, AlertTriangle, Star, Code } from 'lucide-react';

interface TopicViewProps {
  chapterId: string;
  topicId: string;
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

function parseMarkdown(text: string): React.ReactNode {
  // Simple markdown parser for bold, italic, inline code, line breaks
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line === '') return <br key={i} />;
    // Bold
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} style={{ color: 'oklch(0.28 0.06 40)' }}>{part.slice(2, -2)}</strong>;
      }
      // Inline code
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, k) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return <code key={k} className="px-1 py-0.5 rounded text-xs" style={{ background: 'oklch(0.92 0.04 75)', color: 'oklch(0.32 0.08 40)', fontFamily: 'monospace' }}>{cp.slice(1, -1)}</code>;
        }
        return <span key={k}>{cp}</span>;
      });
    });
    // Check if it's a list item
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span style={{ color: 'oklch(0.72 0.15 65)', marginTop: '0.25rem', flexShrink: 0 }}>•</span>
          <span>{rendered}</span>
        </div>
      );
    }
    if (/^\d+\./.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      const rest = line.replace(/^\d+\.\s*/, '');
      const restParts = rest.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: 'oklch(0.28 0.06 40)' }}>{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: 'oklch(0.72 0.15 65 / 0.2)', color: 'oklch(0.45 0.12 55)' }}>{num}</span>
          <span>{restParts}</span>
        </div>
      );
    }
    return <p key={i} className="my-0.5">{rendered}</p>;
  });
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="my-4 leading-relaxed" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.32 0.04 50)', fontSize: '0.95rem', lineHeight: '1.75' }}>
          {parseMarkdown(block.content)}
        </div>
      );

    case 'highlight':
      return (
        <div className="my-4 px-5 py-4 rounded-xl" style={{ background: 'linear-gradient(135deg, oklch(0.96 0.04 75), oklch(0.94 0.06 70))', border: '1.5px solid oklch(0.82 0.10 70)' }}>
          {block.title && (
            <p className="font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '1.05rem' }}>
              ✨ {block.title}
            </p>
          )}
          <div className="leading-relaxed" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.32 0.04 50)', fontSize: '0.95rem', lineHeight: '1.75' }}>
            {parseMarkdown(block.content)}
          </div>
        </div>
      );

    case 'example':
      return (
        <div className="my-4 px-5 py-4 rounded-xl" style={{ background: 'linear-gradient(135deg, oklch(0.96 0.03 210), oklch(0.94 0.05 200))', border: '1.5px solid oklch(0.75 0.10 210)' }}>
          {block.title && (
            <p className="font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 220)', fontSize: '1.05rem' }}>
              <BookOpen className="w-4 h-4" /> {block.title}
            </p>
          )}
          <pre className="whitespace-pre-wrap text-sm leading-relaxed" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.28 0.06 220)', lineHeight: '1.75' }}>
            {block.content}
          </pre>
        </div>
      );

    case 'warning':
      return (
        <div className="my-4 px-5 py-4 rounded-xl flex gap-3" style={{ background: 'linear-gradient(135deg, oklch(0.96 0.04 35), oklch(0.94 0.06 30))', border: '1.5px solid oklch(0.78 0.12 35)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.58 0.14 35)' }} />
          <div>
            {block.title && (
              <p className="font-bold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '1.05rem' }}>
                {block.title}
              </p>
            )}
            <div className="text-sm leading-relaxed" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.35 0.06 40)', lineHeight: '1.7' }}>
              {parseMarkdown(block.content)}
            </div>
          </div>
        </div>
      );

    case 'formula':
      return (
        <FormulaBox
          title={block.title || 'Formula'}
          latex={block.latex || block.content}
          description={block.content !== block.latex ? block.content : undefined}
        />
      );

    case 'video':
      return (
        <div className="my-6 rounded-xl overflow-hidden" style={{ border: '1.5px solid oklch(0.82 0.06 60)' }}>
          <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'oklch(0.22 0.05 40)' }}>
            <Video className="w-4 h-4" style={{ color: 'oklch(0.72 0.15 65)' }} />
            <span className="text-sm" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.85 0.04 80)' }}>
              {block.videoTitle || 'Supplementary Video'}
            </span>
          </div>
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${block.videoId}`}
              title={block.videoTitle || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );

    case 'code':
      return (
        <div className="my-4 rounded-xl overflow-hidden" style={{ border: '1.5px solid oklch(0.32 0.06 40)' }}>
          <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'oklch(0.22 0.05 40)' }}>
            <Code className="w-4 h-4" style={{ color: 'oklch(0.72 0.15 65)' }} />
            <span className="text-xs" style={{ fontFamily: 'monospace', color: 'oklch(0.75 0.06 70)' }}>
              {block.title || 'Code'}
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm" style={{ background: 'oklch(0.18 0.04 40)', color: 'oklch(0.88 0.04 80)', fontFamily: 'monospace', lineHeight: '1.6' }}>
            {block.content}
          </pre>
        </div>
      );

    default:
      return null;
  }
}

export default function TopicView({ chapterId, topicId, onNavigate }: TopicViewProps) {
  const chapter = chapters.find(c => c.id === chapterId);
  const topic = chapter?.topics.find(t => t.id === topicId);
  const { getTopicMastery, markTopicVisited, chapterProgress } = useProgress();
  const [activeTab, setActiveTab] = useState<'content' | 'formulas' | 'quiz'>('content');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (topic) {
      markTopicVisited(topicId, chapterId);
      setQuizIndex(0);
      setQuizCompleted(false);
      setActiveTab('content');
    }
  }, [topicId, chapterId]);

  if (!chapter || !topic) return <div className="p-8">Topic not found.</div>;

  const mastery = getTopicMastery(topicId, chapterId);
  const tp = chapterProgress[chapterId]?.topicProgress[topicId];

  const handleNextQuiz = () => {
    if (quizIndex < topic.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const getMasteryColor = (m: number) => {
    if (m === 0) return 'oklch(0.55 0.05 60)';
    if (m < 40) return 'oklch(0.65 0.15 25)';
    if (m < 75) return 'oklch(0.72 0.15 65)';
    return 'oklch(0.55 0.12 145)';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Topic Header */}
      <div className="px-6 py-5 border-b flex-shrink-0" style={{ background: 'oklch(0.98 0.02 85)', borderColor: 'oklch(0.86 0.04 75)' }}>
        <button
          onClick={() => onNavigate('chapter', chapterId)}
          className="flex items-center gap-1.5 text-sm mb-3 hover:opacity-70 transition-opacity"
          style={{ color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Chapter {chapter.number}: {chapter.title}
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${chapter.accentColor}20`, color: chapter.accentColor, fontFamily: 'Lora, serif' }}>
                {topic.lectureRef}
              </span>
              {mastery > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: `${getMasteryColor(mastery)}20`, color: getMasteryColor(mastery), fontFamily: 'Lora, serif' }}>
                  <Star className="w-3 h-3" /> {mastery}% mastery
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
              {topic.title}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'content', label: 'Study Notes', icon: BookOpen },
            { id: 'formulas', label: `Formulas (${topic.formulas.length})`, icon: Star },
            { id: 'quiz', label: `Quiz (${topic.quiz.length})`, icon: HelpCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id as typeof activeTab);
                if (id === 'quiz') { setQuizIndex(0); setQuizCompleted(false); }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                fontFamily: 'Lora, serif',
                background: activeTab === id ? 'oklch(0.58 0.14 35)' : 'transparent',
                color: activeTab === id ? 'white' : 'oklch(0.55 0.06 60)',
                border: activeTab === id ? 'none' : '1px solid oklch(0.86 0.04 75)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 max-w-3xl">
        {activeTab === 'content' && (
          <div>
            {topic.content.map((block, idx) => (
              <ContentBlockRenderer key={idx} block={block} />
            ))}
          </div>
        )}

        {activeTab === 'formulas' && (
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
              Key Formulas — {topic.title}
            </h2>
            {topic.formulas.length === 0 ? (
              <p style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>No formulas for this topic.</p>
            ) : (
              <div className="space-y-2">
                {topic.formulas.map(f => (
                  <FormulaBox key={f.id} title={f.title} latex={f.latex} description={f.description} isKey={f.isKey} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
              Mini-Test — {topic.title}
            </h2>

            {/* Progress bar */}
            {tp && tp.questionsAttempted > 0 && (
              <div className="mb-4 p-3 rounded-lg" style={{ background: 'oklch(0.96 0.04 75)', border: '1px solid oklch(0.86 0.10 70)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.45 0.06 55)' }}>
                    Your record: {tp.questionsCorrect}/{tp.questionsAttempted} correct
                  </span>
                  <span className="text-xs font-bold" style={{ color: getMasteryColor(mastery), fontFamily: 'Lora, serif' }}>
                    {mastery}% mastery
                  </span>
                </div>
                <div className="progress-tropical">
                  <div className="progress-tropical-fill" style={{ width: `${mastery}%` }} />
                </div>
              </div>
            )}

            {quizCompleted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🌴</div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
                  Quiz Complete!
                </h3>
                <p className="mb-4" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.45 0.06 55)' }}>
                  Your mastery for this topic is now <strong style={{ color: getMasteryColor(mastery) }}>{mastery}%</strong>
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setQuizIndex(0); setQuizCompleted(false); }}
                    className="px-5 py-2.5 rounded-lg font-medium text-sm"
                    style={{ background: 'oklch(0.58 0.14 35)', color: 'white', fontFamily: 'Lora, serif' }}
                  >
                    Retry Quiz
                  </button>
                  <button
                    onClick={() => onNavigate('chapter', chapterId)}
                    className="px-5 py-2.5 rounded-lg font-medium text-sm border"
                    style={{ borderColor: 'oklch(0.82 0.06 60)', color: 'oklch(0.35 0.06 50)', fontFamily: 'Lora, serif' }}
                  >
                    Back to Chapter
                  </button>
                </div>
              </div>
            ) : topic.quiz.length > 0 ? (
              <QuizCard
                question={topic.quiz[quizIndex]}
                chapterId={chapterId}
                questionNumber={quizIndex + 1}
                totalQuestions={topic.quiz.length}
                onNext={handleNextQuiz}
              />
            ) : (
              <p style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>No quiz questions for this topic yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
