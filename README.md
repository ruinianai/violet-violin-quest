# Violet Violin Quest

Chinese concept name: 紫月小提琴冒险

Violet Violin Quest is a V2 playable prototype of a mobile web game for young violin learners. A child can start the magic microphone, play violin open strings, receive friendly pitch feedback, unlock English word cards, collect stars and stickers, and let a parent view a simple practice report.

The game is browser-only. There is no backend, login, database, ads, or audio upload.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local Vite URL in a browser. For microphone access, use `localhost`, `127.0.0.1`, or HTTPS.

## Test on iPad or Phone

1. Start the dev server with host access:

   ```bash
   npm run dev -- --host 0.0.0.0
   ```

2. Make sure the iPad or phone is on the same Wi-Fi network as the computer.
3. Open the shown network URL on the mobile browser.
4. Tap Start Adventure, then Start Magic Mic.
5. Allow microphone access when the browser asks.

Mobile browsers often require a user tap before microphone, speech, or audio playback. The Start Magic Mic button starts microphone permission and the audio context from a user gesture.

## Features Implemented

- Vite + React + TypeScript project setup.
- Dreamy purple mobile-first game UI.
- Home, Parent Setup, Magic Mic Test, Level Map, Challenge, Word Reward, My Words, Stickers, and Parent Report screens.
- Web Audio microphone startup with `getUserMedia`.
- Lightweight autocorrelation pitch detection for violin open strings.
- Open string note data for G3, D4, A4, and E5.
- Magical pitch bar with Too low / Magic / Too high feedback.
- Hold-to-complete challenge flow.
- Six Open String Forest levels.
- Level 6 supports a two-note A to D sequence.
- SpeechSynthesis Magic Voice with localStorage setting.
- Throttled voice feedback for Too low / Too high.
- English word rewards with replay speaker buttons.
- Star rewards, word unlocks, and sticker unlocks.
- localStorage progress with safe reset on broken data.
- Parent report with attempts, play time, note stats, reset, and copyable summary.
- Friendly microphone and speech error handling.

## Reset Progress

Open Parents from the home screen and tap Reset Progress. This clears saved stars, levels, words, stickers, and report data from localStorage.

## Known Limitations

- Environment noise may affect pitch detection.
- Phone and iPad microphone distance affects results.
- Browser differences may affect Web Audio and SpeechSynthesis.
- This is a V2 test prototype, not a final commercial product.
- The pitch detection algorithm is intentionally lightweight and can be improved later.
- The visual character art uses emoji and CSS placeholders rather than final illustration assets.

## Recommended V3 Next Steps

- Add calibrated mic sensitivity for different devices.
- Improve pitch detection with a stronger YIN implementation and confidence scoring.
- Add parent-controlled difficulty and note-order settings.
- Create polished custom character and sticker art.
- Add more worlds after Open String Forest.
- Add guided onboarding videos or silent visual instructions for young players.
