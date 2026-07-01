export type VoiceLineCategory = 'home' | 'setup' | 'mic' | 'map' | 'challenge' | 'feedback' | 'reward';

export type VoiceLineId =
  | 'welcome'
  | 'tagline'
  | 'beforeWeStart'
  | 'startMagicMic'
  | 'playAString'
  | 'micCanHearYou'
  | 'micReady'
  | 'micCannotHear'
  | 'chooseLevel'
  | 'openStringForest'
  | 'listenMagicNote'
  | 'tryA'
  | 'tryD'
  | 'tryG'
  | 'tryE'
  | 'holdSteady'
  | 'almostThere'
  | 'tooLowGentle'
  | 'tooHighGentle'
  | 'magicNoteFound'
  | 'greatJob'
  | 'rewardUnlocked'
  | 'wordStar'
  | 'wordMoon'
  | 'wordCat'
  | 'wordPurple'
  | 'wordBow'
  | 'wordViolin';

export type VoiceLine = {
  id: VoiceLineId;
  fallbackText: string;
  audioPath?: string;
  category: VoiceLineCategory;
  cooldownMs: number;
};

export const voiceLines: Record<VoiceLineId, VoiceLine> = {
  welcome: {
    id: 'welcome',
    fallbackText: 'Welcome to Violet Violin Quest!',
    audioPath: '/audio/voice/welcome.mp3',
    category: 'home',
    cooldownMs: 3000,
  },
  tagline: {
    id: 'tagline',
    fallbackText: 'Play violin, hear the notes, and collect magic English words.',
    audioPath: '/audio/voice/tagline.mp3',
    category: 'home',
    cooldownMs: 3000,
  },
  beforeWeStart: {
    id: 'beforeWeStart',
    fallbackText: 'Before we start, find a quiet place and ask a grown-up to help with the microphone.',
    audioPath: '/audio/voice/before-we-start.mp3',
    category: 'setup',
    cooldownMs: 3000,
  },
  startMagicMic: {
    id: 'startMagicMic',
    fallbackText: 'Tap Start Magic Mic, then allow the microphone when you see the message.',
    audioPath: '/audio/voice/start-magic-mic.mp3',
    category: 'setup',
    cooldownMs: 2000,
  },
  playAString: {
    id: 'playAString',
    fallbackText: 'Play your A string when you’re ready.',
    audioPath: '/audio/voice/play-a.mp3',
    category: 'mic',
    cooldownMs: 1800,
  },
  micCanHearYou: {
    id: 'micCanHearYou',
    fallbackText: 'I can hear your violin!',
    audioPath: '/audio/voice/mic-can-hear-you.mp3',
    category: 'mic',
    cooldownMs: 2500,
  },
  micReady: {
    id: 'micReady',
    fallbackText: 'Great, the magic mic is ready!',
    audioPath: '/audio/voice/mic-ready.mp3',
    category: 'mic',
    cooldownMs: 2000,
  },
  micCannotHear: {
    id: 'micCannotHear',
    fallbackText: 'I can’t hear your violin yet. Try moving a little closer.',
    audioPath: '/audio/voice/mic-cannot-hear.mp3',
    category: 'mic',
    cooldownMs: 3500,
  },
  chooseLevel: {
    id: 'chooseLevel',
    fallbackText: 'Choose a magic level.',
    audioPath: '/audio/voice/choose-level.mp3',
    category: 'map',
    cooldownMs: 2500,
  },
  openStringForest: {
    id: 'openStringForest',
    fallbackText: 'Welcome to Open String Forest.',
    audioPath: '/audio/voice/open-string-forest.mp3',
    category: 'map',
    cooldownMs: 2500,
  },
  listenMagicNote: {
    id: 'listenMagicNote',
    fallbackText: 'Ready? Listen to the magic note.',
    audioPath: '/audio/voice/listen-magic-note.mp3',
    category: 'challenge',
    cooldownMs: 1600,
  },
  tryA: {
    id: 'tryA',
    fallbackText: 'Let’s try your A string.',
    audioPath: '/audio/voice/play-a.mp3',
    category: 'challenge',
    cooldownMs: 1200,
  },
  tryD: {
    id: 'tryD',
    fallbackText: 'Let’s try your D string.',
    audioPath: '/audio/voice/play-d.mp3',
    category: 'challenge',
    cooldownMs: 1200,
  },
  tryG: {
    id: 'tryG',
    fallbackText: 'Let’s try your G string.',
    audioPath: '/audio/voice/play-g.mp3',
    category: 'challenge',
    cooldownMs: 1200,
  },
  tryE: {
    id: 'tryE',
    fallbackText: 'Let’s try your E string.',
    audioPath: '/audio/voice/play-e.mp3',
    category: 'challenge',
    cooldownMs: 1200,
  },
  holdSteady: {
    id: 'holdSteady',
    fallbackText: 'Beautiful... hold it steady.',
    audioPath: '/audio/voice/hold-it.mp3',
    category: 'challenge',
    cooldownMs: 2200,
  },
  almostThere: {
    id: 'almostThere',
    fallbackText: 'Almost there. Try once more.',
    audioPath: '/audio/voice/almost.mp3',
    category: 'feedback',
    cooldownMs: 2500,
  },
  tooLowGentle: {
    id: 'tooLowGentle',
    fallbackText: 'Almost there. Let your note float a little higher.',
    audioPath: '/audio/voice/too-low.mp3',
    category: 'feedback',
    cooldownMs: 2500,
  },
  tooHighGentle: {
    id: 'tooHighGentle',
    fallbackText: 'Good try. Let your note float a little lower.',
    audioPath: '/audio/voice/too-high.mp3',
    category: 'feedback',
    cooldownMs: 2500,
  },
  magicNoteFound: {
    id: 'magicNoteFound',
    fallbackText: 'Great job! You found the magic note.',
    audioPath: '/audio/voice/magic-note-found.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
  greatJob: {
    id: 'greatJob',
    fallbackText: 'Great job!',
    audioPath: '/audio/voice/great-job.mp3',
    category: 'reward',
    cooldownMs: 1200,
  },
  rewardUnlocked: {
    id: 'rewardUnlocked',
    fallbackText: 'You unlocked a new word!',
    audioPath: '/audio/voice/reward-unlocked.mp3',
    category: 'reward',
    cooldownMs: 1500,
  },
  wordStar: {
    id: 'wordStar',
    fallbackText: 'You unlocked star. A star shines.',
    audioPath: '/audio/voice/word-star.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
  wordMoon: {
    id: 'wordMoon',
    fallbackText: 'You unlocked moon. The moon is purple.',
    audioPath: '/audio/voice/word-moon.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
  wordCat: {
    id: 'wordCat',
    fallbackText: 'You unlocked cat. A cute cat.',
    audioPath: '/audio/voice/word-cat.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
  wordPurple: {
    id: 'wordPurple',
    fallbackText: 'You unlocked purple. I love purple.',
    audioPath: '/audio/voice/word-purple.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
  wordBow: {
    id: 'wordBow',
    fallbackText: 'You unlocked bow. A pretty bow.',
    audioPath: '/audio/voice/word-bow.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
  wordViolin: {
    id: 'wordViolin',
    fallbackText: 'You unlocked violin. I play violin.',
    audioPath: '/audio/voice/word-violin.mp3',
    category: 'reward',
    cooldownMs: 1000,
  },
};

export const noteVoiceLineIds = {
  A: 'tryA',
  D: 'tryD',
  G: 'tryG',
  E: 'tryE',
} as const;

export const wordVoiceLineIds = {
  star: 'wordStar',
  moon: 'wordMoon',
  cat: 'wordCat',
  purple: 'wordPurple',
  bow: 'wordBow',
  violin: 'wordViolin',
} as const;
