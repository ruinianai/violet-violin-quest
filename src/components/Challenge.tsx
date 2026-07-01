import { useEffect, useMemo, useRef, useState } from 'react';
import { noteVoiceLineIds, type VoiceLineId } from '../audio/voiceLines';
import { type Level } from '../data/levels';
import { centsFromTarget, notes, type NoteId } from '../data/notes';
import { getWord } from '../data/words';
import type { PitchController } from '../hooks/usePitchDetection';
import type { Difficulty } from '../hooks/useProgress';

type ChallengeProps = {
  level: Level;
  pitch: PitchController;
  difficulty: Difficulty;
  playVoice: (lineId: VoiceLineId, options?: { force?: boolean; feedback?: boolean }) => void;
  currentLineId: VoiceLineId | null;
  isSpeaking: boolean;
  recordAttempt: (note: NoteId, cents: number | null, success: boolean) => void;
  completeProgress: (levelId: string, wordId: Level['rewardWordId'], stars: number, targetNotes: NoteId[], elapsedSeconds: number, lastCents: number | null) => void;
  onComplete: () => void;
  onBack: () => void;
};

const toleranceByDifficulty: Record<Difficulty, number> = {
  easy: 45,
  normal: 30,
  challenge: 20,
};

export function Challenge({ level, pitch, difficulty, playVoice, currentLineId, isSpeaking, recordAttempt, completeProgress, onComplete, onBack }: ChallengeProps) {
  const [phase, setPhase] = useState<'listen' | 'play' | 'hold' | 'done'>('listen');
  const [targetIndex, setTargetIndex] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [encouragement, setEncouragement] = useState('Listen to the magic note.');
  const [showHelp, setShowHelp] = useState(false);
  const levelStartRef = useRef(Date.now());
  const holdStartRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const lastAttemptAtRef = useRef(0);
  const lastCentsRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const targetNoteId = level.targetNotes[targetIndex];
  const targetNote = notes[targetNoteId];
  const rewardWord = getWord(level.rewardWordId);
  const tolerance = toleranceByDifficulty[difficulty];
  const cents = pitch.frequency ? centsFromTarget(pitch.frequency, targetNote.frequency) : null;
  const zone = useMemo(() => {
    if (!pitch.hasSound || cents === null) return 'listening';
    if (Math.abs(cents) <= tolerance) return 'magic';
    return cents < 0 ? 'low' : 'high';
  }, [cents, pitch.hasSound, tolerance]);

  const starLeft = zone === 'low' ? 12 : zone === 'high' ? 78 : zone === 'magic' ? 45 : 45;
  const completedNotes = targetIndex;

  useEffect(() => {
    setPhase('listen');
    setTargetIndex(0);
    setHoldProgress(0);
    setEncouragement('Listen to the magic note.');
    levelStartRef.current = Date.now();
    attemptsRef.current = 0;
    completedRef.current = false;
    playVoice('listenMagicNote', { force: true });
  }, [level.id]);

  useEffect(() => {
    if (phase === 'listen' || phase === 'done') return;
    if (!pitch.hasSound) {
      holdStartRef.current = null;
      setHoldProgress(0);
      setEncouragement('Listening...');
      return;
    }

    const now = Date.now();
    if (cents !== null && now - lastAttemptAtRef.current > 1500) {
      const success = Math.abs(cents) <= tolerance;
      attemptsRef.current += 1;
      lastAttemptAtRef.current = now;
      lastCentsRef.current = cents;
      recordAttempt(targetNoteId, cents, success);
    }

    if (zone === 'magic') {
      if (!holdStartRef.current) holdStartRef.current = now;
      const progress = Math.min(1, (now - holdStartRef.current) / 1000);
      setHoldProgress(progress);
      setPhase('hold');
      setEncouragement('Hold it...');
      playVoice('holdSteady', { feedback: true });

      if (progress >= 1 && !completedRef.current) {
        holdStartRef.current = null;
        setHoldProgress(0);
        if (targetIndex < level.targetNotes.length - 1) {
          setTargetIndex((index) => index + 1);
          setPhase('play');
          playVoice(noteVoiceLineIds[level.targetNotes[targetIndex + 1]], { force: true });
        } else {
          completedRef.current = true;
          setPhase('done');
          const elapsedSeconds = Math.round((Date.now() - levelStartRef.current) / 1000);
          const stars = elapsedSeconds <= 10 && attemptsRef.current <= 2 ? 3 : elapsedSeconds <= 20 && attemptsRef.current <= 5 ? 2 : 1;
          completeProgress(level.id, level.rewardWordId, stars, level.targetNotes, elapsedSeconds, lastCentsRef.current);
          playVoice('magicNoteFound', { force: true });
          window.setTimeout(onComplete, 900);
        }
      }
      return;
    }

    holdStartRef.current = null;
    setHoldProgress(0);
    if (zone === 'low') {
      setEncouragement('Almost there. Float a little higher!');
      playVoice('tooLowGentle', { feedback: true });
    } else if (zone === 'high') {
      setEncouragement('Good try. Float a little lower!');
      playVoice('tooHighGentle', { feedback: true });
    } else {
      setEncouragement('Keep playing one clear note.');
    }
  }, [cents, completeProgress, level, onComplete, phase, pitch.hasSound, playVoice, recordAttempt, targetIndex, targetNoteId, tolerance, zone]);

  const hearNote = () => {
    pitch.playTone(targetNote.frequency);
    playVoice(noteVoiceLineIds[targetNote.id], { force: true });
    setPhase('play');
    setEncouragement(`Let’s try your ${targetNote.name} string.`);
  };

  return (
    <section className="screen challenge-screen">
      <button className="back-button" onClick={onBack}>← Map</button>
      <p className="top-pill">{level.world}</p>
      <h1>{level.title}</h1>
      <p className="subtitle">Unlock {rewardWord.emoji} {rewardWord.word}</p>

      <div className="target-note-card">
        <span>Magic note</span>
        <strong>{targetNote.name}</strong>
        {level.targetNotes.length > 1 && <small>{completedNotes + 1} of {level.targetNotes.length}</small>}
      </div>

      <p className={`prompt-text ${isSpeaking && currentLineId ? 'speaking-text' : ''}`}>{encouragement}</p>

      <div className="pitch-bar" aria-label="Pitch feedback">
        <span>Float up</span>
        <span>Magic!</span>
        <span>Float down</span>
        <b style={{ left: `${starLeft}%` }}>⭐</b>
      </div>

      <div className="hold-shell">
        <span style={{ width: `${holdProgress * 100}%` }} />
      </div>

      <div className="button-grid">
        <button onClick={hearNote}>Hear Note</button>
        <button onClick={() => setShowHelp((show) => !show)}>Help</button>
      </div>

      {showHelp && (
        <div className="magic-card help-card">
          <p>Try playing one open string.</p>
          <p>Move a little closer to the iPad or phone.</p>
          <p>Find a quiet place.</p>
          <p>Ask a grown-up if the microphone is not working.</p>
        </div>
      )}

      {pitch.error && <p className="friendly-error">{pitch.error}</p>}
    </section>
  );
}
