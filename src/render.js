/* ===== ESCENA · cámara, ediciones, jugador animado, partículas ===== */
const v3 = () => [0, 0, 0];
const RN = {
  env: { top: v3(), hor: v3(), sunC: v3(), sun: v3(), stars: 0, amb: 1, sunI: 0.4, emit: 0.2, fogR: [60, 180], L: [-0.42, 0.78, 0.46], bend: [0, -0.00032], hill: [0, 0, 0, 0], h0: 0, hy: 0.5, road: [v3(), v3(), v3(), v3(), v3()], scen: [v3(), v3(), v3(), v3(), v3()] },
  cam: { ex: 0, ey: 3, ez: 6, cx: 0, cy: 1, cz: -10, fov: 1 }, camY: 0, shake: 0, cr: 0,
  M: new Float32Array(16), A: new Float32Array(16), B: new Float32Array(16), C: new Float32Array(16), D: new Float32Array(16), E: new Float32Array(16),
  parts: [], mo: {}, branches: {}, pl: null, plKey: '', trailT: 0, quality: 1,
  init() {
    const mk = b => R.mesh(b), mo = this.mo;
    for (const k of ['road', 'tree', 'pine', 'bush', 'lamp', 'bench', 'hill', 'billFrame', 'gateFrame', 'rock', 'cone', 'barrier', 'pothole', 'puddle', 'kiosk', 'coin', 'gift', 'clue', 'magnet', 'shield', 'turbo', 'x2', 'cube', 'shadow', 'ink', 'flowers', 'wing', 'bfly', 'bird', 'bwing', 'rabbit', 'palm', 'parasol', 'sea', 'mount', 'fence', 'coffee', 'rail', 'boat', 'buzon', 'flag', 'door', 'rarm', 'mag', 'tunnel', 'portal']) mo[k] = mk(MOD[k]());
    mo.runB = [0, 1, 2, 3].map(c => mk(MOD.npcRun(c, 0))); mo.skB = [0, 1, 2, 3].map(c => mk(MOD.npcRun(c, 1))); mo.runL = mk(MOD.npcLeg(0)); mo.skL = mk(MOD.npcLeg(1));
    mo.kite = [0, 1, 2].map(v => mk(MOD.kite(v))); mo.balloon = [0, 1].map(v => mk(MOD.balloon(v)));
    for (const k of ['tlight', 'wallseg', 'railseg', 'posterWall', 'bundle', 'envelope', 'paper', 'xroad', 'parkArch', 'quarter', 'policia', 'ducks', 'medseg', 'forkSign', 'chev', 'fountain', 'playground', 'pond', 'hedgeseg', 'bedseg', 'manhole', 'crack', 'bump', 'trash', 'pbike', 'container', 'sand', 'scaff']) mo[k] = mk(MOD[k]());
    mo.signpost = [null, mk(MOD.signpost(1)), mk(MOD.signpost(2))];
    this.NEWO = new Set(['manhole', 'crack', 'bump', 'trash', 'pbike', 'container', 'sand', 'scaff']);
    mo.picnic = [0, 1, 2].map(v => mk(MOD.picnic(v))); mo.sitter = [0, 1, 2, 3].map(v => mk(MOD.sitter(v)));
    mo.shop = [0, 1, 2].map(v => mk(MOD.shop(v))); mo.stall = [0, 1, 2].map(v => mk(MOD.stall(v))); mo.person = [0, 1, 2, 3].map(v => mk(MOD.person(v))); mo.poster = [0, 1, 2, 3].map(v => mk(MOD.poster(v)));
    mo.carNpc = [0, 1, 2, 3].map(v => mk(MOD.carNpc(v))); mo.motoNpc = [0, 1, 2, 3].map(v => mk(MOD.motoNpc(v)));
    mo.dogA = mk(MOD.pet('m1', '#c9935e')); mo.dogT = mk(MOD.petTail('m1', '#c9935e')); mo.catA = mk(MOD.pet('m2', '#3a3a46')); mo.catT = mk(MOD.petTail('m2', '#3a3a46')); this.cars = [];
    mo.house = [0, 1, 2].map(v => mk(MOD.house(v))); mo.resi = [0, 1, 2].map(v => mk(MOD.resi(v))); this.proj = [];
    mo.bld = []; for (let v = 0; v < 3; v++) mo.bld.push([mk(MOD.bld(v, 2)), mk(MOD.bld(v, 3))]);
    mo.bill = []; mo.gate = []; for (let i = 0; i < 10; i++) { mo.bill.push(mk(MOD.billPanel(i))); mo.gate.push(mk(MOD.gatePanel(i))); }
    for (let i = 0; i < 4; i++) mo.bill.push(mk(MOD.billPanelUV(ATR.event[i])));
    mo.truck = [0, 1, 2].map(c => mk(MOD.truck(c))); mo.npc = [0, 1, 2, 3].map(c => mk(MOD.npc(c)));
    mo.ramp = mk(MOD.ramp(2.4, 6, '#ffc23a')); mo.jramp = mk(MOD.ramp(1.1, 4, '#ff5a2a'));
    mo.halo = { magnet: mk(MOD.halo('#ff5a2a')), turbo: mk(MOD.halo('#ffc23a')), x2: mk(MOD.halo('#ff2fb3')), shield: mk(MOD.halo('#39c8ff')), gift: mk(MOD.halo('#ff2fb3')), clue: mk(MOD.halo('#2dffb3')), glide: mk(MOD.halo('#2dffb3')), letter: mk(MOD.halo('#ffc23a')) };
    for (const k of ['gatepost', 'gatebar', 'bollard', 'umbrella']) mo[k] = mk(MOD[k]()); mo.glide = mo.umbrella; mo.letter = {}; for (const ch of 'EMSAY') mo.letter[ch] = mk(MOD.letter(ch));
  },
  branch(v) { const k = v.side + ':' + v.lanes.join(''); return this.branches[k] || (this.branches[k] = R.mesh(MOD.branch(v.side, v.lanes))); },
  setPlayer(cos, vid) {
    const key = JSON.stringify(cos) + vid; if (key === this.plKey) return; this.plKey = key;
    if (this.pl) for (const k in this.pl) if (this.pl[k]) R.free(this.pl[k]);
    const r = MOD.rider(cos);
    const v2 = ['uni', 'ebike', 'moped', 'moto', 'auto', 'camion'].includes(vid), nov = vid === 'foot' || vid === 'jetpack';
    this.pl = { veh: nov ? null : R.mesh(v2 ? MOD.veh2(vid, cos.paint, cos.pe) : MOD.veh(vid, cos.paint, cos.pe)), jet: vid === 'jetpack' ? R.mesh(MOD.veh2('jetpack', cos.paint, cos.pe)) : null, t: R.mesh(r.t), th: R.mesh(r.th), sn: R.mesh(r.sn), ar: R.mesh(r.ar) };
    const pc = COSI[cos.pet]; if (pc && pc.c) { this.pl.pet = R.mesh(MOD.pet(cos.pet, pc.c)); this.pl.ptail = R.mesh(MOD.petTail(cos.pet, pc.c)); } this.petK = pc && pc.c ? cos.pet : null;
    this.vid = vid;
  },
  zoneEnv(g, s) {
    const Zi = zinfo(g, s), u = Math.max(0, s) - Zi.s0, a = ZONES[Zi.pz], b = ZONES[Zi.z];
    let t = Zi.s0 > 0 && u < 70 ? u / 70 : 1; t = t * t * (3 - 2 * t);
    const E = this.env;
    lerp3(E.top, a.top, b.top, t); lerp3(E.hor, a.hor, b.hor, t); lerp3(E.sunC, a.sunC, b.sunC, t);
    for (let i = 0; i < 3; i++) E.sun[i] = lerp(a.sun[i], b.sun[i], t);
    E.stars = lerp(a.stars, b.stars, t); E.amb = lerp(a.amb, b.amb, t); E.sunI = lerp(a.sunI, b.sunI, t); E.emit = lerp(a.emit, b.emit, t);
    E.fogR[0] = lerp(a.fog[0], b.fog[0], t) * this.quality; E.fogR[1] = lerp(a.fog[1], b.fog[1], t) * (0.7 + 0.3 * this.quality);
    for (let k = 0; k < 5; k++) { lerp3(E.road[k], a.road[k], b.road[k], t); lerp3(E.scen[k], a.scen[k], b.scen[k], t); }
    return t < 0.5 ? a : b;
  },
  camera(g, mode, time, dt) {
    const P = g.p, c = this.cam, asp = R.w / R.h, k = clamp((1.05 - asp) / 0.55, 0, 1);
    if (mode === 'garage') { const a = time * 0.45 + 0.6, rr = (g.veh.id === 'auto' || g.veh.id === 'camion' ? 7.5 : 4.9) + k * 0.6; c.ex = P.x + Math.sin(a) * rr; c.ez = Math.cos(a) * rr; c.ey = 1.7 + (rr > 7 ? 1.2 : 0); c.cx = P.x; c.cy = -0.85 - k * 0.2; c.cz = 0; c.fov = 0.9 + k * 0.2; }
    else if (mode === 'menu') { c.ex = P.x * 0.6 + 1.6; c.ey = 1.85 + P.y * 0.5; c.ez = 4.4 + k * 1.6; c.cx = P.x * 0.6; c.cy = 1.0 + P.y * 0.4; c.cz = -8; c.fov = 1.0 + k * 0.15; }
    else {
      this.camY = lerp(this.camY, P.y, Math.min(1, dt * 6));
      const hf = clamp((this.camY - 2.4) / 2, 0, 1);
      c.ex = P.x * 0.72; c.ey = lerp(3.15, 3.75, k) + this.camY * lerp(0.62, 0.92, hf); c.ez = lerp(5.9, 7.3, k);
      c.cx = P.x * 0.86; c.cy = 1.1 + this.camY * lerp(0.5, 0.86, hf); c.cz = -10;
      c.fov = (lerp(58, 66, k) + clamp(P.v - 14, 0, 30) * 0.28 + (P.turbo > 0 ? 6 : 0)) * Math.PI / 180;
    }
    if (mode !== 'garage') { this.slS = lerp(this.slS || 0, this.sl || 0, Math.min(1, dt * 4)); c.cy += this.slS * 10; }
    if (this.turnA) { const a = this.turnA, cs = Math.cos(a), sn = Math.sin(a), px = P.x; for (const [kx, kz] of [['ex', 'ez'], ['cx', 'cz']]) { const dx = c[kx] - px, dz = c[kz]; c[kx] = px + dx * cs + dz * sn; c[kz] = -dx * sn + dz * cs; } this.turnA *= Math.exp(-dt * 4.2); if (Math.abs(this.turnA) < 0.004 || mode !== 'play') this.turnA = 0; }
    c.ey -= (this.land || 0) * 0.22;
    if (this.shake > 0) { c.ex += (Math.random() - 0.5) * this.shake; c.ey += (Math.random() - 0.5) * this.shake; this.shake = Math.max(0, this.shake - dt * 2.5); }
    // horizonte en pantalla (para el degradado del cielo)
    const E = this.env; M4.persp(R.P, c.fov, asp, 0.1, 400); M4.look(R.V, c.ex, c.ey, c.ez, c.cx, c.cy, c.cz);
    const V = R.V, P2 = R.P, wx = c.ex, wy = 0, wz = -190;
    const vx = V[0] * wx + V[4] * wy + V[8] * wz + V[12], vz = V[2] * wx + V[6] * wy + V[10] * wz + V[14];
    let vy = V[1] * wx + V[5] * wy + V[9] * wz + V[13]; vy += E.bend[1] * vz * vz;
    const cy = P2[5] * vy, cw = -vz; E.hy = clamp(0.5 + 0.5 * cy / cw, 0.05, 0.95); void vx;
  },
  emit(n, x, y, s, col, spd, sz, life, up = 3, gr = 1) {
    if (this.quality < 0.7) n = Math.ceil(n / 2);
    for (let i = 0; i < n && this.parts.length < 140; i++) this.parts.push({ x, y, s, vx: (Math.random() - 0.5) * spd, vy: up * (0.4 + Math.random()), vs: (Math.random() - 0.5) * spd, life, max: life, col, sz: sz * (0.6 + Math.random() * 0.6), gr, sx: 1, sz2: 1 });
  },
  events(g, e) {
    const P = g.p;
    if (e.k === 'coin') this.emit(3, e.a.x, e.a.y, e.a.s, hex('#ffc23a'), 3, 0.09, 0.35);
    else if (e.k === 'smash') { const o = e.a; this.emit(10, o.x, 0.8, o.s, o.t === 'cone' ? hex('#ff5a2a') : hex('#e8e4c4'), 7, 0.16, 0.8, 5); }
    else if (e.k === 'stumble') { this.emit(8, P.x, 0.2, P.s, hex('#b9a88a'), 4, 0.12, 0.5, 2); this.shake = 0.35; }
    else if (e.k === 'crash') { this.emit(16, P.x, 0.8, P.s, hex('#e8e4c4'), 8, 0.15, 1, 5); this.shake = 0.9; }
    else if (e.k === 'clue') this.emit(14, P.x, 1.2, P.s + 1, hex('#2dffb3'), 5, 0.1, 0.9, 4, 0.2);
    else if (e.k === 'power' || e.k === 'gift') this.emit(10, P.x, 1.4, P.s + 0.5, hex(e.k === 'gift' ? '#ff2fb3' : '#39c8ff'), 3, 0.06, 0.45, 3.5, 0.4);
    else if (e.k === 'land') { this.land = Math.min(1, 0.35 + e.a); if (e.a > 0.35) this.emit(6, P.x, 0.1, P.s, hex('#cfc4a8'), 3, 0.1, 0.4, 1.5); }
    else if (e.k === 'sand' && Math.random() < 0.5) this.emit(3, P.x, 0.1, P.s, hex('#e8cf8f'), 2.5, 0.08, 0.4, 1.5);
    else if (e.k === 'bump') this.land = 0.5;
    else if (e.k === 'turn') { this.turnA = e.a.dir * Math.PI / 2 * 0.85; this.shake = Math.max(this.shake || 0, 0.15); }
    else if (e.k === 'deliver') { const d = e.a; this.proj.push({ x0: P.x + d.side * 0.3, y0: P.y + 1.4, s0: P.s, x1: d.side * (d.obj === 'kiosko' ? 3.8 : 4.35), y1: d.obj === 'muro' ? 1.5 : 1.3, s1: d.s, t: 0, T: d.T, m: d.k === 'per' ? 'paper' : d.k === 'cor' ? 'envelope' : d.k === 'kio' ? 'bundle' : 'mag' }); this.throwT = 0.32; this.throwSide = d.side; }
    else if (e.k === 'grind' || e.k === 'grindOn') this.emit(6, P.x, P.y + 0.05, P.s, hex('#ffc23a'), 4, 0.06, 0.35, 2.5);
    else if (e.k === 'vault') this.emit(5, P.x, 0.4, P.s, hex('#cfc4a8'), 3, 0.09, 0.4, 2);
    else if (e.k === 'near') this.emit(4, (P.x + e.a.x) / 2, 1, P.s, hex('#ffffff'), 2, 0.05, 0.3, 1, 0);
    else if (e.k === 'critHit') { this.emit(10, e.a.x, 0.4, e.a.s, hex('#f4f1e6'), 5, 0.08, 0.7, 4); }
    else if (e.k === 'shield') { this.emit(14, P.x, 1, P.s, hex('#39c8ff'), 6, 0.12, 0.8, 4); this.shake = 0.5; }
  },
  trail(g, dt, id) {
    const P = g.p; if (!P.alive || id === 't0') return;
    this.trailT -= dt; if (this.trailT > 0) return;
    if (id === 't1') { this.trailT = 0.05; if (!P.air) this.emit(1, P.x + (Math.random() - 0.5) * 0.3, 0.08, P.s - 0.4, hex('#cbbf9f'), 1, 0.1, 0.5, 0.8); }
    else if (id === 't2') { this.trailT = 0.04; this.emit(1, P.x, 0.4 + P.y, P.s - 0.5, hex(['#0e6378', '#c0191c', '#c49a2c', '#e8e4c4', '#ff5a2a'][Math.floor(Math.random() * 5)]), 2.5, 0.09, 0.7, 2); }
    else if (id === 't3') { this.trailT = 0.016; this.parts.push({ x: P.x, y: P.y + 0.15, s: P.s - 0.3, vx: 0, vy: 0, vs: 0, life: 0.45, max: 0.45, col: hex(Math.floor(g.t * 4) % 2 ? '#39c8ff' : '#a42cff'), sz: 0.07, gr: 0, sx: 1, sz2: 6 }); }
    else if (id === 't4') { this.trailT = 0.05; this.emit(1, P.x + (Math.random() - 0.5) * 0.6, 0.6 + P.y + Math.random(), P.s - 0.4, hex('#ffc23a'), 1, 0.07, 0.8, 0.6, -0.2); }
  },
  drawPlayer(g, time, dt) {
    const P = g.p, id = g.veh.id, pl = this.pl; if (!pl) return;
    const M = this.M, A = this.A, B = this.B, C = this.C, D = this.D, Ee = this.E, TAU = Math.PI * 2;
    this.cr = lerp(this.cr, P.crouch > 0 ? 1 : P.grind ? 0.45 : 0, Math.min(1, dt * 18)); const cr = this.cr;
    this.brk = lerp(this.brk || 0, P.brake ? 1 : 0, Math.min(1, dt * 10)); const brk = this.brk;
    const big = id === 'auto' || id === 'camion', tx = LX(P.lane), roll = clamp((tx - P.x) * 0.16, -0.32, 0.32) * (big ? 0.3 : 1), pitch = P.air ? clamp(-P.vy * 0.012, -0.25, 0.25) : 0;
    let spin = 0, vspin = 0, vflip = 0, flip = 0;
    if (P.air && !P.trickHit && P.airT > 0.15 && P.alive && !big && P.glide <= 0 && !P.trN) { const k = clamp((P.airT - 0.15) / 0.38, 0, 1), e = k * k * (3 - 2 * k) * TAU; if (id === 'skate') vflip = e; else if (id === 'scooter' || id === 'long') vspin = e; else if (id !== 'foot' && id !== 'jetpack') spin = e; }
    if (P.trN > 0 && P.air && !big) { const k = clamp(P.trT / 0.3, 0, 1), e = k * k * (3 - 2 * k) * TAU; if (P.trN === 1) flip = -e; else spin = e; }
    let dead = 0, slide = 0; if (!P.alive) { dead = Math.min(1.5, P.deadT * 4); slide = Math.min(3.5, P.deadT * 6); }
    if (P.inv > 0 && P.alive && Math.floor(time * 14) % 2) return;
    const rx = pitch - dead * 0.2 + Math.atan(this.sl || 0) + (big ? -brk * 0.03 : 0);
    if (flip) { M4.trs(B, P.x, P.y + 0.95, 0, spin + (this.turnA || 0), rx + flip, roll); M4.trs(A, 0, -0.95, 0); M4.mul(B, B, A); } else M4.trs(B, P.x, P.y, 0, spin + (this.turnA || 0), rx, roll);
    const sq = this.land || 0; if (sq > 0.01) { this.land = Math.max(0, sq - dt * 4.5); M4.trs(A, 0, 0, 0, 0, 0, 0, 1 + 0.1 * sq, 1 - 0.16 * sq, 1 + 0.1 * sq); M4.mul(B, B, A); }
    // vehículo
    const sk = id === 'quad' || id === 'inline';
    if (!sk && pl.veh) { M4.trs(A, 0, 0, -slide, vspin, 0, vflip + dead * 0.6); M4.mul(M, B, A); R.draw(pl.veh, M); }
    if (big) return;
    // pose
    let hy, hz = 0, yaw = 0, lean, feet, arms, splay = 0.04;
    const ph = P.phase, grounded = !P.air && P.alive;
    if (id === 'foot' || id === 'jetpack') {
      hy = 0.9 - 0.3 * cr; lean = 0.22 + 0.45 * cr; const run = clamp(P.v / 9, 0.12, 1), f = ph * 0.9;
      if (!grounded) { feet = [[0.44, -0.2], [0.3, 0.22]]; arms = id === 'jetpack' ? [[0.35, 0.25], [0.35, -0.25]] : [[-0.5, 0.5], [-0.5, -0.5]]; }
      else { feet = [0, 1].map(i => { const a = f + i * Math.PI; return [0.08 + Math.max(0, -Math.cos(a)) * 0.3 * run, 0.36 * Math.sin(a) * run]; }); arms = [[0.85 * Math.sin(f) * run, 0.08], [-0.85 * Math.sin(f) * run, -0.08]]; }
    }
    else if (id === 'scooter') { hy = 0.98 - 0.34 * cr; hz = 0.02; lean = 0.18 + 0.5 * cr; const f = time * 7.5, lift = Math.max(0, Math.cos(f)) * 0.16; feet = [[0.19, -0.06], grounded && cr < 0.5 && !P.brake ? [0.07 + lift, 0.2 + 0.25 * Math.sin(f)] : [0.19, 0.2]]; arms = [[0.72 + 0.3 * cr, 0.05], [0.72 + 0.3 * cr, -0.05]]; }
    else if (id === 'escooter') { hy = 1.02 - 0.34 * cr; hz = 0.03; lean = 0.12 + 0.5 * cr; feet = [[0.255, -0.17], [0.255, 0.2]]; arms = [[0.7 + 0.3 * cr, 0.05], [0.7 + 0.3 * cr, -0.05]]; }
    else if (id === 'bike' || id === 'trike' || id === 'ebike') { hy = 1.03 - 0.08 * cr; hz = 0.12; lean = 0.55 + 0.3 * cr; const f = ph * 0.7; feet = [[0.36 - 0.17 * Math.cos(f) + 0.07, -0.02 + 0.17 * Math.sin(f)], [0.36 + 0.17 * Math.cos(f) + 0.07, -0.02 - 0.17 * Math.sin(f)]]; arms = [[1.0, 0.08], [1.0, -0.08]]; }
    else if (id === 'uni') { hy = 1.12 - 0.12 * cr; lean = 0.1 + 0.5 * cr; const f = ph * 1.2; feet = [[0.4 - 0.13 * Math.cos(f), 0.13 * Math.sin(f)], [0.4 + 0.13 * Math.cos(f), -0.13 * Math.sin(f)]]; arms = [[0.2, -0.9 + 0.15 * Math.sin(time * 5)], [0.2, 0.9 + 0.15 * Math.sin(time * 5)]]; splay = 0.1; }
    else if (id === 'moped' || id === 'moto') { const mt = id === 'moto'; hy = (mt ? 0.94 : 0.88) - 0.1 * cr; hz = mt ? 0.2 : 0.28; lean = (mt ? 0.38 : 0.2) + 0.35 * cr; feet = mt ? [[0.4, -0.02], [0.4, -0.02]] : [[0.3, -0.12], [0.3, -0.12]]; arms = [[1.02, 0.1], [1.02, -0.1]]; splay = 0.16; }
    else if (id === 'euc') { hy = 1.02 - 0.34 * cr; lean = 0.1 + 0.5 * cr; feet = [[0.25, -0.02], [0.25, 0.02]]; arms = [[0.3, -0.6], [0.3, 0.6]]; splay = 0.12; }
    else if (id === 'skate' || id === 'long') { hy = 0.9 - 0.3 * cr; yaw = -1.35; lean = 0.15 + 0.4 * cr; feet = null; arms = [[0.25, 0.95], [0.25, -0.95]]; }
    else { hy = (id === 'inline' ? 1.0 : 0.97) - 0.32 * cr; lean = 0.3 + 0.45 * cr; const f = time * (id === 'inline' ? 5.2 : 6.5) * (P.brake ? 0 : 1); feet = [[0.17 + Math.max(0, -Math.cos(f)) * 0.08, 0.22 * Math.sin(f)], [0.17 + Math.max(0, Math.cos(f)) * 0.08, -0.22 * Math.sin(f)]]; arms = [[0.45 * Math.sin(f), 0.15], [-0.45 * Math.sin(f), -0.15]]; splay = 0.1; }
    lean -= brk * 0.28; if (!P.alive) lean += dead * 0.6;
    // cadera
    M4.trs(A, 0, hy, hz, yaw, 0, 0); M4.mul(C, B, A);
    for (let i = 0; i < 2; i++) {
      const sx = i ? 0.1 : -0.1; let a1, a2, rz = i ? -splay : splay;
      if (feet) { const f = feet[i], r = ik(f[0] - hy, f[1] - hz); a1 = r[0]; a2 = r[1]; }
      else { a1 = 0.3 + 0.5 * cr; a2 = -0.6 - 0.9 * cr; rz = i ? -0.26 : 0.26; }
      M4.trs(A, sx, 0, 0, 0, a1, rz); M4.mul(D, C, A); R.draw(pl.th, D);
      M4.trs(A, 0, -0.42, 0, 0, a2, 0); M4.mul(Ee, D, A); R.draw(pl.sn, Ee);
      if (sk) { M4.trs(A, 0, -0.42, 0, 0, -(a1 + a2), -rz); M4.mul(D, Ee, A); M4.trs(A, 0, -0.09, -0.02, 0, 0, 0, 1.08); M4.mul(M, D, A); R.draw(pl.veh, M); }
    }
    // torso y brazos
    M4.trs(A, 0, 0, 0, 0, -lean, 0); M4.mul(D, C, A); R.draw(pl.t, D);
    if (pl.jet) { R.draw(pl.jet, D); if (P.air && P.alive && Math.random() < 0.7) this.emit(1, P.x + (Math.random() - 0.5) * 0.2, P.y + 0.75, P.s - 0.3, hex(Math.random() < 0.5 ? '#ff8a1e' : '#ffd23a'), 1, 0.13, 0.22, -4, 0); }
    if (P.glide > 0) arms = [[2.95, 0.12], [2.95, -0.12]];
    if (this.throwT > 0) { this.throwT = Math.max(0, this.throwT - dt); const k = Math.sin((1 - this.throwT / 0.32) * Math.PI), i = this.throwSide > 0 ? 1 : 0; arms = arms.slice(); arms[i] = [2.3 * k - lean * 0.6, this.throwSide * 0.9 * k]; }
    const stand = id === 'skate' || id === 'long';
    for (let i = 0; i < 2; i++) { const ar = arms[i], sx = i ? 0.255 : -0.255; M4.trs(A, sx, 0.58, 0, 0, ar[0] + (stand ? 0 : lean * 0.6), ar[1]); M4.mul(M, D, A); R.draw(pl.ar, M); }
    if (P.glide > 0) { M4.trs(A, 0, 2.25, 0.05, time * 0.6, Math.sin(time * 2) * 0.08, Math.sin(time * 1.7) * 0.1, 1.35); M4.mul(M, B, A); R.draw(this.mo.umbrella, M); }
  },
  /* fauna silvestre: mariposas, pájaros, conejos, luciérnagas y semillas (solo decoración) */
  wild(g, mode, time, dt) {
    if (mode === 'garage') return;
    const P = g.p, M = this.M, A = this.A, B = this.B, mo = this.mo, L = this.crit || (this.crit = []);
    const zi = zinfo(g, P.s).z, night = ZONES[zi].stars > 0.5, urban = zi === 2;
    if (L.length < (this.quality < 0.7 ? 6 : 13) && Math.random() < dt * 3.2) {
      const r = Math.random(), sd = Math.random() < 0.5 ? -1 : 1, s = P.s + 35 + Math.random() * 85;
      const k = night ? (r < 0.8 ? 'fly' : 'bird') : r < (urban ? 0.3 : 0.55) ? 'bfly' : r < 0.75 ? 'bird' : 'seed';
      const BF = ['#ff8a1e', '#ffd23a', '#39a0ff', '#f4f1e6', '#ff2fb3', '#2dffb3'];
      L.push({ k, s, x: sd * (k === 'bird' ? 10 : 3 + Math.random() * 4), y: k === 'bird' ? 6 + Math.random() * 4 : k === 'rabbit' ? 0 : 0.8 + Math.random() * 1.4,
        vx: -sd * (k === 'bird' ? 4 + Math.random() * 3 : k === 'rabbit' ? 2.6 + Math.random() : 0.7 + Math.random() * 1.3), vs: k === 'bird' ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 1.2,
        vy: 0, t: 0, ph: Math.random() * 6.28, col: hex(k === 'fly' ? '#d8ff5a' : k === 'seed' ? '#ffffff' : BF[Math.floor(Math.random() * BF.length)]) });
    }
    // cielo festivo: cometas y globos aerostáticos (días sin lluvia)
    const SK = this.sky || (this.sky = []);
    if (!night && (this.rk || 0) < 0.3 && SK.length < 4 && Math.random() < dt * 0.35) { const b = Math.random() < 0.3, sd = Math.random() < 0.5 ? -1 : 1; SK.push({ b, s: P.s + 110 + Math.random() * 70, x: sd * (b ? 30 + Math.random() * 30 : 12 + Math.random() * 22), y: b ? 22 + Math.random() * 14 : 11 + Math.random() * 8, v: Math.floor(Math.random() * (b ? 2 : 3)), ph: Math.random() * 6 }); }
    for (let i = SK.length - 1; i >= 0; i--) { const k = SK[i], z = -(k.s - P.s); if (z > 30) { SK.splice(i, 1); continue; } if (z < -200) continue;
      if (k.b) { k.y += dt * 0.3; M4.trs(M, k.x, k.y, z, time * 0.1, 0, 0); R.draw(mo.balloon[k.v], M); } else { M4.trs(M, k.x + Math.sin(time * 0.8 + k.ph) * 1.2, k.y + Math.sin(time * 1.3 + k.ph), z, 0.4 * Math.sin(k.ph), 0, Math.sin(time * 1.1 + k.ph) * 0.35, 1.4); R.draw(mo.kite[k.v], M); } }
    for (let i = L.length - 1; i >= 0; i--) {
      const c = L[i]; c.t += dt; c.x += c.vx * dt; c.s += c.vs * dt; c.y += c.vy * dt;
      if (c.s < P.s - 8 || Math.abs(c.x) > 16 || c.t > 35 || c.y > 16) { L.splice(i, 1); continue; }
      const z = -(c.s - P.s); if (z < -130) continue;
      const near = z > -9 && z < 2 && Math.abs(c.x - P.x) < 2.6;
      if (c.k === 'bfly') {
        if (near) c.vy += dt * 10;
        const fl = Math.sin(time * 17 + c.ph) * 1.1, y = c.y + Math.sin(time * 2.4 + c.ph) * 0.35, yaw = Math.atan2(-c.vx, c.vs);
        M4.trs(M, c.x, y, z, yaw, 0, 0, 1.7); R.draw(mo.bfly, M);
        M4.trs(A, 0, 0, 0, 0, 0, fl); M4.mul(B, M, A); R.draw(mo.wing, B, ONE, c.col);
        M4.trs(A, 0, 0, 0, 0, 0, -fl, -1, 1, 1); M4.mul(B, M, A); R.draw(mo.wing, B, ONE, c.col);
      } else if (c.k === 'bird') {
        const fl = Math.sin(time * 9 + c.ph) * 0.7, yaw = Math.atan2(-c.vx, c.vs);
        M4.trs(M, c.x, c.y + Math.sin(time * 1.5 + c.ph) * 0.4, z, yaw, 0, 0, 1.3); R.draw(mo.bird, M);
        M4.trs(A, 0.05, 0.02, 0, 0, 0, fl); M4.mul(B, M, A); R.draw(mo.bwing, B);
        M4.trs(A, -0.05, 0.02, 0, 0, 0, -fl, -1, 1, 1); M4.mul(B, M, A); R.draw(mo.bwing, B);
      } else if (c.k === 'rabbit') {
        if (near && !c.fled) { c.fled = 1; c.vx = Math.sign(c.x - P.x || 1) * 7; }
        M4.trs(M, c.x, Math.abs(Math.sin(c.t * 7 + c.ph)) * 0.32, z, c.vx > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0, 1.25); R.draw(mo.rabbit, M);
      } else {
        const fly = c.k === 'fly', k = fly ? 0.07 * (0.55 + 0.45 * Math.sin(time * 5 + c.ph)) : 0.05;
        c.x += Math.sin(time * 1.3 + c.ph) * dt * 0.6; if (!fly) c.vy = 0.25;
        M4.trs(M, c.x, c.y + Math.sin(time * 1.7 + c.ph) * 0.3, z, time, time * 0.7, 0, k); R.draw(mo.cube, M, ONE, c.col, 1);
      }
    }
  },
  frame(g, mode, time, dt, cos) {
    const P = g.p; if (!R.gl) return;
    this.zoneEnv(g, P.s);
    const E = this.env;
    // en modo calle (moto, auto, camión) la vía es asfalto con líneas amarillas
    if (g.street && mode !== 'garage') { lerp3(E.road[0], E.road[0], [0.2, 0.21, 0.24], 0.85); lerp3(E.road[3], E.road[3], [1, 1, 1], 0.7); lerp3(E.road[4], E.road[4], [1, 0.8, 0.15], 0.85); }
    // clima (lluvia) y túneles: oscurecen el ambiente
    const Zr = zinfo(g, P.s), ed = Zr.ed, u = P.s - Zr.s0, rt = mode === 'garage' ? 0 : RAINY(ed) ? clamp(Math.min(u, Zr.s1 - P.s) / 60, 0, 1) : 0;
    this.rk = lerp(this.rk || 0, rt, Math.min(1, dt * 2)); const rk = this.rk;
    if (rk > 0.01) { const gr = [0.42, 0.45, 0.5]; lerp3(E.top, E.top, gr, 0.55 * rk); lerp3(E.hor, E.hor, [0.55, 0.58, 0.62], 0.45 * rk); E.amb *= 1 - 0.2 * rk; E.sunI *= 1 - 0.5 * rk; E.fogR[1] *= 1 - 0.25 * rk; E.fogR[0] *= 1 - 0.4 * rk; E.sun[2] *= 1 - rk; E.emit = Math.max(E.emit, 0.45 * rk); }
    const inT = mode !== 'garage' && g.tuns && g.tuns.some(t => P.s > t[0] - 3 && P.s < t[1] + 2); this.tk = lerp(this.tk || 0, inT ? 1 : 0, Math.min(1, dt * 3)); const tk = this.tk;
    if (tk > 0.01) { E.amb *= 1 - 0.5 * tk; E.sunI *= 1 - 0.85 * tk; E.emit = Math.max(E.emit, 0.9 * tk); lerp3(E.hor, E.hor, [0.08, 0.08, 0.1], 0.5 * tk); E.fogR[1] *= 1 - 0.3 * tk; }
    E.bend[0] = mode === 'garage' ? 0 : 0.0017 * Math.sin(P.s / 520) * Math.sin(P.s / 190 + 0.7) * (1 - Math.min(1, Math.abs(this.turnA || 0)));
    E.bend[1] = mode === 'garage' ? 0 : -0.00032;
    const hOn = mode === 'garage' ? 0 : 1, TAU = Math.PI * 2; E.hill[0] = (P.s * 0.0105) % TAU; E.hill[1] = (P.s * 0.027 + 1.7) % TAU; E.hill[2] = P.s; E.hill[3] = hOn; E.h0 = HILL(P.s); this.sl = hOn ? HILLD(P.s) : 0;
    this.camera(g, mode, time, dt);
    if (!R.begin(this.cam, E, time)) return;
    const mo = this.mo, M = this.M, zs = s => -(s - P.s), FAR = -E.fogR[1] - 12;
    // carretera (1 sola llamada, paleta de la edición)
    R.pal(true, E.road); M4.trs(M, 0, 0, P.s % 40); R.draw(mo.road, M);
    // escenario
    R.pal(true, E.scen); const panels = [];
    const peds = this.peds || (this.peds = []); peds.length = 0;
    for (const sc of g.scen) {
      if (sc.k === 'ped') { const zz = zs(sc.s + sc.mv * (g.t - sc.t0)); if (zz > FAR && zz < 12) peds.push(sc, zz); continue; }
      const z = zs(sc.s); if (z < FAR || z > 14) continue;
      if (sc.nr && (g.xs.some(X => Math.abs(X.s - sc.s) < 9) || g.corners.some(C => Math.abs(C.s - sc.s) < 9) || g.parks.some(p => sc.s > p[0] - 6 && sc.s < p[1] + 6) || g.shops.some(q => q.side === sc.side && Math.abs(q.s - sc.s) < 5) || g.dels.some(d => d.side === sc.side && Math.abs(d.s - sc.s) < 3.5))) continue;
      let m = null, kx = sc.sc, ky = sc.sc, ry = sc.ry, sh = [sc.sh, sc.sh, sc.sh];
      switch (sc.k) {
        case 'bld': m = mo.bld[sc.v][sc.pi - 2]; ky = sc.h; break;
        case 'bill': m = mo.billFrame; panels.push([mo.bill[sc.v % 14], sc.x, z, ry]); break;
        case 'gate': m = mo.gateFrame; panels.push([mo.gate[ZONES[sc.z].bill], 0, z, 0]); break;
        case 'lamp': m = mo.lamp; ry = sc.side > 0 ? 0 : Math.PI; break;
        case 'bench': m = mo.bench; ry = sc.side > 0 ? 0 : Math.PI; break;
        default: m = mo[sc.k];
      }
      if (!m) continue;
      M4.trs(M, sc.x, 0, z, ry, 0, 0, kx, ky, kx); R.draw(m, M, sh);
    }
    // parques: arboleda, bancas, faroles y flores (con la paleta de la edición)
    const PH = (a, b) => { const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return x - Math.floor(x); };
    for (const p of g.parks) { if (zs(p[1]) > 20 || zs(p[0]) < FAR - 200) continue;
      for (let q = p[0] - 2; q < p[1] + 4; q += 7) { const z = zs(q); if (z < FAR || z > 16) continue;
        for (const sd of [-1, 1]) { const h = PH(q, sd); const k = h < 0.42 ? 'tree' : h < 0.55 ? 'pine' : h < 0.7 ? 'bush' : h < 0.82 ? 'flowers' : 'lamp'; const far = sd * (11.5 + PH(q + 3, sd) * 9);
          M4.trs(M, sd * (h > 0.82 ? 5.6 : 6.4 + h * 1.5), 0, z, k === 'lamp' ? (sd > 0 ? 0 : Math.PI) : h * 6.28, 0, 0, 0.9 + h * 0.4); R.draw(mo[k], M, ONE);
          if (PH(q, sd + 5) < 0.6) { M4.trs(M, far, 0, zs(q + 3), h * 6.28, 0, 0, 1 + PH(q, 9) * 0.6); R.draw(PH(q, sd + 7) < 0.7 ? mo.tree : mo.pine, M, ONE); }
          if (PH(q, sd + 2) < 0.3) { M4.trs(M, sd * 5.0, 0, zs(q + 2), sd > 0 ? 0 : Math.PI, 0, 0, 1); R.draw(mo.bench, M, ONE); } } } }
    R.pal(false);
    for (const p of panels) { M4.trs(M, p[1], 0, p[2], p[3]); R.draw(p[0], M); }
    for (let i = 0; i < peds.length; i += 2) { const sc = peds[i], ph = time * 5.5 + sc.s; M4.trs(M, sc.x, 0.16, peds[i + 1], sc.mv > 0 ? 0 : Math.PI, 0, 0, 0.95); R.draw(mo.runB[sc.v], M); for (const sx of [-1, 1]) { M4.trs(this.A, sx * 0.1, 0.95, 0, 0, 0.42 * Math.sin(ph) * sx, 0); M4.mul(this.B, M, this.A); R.draw(mo.runL, this.B); } }
    // locales con camiones descargando, cruces con semáforo y zonas libres
    for (const q of g.shops) { const z = zs(q.s); if (z < FAR || z > 20) continue; M4.trs(M, q.side * 5.35, 0, z, q.side > 0 ? 0 : Math.PI); R.draw(mo.shop[q.v], M); }
    const LC = this.LC || (this.LC = [hex('#ff2a2a'), hex('#ffc23a'), hex('#2dff6a'), hex('#1a1a1e')]);
    for (const X of g.xs) {
      const z = zs(X.s); if (z < FAR - 10 || z > 30) continue;
      M4.trs(M, 0, 0, z); R.draw(mo.xroad, M);
      const st = lightAt(X, g.t), HP = Math.PI / 2;
      for (let k = 0; k < 2; k++) { const lx = k ? -3.8 : 3.8, lz = zs(X.s + (k ? 7.4 : -7.4)); M4.trs(M, lx, 0, lz); R.draw(mo.tlight, M); for (let i = 0; i < 3; i++) { const on = 2 - i === st; M4.trs(M, lx, 3.55 - 0.3 * i, lz + 0.15, 0, 0, 0, on ? 0.2 : 0.15); R.draw(mo.cube, M, ONE, on ? LC[i] : LC[3], on ? 1 : 0); } }
      for (const c of crossCars(X, g.t, this.cars)) { M4.trs(M, c.x, 0, zs(c.s), c.dir > 0 ? -HP : HP); R.draw(c.moto ? mo.motoNpc[c.col] : mo.carNpc[c.col], M); }
      if (st !== 2) for (let row = 0; row < 2; row++) { const dir = row ? -1 : 1; M4.trs(M, -dir * 8.8, 0, zs(X.s + (row ? 2.2 : -2.2)), dir > 0 ? -HP : HP); R.draw(mo.carNpc[(X.id + row) % 4], M); }
    }
    // esquinas: calles a izquierda y derecha hacia otras zonas, letreros de madera y flechas de giro
    for (const C of g.corners) {
      const z = zs(C.s); if (z < FAR - 10 || z > 40) continue;
      M4.trs(M, 0, 0, z); R.draw(mo.xroad, M);
      for (const sd of [-1, 1]) { const B = sd < 0 ? C.L : C.R, zz = zs(C.s - 8.5); M4.trs(M, sd * 4.7, 0, zz, sd < 0 ? 0 : Math.PI); R.draw(mo.signpost[B.n], M); M4.trs(M, sd * 4.7, 2.15, zz, 0, 0, 0, 0.3); R.draw(mo.gate[ZONES[B.z].bill], M); }
      if (!C.done) { const pulse = 0.8 + 0.2 * Math.sin(time * 6), CC = this.CA || (this.CA = { d: hex('#ffc23a'), o: hex('#39c8ff') }); for (let q = C.s - 46; q < C.s - 4; q += 8) { const zq = zs(q); if (zq < FAR || zq > 12) continue; M4.trs(M, LX(0), 0, zq, 0.55, 0, 0, pulse); R.draw(mo.chev, M, ONE, CC.o, 1); M4.trs(M, LX(3), 0, zq, -0.55, 0, 0, pulse); R.draw(mo.chev, M, ONE, CC.d, 1); } }
    }
    // bifurcaciones: separador con matas, letrero y la ruta de entregas marcada con flechas
    const CA = this.CA || (this.CA = { d: hex('#ffc23a'), o: hex('#39c8ff') });
    for (const f of g.forks) {
      const z0 = zs(f.a); if (z0 < FAR - 300 || zs(f.b) > 14) continue;
      if (z0 > FAR && z0 < 30) { M4.trs(M, 0, 0, zs(f.a - 4)); R.draw(mo.forkSign, M); }
      const dx = f.dl ? 1.6 : -1.6, pulse = 0.75 + 0.25 * Math.sin(time * 6);
      for (let q = f.a - 36; q < f.b; q += 9) { const zq = zs(q); if (zq < FAR || zq > 12) continue; M4.trs(M, dx, 0, zq, 0, 0, 0, pulse); R.draw(mo.chev, M, ONE, CA.d, 1); if (q < f.a) { M4.trs(M, -dx, 0, zq, 0, 0, 0, 0.8); R.draw(mo.chev, M, ONE, CA.o, 1); } }
      for (const sd of [-1, 1]) { const zz = zs(f.a - 14); if (zz > FAR && zz < 14) { M4.trs(M, sd * 1.6, 3.6 + Math.sin(time * 3) * 0.15, zz, time * 2, 0, 0, 0.42); R.draw(mo.cube, M, ONE, (sd > 0) === !!f.dl ? CA.d : CA.o, 1); } }
    }
    // parques: fuente, juegos infantiles, lago con patos, picnics, gente descansando y rampas de skate
    for (const p of g.parks) { const z = zs(p[0]); if (!(z > FAR - 200 && zs(p[1]) < 20)) continue;
      if (z > FAR && z < 20) { M4.trs(M, 0, 0, z); R.draw(mo.parkArch, M); M4.trs(M, 0, 0, zs(p[1])); R.draw(mo.parkArch, M); }
      let i = 0; for (let q = p[0] + 14; q < p[1] - 6; q += 24, i++) { const zq = zs(q); if (zq < FAR - 6 || zq > 18) continue;
        for (const sd of [-1, 1]) { const k = (i * 2 + (sd > 0 ? 1 : 0) + Math.floor(p[0])) % 6, ry = sd > 0 ? -Math.PI / 2 : Math.PI / 2, X = sd * 7.9;
          if (k === 0) { M4.trs(M, X, 0, zq); R.draw(mo.fountain, M); for (let j = 0; j < 2; j++) { M4.trs(M, X - sd * 2.2, 0.45, zq + (j ? 1.4 : -1.4), ry); R.draw(mo.sitter[(i + j) % 4], M); } }
          else if (k === 1) { M4.trs(M, sd * 8.9, 0, zq, ry); R.draw(mo.playground, M); M4.trs(M, sd * 6.5, 0, zq + 2.5, ry + Math.sin(time + i) * 0.5); R.draw(mo.runB[i % 4], M); }
          else if (k === 2) { M4.trs(M, sd * 10.2, 0, zq); R.draw(mo.pond, M); M4.trs(M, sd * 10.2 + Math.sin(time * 0.4 + i) * 1.4, 0.02, zq + Math.cos(time * 0.4 + i) * 2.2, time * 0.4 + i, 0, 0, 0.9); R.draw(mo.ducks, M); }
          else if (k === 3) { M4.trs(M, sd * 6.9, 0, zq, i); R.draw(mo.picnic[i % 3], M); for (let j = 0; j < 2; j++) { M4.trs(M, sd * 6.9 + (j ? 0.7 : -0.7), 0.04, zq + (j ? 0.4 : -0.3), j ? -1.2 : 1.6); R.draw(mo.sitter[(i + j + 1) % 4], M); } }
          else if (k === 4) { M4.trs(M, sd * 6.9, 0, zq, ry); R.draw(mo.quarter, M); }
          else { for (let j = 0; j < 3; j++) { M4.trs(M, sd * (6.1 + j * 0.8), 0, zq + j * 0.7, sd > 0 ? Math.PI * 0.8 : -Math.PI * 0.2); R.draw(mo.person[(i + j) % 4], M); } } } } }
    // obstáculos (los modelos de carril se estrechan a 0,8 para carriles de 1,6 m)
    for (const o of g.obs) {
      if (!o.alive && !o.fly) continue;
      const z = zs(o.s); if (z < FAR - o.hd || z > 14 + o.hd) continue;
      let m, kx = this.NEWO.has(o.t) ? 1 : 0.8, ry = 0;
      if (o.t === 'branch') { if (!o.vis) continue; M4.trs(M, 0, 0, z); R.draw(this.branch(o.vis), M); continue; }
      if (o.t === 'gate' && !o.fly) { M4.trs(M, o.x, 0, z, 0, 0, 0, 0.8, 1, 1); R.draw(mo.gatepost, M); M4.trs(M, o.x, gateY(o, g.t), z, 0, 0, 0, 0.8, 1, 1); R.draw(mo.gatebar, M); continue; }
      if (o.t === 'pad') { if (!o.used) for (const dz of [-0.9, 0.9]) { M4.trs(M, o.x, 0, z + dz, 0, 0, 0, 0.9 + 0.1 * Math.sin(time * 9 + dz)); R.draw(mo.chev, M, ONE, this.CA.o, 1); } continue; }
      if (o.t === 'wall' || o.t === 'rail' || o.t === 'median') { const sm = o.t === 'wall' ? (o.st ? (o.adj ? mo.hedgeseg : mo.bedseg) : mo.wallseg) : o.t === 'median' ? mo.medseg : mo.railseg, a0 = o.s - o.hd, a1 = o.s + o.hd; for (let k = Math.max(0, Math.floor((P.s - 12 - a0) / 4)); a0 + 4 * k < a1 && a0 + 4 * k < P.s - FAR; k++) { M4.trs(M, o.x, 0, zs(a0 + 4 * k + 2)); R.draw(sm, M); } continue; }
      if (o.T.moving && !o.fly) {
        const yaw = o.u < 0 ? Math.PI : 0;
        if (o.t === 'car') { M4.trs(M, o.x, 0, z, yaw, 0, 0, 0.95, 1, 1); R.draw(mo.carNpc[o.col], M); }
        else if (o.nk === 5) { M4.trs(M, o.x, 0, z, yaw); R.draw(mo.motoNpc[o.col], M); }
        else if (o.nk === 0) { M4.trs(M, o.x, 0, z, yaw, 0, 0, 0.9); R.draw(mo.npc[o.col], M); }
        else {
          const sk = o.nk === 2, wk = o.nk === 3, ph = time * (sk ? 5 : wk ? 5.5 : 10) + o.R, am = wk ? 0.4 : 0.75;
          M4.trs(M, o.x, 0, z, yaw); R.draw((sk ? mo.skB : mo.runB)[o.col], M);
          for (const sx of [-1, 1]) { const a = Math.sin(ph) * sx; M4.trs(this.A, sx * 0.1, 0.95, 0, 0, sk ? 0.2 + 0.15 * a : am * a, sk ? sx * (0.12 + 0.18 * Math.max(0, a)) : 0); M4.mul(this.B, M, this.A); R.draw(sk ? mo.skL : mo.runL, this.B); }
        }
        continue;
      }
      if (o.t === 'truck') m = mo.truck[o.col || 0]; else if (o.t === 'stall') { m = mo.stall[o.v || 0]; kx = 1; } else if (o.t === 'person') { m = mo.person[o.v || 0]; kx = 1; ry = o.ry || 0; } else if (o.T.moving) m = o.t === 'car' ? mo.carNpc[o.col] : mo.npc[o.col]; else m = mo[o.t];
      if (!m) continue;
      if (o.fly) { const f = o.fly; f.t += dt; const t = f.t; M4.trs(M, o.x + f.vx * t, Math.max(0, f.vy * t - GRAV * 0.5 * t * t), z - f.vz * t, f.ry * t, f.rx * t, 0); }
      else M4.trs(M, o.x, 0, z, ry, 0, 0, kx, 1, 1);
      R.draw(m, M);
    }
    // entregas: buzones, casitas, muros para pósters y kioscos EMSAY
    const DC = this.DC || (this.DC = { per: hex('#f4f1e6'), rev: hex('#39c8ff'), cor: hex('#ffc23a'), pos: hex('#ff2fb3'), kio: hex('#2dffb3') });
    for (const d of g.dels) {
      const z = zs(d.s); if (z < FAR || z > 16) continue;
      const sd = d.side, HP = Math.PI / 2; if (d.done && d.ta == null) d.ta = time;
      const up = d.done ? clamp((time - d.ta - (d.T || 0)) / 0.25, 0, 1) : 0;
      if (d.obj === 'muro') { M4.trs(M, sd * 4.7, 0, z, sd > 0 ? 0 : Math.PI); R.draw(mo.posterWall, M); if (up > 0) { M4.trs(M, sd * 4.58, 1.45 * (1 - up), z, sd > 0 ? 0 : Math.PI, 0, 0, 1, up, 1); R.draw(mo.poster[d.v % 4], M); } }
      else if (d.obj === 'kiosko') { M4.trs(M, sd * 4.75, 0, z, sd > 0 ? -HP : HP); R.draw(mo.kiosk, M); M4.trs(M, sd * 4.75, 0, z + 1.5, sd > 0 ? -HP : HP); R.draw(mo.person[d.v % 4], M); if (up > 0) for (let i = 0; i < 2; i++) { M4.trs(M, sd * 3.75, 0.17 + i * 0.3 * up, z - 0.3 + i * 0.1, i * 0.4); R.draw(mo.bundle, M); } }
      else {
        M4.trs(M, sd * 4.35, 0, z, 0, 0, 0, sd, 1, 1); R.draw(mo.buzon, M);
        M4.trs(this.A, 0.12, 1.22, 0.27, 0, (1 - up) * HP, 0); M4.mul(this.B, M, this.A); R.draw(mo.flag, this.B);
        if (d.obj === 'casita') {
          R.draw(mo.house[d.v], M);
          M4.trs(this.A, 1.36, 0, 0.79, -up * 1.7, 0, 0); M4.mul(this.B, M, this.A); R.draw(mo.door, this.B);
          if (up > 0) {
            const k = clamp((time - d.ta - (d.T || 0)) / 0.35, 0, 1), wv = Math.sin(time * 9) * 0.5;
            M4.trs(this.A, 1.12, 0, 0.42, HP, 0, 0, 0.3 + 0.7 * k); M4.mul(this.B, M, this.A); R.draw(mo.resi[d.v], this.B);
            M4.trs(this.A, 0.22, 1.18, 0, 0, 0, -0.45 + wv * 0.7); M4.mul(this.C, this.B, this.A); R.draw(mo.rarm, this.C);
          }
        }
      }
      if (!d.done && !d.miss) { M4.trs(M, sd * 4.35, 3.3 + Math.sin(time * 6) * 0.15, z, time * 3, 0.6, 0, 0.3); R.draw(mo.cube, M, ONE, DC[d.k], 1); }
    }
    for (let i = this.proj.length - 1; i >= 0; i--) {
      const p = this.proj[i]; p.t += dt; const k = Math.min(1, p.t / p.T);
      if (k >= 1) { this.emit(8, p.x1, p.y1, p.s1, hex('#ffc23a'), 3, 0.07, 0.5, 2.5); this.proj.splice(i, 1); continue; }
      M4.trs(M, lerp(p.x0, p.x1, k), lerp(p.y0, p.y1, k) + 1.1 * 4 * k * (1 - k), zs(lerp(p.s0, p.s1, k)), time * 12, 0, time * 7); R.draw(mo[p.m] || mo.mag, M);
    }
    // animalitos que cruzan
    for (const c of g.crs) {
      const z = zs(c.s); if (z < FAR || z > 12 || (c.done && Math.abs(c.x) > 6)) continue;
      const run = c.t0 >= 0 ? 1 : 0, b = Math.abs(Math.sin(time * 12)) * 0.1 * run;
      if (c.kind === 'duck') { M4.trs(M, c.x, b * 0.3, z, c.dir > 0 ? 0 : Math.PI); R.draw(mo.ducks, M); }
      else { const dg = c.kind === 'dog'; M4.trs(M, c.x, b, z, c.dir > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0, dg ? 1.1 : 1); R.draw(dg ? mo.dogA : mo.catA, M); M4.trs(this.A, 0, dg ? 0.5 : 0.4, 0.26, Math.sin(time * 12) * 0.6, 0, 0); M4.mul(this.B, M, this.A); R.draw(dg ? mo.dogT : mo.catT, this.B); }
    }
    // rival de turno
    if (g.riv) { const Rv = g.riv, z = zs(Rv.s); if (z > FAR && z < 14) { const ph = time * 5 + Rv.i, c = Rv.i % 4; M4.trs(M, Rv.x, Rv.y, z); R.draw(mo.skB[c], M); for (const sx of [-1, 1]) { const a = Math.sin(ph) * sx; M4.trs(this.A, sx * 0.1, 0.95, 0, 0, 0.2 + 0.15 * a, sx * (0.12 + 0.18 * Math.max(0, a))); M4.mul(this.B, M, this.A); R.draw(mo.skL, this.B); } M4.trs(M, Rv.x, Rv.y + 2.35, z, time * 2, 0.6, 0, 0.24); R.draw(mo.cube, M, ONE, (this.rc || (this.rc = RIV.map(r => hex(r[1]))))[Rv.i], 1); } }
    // policía o perro que te persigue
    if (g.pol && mode === 'play') {
      const c = g.pol, zc = Math.min(c.d, 30); this.polX = lerp(this.polX == null ? P.x : this.polX, P.x, Math.min(1, dt * 2.5));
      if (c.k === 'pol') { M4.trs(M, this.polX, 0, zc); R.draw(mo.policia, M, ONE, Math.floor(time * 8) % 2 ? this.pc1 || (this.pc1 = [1.7, 0.3, 0.3]) : this.pc2 || (this.pc2 = [0.3, 0.5, 1.9]), 1); }
      else { M4.trs(M, this.polX, Math.abs(Math.sin(time * 14)) * 0.12, zc, 0, 0, 0, 1.1); R.draw(mo.dogA, M); M4.trs(this.A, 0, 0.5, 0.26, Math.sin(time * 12) * 0.6, 0, 0); M4.mul(this.B, M, this.A); R.draw(mo.dogT, this.B); }
    } else this.polX = null;
    // monedas y objetos
    const spin = time * 4;
    for (const c of g.coins) { if (!c.alive) continue; const z = zs(c.s); if (z < -125 || z > 8) continue; M4.trs(M, c.x, c.y, z, spin + c.s * 0.2); R.draw(mo.coin, M); }
    for (const it of g.items) {
      if (!it.alive) continue; const z = zs(it.s); if (z < -140 || z > 8) continue;
      const y = it.y + Math.sin(time * 3 + it.s) * 0.12;
      M4.trs(M, it.x, y, z, time * 2, 0, 0, it.k === 'glide' ? 0.55 : 1); R.draw(it.k === 'letter' ? mo.letter[it.ch] || mo.clue : mo[it.k], M);
      M4.trs(M, it.x, y, z, 0, 0, time * 1.5); R.draw(mo.halo[it.k], M);
    }
    this.drawPlayer(g, time, dt);
    this.wild(g, mode, time, dt);
    // mascota que corre al lado
    if (this.petK && this.pl.pet && P.alive) {
      const sd = mode === 'garage' ? 1 : g.petSide, pk = this.petK, py = P.air ? (P.gy || 0) : P.y; this.petX = lerp(this.petX == null ? P.x + sd : this.petX, P.x + sd * 0.95, Math.min(1, dt * 8));
      if (pk === 'm3') { const f = Math.sin(time * 16) * 0.8; M4.trs(M, this.petX * 0.9 + sd * 0.1, P.y + 2.05 + Math.sin(time * 3) * 0.12, 0.25, 0, 0, 0, 1.3); R.draw(this.pl.pet, M); M4.trs(this.A, 0.08, 0.05, 0, 0, 0, f); M4.mul(this.B, M, this.A); R.draw(this.pl.ptail, this.B); M4.trs(this.A, -0.08, 0.05, 0, 0, 0, -f, -1, 1, 1); M4.mul(this.B, M, this.A); R.draw(this.pl.ptail, this.B); }
      else { const run = mode === 'garage' ? 0.3 : 1, ph = time * 14, b = Math.abs(Math.sin(ph)) * 0.12 * run; M4.trs(M, this.petX, py + b, 0.3, 0, Math.sin(ph) * 0.12 * run, 0, 1.15); R.draw(this.pl.pet, M); M4.trs(this.A, 0, 0.5, 0.26, Math.sin(time * 12) * 0.6, 0, 0); M4.mul(this.B, M, this.A); R.draw(this.pl.ptail, this.B); }
    }
    // partículas
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]; p.life -= dt; if (p.life <= 0) { this.parts.splice(i, 1); continue; }
      p.vy -= 9 * p.gr * dt; p.x += p.vx * dt; p.y = Math.max(0.02, p.y + p.vy * dt); p.s += p.vs * dt;
      const k = p.sz * (0.4 + 0.6 * p.life / p.max); M4.trs(M, p.x, p.y, zs(p.s), 0, 0, 0, k * p.sx, k, k * p.sz2); R.draw(mo.cube, M, ONE, p.col, 1);
    }
    if ((P.turbo > 0 || P.boost > 0.4) && mode === 'play') for (let i = 0; i < (P.turbo > 0 ? 3 : 1); i++) this.parts.push({ x: P.x + (Math.random() - 0.5) * 9, y: Math.random() * 5, s: P.s + 6 + Math.random() * 12, vx: 0, vy: 0, vs: 0, life: 0.12, max: 0.12, col: hex('#ffffff'), sz: 0.05, gr: 0, sx: 1, sz2: 40 });
    if (mode === 'play' && P.brake && P.v > 4 && !P.air && Math.random() < 0.7) this.emit(1, P.x + (Math.random() - 0.5) * 0.3, 0.06, P.s - 0.25, hex(g.veh.kind === 'h' ? '#cfc4a8' : '#ffd27a'), 1.5, g.veh.kind === 'h' ? 0.1 : 0.05, 0.35, 1);
    // sombras
    R.blend(true, 0.42);
    for (const o of g.obs) { if (!o.alive || o.fly || o.T.moving || o.T.ground || o.y1 < 0.5 || o.t === 'wall' || o.t === 'median' || o.t === 'rail' || o.t === 'branch' || o.t === 'scaff') continue; const z = zs(o.s); if (z < -70 || z > 10) continue; M4.trs(M, o.x + 0.25, 0, z - 0.2, 0, 0, 0, o.hw * 2.6, 1, Math.min(o.hd, 3) * 2.6); R.draw(mo.shadow, M, ONE, ONE, 0); }
    for (const c of g.crs) { if (c.done) continue; const z = zs(c.s); if (z > -60 && z < 10) { M4.trs(M, c.x, 0, z, 0, 0, 0, c.kind === 'duck' ? 2 : 0.9, 1, 0.8); R.draw(mo.shadow, M, ONE, ONE, 0); } }
    if (g.riv) { const z = zs(g.riv.s); if (z > -70 && z < 10) { M4.trs(M, g.riv.x, 0, z, 0, 0, 0, 1, 1, 1.6); R.draw(mo.shadow, M, ONE, ONE, 0); } }
    M4.trs(M, P.x, (P.gy || 0), 0, 0, 0, 0, 1.1 / (1 + Math.max(0, P.y - (P.gy || 0)) * 0.4)); R.draw(mo.shadow, M, ONE, ONE, 0);
    for (const o of g.obs) if (o.T.moving && o.alive && !o.fly) { const z = zs(o.s); if (z > -80 && z < 10) { M4.trs(M, o.x, 0, z, 0, 0, 0, 1.2, 1, 2); R.draw(mo.shadow, M, ONE, ONE, 0); } }
    R.blend(false);
  }
};
function ik(dy, dz) {
  const L = 0.42; let d = Math.hypot(dy, dz); d = Math.min(Math.max(d, 0.05), 2 * L * 0.999);
  const aT = Math.atan2(-dz, -dy), al = Math.acos(clamp(d / (2 * L), -1, 1)), be = Math.acos(clamp((2 * L * L - d * d) / (2 * L * L), -1, 1));
  return [aT + al, -(Math.PI - be)];
}
