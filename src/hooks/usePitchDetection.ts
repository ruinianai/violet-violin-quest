import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type PitchState = {
  frequency: number | null;
  volume: number;
  isListening: boolean;
  hasSound: boolean;
  error: string | null;
};

export type PitchController = PitchState & {
  start: () => Promise<boolean>;
  stop: () => void;
  playTone: (frequency: number) => void;
};

const MIN_VOLUME = 0.018;

function friendlyMicError(error: unknown) {
  const maybeError = error as { name?: string };
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'This browser cannot use the magic microphone. Please try Safari or Chrome on a phone or iPad.';
  }
  if (maybeError.name === 'NotAllowedError' || maybeError.name === 'PermissionDeniedError') {
    return 'Please ask a grown-up to allow microphone access.';
  }
  return 'Oops, I need the microphone to hear your violin. Please ask a grown-up to allow microphone access.';
}

function rms(buffer: Float32Array) {
  let sum = 0;
  for (let index = 0; index < buffer.length; index += 1) sum += buffer[index] * buffer[index];
  return Math.sqrt(sum / buffer.length);
}

function autoCorrelate(buffer: Float32Array, sampleRate: number) {
  const volume = rms(buffer);
  if (volume < MIN_VOLUME) return null;

  let bestOffset = -1;
  let bestCorrelation = 0;
  const minOffset = Math.floor(sampleRate / 900);
  const maxOffset = Math.floor(sampleRate / 150);

  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - offset; i += 1) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlation /= buffer.length - offset;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation < 0.003 || bestOffset <= 0) return null;
  return sampleRate / bestOffset;
}

export function usePitchDetection(): PitchController {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const smoothFrequencyRef = useRef<number | null>(null);
  const [state, setState] = useState<PitchState>({
    frequency: null,
    volume: 0,
    isListening: false,
    hasSound: false,
    error: null,
  });

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;
    if (!analyser || !audioContext) return;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    const volume = rms(buffer);
    const rawFrequency = autoCorrelate(buffer, audioContext.sampleRate);
    let frequency = rawFrequency;

    if (rawFrequency) {
      const previous = smoothFrequencyRef.current;
      frequency = previous ? previous * 0.72 + rawFrequency * 0.28 : rawFrequency;
      smoothFrequencyRef.current = frequency;
    } else {
      smoothFrequencyRef.current = null;
    }

    setState((current) => ({
      ...current,
      frequency: frequency ?? null,
      volume,
      hasSound: volume > MIN_VOLUME,
      isListening: true,
      error: null,
    }));
    frameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState((current) => ({
        ...current,
        error: 'This browser cannot use the magic microphone. Please try Safari or Chrome on a phone or iPad.',
      }));
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('AudioContext unsupported');
      const audioContext = audioContextRef.current ?? new AudioContextClass();
      if (audioContext.state === 'suspended') await audioContext.resume();

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setState({ frequency: null, volume: 0, isListening: true, hasSound: false, error: null });
      frameRef.current = window.requestAnimationFrame(tick);
      return true;
    } catch (error) {
      setState((current) => ({ ...current, error: friendlyMicError(error), isListening: false }));
      return false;
    }
  }, [tick]);

  const stop = useCallback(() => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    frameRef.current = null;
    streamRef.current = null;
    analyserRef.current = null;
    setState((current) => ({ ...current, isListening: false }));
  }, []);

  const playTone = useCallback((frequency: number) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = audioContext;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.14, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.85);
  }, []);

  useEffect(() => stop, [stop]);

  return useMemo(() => ({ ...state, start, stop, playTone }), [state, start, stop, playTone]);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
