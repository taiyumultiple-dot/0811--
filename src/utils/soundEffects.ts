// Web Audio API Sound Effects Synthesizer for Interactive UI Feedback

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const isSoundEnabled = () => soundEnabled;

/**
 * Crisp subtle click sound for buttons and interactive items
 */
export const playClickSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Audio context fallback safeguard
  }
};

/**
 * Soft tab / page navigation shift sound
 */
export const playTabSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.08); // E5

    osc2.frequency.setValueAtTime(1046.5, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Safeguard
  }
};

/**
 * Success / Celebration Arpeggio (Correct Answer Sound)
 */
export const playSuccessSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.12);
    });
  } catch (e) {
    // Safeguard
  }
};

export const playCorrectSound = playSuccessSound;

/**
 * Wrong / Error Buzzer Sound
 */
export const playWrongSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';

    // Low buzz frequencies descending
    osc1.frequency.setValueAtTime(180, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.22);

    osc2.frequency.setValueAtTime(135, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.22);
  } catch (e) {
    // Safeguard
  }
};

export const playErrorSound = playWrongSound;

/* -------------------------------------------------------------------------- */
/*  Multi-Theme Web Audio Background Music Engine (Distinct melodies per view) */
/* -------------------------------------------------------------------------- */

export type BGMTheme = 'home' | 'hub' | 'game' | 'phonics' | 'relax';

interface TrackConfig {
  name: string;
  tempoMs: number;
  melody: number[];
  bass: number[];
  waveType: OscillatorType;
}

const BGM_TRACKS: Record<BGMTheme, TrackConfig> = {
  // 1. Home Theme - Taiwanese Folk Pentatonic (YouTube 24Yv0M8T53c)
  home: {
    name: '🏠 台灣風情主頁曲 (YouTube: 24Yv0M8T53c)',
    tempoMs: 250,
    waveType: 'sine',
    melody: [
      392.00, 440.00, 493.88, 587.33, 659.25, 587.33, 493.88, 440.00, // G4 A4 B4 D5 E5 D5 B4 A4
      392.00, 493.88, 587.33, 659.25, 783.99, 659.25, 587.33, 493.88, // G4 B4 D5 E5 G5 E5 D5 B4
      440.00, 493.88, 587.33, 440.00, 392.00, 440.00, 493.88, 392.00, // A4 B4 D5 A4 G4 A4 B4 G4
    ],
    bass: [
      196.00, 196.00, 146.83, 146.83, 164.81, 164.81, 196.00, 196.00, // G3, D3, E3, G3
    ],
  },

  // 2. Games Hub Theme - Arcade Carnival (Upbeat & Cheerful)
  hub: {
    name: '🎪 遊戲大廳嘉年華',
    tempoMs: 190,
    waveType: 'triangle',
    melody: [
      523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33, // C5 E5 G5 E5 A5 G5 E5 D5
      523.25, 587.33, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, // C5 D5 E5 G5 C6 A5 G5 E5
      587.33, 659.25, 587.33, 523.25, 440.00, 523.25, 587.33, 523.25, // D5 E5 D5 C5 A4 C5 D5 C5
    ],
    bass: [
      130.81, 130.81, 174.61, 174.61, 196.00, 196.00, 130.81, 196.00, // C3, F3, G3, C3
    ],
  },

  // 3. Action Game Theme - High Energy Chiptune (Fast, Exciting)
  game: {
    name: '⚡ 快樂闖關大冒險',
    tempoMs: 160,
    waveType: 'square',
    melody: [
      659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0, // E5 E5 - E5 - C5 E5 -
      783.99, 0, 0, 0, 392.00, 0, 0, 0,              // G5 - - - G4 - - -
      523.25, 0, 0, 392.00, 0, 0, 329.63, 0,          // C5 - - G4 - - E4 -
      440.00, 0, 493.88, 0, 466.16, 440.00, 392.00, 659.25, // A4 - B4 - Bb4 A4 G4 E5
    ],
    bass: [
      130.81, 164.81, 196.00, 130.81, 174.61, 220.00, 196.00, 146.83, // C3 E3 G3 C3 F3 A3 G3 D3
    ],
  },

  // 4. Phonics Theme - Focused Learning Study Groove (Rhythmic)
  phonics: {
    name: '📖 台羅語音探索曲',
    tempoMs: 220,
    waveType: 'triangle',
    melody: [
      440.00, 523.25, 659.25, 523.25, 587.33, 440.00, 523.25, 392.00, // A4 C5 E5 C5 D5 A4 C5 G4
      440.00, 523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 440.00, // A4 C5 E5 G5 E5 D5 C5 A4
    ],
    bass: [
      220.00, 220.00, 174.61, 174.61, 196.00, 196.00, 164.81, 220.00, // A3, F3, G3, E3
    ],
  },

  // 5. Relax Theme - News & Records (Lo-Fi Chill)
  relax: {
    name: '☕ 輕鬆閱讀記錄曲',
    tempoMs: 280,
    waveType: 'sine',
    melody: [
      329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 293.66, // E4 G4 A4 C5 A4 G4 E4 D4
      329.63, 440.00, 523.25, 659.25, 523.25, 440.00, 392.00, 329.63, // E4 A4 C5 E5 C5 A4 G4 E4
    ],
    bass: [
      164.81, 164.81, 220.00, 220.00, 174.61, 174.61, 196.00, 164.81, // E3, A3, F3, G3
    ],
  },
};

let bgmInterval: any = null;
let bgmStep = 0;
let bgmVolume = 5; // Default 5%
let bgmPlaying = false;
let currentTheme: BGMTheme = 'home';

export const setBGMVolume = (vol: number) => {
  bgmVolume = Math.max(0, Math.min(100, vol));
  if (bgmVolume === 0 && bgmPlaying) {
    // If volume set to 0, notify
  }
  notifyBgmState();
};

export const getBGMVolume = () => bgmVolume;

export const notifyBgmState = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('bgm-state-changed', {
        detail: {
          playing: bgmPlaying,
          volume: bgmVolume,
          theme: currentTheme,
          trackName: getCurrentBGMTrackName(),
        },
      })
    );
  }
};

export const getCurrentBGMTrackName = () => BGM_TRACKS[currentTheme].name;

export const startBGM = (theme?: BGMTheme) => {
  if (theme) {
    currentTheme = theme;
  }
  if (!soundEnabled) {
    bgmPlaying = false;
    notifyBgmState();
    return;
  }

  bgmPlaying = true;
  notifyBgmState();
};

export const stopBGM = () => {
  bgmPlaying = false;
  notifyBgmState();
};

export const toggleBGM = (theme?: BGMTheme) => {
  if (bgmPlaying) {
    stopBGM();
  } else {
    startBGM(theme || currentTheme);
  }
  return bgmPlaying;
};

export const cycleBGMTrack = (): { playing: boolean; name: string } => {
  const themes: BGMTheme[] = ['home', 'hub', 'game', 'phonics', 'relax'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  startBGM(nextTheme);
  return { playing: true, name: getCurrentBGMTrackName() };
};

export const isBGMActive = () => bgmPlaying;

/**
 * Pop sound for modal popups and card opens
 */
export const playPopSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Safeguard
  }
};

/**
 * Global auto click sound event binder for button/clickable elements
 */
export const initGlobalSoundEffects = () => {
  if (typeof window === 'undefined') return;

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Find nearest button or element with role="button" or cursor-pointer or clickable tag
    const clickable = target.closest('button, a, [role="button"], input[type="submit"], .cursor-pointer');
    if (clickable) {
      const soundType = clickable.getAttribute('data-sound');
      if (soundType === 'none') return;
      if (soundType === 'tab') {
        playTabSound();
      } else if (soundType === 'success') {
        playSuccessSound();
      } else if (soundType === 'pop') {
        playPopSound();
      } else {
        playClickSound();
      }
    }
  };

  window.addEventListener('click', handleClick, true);
  return () => {
    window.removeEventListener('click', handleClick, true);
  };
};
