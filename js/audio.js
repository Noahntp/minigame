/**
 * AudioEngine - Web Audio API Synthesizer
 * Generates rich, procedural sound effects without relying on external audio files.
 */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('minigame_sound_muted') === 'true';
    this.hasInteracted = false;

    // Auto-init on first user gesture
    const unlockAudio = () => {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasInteracted = true;
      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlockAudio);
      });
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockAudio, { once: true });
    });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.isMuted = muted;
    localStorage.setItem('minigame_sound_muted', muted ? 'true' : 'false');
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- Sound Effects ---

  // UI Tap / Click
  playClick() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Heartbeat (Thump-thump)
  playHeartbeat(rate = 1) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const playThump = (timeOffset, freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + timeOffset;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    };

    playThump(0, 95);
    playThump(0.12 / rate, 80);
  }

  // Christmas Bell / Chime (Cathedral Brass Bell with Inharmonic Partials)
  playBell(pitchMultiplier = 1.0, volume = 0.3) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 587.33 * pitchMultiplier; // D5 base for radiant festive bell

    // Real cast bronze/brass bell partials
    const partials = [
      { ratio: 0.5, gain: 0.25, decay: 2.2, detune: -1.0 },   // Hum tone
      { ratio: 1.0, gain: 0.32, decay: 1.8, detune: 0.0 },    // Prime
      { ratio: 1.003, gain: 0.16, decay: 1.5, detune: 1.8 },  // Chorus beat
      { ratio: 1.2, gain: 0.22, decay: 1.3, detune: 0.5 },    // Tierce (minor 3rd)
      { ratio: 1.5, gain: 0.18, decay: 1.1, detune: -0.8 },   // Quint
      { ratio: 2.0, gain: 0.15, decay: 0.85, detune: 1.2 },   // Nominal
      { ratio: 2.76, gain: 0.09, decay: 0.55, detune: 0 },    // Shimmer
      { ratio: 4.0, gain: 0.06, decay: 0.35, detune: 0 },     // Sparkle
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    // 1. Clapper metallic strike impact
    try {
      const strikeOsc = ctx.createOscillator();
      const strikeGain = ctx.createGain();
      strikeOsc.type = 'triangle';
      strikeOsc.frequency.setValueAtTime(2800 * pitchMultiplier, now);
      strikeOsc.frequency.exponentialRampToValueAtTime(800, now + 0.035);
      strikeGain.gain.setValueAtTime(0.35, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      strikeOsc.connect(strikeGain);
      strikeGain.connect(masterGain);
      strikeOsc.start(now);
      strikeOsc.stop(now + 0.035);
    } catch (e) {}

    // 2. Resonant partials
    partials.forEach(({ ratio, gain, decay, detune }) => {
      try {
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio + detune, now);

        pGain.gain.setValueAtTime(0, now);
        pGain.gain.linearRampToValueAtTime(gain, now + 0.006);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(pGain);
        pGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      } catch (e) {}
    });
  }

  // Sleigh bells ringing (Multiple rapid crystalline bells)
  playSleighBells() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const clusters = [
      { delay: 0.0, freqs: [1864, 2349, 2793, 3729] },
      { delay: 0.08, freqs: [1760, 2217, 2637, 3520] },
      { delay: 0.18, freqs: [1975, 2489, 2960, 3951] },
      { delay: 0.28, freqs: [1864, 2349, 2793, 3729] },
      { delay: 0.40, freqs: [1760, 2217, 2637, 3520] },
      { delay: 0.52, freqs: [1975, 2489, 2960, 3951] },
      { delay: 0.66, freqs: [1864, 2349, 2793, 3729] },
    ];

    clusters.forEach(({ delay, freqs }) => {
      const t = now + delay;
      freqs.forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          const amp = 0.05 / (idx + 1);
          gain.gain.setValueAtTime(amp, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + 0.12);
        } catch (e) {}
      });
    });
  }

  // Ice Freeze / Crystal Shatter
  playFreeze() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(3600, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Flower Bloom Harp Arpeggio
  playFlowerBloom() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.6);
    });
  }

  // Gold Coin Clink
  playCoin() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [987.77, 1318.51]; // B5, E6

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  // Firework Launch + Explosion Boom
  playFirework() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Whistle rise
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.6);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);

    // 2. Boom explosion (Noise + low thud)
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const boomTime = this.ctx.currentTime;

      // Low frequency boom
      const boomOsc = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(160, boomTime);
      boomOsc.frequency.exponentialRampToValueAtTime(30, boomTime + 0.6);

      boomGain.gain.setValueAtTime(0.7, boomTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.7);

      boomOsc.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boomOsc.start(boomTime);
      boomOsc.stop(boomTime + 0.7);

      // Crackle buffer
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, boomTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, boomTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, boomTime + 0.5);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(boomTime);
    }, 550);
  }

  // Dragon Roar / Mystical Wind Swoop
  playDragonRoar() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(70, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // Magic Sparkle / Radiant Glow
  playMagicChime() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const freqs = [784, 988, 1175, 1568, 1976, 2349];
    const now = ctx.currentTime;

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  // Grand Fanfare / Reward Win
  playWinFanfare() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.12 }, // G5
      { f: 1046.50, t: 0.36, d: 0.5 }, // C6
    ];

    const now = ctx.currentTime;

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + note.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.d);
    });
  }

  // Tactile Wax Crack snap & golden chime
  playWaxSealCrack() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // Crystalline fracture ping
    const ping = ctx.createOscillator();
    const pingGain = ctx.createGain();
    ping.type = 'sine';
    ping.frequency.setValueAtTime(1760, now + 0.02);
    pingGain.gain.setValueAtTime(0.18, now + 0.02);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    ping.connect(pingGain);
    pingGain.connect(ctx.destination);
    ping.start(now + 0.02);
    ping.stop(now + 0.35);

    // Golden Romantic Stardust Chimes (E6, G#6, B6, E7)
    const chimes = [1318.51, 1661.22, 1975.53, 2637.02];
    chimes.forEach((f, idx) => {
      const cOsc = ctx.createOscillator();
      const cGain = ctx.createGain();
      const st = now + 0.08 + idx * 0.06;

      cOsc.type = 'sine';
      cOsc.frequency.setValueAtTime(f, st);

      cGain.gain.setValueAtTime(0, st);
      cGain.gain.linearRampToValueAtTime(0.14, st + 0.015);
      cGain.gain.exponentialRampToValueAtTime(0.001, st + 0.45);

      cOsc.connect(cGain);
      cGain.connect(ctx.destination);
      cOsc.start(st);
      cOsc.stop(st + 0.45);
    });
  }

  // Romantic harp parchment unfold
  playParchmentUnfold() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.16, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.55);
    });
  }
}

export const sound = new AudioEngine();
