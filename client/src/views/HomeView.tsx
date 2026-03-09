// HomeView — landing page for DSA2102 Study Hub
// Design: "Golden Hour Study Retreat" — hero with Bali treehouse image

import { chapters } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';
import { BookOpen, BarChart3, Zap, Clock } from 'lucide-react';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663399467971/gAzQjKP5PP6fvZg3ueXhxZ/hero-tropical-EZbVRMKsUfhN9PNzqD3jB5.webp';

interface HomeViewProps {
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const { getChapterMastery, getOverallMastery, getWeakTopics } = useProgress();
  const overallMastery = getOverallMastery();
  const weakTopics = getWeakTopics();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden flex-shrink-0">
        <img
          src={HERO_IMG}
          alt="Tropical study retreat"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, oklch(0.18 0.05 35 / 0.92) 0%, oklch(0.18 0.05 35 / 0.6) 50%, oklch(0.18 0.05 35 / 0.3) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'oklch(0.78 0.16 70)', fontFamily: 'Lora, serif' }}>
            DSA2102 · Numerical Computations
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.97 0.02 85)', lineHeight: 1.2 }}>
            Your Midterm<br />Study Retreat
          </h1>
          <p className="text-sm max-w-md" style={{ color: 'oklch(0.85 0.04 80)', fontFamily: 'Lora, serif', lineHeight: 1.6 }}>
            Master Chapters 1–3 with curated notes, formula cards, mini-tests, and progress tracking. Start with the <strong style={{ color: 'oklch(0.88 0.10 75)' }}>LA Primer</strong> if you need a refresher. Midterm: <strong style={{ color: 'oklch(0.88 0.10 75)' }}>10 March</strong>.
          </p>
          {overallMastery > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <div className="progress-tropical w-48">
                <div className="progress-tropical-fill" style={{ width: `${overallMastery}%` }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'oklch(0.88 0.10 75)', fontFamily: 'Lora, serif' }}>
                {overallMastery}% overall mastery
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
            Quick Start
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: BookOpen, label: 'Formula Sheet', desc: 'All key formulas', action: () => onNavigate('formulas'), color: '#1A7A8A' },
              { icon: Zap, label: 'Practice Quiz', desc: 'Test your knowledge', action: () => onNavigate('quiz'), color: '#C4622D' },
              { icon: BarChart3, label: 'My Progress', desc: 'Track mastery', action: () => onNavigate('progress'), color: '#2A5C3F' },
              { icon: Clock, label: 'Weak Topics', desc: `${weakTopics.length} need review`, action: () => onNavigate('progress'), color: '#8B4513' },
            ].map(({ icon: Icon, label, desc, action, color }) => (
              <button
                key={label}
                onClick={action}
                className="concept-card flex flex-col items-start gap-2 p-4 text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '0.95rem' }}>
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif' }}>
                    {desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Overview */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
            Midterm Chapters
          </h2>
          <div className="space-y-3">
            {chapters.map(ch => {
              const mastery = getChapterMastery(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => onNavigate('chapter', ch.id)}
                  className="w-full text-left rounded-xl overflow-hidden border transition-all duration-200 hover:shadow-lg group"
                  style={{ borderColor: 'oklch(0.86 0.04 75)' }}
                >
                  <div className="relative h-28 overflow-hidden">
                    <img src={ch.bgImage} alt={ch.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, oklch(0.18 0.05 35 / 0.88) 0%, oklch(0.18 0.05 35 / 0.5) 60%, transparent 100%)' }} />
                    <div className="absolute inset-0 flex items-center px-5">
                      <div className="flex-1">
                        <p className="text-xs mb-1" style={{ color: 'oklch(0.72 0.15 65)', fontFamily: 'Lora, serif', letterSpacing: '0.05em' }}>
                          {ch.number === 0 ? 'Pre-requisite Primer' : `Chapter ${ch.number}`} · {ch.topics.length} topics
                        </p>
                        <h3 className="text-lg font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white', lineHeight: 1.2 }}>
                          {ch.icon} {ch.title}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: 'oklch(0.78 0.04 80)', fontFamily: 'Lora, serif' }}>
                          {ch.subtitle}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right pr-2">
                        {mastery > 0 ? (
                          <div>
                            <p className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: mastery >= 75 ? 'oklch(0.75 0.15 145)' : mastery >= 40 ? 'oklch(0.88 0.10 75)' : 'oklch(0.75 0.15 25)' }}>
                              {mastery}%
                            </p>
                            <p className="text-xs" style={{ color: 'oklch(0.65 0.04 70)', fontFamily: 'Lora, serif' }}>mastery</p>
                          </div>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'oklch(0.72 0.15 65 / 0.2)', color: 'oklch(0.88 0.10 75)', fontFamily: 'Lora, serif' }}>
                            Start →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weak Topics Alert */}
        {weakTopics.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, oklch(0.96 0.04 35), oklch(0.94 0.06 30))', border: '1.5px solid oklch(0.78 0.12 35)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5" style={{ color: 'oklch(0.58 0.14 35)' }} />
              <h3 className="font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)', fontSize: '1.1rem' }}>
                Topics Needing Review
              </h3>
            </div>
            <div className="space-y-2">
              {weakTopics.slice(0, 4).map(wt => (
                <button
                  key={wt.topicId}
                  onClick={() => onNavigate('topic', wt.chapterId, wt.topicId)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
                  style={{ background: 'oklch(1 0 0 / 0.6)', fontFamily: 'Lora, serif' }}
                >
                  <span style={{ color: 'oklch(0.28 0.06 40)' }}>{wt.topicTitle}</span>
                  <span className="font-bold" style={{ color: wt.mastery < 40 ? 'oklch(0.58 0.18 25)' : 'oklch(0.65 0.15 50)' }}>
                    {wt.mastery}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Midterm Info */}
        <div className="rounded-xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, oklch(0.96 0.03 210), oklch(0.94 0.05 200))', border: '1.5px solid oklch(0.75 0.10 210)' }}>
          <h3 className="font-bold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 220)', fontSize: '1.1rem' }}>
            📋 Midterm Exam Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm" style={{ fontFamily: 'Lora, serif' }}>
            {[
              ['Date', '10 March 2026, 18:00'],
              ['Scope', 'Chapters 1–3 (L1.1–L3.8)'],
              ['Tutorials', 'Tutorials 1–5'],
              ['Format', 'Closed-book, no help-sheet'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: 'oklch(0.52 0.08 210)' }}>{label}</p>
                <p className="font-medium" style={{ color: 'oklch(0.25 0.06 220)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
