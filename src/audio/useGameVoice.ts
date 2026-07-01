import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { voiceLines, type VoiceLineId } from './voiceLines';

const VOICE_KEY = 'violet-violin-voice-enabled';
const NARRATOR_KEY = 'violet-violin-narrator-mode';

export type NarratorMode = 'browser' | 'files';

type PlayVoiceOptions = {
  force?: boolean;
  feedback?: boolean;
};

function readVoiceSetting() {
  const stored = window.localStorage.getItem(VOICE_KEY);
  return stored === null ? true : stored === 'true';
}

function readNarratorMode(): NarratorMode {
  return window.localStorage.getItem(NARRATOR_KEY) === 'browser' ? 'browser' : 'files';
}

function scoreVoice(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;
  if (lang.startsWith('en')) score += 100;
  if (lang === 'en-us') score += 12;
  if (/samantha|karen|moira|serena|daniel|google|microsoft|natural|enhanced|premium/.test(name)) score += 28;
  if (voice.localService) score += 8;
  if (/compact|robot|novelty|whisper|zarvox|trinoids|bells|boing|bad news/.test(name)) score -= 50;
  return score;
}

function pickBestVoice(voices: SpeechSynthesisVoice[]) {
  return [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] ?? null;
}

export function useGameVoice() {
  const [voiceEnabled, setVoiceEnabledState] = useState(readVoiceSetting);
  const [narratorMode, setNarratorModeState] = useState<NarratorMode>(readNarratorMode);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentLineId, setCurrentLineId] = useState<VoiceLineId | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastPlayedAt = useRef<Partial<Record<VoiceLineId, number>>>({});
  const lastFeedbackAt = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechTimerRef = useRef<number | null>(null);

  useEffect(() => {
    window.localStorage.setItem(VOICE_KEY, String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    window.localStorage.setItem(NARRATOR_KEY, narratorMode);
  }, [narratorMode]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const selectedVoice = useMemo(() => pickBestVoice(voices), [voices]);

  const stopCurrentVoice = useCallback(() => {
    if (speechTimerRef.current) window.clearTimeout(speechTimerRef.current);
    speechTimerRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentLineId(null);
  }, []);

  const setVoiceEnabled = useCallback(
    (enabled: boolean) => {
      setVoiceEnabledState(enabled);
      if (!enabled) stopCurrentVoice();
    },
    [stopCurrentVoice],
  );

  const setNarratorMode = useCallback((mode: NarratorMode) => {
    setNarratorModeState(mode);
  }, []);

  const playSpeechFallback = useCallback(
    (lineId: VoiceLineId, text: string) => {
      if (!('speechSynthesis' in window)) {
        setIsSpeaking(false);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.82;
        utterance.pitch = 1.04;
        utterance.volume = 1;
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.onstart = () => {
          setCurrentLineId(lineId);
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentLineId(null);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          setCurrentLineId(null);
        };
        window.speechSynthesis.speak(utterance);

        speechTimerRef.current = window.setTimeout(() => {
          setIsSpeaking(false);
          setCurrentLineId(null);
        }, Math.max(1600, text.length * 75));
      } catch {
        setIsSpeaking(false);
        setCurrentLineId(null);
      }
    },
    [selectedVoice],
  );

  const playVoice = useCallback(
    (lineId: VoiceLineId, options: PlayVoiceOptions = {}) => {
      const line = voiceLines[lineId];
      if (!voiceEnabled || !line) return;

      const now = Date.now();
      const cooldown = options.feedback ? Math.max(line.cooldownMs, 2500) : line.cooldownMs;
      if (!options.force && now - (lastPlayedAt.current[lineId] ?? 0) < cooldown) return;
      if (options.feedback && !options.force && now - lastFeedbackAt.current < 2500) return;

      lastPlayedAt.current[lineId] = now;
      if (options.feedback) lastFeedbackAt.current = now;
      stopCurrentVoice();
      setCurrentLineId(lineId);
      setIsSpeaking(true);

      const shouldTryFile = narratorMode === 'files' && line.audioPath;
      if (shouldTryFile) {
        const audio = new Audio(line.audioPath);
        audioRef.current = audio;
        audio.volume = 1;
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentLineId(null);
          audioRef.current = null;
        };
        audio.onerror = () => {
          audioRef.current = null;
          playSpeechFallback(lineId, line.fallbackText);
        };
        audio.play().catch(() => {
          audioRef.current = null;
          playSpeechFallback(lineId, line.fallbackText);
        });
        return;
      }

      playSpeechFallback(lineId, line.fallbackText);
    },
    [narratorMode, playSpeechFallback, stopCurrentVoice, voiceEnabled],
  );

  return {
    voiceEnabled,
    setVoiceEnabled,
    narratorMode,
    setNarratorMode,
    currentLineId,
    isSpeaking,
    playVoice,
    selectedVoiceName: selectedVoice?.name ?? 'Browser default',
  };
}
