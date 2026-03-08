// ChapterView — chapter overview page
// Design: "Golden Hour Study Retreat" — chapter hero with nature photo

import { chapters } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';
import { ChevronRight, BookOpen, HelpCircle } from 'lucide-react';

interface ChapterViewProps {
  chapterId: string;
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

export default function ChapterView({ chapterId, onNavigate }: ChapterViewProps) {
  const chapter = chapters.find(c => c.id === chapterId);
  const { getTopicMastery, getChapterMastery } = useProgress();

  if (!chapter) return <div className="p-8">Chapter not found.</div>;

  const chapterMastery = getChapterMastery(chapterId);

  const getMasteryLabel = (m: number) => {
    if (m === 0) return { label: 'Not started', color: 'oklch(0.55 0.05 60)' };
    if (m < 40) return { label: 'Learning', color: 'oklch(0.65 0.15 25)' };
    if (m < 75) return { label: 'Practicing', color: 'oklch(0.72 0.15 65)' };
    return { label: 'Mastered', color: 'oklch(0.55 0.12 145)' };
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Chapter Hero */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img src={chapter.bgImage} alt={chapter.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, oklch(0.15 0.05 35 / 0.92) 0%, oklch(0.15 0.05 35 / 0.65) 55%, oklch(0.15 0.05 35 / 0.3) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-6">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'oklch(0.72 0.15 65)', fontFamily: 'Lora, serif' }}>
            Chapter {chapter.number}
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white' }}>
            {chapter.icon} {chapter.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'oklch(0.80 0.04 80)', fontFamily: 'Lora, serif' }}>
            {chapter.subtitle}
          </p>
          {chapterMastery > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <div className="progress-tropical w-40">
                <div className="progress-tropical-fill" style={{ width: `${chapterMastery}%` }} />
              </div>
              <span className="text-sm" style={{ color: 'oklch(0.88 0.10 75)', fontFamily: 'Lora, serif' }}>
                {chapterMastery}% mastery
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Topics List */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
            Topics in this Chapter
          </h2>
          <div className="space-y-3">
            {chapter.topics.map((topic, idx) => {
              const mastery = getTopicMastery(topic.id, chapterId);
              const { label, color } = getMasteryLabel(mastery);
              return (
                <button
                  key={topic.id}
                  onClick={() => onNavigate('topic', chapterId, topic.id)}
                  className="w-full text-left rounded-xl border p-4 transition-all duration-200 hover:shadow-md group"
                  style={{ background: 'oklch(1 0.01 85)', borderColor: 'oklch(0.86 0.04 75)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mt-0.5"
                        style={{ background: `${chapter.accentColor}20`, color: chapter.accentColor, fontFamily: 'Cormorant Garamond, serif' }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '1.05rem' }}>
                          {topic.title}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif' }}>
                          {topic.lectureRef} · {topic.formulas.length} formulas · {topic.quiz.length} quiz questions
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                            <span className="text-xs" style={{ color, fontFamily: 'Lora, serif' }}>{label}</span>
                          </div>
                          {mastery > 0 && (
                            <div className="progress-tropical w-24">
                              <div className="progress-tropical-fill" style={{ width: `${mastery}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" style={{ color: 'oklch(0.65 0.06 60)' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapter Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('quiz', chapterId)}
            className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
            style={{ background: 'oklch(0.96 0.04 35)', borderColor: 'oklch(0.78 0.12 35)' }}
          >
            <HelpCircle className="w-5 h-5" style={{ color: 'oklch(0.58 0.14 35)' }} />
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '0.95rem' }}>
                Chapter Quiz
              </p>
              <p className="text-xs" style={{ color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif' }}>
                {chapter.topics.reduce((acc, t) => acc + t.quiz.length, 0)} questions
              </p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('formulas')}
            className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
            style={{ background: 'oklch(0.96 0.03 210)', borderColor: 'oklch(0.75 0.10 210)' }}
          >
            <BookOpen className="w-5 h-5" style={{ color: 'oklch(0.38 0.12 210)' }} />
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '0.95rem' }}>
                Formula Sheet
              </p>
              <p className="text-xs" style={{ color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif' }}>
                {chapter.topics.reduce((acc, t) => acc + t.formulas.length, 0)} formulas
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
