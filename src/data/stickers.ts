export type StickerId = 'purple-bow' | 'tiny-violin' | 'magic-star' | 'moon-bunny' | 'crystal-cat' | 'music-cloud';

export type Sticker = {
  id: StickerId;
  name: string;
  emoji: string;
  unlockCondition: string;
};

export const stickers: Sticker[] = [
  { id: 'purple-bow', name: 'Purple Bow', emoji: '🎀', unlockCondition: 'Complete 1 level' },
  { id: 'tiny-violin', name: 'Tiny Violin', emoji: '🎻', unlockCondition: 'Complete 2 levels' },
  { id: 'magic-star', name: 'Magic Star', emoji: '⭐', unlockCondition: 'Complete 3 levels' },
  { id: 'moon-bunny', name: 'Moon Bunny', emoji: '🐰', unlockCondition: 'Complete 4 levels' },
  { id: 'crystal-cat', name: 'Crystal Cat', emoji: '🐱', unlockCondition: 'Complete 5 levels' },
  { id: 'music-cloud', name: 'Music Cloud', emoji: '🎵', unlockCondition: 'Complete 6 levels' },
];
