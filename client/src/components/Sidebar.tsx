// Sidebar — navigation component for DSA2102 Study Hub
// Design: "Golden Hour Study Retreat" — dark mahogany sidebar with golden accents

import { useState } from 'react';
import { BookOpen, BarChart3, Search, ChevronDown, ChevronRight, Leaf, Waves, Mountain, Home, Library } from 'lucide-react';
import { chapters } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';

interface SidebarProps {
  currentView: string;
  currentChapter: string;
  currentTopic: string;
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

const chapterIcons = [Waves, Leaf, Mountain];

export function Sidebar({ currentView, currentChapter, currentTopic, onNavigate }: SidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['ch1']));
  const { getChapterMastery, getTopicMastery } = useProgress();

  const toggleChapter = (chId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chId)) next.delete(chId);
      else next.add(chId);
      return next;
    });
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery === 0) return 'oklch(0.55 0.05 60)';
    if (mastery < 40) return 'oklch(0.65 0.15 25)';
    if (mastery < 75) return 'oklch(0.72 0.15 65)';
    return 'oklch(0.55 0.12 145)';
  };

  return (
    <aside className="flex flex-col h-full" style={{ background: 'oklch(0.22 0.05 40)', minWidth: 260, maxWidth: 280 }}>
      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b" style={{ borderColor: 'oklch(0.32 0.06 40)' }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: 'oklch(0.72 0.15 65)' }}>
            🌴
          </div>
          <div>
            <h1 className="font-bold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.92 0.04 80)', fontSize: '1.1rem', lineHeight: 1.2 }}>
              DSA2102
            </h1>
            <p className="text-xs" style={{ color: 'oklch(0.62 0.06 65)', fontFamily: 'Lora, serif' }}>
              Midterm Study Hub
            </p>
          </div>
        </div>
        <p className="text-xs mt-2 px-1" style={{ color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
          Chapters 1–3 · L1.1–L3.8 · Tuts 1–5
        </p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`nav-item w-full ${currentView === 'home' ? 'active' : ''}`}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span>Home</span>
        </button>

        {/* Progress Dashboard */}
        <button
          onClick={() => onNavigate('progress')}
          className={`nav-item w-full ${currentView === 'progress' ? 'active' : ''}`}
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0" />
          <span>Progress Dashboard</span>
        </button>

        {/* Formula Sheet */}
        <button
          onClick={() => onNavigate('formulas')}
          className={`nav-item w-full ${currentView === 'formulas' ? 'active' : ''}`}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span>Formula Sheet</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onNavigate('search')}
          className={`nav-item w-full ${currentView === 'search' ? 'active' : ''}`}
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Search Topics</span>
        </button>

        {/* Question Bank */}
        <button
          onClick={() => onNavigate('questionbank')}
          className={`nav-item w-full ${currentView === 'questionbank' ? 'active' : ''}`}
          style={currentView === 'questionbank' ? {} : { position: 'relative' }}
        >
          <Library className="w-4 h-4 flex-shrink-0" />
          <span>Question Bank</span>
          <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'oklch(0.72 0.15 65 / 0.25)', color: 'oklch(0.82 0.12 75)', fontSize: '0.65rem' }}>NEW</span>
        </button>

        {/* Divider */}
        <div className="py-2">
          <div className="h-px" style={{ background: 'oklch(0.32 0.06 40)' }} />
          <p className="text-xs mt-2 px-1 uppercase tracking-widest" style={{ color: 'oklch(0.50 0.06 60)', fontFamily: 'Lora, serif' }}>
            Chapters
          </p>
        </div>

        {/* Chapters */}
        {chapters.map((ch, idx) => {
          const Icon = chapterIcons[idx];
          const isExpanded = expandedChapters.has(ch.id);
          const chapterMastery = getChapterMastery(ch.id);

          return (
            <div key={ch.id}>
              {/* Chapter header */}
              <button
                onClick={() => {
                  toggleChapter(ch.id);
                  onNavigate('chapter', ch.id);
                }}
                className={`nav-item w-full justify-between ${currentView === 'chapter' && currentChapter === ch.id && !currentTopic ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: ch.accentColor }} />
                  <span className="truncate text-xs">
                    Ch {ch.number}: {ch.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {chapterMastery > 0 && (
                    <span className="text-xs font-bold" style={{ color: getMasteryColor(chapterMastery) }}>
                      {chapterMastery}%
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" style={{ color: 'oklch(0.55 0.06 60)' }} />
                  ) : (
                    <ChevronRight className="w-3 h-3" style={{ color: 'oklch(0.55 0.06 60)' }} />
                  )}
                </div>
              </button>

              {/* Topics */}
              {isExpanded && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {ch.topics.map(topic => {
                    const topicMastery = getTopicMastery(topic.id, ch.id);
                    const isActive = currentView === 'topic' && currentTopic === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => onNavigate('topic', ch.id, topic.id)}
                        className={`w-full text-left px-3 py-2 rounded text-xs transition-all duration-150 flex items-center justify-between gap-2 ${
                          isActive ? 'active' : ''
                        }`}
                        style={{
                          fontFamily: 'Lora, serif',
                          color: isActive ? 'oklch(0.88 0.10 75)' : 'oklch(0.65 0.04 70)',
                          background: isActive ? 'oklch(0.72 0.15 65 / 0.15)' : 'transparent',
                          border: isActive ? '1px solid oklch(0.72 0.15 65 / 0.3)' : '1px solid transparent',
                        }}
                      >
                        <span className="flex-1 min-w-0 truncate">{topic.title}</span>
                        {topicMastery > 0 && (
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: getMasteryColor(topicMastery) }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'oklch(0.32 0.06 40)' }}>
        <p className="text-xs text-center" style={{ color: 'oklch(0.45 0.05 60)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
          Midterm: 10 March · Closed-book
        </p>
      </div>
    </aside>
  );
}
