// Web Audio API Synthesizer for instant, zero-latency sound effects without external audio files
class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playClick(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  playCount(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  playWin(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  playBell(enabled = true, pitchMultiplier = 1.0, volume = 0.3) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 587.33 * pitchMultiplier; // D5 base frequency for clear, melodic brass chime

    // Inharmonic bell partials: [ratio, relative_gain, decay_seconds, detune_hz]
    const partials = [
      { ratio: 0.5, gain: 0.25, decay: 2.2, detune: -1.0 },   // Hum tone (warm deep resonant bass)
      { ratio: 1.0, gain: 0.32, decay: 1.8, detune: 0.0 },    // Prime (main fundamental strike tone)
      { ratio: 1.003, gain: 0.16, decay: 1.5, detune: 1.8 },  // Chorus beat / live acoustic tremolo
      { ratio: 1.2, gain: 0.22, decay: 1.3, detune: 0.5 },    // Tierce (minor 3rd - signature bell timbre)
      { ratio: 1.5, gain: 0.18, decay: 1.1, detune: -0.8 },   // Quint (pure 5th harmonic)
      { ratio: 2.0, gain: 0.15, decay: 0.85, detune: 1.2 },   // Nominal (octave above strike)
      { ratio: 2.76, gain: 0.09, decay: 0.55, detune: 0 },    // Super-nominal shimmer
      { ratio: 4.0, gain: 0.06, decay: 0.35, detune: 0 },     // High brass sparkle
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    // 1. Clapper strike transient (metallic impact click)
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
    } catch (e) {
      // ignore
    }

    // 2. Resonant Bell Partials
    partials.forEach(({ ratio, gain, decay, detune }) => {
      try {
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio + detune, now);

        pGain.gain.setValueAtTime(0, now);
        pGain.gain.linearRampToValueAtTime(gain, now + 0.006); // Fast strike attack
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(pGain);
        pGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      } catch (e) {
        // ignore
      }
    });
  }

  // Santa's Reindeer Sleigh Bells (Joyful crystalline harness bells jingling)
  playSleighBells(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
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
        } catch (e) {
          // ignore
        }
      });
    });
  }

  // Shimmering Magic Chime (Stardust gift falling from the sky)
  playMagicChime(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [784, 988, 1175, 1568, 1976, 2349, 3136];
    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const time = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.18, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.45);
      } catch (e) {
        // ignore
      }
    });
  }

  playReward(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.45);
    });
  }

  playFireworkLaunch(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.5);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  playFireworkBurst(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 1. Deep Sub-Bass Boom
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // 2. Crackle Texture Buffer
    try {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.3);
    } catch (e) {
      // ignore
    }
  }

  playFireworkWillow(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.88 ? 1 : 0) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3500;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);
    } catch (e) {
      // ignore
    }
  }

  // Harmonic Flower Bloom Time-Lapse Harp Glissando (Pixabay Bloom Audio)
  playFlowerBloom(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const time = now + idx * 0.22;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.22, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0005, time + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 1.2);
      } catch (e) {
        // ignore
      }
    });
  }

  // Golden Pollen & Dewdrop Shimmer Sound Effect
  playPollenBurst(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [1760, 2093, 2637, 3136]; // A6, C7, E7, G7 sparkling dust
    freqs.forEach((freq, i) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const time = now + i * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, time + 0.25);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.35);
      } catch (e) {
        // ignore
      }
    });
  }

  playWaxSealCrack(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 1. Tactile Wax Crack snap
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

    // 2. Crystalline fracture ping
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

    // 3. Golden Romantic Stardust Chimes (E6, G#6, B6, E7)
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

  playParchmentUnfold(enabled = true) {
    if (!enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Romantic harp glissando: C5, E5, G5, B5, C6
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

export const sound = new SoundEngine();
