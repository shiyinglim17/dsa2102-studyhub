// Progress tracking context for DSA2102 Study Hub
// Design: "Golden Hour Study Retreat" — tracks mastery per topic and chapter
// Updated: Question Bank attempts now feed into the progress dashboard

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { chapters, allQuestions } from '@/lib/courseData';
import type { QuestionType } from '@/lib/questionBankData';

export interface TopicProgress {
  topicId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  lastAttempted: Date | null;
  weakAreas: string[]; // question IDs that were answered incorrectly
  masteryLevel: 'not-started' | 'learning' | 'practicing' | 'mastered';
  // Question bank tracking (separate from mini-quiz)
  bankAttempted: number;
  bankRevealed: number; // how many solutions were revealed
}

export interface ChapterProgress {
  chapterId: string;
  topicProgress: Record<string, TopicProgress>;
  overallMastery: number; // 0-100
}

// Mapping: QuestionType → { chapterId, topicId }
// This maps each bank question type to the most relevant chapter topic
export const BANK_TYPE_TO_TOPIC: Record<QuestionType, { chapterId: string; topicId: string }> = {
  floating_point:       { chapterId: 'ch1', topicId: 'c1t3' }, // Floating Point Systems
  error_analysis:       { chapterId: 'ch1', topicId: 'c1t1' }, // Approximation, Error & Conditioning
  triangular_solve:     { chapterId: 'ch2', topicId: 'c2t1' }, // Triangular Systems
  gaussian_elimination: { chapterId: 'ch2', topicId: 'c2t2' }, // Gaussian Elimination
  lu_factorization:     { chapterId: 'ch2', topicId: 'c2t3' }, // LU Factorization
  cholesky:             { chapterId: 'ch2', topicId: 'c2t4' }, // Cholesky
  conditioning_linear:  { chapterId: 'ch2', topicId: 'c2t5' }, // Conditioning & Norms
  least_squares:        { chapterId: 'ch3', topicId: 'c3t1' }, // Least Squares
  qr_factorization:     { chapterId: 'ch3', topicId: 'c3t2' }, // QR / Gram-Schmidt
  householder_givens:   { chapterId: 'ch3', topicId: 'c3t4' }, // Householder & Givens
  theory_mcq:           { chapterId: 'ch1', topicId: 'c1t1' }, // General theory → Ch1
  complexity:           { chapterId: 'ch2', topicId: 'c2t2' }, // Complexity → Gaussian Elim
};

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
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = 'dsa2102-progress';

function initProgress(): Record<string, ChapterProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migrate: ensure bankAttempted/bankRevealed exist on all topics
      for (const ch of Object.values(parsed) as ChapterProgress[]) {
        for (const tp of Object.values(ch.topicProgress) as TopicProgress[]) {
          if (tp.bankAttempted === undefined) tp.bankAttempted = 0;
          if (tp.bankRevealed === undefined) tp.bankRevealed = 0;
        }
      }
      return parsed;
    } catch {
      // ignore
    }
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
    initial[ch.id] = {
      chapterId: ch.id,
      topicProgress,
      overallMastery: 0,
    };
  }
  return initial;
}

function computeMastery(
  quizAttempted: number, quizCorrect: number, totalQuizQuestions: number,
  bankAttempted: number
): number {
  // Quiz component: accuracy × coverage (70% weight)
  const quizMastery = quizAttempted === 0 ? 0 : (() => {
    const accuracy = quizCorrect / quizAttempted;
    const coverage = Math.min(quizAttempted / Math.max(totalQuizQuestions, 1), 1);
    return accuracy * 0.7 * 100 + coverage * 0.3 * 100;
  })();

  // Bank component: each bank question attempted adds up to 15 points (capped at 30% bonus)
  const bankBonus = Math.min(bankAttempted * 5, 30);

  // Blend: if quiz has been attempted, quiz drives mastery; bank adds a bonus
  if (quizAttempted === 0 && bankAttempted === 0) return 0;
  if (quizAttempted === 0) return Math.min(bankBonus, 40); // bank-only: max 40% without quiz

  return Math.min(Math.round(quizMastery * 0.7 + bankBonus), 100);
}

function getMasteryLevel(mastery: number): TopicProgress['masteryLevel'] {
  if (mastery === 0) return 'not-started';
  if (mastery < 40) return 'learning';
  if (mastery < 75) return 'practicing';
  return 'mastered';
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [chapterProgress, setChapterProgress] = useState<Record<string, ChapterProgress>>(initProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapterProgress));
  }, [chapterProgress]);

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
      const mastery = computeMastery(newAttempted, newCorrect, topicQuestions.length, tp.bankAttempted);

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
        return computeMastery(t.questionsAttempted, t.questionsCorrect, tqs.length, t.bankAttempted);
      });
      const overallMastery = Math.round(allTopicMasteries.reduce((a, b) => a + b, 0) / allTopicMasteries.length);

      return {
        ...prev,
        [chapterId]: { ...ch, topicProgress: newTopicProgress, overallMastery },
      };
    });
  }, []);

  // Record a question bank attempt — maps question type to the relevant topic
  const recordBankAttempt = useCallback((questionType: QuestionType, _questionId: string, revealed: boolean) => {
    const mapping = BANK_TYPE_TO_TOPIC[questionType];
    if (!mapping) return;
    const { chapterId, topicId } = mapping;

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

      const newBankAttempted = tp.bankAttempted + 1;
      const newBankRevealed = tp.bankRevealed + (revealed ? 1 : 0);

      const topicQuestions = allQuestions.filter(q => q.topicId === topicId);
      const mastery = computeMastery(
        tp.questionsAttempted, tp.questionsCorrect, topicQuestions.length, newBankAttempted
      );

      const newTp: TopicProgress = {
        ...tp,
        bankAttempted: newBankAttempted,
        bankRevealed: newBankRevealed,
        lastAttempted: new Date(),
        masteryLevel: getMasteryLevel(mastery),
      };

      const newTopicProgress = { ...ch.topicProgress, [topicId]: newTp };
      const allTopicMasteries = Object.values(newTopicProgress).map(t => {
        const tqs = allQuestions.filter(q => q.topicId === t.topicId);
        return computeMastery(t.questionsAttempted, t.questionsCorrect, tqs.length, t.bankAttempted);
      });
      const overallMastery = Math.round(allTopicMasteries.reduce((a, b) => a + b, 0) / allTopicMasteries.length);

      return {
        ...prev,
        [chapterId]: { ...ch, topicProgress: newTopicProgress, overallMastery },
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
    return computeMastery(tp.questionsAttempted, tp.questionsCorrect, tqs.length, tp.bankAttempted);
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
        if (tp && (tp.questionsAttempted > 0 || tp.bankAttempted > 0) && mastery < 75) {
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
    let total = 0;
    for (const ch of Object.values(chapterProgress)) {
      for (const tp of Object.values(ch.topicProgress)) {
        total += tp.bankAttempted ?? 0;
      }
    }
    return total;
  }, [chapterProgress]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChapterProgress(initProgress());
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
