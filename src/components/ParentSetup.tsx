type ParentSetupProps = {
  error: string | null;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  onStart: () => void;
  onSkip: () => void;
  onBack: () => void;
};

export function ParentSetup({ error, voiceEnabled, setVoiceEnabled, onStart, onSkip, onBack }: ParentSetupProps) {
  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>← Home</button>
      <h1>Before We Start</h1>
      <div className="magic-card parent-card">
        <ul>
          <li>Find a quiet place.</li>
          <li>Let your child play open strings first.</li>
          <li>Tap Start Magic Mic and allow microphone access.</li>
          <li>Audio is only used to check pitch in this browser.</li>
          <li>No account, no ads, no upload.</li>
        </ul>
      </div>

      <label className="toggle-card">
        <span>Magic Voice</span>
        <input type="checkbox" checked={voiceEnabled} onChange={(event) => setVoiceEnabled(event.target.checked)} />
        <strong>{voiceEnabled ? 'On' : 'Off'}</strong>
      </label>

      {error && <p className="friendly-error">{error}</p>}

      <button className="primary-button glow-button" onClick={onStart}>
        Start Magic Mic
      </button>
      <button className="secondary-button" onClick={onSkip}>
        Skip
      </button>
    </section>
  );
}
