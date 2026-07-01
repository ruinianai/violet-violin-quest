import { useCallback, useMemo, useState } from 'react';
import { levels } from '../data/levels';
import type { NoteId } from '../data/notes';
import { stickers, type StickerId } from '../data/stickers';
import type { WordId } from '../data/words';

const STORAGE_KEY = 'violet-violin-progress-v2';

export type Difficulty = 'easy' | 'normal' | 'challenge';

export type Progress = {
  completedLevelIds: string[];
  starsByLevel: Record<string, number>;
  unlockedWordIds: WordId[];
  unlockedStickerIds: StickerId[];
  attemptsByNote: Partial<Record<NoteId, number>>;
  successesByNote: Partial<Record<NoteId, number>>;
  centsHistoryByNote: Partial<Record<NoteId, number[]>>;
  totalAttempts: number;
  startedAt: number;
  lastPlayedAt: number;
  totalPlaySeconds: number;
  voiceEnabled: boolean;
  difficulty: Difficulty;
};

function createDefaultProgress(): Progress {
  const now = Date.now();
  return {
    completedLevelIds: [],
    starsByLevel: {},
    unlockedWordIds: [],
    unlockedStickerIds: [],
    attemptsByNote: {},
    successesByNote: {},
    centsHistoryByNote: {},
    totalAttempts: 0,
    startedAt: now,
    lastPlayedAt: now,
    totalPlaySeconds: 0,
    voiceEnabled: true,
    difficulty: 'easy',
  };
}

function normalizeProgress(value: unknown): Progress {
  const parsed = value as Partial<Progress>;
  const fallback = createDefaultProgress();
  return {
    ...fallback,
    ...parsed,
    completedLevelIds: Array.isArray(parsed.completedLevelIds) ? parsed.completedLevelIds : [],
    starsByLevel: parsed.starsByLevel && typeof parsed.starsByLevel === 'object' ? parsed.starsByLevel : {},
    unlockedWordIds: Array.isArray(parsed.unlockedWordIds) ? parsed.unlockedWordIds : [],
    unlockedStickerIds: Array.isArray(parsed.unlockedStickerIds) ? parsed.unlockedStickerIds : [],
    attemptsByNote: parsed.attemptsByNote ?? {},
    successesByNote: parsed.successesByNote ?? {},
    centsHistoryByNote: parsed.centsHistoryByNote ?? {},
    totalAttempts: Number(parsed.totalAttempts ?? 0),
    totalPlaySeconds: Number(parsed.totalPlaySeconds ?? 0),
    difficulty: parsed.difficulty ?? 'easy',
  };
}

function loadProgress() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultProgress();
    return normalizeProgress(JSON.parse(stored));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return createDefaultProgress();
  }
}

function saveProgress(progress: Progress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function stickerIdsForCompletedLevels(completedCount: number) {
  return stickers.slice(0, completedCount).map((sticker) => sticker.id);
}

export function useProgress() {
  const [progress, setProgressState] = useState(loadProgress);

  const setProgress = useCallback((updater: (progress: Progress) => Progress) => {
    setProgressState((current) => {
      const next = updater(current);
      saveProgress(next);
      return next;
    });
  }, []);

  const recordAttempt = useCallback(
    (note: NoteId, cents: number | null, success: boolean) => {
      setProgress((current) => {
        const centsHistory = current.centsHistoryByNote[note] ?? [];
        const nextHistory = cents === null ? centsHistory : [...centsHistory.slice(-19), cents];
        return {
          ...current,
          attemptsByNote: { ...current.attemptsByNote, [note]: (current.attemptsByNote[note] ?? 0) + 1 },
          successesByNote: {
            ...current.successesByNote,
            [note]: (current.successesByNote[note] ?? 0) + (success ? 1 : 0),
          },
          centsHistoryByNote: { ...current.centsHistoryByNote, [note]: nextHistory },
          totalAttempts: current.totalAttempts + 1,
          lastPlayedAt: Date.now(),
        };
      });
    },
    [setProgress],
  );

  const completeLevel = useCallback(
    (levelId: string, wordId: WordId, stars: number, targetNotes: NoteId[], elapsedSeconds: number, lastCents: number | null) => {
      setProgress((current) => {
        const completed = new Set(current.completedLevelIds);
        completed.add(levelId);
        const words = new Set(current.unlockedWordIds);
        words.add(wordId);
        const completedLevelIds = Array.from(completed);
        const unlockedStickerIds = stickerIdsForCompletedLevels(completedLevelIds.length);
        const centsHistoryByNote = { ...current.centsHistoryByNote };
        const successesByNote = { ...current.successesByNote };
        targetNotes.forEach((note) => {
          successesByNote[note] = (successesByNote[note] ?? 0) + 1;
          if (lastCents !== null) centsHistoryByNote[note] = [...(centsHistoryByNote[note] ?? []).slice(-19), lastCents];
        });
        return {
          ...current,
          completedLevelIds,
          starsByLevel: { ...current.starsByLevel, [levelId]: Math.max(current.starsByLevel[levelId] ?? 0, stars) },
          unlockedWordIds: Array.from(words),
          unlockedStickerIds,
          successesByNote,
          centsHistoryByNote,
          totalPlaySeconds: current.totalPlaySeconds + elapsedSeconds,
          lastPlayedAt: Date.now(),
        };
      });
    },
    [setProgress],
  );

  const resetProgress = useCallback(() => {
    const fresh = createDefaultProgress();
    saveProgress(fresh);
    setProgressState(fresh);
  }, []);

  const report = useMemo(() => {
    const totalStars = Object.values(progress.starsByLevel).reduce((sum, value) => sum + value, 0);
    const practiced = Object.entries(progress.attemptsByNote).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
    const rates = (['G', 'D', 'A', 'E'] as NoteId[]).map((note) => ({
      note,
      attempts: progress.attemptsByNote[note] ?? 0,
      successes: progress.successesByNote[note] ?? 0,
      rate: (progress.successesByNote[note] ?? 0) / Math.max(progress.attemptsByNote[note] ?? 0, 1),
      avgCents:
        (progress.centsHistoryByNote[note] ?? []).reduce((sum, cents) => sum + cents, 0) /
        Math.max((progress.centsHistoryByNote[note] ?? []).length, 1),
    }));
    const notesWithAttempts = rates.filter((item) => item.attempts > 0 || item.successes > 0);
    const best = [...notesWithAttempts].sort((a, b) => b.rate - a.rate)[0]?.note ?? 'A';
    const needsPractice = [...notesWithAttempts].sort((a, b) => a.rate - b.rate)[0]?.note ?? 'G';

    return {
      totalStars,
      completedCount: progress.completedLevelIds.length,
      wordsCount: progress.unlockedWordIds.length,
      stickersCount: progress.unlockedStickerIds.length,
      mostPracticedNote: practiced[0]?.[0] ?? 'A',
      bestNote: best,
      needsPractice,
      noteStats: rates,
    };
  }, [progress]);

  const isLevelUnlocked = useCallback(
    (levelId: string) => {
      const level = levels.find((item) => item.id === levelId);
      if (!level) return false;
      if (level.unlockedByDefault) return true;
      const previous = levels.find((item) => item.order === level.order - 1);
      return previous ? progress.completedLevelIds.includes(previous.id) : false;
    },
    [progress.completedLevelIds],
  );

  return { progress, report, setProgress, recordAttempt, completeLevel, resetProgress, isLevelUnlocked };
}
