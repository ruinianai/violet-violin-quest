import { levels, type Level } from '../data/levels';
import { getWord } from '../data/words';
import type { Progress } from '../hooks/useProgress';

type LevelMapProps = {
  progress: Progress;
  report: { totalStars: number };
  isLevelUnlocked: (levelId: string) => boolean;
  onLevel: (level: Level) => void;
  onBack: () => void;
  onWords: () => void;
  onStickers: () => void;
};

export function LevelMap({ progress, report, isLevelUnlocked, onLevel, onBack, onWords, onStickers }: LevelMapProps) {
  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>← Home</button>
      <h1>Open String Forest</h1>
      <p className="subtitle">Play open strings to collect magic words!</p>
      <div className="stats-row">
        <span>⭐ {report.totalStars}</span>
        <span>🌿 6 levels</span>
      </div>

      <div className="level-list">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id);
          const completed = progress.completedLevelIds.includes(level.id);
          const stars = progress.starsByLevel[level.id] ?? 0;
          const word = getWord(level.rewardWordId);
          return (
            <button
              className={`level-card ${completed ? 'completed' : ''}`}
              key={level.id}
              disabled={!unlocked}
              onClick={() => onLevel(level)}
            >
              <span className="level-order">{unlocked ? level.order : '🔒'}</span>
              <span>
                <strong>{level.title}</strong>
                <small>
                  Play {level.targetNotes.join(' → ')} for {word.word}
                </small>
              </span>
              <span className="level-stars">{completed ? '⭐'.repeat(stars || 1) : word.emoji}</span>
            </button>
          );
        })}
      </div>

      <div className="button-grid">
        <button onClick={onWords}>My Words</button>
        <button onClick={onStickers}>Stickers</button>
      </div>
    </section>
  );
}
