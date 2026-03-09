// ============================================================
// PseudocodeView — DSA2102 Pseudocode Bank
// Design: Tropical Golden Hour Study Retreat
// Dark mahogany sidebar, warm parchment content, monospace code blocks
// ============================================================

import { useState, useMemo } from 'react';
import { pseudocodes, pseudocodeByChapter, type PseudocodeEntry } from '@/lib/pseudocodeData';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Code2,
  Calculator,
  Clock,
  AlertTriangle,
  BookOpen,
  Filter,
  X,
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// ─── KaTeX inline renderer ────────────────────────────────────
function MathInline({ latex }: { latex: string }) {
  try {
    const html = katex.renderToString(latex, { throwOnError: false, displayMode: false });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <code className="text-amber-700 text-xs">{latex}</code>;
  }
}

function MathDisplay({ latex }: { latex: string }) {
  try {
    const html = katex.renderToString(latex, { throwOnError: false, displayMode: true });
    return (
      <div
        className="overflow-x-auto py-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className="text-amber-700 text-sm font-mono block">{latex}</code>;
  }
}

// ─── Chapter colours ─────────────────────────────────────────
const chapterConfig: Record<string, { label: string; accent: string; bg: string; border: string }> = {
  chapter1: {
    label: 'Ch 1 — Scientific Computing',
    accent: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  chapter2: {
    label: 'Ch 2 — Linear Systems',
    accent: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
  chapter3: {
    label: 'Ch 3 — Least Squares',
    accent: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
};

// ─── Section tabs inside each card ───────────────────────────
type CardTab = 'pseudocode' | 'derivation' | 'summary';

function PseudocodeCard({ entry }: { entry: PseudocodeEntry }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<CardTab>('pseudocode');
  const cfg = chapterConfig[entry.chapterId] ?? chapterConfig.chapter1;

  return (
    <div
      className={`rounded-xl border ${cfg.border} bg-white shadow-sm overflow-hidden transition-all duration-200`}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-stone-50 transition-colors`}
      >
        <span className={`mt-0.5 ${cfg.accent}`}>
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-semibold text-stone-800 text-base leading-tight">{entry.title}</span>
            <Badge
              variant="outline"
              className={`text-xs ${cfg.accent} ${cfg.border} ${cfg.bg} border`}
            >
              {entry.chapter.split(' — ')[0]}
            </Badge>
          </div>
          <p className="text-stone-500 text-sm">{entry.subtitle}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {entry.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`shrink-0 text-xs font-mono font-bold ${cfg.accent} ${cfg.bg} px-2 py-1 rounded-md border ${cfg.border}`}
        >
          {entry.summary.complexity}
        </span>
      </button>

      {/* ── Expanded body ── */}
      {open && (
        <div className="border-t border-stone-100">
          {/* Tab bar */}
          <div className="flex border-b border-stone-100 bg-stone-50">
            {(
              [
                { key: 'pseudocode', icon: <Code2 size={14} />, label: 'Pseudocode' },
                { key: 'derivation', icon: <Calculator size={14} />, label: 'Operation Count' },
                { key: 'summary', icon: <Clock size={14} />, label: 'Complexity Summary' },
              ] as { key: CardTab; icon: React.ReactNode; label: string }[]
            ).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? `border-amber-500 ${cfg.accent}`
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* ── PSEUDOCODE TAB ── */}
            {tab === 'pseudocode' && (
              <div className="space-y-4">
                {/* Explanation */}
                <div className={`rounded-lg ${cfg.bg} border ${cfg.border} p-4`}>
                  <div className={`flex items-center gap-2 font-semibold text-sm ${cfg.accent} mb-2`}>
                    <BookOpen size={14} />
                    How it works
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed">{entry.explanation}</p>
                </div>

                {/* Code block */}
                <div className="rounded-lg bg-stone-900 overflow-x-auto">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-stone-700">
                    <span className="text-stone-400 text-xs font-mono">pseudocode</span>
                    <span className={`text-xs font-mono ${cfg.accent.replace('text-', 'text-').replace('700', '400')}`}>
                      {entry.topic}
                    </span>
                  </div>
                  <pre className="px-4 py-3 text-sm font-mono text-stone-100 leading-relaxed whitespace-pre overflow-x-auto">
                    {entry.pseudocode.map((line, i) => {
                      // colour-code comment lines
                      if (line.trim().startsWith('←') || line.includes('←')) {
                        const parts = line.split('←');
                        return (
                          <div key={i}>
                            <span>{parts[0]}</span>
                            <span className="text-amber-400">←{parts.slice(1).join('←')}</span>
                          </div>
                        );
                      }
                      if (line.trim().startsWith('Algorithm') || line.trim().startsWith('Input') || line.trim().startsWith('Output')) {
                        return <div key={i} className="text-teal-300">{line}</div>;
                      }
                      if (line.trim().startsWith('(') || line.trim().startsWith('//') || line.trim().startsWith('For each')) {
                        return <div key={i} className="text-stone-400 italic">{line}</div>;
                      }
                      return <div key={i}>{line}</div>;
                    })}
                  </pre>
                </div>

                {/* Warnings */}
                {entry.warnings && entry.warnings.length > 0 && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <div className="flex items-center gap-2 font-semibold text-sm text-amber-700 mb-2">
                      <AlertTriangle size={14} />
                      Important Notes
                    </div>
                    <ul className="space-y-1">
                      {entry.warnings.map((w, i) => (
                        <li key={i} className="text-amber-800 text-sm flex gap-2">
                          <span className="text-amber-500 shrink-0">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ── DERIVATION TAB ── */}
            {tab === 'derivation' && (
              <div className="space-y-4">
                <p className="text-stone-600 text-sm">
                  Step-by-step derivation of the arithmetic operation count, following the school notation.
                </p>
                {entry.operationDerivation.map((step, i) => (
                  <div key={i} className="rounded-lg border border-stone-200 overflow-hidden">
                    <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
                      <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                        Step {i + 1}: {step.title}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      <MathDisplay latex={step.latex} />
                      <p className="text-stone-500 text-xs mt-2 font-mono">{step.plain}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── SUMMARY TAB ── */}
            {tab === 'summary' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entry.summary.squareRoots && (
                    <SummaryCard label="Square Roots" value={entry.summary.squareRoots} accent={cfg.accent} bg={cfg.bg} border={cfg.border} />
                  )}
                  {entry.summary.divisions && (
                    <SummaryCard label="Divisions" value={entry.summary.divisions} accent={cfg.accent} bg={cfg.bg} border={cfg.border} />
                  )}
                  {entry.summary.multiplications && (
                    <SummaryCard label="Multiplications" value={entry.summary.multiplications} accent={cfg.accent} bg={cfg.bg} border={cfg.border} />
                  )}
                  {entry.summary.additions && (
                    <SummaryCard label="Additions / Subtractions" value={entry.summary.additions} accent={cfg.accent} bg={cfg.bg} border={cfg.border} />
                  )}
                  {entry.summary.comparisons && (
                    <SummaryCard label="Comparisons" value={entry.summary.comparisons} accent={cfg.accent} bg={cfg.bg} border={cfg.border} />
                  )}
                  {entry.summary.dominant && (
                    <SummaryCard label="Dominant Term" value={entry.summary.dominant} accent={cfg.accent} bg={cfg.bg} border={cfg.border} highlight />
                  )}
                </div>

                {/* Complexity badge */}
                <div className={`rounded-xl ${cfg.bg} border-2 ${cfg.border} p-4 text-center`}>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">Time Complexity</p>
                  <p className={`text-2xl font-bold font-mono ${cfg.accent}`}>{entry.summary.complexity}</p>
                </div>

                {entry.summary.note && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-blue-800 text-sm">{entry.summary.note}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
  bg,
  border,
  highlight = false,
}: {
  label: string;
  value: string;
  accent: string;
  bg: string;
  border: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${highlight ? `${bg} ${border}` : 'bg-stone-50 border-stone-200'}`}
    >
      <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-mono text-sm font-semibold ${highlight ? accent : 'text-stone-700'}`}>{value}</p>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────
export default function PseudocodeView() {
  const [search, setSearch] = useState('');
  const [filterChapter, setFilterChapter] = useState<string>('all');
  const [expandAll, setExpandAll] = useState(false);

  const chapters = ['all', 'chapter1', 'chapter2', 'chapter3'];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pseudocodes.filter((p) => {
      const matchChapter = filterChapter === 'all' || p.chapterId === filterChapter;
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.explanation.toLowerCase().includes(q) ||
        p.summary.complexity.toLowerCase().includes(q);
      return matchChapter && matchSearch;
    });
  }, [search, filterChapter]);

  // Group filtered results by chapter
  const grouped = useMemo(() => {
    const g: Record<string, PseudocodeEntry[]> = {};
    for (const entry of filtered) {
      if (!g[entry.chapterId]) g[entry.chapterId] = [];
      g[entry.chapterId].push(entry);
    }
    return g;
  }, [filtered]);

  const chapterOrder = ['chapter1', 'chapter2', 'chapter3'];

  return (
    <div className="flex-1 overflow-y-auto bg-stone-50">
      {/* ── Hero header ── */}
      <div
        className="relative px-8 py-10 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, oklch(0.25 0.04 60) 0%, oklch(0.35 0.06 50) 50%, oklch(0.28 0.05 55) 100%)',
        }}
      >
        {/* Decorative palm leaf SVG */}
        <svg
          className="absolute right-0 top-0 opacity-10 pointer-events-none"
          width="320"
          height="200"
          viewBox="0 0 320 200"
          fill="none"
        >
          <path d="M320 0 Q200 80 160 200" stroke="white" strokeWidth="3" />
          <path d="M320 0 Q240 100 120 200" stroke="white" strokeWidth="2" />
          <path d="M280 0 Q180 90 80 200" stroke="white" strokeWidth="1.5" />
        </svg>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/30">
              <Code2 size={22} className="text-amber-300" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Pseudocode Bank
            </h1>
          </div>
          <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
            All algorithms taught in DSA2102, with pseudocode, step-by-step arithmetic operation count derivations, and time complexity analysis. Each entry follows the exact notation from the school lecture notes.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-stone-400">
            <span className="flex items-center gap-1"><Code2 size={12} className="text-amber-400" /> {pseudocodes.length} algorithms</span>
            <span className="flex items-center gap-1"><Calculator size={12} className="text-teal-400" /> Full operation count derivations</span>
            <span className="flex items-center gap-1"><Clock size={12} className="text-orange-400" /> Time complexity for each</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-200 px-6 py-3 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search algorithms, tags, complexity…"
            className="pl-8 h-8 text-sm bg-stone-50 border-stone-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Filter size={13} className="text-stone-400" />
          {chapters.map((ch) => {
            const label =
              ch === 'all'
                ? 'All'
                : ch === 'chapter1'
                ? 'Ch 1'
                : ch === 'chapter2'
                ? 'Ch 2'
                : 'Ch 3';
            const cfg = ch !== 'all' ? chapterConfig[ch] : null;
            return (
              <button
                key={ch}
                onClick={() => setFilterChapter(ch)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterChapter === ch
                    ? cfg
                      ? `${cfg.bg} ${cfg.accent} ${cfg.border} border`
                      : 'bg-stone-800 text-white border-stone-800'
                    : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-stone-400 ml-auto">{filtered.length} algorithm{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Content ── */}
      <div className="px-6 py-6 space-y-8 max-w-4xl mx-auto">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <Code2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg">No algorithms match your search.</p>
          </div>
        )}

        {chapterOrder.map((chId) => {
          const entries = grouped[chId];
          if (!entries || entries.length === 0) return null;
          const cfg = chapterConfig[chId];
          return (
            <section key={chId}>
              {/* Chapter heading */}
              <div className={`flex items-center gap-3 mb-4`}>
                <div className={`h-px flex-1 ${cfg.border.replace('border', 'bg')}`} />
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${cfg.accent} ${cfg.bg} border ${cfg.border}`}
                >
                  {cfg.label}
                </span>
                <div className={`h-px flex-1 ${cfg.border.replace('border', 'bg')}`} />
              </div>

              {/* Complexity quick-reference table */}
              <div className="mb-4 rounded-lg border border-stone-200 overflow-hidden bg-white">
                <div className="bg-stone-50 px-4 py-2 border-b border-stone-200">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Quick Reference — Operation Counts
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-left px-4 py-2 text-stone-600 font-medium text-xs">Algorithm</th>
                        <th className="text-left px-4 py-2 text-stone-600 font-medium text-xs">Dominant Operations</th>
                        <th className="text-left px-4 py-2 text-stone-600 font-medium text-xs">Complexity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e, i) => (
                        <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                          <td className="px-4 py-2 font-medium text-stone-700 text-xs">{e.title}</td>
                          <td className="px-4 py-2 font-mono text-stone-600 text-xs">{e.summary.dominant ?? '—'}</td>
                          <td className="px-4 py-2">
                            <span className={`font-mono text-xs font-bold ${cfg.accent}`}>{e.summary.complexity}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {entries.map((entry) => (
                  <PseudocodeCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
