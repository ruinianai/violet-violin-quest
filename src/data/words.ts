export type WordId = 'star' | 'moon' | 'cat' | 'purple' | 'bow' | 'violin';

export type MagicWord = {
  id: WordId;
  word: string;
  emoji: string;
  sentence: string;
};

export const words: MagicWord[] = [
  { id: 'star', word: 'STAR', emoji: '⭐', sentence: 'A star shines.' },
  { id: 'moon', word: 'MOON', emoji: '🌙', sentence: 'The moon is purple.' },
  { id: 'cat', word: 'CAT', emoji: '🐱', sentence: 'A cute cat.' },
  { id: 'purple', word: 'PURPLE', emoji: '💜', sentence: 'I love purple.' },
  { id: 'bow', word: 'BOW', emoji: '🎀', sentence: 'A pretty bow.' },
  { id: 'violin', word: 'VIOLIN', emoji: '🎻', sentence: 'I play violin.' },
];

export function getWord(id: WordId) {
  return words.find((word) => word.id === id)!;
}
