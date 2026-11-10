/* ===== AUDIO · todo sintetizado con WebAudio (sin archivos) ===== */
const AU = {
  ctx: null, out: null, sg: null, mg: null, nb: null, sfxOn: 1, musOn: 1, playing: false, nextT: 0, stepN: 0, tempo: 116, zone: 0, combo: 0, comboT: 0, timer: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { this.ctx = new AC(); } catch (e) { return; }
    const c = this.ctx; this.out = c.createGain(); this.out.gain.value = 0.8; this.out.connect(c.destination);
    this.sg = c.createGain(); this.sg.gain.value = this.sfxOn ? 0.7 : 0; this.sg.connect(this.out);
    this.mg = c.createGain(); this.mg.gain.value = this.musOn ? 0.3 : 0; this.mg.connect(this.out);
    const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.nb = b;
    if (this.want) this.music(true);
  },
  set(sfx, mus) { this.sfxOn = sfx; this.musOn = mus; if (!this.ctx) return; const t = this.ctx.currentTime; this.sg.gain.setTargetAtTime(sfx ? 0.7 : 0, t, 0.03); this.mg.gain.setTargetAtTime(mus ? 0.3 : 0, t, 0.05); },
  tone(f, t, dur, type = 'square', vol = 0.15, f2 = 0, dest = null) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type;
    o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.sg); o.start(t); o.stop(t + dur + 0.02);
  },
  noise(t, dur, vol, fc, type = 'bandpass', dest = null, q = 1) {
    const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.nb; f.type = type; f.frequency.value = fc; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || this.sg); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  },
  sfx(k) {
    const c = this.ctx; if (!c || !this.sfxOn || c.state !== 'running') return; const t = c.currentTime + 0.005;
    switch (k) {
      case 'coin': { if (t - this.comboT > 0.6) this.combo = 0; this.combo = Math.min(12, this.combo + 1); this.comboT = t; const f = 988 * Math.pow(1.0595, this.combo); this.tone(f, t, 0.07, 'triangle', 0.13); this.tone(f * 1.5, t + 0.05, 0.12, 'triangle', 0.11); break; }
      case 'jump': this.tone(220, t, 0.13, 'square', 0.07, 540); this.noise(t, 0.12, 0.05, 2500); break;
      case 'jump2': this.tone(330, t, 0.13, 'square', 0.07, 800); break;
      case 'land': this.tone(130, t, 0.09, 'sine', 0.16, 60); break;
      case 'duck': this.noise(t, 0.16, 0.08, 900, 'bandpass', null, 2); break;
      case 'lane': this.noise(t, 0.07, 0.035, 5000, 'highpass'); break;
      case 'stumble': this.tone(240, t, 0.1, 'square', 0.1, 150); this.tone(200, t + 0.1, 0.14, 'square', 0.09, 110); break;
      case 'crash': this.noise(t, 0.6, 0.38, 700, 'lowpass'); this.tone(170, t, 0.5, 'sawtooth', 0.14, 38); break;
      case 'smash': this.noise(t, 0.25, 0.22, 1600); this.tone(620, t, 0.18, 'square', 0.06, 180); break;
      case 'power': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, t + i * 0.06, 0.1, 'square', 0.07)); break;
      case 'pEnd': this.tone(784, t, 0.1, 'square', 0.06); this.tone(523, t + 0.09, 0.14, 'square', 0.06); break;
      case 'gift': [1319, 1568, 2093, 2637].forEach((f, i) => this.tone(f, t + i * 0.05, 0.16, 'triangle', 0.08)); break;
      case 'clue': [880, 1320, 1760].forEach((f, i) => this.tone(f, t + i * 0.02, 1.1, 'sine', 0.09)); break;
      case 'trick': this.tone(660, t, 0.08, 'square', 0.06, 990); this.tone(990, t + 0.07, 0.1, 'square', 0.05); break;
      case 'zone': [0, 4, 7, 12].forEach((s, i) => this.tone(392 * Math.pow(1.0595, s), t + i * 0.03, 0.5, 'triangle', 0.07)); break;
      case 'click': this.tone(1200, t, 0.03, 'square', 0.05); break;
      case 'revive': this.tone(300, t, 0.4, 'triangle', 0.12, 1200); break;
      case 'shield': this.noise(t, 0.3, 0.2, 3000); this.tone(1500, t, 0.3, 'sine', 0.1, 700); break;
      case 'pump': this.tone(260 + 520 * (this.pumpLv || 0), t, 0.05, 'square', 0.045, 380 + 620 * (this.pumpLv || 0)); break;
      case 'tut': this.tone(880, t, 0.12, 'sine', 0.1); break;
      case 'rank': [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, t + i * 0.09, 0.22, 'square', 0.07)); break;
      case 'buy': this.tone(784, t, 0.08, 'square', 0.07); this.tone(1175, t + 0.07, 0.16, 'square', 0.07); break;
    }
  },
  music(on) {
    this.want = on; if (!this.ctx) return;
    if (on && !this.playing) { this.playing = true; this.nextT = this.ctx.currentTime + 0.1; this.stepN = 0; this.timer = setInterval(() => this.sched(), 30); }
    else if (!on && this.playing) { this.playing = false; clearInterval(this.timer); this.timer = null; }
  },
  sched() {
    const c = this.ctx; if (!c || c.state !== 'running') return;
    const BASE = [0, 5, -2, 3, -5, 7, -3], PROG = [[0, 8, 3, 10], [0, 5, 8, 7], [0, 3, 10, 8], [0, 10, 8, 7]], z = this.zone % 7, prog = PROG[z % 4];
    while (this.nextT < c.currentTime + 0.15) {
      const s = this.stepN % 16, bar = Math.floor(this.stepN / 16) % 4, t = this.nextT, root = 110 * Math.pow(1.0595, BASE[z] + prog[bar]), mg = this.mg;
      if (s % 4 === 0) this.tone(150, t, 0.14, 'sine', 0.5, 42, mg);
      if (s === 4 || s === 12) { this.noise(t, 0.14, 0.18, 1800, 'bandpass', mg); this.tone(190, t, 0.08, 'triangle', 0.1, 0, mg); }
      if (s % 2 === 1) this.noise(t, 0.035, 0.06, 7500, 'highpass', mg);
      if ([0, 3, 6, 8, 11, 14].includes(s)) this.tone(root * (s === 8 ? 1 : 0.5), t, 0.16, 'sawtooth', 0.09, 0, mg);
      if (s % 2 === 0) { const iv = [0, 7, 12, 15, 19, 12, 7, 3][(s / 2 + bar * 3) % 8]; this.tone(root * 2 * Math.pow(1.0595, iv), t, 0.11, 'triangle', 0.045, 0, mg); }
      this.nextT += 60 / this.tempo / 4; this.stepN++;
    }
  }
};
