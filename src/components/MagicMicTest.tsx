import { useEffect, useState } from 'react';
import type { VoiceLineId } from '../audio/voiceLines';
import { centsFromTarget, notes } from '../data/notes';
import type { PitchController } from '../hooks/usePitchDetection';

type MagicMicTestProps = {
  pitch: PitchController;
  playVoice: (lineId: VoiceLineId, options?: { force?: boolean; feedback?: boolean }) => void;
  currentLineId: VoiceLineId | null;
  isSpeaking: boolean;
  onContinue: () => void;
  onBack: () => void;
};

export function MagicMicTest({ pitch, playVoice, currentLineId, isSpeaking, onContinue, onBack }: MagicMicTestProps) {
  const [timedOut, setTimedOut] = useState(false);
  const cents = pitch.frequency ? centsFromTarget(pitch.frequency, notes.A.frequency) : null;
  const closeToA = cents !== null && Math.abs(cents) <= 45;
  const message = closeToA
    ? 'Beautiful A!'
    : pitch.hasSound
      ? 'I can hear your violin!'
      : timedOut
        ? 'I can’t hear the violin yet. Try moving closer or ask a grown-up to check microphone access.'
        : 'Play your A string';

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (closeToA) playVoice('micReady', { feedback: true });
    else if (pitch.hasSound) playVoice('micCanHearYou', { feedback: true });
  }, [closeToA, pitch.hasSound, playVoice]);

  useEffect(() => {
    if (timedOut && !pitch.hasSound) playVoice('micCannotHear', { feedback: true });
  }, [pitch.hasSound, playVoice, timedOut]);

  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h1>Magic Mic Test</h1>
      <p className={`prompt-text ${isSpeaking && currentLineId?.startsWith('mic') ? 'speaking-text' : ''}`}>{message}</p>

      <div className={`crystal ${pitch.hasSound ? 'awake' : ''} ${closeToA ? 'perfect' : ''}`} aria-label={message}>
        ◆
      </div>

      <div className="volume-meter">
        <span style={{ width: `${Math.min(100, pitch.volume * 900)}%` }} />
      </div>

      {pitch.error && <p className="friendly-error">{pitch.error}</p>}

      <button className="primary-button" onClick={onContinue} disabled={!pitch.hasSound && !timedOut}>
        Continue to Map
      </button>
    </section>
  );
}
