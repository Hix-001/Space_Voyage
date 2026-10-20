/**
 * Space Voyage - Web Audio API Procedural Sound Synthesizer
 * High-tech UI feedback, cosmic ambient drones, and warp drive acoustics.
 */

class CosmicSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isPlayingAmbient = false;
    this.ambientNodes = null;
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      this.playBeep(880, 'sine', 0.15, 0.1);
      return true;
    }
  }

  // Synthesizes a soothing deep space ambient drone with subtle filter modulation
  startAmbient() {
    if (this.isMuted || this.isPlayingAmbient) return;
    this.init();

    try {
      const now = this.ctx.currentTime;

      // Sub-bass oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, now); // A1 note

      // Harmonic fifth oscillator
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(82.4, now); // E2 note

      // Lowpass Filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      // LFO for breathing filter sweep
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, now); // very slow 12s cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(80, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Ambient master gain
      const ambientGain = this.ctx.createGain();
      ambientGain.gain.setValueAtTime(0.001, now);
      ambientGain.gain.exponentialRampToValueAtTime(0.22, now + 3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      this.ambientNodes = { osc1, osc2, lfo, ambientGain };
      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  stopAmbient() {
    if (!this.isPlayingAmbient || !this.ambientNodes) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientNodes.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
      setTimeout(() => {
        if (this.ambientNodes) {
          this.ambientNodes.osc1.stop();
          this.ambientNodes.osc2.stop();
          this.ambientNodes.lfo.stop();
          this.ambientNodes = null;
        }
        this.isPlayingAmbient = false;
      }, 1000);
    } catch (e) {
      this.isPlayingAmbient = false;
    }
  }

  // UI Interactive Beeps & Blips
  playBeep(freq = 600, type = 'sine', duration = 0.1, volume = 0.08) {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  // Hover tone for interactive elements
  playHoverBlip() {
    this.playBeep(440, 'triangle', 0.05, 0.04);
  }

  // Click tone
  playClick() {
    this.playBeep(750, 'sine', 0.08, 0.09);
  }

  // Sonar radar blip
  playRadarPing() {
    this.playBeep(1200, 'sine', 0.35, 0.05);
  }

  // Cinematic Hyperdrive Warp Jump Sound
  playWarpSound() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      // Pitch sweeps upwards rapidly to simulate warp acceleration
      osc.frequency.exponentialRampToValueAtTime(1400, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 1.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);
    } catch (e) {}
  }
}

// Global instance
window.cosmicAudio = new CosmicSoundEngine();
