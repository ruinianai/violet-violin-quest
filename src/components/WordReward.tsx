import { wordVoiceLineIds, type VoiceLineId } from '../audio/voiceLines';
import type { Level } from '../data/levels';
import type { MagicWord } from '../data/words';

type WordRewardProps = {
  level: Level;
  word: MagicWord;
  playVoice: (lineId: VoiceLineId, options?: { force?: boolean }) => void;
  onContinue: () => void;
  onWords: () => void;
};

export function WordReward({ level, word, playVoice, onContinue, onWords }: WordRewardProps) {
  const hearWord = () => playVoice(wordVoiceLineIds[word.id], { force: true });

  return (
    <section className="screen reward-screen">
      <p className="top-pill">{level.title} complete</p>
      <h1>You unlocked a new word!</h1>
      <div className="word-card unlocked pop">
        <span className="word-emoji">{word.emoji}</span>
        <strong>{word.word}</strong>
        <p>{word.sentence}</p>
      </div>
      <button className="primary-button" onClick={hearWord}>Hear Word</button>
      <button className="secondary-button" onClick={onWords}>Add to My Words</button>
      <button className="primary-button glow-button" onClick={onContinue}>Continue</button>
    </section>
  );
}
