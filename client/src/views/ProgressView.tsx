// ProgressView — mastery dashboard with weak topic drill-down and practice progress
// Design: "Golden Hour Study Retreat" — warm progress cards with nature-themed mastery levels
// MASTERY: Quiz-only (100% correct = 100%). Bank practice tracked separately below.

import { chapters, allQuestions } from '@/lib/courseData';
import { useProgress } from '@/contexts/ProgressContext';
import { BarChart3, Target, AlertTriangle, CheckCircle, RefreshCw, ChevronRight, BookOpen, Info } from 'lucide-react';

interface ProgressViewProps {
  onNavigate: (view: string, chapterId?: string, topicId?: string) => void;
}

const PROGRESS_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663399467971/gAzQjKP5PP6fvZg3ueXhxZ/progress-bg-9sMmhGbFt3BXJNZ4FMHQBV.webp';

export default function ProgressView({ onNavigate }: ProgressViewProps) {
  const {
    chapterProgress,
    getTopicMastery,
    getChapterMastery,
    getOverallMastery,
    getWeakTopics,
    resetProgress,
    getTotalBankAttempted,
    getBankProgressByGroup,
  } = useProgress();

  const overallMastery = getOverallMastery();
  const weakTopics = getWeakTopics();
  const bankGroups = getBankProgressByGroup();

  const getMasteryLabel = (m: number) => {
    if (m === 0) return { label: 'Not Started', color: 'oklch(0.55 0.05 60)', emoji: '🌱' };
    if (m < 40) return { label: 'Learning', color: 'oklch(0.65 0.15 25)', emoji: '🌿' };
    if (m < 80) return { label: 'Practicing', color: 'oklch(0.72 0.15 65)', emoji: '🌴' };
    if (m < 100) return { label: 'Almost Mastered', color: 'oklch(0.60 0.14 145)', emoji: '🌟' };
    return { label: 'Mastered!', color: 'oklch(0.45 0.14 145)', emoji: '🏆' };
  };

  const totalQuestions = allQuestions.length;
  const totalAttempted = Object.values(chapterProgress).reduce((acc, ch) =>
    acc + Object.values(ch.topicProgress).reduce((a, t) => a + t.questionsAttempted, 0), 0);
  const totalCorrect = Object.values(chapterProgress).reduce((acc, ch) =>
    acc + Object.values(ch.topicProgress).reduce((a, t) => a + t.questionsCorrect, 0), 0);
  const totalBankAttempted = getTotalBankAttempted();
  const totalBankQuestions = bankGroups.reduce((a, g) => a + g.total, 0);

  // Group bank progress by chapter
  const ch1Bank = bankGroups.filter(g => g.chapterRef === 'Chapter 1');
  const ch2Bank = bankGroups.filter(g => g.chapterRef === 'Chapter 2');
  const ch3Bank = bankGroups.filter(g => g.chapterRef === 'Chapter 3');
  const allChBank = bankGroups.filter(g => g.chapterRef === 'All Chapters');

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img src={PROGRESS_BG} alt="Progress" className="w-full h-full object-cover" style={{ objectPosition: 'center 60%' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, oklch(0.15 0.05 35 / 0.92) 0%, oklch(0.15 0.05 35 / 0.7) 60%, oklch(0.15 0.05 35 / 0.4) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5" style={{ color: 'oklch(0.72 0.15 65)' }} />
            <p className="text-xs uppercase tracking-widest" style={{ color: 'oklch(0.72 0.15 65)', fontFamily: 'Lora, serif' }}>
              Progress Dashboard
            </p>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'white' }}>
            Your Mastery Journey
          </h1>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">

        {/* How mastery is calculated — transparent explanation */}
        <div className="rounded-xl p-4 flex gap-3" style={{ background: 'oklch(0.96 0.04 210)', border: '1px solid oklch(0.82 0.08 210)' }}>
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.45 0.12 210)' }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.08 210)', fontSize: '0.95rem' }}>
              How to reach 100% mastery
            </p>
            <p className="text-xs leading-relaxed" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.38 0.06 210)' }}>
              Mastery is based <strong>entirely on your quiz performance</strong> in each topic's Quiz tab.
              Score = <strong>80% accuracy</strong> (questions correct ÷ questions attempted) + <strong>20% coverage</strong> (questions attempted ÷ total questions in topic).
              Answering all questions correctly gives <strong>100%</strong>. Question Bank practice is tracked separately below and does not affect this score.
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Overall Mastery', value: `${overallMastery}%`, icon: Target, color: 'oklch(0.58 0.14 35)' },
            { label: `Quiz Answered`, value: `${totalAttempted}/${totalQuestions}`, icon: BarChart3, color: 'oklch(0.38 0.12 210)' },
            { label: 'Quiz Correct', value: totalAttempted > 0 ? `${Math.round(totalCorrect / totalAttempted * 100)}%` : '—', icon: CheckCircle, color: 'oklch(0.55 0.12 145)' },
            { label: 'Weak Topics', value: weakTopics.length.toString(), icon: AlertTriangle, color: 'oklch(0.65 0.15 25)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="concept-card p-4">
              <Icon className="w-5 h-5 mb-2" style={{ color }} />
              <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)' }}>
                {value}
              </p>
              <p className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="concept-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
              Overall Quiz Mastery
            </h2>
            <span className="text-sm font-bold" style={{ color: getMasteryLabel(overallMastery).color, fontFamily: 'Lora, serif' }}>
              {getMasteryLabel(overallMastery).emoji} {getMasteryLabel(overallMastery).label}
            </span>
          </div>
          <div className="progress-tropical h-4 mb-2">
            <div className="progress-tropical-fill" style={{ width: `${overallMastery}%`, height: '100%' }} />
          </div>
          <p className="text-xs text-right" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
            {overallMastery}% — complete all topic quizzes with 100% accuracy to reach 100%
          </p>
        </div>

        {/* Chapter Breakdown */}
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
            Chapter Breakdown
          </h2>
          <p className="text-xs mb-4" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
            Click any topic to go directly to its study notes and quiz.
          </p>
          <div className="space-y-4">
            {chapters.map(ch => {
              const chMastery = getChapterMastery(ch.id);
              const { label, color, emoji } = getMasteryLabel(chMastery);
              return (
                <div key={ch.id} className="concept-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)', fontSize: '1.05rem' }}>
                        {ch.icon} Chapter {ch.number}: {ch.title}
                      </h3>
                      <p className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
                        {ch.topics.length} topics
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color }}>
                        {chMastery}%
                      </p>
                      <p className="text-xs" style={{ fontFamily: 'Lora, serif', color }}>
                        {emoji} {label}
                      </p>
                    </div>
                  </div>
                  <div className="progress-tropical mb-3">
                    <div className="progress-tropical-fill" style={{ width: `${chMastery}%` }} />
                  </div>

                  {/* Topic breakdown */}
                  <div className="space-y-2 mt-3">
                    {ch.topics.map(topic => {
                      const tMastery = getTopicMastery(topic.id, ch.id);
                      const tp = chapterProgress[ch.id]?.topicProgress[topic.id];
                      const { color: tColor, emoji: tEmoji } = getMasteryLabel(tMastery);
                      const topicQs = allQuestions.filter(q => q.topicId === topic.id);
                      return (
                        <button
                          key={topic.id}
                          onClick={() => onNavigate('topic', ch.id, topic.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:opacity-80 text-left"
                          style={{ background: 'oklch(0.97 0.02 85)' }}
                        >
                          <span className="text-sm">{tEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium truncate" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.32 0.04 50)' }}>
                                {topic.title}
                              </span>
                              <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: tColor, fontFamily: 'Lora, serif' }}>
                                {tMastery > 0 ? `${tMastery}%` : '—'}
                              </span>
                            </div>
                            <div className="progress-tropical h-1.5">
                              <div className="progress-tropical-fill" style={{ width: `${tMastery}%`, height: '100%' }} />
                            </div>
                            {tp && tp.questionsAttempted > 0 && (
                              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.60 0.04 60)', fontFamily: 'Lora, serif' }}>
                                {tp.questionsCorrect}/{tp.questionsAttempted} quiz correct
                                {' '}({topicQs.length} total questions)
                              </p>
                            )}
                            {tp && tp.questionsAttempted === 0 && (
                              <p className="text-xs mt-0.5 italic" style={{ color: 'oklch(0.68 0.04 60)', fontFamily: 'Lora, serif' }}>
                                Not attempted — go to Quiz tab to start
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.65 0.06 60)' }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
              🎯 Focus Areas — Weak Topics
            </h2>
            <p className="text-xs mb-4" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
              Topics where quiz score is below 80%. Click to revisit the notes and retake the quiz.
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid oklch(0.78 0.12 35)' }}>
              {weakTopics.map((wt, idx) => {
                const ch = chapters.find(c => c.id === wt.chapterId);
                const tp = chapterProgress[wt.chapterId]?.topicProgress[wt.topicId];
                const topicQs = allQuestions.filter(q => q.topicId === wt.topicId);
                const wrongQIds = tp?.weakAreas || [];
                const wrongQs = topicQs.filter(q => wrongQIds.includes(q.id));
                return (
                  <div key={wt.topicId} className={idx > 0 ? 'border-t' : ''} style={{ borderColor: 'oklch(0.86 0.06 50)' }}>
                    <button
                      onClick={() => onNavigate('topic', wt.chapterId, wt.topicId)}
                      className="w-full flex items-start gap-4 p-4 text-left hover:opacity-80 transition-opacity"
                      style={{ background: idx % 2 === 0 ? 'oklch(0.97 0.03 35)' : 'oklch(0.96 0.04 35)' }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: 'oklch(0.65 0.15 25 / 0.15)', color: 'oklch(0.58 0.15 25)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                        {wt.mastery}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)', fontSize: '0.95rem' }}>
                          {wt.topicTitle}
                        </p>
                        <p className="text-xs" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
                          {ch?.title} · {tp?.questionsCorrect}/{tp?.questionsAttempted} quiz correct · {topicQs.length} total questions
                        </p>
                        {wrongQs.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.45 0.08 35)' }}>
                              Questions to revisit:
                            </p>
                            {wrongQs.slice(0, 2).map(q => (
                              <p key={q.id} className="text-xs pl-2 border-l-2" style={{ borderColor: 'oklch(0.65 0.15 25)', color: 'oklch(0.40 0.06 45)', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
                                "{q.question.slice(0, 80)}..."
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'oklch(0.65 0.06 60)' }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PRACTICE PROGRESS ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5" style={{ color: 'oklch(0.45 0.12 145)' }} />
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
              Practice Progress — Question Bank
            </h2>
          </div>
          <p className="text-xs mb-4" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.55 0.06 60)' }}>
            Tracks how many past-year and tutorial questions you have attempted per topic group.
            This does <em>not</em> affect your mastery score — it is a separate practice tracker.
            <strong> {totalBankAttempted}/{totalBankQuestions}</strong> questions attempted overall.
          </p>

          {/* Overall bank progress bar */}
          <div className="concept-card p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.28 0.06 40)' }}>
                Overall Practice Coverage
              </span>
              <span className="text-sm font-bold" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.45 0.12 145)' }}>
                {totalBankAttempted}/{totalBankQuestions}
              </span>
            </div>
            <div className="rounded-full overflow-hidden h-3" style={{ background: 'oklch(0.90 0.04 145)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalBankQuestions > 0 ? Math.round(totalBankAttempted / totalBankQuestions * 100) : 0}%`,
                  background: 'linear-gradient(to right, oklch(0.55 0.14 145), oklch(0.45 0.16 160))',
                }}
              />
            </div>
          </div>

          {/* Per-chapter bank groups */}
          {[
            { label: 'Chapter 1 — Scientific Computing', groups: ch1Bank, color: 'oklch(0.55 0.14 210)' },
            { label: 'Chapter 2 — Linear Systems', groups: ch2Bank, color: 'oklch(0.45 0.14 145)' },
            { label: 'Chapter 3 — Least Squares', groups: ch3Bank, color: 'oklch(0.58 0.14 35)' },
            { label: 'All Chapters — Mixed Topics', groups: allChBank, color: 'oklch(0.55 0.12 280)' },
          ].map(({ label, groups, color }) => {
            if (groups.length === 0) return null;
            const groupTotal = groups.reduce((a, g) => a + g.total, 0);
            const groupAttempted = groups.reduce((a, g) => a + g.attempted, 0);
            return (
              <div key={label} className="concept-card p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'oklch(0.22 0.05 40)', fontSize: '0.95rem' }}>
                    {label}
                  </h3>
                  <span className="text-xs font-bold" style={{ fontFamily: 'Lora, serif', color }}>
                    {groupAttempted}/{groupTotal} done
                  </span>
                </div>
                <div className="space-y-3">
                  {groups.map(g => {
                    const pct = g.total > 0 ? Math.round(g.attempted / g.total * 100) : 0;
                    return (
                      <div key={g.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs flex items-center gap-1.5" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.38 0.04 50)' }}>
                            <span>{g.icon}</span>
                            {g.label}
                          </span>
                          <span className="text-xs font-semibold" style={{ fontFamily: 'Lora, serif', color: g.attempted === g.total && g.total > 0 ? 'oklch(0.45 0.14 145)' : 'oklch(0.55 0.06 60)' }}>
                            {g.attempted}/{g.total}
                            {g.attempted === g.total && g.total > 0 && ' ✓'}
                          </span>
                        </div>
                        <div className="rounded-full overflow-hidden h-2" style={{ background: 'oklch(0.92 0.03 85)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: pct === 100
                                ? 'linear-gradient(to right, oklch(0.55 0.14 145), oklch(0.45 0.16 160))'
                                : `linear-gradient(to right, ${color}, ${color.replace(')', ' / 0.7)')})`,
                            }}
                          />
                        </div>
                        {g.revealed > 0 && (
                          <p className="text-xs mt-0.5" style={{ fontFamily: 'Lora, serif', color: 'oklch(0.65 0.04 60)' }}>
                            {g.revealed} solution{g.revealed !== 1 ? 's' : ''} revealed
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        <div className="flex justify-end pb-6">
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) resetProgress();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors hover:opacity-70"
            style={{ borderColor: 'oklch(0.82 0.06 60)', color: 'oklch(0.55 0.06 60)', fontFamily: 'Lora, serif' }}
          >
            <RefreshCw className="w-4 h-4" />
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
}
