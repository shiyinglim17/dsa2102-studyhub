// FormulaView — comprehensive formula sheet
// Design: "Golden Hour Study Retreat" — cozy desk study aesthetic

import { useState } from 'react';
import { chapters } from '@/lib/courseData';
import { FormulaBox } from '@/components/MathDisplay';
import { Star, Filter } from 'lucide-react';

interface FormulaViewProps {
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

export default function FormulaView({ onNavigate }: FormulaViewProps) {
  const [activeChapter, setActiveChapter] = useState<string>('all');
  const [keyOnly, setKeyOnly] = useState(false);

  const filteredChapters = chapters.filter(ch => activeChapter === 'all' || ch.id === activeChapter);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b flex-shrink-0" style={{ background: 'oklch(0.98 0.02 85)', borderColor: 'oklch(0.86 0.04 75)' }}>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
          📐 Formula Sheet
        </h1>
        <p className="text-sm mb-4" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
          All key formulas from Chapters 1–3. Starred formulas are highest priority for the midterm.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setKeyOnly(!keyOnly)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: keyOnly ? 'oklch(0.72 0.15 65)' : 'transparent',
              color: keyOnly ? 'white' : 'oklch(0.55 0.06 60)',
              border: `1px solid ${keyOnly ? 'oklch(0.72 0.15 65)' : 'oklch(0.82 0.06 60)'}`,
              fontFamily: 'Lora, serif',
            }}
          >
            <Star className="w-3 h-3" />
            Key Formulas Only
          </button>
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" style={{ color: 'oklch(0.55 0.06 60)' }} />
            {['all', 'ch1', 'ch2', 'ch3'].map(id => {
              const ch = chapters.find(c => c.id === id);
              return (
                <button
                  key={id}
                  onClick={() => setActiveChapter(id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: activeChapter === id ? 'oklch(0.58 0.14 35)' : 'transparent',
                    color: activeChapter === id ? 'white' : 'oklch(0.55 0.06 60)',
                    border: `1px solid ${activeChapter === id ? 'oklch(0.58 0.14 35)' : 'oklch(0.82 0.06 60)'}`,
                    fontFamily: 'Lora, serif',
                  }}
                >
                  {id === 'all' ? 'All' : `Ch ${ch?.number}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-3xl space-y-8">
        {filteredChapters.map(ch => {
          const allFormulas = ch.topics.flatMap(t => t.formulas.map(f => ({ ...f, topicTitle: t.title, topicId: t.id })));
          const formulas = keyOnly ? allFormulas.filter(f => f.isKey) : allFormulas;
          if (formulas.length === 0) return null;

          return (
            <div key={ch.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: `${ch.accentColor}20` }}>
                  {ch.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
                    Chapter {ch.number}: {ch.title}
                  </h2>
                  <p className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
                    {formulas.length} formula{formulas.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {ch.topics.map(topic => {
                const topicFormulas = keyOnly ? topic.formulas.filter(f => f.isKey) : topic.formulas;
                if (topicFormulas.length === 0) return null;
                return (
                  <div key={topic.id} className="mb-6">
                    <button
                      onClick={() => onNavigate('topic', ch.id, topic.id)}
                      className="text-sm font-medium mb-3 hover:opacity-70 transition-opacity flex items-center gap-1"
                      style={{ fontFamily: 'Lora, serif', color: ch.accentColor }}
                    >
                      {topic.lectureRef}: {topic.title} →
                    </button>
                    <div className="space-y-2">
                      {topicFormulas.map(f => (
                        <FormulaBox key={f.id} title={f.title} latex={f.latex} description={f.description} isKey={f.isKey} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
