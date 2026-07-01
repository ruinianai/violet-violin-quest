import { wordVoiceLineIds, type VoiceLineId } from '../audio/voiceLines';
import { words } from '../data/words';
import type { Progress } from '../hooks/useProgress';

type MyWordsProps = {
  progress: Progress;
  playVoice: (lineId: VoiceLineId, options?: { force?: boolean }) => void;
  onBack: () => void;
};

export function MyWords({ progress, playVoice, onBack }: MyWordsProps) {
  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>← Home</button>
      <h1>My Words</h1>
      <div className="collection-grid">
        {words.map((word) => {
          const unlocked = progress.unlockedWordIds.includes(word.id);
          return (
            <div className={`word-card ${unlocked ? 'unlocked' : 'locked'}`} key={word.id}>
              <span className="word-emoji">{unlocked ? word.emoji : '?'}</span>
              <strong>{unlocked ? word.word : 'LOCKED'}</strong>
              <p>{unlocked ? word.sentence : 'Keep playing to unlock!'}</p>
              {unlocked && <button onClick={() => playVoice(wordVoiceLineIds[word.id], { force: true })}>🔊</button>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
