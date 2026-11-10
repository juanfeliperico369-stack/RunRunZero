/* ===== LÓGICA DEL JUEGO · independiente del render (la usan el juego, la portada y el bot) ===== */
const LW = 2.0, GRAV = 42, DT = 1 / 120, PH = 1.7, PCH = 0.95, PHW = 0.34, PHD = 0.32, STEP = 0.36, VIEW = 190;
const rngOf = seed => { let a = (seed >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const pickW = (r, items) => { let tot = 0; for (const it of items) tot += Math.max(0, it[1]); let x = r() * tot; for (const it of items) { x -= Math.max(0, it[1]); if (x <= 0) return it[0]; } return items[items.length - 1][0]; };

/* need: qué hace falta para pasar · jump / duck / ramp / block */
const OT = {
  rock: { hw: 0.78, hd: 0.5, y0: 0, y1: 0.85, fatal: 1, land: 1, need: 'jump', name: 'una roca' },
  cone: { hw: 0.42, hd: 0.3, y0: 0, y1: 0.62, minor: 1, need: 'jump', name: 'un cono' },
  barrier: { hw: 0.9, hd: 0.18, y0: 0, y1: 1.05, fatal: 1, need: 'jump', name: 'una valla de obra' },
  pothole: { hw: 0.8, hd: 0.7, y0: -0.3, y1: 0.12, fatal: 1, ground: 1, need: 'jump', name: 'un bache' },
  puddle: { hw: 0.85, hd: 1.3, y0: -0.2, y1: 0.1, minor: 1, ground: 1, need: 'jump', name: 'un charco' },
  branch: { hw: 1.0, hd: 0.35, y0: 1.12, y1: 2.7, fatal: 1, need: 'duck', name: 'una rama baja' },
  cart: { hw: 0.86, hd: 0.9, y0: 0, y1: 2.1, fatal: 1, land: 1, need: 'block', name: 'un carrito de mango' },
  kiosk: { hw: 0.9, hd: 1.0, y0: 0, y1: 2.4, fatal: 1, land: 1, need: 'block', name: 'un puesto de revistas' },
  truck: { hw: 0.92, hd: 7, y0: 0, y1: 2.4, fatal: 1, land: 1, need: 'block', name: 'un furgón EMSAY' },
  ramp: { hw: 0.92, hd: 3, y0: 0, y1: 2.4, ramp: 1, need: 'ramp', name: 'una rampa' },
  jramp: { hw: 0.92, hd: 2, y0: 0, y1: 1.1, ramp: 1, need: 'ramp', name: 'una rampa' },
  rider: { hw: 0.5, hd: 0.85, y0: 0, y1: 1.8, fatal: 1, need: 'block', moving: 1, name: 'otro ciclista' }
};
const JUMPS = [['rock', 3], ['barrier', 2], ['pothole', 2.2], ['cone', 1.4], ['puddle', 1]];
const JUMPS_R = JUMPS.map(j => j[0] === 'puddle' ? ['puddle', 3.5] : j);
/* clima: algunas ediciones llueven (mismo resultado en lógica y render) */
const RAINY = ed => ed > 0 && (Math.imul(ed + 7, 2654435761) >>> 0) % 4 === 1;
const BLOCKS = [['cart', 2], ['kiosk', 1.4]];
const THRAW = [
  { near: [['tree', 3.5], ['pine', 1], ['bush', 2], ['lamp', 1.5], ['bench', 1], ['bill', 1]], far: [['bld', 3], ['tree', 4], ['hill', 3]] },
  { near: [['tree', 3], ['bush', 2.5], ['lamp', 1.5], ['bench', 1.5], ['bill', 1.5]], far: [['bld', 5], ['tree', 3], ['hill', 2]] },
  { near: [['lamp', 3.5], ['bench', 1], ['bush', 1], ['tree', 1.5], ['bill', 3]], far: [['bld', 8.5], ['tree', 1.5]] },
  { near: [['tree', 3], ['lamp', 3], ['bill', 2], ['bush', 2]], far: [['bld', 6], ['hill', 4]] },
  { near: [['pine', 3], ['lamp', 3], ['bill', 2], ['bush', 2]], far: [['bld', 7], ['hill', 3]] },
  { near: [['tree', 4], ['bush', 2], ['bench', 1.5], ['bill', 2.5]], far: [['hill', 4], ['tree', 3], ['bld', 3]] },
  { near: [['lamp', 4.5], ['bill', 3.5], ['bush', 2]], far: [['bld', 9], ['hill', 1]] },
  { near: [['palm', 4], ['bench', 1], ['parasol', 2.5], ['bill', 1]], far: [['palm', 3], ['hill', 1], ['bld', 1.5]], sea: 1 },
  { near: [['pine', 5], ['tree', 1.5], ['bush', 2], ['fence', 1.2]], far: [['pine', 5], ['mount', 2.5]] },
  { near: [['coffee', 4], ['fence', 2], ['tree', 1.5], ['bench', 0.6], ['bill', 0.8]], far: [['coffee', 3], ['mount', 2], ['hill', 2]] },
  { near: [['lamp', 2]], far: [['boat', 1.5], ['mount', 1.2]], rail: 1 }
];
const THEMES = ZORD.map(i => THRAW[i]);
const TUT = [
  { t: 'rock', lane: 1, need: 'jump', msg: 'DESLIZA ↑ PARA SALTAR', pc: 'Flecha ↑ · W · Espacio' },
  { t: 'branch', lane: 1, need: 'duck', msg: 'DESLIZA ↓ PARA AGACHARTE', pc: 'Flecha ↓ · S' },
  { t: 'cart', lane: 1, need: 'lane', msg: 'DESLIZA ← → PARA CAMBIAR DE CARRIL', pc: 'Flechas ← → · A D' }
];

const vEst = (g, s) => (14 + 21 * (1 - Math.exp(-s / 2600))) * g.veh.spd;
/* Relieve: subidas y bajadas (el mismo perfil usa el shader) */
const HILL = s => { const e = clamp((s - 150) / 250, 0, 1); return e * (6.0 * Math.sin(s * 0.0105) + 2.2 * Math.sin(s * 0.027 + 1.7)); };
const HILLD = s => HILL(s + 0.5) - HILL(s - 0.5);
const hillK = sl => clamp(1 - 1.3 * sl, 0.84, 1.18);
const FLOW = ZORD.map(i => [0.6, 0.6, 0.2, 0.4, 0.3, 0.6, 0.35, 0.2, 0.3, 0.5, 0][i]);
/* buzones y casitas: probabilidad de casita por edición (−1 = sin entregas) */
const DELK = ZORD.map(i => [0.6, 0.7, 0.15, 0.4, 0.3, 0.6, 0.2, 0.45, 0.6, 0.85, -1][i]);
const diffAt = s => clamp((s - 150) / 6500, 0, 1);

function newGame(o) {
  const v = VEHI[o.veh] || VEH[0], up = o.up || {}, bat = v.id === 'escooter' ? 1.35 : 1;
  const g = {
    seed: o.seed >>> 0, rng: rngOf(o.seed), srng: rngOf((o.seed >>> 0) * 7 + 3), veh: v, demo: !!o.demo, ai: !!o.ai, t: 0,
    p: { s: 0, x: 0, lane: 1, from: 1, y: 0, vy: 0, gv: 0, v: 0, air: false, airT: 0, crouch: 0, fastFall: 0, jumps: 0, stumble: 0, slow: 1, inv: 0, alive: true, deadT: 0,
      magnet: 0, turbo: 0, x2: 0, shield: 0, boost: 0, sl: 0, trickHit: 0, phase: 0, onTruck: null, lastLand: 0 },
    obs: [], coins: [], items: [], scen: [], ev: [], lf: [0, 0, 0],
    genS: 42, scenS: -30, nextGate: 1000, dels: [], deliv: 0, dStreak: 0, dBest: 0, nextDel: 150, tuns: [], pet: !!o.pet, petSide: 1, edition: 0, score: 0, coinsRun: 0, starsRun: 0, clues: 0, gifts: 0, jumps: 0, ducks: 0, tricks: 0, powers: 0, trucks: 0,
    cleanS: 0, cleanBest: 0, revives: 0, cause: '', mult: o.mult || 1, bad: 0, rows: 0,
    dur: { magnet: (8 + 2 * (up.magnet || 0)) * bat, turbo: (4.5 + (up.turbo || 0)) * bat, x2: (10 + 3 * (up.x2 || 0)) * bat },
    luck: up.gift || 0, nextGift: 380, nextClue: 320, cluesLeft: o.cluesLeft || 0, tut: o.tut ? 0 : -1, tutWait: null, ts: 1
  };
  genAhead(g);
  return g;
}

function addOb(g, t, lane, s, extra) {
  const T = OT[t]; const o = { pat: g._kind, t, T, lane, x: (lane - 1) * LW, s, R: s, hd: T.hd, hw: T.hw, y0: T.y0, y1: T.y1, alive: 1, hitT: -9, passed: 0, fly: null, seen: 0 };
  if (extra) Object.assign(o, extra);
  g.obs.push(o); g.lf[lane] = Math.max(g.lf[lane], s + o.hd); return o;
}
// ¿hay espacio libre para una moneda/objeto en (carril, s, y)?
function spotOk(g, lane, s, y) {
  for (const o of g.obs) {
    if (o.lane !== lane || !o.alive) continue;
    if (o.T.moving) { if (Math.abs(s - o.R) < 30) return false; continue; }
    if (s > o.s - o.hd - 0.8 && s < o.s + o.hd + 0.8) {
      if (o.T.ramp) continue;
      if (y < o.y1 + 0.35 && y + 0.5 > o.y0) return false;
    }
  }
  return true;
}
function addCoin(g, lane, s, y) { if (spotOk(g, lane, s, y)) g.coins.push({ lane, x: (lane - 1) * LW, s, y, alive: 1, mag: 0 }); }
function coinLine(g, lane, s0, n, y, sp = 2.4) { for (let i = 0; i < n; i++) addCoin(g, lane, s0 + i * sp, y); }
function coinArc(g, lane, sc, v, y0 = 0) {
  const vy = Math.sqrt(2 * GRAV * 1.5), T = 2 * vy / GRAV, D = v * T;
  for (let i = -3; i <= 3; i++) { const d = i / 3 * D / 2, t = (d + D / 2) / v; addCoin(g, lane, sc + d, y0 + 0.8 + Math.max(0, vy * t - GRAV * t * t / 2)); }
}

function genRow(g) {
  const JP = RAINY(Math.floor(g.genS / 1000)) ? JUMPS_R : JUMPS;
  const r = g.rng, s = g.genS, d = diffAt(s), v = vEst(g, s) * hillK(HILLD(s));
  const tg = lerp(1.22, 0.74, d), gap = Math.max(11, v * tg) * (1 + r() * 0.35);
  const st = ['free', 'free', 'free'];
  let len = 0, coinLane = -1, kind;
  g.rows++;
  if (g.tut >= 0 && g.tut < TUT.length) {
    const T = TUT[g.tut]; const o = addOb(g, T.t, T.lane, s); o.tut = g.tut; o.vis = T.t === 'branch' ? { side: 1, lanes: [1] } : null;
    st[T.lane] = OT[T.t].need; g.tut++; g.genS = s + 30; coinLine(g, 0, s - 10, 5, 0.8); return;
  }
  kind = pickW(r, [
    ['single', 3 - 1.6 * d], ['double', 1 + 2 * d], ['triple', d > 0.12 ? 0.5 + 2.2 * d : 0], ['branch', 0.9 + 0.4 * d],
    ['trucks', s > 260 ? 0.9 + 0.7 * d : 0], ['jramp', s > 200 ? 0.55 : 0], ['rider', s > 420 ? 0.45 + 0.9 * d : 0],
    ['slalom', 0.55], ['breather', Math.max(0.15, 0.75 - 0.6 * d)]
  ]);
  g._kind = kind;
  const rl = () => Math.floor(r() * 3);
  const anyType = () => pickW(r, JP.concat(BLOCKS, [['branch', 1.3]]));
  const place = (t, l) => {
    if (t === 'branch') { addOb(g, 'branch', l, s, { vis: { side: l === 0 ? -1 : 1, lanes: [l] } }); st[l] = 'duck'; }
    else { addOb(g, t, l, s); st[l] = OT[t].need; }
  };
  if (kind === 'rider') {
    const ok = [0, 1, 2].filter(l => g.lf[l] < s - 26);
    if (!ok.length) kind = 'single';
    else {
      const l = ok[Math.floor(r() * ok.length)];
      addOb(g, 'rider', l, s, { col: Math.floor(r() * 4), nk: Math.floor(r() * 3) }); st[l] = 'block';
      if (d > 0.3 && r() < 0.6) { const l2 = (l + 1 + Math.floor(r() * 2)) % 3; place(pickW(r, JP), l2); }
    }
  }
  if (kind === 'single') { place(anyType(), rl()); }
  else if (kind === 'double') { const f = rl(); for (let l = 0; l < 3; l++) if (l !== f) place(anyType(), l); }
  else if (kind === 'triple') {
    for (let l = 0; l < 3; l++) place(anyType(), l);
    if (st.every(x => x === 'block')) { const l = rl(); g.obs = g.obs.filter(o => !(o.s === s && o.lane === l)); place(pickW(r, JP), l); }
  } else if (kind === 'branch') {
    const span = d > 0.3 ? 1 + Math.floor(r() * 3) : 1 + Math.floor(r() * 2), side = r() < 0.5 ? -1 : 1;
    const lanes = side > 0 ? [2, 1, 0].slice(0, span) : [0, 1, 2].slice(0, span);
    lanes.forEach((l, i) => { addOb(g, 'branch', l, s, { vis: i === 0 ? { side, lanes } : null }); st[l] = 'duck'; });
    if (span < 3 && r() < 0.35 + d * 0.4) { const f = [0, 1, 2].filter(l => !lanes.includes(l)); place(pickW(r, BLOCKS.concat(JP)), f[Math.floor(r() * f.length)]); }
  } else if (kind === 'trucks') {
    let opts;
    do { opts = [0, 1, 2].map(() => pickW(r, [['rt', 4], ['t', 3], ['e', 1.6]])); } while (!opts.includes('rt') && !opts.includes('e'));
    opts.forEach((k, l) => {
      if (k === 'e') return;
      if (k === 'rt') { addOb(g, 'ramp', l, s); st[l] = 'ramp'; coinLine(g, l, s + 4.5, 5, 3.2); }
      else st[l] = 'block';
      addOb(g, 'truck', l, s + 10, { col: Math.floor(r() * 3) });
    });
    len = 17;
  } else if (kind === 'jramp') {
    const l = rl(); addOb(g, 'jramp', l, s); st[l] = 'ramp';
    const lv = v, vy = 0.275 * lv, T = (vy + Math.sqrt(vy * vy + 2 * GRAV * 1.1)) / GRAV;
    for (let i = 1; i <= 6; i++) { const t = i / 7 * T; addCoin(g, l, s + 2 + lv * t, 1.1 + vy * t - GRAV * t * t / 2 + 0.7); }
    if (r() < 0.5 + d * 0.5) { const l2 = (l + 1 + Math.floor(r() * 2)) % 3; place(pickW(r, BLOCKS), l2); }
    len = lv * T + 4;
  } else if (kind === 'slalom') {
    const dir = r() < 0.5 ? 1 : -1, t = d > 0.35 ? 'barrier' : 'cone';
    for (let k = 0; k < 3; k++) { const free = dir > 0 ? k : 2 - k; for (let l = 0; l < 3; l++) if (l !== free) addOb(g, t, l, s + k * Math.max(8, v * 0.55)); }
    st[0] = st[1] = st[2] = 'jump'; coinLane = -2; len = 2 * Math.max(8, v * 0.55);
    for (let k = 0; k < 3; k++) { const free = dir > 0 ? k : 2 - k; coinLine(g, free, s + k * Math.max(8, v * 0.55) - 1.2, 2, 0.8); }
  } else if (kind === 'breather') {
    const l = rl(); coinLine(g, l, s - 6, 8, 0.8); coinLane = -2;
  }
  // validación: siempre debe existir al menos un carril transitable
  if (st.every(x => x === 'block')) g.bad++;
  // monedas guía (marcan el carril seguro)
  if (coinLane === -1 && r() < 0.78) {
    const pref = [0, 1, 2].filter(l => st[l] === 'free'), alt = [0, 1, 2].filter(l => st[l] === 'jump' && g.obs.some(o => o.s === s && o.lane === l && o.t !== 'puddle'));
    if (pref.length && (r() < 0.6 || !alt.length)) { const l = pref[Math.floor(r() * pref.length)]; coinLine(g, l, s - 7, 6, 0.8); }
    else if (alt.length) { const l = alt[Math.floor(r() * alt.length)]; coinArc(g, l, s, v); }
  }
  // objetos entre filas
  const mid = s + len + gap * 0.5, ls = [0, 1, 2].sort(() => r() - 0.5), freeL = ls.find(l => spotOk(g, l, mid, 1));
  if (freeL !== undefined) {
    let it = null;
    if (g.cluesLeft > 0 && mid >= g.nextClue) { it = 'clue'; g.nextClue = mid + 1100 + r() * 700; g.cluesLeft--; }
    else if (mid >= g.nextGift) { it = 'gift'; g.nextGift = mid + 480 + r() * 420; }
    else if (s > 160 && r() < 0.05) it = pickW(r, [['magnet', 3], ['turbo', 1.6], ['x2', 2.2], ['shield', 1.8]]);
    if (it) g.items.push({ k: it, lane: freeL, x: (freeL - 1) * LW, s: mid, y: 1.0, alive: 1 });
  }
  const dz = Math.floor(mid / 1000) % ZONES.length;
  if (mid >= g.nextDel && DELK[dz] >= 0) {
    const ln = r() < 0.5 ? 0 : 2;
    if (spotOk(g, ln, mid, 0.5) && spotOk(g, ln, mid - 7, 0.5) && spotOk(g, ln, mid + 3, 0.5)) { g.dels.push({ s: mid, lane: ln, x: ln === 0 ? -4.35 : 4.35, k: r() < DELK[dz] ? 'casita' : 'buzon', v: Math.floor(r() * 3), done: 0, miss: 0 }); g.nextDel = mid + 105 + r() * 130; }
  }
  g.genS = s + len + gap;
}

function genScen(g) {
  const r = g.srng, s = g.scenS, zi = Math.floor(Math.max(0, s) / 1000) % ZONES.length, th = THEMES[zi];
  const Z0 = ZONES[zi], inTun = x => g.tuns.some(t => x >= t[0] - 8 && x <= t[1] + 8);
  if (Z0.tun && s > 300 && !inTun(s + 40) && s > (g.tuns.length ? g.tuns[g.tuns.length - 1][1] : 0) + 160 && r() < 0.06) { const a = s + 12, b = a + 70 + r() * 80; g.tuns.push([a, b]); for (const ps of [a, b]) g.scen.push({ k: 'portal', s: ps, x: 0, side: 1, ry: 0, sc: 1, v: 0, sh: 1, z: zi }); }
  if (g.tuns.length > 4) g.tuns.shift();
  const tn = g.tuns.find(t => s + 6 >= t[0] && s + 6 <= t[1]);
  if (tn) { g.scen.push({ k: 'tunnel', s: s + 6, x: 0, side: 1, ry: 0, sc: 1, v: 0, sh: 1, z: zi }); g.scenS += 6 + r() * 5; return; }
  if (th.sea) g.scen.push({ k: 'sea', s, x: 9.6, side: 1, ry: 0, sc: 1, v: 0, sh: 1, z: zi });
  if (th.rail) for (const sd of [-1, 1]) g.scen.push({ k: 'rail', s, x: sd * 5.45, side: sd, ry: 0, sc: 1, v: 0, sh: 1, z: zi });
  if (s >= g.nextGate - 14) { const ed = g.nextGate / 1000; g.scen.push({ k: 'gate', s: g.nextGate, x: 0, ry: 0, sc: 1, z: ed % ZONES.length, v: 0, sh: 1 }); g.nextGate += 1000; }
  for (const side of [-1, 1]) {
    const k = pickW(r, th.near);
    if (r() < 0.8) g.scen.push({ k, s: s + r() * 3, x: side * (k === 'bill' ? 7.2 : th.rail ? 5.6 : 6 + r() * 1.6), side, ry: k === 'bill' ? -side * 0.35 : r() * 6.28, sc: 0.85 + r() * 0.35, v: Math.floor(r() * 10), sh: 0.85 + r() * 0.25, z: zi });
    const f = pickW(r, th.sea && side > 0 ? [['boat', 1]] : th.far);
    if (r() < 0.75) g.scen.push({ k: f, s: s + r() * 4, x: side * (f === 'hill' ? 34 + r() * 20 : f === 'mount' ? 55 + r() * 30 : f === 'boat' ? 16 + r() * 26 : 12 + r() * 10), side, ry: f === 'bld' ? 0 : r() * 6.28, sc: f === 'bld' ? 1 : 0.9 + r() * 0.8, v: Math.floor(r() * 3), sh: 0.8 + r() * 0.3, z: zi, h: 0.7 + r() * 0.9, pi: r() < 0.5 ? 2 : 3 });
  }
  if (r() < FLOW[zi]) { const sd = r() < 0.5 ? -1 : 1; g.scen.push({ k: 'flowers', s: s + r() * 4, x: sd * (5.9 + r() * 2.6), side: sd, ry: r() * 6.28, sc: 0.8 + r() * 0.5, v: 0, sh: 0.9 + r() * 0.2, z: zi }); }
  g.scenS += 6 + r() * 5;
}

function genAhead(g) {
  while (g.genS < g.p.s + VIEW) genRow(g);
  while (g.scenS < g.p.s + VIEW + 10) genScen(g);
}

function groundAt(g, x, s, y) {
  let gnd = 0, hit = null;
  for (const o of g.obs) {
    if (!o.alive || o.fly || !(o.T.land || o.T.ramp)) continue;
    if (Math.abs(x - o.x) >= o.hw + PHW) continue;
    if (s + PHD < o.s - o.hd || s - PHD > o.s + o.hd) continue;
    const top = o.T.ramp ? clamp((s - (o.s - o.hd)) / (2 * o.hd), 0, 1) * o.y1 : o.y1;
    if (y >= top - STEP && top > gnd) { gnd = top; hit = o; }
  }
  g._gO = hit; return gnd;
}

const ev = (g, k, a) => { if (g.ev.length < 64) g.ev.push({ k, a }); };

function input(g, k) {
  const P = g.p, V = g.veh; if (!P.alive) return;
  if (k === 'L' || k === 'R') {
    const nl = clamp(P.lane + (k === 'L' ? -1 : 1), 0, 2);
    if (nl !== P.lane) { P.from = P.lane; P.lane = nl; ev(g, 'lane'); }
  } else if (k === 'U') {
    const jv = Math.sqrt(2 * GRAV * 1.55 * V.jmp);
    if (!P.air) { P.crouch = 0; P.air = true; P.airT = 0; P.vy = jv + Math.max(0, P.gv) * 0.5; P.jumps = 1; P.trickHit = 0; g.jumps++; ev(g, 'jump'); }
    else if (V.id === 'quad' && P.jumps < 2) { P.vy = jv * 0.85; P.jumps = 2; g.jumps++; ev(g, 'jump2'); }
  } else if (k === 'B') {
    P.boost = Math.min(1, P.boost + 0.13); g.boosts = (g.boosts || 0) + 1; ev(g, 'boost', P.boost);
  } else if (k === 'D') {
    if (P.air) { P.vy = Math.min(P.vy, -26); P.fastFall = 1; } else P.crouch = 0.62;
    ev(g, 'duck');
  }
}

function smash(g, o) {
  const P = g.p, r = g.rng;
  o.fly = { t: 0, vx: (o.x - P.x >= 0 ? 1 : -1) * (3 + r() * 4), vy: 7 + r() * 5, vz: P.v * 0.5, rx: (r() - 0.5) * 12, ry: (r() - 0.5) * 8, x: 0, y: 0, z: 0 };
  g.score += 20 * g.mult; ev(g, 'smash', o);
}
function die(g, o) {
  const P = g.p;
  if (P.shield) { P.shield = 0; P.inv = 1.2; if (o) smash(g, o); ev(g, 'shield'); return; }
  P.alive = false; P.deadT = 0; P.vy = 5; P.air = true; g.cause = o ? o.T.name : 'una caída'; g.causePat = o ? o.pat + (o.hitT === g.t && P.stumble > 0 ? '+tamb' : '') : '';
  g.cleanBest = Math.max(g.cleanBest, g.cleanS); ev(g, 'crash', o);
}
function stumble(g, o, bounce) {
  const P = g.p;
  if (P.stumble > 0) { die(g, o); return; }
  P.stumble = g.veh.id === 'scooter' ? 2.2 : 3.0; P.slow = 0.72; P.trickHit = 1;
  g.cleanBest = Math.max(g.cleanBest, g.cleanS); g.cleanS = 0;
  if (bounce) { const t = P.lane; P.lane = P.from; P.from = t; }
  ev(g, 'stumble', o);
}
function revive(g) {
  const P = g.p;
  for (const o of g.obs) if (o.s + o.hd > P.s - 3 && o.s - o.hd < P.s + 40) o.alive = 0;
  P.alive = true; P.inv = 2.5; P.stumble = 0; P.slow = 1; P.vy = 0; P.air = false; P.y = 0; P.gv = 0; P.crouch = 0;
  P.v = vEst(g, P.s) * 0.55; P.x = (P.lane - 1) * LW; g.revives++; ev(g, 'revive');
}

function step(g, dt, inp) {
  const P = g.p, V = g.veh;
  g.t += dt;
  if (!P.alive) { P.deadT += dt; P.vy -= GRAV * dt; P.y = Math.max(P.gy || 0, P.y + P.vy * dt); P.v *= Math.pow(0.08, dt); P.s += P.v * dt; return; }
  // tutorial: cámara lenta hasta que el jugador haga el gesto correcto
  if (g.tutWait) {
    const w = g.tutWait, ok = w.need === 'jump' ? P.air : w.need === 'duck' ? P.crouch > 0 : P.lane !== w.o.lane;
    if (ok || w.o.s - P.s < -2) { g.tutWait = null; g.ts = 1; ev(g, 'tutOk'); } else dt *= 0.18;
  }
  if (inp) input(g, inp);
  P.inv = Math.max(0, P.inv - dt); P.stumble = Math.max(0, P.stumble - dt); P.crouch = Math.max(0, P.crouch - dt);
  for (const k of ['magnet', 'turbo', 'x2']) if (P[k] > 0) { P[k] -= dt; if (P[k] <= 0) { P[k] = 0; if (k === 'turbo') P.inv = Math.max(P.inv, 1.5); ev(g, 'pEnd', k); } }
  // velocidad: v = (14 + 21·(1 − e^(−s/2600)))·vehículo  → de 14 a 35 m/s
  const base = vEst(g, P.s); P.slow = Math.min(1, P.slow + dt * 0.35);
  P.boost = Math.max(0, P.boost - dt * 0.24); P.sl = HILLD(P.s);
  const hk = V.id === 'long' && P.sl < 0 ? clamp(1 - 2.6 * P.sl, 1, 1.32) : hillK(P.sl);
  const tv = (base + Math.min(0.3 * base, 6.5) * P.boost) * (P.turbo > 0 ? 1.4 : 1) * P.slow * hk;
  P.v += (tv - P.v) * Math.min(1, dt * (P.v < tv ? 2.2 : 6));
  const s0 = P.s; P.s += P.v * dt; P.phase += P.v * dt;
  // lateral
  const tx = (P.lane - 1) * LW, dx = tx - P.x, lat = 13 * V.hnd * dt;
  P.x += Math.abs(dx) <= lat ? dx : Math.sign(dx) * lat;
  // vertical
  const gnd = groundAt(g, P.x, P.s, P.y), gO = g._gO; P.gy = gnd;
  if (P.air) {
    P.vy -= GRAV * dt; P.y += P.vy * dt; P.airT += dt;
    if (P.y <= gnd && P.vy <= 0) {
      P.y = gnd; P.vy = 0; P.air = false; P.gv = 0;
      if (P.fastFall) { P.crouch = 0.55; P.fastFall = 0; }
      if (P.airT > 0.42 && !P.trickHit) { const pts = Math.round((P.airT > 0.8 ? 60 : 30) * (V.id === 'skate' ? 2 : 1) * g.mult); g.score += pts; g.tricks++; ev(g, 'trick', pts); }
      P.jumps = 0; ev(g, 'land', P.airT);
    }
  } else {
    if (gnd >= P.y - 0.001) { P.gv = (gnd - P.y) / dt; P.y = gnd; }
    else { P.air = true; P.airT = 0; P.trickHit = 0; P.vy = Math.max(0, Math.min(P.gv, 14)); P.gv = 0; P.vy -= GRAV * dt; P.y += P.vy * dt; }
  }
  if (gO && gO.t === 'truck' && !gO.counted && !P.air) { gO.counted = 1; g.trucks++; ev(g, 'truck'); }
  // colisiones (barrido en z para que nada se atraviese a alta velocidad)
  const h = P.crouch > 0 ? PCH : PH, zA = Math.min(s0, P.s) - PHD, zB = Math.max(s0, P.s) + PHD, moving = Math.abs(tx - P.x) > 0.02;
  for (const o of g.obs) {
    if (!o.alive || o.fly) continue;
    if (o.T.moving) o.s = o.R - 0.3 * Math.min(70, o.R - P.s);
    const os0 = o.s - o.hd, os1 = o.s + o.hd;
    if (o.t === 'branch' && !o.passed && P.s - PHD > os1) { o.passed = 1; if (Math.abs(P.x - o.x) < o.hw && P.crouch > 0) { g.ducks++; ev(g, 'duckOk'); } }
    if (g.tut >= 0 && o.tut !== undefined && !o.tdone && os0 - P.s - PHD <= (TUT[o.tut].need === 'lane' ? P.v * 0.6 : P.v * 0.21 + 0.4) && os0 > P.s) { o.tdone = 1; g.tutWait = { need: TUT[o.tut].need, o }; ev(g, 'tut', o.tut); }
    if (zB < os0 || zA > os1) continue;
    if (Math.abs(P.x - o.x) >= o.hw + PHW) continue;
    if (g.t - o.hitT < 0.6) continue;
    const top = o.T.ramp ? clamp((P.s - os0) / (os1 - os0), 0, 1) * o.y1 : o.y1;
    const pb = P.y, pt = P.y + h;
    if (o.T.ground) { if (pb > top + 0.02) continue; }
    else {
      if (pt <= o.y0) continue;
      if ((o.T.land || o.T.ramp) ? pb >= top - STEP : pb >= top) continue;
    }
    // ¡contacto!
    o.hitT = g.t;
    if (P.turbo > 0) { if (!o.T.ramp) smash(g, o); continue; }
    if (P.inv > 0) continue;
    const frontal = o.T.moving || (s0 + PHD <= os0 + 0.06) || o.T.ground;
    if (o.T.ramp) { stumble(g, o, true); continue; }
    if (frontal) {
      if (o.T.minor) { if (o.t === 'puddle' && V.id === 'inline') { ev(g, 'splash', o); continue; } stumble(g, o, false); if (o.t === 'cone') smash(g, o); }
      else die(g, o);
    } else stumble(g, o, moving);
    if (!P.alive) return;
  }
  g.petSide = P.lane === 2 ? -1 : 1;
  // monedas
  const mul = g.mult * (P.x2 > 0 ? 2 : 1) * (V.id === 'bike' ? 1.15 : 1) * (1 + 0.5 * P.boost), magR = P.magnet > 0 ? 16 : 0;
  for (const c of g.coins) {
    if (!c.alive) continue;
    if (magR && !c.mag && c.s > P.s - 2 && c.s < P.s + magR) c.mag = 1;
    else if (g.pet && !c.mag && c.s > P.s && c.s < P.s + 3.2 && Math.sign(c.x - P.x) === g.petSide && Math.abs(c.x - P.x) < 2.6 && c.y < 2.2 + P.y) c.mag = 1;
    else if (V.id === 'euc' && !c.mag && c.s > P.s - 1 && c.s < P.s + 4.5 && Math.abs(c.x - P.x) < 2.3 && Math.abs(c.y - P.y - 0.9) < 1.6) c.mag = 1;
    if (c.mag) { const k = Math.min(1, dt * 14); c.x += (P.x - c.x) * k; c.y += (P.y + 0.9 - c.y) * k; c.s += (P.s + 0.2 - c.s) * k; }
    if (c.s > zA - 0.6 && c.s < zB + 0.6 && Math.abs(c.x - P.x) < 0.95 && c.y > P.y - 0.4 && c.y < P.y + h + 0.5) {
      c.alive = 0; g.coinsRun++; g.score += 10 * mul; ev(g, 'coin', c);
    }
  }
  for (const it of g.items) {
    if (!it.alive) continue;
    if (P.magnet > 0 && it.s > P.s - 1 && it.s < P.s + 10) { const k = Math.min(1, dt * 10); it.x += (P.x - it.x) * k; it.y += (P.y + 1 - it.y) * k; it.s += (P.s - it.s) * k; }
    if (it.s > zA - 0.8 && it.s < zB + 0.8 && Math.abs(it.x - P.x) < 1.05 && it.y > P.y - 0.6 && it.y < P.y + h + 0.6) { it.alive = 0; pickup(g, it); }
  }
  // entregas: lanza la revista al buzón si vas por el carril de ese lado
  for (const d of g.dels) {
    if (d.done || d.miss) continue;
    const ahead = d.s - P.s;
    if (ahead < P.v * 0.36 + 1 && Math.abs(P.x - (d.lane - 1) * LW) < 1.25) {
      d.done = 1; g.deliv++; g.dStreak++; g.dBest = Math.max(g.dBest, g.dStreak);
      const k2 = V.id === 'trike' ? 2 : 1; d.pts = Math.round(50 * mul * (1 + 0.1 * Math.min(10, g.dStreak - 1)) * k2); g.score += d.pts; g.coinsRun += 5 * k2;
      d.T = clamp(ahead / Math.max(P.v, 1), 0.15, 0.6); ev(g, 'deliver', d);
    } else if (ahead < -0.5) { d.miss = 1; if (g.dStreak > 0) ev(g, 'dmiss', d); g.dStreak = 0; }
  }
  // puntuación por distancia
  const ds = P.s - s0; g.score += ds * mul; g.cleanS += ds;
  const ed = Math.floor(P.s / 1000); if (ed > g.edition) { g.edition = ed; if (RAINY(ed)) g.rainSeen = 1; ev(g, 'zone', ed); }
  if (!g.tunSeen && g.tuns.length && g.tuns.some(t => P.s > t[0] + 5 && P.s < t[1])) g.tunSeen = 1;
  // limpieza y generación
  if ((g._cl = (g._cl || 0) + 1) % 30 === 0) {
    const cut = P.s - 18;
    g.obs = g.obs.filter(o => o.s + o.hd > cut && !(o.fly && o.fly.t > 2.5));
    g.coins = g.coins.filter(c => c.alive && c.s > cut);
    g.items = g.items.filter(i => i.alive && i.s > cut);
    g.dels = g.dels.filter(d => d.s > cut - 12);
    g.scen = g.scen.filter(sc => sc.s > cut - (sc.k === 'bld' || sc.k === 'hill' ? 30 : 0));
  }
  genAhead(g);
}

function pickup(g, it) {
  const P = g.p, r = g.rng;
  if (it.k === 'magnet' || it.k === 'turbo' || it.k === 'x2') { P[it.k] = g.dur[it.k]; g.powers++; ev(g, 'power', it.k); }
  else if (it.k === 'shield') { P.shield = 1; g.powers++; ev(g, 'power', 'shield'); }
  else if (it.k === 'clue') { g.clues++; ev(g, 'clue'); }
  else if (it.k === 'gift') {
    g.gifts++;
    const luck = g.luck * 0.03;
    const k = pickW(r, [['coins', 0.48 - luck], ['power', 0.22], ['star', 0.16 + luck], ['cos', 0.1 + luck * 0.5], ['big', 0.04 + luck * 0.5]]);
    let a;
    if (k === 'coins') a = 50 + Math.floor(r() * 5) * 25 + Math.floor(P.s / 100) * 5;
    else if (k === 'big') a = 500 + Math.floor(r() * 4) * 250;
    else if (k === 'power') { a = pickW(r, [['magnet', 1], ['turbo', 1], ['x2', 1], ['shield', 1]]); if (a === 'shield') P.shield = 1; else P[a] = g.dur[a]; g.powers++; }
    else if (k === 'star') { a = 1; g.starsRun += 1; }
    if (k === 'coins' || k === 'big') g.coinsRun += a;
    ev(g, 'gift', { k, a });
  }
}

/* ===== IA · el mismo bot juega en la portada y en las pruebas ===== */
function aiLane(g, l, h) {
  const P = g.p; let best = null;
  for (const o of g.obs) {
    if (!o.alive || o.fly || o.lane !== l || (o.t === 'puddle' && g.veh.id === 'inline')) continue;
    const front = o.s - o.hd - (P.s + PHD), back = o.s + o.hd - (P.s - PHD);
    if (back < 0 || front > h) continue;
    let need = o.T.need;
    if (need !== 'duck' && need !== 'ramp' && P.y >= o.y1 - 0.05) continue;
    if (need === 'ramp' && P.y >= o.y1 - 0.05) continue;
    if (!best || front < best.front) best = { o, front, need };
  }
  return best;
}
function aiThink(g, skill = 1) {
  const P = g.p; if (!P.alive) return null;
  const h = P.v * 1.2 + 8, info = [aiLane(g, 0, h), aiLane(g, 1, h), aiLane(g, 2, h)];
  const cost = info.map((f, l) => {
    let c = Math.abs(l - P.lane) * 0.7;
    if (f) {
      if (f.need === 'block') c += f.front < 0.5 ? 200 : f.front < P.v * 0.75 + 3 ? 60 + Math.max(0, 40 - f.front) : 5;
      else if (f.need === 'ramp') c += f.front < 0 && P.lane !== l ? 200 : -0.3;
      else c += f.need === 'jump' ? (f.o.T.minor ? 3 : 2) : 2.4;
      if (l !== P.lane && f.need !== 'ramp' && f.front < P.v * 0.42) c += 40;
      if (f.need !== 'block' && f.front < 0 && P.lane !== l) c += 150;
    }
    let n = 0; for (const cn of g.coins) if (cn.alive && cn.lane === l && cn.s > P.s && cn.s < P.s + 22) n++;
    for (const d of g.dels) if (!d.done && !d.miss && d.lane === l && d.s - P.s > 0 && d.s - P.s < 32) c -= 1.2;
    return c - Math.min(1.5, n * 0.18);
  });
  let bl = P.lane;
  for (let l = 0; l < 3; l++) if (cost[l] < cost[bl] - 0.25) bl = l;
  if (bl !== P.lane && Math.abs(bl - P.lane) === 2) { const mid = info[1]; if (mid && mid.need === 'block' && mid.front < P.v * 0.3) bl = P.lane; }
  const tx = (P.lane - 1) * LW;
  if (bl !== P.lane && Math.abs(P.x - tx) < 0.3) return bl < P.lane ? 'L' : 'R';
  const f = info[P.lane];
  if (f) {
    const lead = P.v * (0.2 + (1 - skill) * 0.08) + 0.35;
    if (f.need === 'jump' && !P.air && f.front <= lead && f.front > -0.3) return 'U';
    if (f.need === 'jump' && P.air && P.vy < 2 && !P.fastFall && f.front > 0.5) { const tl = (P.vy + Math.sqrt(P.vy * P.vy + 2 * GRAV * Math.max(0, P.y - P.gy))) / GRAV; if (f.front / P.v < tl + 0.16) return 'D'; }
    if (f.need === 'duck' && f.front <= P.v * 0.3 + 0.4 && P.crouch < 0.18 && f.front > -0.5) return 'D';
  }
  return null;
}

/* Simulación rápida sin render (bot de pruebas) */
function simulate(o) {
  const g = newGame({ seed: o.seed, veh: o.veh || 'scooter', ai: true, up: o.up, mult: 1, cluesLeft: 12, pet: o.pet });
  const maxT = o.maxT || 240; let n = 0, inp = null, errs = [];
  while (g.p.alive && g.t < maxT) {
    if (n % 3 === 0) inp = aiThink(g, o.skill == null ? 1 : o.skill); else inp = null;
    if (!inp && o.boost && n % 30 === 7) inp = 'B';
    step(g, DT, inp); n++;
    g.ev.length = 0;
    const P = g.p;
    if (!Number.isFinite(P.s + P.x + P.y + P.v + g.score)) { errs.push('NaN en estado a t=' + g.t.toFixed(2)); break; }
    if (g.obs.length > 400 || g.coins.length > 900 || g.scen.length > 500) { errs.push('fuga de objetos'); break; }
    if (P.y < -0.01 || P.y > 12) { errs.push('altura fuera de rango ' + P.y); break; }
    if (o.revive && !P.alive && g.revives < 1) { revive(g); }
  }
  return { seed: o.seed, veh: g.veh.id, dist: Math.round(g.p.s), t: +g.t.toFixed(1), score: Math.round(g.score), coins: g.coinsRun, cause: g.p.alive ? 'tiempo' : g.cause, pat: g.causePat || '', bad: g.bad, rows: g.rows, jumps: g.jumps, ducks: g.ducks, tricks: g.tricks, trucks: g.trucks, gifts: g.gifts, clues: g.clues, powers: g.powers, deliv: g.deliv, errs };
}
