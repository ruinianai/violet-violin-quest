import { useCallback, useEffect, useRef, useState } from 'react';

const VOICE_KEY = 'violet-violin-voice-enabled';

type SpeakOptions = {
  force?: boolean;
  feedback?: boolean;
};

function readVoiceSetting() {
  const stored = window.localStorage.getItem(VOICE_KEY);
  return stored === null ? true : stored === 'true';
}

export function useSpeech() {
  const [voiceEnabled, setVoiceEnabledState] = useState(readVoiceSetting);
  const lastFeedbackAt = useRef(0);

  useEffect(() => {
    window.localStorage.setItem(VOICE_KEY, String(voiceEnabled));
  }, [voiceEnabled]);

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setVoiceEnabledState(enabled);
  }, []);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!voiceEnabled || !('speechSynthesis' in window)) return;
      const now = Date.now();
      if (options.feedback && !options.force && now - lastFeedbackAt.current < 2000) return;
      if (options.feedback) lastFeedbackAt.current = now;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.12;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const gentleVoice = voices.find((voice) => voice.lang.startsWith('en') && /female|samantha|karen|moira|serena/i.test(voice.name));
      if (gentleVoice) utterance.voice = gentleVoice;

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        // Text prompts remain visible in every screen, so speech failure is safe.
      }
    },
    [voiceEnabled],
  );

  return { voiceEnabled, setVoiceEnabled, speak };
}
