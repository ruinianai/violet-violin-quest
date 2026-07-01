import { stickers } from '../data/stickers';
import type { Progress } from '../hooks/useProgress';

type StickersProps = {
  progress: Progress;
  onBack: () => void;
};

export function Stickers({ progress, onBack }: StickersProps) {
  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>← Home</button>
      <h1>Stickers</h1>
      <p className="subtitle">Collect stars to open sticker magic!</p>
      <div className="collection-grid">
        {stickers.map((sticker) => {
          const unlocked = progress.unlockedStickerIds.includes(sticker.id);
          return (
            <div className={`sticker-card ${unlocked ? 'unlocked' : 'locked'}`} key={sticker.id}>
              <span>{unlocked ? sticker.emoji : '✦'}</span>
              <strong>{sticker.name}</strong>
              <p>{unlocked ? 'Sticker magic unlocked!' : sticker.unlockCondition}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
