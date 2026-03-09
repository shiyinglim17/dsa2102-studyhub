// Progress tracking context for DSA2102 Study Hub
// Design: "Golden Hour Study Retreat" — tracks mastery per topic and chapter
// MASTERY FORMULA: Quiz score alone drives mastery %. 100% quiz accuracy + full coverage = 100%.
// Bank attempts are tracked SEPARATELY in the Practice Progress section.

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { chapters, allQuestions } from '@/lib/courseData';
import type { QuestionType } from '@/lib/questionBankData';
import { questionGroups } from '@/lib/questionBankData';

export interface TopicProgress {
  topicId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  lastAttempted: Date | null;
  weakAreas: string[]; // question IDs that were answered incorrectly
  masteryLevel: 'not-started' | 'learning' | 'practicing' | 'mastered';
  // Question bank tracking (separate from mini-quiz mastery)
  bankAttempted: number;
  bankRevealed: number; // how many solutions were revealed
}

export interface ChapterProgress {
  chapterId: string;
  topicProgress: Record<string, TopicProgress>;
  overallMastery: number; // 0-100, quiz-only
}

// Mapping: QuestionType → { chapterId, topicId }
export const BANK_TYPE_TO_TOPIC: Record<QuestionType, { chapterId: string; topicId: string }> = {
  floating_point:       { chapterId: 'ch1', topicId: 'c1t3' },
  error_analysis:       { chapterId: 'ch1', topicId: 'c1t1' },
  triangular_solve:     { chapterId: 'ch2', topicId: 'c2t1' },
  gaussian_elimination: { chapterId: 'ch2', topicId: 'c2t2' },
  lu_factorization:     { chapterId: 'ch2', topicId: 'c2t3' },
  cholesky:             { chapterId: 'ch2', topicId: 'c2t4' },
  conditioning_linear:  { chapterId: 'ch2', topicId: 'c2t5' },
  least_squares:        { chapterId: 'ch3', topicId: 'c3t1' },
  qr_factorization:     { chapterId: 'ch3', topicId: 'c3t2' },
  householder_givens:   { chapterId: 'ch3', topicId: 'c3t4' },
  theory_mcq:           { chapterId: 'ch1', topicId: 'c1t1' },
  complexity:           { chapterId: 'ch2', topicId: 'c2t2' },
};

export interface BankGroupProgress {
  type: QuestionType;
  label: string;
  icon: string;
  chapterRef: string;
  total: number;
  attempted: number;
  revealed: number;
}

interface ProgressContextType {
  chapterProgress: Record<string, ChapterProgress>;
  recordAnswer: (questionId: string, topicId: string, chapterId: string, correct: boolean) => void;
  recordBankAttempt: (questionType: QuestionType, questionId: string, revealed: boolean) => void;
  getTopicMastery: (topicId: string, chapterId: string) => number;
  getChapterMastery: (chapterId: string) => number;
  getOverallMastery: () => number;
  getWeakTopics: () => Array<{ chapterId: string; topicId: string; topicTitle: string; mastery: number; bankAttempted: number }>;
  resetProgress: () => void;
  markTopicVisited: (topicId: string, chapterId: string) => void;
  getTotalBankAttempted: () => number;
  getBankProgressByGroup: () => BankGroupProgress[];
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = 'dsa2102-progress';

// Bank attempt counts stored separately keyed by questionType
const BANK_STORAGE_KEY = 'dsa2102-bank-progress';

function initBankProgress(): Record<QuestionType, { attempted: number; revealed: number }> {
  const stored = localStorage.getItem(BANK_STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  const init: Partial<Record<QuestionType, { attempted: number; revealed: number }>> = {};
  for (const g of questionGroups) {
    init[g.type] = { attempted: 0, revealed: 0 };
  }
  return init as Record<QuestionType, { attempted: number; revealed: number }>;
}

function initProgress(): Record<string, ChapterProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      for (const ch of Object.values(parsed) as ChapterProgress[]) {
        for (const tp of Object.values(ch.topicProgress) as TopicProgress[]) {
          if (tp.bankAttempted === undefined) tp.bankAttempted = 0;
          if (tp.bankRevealed === undefined) tp.bankRevealed = 0;
        }
      }
      return parsed;
    } catch { /* ignore */ }
  }
  const initial: Record<string, ChapterProgress> = {};
  for (const ch of chapters) {
    const topicProgress: Record<string, TopicProgress> = {};
    for (const topic of ch.topics) {
      topicProgress[topic.id] = {
        topicId: topic.id,
        questionsAttempted: 0,
        questionsCorrect: 0,
        lastAttempted: null,
        weakAreas: [],
        masteryLevel: 'not-started',
        bankAttempted: 0,
        bankRevealed: 0,
      };
    }
    initial[ch.id] = { chapterId: ch.id, topicProgress, overallMastery: 0 };
  }
  return initial;
}

/**
 * MASTERY FORMULA (quiz-only):
 * - Accuracy (80%): proportion of attempted questions answered correctly
 * - Coverage (20%): proportion of all available quiz questions attempted
 * - 100% accuracy + all questions attempted = 100% mastery
 * - Bank questions do NOT affect this score — they are tracked separately
 */
function computeMastery(
  quizAttempted: number, quizCorrect: number, totalQuizQuestions: number,
): number {
  if (quizAttempted === 0) return 0;
  const accuracy = quizCorrect / quizAttempted;
  const coverage = Math.min(quizAttempted / Math.max(totalQuizQuestions, 1), 1);
  return Math.min(Math.round(accuracy * 80 + coverage * 20), 100);
}

function getMasteryLevel(mastery: number): TopicProgress['masteryLevel'] {
  if (mastery === 0) return 'not-started';
  if (mastery < 40) return 'learning';
  if (mastery < 80) return 'practicing';
  return 'mastered';
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [chapterProgress, setChapterProgress] = useState<Record<string, ChapterProgress>>(initProgress);
  const [bankProgress, setBankProgress] = useState<Record<QuestionType, { attempted: number; revealed: number }>>(initBankProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  useEffect(() => {
    localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(bankProgress));
  }, [bankProgress]);

  const recordAnswer = useCallback((questionId: string, topicId: string, chapterId: string, correct: boolean) => {
    setChapterProgress(prev => {
      const ch = prev[chapterId];
      if (!ch) return prev;
      const tp = ch.topicProgress[topicId] || {
        topicId,
        questionsAttempted: 0,
        questionsCorrect: 0,
        lastAttempted: null,
        weakAreas: [],
        masteryLevel: 'not-started' as const,
        bankAttempted: 0,
        bankRevealed: 0,
      };

      const newAttempted = tp.questionsAttempted + 1;
      const newCorrect = tp.questionsCorrect + (correct ? 1 : 0);
      const newWeakAreas = correct
        ? tp.weakAreas.filter(id => id !== questionId)
        : tp.weakAreas.includes(questionId) ? tp.weakAreas : [...tp.weakAreas, questionId];

      const topicQuestions = allQuestions.filter(q => q.topicId === topicId);
      const mastery = computeMastery(newAttempted, newCorrect, topicQuestions.length);

      const newTp: TopicProgress = {
        ...tp,
        questionsAttempted: newAttempted,
        questionsCorrect: newCorrect,
        lastAttempted: new Date(),
        weakAreas: newWeakAreas,
        masteryLevel: getMasteryLevel(mastery),
      };

      const newTopicProgress = { ...ch.topicProgress, [topicId]: newTp };
      const allTopicMasteries = Object.values(newTopicProgress).map(t => {
        const tqs = allQuestions.filter(q => q.topicId === t.topicId);
        return computeMastery(t.questionsAttempted, t.questionsCorrect, tqs.length);
      });
      const overallMastery = Math.round(allTopicMasteries.reduce((a, b) => a + b, 0) / allTopicMasteries.length);

      return {
        ...prev,
        [chapterId]: { ...ch, topicProgress: newTopicProgress, overallMastery },
      };
    });
  }, []);

  // Record a question bank attempt — tracked per question group type, NOT mixed into mastery
  const recordBankAttempt = useCallback((questionType: QuestionType, _questionId: string, revealed: boolean) => {
    // Update the per-group bank progress (for Practice Progress section)
    setBankProgress(prev => {
      const current = prev[questionType] || { attempted: 0, revealed: 0 };
      return {
        ...prev,
        [questionType]: {
          attempted: current.attempted + 1,
          revealed: current.revealed + (revealed ? 1 : 0),
        },
      };
    });

    // Also update bankAttempted on the topic for the "bank qs done" display in chapter breakdown
    const mapping = BANK_TYPE_TO_TOPIC[questionType];
    if (!mapping) return;
    const { chapterId, topicId } = mapping;
    setChapterProgress(prev => {
      const ch = prev[chapterId];
      if (!ch) return prev;
      const tp = ch.topicProgress[topicId];
      if (!tp) return prev;
      const newTp: TopicProgress = {
        ...tp,
        bankAttempted: tp.bankAttempted + 1,
        bankRevealed: tp.bankRevealed + (revealed ? 1 : 0),
        lastAttempted: new Date(),
      };
      return {
        ...prev,
        [chapterId]: {
          ...ch,
          topicProgress: { ...ch.topicProgress, [topicId]: newTp },
        },
      };
    });
  }, []);

  const markTopicVisited = useCallback((topicId: string, chapterId: string) => {
    setChapterProgress(prev => {
      const ch = prev[chapterId];
      if (!ch) return prev;
      const tp = ch.topicProgress[topicId];
      if (!tp || tp.masteryLevel !== 'not-started') return prev;
      return {
        ...prev,
        [chapterId]: {
          ...ch,
          topicProgress: {
            ...ch.topicProgress,
            [topicId]: { ...tp, masteryLevel: 'learning' },
          },
        },
      };
    });
  }, []);

  const getTopicMastery = useCallback((topicId: string, chapterId: string): number => {
    const tp = chapterProgress[chapterId]?.topicProgress[topicId];
    if (!tp) return 0;
    const tqs = allQuestions.filter(q => q.topicId === topicId);
    return computeMastery(tp.questionsAttempted, tp.questionsCorrect, tqs.length);
  }, [chapterProgress]);

  const getChapterMastery = useCallback((chapterId: string): number => {
    return chapterProgress[chapterId]?.overallMastery ?? 0;
  }, [chapterProgress]);

  const getOverallMastery = useCallback((): number => {
    const masteries = Object.values(chapterProgress).map(ch => ch.overallMastery);
    if (masteries.length === 0) return 0;
    return Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length);
  }, [chapterProgress]);

  const getWeakTopics = useCallback(() => {
    const weak: Array<{ chapterId: string; topicId: string; topicTitle: string; mastery: number; bankAttempted: number }> = [];
    for (const ch of chapters) {
      for (const topic of ch.topics) {
        const mastery = getTopicMastery(topic.id, ch.id);
        const tp = chapterProgress[ch.id]?.topicProgress[topic.id];
        // Only show as weak if quiz has been attempted and score < 80%
        if (tp && tp.questionsAttempted > 0 && mastery < 80) {
          weak.push({
            chapterId: ch.id,
            topicId: topic.id,
            topicTitle: topic.title,
            mastery,
            bankAttempted: tp.bankAttempted,
          });
        }
      }
    }
    return weak.sort((a, b) => a.mastery - b.mastery);
  }, [chapterProgress, getTopicMastery]);

  const getTotalBankAttempted = useCallback((): number => {
    return Object.values(bankProgress).reduce((acc, g) => acc + g.attempted, 0);
  }, [bankProgress]);

  const getBankProgressByGroup = useCallback((): BankGroupProgress[] => {
    return questionGroups.map(g => ({
      type: g.type,
      label: g.label,
      icon: g.icon,
      chapterRef: g.chapterRef,
      total: g.questions.length,
      attempted: bankProgress[g.type]?.attempted ?? 0,
      revealed: bankProgress[g.type]?.revealed ?? 0,
    }));
  }, [bankProgress]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BANK_STORAGE_KEY);
    setChapterProgress(initProgress());
    setBankProgress(initBankProgress());
  }, []);

  return (
    <ProgressContext.Provider value={{
      chapterProgress,
      recordAnswer,
      recordBankAttempt,
      getTopicMastery,
      getChapterMastery,
      getOverallMastery,
      getWeakTopics,
      resetProgress,
      markTopicVisited,
      getTotalBankAttempted,
      getBankProgressByGroup,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
