import type { NoteId } from './notes';
import type { WordId } from './words';

export type Level = {
  id: string;
  title: string;
  world: string;
  targetNotes: NoteId[];
  rewardWordId: WordId;
  unlockedByDefault: boolean;
  order: number;
};

export const levels: Level[] = [
  {
    id: 'a-star',
    title: 'A Star',
    world: 'Open String Forest',
    targetNotes: ['A'],
    rewardWordId: 'star',
    unlockedByDefault: true,
    order: 1,
  },
  {
    id: 'd-moon',
    title: 'D Moon',
    world: 'Open String Forest',
    targetNotes: ['D'],
    rewardWordId: 'moon',
    unlockedByDefault: false,
    order: 2,
  },
  {
    id: 'g-cat',
    title: 'G Cat',
    world: 'Open String Forest',
    targetNotes: ['G'],
    rewardWordId: 'cat',
    unlockedByDefault: false,
    order: 3,
  },
  {
    id: 'e-purple',
    title: 'E Purple',
    world: 'Open String Forest',
    targetNotes: ['E'],
    rewardWordId: 'purple',
    unlockedByDefault: false,
    order: 4,
  },
  {
    id: 'a-bow',
    title: 'A Bow',
    world: 'Open String Forest',
    targetNotes: ['A'],
    rewardWordId: 'bow',
    unlockedByDefault: false,
    order: 5,
  },
  {
    id: 'mixed-magic',
    title: 'Mixed Magic',
    world: 'Open String Forest',
    targetNotes: ['A', 'D'],
    rewardWordId: 'violin',
    unlockedByDefault: false,
    order: 6,
  },
];
