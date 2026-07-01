import { useEffect, useState } from 'react';
import { Challenge } from './components/Challenge';
import { Home } from './components/Home';
import { LevelMap } from './components/LevelMap';
import { MagicMicTest } from './components/MagicMicTest';
import { MyWords } from './components/MyWords';
import { ParentReport } from './components/ParentReport';
import { ParentSetup } from './components/ParentSetup';
import { Stickers } from './components/Stickers';
import { WordReward } from './components/WordReward';
import { useGameVoice } from './audio/useGameVoice';
import { type Level } from './data/levels';
import { getWord } from './data/words';
import { usePitchDetection } from './hooks/usePitchDetection';
import { useProgress } from './hooks/useProgress';

type Screen = 'home' | 'setup' | 'mic-test' | 'map' | 'challenge' | 'reward' | 'words' | 'stickers' | 'parents';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [rewardLevel, setRewardLevel] = useState<Level | null>(null);
  const pitch = usePitchDetection();
  const progress = useProgress();
  const voice = useGameVoice();

  useEffect(() => {
    voice.playVoice('welcome');
  }, []);

  useEffect(() => {
    progress.setProgress((current) => {
      if (current.voiceEnabled === voice.voiceEnabled) return current;
      return { ...current, voiceEnabled: voice.voiceEnabled };
    });
  }, [progress.setProgress, voice.voiceEnabled]);

  const setMagicVoice = (enabled: boolean) => {
    voice.setVoiceEnabled(enabled);
    progress.setProgress((current) => ({ ...current, voiceEnabled: enabled }));
  };

  const startAdventure = () => {
    voice.playVoice('beforeWeStart', { force: true });
    setScreen('setup');
  };

  const startMagicMic = async () => {
    const started = await pitch.start();
    if (started) {
      voice.playVoice('playAString', { force: true });
      setScreen('mic-test');
    }
  };

  const openLevel = (level: Level) => {
    setActiveLevel(level);
    setScreen('challenge');
  };

  const completeLevel = (level: Level) => {
    setRewardLevel(level);
    setScreen('reward');
  };

  const rewardWord = rewardLevel ? getWord(rewardLevel.rewardWordId) : null;

  return (
    <main className="app-shell">
      <div className="sky-decoration" aria-hidden="true">
        <span>♪</span>
        <span>✦</span>
        <span>☾</span>
        <span>♫</span>
      </div>

      {screen === 'home' && (
        <Home
          progress={progress.progress}
          report={progress.report}
          voiceEnabled={voice.voiceEnabled}
          setVoiceEnabled={setMagicVoice}
          onStart={startAdventure}
          onWords={() => setScreen('words')}
          onStickers={() => setScreen('stickers')}
          onParents={() => setScreen('parents')}
        />
      )}

      {screen === 'setup' && (
        <ParentSetup
          error={pitch.error}
          voiceEnabled={voice.voiceEnabled}
          setVoiceEnabled={setMagicVoice}
          onStart={startMagicMic}
          onSkip={() => setScreen('map')}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'mic-test' && (
        <MagicMicTest
          pitch={pitch}
          playVoice={voice.playVoice}
          currentLineId={voice.currentLineId}
          isSpeaking={voice.isSpeaking}
          onContinue={() => {
            voice.playVoice('chooseLevel', { force: true });
            setScreen('map');
          }}
          onBack={() => setScreen('setup')}
        />
      )}

      {screen === 'map' && (
        <LevelMap
          progress={progress.progress}
          report={progress.report}
          isLevelUnlocked={progress.isLevelUnlocked}
          onLevel={openLevel}
          onBack={() => setScreen('home')}
          onWords={() => setScreen('words')}
          onStickers={() => setScreen('stickers')}
        />
      )}

      {screen === 'challenge' && activeLevel && (
        <Challenge
          level={activeLevel}
          pitch={pitch}
          difficulty={progress.progress.difficulty}
          playVoice={voice.playVoice}
          currentLineId={voice.currentLineId}
          isSpeaking={voice.isSpeaking}
          recordAttempt={progress.recordAttempt}
          completeProgress={progress.completeLevel}
          onComplete={() => completeLevel(activeLevel)}
          onBack={() => setScreen('map')}
        />
      )}

      {screen === 'reward' && rewardLevel && rewardWord && (
        <WordReward
          level={rewardLevel}
          word={rewardWord}
          playVoice={voice.playVoice}
          onContinue={() => setScreen('map')}
          onWords={() => setScreen('words')}
        />
      )}

      {screen === 'words' && <MyWords progress={progress.progress} playVoice={voice.playVoice} onBack={() => setScreen('home')} />}
      {screen === 'stickers' && <Stickers progress={progress.progress} onBack={() => setScreen('home')} />}
      {screen === 'parents' && (
        <ParentReport
          progress={progress.progress}
          report={progress.report}
          narratorMode={voice.narratorMode}
          setNarratorMode={voice.setNarratorMode}
          selectedVoiceName={voice.selectedVoiceName}
          resetProgress={progress.resetProgress}
          onBack={() => setScreen('home')}
        />
      )}
    </main>
  );
}
