/* ===== ESCENA · cámara, ediciones, jugador animado, partículas ===== */
const v3 = () => [0, 0, 0];
const RN = {
  env: { top: v3(), hor: v3(), sunC: v3(), sun: v3(), stars: 0, amb: 1, sunI: 0.4, emit: 0.2, fogR: [60, 180], L: [-0.42, 0.78, 0.46], bend: [0, -0.00032], hy: 0.5, road: [v3(), v3(), v3(), v3(), v3()], scen: [v3(), v3(), v3(), v3(), v3()] },
  cam: { ex: 0, ey: 3, ez: 6, cx: 0, cy: 1, cz: -10, fov: 1 }, camY: 0, shake: 0, cr: 0,
  M: new Float32Array(16), A: new Float32Array(16), B: new Float32Array(16), C: new Float32Array(16), D: new Float32Array(16), E: new Float32Array(16),
  parts: [], mo: {}, branches: {}, pl: null, plKey: '', trailT: 0, quality: 1,
  init() {
    const mk = b => R.mesh(b), mo = this.mo;
    for (const k of ['road', 'tree', 'pine', 'bush', 'lamp', 'bench', 'hill', 'billFrame', 'gateFrame', 'rock', 'cone', 'barrier', 'pothole', 'puddle', 'cart', 'kiosk', 'coin', 'gift', 'clue', 'magnet', 'shield', 'turbo', 'x2', 'cube', 'shadow', 'ink']) mo[k] = mk(MOD[k]());
    mo.bld = []; for (let v = 0; v < 3; v++) mo.bld.push([mk(MOD.bld(v, 2)), mk(MOD.bld(v, 3))]);
    mo.bill = []; mo.gate = []; for (let i = 0; i < 10; i++) { mo.bill.push(mk(MOD.billPanel(i))); mo.gate.push(mk(MOD.gatePanel(i))); }
    mo.truck = [0, 1, 2].map(c => mk(MOD.truck(c))); mo.npc = [0, 1, 2, 3].map(c => mk(MOD.npc(c)));
    mo.ramp = mk(MOD.ramp(2.4, 6, '#ffc23a')); mo.jramp = mk(MOD.ramp(1.1, 4, '#ff5a2a'));
    mo.halo = { magnet: mk(MOD.halo('#ff5a2a')), turbo: mk(MOD.halo('#ffc23a')), x2: mk(MOD.halo('#ff2fb3')), shield: mk(MOD.halo('#39c8ff')), gift: mk(MOD.halo('#ff2fb3')), clue: mk(MOD.halo('#2dffb3')) };
  },
  branch(v) { const k = v.side + ':' + v.lanes.join(''); return this.branches[k] || (this.branches[k] = R.mesh(MOD.branch(v.side, v.lanes))); },
  setPlayer(cos, vid) {
    const key = JSON.stringify(cos) + vid; if (key === this.plKey) return; this.plKey = key;
    if (this.pl) for (const k in this.pl) R.free(this.pl[k]);
    const r = MOD.rider(cos);
    this.pl = { veh: R.mesh(MOD.veh(vid, cos.paint, cos.pe)), t: R.mesh(r.t), th: R.mesh(r.th), sn: R.mesh(r.sn), ar: R.mesh(r.ar) };
    this.vid = vid;
  },
  zoneEnv(s) {
    s = Math.max(0, s); const ed = Math.floor(s / 1000), u = s - ed * 1000, a = ZONES[ed % ZONES.length];
    let b = a, t = 0; if (u > 930) { b = ZONES[(ed + 1) % ZONES.length]; t = (u - 930) / 70; t = t * t * (3 - 2 * t); }
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
    if (mode === 'garage') { const a = time * 0.45 + 0.6, rr = 4.9 + k * 0.6; c.ex = Math.sin(a) * rr; c.ez = Math.cos(a) * rr; c.ey = 1.7; c.cx = 0; c.cy = -0.85 - k * 0.2; c.cz = 0; c.fov = 0.9 + k * 0.2; }
    else if (mode === 'menu') { c.ex = P.x * 0.6 + 1.6; c.ey = 1.85 + P.y * 0.5; c.ez = 4.4 + k * 1.6; c.cx = P.x * 0.6; c.cy = 1.0 + P.y * 0.4; c.cz = -8; c.fov = 1.0 + k * 0.15; }
    else {
      this.camY = lerp(this.camY, P.y, Math.min(1, dt * 6));
      c.ex = P.x * 0.72; c.ey = lerp(3.15, 3.75, k) + this.camY * 0.62; c.ez = lerp(5.9, 7.3, k);
      c.cx = P.x * 0.86; c.cy = 1.1 + this.camY * 0.5; c.cz = -10;
      c.fov = (lerp(58, 66, k) + clamp(P.v - 14, 0, 30) * 0.28 + (P.turbo > 0 ? 6 : 0)) * Math.PI / 180;
    }
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
    else if (e.k === 'land' && e.a > 0.35) this.emit(5, P.x, 0.1, P.s, hex('#cfc4a8'), 3, 0.1, 0.4, 1.5);
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
    const M = this.M, A = this.A, B = this.B, C = this.C, D = this.D, Ee = this.E;
    this.cr = lerp(this.cr, P.crouch > 0 ? 1 : 0, Math.min(1, dt * 18)); const cr = this.cr;
    const tx = (P.lane - 1) * LW, roll = clamp((tx - P.x) * 0.16, -0.32, 0.32), pitch = P.air ? clamp(-P.vy * 0.012, -0.25, 0.25) : 0;
    let spin = 0, vspin = 0, vflip = 0;
    if (P.air && !P.trickHit && P.airT > 0.15 && P.alive) { const k = clamp((P.airT - 0.15) / 0.38, 0, 1), e = k * k * (3 - 2 * k) * Math.PI * 2; if (id === 'skate') vflip = e; else if (id === 'scooter') vspin = e; else spin = e; }
    let dead = 0, slide = 0; if (!P.alive) { dead = Math.min(1.5, P.deadT * 4); slide = Math.min(3.5, P.deadT * 6); }
    const blink = P.inv > 0 && P.alive && Math.floor(time * 14) % 2;
    if (blink) return;
    M4.trs(B, P.x, P.y, 0, spin, pitch - dead * 0.2, roll);
    // vehículo
    const sk = id === 'quad' || id === 'inline';
    if (!sk) { M4.trs(A, 0, 0, -slide, vspin, 0, vflip + dead * 0.6); M4.mul(M, B, A); R.draw(pl.veh, M); }
    // pose
    let hy, hz = 0, yaw = 0, lean, feet, arms, splay = 0.04;
    const ph = P.phase, grounded = !P.air && P.alive;
    if (id === 'scooter') { hy = 0.98 - 0.34 * cr; hz = 0.02; lean = 0.18 + 0.5 * cr; const f = time * 7.5, lift = Math.max(0, Math.cos(f)) * 0.16; feet = [[0.19, -0.06], grounded && cr < 0.5 ? [0.07 + lift, 0.2 + 0.25 * Math.sin(f)] : [0.19, 0.2]]; arms = [[0.72 + 0.3 * cr, 0.05], [0.72 + 0.3 * cr, -0.05]]; }
    else if (id === 'escooter') { hy = 1.02 - 0.34 * cr; hz = 0.03; lean = 0.12 + 0.5 * cr; feet = [[0.255, -0.17], [0.255, 0.2]]; arms = [[0.7 + 0.3 * cr, 0.05], [0.7 + 0.3 * cr, -0.05]]; }
    else if (id === 'bike') { hy = 1.03 - 0.08 * cr; hz = 0.12; lean = 0.55 + 0.3 * cr; const f = ph * 0.7; feet = [[0.36 - 0.17 * Math.cos(f) + 0.07, -0.02 + 0.17 * Math.sin(f)], [0.36 + 0.17 * Math.cos(f) + 0.07, -0.02 - 0.17 * Math.sin(f)]]; arms = [[1.0, 0.08], [1.0, -0.08]]; }
    else if (id === 'skate') { hy = 0.9 - 0.3 * cr; yaw = -1.35; lean = 0.15 + 0.4 * cr; feet = null; arms = [[0.25, 0.95], [0.25, -0.95]]; }
    else { hy = (id === 'inline' ? 1.0 : 0.97) - 0.32 * cr; lean = 0.3 + 0.45 * cr; const f = time * (id === 'inline' ? 5.2 : 6.5); feet = [[0.17 + Math.max(0, -Math.cos(f)) * 0.08, 0.22 * Math.sin(f)], [0.17 + Math.max(0, Math.cos(f)) * 0.08, -0.22 * Math.sin(f)]]; arms = [[0.45 * Math.sin(f), 0.15], [-0.45 * Math.sin(f), -0.15]]; splay = 0.1; }
    if (!P.alive) { lean += dead * 0.6; }
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
    for (let i = 0; i < 2; i++) { const ar = arms[i], sx = i ? 0.255 : -0.255; M4.trs(A, sx, 0.58, 0, 0, ar[0] + (id === 'skate' ? 0 : lean * 0.6), ar[1]); M4.mul(M, D, A); R.draw(pl.ar, M); }
  },
  frame(g, mode, time, dt, cos) {
    const P = g.p; if (!R.gl) return;
    this.zoneEnv(P.s);
    const E = this.env;
    E.bend[0] = mode === 'garage' ? 0 : 0.0017 * Math.sin(P.s / 520) * Math.sin(P.s / 190 + 0.7);
    E.bend[1] = mode === 'garage' ? 0 : -0.00032;
    this.camera(g, mode, time, dt);
    if (!R.begin(this.cam, E, time)) return;
    const mo = this.mo, M = this.M, zs = s => -(s - P.s), FAR = -E.fogR[1] - 12;
    // carretera (1 sola llamada, paleta de la edición)
    R.pal(true, E.road); M4.trs(M, 0, 0, P.s % 40); R.draw(mo.road, M);
    // escenario
    R.pal(true, E.scen); const panels = [];
    for (const sc of g.scen) {
      const z = zs(sc.s); if (z < FAR || z > 14) continue;
      let m = null, kx = sc.sc, ky = sc.sc, ry = sc.ry, sh = [sc.sh, sc.sh, sc.sh];
      switch (sc.k) {
        case 'bld': m = mo.bld[sc.v][sc.pi - 2]; ky = sc.h; break;
        case 'bill': m = mo.billFrame; panels.push([mo.bill[sc.v % 10], sc.x, z, ry]); break;
        case 'gate': m = mo.gateFrame; panels.push([mo.gate[ZONES[sc.z].bill], 0, z, 0]); break;
        case 'lamp': m = mo.lamp; ry = sc.side > 0 ? 0 : Math.PI; break;
        case 'bench': m = mo.bench; ry = sc.side > 0 ? 0 : Math.PI; break;
        default: m = mo[sc.k];
      }
      if (!m) continue;
      M4.trs(M, sc.x, 0, z, ry, 0, 0, kx, ky, kx); R.draw(m, M, sh);
    }
    R.pal(false);
    for (const p of panels) { M4.trs(M, p[1], 0, p[2], p[3]); R.draw(p[0], M); }
    // obstáculos
    for (const o of g.obs) {
      if (!o.alive && !o.fly) continue;
      const z = zs(o.s); if (z < FAR || z > 14) continue;
      let m;
      if (o.t === 'branch') { if (!o.vis) continue; m = this.branch(o.vis); M4.trs(M, 0, 0, z); R.draw(m, M); continue; }
      if (o.t === 'truck') m = mo.truck[o.col || 0]; else if (o.t === 'rider') m = mo.npc[o.col || 0]; else m = mo[o.t];
      if (!m) continue;
      if (o.fly) { const f = o.fly; f.t += dt; const t = f.t; M4.trs(M, o.x + f.vx * t, Math.max(0, f.vy * t - GRAV * 0.5 * t * t), z - f.vz * t, f.ry * t, f.rx * t, 0); }
      else M4.trs(M, o.x, 0, z, 0, 0, 0);
      R.draw(m, M);
    }
    // monedas y objetos
    const spin = time * 4;
    for (const c of g.coins) { if (!c.alive) continue; const z = zs(c.s); if (z < -125 || z > 8) continue; M4.trs(M, c.x, c.y, z, spin + c.s * 0.2); R.draw(mo.coin, M); }
    for (const it of g.items) {
      if (!it.alive) continue; const z = zs(it.s); if (z < -140 || z > 8) continue;
      const y = it.y + Math.sin(time * 3 + it.s) * 0.12;
      M4.trs(M, it.x, y, z, time * 2); R.draw(mo[it.k], M);
      M4.trs(M, it.x, y, z, 0, 0, time * 1.5); R.draw(mo.halo[it.k], M);
    }
    this.drawPlayer(g, time, dt);
    // la Tinta Gris persigue al jugador cuando se tambalea (y lo atrapa al caer)
    const it = mode === 'play' ? (!P.alive ? 1.45 : P.stumble > 0 ? 1 : 0) : 0; this.ink = lerp(this.ink || 0, it, Math.min(1, dt * (it > (this.ink || 0) ? 3 : 1.5)));
    if (this.ink > 0.03) { const k = this.ink, w = Math.sin(time * 9) * 0.06; M4.trs(M, P.x * 0.92, -1.3 * Math.max(0, 1 - k), 7.4 - 4.9 * k, Math.sin(time * 3) * 0.2, 0, 0, 0.6 + w, 0.6 - w, 0.6); R.draw(mo.ink, M); }
    // partículas
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i]; p.life -= dt; if (p.life <= 0) { this.parts.splice(i, 1); continue; }
      p.vy -= 9 * p.gr * dt; p.x += p.vx * dt; p.y = Math.max(0.02, p.y + p.vy * dt); p.s += p.vs * dt;
      const k = p.sz * (0.4 + 0.6 * p.life / p.max); M4.trs(M, p.x, p.y, zs(p.s), 0, 0, 0, k * p.sx, k, k * p.sz2); R.draw(mo.cube, M, ONE, p.col, 1);
    }
    if (P.turbo > 0 && mode === 'play') for (let i = 0; i < 3; i++) this.parts.push({ x: P.x + (Math.random() - 0.5) * 9, y: Math.random() * 5, s: P.s + 6 + Math.random() * 12, vx: 0, vy: 0, vs: 0, life: 0.12, max: 0.12, col: hex('#ffffff'), sz: 0.05, gr: 0, sx: 1, sz2: 40 });
    // sombras
    R.blend(true, 0.42);
    M4.trs(M, P.x, (P.gy || 0), 0, 0, 0, 0, 1.1 / (1 + Math.max(0, P.y - (P.gy || 0)) * 0.4)); R.draw(mo.shadow, M, ONE, ONE, 0);
    for (const o of g.obs) if (o.t === 'rider' && o.alive) { const z = zs(o.s); if (z > -80 && z < 10) { M4.trs(M, o.x, 0, z, 0, 0, 0, 1.2, 1, 2); R.draw(mo.shadow, M, ONE, ONE, 0); } }
    R.blend(false);
  }
};
function ik(dy, dz) {
  const L = 0.42; let d = Math.hypot(dy, dz); d = Math.min(Math.max(d, 0.05), 2 * L * 0.999);
  const aT = Math.atan2(-dz, -dy), al = Math.acos(clamp(d / (2 * L), -1, 1)), be = Math.acos(clamp((2 * L * L - d * d) / (2 * L * L), -1, 1));
  return [aT + al, -(Math.PI - be)];
}
