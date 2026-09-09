// Pure Web Audio API Soundscape & Musical Engine
// Works 100% offline, zero external dependencies, no broken links

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientGain = null;
    this.ambientOscs = [];
    this.isAmbientPlaying = false;
    this.isMelodyPlaying = false;
    this.melodyTimeouts = [];
    this.heartbeatInterval = null;
    this.onHeartbeatBeat = null; // Callback for synchronized UI pulse
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambient gain node
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0 : 0.7;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.3);
    }
    return this.isMuted;
  }

  // --- 1. Ambient Celestial Drone / Pad ---
  startAmbient() {
    this.init();
    if (this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;

    // Frequencies for a warm, intimate chord (Db maj9: Db3, Ab3, C4, F4)
    const freqs = [138.59, 207.65, 261.63, 349.23];

    // Filter for warm intimate acoustic feel
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO to gently breathe filter cutoff
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow breath
    lfoGain.gain.setValueAtTime(90, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    filter.connect(this.ambientGain);

    this.ambientOscs = freqs.map((f, i) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.5, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.06 / (i + 1), this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    // Fade in softly over 4 seconds
    this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 4.0);
  }

  fadeAmbient(targetVol = 0.05, duration = 2.0) {
    if (!this.ambientGain || !this.ctx) return;
    this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(Math.max(0.0001, targetVol), this.ctx.currentTime + duration);
  }

  // --- 2. Tactile Heartbeat Synthesizer (Realistic Deep Thump) ---
  playSingleHeartbeat() {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // First beat ("lub") - deeper
    this.triggerBassThud(t, 58, 42, 0.18, 0.9);

    // Second beat ("dub") - slightly higher and softer, 120ms later
    this.triggerBassThud(t + 0.13, 64, 46, 0.16, 0.7);

    if (typeof this.onHeartbeatBeat === 'function') {
      this.onHeartbeatBeat();
    }
  }

  triggerBassThud(startTime, startFreq, endFreq, duration, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.85, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  startHeartbeatLoop(bpm = 68) {
    this.stopHeartbeatLoop();
    this.playSingleHeartbeat();
    const intervalMs = (60 / bpm) * 1000;
    this.heartbeatInterval = setInterval(() => {
      this.playSingleHeartbeat();
    }, intervalMs);
  }

  stopHeartbeatLoop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // --- 3. Cosmic Chime / Button Sparkle ---
  playChime(note = 0) {
    this.init();
    if (!this.ctx) return;

    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
    const freq = pentatonic[note % pentatonic.length];
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  // --- 4. Delicate "Afreen Afreen" Melodic Motif ---
  // Beautiful acoustic music-box rendition of the iconic opening chorus
  playAfreenMelody(onEndCallback) {
    this.init();
    if (!this.ctx) return;
    this.stopAfreenMelody();
    this.isMelodyPlaying = true;

    // Iconic melody notes of "Afreen Afreen" chorus:
    // "Aa..freen... aafreen..."
    // Note frequencies in Hz (Acoustic Kalimba / Celeste tone)
    const melody = [
      { f: 587.33, d: 0.65 }, // D5 (Aaa...)
      { f: 659.25, d: 0.50 }, // E5 (...freen...)
      { f: 739.99, d: 1.10 }, // F#5 (...aafreen...)
      { f: 659.25, d: 0.40 }, // E5
      { f: 587.33, d: 0.70 }, // D5
      
      { f: 493.88, d: 0.50 }, // B4
      { f: 587.33, d: 0.50 }, // D5
      { f: 659.25, d: 0.90 }, // E5
      { f: 587.33, d: 0.45 }, // D5
      { f: 493.88, d: 0.75 }, // B4
      
      { f: 440.00, d: 0.50 }, // A4
      { f: 493.88, d: 0.50 }, // B4
      { f: 587.33, d: 0.85 }, // D5
      { f: 493.88, d: 0.45 }, // B4
      { f: 440.00, d: 0.90 }, // A4
      
      { f: 392.00, d: 0.60 }, // G4
      { f: 440.00, d: 0.60 }, // A4
      { f: 587.33, d: 1.60 }, // D5 (held soft resolution)
    ];

    let accumulatedTime = 0.1;
    const now = this.ctx.currentTime;

    melody.forEach((item, index) => {
      const noteTime = now + accumulatedTime;
      this.scheduleKalimbaNote(item.f, noteTime, item.d);
      accumulatedTime += item.d;
    });

    const totalDurationMs = accumulatedTime * 1000;
    const tid = setTimeout(() => {
      this.isMelodyPlaying = false;
      if (typeof onEndCallback === 'function') onEndCallback();
    }, totalDurationMs);

    this.melodyTimeouts.push(tid);
  }

  scheduleKalimbaNote(freq, startTime, duration) {
    if (!this.ctx) return;
    
    // Primary harmonic
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm bell overtones
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.003, startTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + duration);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.24, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.6);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration * 1.7);
    osc2.stop(startTime + duration * 1.7);
  }

  stopAfreenMelody() {
    this.melodyTimeouts.forEach(t => clearTimeout(t));
    this.melodyTimeouts = [];
    this.isMelodyPlaying = false;
  }
}

window.SoundEngine = SoundEngine;
