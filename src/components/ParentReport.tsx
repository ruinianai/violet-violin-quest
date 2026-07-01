import type { NarratorMode } from '../audio/useGameVoice';
import { getWord } from '../data/words';
import type { Progress } from '../hooks/useProgress';

type ParentReportProps = {
  progress: Progress;
  report: {
    totalStars: number;
    completedCount: number;
    wordsCount: number;
    stickersCount: number;
    mostPracticedNote: string;
    bestNote: string;
    needsPractice: string;
    noteStats: Array<{ note: string; attempts: number; successes: number; rate: number; avgCents: number }>;
  };
  narratorMode: NarratorMode;
  setNarratorMode: (mode: NarratorMode) => void;
  selectedVoiceName: string;
  resetProgress: () => void;
  onBack: () => void;
};

export function ParentReport({
  progress,
  report,
  narratorMode,
  setNarratorMode,
  selectedVoiceName,
  resetProgress,
  onBack,
}: ParentReportProps) {
  const unlockedWords = progress.unlockedWordIds.map((id) => getWord(id).word).join(', ') || 'None yet';
  const minutes = Math.max(1, Math.round(progress.totalPlaySeconds / 60));
  const summary = `Violet Violin Quest Test Summary
Completed levels: ${report.completedCount}/6
Stars earned: ${report.totalStars}
Words unlocked: ${unlockedWords}
Stickers unlocked: ${report.stickersCount}/6
Most practiced note: ${report.mostPracticedNote}
Hardest note: ${report.needsPractice}
Total attempts: ${progress.totalAttempts}
Total play time: ${minutes} minutes`;

  return (
    <section className="screen parent-report">
      <button className="back-button" onClick={onBack}>← Home</button>
      <h1>Parent Report</h1>

      <div className="report-grid">
        <div><strong>{report.completedCount}/6</strong><span>Completed levels</span></div>
        <div><strong>{report.totalStars}</strong><span>Stars earned</span></div>
        <div><strong>{report.wordsCount}/6</strong><span>Words unlocked</span></div>
        <div><strong>{report.stickersCount}/6</strong><span>Stickers unlocked</span></div>
        <div><strong>{progress.totalAttempts}</strong><span>Total attempts</span></div>
        <div><strong>{minutes} min</strong><span>Total play time</span></div>
      </div>

      <div className="magic-card">
        <p><strong>Most practiced note:</strong> {report.mostPracticedNote}</p>
        <p><strong>Best note:</strong> {report.bestNote}</p>
        <p><strong>Needs practice:</strong> {report.needsPractice}</p>
      </div>

      <div className="magic-card narrator-card">
        <strong>Narrator Voice</strong>
        <div className="segmented-control" role="group" aria-label="Narrator voice">
          <button className={narratorMode === 'browser' ? 'active' : ''} onClick={() => setNarratorMode('browser')}>
            Browser Voice
          </button>
          <button className={narratorMode === 'files' ? 'active' : ''} onClick={() => setNarratorMode('files')}>
            Voice Files if available
          </button>
        </div>
        <p>Current browser voice: {selectedVoiceName}</p>
      </div>

      <div className="note-table">
        {report.noteStats.map((stat) => (
          <div key={stat.note}>
            <strong>{stat.note}</strong>
            <span>{stat.attempts} tries</span>
            <span>{Math.round(stat.rate * 100)}% success</span>
            <span>{Math.round(stat.avgCents)} cents avg</span>
          </div>
        ))}
      </div>

      <label className="summary-box">
        Export Test Summary
        <textarea readOnly value={summary} />
      </label>

      <button className="danger-button" onClick={resetProgress}>Reset Progress</button>
    </section>
  );
}
