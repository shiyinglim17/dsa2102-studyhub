// SearchView — search across all topics, formulas, and quiz questions
// Design: "Golden Hour Study Retreat" — warm search interface

import { useState, useMemo } from 'react';
import { chapters, allFormulas, allQuestions } from '@/lib/courseData';
import { Search, BookOpen, Star, HelpCircle, ChevronRight } from 'lucide-react';

interface SearchViewProps {
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

interface SearchResult {
  type: 'topic' | 'formula' | 'question';
  title: string;
  subtitle: string;
  chapterId: string;
  topicId: string;
  highlight?: string;
}

export default function SearchView({ onNavigate }: SearchViewProps) {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();

    const res: SearchResult[] = [];

    // Search topics
    for (const ch of chapters) {
      for (const topic of ch.topics) {
        if (topic.title.toLowerCase().includes(q) || topic.lectureRef.toLowerCase().includes(q)) {
          res.push({
            type: 'topic',
            title: topic.title,
            subtitle: `Chapter ${ch.number} · ${topic.lectureRef}`,
            chapterId: ch.id,
            topicId: topic.id,
          });
        }
        // Search content blocks
        for (const block of topic.content) {
          if (block.content.toLowerCase().includes(q) || (block.title && block.title.toLowerCase().includes(q))) {
            const idx = block.content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 40);
            const end = Math.min(block.content.length, idx + q.length + 60);
            const highlight = (start > 0 ? '...' : '') + block.content.slice(start, end) + (end < block.content.length ? '...' : '');
            if (!res.find(r => r.topicId === topic.id && r.type === 'topic')) {
              res.push({
                type: 'topic',
                title: topic.title,
                subtitle: `Chapter ${ch.number} · ${topic.lectureRef}`,
                chapterId: ch.id,
                topicId: topic.id,
                highlight,
              });
            }
          }
        }
      }
    }

    // Search formulas
    for (const f of allFormulas) {
      if (f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
        // Find which topic/chapter this formula belongs to
        for (const ch of chapters) {
          for (const topic of ch.topics) {
            if (topic.formulas.find(tf => tf.id === f.id)) {
              res.push({
                type: 'formula',
                title: f.title,
                subtitle: `${topic.title} · ${topic.lectureRef}`,
                chapterId: ch.id,
                topicId: topic.id,
                highlight: f.description,
              });
            }
          }
        }
      }
    }

    // Search quiz questions
    for (const q2 of allQuestions) {
      if (q2.question.toLowerCase().includes(q) || q2.explanation.toLowerCase().includes(q)) {
        for (const ch of chapters) {
          for (const topic of ch.topics) {
            if (topic.quiz.find(tq => tq.id === q2.id)) {
              res.push({
                type: 'question',
                title: q2.question.slice(0, 80) + (q2.question.length > 80 ? '...' : ''),
                subtitle: `Quiz · ${topic.title}`,
                chapterId: ch.id,
                topicId: topic.id,
              });
            }
          }
        }
      }
    }

    return res.slice(0, 20);
  }, [query]);

  const typeConfig = {
    topic: { icon: BookOpen, color: 'oklch(0.38 0.12 210)', label: 'Topic' },
    formula: { icon: Star, color: 'oklch(0.72 0.15 65)', label: 'Formula' },
    question: { icon: HelpCircle, color: 'oklch(0.58 0.14 35)', label: 'Quiz' },
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b flex-shrink-0" style={{ background: 'oklch(0.98 0.02 85)', borderColor: 'oklch(0.86 0.04 75)' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
          🔍 Search Topics
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'oklch(0.55 0.06 60)' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics, formulas, concepts..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
            style={{
              background: 'white',
              borderColor: 'oklch(0.82 0.06 60)',
              fontFamily: 'Lora, serif',
              color: 'oklch(0.28 0.04 50)',
            }}
            autoFocus
          />
        </div>
        {query.length >= 2 && (
          <p className="text-xs mt-2" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
      </div>

      <div className="p-6 md:p-8">
        {query.length < 2 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌴</div>
            <p className="text-lg font-semibold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.35 0.05 50)' }}>
              Search the Study Hub
            </p>
            <p className="text-sm" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
              Type at least 2 characters to search topics, formulas, and quiz questions.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['condition number', 'LU factorization', 'floating point', 'Gram-Schmidt', 'normal equations', 'Cholesky'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full text-xs border transition-colors hover:opacity-70"
                  style={{ borderColor: 'oklch(0.82 0.06 60)', color: 'oklch(0.45 0.06 55)', fontFamily: 'Lora, serif', background: 'oklch(0.97 0.02 85)' }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌊</div>
            <p className="text-lg font-semibold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.35 0.05 50)' }}>
              No results found
            </p>
            <p className="text-sm" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
              Try different keywords or browse chapters directly.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((result, idx) => {
              const { icon: Icon, color, label } = typeConfig[result.type];
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate('topic', result.chapterId, result.topicId)}
                  className="w-full text-left rounded-xl border p-4 transition-all hover:shadow-md group"
                  style={{ background: 'oklch(1 0.01 85)', borderColor: 'oklch(0.86 0.04 75)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${color}15`, color, fontFamily: 'Lora, serif' }}>
                          {label}
                        </span>
                        <span className="text-xs" style={{ color: 'oklch(0.60 0.04 60)', fontFamily: 'Lora, serif' }}>
                          {result.subtitle}
                        </span>
                      </div>
                      <p className="font-semibold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)', fontSize: '0.95rem' }}>
                        {result.title}
                      </p>
                      {result.highlight && (
                        <p className="text-xs mt-1 line-clamp-2" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.50 0.04 55)', lineHeight: '1.5' }}>
                          {result.highlight}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" style={{ color: 'oklch(0.65 0.06 60)' }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
