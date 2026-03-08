// QuestionBankView.tsx
// Design: Tropical Golden Hour Study Retreat
// Consolidated question bank from past year papers (2223s2, 2324s1, 2425s2, 2526s1) and MA2213 2324s2
// Three modes per question: Attempt | Guide | Solution

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Lightbulb, CheckCircle2, ChevronDown, ChevronUp,
  Filter, Search, RotateCcw, Star, Trophy, Target, Eye, EyeOff,
  BookMarked, Layers, Clock, AlertCircle, CheckCheck
} from 'lucide-react';
import { questionGroups, allBankQuestions, type BankQuestion, type QuestionType, difficultyColors } from '@/lib/questionBankData';
import { useProgress } from '@/contexts/ProgressContext';
import 'katex/dist/katex.min.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'attempt' | 'guide' | 'solution';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

interface QuestionState {
  mode: Mode;
  attempted: boolean;
  revealed: boolean;
  userAnswer: string;
}

// ─── Markdown-like renderer (simple) ─────────────────────────────────────────

function renderText(text: string) {
  if (!text) return null;
  // Split by newlines, render bold/code
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-semibold text-amber-800">{part.slice(2, -2)}</strong>;
      }
      // Code: `text`
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, k) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return <code key={k} className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-sm font-mono">{cp.slice(1, -1)}</code>;
        }
        return <span key={k}>{cp}</span>;
      });
    });
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ─── Single Question Card ─────────────────────────────────────────────────────

function QuestionCard({ question, index }: { question: BankQuestion; index: number }) {
  const [state, setState] = useState<QuestionState>({
    mode: 'attempt',
    attempted: false,
    revealed: false,
    userAnswer: '',
  });
  const [expanded, setExpanded] = useState(false);
  const { recordBankAttempt } = useProgress();

  const diffClass = difficultyColors[question.difficulty];

  function handleReveal() {
    if (!state.revealed) {
      // Only record once when first revealed
      recordBankAttempt(question.type, question.id, true);
    }
    setState(s => ({ ...s, revealed: true, attempted: true }));
  }

  function handleMarkAttempted() {
    if (!state.attempted) {
      recordBankAttempt(question.type, question.id, false);
    }
    setState(s => ({ ...s, attempted: true }));
  }

  function handleReset() {
    setState({ mode: 'attempt', attempted: false, revealed: false, userAnswer: '' });
  }

  const modeButtonClass = (m: Mode) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
      state.mode === m
        ? 'bg-amber-600 text-white shadow-md'
        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Index badge */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffClass}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              {question.source}
            </span>
            <span className="text-xs text-stone-400 font-mono">{question.qnum}</span>
            {state.attempted && (
              <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCheck className="w-3 h-3" /> Attempted
              </span>
            )}
          </div>

          {/* Topic */}
          <p className="text-sm font-semibold text-stone-800 leading-snug">
            {question.topic}
          </p>

          {/* Question preview (first line) */}
          {!expanded && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
              {question.question.split('\n')[0]}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-stone-400 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-amber-50">
              {/* Mode switcher */}
              <div className="flex items-center gap-2 mt-3 mb-4 flex-wrap">
                <span className="text-xs text-stone-500 font-medium mr-1">Mode:</span>
                <button className={modeButtonClass('attempt')} onClick={() => setState(s => ({ ...s, mode: 'attempt' }))}>
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Attempt</span>
                </button>
                <button className={modeButtonClass('guide')} onClick={() => setState(s => ({ ...s, mode: 'guide' }))}>
                  <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Guide</span>
                </button>
                <button className={modeButtonClass('solution')} onClick={() => setState(s => ({ ...s, mode: 'solution' }))}>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Solution</span>
                </button>
                {state.attempted && (
                  <button
                    className="ml-auto text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1 transition-colors"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Question text (always shown) */}
              <div className="bg-amber-50/60 rounded-xl p-4 mb-3 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Question</span>
                </div>
                <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-serif">
                  {renderText(question.question)}
                </div>
              </div>

              {/* Mode content */}
              <AnimatePresence mode="wait">
                {state.mode === 'attempt' && (
                  <motion.div
                    key="attempt"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-3"
                  >
                    <div className="bg-white rounded-xl border border-stone-200 p-3">
                      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">
                        Your Working / Answer
                      </label>
                      <textarea
                        className="w-full text-sm text-stone-800 bg-transparent resize-none outline-none placeholder:text-stone-300 min-h-[80px] font-mono"
                        placeholder="Write your working here... (not saved)"
                        value={state.userAnswer}
                        onChange={e => setState(s => ({ ...s, userAnswer: e.target.value }))}
                      />
                    </div>
                    <button
                      onClick={handleReveal}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Reveal Solution & Mark as Attempted
                    </button>
                    {state.revealed && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Solution</span>
                        </div>
                        <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-serif">
                          {question.solution ? renderText(question.solution) : (
                            <span className="text-stone-400 italic">Solution not available for this question. Refer to the official solutions PDF.</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {state.mode === 'guide' && (
                  <motion.div
                    key="guide"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">How to Solve This Type</span>
                    </div>
                    <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                      {renderText(question.guide)}
                    </div>
                  </motion.div>
                )}

                {state.mode === 'solution' && (
                  <motion.div
                    key="solution"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Full Solution</span>
                    </div>
                    <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-serif">
                      {question.solution ? renderText(question.solution) : (
                        <span className="text-stone-400 italic">Solution not available for this question. Refer to the official solutions PDF.</span>
                      )}
                    </div>
                    {!state.attempted && (
                      <button
                        onClick={handleMarkAttempted}
                        className="mt-3 text-xs text-green-600 hover:text-green-700 flex items-center gap-1 font-semibold"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark as reviewed
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Question Group Panel ─────────────────────────────────────────────────────

function GroupPanel({ group, searchQuery, difficultyFilter }: {
  group: typeof questionGroups[0];
  searchQuery: string;
  difficultyFilter: DifficultyFilter;
}) {
  const [open, setOpen] = useState(false);

  const filteredQuestions = useMemo(() => {
    return group.questions.filter(q => {
      const matchesDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
      const matchesSearch = !searchQuery ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDiff && matchesSearch;
    });
  }, [group.questions, searchQuery, difficultyFilter]);

  if (filteredQuestions.length === 0) return null;

  const easyCount = filteredQuestions.filter(q => q.difficulty === 'easy').length;
  const medCount = filteredQuestions.filter(q => q.difficulty === 'medium').length;
  const hardCount = filteredQuestions.filter(q => q.difficulty === 'hard').length;

  return (
    <div className="rounded-2xl overflow-hidden border border-amber-100 shadow-sm">
      {/* Group header */}
      <button
        className="w-full flex items-center gap-3 p-4 bg-white/95 hover:bg-amber-50/50 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-white text-lg shadow-sm flex-shrink-0`}>
          {group.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-stone-800 text-sm">{group.label}</h3>
            <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{group.chapterRef}</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{group.description}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-semibold text-stone-600">{filteredQuestions.length} questions</span>
            {easyCount > 0 && <span className="text-xs text-green-600">{easyCount} easy</span>}
            {medCount > 0 && <span className="text-xs text-amber-600">{medCount} medium</span>}
            {hardCount > 0 && <span className="text-xs text-red-600">{hardCount} hard</span>}
          </div>
        </div>
        <div className="flex-shrink-0 text-stone-400">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Questions list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-amber-50/30"
          >
            <div className="p-3 space-y-2">
              {filteredQuestions.map((q, i) => (
                <QuestionCard key={q.id} question={q} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function QuestionBankView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [expandAll, setExpandAll] = useState(false);

  const totalQuestions = allBankQuestions.length;
  const easyTotal = allBankQuestions.filter(q => q.difficulty === 'easy').length;
  const medTotal = allBankQuestions.filter(q => q.difficulty === 'medium').length;
  const hardTotal = allBankQuestions.filter(q => q.difficulty === 'hard').length;

  const chapters = ['all', 'Chapter 1', 'Chapter 2', 'Chapter 3', 'All Chapters'];

  const filteredGroups = useMemo(() => {
    return questionGroups.filter(g => {
      if (chapterFilter === 'all') return true;
      return g.chapterRef === chapterFilter;
    });
  }, [chapterFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      {/* Hero header */}
      <div
        className="relative py-12 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, oklch(0.35 0.08 60) 0%, oklch(0.45 0.12 50) 50%, oklch(0.40 0.10 40) 100%)',
        }}
      >
        {/* Decorative palm leaves */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-4 -left-4 text-[120px]">🌴</div>
          <div className="absolute top-2 right-8 text-[80px] rotate-12">🌿</div>
          <div className="absolute bottom-0 right-0 text-[100px] -rotate-6">🌴</div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/30 flex items-center justify-center">
              <BookMarked className="w-5 h-5 text-amber-200" />
            </div>
            <span className="text-amber-300 text-sm font-semibold uppercase tracking-widest">Question Bank</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Consolidated Practice Questions
          </h1>
          <p className="text-amber-100/80 text-sm max-w-xl">
            Past year midterm papers (2223s2, 2324s1, 2425s2, 2526s1, MA2213 2324s2) and tutorial-style questions, grouped by topic. For each question, choose to <strong className="text-amber-200">Attempt</strong>, read the <strong className="text-amber-200">Guide</strong>, or view the <strong className="text-amber-200">Solution</strong>.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              { label: 'Total Questions', value: totalQuestions, icon: <Layers className="w-4 h-4" /> },
              { label: 'Easy', value: easyTotal, icon: <Star className="w-4 h-4 text-green-300" />, color: 'text-green-300' },
              { label: 'Medium', value: medTotal, icon: <Target className="w-4 h-4 text-amber-300" />, color: 'text-amber-300' },
              { label: 'Hard', value: hardTotal, icon: <Trophy className="w-4 h-4 text-red-300" />, color: 'text-red-300' },
              { label: 'Question Types', value: questionGroups.length, icon: <BookOpen className="w-4 h-4" /> },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className={stat.color || 'text-amber-200'}>{stat.icon}</span>
                <div>
                  <div className={`text-lg font-bold ${stat.color || 'text-white'}`}>{stat.value}</div>
                  <div className="text-amber-200/60 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search questions, topics, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-amber-50 border border-amber-200 rounded-xl outline-none focus:border-amber-400 text-stone-800 placeholder:text-stone-400"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1 bg-amber-50 rounded-xl p-1 border border-amber-200">
            {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  difficultyFilter === d
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Chapter filter */}
          <div className="flex items-center gap-1 bg-amber-50 rounded-xl p-1 border border-amber-200 flex-wrap">
            {chapters.map(ch => (
              <button
                key={ch}
                onClick={() => setChapterFilter(ch)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  chapterFilter === ch
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {ch === 'all' ? 'All' : ch === 'All Chapters' ? 'Cross-chapter' : ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Instructions card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>How to use this bank:</strong> Click any question group to expand it. For each question, use <strong>Attempt</strong> mode to work it out yourself, <strong>Guide</strong> mode for a step-by-step solving strategy, or <strong>Solution</strong> mode to see the full worked answer. Questions marked as attempted are tracked in your Progress Dashboard.
          </div>
        </div>

        {/* Groups */}
        {filteredGroups.map(group => (
          <GroupPanel
            key={group.type}
            group={group}
            searchQuery={searchQuery}
            difficultyFilter={difficultyFilter}
          />
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No questions match your filters</p>
            <p className="text-sm mt-1">Try adjusting the search or filter settings</p>
          </div>
        )}
      </div>
    </div>
  );
}
