import type { Progress } from '../hooks/useProgress';

type HomeProps = {
  progress: Progress;
  report: {
    totalStars: number;
    wordsCount: number;
    stickersCount: number;
  };
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  onStart: () => void;
  onWords: () => void;
  onStickers: () => void;
  onParents: () => void;
};

export function Home({ progress, report, voiceEnabled, setVoiceEnabled, onStart, onWords, onStickers, onParents }: HomeProps) {
  return (
    <section className="screen home-screen">
      <div className="home-scene" aria-hidden="true">
        <span className="moon-orb" />
        <span className="hill hill-one" />
        <span className="hill hill-two" />
        <span className="crystal-shard shard-left" />
        <span className="crystal-shard shard-right" />
      </div>

      <div className="home-header">
        <div className="top-pill logo-pill">紫月小提琴冒险</div>
        <h1 className="game-logo">Violet Violin Quest</h1>
        <p className="subtitle home-subtitle">Play violin, hear the notes, learn English!</p>
      </div>

      <div className="hero-medallion" aria-label="Magic violin garden">
        <div className="portal-ring" />
        <div className="avatar-stage">
          <span className="avatar-hair" />
          <span className="avatar-face" />
          <span className="avatar-body" />
          <span className="avatar-bow" />
          <span className="avatar-arm" />
          <span className="mini-violin">
            <i />
          </span>
        </div>
        <span className="orbit-note note-one">♪</span>
        <span className="orbit-note note-two">♫</span>
        <span className="orbit-star star-one">✦</span>
        <span className="orbit-star star-two">✧</span>
      </div>

      <div className="stats-row">
        <span><b>★</b> {report.totalStars} stars</span>
        <span><b>Aa</b> {report.wordsCount}/6 words</span>
        <span><b>✦</b> {report.stickersCount}/6 stickers</span>
      </div>

      <button className="primary-button glow-button crystal-button" onClick={onStart}>
        Start Magic Adventure
      </button>

      <div className="home-card-grid">
        <button className="gem-card" onClick={onWords}>
          <span>◇</span>
          My Words
        </button>
        <button className="gem-card" onClick={onStickers}>
          <span>✦</span>
          Stickers
        </button>
        <button className="gem-card" onClick={onParents}>
          <span>☾</span>
          Parents
        </button>
      </div>

      <label className="voice-toggle-card">
        <span className="voice-icon">♪</span>
        <span>Magic Voice</span>
        <input className="sr-only" type="checkbox" checked={voiceEnabled} onChange={(event) => setVoiceEnabled(event.target.checked)} />
        <span className="toggle-track" aria-hidden="true"><i /></span>
        <strong>{voiceEnabled ? 'On' : 'Off'}</strong>
      </label>

      {progress.completedLevelIds.length > 0 && <p className="soft-note">Welcome back, magic musician.</p>}
    </section>
  );
}
