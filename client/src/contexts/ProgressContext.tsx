// Progress tracking context for DSA2102 Study Hub
// Design: "Golden Hour Study Retreat" — tracks mastery per topic and chapter

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { chapters, allQuestions } from '@/lib/courseData';

export interface TopicProgress {
  topicId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  lastAttempted: Date | null;
  weakAreas: string[]; // question IDs that were answered incorrectly
  masteryLevel: 'not-started' | 'learning' | 'practicing' | 'mastered';
}

export interface ChapterProgress {
  chapterId: string;
  topicProgress: Record<string, TopicProgress>;
  overallMastery: number; // 0-100
}

interface ProgressContextType {
  chapterProgress: Record<string, ChapterProgress>;
  recordAnswer: (questionId: string, topicId: string, chapterId: string, correct: boolean) => void;
  getTopicMastery: (topicId: string, chapterId: string) => number;
  getChapterMastery: (chapterId: string) => number;
  getOverallMastery: () => number;
  getWeakTopics: () => Array<{ chapterId: string; topicId: string; topicTitle: string; mastery: number }>;
  resetProgress: () => void;
  markTopicVisited: (topicId: string, chapterId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = 'dsa2102-progress';

function initProgress(): Record<string, ChapterProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
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

function computeMastery(attempted: number, correct: number, totalQuestions: number): number {
  if (attempted === 0) return 0;
  const accuracy = correct / attempted;
  const coverage = Math.min(attempted / totalQuestions, 1);
  return Math.round(accuracy * 0.7 * 100 + coverage * 0.3 * 100);
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
      };

      const newAttempted = tp.questionsAttempted + 1;
      const newCorrect = tp.questionsCorrect + (correct ? 1 : 0);
      const newWeakAreas = correct
        ? tp.weakAreas.filter(id => id !== questionId)
        : tp.weakAreas.includes(questionId) ? tp.weakAreas : [...tp.weakAreas, questionId];

      // Count total questions for this topic
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

      // Compute chapter overall mastery
      const allTopicMasteries = Object.values(newTopicProgress).map(t => {
        const tqs = allQuestions.filter(q => q.topicId === t.topicId);
        return computeMastery(t.questionsAttempted, t.questionsCorrect, tqs.length);
      });
      const overallMastery = Math.round(allTopicMasteries.reduce((a, b) => a + b, 0) / allTopicMasteries.length);

      return {
        ...prev,
        [chapterId]: {
          ...ch,
          topicProgress: newTopicProgress,
          overallMastery,
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
    const weak: Array<{ chapterId: string; topicId: string; topicTitle: string; mastery: number }> = [];
    for (const ch of chapters) {
      for (const topic of ch.topics) {
        const mastery = getTopicMastery(topic.id, ch.id);
        const tp = chapterProgress[ch.id]?.topicProgress[topic.id];
        if (tp && tp.questionsAttempted > 0 && mastery < 75) {
          weak.push({ chapterId: ch.id, topicId: topic.id, topicTitle: topic.title, mastery });
        }
      }
    }
    return weak.sort((a, b) => a.mastery - b.mastery);
  }, [chapterProgress, getTopicMastery]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChapterProgress(initProgress());
  }, []);

  return (
    <ProgressContext.Provider value={{
      chapterProgress,
      recordAnswer,
      getTopicMastery,
      getChapterMastery,
      getOverallMastery,
      getWeakTopics,
      resetProgress,
      markTopicVisited,
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
