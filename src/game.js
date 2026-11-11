/* ===== LÓGICA v2 · independiente del render (la usan el juego, la portada y el bot) =====
   Ciclovía de 4 carriles: 0-1 bajan (vienen de frente), 2-3 suben (tu sentido). */
const NL = 4, LW = 1.6, LX = l => (l - 1.5) * LW, LANES = [0, 1, 2, 3];
const GRAV = 42, DT = 1 / 120, PH = 1.7, PCH = 0.95, PHW = 0.32, PHD = 0.32, STEP = 0.36, VIEW = 190;
const rngOf = seed => { let a = (seed >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const pickW = (r, items) => { let tot = 0; for (const it of items) tot += Math.max(0, it[1]); let x = r() * tot; for (const it of items) { x -= Math.max(0, it[1]); if (x <= 0) return it[0]; } return items[items.length - 1][0]; };

/* need: qué hace falta para pasar · jump / duck / ramp / block. vault: a pie se salta solo (parkour). hard: choque que lesiona */
const OT = {
  rock: { hw: 0.62, hd: 0.5, y0: 0, y1: 0.85, fatal: 1, land: 1, need: 'jump', vault: 1, name: 'una roca' },
  cone: { hw: 0.34, hd: 0.3, y0: 0, y1: 0.62, minor: 1, need: 'jump', vault: 1, name: 'un cono' },
  barrier: { hw: 0.72, hd: 0.18, y0: 0, y1: 1.05, fatal: 1, need: 'jump', vault: 1, name: 'una valla de obra' },
  pothole: { hw: 0.64, hd: 0.7, y0: -0.3, y1: 0.12, fatal: 1, ground: 1, need: 'jump', name: 'un bache' },
  puddle: { hw: 0.68, hd: 1.3, y0: -0.2, y1: 0.1, minor: 1, ground: 1, need: 'jump', name: 'un charco' },
  branch: { hw: 0.8, hd: 0.35, y0: 1.12, y1: 2.7, fatal: 1, need: 'duck', name: 'una rama baja' },
  stall: { hw: 0.7, hd: 0.7, y0: 0, y1: 2.1, fatal: 1, land: 1, need: 'block', hard: 1, name: 'una caseta' },
  kiosk: { hw: 0.72, hd: 0.9, y0: 0, y1: 2.4, fatal: 1, land: 1, need: 'block', hard: 1, name: 'un kiosco' },
  truck: { hw: 0.74, hd: 7, y0: 0, y1: 2.4, fatal: 1, land: 1, need: 'block', hard: 1, name: 'un camión descargando' },
  ramp: { hw: 0.74, hd: 3, y0: 0, y1: 2.4, ramp: 1, need: 'ramp', name: 'una rampa' },
  jramp: { hw: 0.74, hd: 2, y0: 0, y1: 1.1, ramp: 1, need: 'ramp', name: 'una rampa' },
  gate: { hw: 0.76, hd: 0.15, y0: 1, y1: 1.2, minor: 1, need: 'gate', name: 'una talanquera' },
  bollard: { hw: 0.66, hd: 0.15, y0: 0, y1: 0.75, fatal: 1, need: 'jump', vault: 1, name: 'unos bolardos' },
  person: { hw: 0.3, hd: 0.3, y0: 0, y1: 1.7, fatal: 1, need: 'block', hard: 1, name: 'un peatón' },
  wall: { hw: 0.74, hd: 1, y0: 0, y1: 1.0, fatal: 1, need: 'block', hard: 1, name: 'el separador de la vía' },
  rail: { hw: 0.26, hd: 8, y0: 0, y1: 0.55, minor: 1, land: 1, need: 'jump', vault: 1, name: 'una baranda' },
  npc: { hw: 0.42, hd: 0.7, y0: 0, y1: 1.8, fatal: 1, need: 'block', moving: 1, hard: 1, name: 'otra persona' },
  car: { hw: 0.62, hd: 1.6, y0: 0, y1: 1.3, fatal: 1, need: 'block', moving: 1, hard: 1, name: 'un carro' },
  median: { hw: 0.2, hd: 50, y0: 0, y1: 0.9, fatal: 1, need: 'block', name: 'el separador de la bifurcación' },
  pad: { hw: 0.62, hd: 1.1, y0: 0, y1: 0.04, need: 'free', name: 'un impulsor' }
};
const NPCN = ['un ciclista', 'un corredor', 'una patinadora', 'un peatón', '', 'una moto'];
/* talanquera: barra que sube y baja (de pie si está alta, agachado a media altura, saltando si está baja) */
const gateY = (o, t) => o.fix || 0.95 + 1.45 * (0.5 + 0.5 * Math.sin(t * 1.7 + (o.ph || 0)));
/* clima: algunas ediciones llueven (mismo resultado en lógica y render) */
const RAINY = ed => ed > 0 && (Math.imul(ed + 7, 2654435761) >>> 0) % 4 === 1;
const EDGE = [['rock', 2], ['pothole', 1.5], ['puddle', 1], ['cone', 1], ['barrier', 1.2], ['bollard', 1.5], ['branch', 1.7], ['stall', 1.7], ['kiosk', 0.8], ['gate', 0.5]];
const MID = [['pothole', 2.2], ['puddle', 1], ['cone', 1.6], ['barrier', 1.4], ['bollard', 0.8], ['gate', 1], ['rock', 0.4]];
const SOFT = [['pothole', 2], ['cone', 1.5], ['barrier', 1.5], ['bollard', 1.2], ['gate', 1], ['puddle', 0.8]];
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
  { need: 'jump', msg: 'DESLIZA ↑ PARA SALTAR', pc: 'Flecha ↑ · W · Espacio' },
  { need: 'duck', msg: 'DESLIZA ↓ PARA AGACHARTE', pc: 'Flecha ↓ · S' },
  { need: 'lane', msg: 'DESLIZA ← → PARA ESQUIVAR', pc: 'Flechas ← → · A D' },
  { need: 'deliver', msg: 'TOCA EL BOTÓN ✉ PARA ENTREGAR', pc: 'Tecla E (derecha) · Q (izquierda)' }
];

const vEst = (g, s) => (14 + 21 * (1 - Math.exp(-s / 2600))) * (g.vs || g.veh.spd);
/* ¿se puede pasar de un carril a otro? (las bifurcaciones y los tramos angostos lo impiden) */
const forkAt = (g, s) => g.forks.find(f => s > f.a - 2 && s < f.b);
const narAt = (g, s) => g.nars.find(n => s > n.a - 2 && s < n.b), parkAt = (g, s) => g.parks.some(p => s > p[0] && s < p[1]);
const laneOk = (g, from, to, s) => { const f = forkAt(g, s); if (f && (from < 2) !== (to < 2)) return false; const n = narAt(g, s); return !(n && !n.open.includes(to)); };
/* Relieve: subidas y bajadas (el mismo perfil usa el shader) */
const HILL = s => { const e = clamp((s - 150) / 250, 0, 1); return e * (6.0 * Math.sin(s * 0.0105) + 2.2 * Math.sin(s * 0.027 + 1.7)); };
const HILLD = s => HILL(s + 0.5) - HILL(s - 0.5);
/* las subidas cuestan más a los vehículos de fuerza; las bajadas aceleran (toca frenar) */
const hillK = (g, sl) => { const v = g.veh; if (v.id === 'long' && sl < 0) return clamp(1 - 2.8 * sl, 1, 1.4); if (v.id === 'ebike' && sl > 0) return 1; return v.kind === 'h' ? clamp(1 - 2.0 * sl, 0.72, 1.3) : clamp(1 - sl, 0.86, 1.24); };
const FLOW = ZORD.map(i => [0.6, 0.6, 0.2, 0.4, 0.3, 0.6, 0.35, 0.2, 0.3, 0.5, 0][i]);
const DELK = ZORD.map(i => [0.6, 0.7, 0.3, 0.4, 0.3, 0.6, 0.3, 0.45, 0.6, 0.85, -1][i]);
const diffAt = s => clamp((s - 150) / 6500, 0, 1);
/* semáforos de los cruces: verde, amarillo, rojo (en rojo cruzan carros) */
const TG = 6.5, TY = 1.3, TR = 4.6, CYC = TG + TY + TR;
const lightP = (X, t) => ((t + X.off) % CYC + CYC) % CYC;
const lightAt = (X, t) => { const p = lightP(X, t); return p < TG ? 0 : p < TG + TY ? 1 : 2; };
function crossCars(X, t, out) {
  out.length = 0; const tr = lightP(X, t) - (TG + TY); if (tr < 0) return out;
  for (let row = 0; row < 2; row++) for (let i = 0; i < 3; i++) {
    const dtc = tr - (0.2 + i * 0.9 + row * 0.45); if (dtc < 0 || dtc > 2.3) continue;
    const dir = row ? -1 : 1; out.push({ x: dir * (-15 + 13 * dtc), s: X.s + (row ? 2.2 : -2.2), dir, col: (X.id + i + row * 2) % 4, moto: (X.id + i) % 5 === 0 });
  }
  return out;
}
const DEL = { per: [40, 3, 'periódico'], rev: [50, 4, 'revista'], cor: [60, 5, 'correo'], pos: [80, 6, 'póster'], kio: [160, 15, 'paquete'] };
const WOB = { T: { name: 'la bajada sin frenar' }, pat: 'bajada' }, CARX = { T: { name: 'un carro del cruce', hard: 1 }, pat: 'cruce' }, DOG = { T: { name: 'un perro bravo' }, pat: 'perro' };

function newGame(o) {
  const v = VEHI[o.veh] || VEH[0], up = o.up || {}, K = o.perks || {}, bat = v.id === 'escooter' ? 1.35 : 1, fit = clamp(o.fit == null ? 30 : o.fit, 0, 100), inj = o.inj || 0, hum = v.kind === 'h';
  const g = {
    seed: o.seed >>> 0, rng: rngOf(o.seed), srng: rngOf((o.seed >>> 0) * 7 + 3), xr: rngOf((o.seed >>> 0) * 13 + 5), veh: v, demo: !!o.demo, ai: !!o.ai, t: 0, perks: K,
    street: v.street ? 1 : 0, vault: v.id === 'foot' || v.id === 'jetpack', maxJ: v.id === 'jetpack' ? 4 : (v.id === 'quad' || (K.parkour && hum)) ? 2 : 1,
    p: { s: 0, x: LX(2), lane: 2, from: 2, laneT: -9, y: 0, vy: 0, gv: 0, gy: 0, v: 0, air: false, airT: 0, crouch: 0, fastFall: 0, jumps: 0, stumble: 0, slow: 1, inv: 0, alive: true, deadT: 0,
      magnet: 0, turbo: 0, x2: 0, glide: 0, shield: v.id === 'auto' ? 1 : 0, boost: 0, sl: 0, trickHit: 0, phase: 0, brake: 0, en: 0, tapT: 9, over: 0, trN: 0, trT: 9, grind: 0, grT: 0, inPark: 0 },
    obs: [], coins: [], items: [], scen: [], ev: [], lf: [0, 0, 0, 0], resv: [0, 0, 0, 0], sideBusy: [0, 0],
    xs: [], crs: [], nars: [], parks: [], shops: [], forks: [], fork: null, evt: o.evt || '', vs: v.spd * (1 + 0.02 * ((o.vup || {}).v || 0)), hk: v.hnd * (1 + 0.05 * ((o.vup || {}).h || 0)), pads: 0, forksN: 0, nar: null, park: null, pol: null, riv: null, _cars: [],
    genS: 42, scenS: -30, nextGate: 1000, nextSeg: 520, segI: 0, nextCrit: 640, nextRiv: 850, nextKio: 420,
    dels: [], deliv: 0, perf: 0, dStreak: 0, dBest: 0, nextDel: 105, stolen: 0, tuns: [], pet: !!o.pet, petSide: 1, edition: 0, score: 0, coinsRun: 0, starsRun: 0, clues: 0, gifts: 0, jumps: 0, ducks: 0, tricks: 0, powers: 0, trucks: 0,
    cleanS: 0, cleanBest: 0, revives: 0, cause: '', hard: 0, mult: o.mult || 1, bad: 0, rows: 0, combo: 1, comboT: 0, comboCap: 2 + 0.03 * (o.skill || 0),
    near: 0, vaults: 0, grindM: 0, parkTr: 0, boosts: 0, crossN: 0, redRuns: 0, civic: 0, fines: 0, escapes: 0, dodges: 0, duels: 0, rivLost: 0, critOk: 0, overT: 0, rivLv: o.rivLv || 0,
    enMax: (hum ? (0.45 + 0.55 * fit / 100) * (K.pulmon ? 1.3 : 1) * (1 - 0.12 * inj) : v.id === 'moped' ? 1.5 : 1) * (1 + 0.08 * (up.en || 0)),
    enRegen: hum ? (0.05 + 0.08 * fit / 100) * (K.pulmon ? 1.3 : 1) : 0.025, enCost: hum ? 0.07 : 0.05,
    bmax: v.boost * (1 + 0.06 * ((o.vup || {}).b || 0)) * (1 + 0.07 * (up.rue || 0)) * (hum ? (0.6 + 0.4 * fit / 100) * (1 - 0.05 * inj) : 1),
    brakeDec: 16 * (1 + 0.08 * (up.fre || 0)) * (K.freno ? 1.4 : 1), delK: 1 + 0.06 * (up.mor || 0),
    dur: { magnet: (8 + 2 * (up.magnet || 0)) * bat, turbo: (4.5 + (up.turbo || 0)) * bat, x2: (10 + 3 * (up.x2 || 0)) * bat, glide: 6 * bat }, letters: o.letters || '', nextLetter: 260, glides: 0,
    luck: up.gift || 0, nextGift: 380, nextClue: 320, cluesLeft: o.cluesLeft || 0, tut: o.tut ? 0 : -1, tutWait: null
  };
  g.p.en = g.enMax; genAhead(g);
  return g;
}

function addOb(g, t, lane, s, extra) {
  const T = OT[t]; const o = { pat: g._kind, t, T, lane, x: LX(lane), s, R: s, hd: T.hd, hw: T.hw, y0: T.y0, y1: T.y1, alive: 1, hitT: -9, passed: 0, fly: null };
  if (extra) Object.assign(o, extra);
  g.obs.push(o); g.lf[lane] = Math.max(g.lf[lane], o.s + o.hd); return o;
}
// ¿hay espacio libre para una moneda/objeto en (carril, s, y)?
function spotOk(g, lane, s, y) {
  if (s < g.resv[lane] && y < 2.2) return false;
  for (const o of g.obs) {
    if (o.lane !== lane || !o.alive || o.t === 'median' || o.t === 'pad') continue;
    if (o.T.moving) { if (Math.abs(s - o.R) < 16) return false; continue; }
    if (s > o.s - o.hd - 0.8 && s < o.s + o.hd + 0.8) {
      if (o.T.ramp) continue;
      if (y < o.y1 + 0.35 && y + 0.5 > o.y0) return false;
    }
  }
  return true;
}
function addCoin(g, lane, s, y) { if (spotOk(g, lane, s, y)) g.coins.push({ lane, x: LX(lane), s, y, alive: 1, mag: 0 }); }
function coinLine(g, lane, s0, n, y, sp = 2.4) { for (let i = 0; i < n; i++) addCoin(g, lane, s0 + i * sp, y); }
function coinArc(g, lane, sc, v, y0 = 0) {
  const vy = Math.sqrt(2 * GRAV * 1.5), T = 2 * vy / GRAV, D = v * T;
  for (let i = -3; i <= 3; i++) { const d = i / 3 * D / 2, t = (d + D / 2) / v; addCoin(g, lane, sc + d, y0 + 0.8 + Math.max(0, vy * t - GRAV * t * t / 2)); }
}
/* gente y tráfico en movimiento: u = velocidad real (m/s), negativa si viene de frente */
function addNpc(g, lane, s, nk) {
  const P = g.p, r = g.rng, on = lane < 2, vx = Math.max(P.v, 0.85 * vEst(g, P.s)), T = Math.max(0.5, (s - P.s) / vx);
  const car = g.street && nk !== 5, sp = g.street ? (on ? 0.55 : 0.5) * vEst(g, s) : [6.5 + r() * 2, 3 + r(), 4.6 + r(), 1.3 + r() * 0.4][nk];
  const u = on ? -sp : sp, s0 = s - u * T;
  if (on ? g.lf[lane] > s - 45 : g.lf[lane] > s0 - 3) return null;
  if (s < g.resv[lane]) return null;
  const o = addOb(g, car ? 'car' : 'npc', lane, s0, { u, R: s, nk: car ? 4 : nk, col: Math.floor(r() * 4) });
  if (!car) { o.name = NPCN[nk]; if (nk === 5) { o.hd = 0.9; o.y1 = 1.5; } }
  g.lf[lane] = Math.max(g.lf[lane] - 0, 0); g.resv[lane] = Math.max(g.resv[lane], on ? s0 + 6 : s + 40);
  return o;
}

/* cruce con semáforo, tramo angosto o zona libre de trucos */
function genSeg(g) {
  const r = g.rng, s = g.genS, kinds = g.street ? ['cross', 'fork', 'narrow', 'cross'] : ['cross', 'fork', 'narrow', 'cross', 'park', 'fork'], k = kinds[g.segI % kinds.length];
  const tunB = (a, b) => g.tuns.find(t => b > t[0] - 15 && a < t[1] + 15);
  if (k === 'park' || k === 'cross') { const tb = tunB(s, s + 240); if (tb) { g.nextSeg = tb[1] + 25; return; } }
  if (k === 'fork') {
    const a = s + 44, L = 150 + r() * 80, b = a + L;
    if (g.resv[1] > a - 4 || g.resv[2] > a - 4) { g.nextSeg = Math.max(g.resv[1], g.resv[2]) + 6; return; }
    addOb(g, 'median', 1, a + L / 2, { x: 0, hd: L / 2 });
    g.fork = { a, b, dl: r() < 0.5 ? 0 : 1 }; g.forks.push(g.fork); g.forksN++; g.nextDel = Math.min(g.nextDel, a + 12);
    g.genS = a + 10; g.nextSeg = b + 380 + r() * 260; g.segI++; return;
  }
  if (k === 'cross') {
    const C = s + 32; g.xs.push({ s: C, off: r() * CYC, id: g.xs.length + g.segI, pass: 0, wait: 0 }); g.sideBusy[0] = g.sideBusy[1] = C + 14;
    g.genS = C + 16; g.nextSeg = g.genS + 380 + r() * 260; g.segI++; return;
  }
  if (k === 'narrow') {
    const a = s + 36, L = 90 + r() * 70, b = a + L, d = diffAt(s);
    const open = pickW(r, [[[1, 2], 3], [[2, 3], 3], [[0, 1], 1.5], [[2], d > 0.15 ? 1.6 : 0], [[1], d > 0.3 ? 1 : 0]]);
    const closed = LANES.filter(l => !open.includes(l));
    if (closed.some(l => g.resv[l] > a - 4)) { g.nextSeg = Math.max(...closed.map(l => g.resv[l])) + 6; return; }
    for (const l of closed) addOb(g, 'wall', l, a + L / 2, { hd: L / 2 });
    g.nar = { a, b, open }; g.nars.push(g.nar); g.sideBusy[0] = g.sideBusy[1] = Math.max(g.sideBusy[0], a);
    g.genS = a + 8; g.nextSeg = b + 380 + r() * 260; g.segI++; return;
  }
  const a = s + 22, b = a + 190; g.park = [a, b]; g.parks.push(g.park); g.genS = a + 6; g.nextSeg = b + 420 + r() * 260; g.segI++;
}

function genRow(g) {
  const r = g.rng, s = g.genS, d = diffAt(s), v = vEst(g, s) * hillK(g, HILLD(s)), rain = RAINY(Math.floor(s / 1000));
  const tg = lerp(1.25, 0.78, d), gap = Math.max(11, v * tg) * (1 + r() * 0.35);
  const st = ['free', 'free', 'free', 'free'];
  let len = 0, coinLane = -1, kind;
  g.rows++;
  const rl = () => Math.floor(r() * NL), wRain = p => rain ? p.map(j => j[0] === 'puddle' ? ['puddle', 3.5] : j) : p;
  const pool = l => { let p = wRain(l === 0 || l === 3 ? EDGE : MID); if (g.street) p = p.filter(j => j[0] !== 'branch' && j[0] !== 'gate'); return p; };
  const place = (t, l, ds = 0) => {
    if (s + ds < g.resv[l]) return false;
    if (t === 'branch') { addOb(g, 'branch', l, s + ds, { vis: { side: l < 2 ? -1 : 1, lanes: [l] } }); st[l] = 'duck'; }
    else if (t === 'stall') {
      addOb(g, 'stall', l, s + ds, { v: Math.floor(r() * 3) }); st[l] = 'block';
      addOb(g, 'person', l, s + ds - 1.5, { v: Math.floor(r() * 4), ry: 0 });
      const l2 = l === 0 ? 1 : 2; if (r() < 0.3 && st[l2] === 'free' && s >= g.resv[l2] && st.filter(x => x !== 'block').length > 2) { addOb(g, 'person', l2, s + ds - 0.4, { v: Math.floor(r() * 4), ry: l === 0 ? -1.2 : 1.2 }); st[l2] = 'block'; }
    } else { addOb(g, t, l, s + ds, t === 'gate' ? { ph: r() * 6.28 } : null); st[l] = OT[t].need; }
    return true;
  };
  // tutorial: una cosa a la vez
  if (g.tut >= 0 && g.tut < TUT.length) {
    const i = g.tut;
    if (i === 0) addOb(g, 'rock', 2, s).tut = 0;
    else if (i === 1) addOb(g, 'gate', 2, s, { fix: 1.3 }).tut = 1;
    else if (i === 2) { const o = addNpc(g, 2, s, 3); if (o) o.tut = 2; }
    else g.dels.push({ s, side: 1, k: 'rev', obj: 'casita', v: 0, done: 0, miss: 0, tut: 3 });
    g.tut++; g.genS = s + 32; coinLine(g, 3, s - 10, 5, 0.8); return;
  }
  if (s >= g.nextSeg && !g.nar && !g.park) { genSeg(g); if (g.genS !== s) return; }
  let nar = g.nar, park = g.park, fork = g.fork;
  if (fork && s > fork.b - 6) { g.fork = fork = null; g.genS = s + 12; return; }
  if (nar && s > nar.b - 4) { g.nar = nar = null; g.genS = s + 12; return; }
  if (park && s > park[1] - 8) { g.park = park = null; g.genS = s + 10; return; }
  if (nar) {
    const op = nar.open; g._kind = 'angosto';
    if (op.length === 1) { if (r() < 0.7) place(pickW(r, wRain(SOFT)), op[0]); else coinLine(g, op[0], s - 5, 6, 0.8); }
    else {
      const k = pickW(r, [['one', 4.5], ['both', 2], ['npc', s > 250 ? 2 : 0], ['coins', 1.5]]);
      if (k === 'one') place(pickW(r, wRain(SOFT.concat([['rock', 1]]))), op[Math.floor(r() * 2)]);
      else if (k === 'both') { place(pickW(r, wRain(SOFT)), op[0]); place(pickW(r, wRain(SOFT)), op[1]); }
      else if (k === 'npc') { const l = op[Math.floor(r() * 2)]; if (addNpc(g, l, s, Math.floor(r() * 4))) st[l] = 'block'; }
      const fl = op.filter(l => st[l] === 'free'); if (fl.length && r() < 0.8) coinLine(g, fl[Math.floor(r() * fl.length)], s - 6, 6, 0.8);
    }
    coinLane = -2;
  } else if (fork) {
    // bifurcación: una rama de ENTREGAS (marcada) y otra de IMPULSO con impulsores, barandas y rampas
    g._kind = 'bifurcación'; const D = fork.dl ? [2, 3] : [0, 1], O = fork.dl ? [0, 1] : [2, 3];
    if (r() < 0.5) place(pickW(r, wRain(SOFT)), D[Math.floor(r() * 2)]);
    const k = pickW(r, [['pad', 3.2], ['rail', 1.4], ['jramp', 1.1], ['obs', 1.8]]), l = O[Math.floor(r() * 2)];
    if (k === 'pad') { addOb(g, 'pad', l, s); coinLine(g, l, s + 3, 4, 0.8); }
    else if (k === 'rail' && !g.street) { const L = 12 + r() * 6; addOb(g, 'rail', l, s + L / 2, { hd: L / 2 }); coinLine(g, l, s + 1.5, Math.floor(L / 2.4) - 1, 1.35); len = L; }
    else if (k === 'jramp' && !g.street) { addOb(g, 'jramp', l, s); const vy = 0.275 * v, T = (vy + Math.sqrt(vy * vy + 2 * GRAV * 1.1)) / GRAV; for (let i = 1; i <= 6; i++) { const t = i / 7 * T; addCoin(g, l, s + 2 + v * t, 1.8 + vy * t - GRAV * t * t / 2); } len = v * T + 4; }
    else place(pickW(r, wRain(SOFT)), l);
    const fl = D.filter(q => st[q] === 'free'); if (fl.length) coinLine(g, fl[Math.floor(r() * fl.length)], s - 6, 5, 0.8);
    coinLane = -2;
  } else if (park) {
    g._kind = 'parque'; const k = pickW(r, [['jramp', 4], ['rail', 4], ['cones', 1], ['coins', 1], ['walk', 1.6]]), l = rl();
    if (k === 'walk') { if (addNpc(g, l, s, 3)) st[l] = 'block'; else coinLine(g, l, s - 4, 6, 0.8); }
    if (k === 'jramp') { addOb(g, 'jramp', l, s); st[l] = 'ramp'; const vy = 0.275 * v, T = (vy + Math.sqrt(vy * vy + 2 * GRAV * 1.1)) / GRAV; for (let i = 1; i <= 6; i++) { const t = i / 7 * T; addCoin(g, l, s + 2 + v * t, 1.8 + vy * t - GRAV * t * t / 2); } len = v * T + 4; }
    else if (k === 'rail') { const L = 16 + r() * 10; addOb(g, 'rail', l, s + L / 2, { hd: L / 2 }); coinLine(g, l, s + 1.5, Math.floor(L / 2.4) - 1, 1.35); len = L; }
    else if (k === 'cones') { place('cone', l); place('cone', (l + 2) % NL); }
    else if (k === 'walk') { /* paseantes */ }
    else coinLine(g, l, s - 4, 8, 0.8);
    coinLane = -2;
  } else {
    kind = pickW(r, [
      ['single', 2.2 - 1.2 * d], ['double', 1 + 1.5 * d], ['triple', d > 0.1 ? 0.5 + 2 * d : 0], ['quad', d > 0.3 ? 0.3 + 1.2 * d : 0],
      ['npc', s > 230 ? 1.8 + 2.4 * d : 0], ['truck', s > 300 ? 0.75 : 0], ['jramp', s > 200 ? 0.4 : 0], ['rail', s > 350 && !g.street ? 0.5 : 0],
      ['slalom', 0.45], ['breather', Math.max(0.15, 0.6 - 0.5 * d)]
    ]);
    g._kind = kind;
    if (kind === 'npc') {
      const n = 1 + (r() < 0.35 + 0.5 * d ? 1 : 0) + (r() < d * 0.6 ? 1 : 0), ls = LANES.slice().sort(() => r() - 0.5); let c = 0;
      for (const l of ls) { if (c >= n) break; const nk = g.street ? (r() < 0.35 ? 5 : 4) : pickW(r, [[0, 4], [1, g.evt === 'maraton' ? 8 : 2.5], [2, 2], [3, 1.5]]); if (addNpc(g, l, s, nk)) { st[l] = 'block'; c++; } }
      if (!c) kind = 'single';
      else if (d > 0.3 && r() < 0.5) { const f = LANES.filter(l => st[l] === 'free'); if (f.length > 1) { const l = f[Math.floor(r() * f.length)]; place(pickW(r, pool(l).filter(j => OT[j[0]].need !== 'block')), l); } }
    }
    if (kind === 'single') { const l = rl(); place(pickW(r, pool(l)), l); }
    else if (kind === 'double' || kind === 'triple') { const n = kind === 'double' ? 2 : 3, ls = LANES.slice().sort(() => r() - 0.5).slice(0, n); for (const l of ls) if (st[l] === 'free') place(pickW(r, pool(l)), l); }
    else if (kind === 'quad') {
      for (const l of LANES) if (st[l] === 'free') place(pickW(r, pool(l)), l);
      if (st.every(x => x === 'block')) { const l = 1 + Math.floor(r() * 2); g.obs = g.obs.filter(o => !(o.lane === l && Math.abs(o.s - s) < 2 && !o.T.moving)); st[l] = 'free'; place(pickW(r, wRain(SOFT)), l); }
    } else if (kind === 'truck') {
      const l = r() < 0.5 ? 0 : 3, sd = l === 0 ? 0 : 1;
      if (s < g.resv[l] || g.sideBusy[sd] > s - 6) { place(pickW(r, pool(l)), l); }
      else {
        const ramp = !g.street && r() < 0.55;
        if (ramp) { addOb(g, 'ramp', l, s); st[l] = 'ramp'; coinLine(g, l, s + 4.5, 5, 3.2); } else st[l] = 'block';
        addOb(g, 'truck', l, s + 10, { col: Math.floor(r() * 3) }); g.shops.push({ s: s + 10, side: l === 0 ? -1 : 1, v: Math.floor(r() * 3) }); g.sideBusy[sd] = s + 22;
        const l2 = l === 0 ? 1 : 2; if (r() < 0.3 && s + 6 >= g.resv[l2]) addOb(g, 'person', l2, s + 6 + r() * 6, { v: Math.floor(r() * 4), ry: l === 0 ? -1.4 : 1.4 });
        len = 17;
      }
    } else if (kind === 'jramp') {
      const l = 1 + Math.floor(r() * 2);
      if (s >= g.resv[l]) {
        addOb(g, 'jramp', l, s); st[l] = 'ramp';
        const vy = 0.275 * v, T = (vy + Math.sqrt(vy * vy + 2 * GRAV * 1.1)) / GRAV;
        for (let i = 1; i <= 6; i++) { const t = i / 7 * T; addCoin(g, l, s + 2 + v * t, 1.1 + vy * t - GRAV * t * t / 2 + 0.7); }
        len = v * T + 4;
      }
    } else if (kind === 'rail') {
      const l = rl(), L = 14 + r() * 8;
      if (s >= g.resv[l]) { addOb(g, 'rail', l, s + L / 2, { hd: L / 2 }); st[l] = 'jump'; coinLine(g, l, s + 1.5, Math.floor(L / 2.4) - 1, 1.35); len = L; coinLane = -2; }
    } else if (kind === 'slalom') {
      const dir = r() < 0.5 ? 1 : -1, t = d > 0.35 ? 'barrier' : 'cone', sp = Math.max(8, v * 0.55);
      for (let k = 0; k < 4; k++) { const free = dir > 0 ? k : 3 - k; for (const l of LANES) if (l !== free && s + k * sp >= g.resv[l]) addOb(g, t, l, s + k * sp); coinLine(g, free, s + k * sp - 1.2, 2, 0.8); }
      st[0] = st[1] = st[2] = st[3] = 'jump'; coinLane = -2; len = 3 * sp;
    } else if (kind === 'breather') { coinLine(g, rl(), s - 6, 8, 0.8); coinLane = -2; }
  }
  // validación: siempre debe existir al menos un carril transitable
  const live = nar ? nar.open : LANES;
  if (live.every(l => st[l] === 'block')) { const fx = live.find(l => !g.obs.some(o => o.lane === l && o.T.moving && Math.abs(o.R - s) < 3)); if (fx !== undefined) { g.obs = g.obs.filter(o => !(o.lane === fx && !o.T.moving && o.t !== 'wall' && o.t !== 'median' && o.s > s - 3 && o.s < s + len + 3)); st[fx] = 'free'; } }
  if (live.every(l => st[l] === 'block')) { g.bad++; g.badK = (g.badK || '') + g._kind + '@' + Math.round(s) + ' '; }
  // monedas guía (marcan el carril seguro)
  if (coinLane === -1 && r() < 0.78) {
    const pref = LANES.filter(l => st[l] === 'free'), alt = LANES.filter(l => st[l] === 'jump' && g.obs.some(o => o.s === s && o.lane === l && o.t !== 'puddle'));
    if (pref.length && (r() < 0.6 || !alt.length)) coinLine(g, pref[Math.floor(r() * pref.length)], s - 7, 6, 0.8);
    else if (alt.length) coinArc(g, alt[Math.floor(r() * alt.length)], s, v);
  }
  // objetos, animales y entregas entre filas
  const mid = s + len + gap * 0.5, ojo = g.perks.ojo ? 0.6 : 1, ls = live.slice().sort(() => r() - 0.5), freeL = ls.find(l => spotOk(g, l, mid, 1));
  const nearX = g.xs.some(X => Math.abs(X.s - mid) < 16);
  if (mid >= g.nextCrit && !nar && !park && !nearX && gap > 12) {
    const k = pickW(r, [['dog', 3], ['cat', 2.5], ['duck', 2.5]]), dir = r() < 0.5 ? 1 : -1;
    g.crs.push({ s: mid, kind: k, dir, v: k === 'dog' ? 4.2 : k === 'cat' ? 5 : 1.9, hw: k === 'duck' ? 0.9 : 0.35, x0: -dir * 4.7, x: -dir * 4.7, t0: -1, trig: 38 + v * 0.8, name: k === 'dog' ? 'un perrito que cruzaba' : k === 'cat' ? 'un gato que cruzaba' : 'una familia de patos', done: 0, hit: 0 });
    g.nextCrit = mid + 430 + r() * 420;
  } else if (freeL !== undefined) {
    let it = null;
    if (g.letters && mid >= g.nextLetter) { it = 'letter'; g.nextLetter = mid + (550 + r() * 350) * ojo * (g.evt === 'libro' ? 0.7 : 1); }
    else if (g.cluesLeft > 0 && mid >= g.nextClue) { it = 'clue'; g.nextClue = mid + (900 + r() * 600) * ojo * (g.evt === 'libro' ? 0.5 : 1); g.cluesLeft--; }
    else if (mid >= g.nextGift) { it = 'gift'; g.nextGift = mid + (480 + r() * 420) * (g.evt === 'pulgas' ? 0.55 : 1); }
    else if (s > 160 && r() < 0.05) it = pickW(r, [['magnet', 3], ['turbo', 1.6], ['x2', 2.2], ['shield', 1.8], ['glide', g.evt === 'cometas' ? 7 : 2.3]]);
    if (it) g.items.push({ k: it, lane: freeL, x: LX(freeL), s: mid, y: 1.0, alive: 1, ch: it === 'letter' ? g.letters[0] : null });
  }
  const dz = Math.floor(mid / 1000) % ZONES.length;
  if (mid >= g.nextDel && DELK[dz] >= 0 && !park && !nearX) {
    const fk = forkAt(g, mid), side = fk ? (fk.dl ? 1 : -1) : r() < 0.5 ? -1 : 1, sb = side < 0 ? 0 : 1, wl = side < 0 ? 0 : 3;
    if (g.sideBusy[sb] < mid - 7 && !(nar && !nar.open.includes(wl) && false)) {
      let k = mid >= g.nextKio ? 'kio' : pickW(r, [['per', 3], ['rev', 3], ['cor', 2.5], ['pos', 1.8]]);
      if (k === 'kio') g.nextKio = mid + 600 + r() * 300;
      const obj = k === 'kio' ? 'kiosko' : k === 'pos' ? 'muro' : k === 'cor' ? 'buzon' : k === 'per' ? 'casita' : (r() < DELK[dz] ? 'casita' : 'buzon');
      g.dels.push({ s: mid, side, k, obj, v: Math.floor(r() * 3), done: 0, miss: 0, dog: obj === 'casita' && r() < 0.14 ? 1 : 0 });
      g.sideBusy[sb] = mid + 5; g.nextDel = mid + (fk ? 26 + r() * 14 : 55 + r() * 70);
    }
  }
  g.genS = s + len + gap;
}

function genScen(g) {
  const r = g.srng, s = g.scenS, zi = Math.floor(Math.max(0, s) / 1000) % ZONES.length, th = THEMES[zi];
  const Z0 = ZONES[zi], inTun = x => g.tuns.some(t => x >= t[0] - 8 && x <= t[1] + 8);
  if (Z0.tun && s > 300 && !inTun(s + 40) && !g.parks.some(p => p[1] > s - 20 && p[0] < s + 175) && !g.xs.some(X => X.s > s - 20 && X.s < s + 175) && s > (g.tuns.length ? g.tuns[g.tuns.length - 1][1] : 0) + 160 && r() < 0.06) { const a = s + 12, b = a + 70 + r() * 80; g.tuns.push([a, b]); for (const ps of [a, b]) g.scen.push({ k: 'portal', s: ps, x: 0, side: 1, ry: 0, sc: 1, v: 0, sh: 1, z: zi }); }
  if (g.tuns.length > 4) g.tuns.shift();
  const tn = g.tuns.find(t => s + 6 >= t[0] && s + 6 <= t[1]);
  if (tn) { g.scen.push({ k: 'tunnel', s: s + 6, x: 0, side: 1, ry: 0, sc: 1, v: 0, sh: 1, z: zi }); g.scenS += 6 + r() * 5; return; }
  if (th.sea) g.scen.push({ k: 'sea', s, x: 9.6, side: 1, ry: 0, sc: 1, v: 0, sh: 1, z: zi });
  if (th.rail) for (const sd of [-1, 1]) g.scen.push({ k: 'rail', s, x: sd * 5.45, side: sd, ry: 0, sc: 1, v: 0, sh: 1, z: zi });
  if (s >= g.nextGate - 14) { const ed = g.nextGate / 1000; g.scen.push({ k: 'gate', s: g.nextGate, x: 0, ry: 0, sc: 1, z: ed % ZONES.length, v: 0, sh: 1 }); g.nextGate += 1000; }
  for (const side of [-1, 1]) {
    const k = pickW(r, th.near);
    if (r() < 0.8) g.scen.push({ k, s: s + r() * 3, x: side * (k === 'bill' ? 7.2 : th.rail ? 5.6 : 6 + r() * 1.6), side, ry: k === 'bill' ? -side * 0.35 : r() * 6.28, sc: 0.85 + r() * 0.35, v: k === 'bill' && g.evt && r() < 0.5 ? EVT.find(e => e.id === g.evt).bill : Math.floor(r() * 14), sh: 0.85 + r() * 0.25, z: zi, nr: 1 });
    const f = pickW(r, th.sea && side > 0 ? [['boat', 1]] : th.far);
    if (r() < 0.75) g.scen.push({ k: f, s: s + r() * 4, x: side * (f === 'hill' ? 34 + r() * 20 : f === 'mount' ? 55 + r() * 30 : f === 'boat' ? 16 + r() * 26 : 13 + r() * 10), side, ry: f === 'bld' ? 0 : r() * 6.28, sc: f === 'bld' ? 1 : 0.9 + r() * 0.8, v: Math.floor(r() * 3), sh: 0.8 + r() * 0.3, z: zi, h: 0.7 + r() * 0.9, pi: r() < 0.5 ? 2 : 3 });
    // gente caminando por el andén (decoración viva)
    if (!th.rail && r() < 0.42) g.scen.push({ k: 'ped', s: s + r() * 5, x: side * (4.0 + r() * 0.9), side, ry: 0, sc: 1, v: Math.floor(r() * 4), sh: 1, z: zi, mv: (r() < 0.5 ? 1 : -1) * (1 + r() * 2.4), t0: g.t, nr: 1 });
  }
  if (r() < FLOW[zi]) { const sd = r() < 0.5 ? -1 : 1; g.scen.push({ k: 'flowers', s: s + r() * 4, x: sd * (5.9 + r() * 2.6), side: sd, ry: r() * 6.28, sc: 0.8 + r() * 0.5, v: 0, sh: 0.9 + r() * 0.2, z: zi, nr: 1 }); }
  g.scenS += 6 + r() * 5;
}

function genAhead(g) {
  let n = 0;
  while (g.genS < g.p.s + VIEW && n++ < 60) genRow(g);
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
/* estilo: trucos, barandas, rozadas y entregas perfectas suben el combo */
function style(g, a) { const c0 = Math.floor(g.combo * 2); g.combo = Math.min(g.comboCap, g.combo + a); g.comboT = 5; if (Math.floor(g.combo * 2) > c0) ev(g, 'combo', g.combo); }

function deliver(g, side, auto) {
  const P = g.p, K = g.perks, reach = K.brazo ? 28 : 22; let d = null;
  for (const q of g.dels) { if (q.done || q.miss || q.side !== side) continue; const a = q.s - P.s; if (a < -2.5 || a > reach) continue; if (!d || q.s < d.s) d = q; }
  if (!d) { ev(g, 'dnone', side); return false; }
  const a = d.s - P.s; let q = auto || (a >= (K.brazo ? 0.5 : 2) && a <= (K.brazo ? 13 : 9.5)) ? 2 : 1;
  if (d.k === 'pos' && (side < 0 ? P.lane > 1 : P.lane < 2)) q = 1;
  d.done = 1; d.q = q; g.deliv++; g.dStreak++; g.dBest = Math.max(g.dBest, g.dStreak); if (q === 2) { g.perf++; style(g, 0.2); }
  const id = g.veh.id, k2 = (id === 'trike' ? 2 : id === 'moto' ? 1.25 : 1) * g.delK;
  d.pts = Math.round(DEL[d.k][0] * (g.evt === 'dominical' ? 1.5 : 1) * (g.evt === 'correo' && d.k === 'cor' ? 2 : 1) * q * g.mult * (P.x2 > 0 ? 2 : 1) * (1 + 0.1 * Math.min(10, g.dStreak - 1)) * k2 * (q === 2 ? g.combo : 1));
  g.score += d.pts; g.coinsRun += Math.round(DEL[d.k][1] * q * (id === 'trike' ? 2 : 1));
  d.T = clamp(Math.max(a, 1) / Math.max(P.v, 4), 0.15, 0.7); ev(g, 'deliver', d);
  if (d.dog && !g.pol && !K.freno && P.v > 15.5) chase(g, 'dog', 4.5);
  if (g.tutWait && g.tutWait.need === 'deliver') g.tutWait.ok = 1;
  return true;
}
function chase(g, k, d) { const P = g.p; g.pol = { k, d, t: 0, vp: k === 'pol' ? Math.max(vEst(g, P.s) * 1.1 + 3.5, P.v * 0.92) : 16.5 }; ev(g, 'chase', k); }

function input(g, k) {
  const P = g.p, V = g.veh; if (!P.alive) return;
  if (k === 'L' || k === 'R') {
    const nl = clamp(P.lane + (k === 'L' ? -1 : 1), 0, NL - 1);
    if (nl !== P.lane) { P.from = P.lane; P.lane = nl; P.laneT = g.t; ev(g, 'lane'); }
  } else if (k === 'U') {
    const jv = Math.sqrt(2 * GRAV * 1.55 * V.jmp);
    if (!P.air) { P.crouch = 0; P.air = true; P.airT = 0; P.vy = jv + Math.max(0, P.gv) * 0.5; P.jumps = 1; P.trickHit = 0; P.trN = 0; P.trT = 9; g.jumps++; ev(g, 'jump'); }
    else if (P.glide > 0) return;
    else if (P.jumps < g.maxJ) { P.vy = jv * 0.85; P.jumps++; g.jumps++; ev(g, 'jump2'); }
    else if (P.trN < 2 && P.airT > 0.06) { P.trN++; P.trT = 0; P.vy += 2.2; ev(g, 'trickGo', P.trN); }
  } else if (k === 'B') {
    if (P.en >= g.enCost) { const up = V.kind === 'h' ? 1 + Math.max(0, P.sl) * 8 : 1; P.en = Math.max(0, P.en - g.enCost * up); P.tapT = 0; P.boost = Math.min(1, P.boost + 0.13); g.boosts++; ev(g, 'boost', P.boost); }
    else ev(g, 'noen');
  } else if (k === 'K') { if (!P.brake) { P.brake = 1; ev(g, 'brake'); } }
  else if (k === 'k') P.brake = 0;
  else if (k === 'Q') deliver(g, -1);
  else if (k === 'E') deliver(g, 1);
  else if (k === 'D') {
    if (P.air) { P.vy = Math.min(P.vy, -26); P.fastFall = 1; } else P.crouch = 0.62;
    ev(g, 'duck');
  }
}

function smash(g, o) {
  const P = g.p, r = g.xr;
  o.fly = { t: 0, vx: ((o.x || 0) - P.x >= 0 ? 1 : -1) * (3 + r() * 4), vy: 7 + r() * 5, vz: P.v * 0.5, rx: (r() - 0.5) * 12, ry: (r() - 0.5) * 8, x: 0, y: 0, z: 0 };
  g.score += 20 * g.mult; ev(g, 'smash', o);
}
function die(g, o) {
  const P = g.p;
  if (P.shield) { P.shield = 0; P.inv = 1.2; if (o && o.t && o.t !== 'wall' && o.t !== 'truck') smash(g, o); ev(g, 'shield'); return; }
  P.alive = false; P.deadT = 0; P.vy = 5; P.air = true; P.brake = 0; g.cause = o ? (o.name || o.T.name) : 'una caída'; g.hard = o && o.T.hard ? 1 : 0;
  g.causePat = o ? o.pat + (P.stumble > 0 ? '+tamb' : '') : ''; g.pol = null;
  g.cleanBest = Math.max(g.cleanBest, g.cleanS); ev(g, 'crash', o);
}
function stumble(g, o, bounce) {
  const P = g.p;
  if (P.stumble > 0) { die(g, o); return; }
  P.stumble = g.veh.id === 'scooter' ? 2.2 : 3.0; P.slow = 0.72; P.trickHit = 1; g.combo = 1; g.comboT = 0;
  g.cleanBest = Math.max(g.cleanBest, g.cleanS); g.cleanS = 0;
  if (bounce) { const t = P.lane; P.lane = P.from; P.from = t; }
  ev(g, 'stumble', o);
}
function revive(g) {
  const P = g.p;
  for (const o of g.obs) if (o.t !== 'wall' && o.s + o.hd > P.s - 3 && o.s - o.hd < P.s + 40) o.alive = 0;
  for (const c of g.crs) if (c.s < P.s + 40) c.done = 1;
  const nr = narAt(g, P.s); if (nr && !nr.open.includes(P.lane)) P.lane = nr.open[0];
  P.alive = true; P.inv = 2.5; P.stumble = 0; P.slow = 1; P.vy = 0; P.air = false; P.y = 0; P.gv = 0; P.crouch = 0; P.brake = 0; P.over = 0; g.pol = null; g.overT = -3;
  P.v = vEst(g, P.s) * 0.55; P.x = LX(P.lane); g.revives++; ev(g, 'revive');
}

function chaseStep(g, dt) {
  const P = g.p, c = g.pol; c.t += dt;
  const vp = c.k === 'pol' ? c.vp + Math.min(4, c.t * 0.3) : c.vp; c.d = Math.max(0, c.d + (P.v - vp) * dt);
  if (c.k === 'dog') {
    if (P.v < 9 || c.t > 7) { g.pol = null; g.score += 40 * g.mult; ev(g, 'dogCalm'); }
    else if (c.d > 12) { g.pol = null; g.score += 80 * g.mult; ev(g, 'dogEsc'); }
    else if (c.d < 0.5) { g.pol = null; ev(g, 'dogBite'); stumble(g, DOG, false); }
    return;
  }
  if (c.d > 34) { g.pol = null; g.overT = -2; g.escapes++; g.score += 300 * g.mult; style(g, 0.3); ev(g, 'polEsc'); }
  else if (c.d < 6 && (P.brake || P.v < vp * 0.7) && g.t - P.laneT < 0.5) { g.pol = null; g.overT = -4; g.dodges++; g.score += 400 * g.mult; style(g, 0.3); ev(g, 'polDodge'); }
  else if (c.d < 0.9) { const fine = Math.min(g.coinsRun, 40 + Math.floor(g.coinsRun * 0.12)); g.coinsRun -= fine; g.fines++; P.slow = 0.55; P.boost = 0; g.pol = null; g.overT = -4; ev(g, 'polFine', fine); }
}

/* rivales: otros repartidores de la historia que te pasan y te quitan entregas */
function rivalStep(g, dt, base) {
  const P = g.p, r = g.xr; let R = g.riv;
  if (!R) {
    if (P.s >= g.nextRiv && !P.inPark && !narAt(g, P.s + 30) && P.v > 8 && (g.tut < 0 || g.tut >= TUT.length)) {
      const i = Math.floor(r() * RIV.length), lane = P.lane === 2 ? 3 : 2;
      R = g.riv = { i, name: RIV[i][0], s: P.s - 9, lane, x: LX(lane), v: P.v + 3, t: 0, led: 0, ah: 0, y: 0, lc: 2 + r() * 2, hitT: -9 }; ev(g, 'rival', R);
    }
    return;
  }
  R.t += dt; const gap = R.s - P.s, cruise = base * (1 + 0.012 * g.rivLv) + (gap > 22 ? -0.8 : 0.3);
  if (gap > 10) R.led = 1;
  R.v += ((R.led ? cruise : Math.max(P.v + 3.5, cruise)) - R.v) * Math.min(1, dt * 2); R.s += R.v * dt;
  if (!R.ah && gap > 0.5) { R.ah = 1; g.score = Math.max(0, g.score - 40 * g.mult); ev(g, 'rivPass', R); }
  const blockIn = l => g.obs.some(o => o.alive && !o.fly && o.lane === l && o.t !== 'median' && o.t !== 'pad' && (o.y1 > 1.25 || o.T.moving || o.T.need === 'duck' || o.t === 'wall') && o.s + o.hd > R.s - 1 && o.s - o.hd - R.s < 16);
  const opts = LANES.filter(l => Math.abs(l - R.lane) === 1 && laneOk(g, R.lane, l, R.s) && (gap > 6 || gap < -4 || l !== P.lane));
  if (blockIn(R.lane) && Math.abs(R.x - LX(R.lane)) < 0.3) { const ok = opts.filter(l => !blockIn(l)); if (ok.length) { R.lane = ok[Math.floor(r() * ok.length)]; R.lc = 1.5; } }
  else if ((R.lc -= dt) < 0) { R.lc = 2.5 + r() * 3; const ok = opts.filter(l => !blockIn(l)); if (ok.length) R.lane = ok[Math.floor(r() * ok.length)]; }
  R.x += clamp(LX(R.lane) - R.x, -8 * dt, 8 * dt);
  let hop = 0; for (const o of g.obs) if (o.alive && !o.fly && o.lane === R.lane && o.t !== 'median' && o.t !== 'pad' && o.y1 <= 1.25 && !o.T.moving && Math.abs(o.s - R.s) < o.hd + 3) hop = Math.max(hop, Math.min(2.7, o.y1 + 0.5) * Math.max(0, 1 - Math.abs(o.s - R.s) / (o.hd + 3)));
  R.y += (hop - R.y) * Math.min(1, dt * 10);
  if (R.ah) {
    for (const c of g.coins) if (c.alive && !c.mag && c.lane === R.lane && Math.abs(c.s - R.s) < 1 && c.y < 2.5) c.alive = 0;
    for (const d of g.dels) if (!d.done && !d.miss && R.s > d.s && gap > 0) { d.miss = 1; d.stolen = 1; g.stolen++; R.st = (R.st || 0) + 1; g.dStreak = 0; ev(g, 'dstolen', R); }
  }
  if (Math.abs(gap) < 1.3 && Math.abs(R.x - P.x) < 0.8 && P.y < 1 && R.y < 0.6 && g.t - R.hitT > 1.2 && P.inv <= 0 && P.turbo <= 0) { R.hitT = g.t; stumble(g, { T: { name: R.name }, pat: 'rival' }, Math.abs(LX(P.lane) - P.x) > 0.02); if (!P.alive) return; }
  if (R.ah && gap < -1.5) { g.riv = null; g.nextRiv = P.s + (g.race ? 380 : 800) + r() * (g.race ? 250 : 600); g.duels++; g.score += 250 * g.mult * g.combo; style(g, 0.3); ev(g, 'rivWin', R); }
  else if (gap > 55 || R.t > 32 || (!R.ah && R.t > 7)) { g.riv = null; g.nextRiv = P.s + (g.race ? 350 : 700) + r() * (g.race ? 250 : 500); if (R.ah) { g.rivLost++; ev(g, 'rivLost', R); } }
}

function step(g, dt, inp) {
  const P = g.p, V = g.veh, K = g.perks;
  g.t += dt;
  if (!P.alive) { P.deadT += dt; P.vy -= GRAV * dt; P.y = Math.max(P.gy || 0, P.y + P.vy * dt); P.v *= Math.pow(0.08, dt); P.s += P.v * dt; return; }
  // tutorial: cámara lenta hasta que el jugador haga el gesto correcto
  if (g.tutWait) {
    const w = g.tutWait, ok = w.need === 'jump' ? P.air : w.need === 'duck' ? P.crouch > 0 : w.need === 'deliver' ? w.ok : P.lane !== w.o.lane;
    if (ok || w.o.s - P.s < -2) { g.tutWait = null; ev(g, 'tutOk', w.need); } else dt *= 0.18;
  }
  if (inp) input(g, inp);
  P.inv = Math.max(0, P.inv - dt); P.stumble = Math.max(0, P.stumble - dt); P.crouch = Math.max(0, P.crouch - dt); P.tapT += dt; P.trT += dt;
  if (g.comboT > 0 && (g.comboT -= dt) <= 0) g.combo = 1;
  for (const k of ['magnet', 'turbo', 'x2', 'glide']) if (P[k] > 0) { P[k] -= dt; if (P[k] <= 0) { P[k] = 0; if (k === 'turbo') P.inv = Math.max(P.inv, 1.5); if (k === 'glide') { P.inv = Math.max(P.inv, 1.4); P.vy = 0; P.airT = 0; P.trickHit = 1; } ev(g, 'pEnd', k); } }
  if (V.id === 'auto' && !P.shield && (P.shT = (P.shT || 0) + dt) > 45) { P.shT = 0; P.shield = 1; }
  // energía (aliento / batería): la gasta el impulso y se recupera sola
  const sl = P.sl = HILLD(P.s), hum = V.kind === 'h', inPark = parkAt(g, P.s); P.inPark = inPark ? 1 : 0;
  let rg = P.tapT < 0.6 ? 0 : g.enRegen * (inPark ? 3 : 1) * (hum && sl < -0.03 ? 1.5 : 1); if (!hum && (P.brake || sl < -0.03)) rg += 0.1;
  P.en = Math.min(g.enMax, P.en + rg * dt);
  // descanso en el parque: detente unos segundos para recuperar energía (y curar una lesión)
  if (inPark && P.v < 1.2 && !P.air) { if ((g.restT = (g.restT || 0) + dt) > 2.5 && !g.rested) { g.rested = 1; P.en = g.enMax; ev(g, 'rest'); } } else g.restT = 0;
  // velocidad: v = (14 + 21·(1 − e^(−s/2600)))·vehículo·pendiente + impulso
  const base = vEst(g, P.s); P.slow = Math.min(1, P.slow + dt * 0.35); P.boost = Math.max(0, P.boost - dt * 0.24);
  const tv = (base * hillK(g, sl) + g.bmax * P.boost) * (P.turbo > 0 ? 1.4 : 1) * P.slow;
  if (P.brake && P.turbo <= 0 && P.glide <= 0) P.v = Math.max(0, P.v - g.brakeDec * dt);
  else P.v += (tv - P.v) * Math.min(1, dt * (P.v < tv ? 2.2 : 6));
  // en bajadas fuertes los vehículos de fuerza se desbocan: hay que frenar
  if (hum && V.id !== 'long' && sl < -0.04 && P.v > base * 1.15 + g.bmax * P.boost && P.turbo <= 0 && !P.air && P.glide <= 0) { P.over += dt; if (P.over > 2.4) { P.over = 0; stumble(g, WOB, false); if (!P.alive) return; } }
  else P.over = Math.max(0, P.over - dt * 1.5);
  const s0 = P.s; P.s += P.v * dt; P.phase += P.v * dt;
  // lateral
  const tx = LX(P.lane), dx = tx - P.x, lat = 13 * g.hk * (K.derrape ? 1.2 : 1) * dt;
  P.x += Math.abs(dx) <= lat ? dx : Math.sign(dx) * lat;
  // vertical
  const gnd = groundAt(g, P.x, P.s, P.y), gO = g._gO; P.gy = gnd;
  if (P.glide > 0) { P.air = true; P.vy = 0; P.airT = 0; P.y += (6.2 - P.y) * Math.min(1, dt * 3); }
  else if (P.air) {
    P.vy -= GRAV * (V.id === 'jetpack' && P.vy < 0 && !P.fastFall ? 0.45 : 1) * dt; P.y += P.vy * dt; P.airT += dt;
    if (P.y <= gnd && P.vy <= 0) {
      P.y = gnd; P.vy = 0; P.air = false; P.gv = 0;
      if (P.fastFall) { P.crouch = 0.55; P.fastFall = 0; }
      if (P.trN > 0 && P.trT < 0.22) { P.trN = 0; stumble(g, { T: { name: 'un truco incompleto' }, pat: 'truco' }, false); if (!P.alive) return; }
      else if ((P.airT > 0.42 || P.trN > 0) && !P.trickHit) {
        const pts = Math.round(((P.airT > 0.8 ? 60 : 30) + 45 * P.trN) * (V.id === 'skate' ? 2 : 1) * (K.trucos ? 2 : 1) * (inPark ? 2 : 1) * g.mult * g.combo);
        g.score += pts; g.tricks += 1 + P.trN; if (inPark) g.parkTr += 1 + P.trN; style(g, 0.2 + 0.2 * P.trN); ev(g, 'trick', { pts, name: (TRK[V.id] || TRK.foot)[Math.min(2, P.trN)] });
      }
      P.jumps = 0; P.trN = 0; ev(g, 'land', P.airT);
    }
  } else {
    if (gnd >= P.y - 0.001) { P.gv = (gnd - P.y) / dt; P.y = gnd; }
    else { P.air = true; P.airT = 0; P.trickHit = 0; P.trN = 0; P.vy = P.grind ? 5.5 : Math.max(0, Math.min(P.gv, 14)); P.gv = 0; P.vy -= GRAV * dt; P.y += P.vy * dt; }
  }
  if (gO && gO.t === 'truck' && !gO.counted && !P.air) { gO.counted = 1; g.trucks++; ev(g, 'truck'); }
  // barandas: deslizar da puntos, estilo y energía
  if (gO && gO.t === 'rail' && !P.air) {
    const gm = P.v * dt; if (!P.grind) { P.grind = 1; style(g, 0.25); ev(g, 'grindOn'); }
    g.grindM += gm; g.score += gm * 3 * g.mult * g.combo * (K.trucos ? 2 : 1); P.en = Math.min(g.enMax, P.en + 0.12 * dt);
    if ((P.grT += gm) > 6) { P.grT = 0; style(g, 0.12); ev(g, 'grind'); }
  } else if (!P.air || P.airT > 0.05) P.grind = 0;
  // colisiones (barrido en z para que nada se atraviese a alta velocidad)
  const h = P.crouch > 0 ? PCH : PH, zA = Math.min(s0, P.s) - PHD, zB = Math.max(s0, P.s) + PHD, moving = Math.abs(tx - P.x) > 0.02;
  for (const o of g.obs) {
    if (!o.alive || o.fly) continue;
    if (o.t === 'pad') { if (!o.used && P.y < 0.6 && Math.abs(P.x - o.x) < o.hw + 0.15 && zB > o.s - o.hd && zA < o.s + o.hd) { o.used = 1; g.pads++; P.boost = Math.min(1, P.boost + 0.6); P.en = Math.min(g.enMax, P.en + g.enMax * 0.25); P.padT = 2.5; g.score += 30 * g.mult; style(g, 0.15); ev(g, 'pad', o); } continue; }
    if (o.T.moving) {
      o.s += o.u * dt; const rel = o.s - P.s, was = o.rel > 0; o.rel = rel;
      if (was && rel <= 0 && !o.nm) { o.nm = 1; if (Math.abs(o.x - P.x) < 1.9 && g.t - o.hitT > 1 && P.v > 6) { g.near++; g.score += 15 * g.mult; style(g, 0.1); ev(g, 'near', o); } }
      if (o.s + o.hd < P.s - 0.6) continue;
    }
    if (o.t === 'gate') { const gy = gateY(o, g.t); o.y0 = gy - 0.08; o.y1 = gy + 0.08; }
    const os0 = o.s - o.hd, os1 = o.s + o.hd;
    if ((o.t === 'branch' || o.t === 'gate') && !o.passed && P.s - PHD > os1) { o.passed = 1; if (Math.abs(P.x - o.x) < o.hw && P.crouch > 0) { g.ducks++; ev(g, 'duckOk'); } }
    if (o.tut !== undefined && !o.tdone && os0 > P.s && (os0 - P.s - PHD) / Math.max(1, P.v - (o.u || 0)) * P.v <= (TUT[o.tut].need === 'lane' ? P.v * 0.6 : P.v * 0.21 + 0.4)) { o.tdone = 1; g.tutWait = { need: TUT[o.tut].need, o }; ev(g, 'tut', o.tut); }
    if (zB < os0 || zA > os1) continue;
    if (P.glide > 0 && P.y > 2.9) continue;
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
    if (P.turbo > 0) { if (!o.T.ramp && o.t !== 'wall' && o.t !== 'truck') smash(g, o); continue; }
    if (P.inv > 0) continue;
    const frontal = o.T.moving || (s0 + PHD <= os0 + 0.06) || o.T.ground;
    if (o.T.ramp) { stumble(g, o, true); continue; }
    if (frontal) {
      if (g.vault && o.T.vault) { P.air = true; P.airT = 0; P.vy = Math.sqrt(2 * GRAV * (o.y1 + 0.55)); P.slow = Math.min(P.slow, 0.88); P.jumps = 1; P.trickHit = 1; P.crouch = 0; g.vaults++; ev(g, 'vault', o); }
      else if (o.T.minor || (g.vault && o.T.ground)) { if (o.t === 'puddle' && V.id === 'inline') { ev(g, 'splash', o); continue; } stumble(g, o, false); if (o.t === 'cone') smash(g, o); }
      else die(g, o);
    } else if (V.id === 'uni' && moving) { const t = P.lane; P.lane = P.from; P.from = t; ev(g, 'lane'); }
    else stumble(g, o, moving);
    if (!P.alive) return;
  }
  // cruces: carros en rojo, respeto del semáforo
  for (const X of g.xs) {
    const dC = X.s - P.s; if (dC > 26 || dC < -12) continue;
    if (!X.pass) {
      if (P.v < 1.2 && dC < 24) X.wait = 1;
      if (dC < 5.5) { X.pass = 1; g.crossN++; const st = lightAt(X, g.t); if (st === 2) { g.redRuns++; ev(g, 'redrun'); if (!g.pol && P.turbo <= 0) chase(g, 'pol', 10); } else if (X.wait) { g.civic++; g.score += 60 * g.mult; ev(g, 'civic'); } }
    }
    if (P.turbo > 0 || P.inv > 0 || P.y > 1.3) continue;
    for (const c of crossCars(X, g.t, g._cars)) if (Math.abs(P.s - c.s) < 1.0 + PHD && Math.abs(P.x - c.x) < (c.moto ? 1.0 : 2.15) + PHW) { die(g, CARX); if (!P.alive) return; P.inv = Math.max(P.inv, 1.2); break; }
  }
  // animalitos que cruzan: frena o pasa antes
  for (const c of g.crs) {
    if (c.done) continue; const ahead = c.s - P.s;
    if (c.t0 < 0) { if (ahead < c.trig) { c.t0 = g.t; ev(g, 'crit', c); } continue; }
    c.x = c.x0 + c.dir * c.v * (g.t - c.t0);
    if (c.x * c.dir > 5.2 || ahead < -3) { c.done = 1; if (!c.hit) g.critOk++; continue; }
    if (!c.hit && P.s + PHD > c.s - 0.45 && s0 - PHD < c.s + 0.45 && Math.abs(P.x - c.x) < c.hw + PHW && P.y < 0.55 && P.turbo <= 0 && P.inv <= 0) { c.hit = 1; ev(g, 'critHit', c); die(g, { T: { name: c.name, hard: 1 }, pat: 'animal' }); if (!P.alive) return; }
  }
  // exceso de velocidad con motor → policía; perros y rivales
  P.padT = Math.max(0, (P.padT || 0) - dt);
  if (!hum && !g.pol) { if (P.v > base * 1.1 + 0.55 * g.bmax && P.turbo <= 0 && P.padT <= 0) g.overT += dt; else g.overT = Math.max(Math.min(g.overT, 0) , g.overT - dt * 0.6); if (g.overT < 0) g.overT += dt; if (g.overT > 1.8) chase(g, 'pol', 13); }
  if (g.pol) { chaseStep(g, dt); if (!P.alive) return; }
  rivalStep(g, dt, base); if (!P.alive) return;
  g.petSide = P.lane === 3 ? -1 : 1;
  // monedas
  const mul = g.mult * (P.x2 > 0 ? 2 : 1) * (V.id === 'bike' ? 1.15 : 1) * (1 + 0.5 * P.boost), magR = P.magnet > 0 ? 16 : 0;
  for (const c of g.coins) {
    if (!c.alive) continue;
    if (magR && !c.mag && c.s > P.s - 2 && c.s < P.s + magR) c.mag = 1;
    else if (g.pet && !c.mag && c.s > P.s && c.s < P.s + 3.2 && Math.sign(c.x - P.x) === g.petSide && Math.abs(c.x - P.x) < 2.1 && c.y < 2.2 + P.y) c.mag = 1;
    else if (V.id === 'euc' && !c.mag && c.s > P.s - 1 && c.s < P.s + 4.5 && Math.abs(c.x - P.x) < 2 && Math.abs(c.y - P.y - 0.9) < 1.6) c.mag = 1;
    if (c.mag) { const k = Math.min(1, dt * 14); c.x += (P.x - c.x) * k; c.y += (P.y + 0.9 - c.y) * k; c.s += (P.s + 0.2 - c.s) * k; }
    if (c.s > zA - 0.6 && c.s < zB + 0.6 && Math.abs(c.x - P.x) < 0.8 && c.y > P.y - 0.4 && c.y < P.y + h + 0.5) { c.alive = 0; g.coinsRun += g.evt === 'carnaval' && (g._cf = !g._cf) ? 2 : 1; g.score += 10 * mul; ev(g, 'coin', c); }
  }
  for (const it of g.items) {
    if (!it.alive) continue;
    if (P.magnet > 0 && it.s > P.s - 1 && it.s < P.s + 10) { const k = Math.min(1, dt * 10); it.x += (P.x - it.x) * k; it.y += (P.y + 1 - it.y) * k; it.s += (P.s - it.s) * k; }
    if (it.s > zA - 0.8 && it.s < zB + 0.8 && Math.abs(it.x - P.x) < 0.9 && it.y > P.y - 0.6 && it.y < P.y + h + 0.6) { it.alive = 0; pickup(g, it); }
  }
  // entregas: se hacen con los botones (el camión con cuadrilla entrega solo)
  for (const d of g.dels) {
    if (d.done || d.miss) continue; const a = d.s - P.s;
    if (d.tut !== undefined && !d.tdone && a < 8.5 && a > 2) { d.tdone = 1; g.tutWait = { need: 'deliver', o: d, ok: 0 }; ev(g, 'tut', d.tut); }
    if (V.id === 'camion' && a < 7 && a > 1) deliver(g, d.side, true);
    else if (a < -2.5) { d.miss = 1; if (g.dStreak > 0) ev(g, 'dmiss', d); g.dStreak = 0; }
  }
  // puntuación por distancia
  const ds = P.s - s0; g.score += ds * mul; g.cleanS += ds;
  const ed = Math.floor(P.s / 1000); if (ed > g.edition) { g.edition = ed; if (RAINY(ed)) g.rainSeen = 1; ev(g, 'zone', ed); }
  if (!g.tunSeen && g.tuns.length && g.tuns.some(t => P.s > t[0] + 5 && P.s < t[1])) g.tunSeen = 1;
  // limpieza y generación
  if ((g._cl = (g._cl || 0) + 1) % 30 === 0) {
    const cut = P.s - 18;
    g.obs = g.obs.filter(o => (o.T.moving ? o.s > cut - 20 && o.s < P.s + 700 : o.s + o.hd > cut) && !(o.fly && o.fly.t > 2.5));
    g.coins = g.coins.filter(c => c.alive && c.s > cut);
    g.items = g.items.filter(i => i.alive && i.s > cut);
    g.dels = g.dels.filter(d => d.s > cut - 12);
    g.xs = g.xs.filter(X => X.s > cut - 20); g.crs = g.crs.filter(c => !c.done || c.s > cut); g.shops = g.shops.filter(q => q.s > cut - 20);
    g.nars = g.nars.filter(n => n.b > cut); g.parks = g.parks.filter(p => p[1] > cut);
    g.scen = g.scen.filter(sc => sc.s > cut - (sc.k === 'bld' || sc.k === 'hill' || sc.k === 'ped' ? 30 : 0));
  }
  genAhead(g);
}

function airCoins(g) { const P = g.p, L = P.v * g.dur.glide * 1.05; let lane = P.lane; for (let d = 14, i = 0; d < L; d += 3, i++) { if (i % 9 === 8) lane = clamp(lane + (g.xr() < 0.5 ? -1 : 1), 0, NL - 1); g.coins.push({ lane, x: LX(lane), s: P.s + d, y: 6.9, alive: 1, mag: 0 }); } }
function pickup(g, it) {
  const P = g.p, r = g.xr;
  if (it.k === 'magnet' || it.k === 'turbo' || it.k === 'x2') { P[it.k] = g.dur[it.k]; g.powers++; ev(g, 'power', it.k); }
  else if (it.k === 'glide') { P.glide = g.dur.glide; P.inv = Math.max(P.inv, 0.6); P.air = true; P.crouch = 0; P.brake = 0; g.powers++; g.glides++; airCoins(g); ev(g, 'power', 'glide'); }
  else if (it.k === 'letter') { const ch = g.letters[0]; if (ch) { g.letters = g.letters.slice(1); ev(g, 'letter', ch); } }
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
    if (!o.alive || o.fly || o.lane !== l || o.t === 'median' || o.t === 'pad' || (o.t === 'puddle' && g.veh.id === 'inline')) continue;
    let front = o.s - o.hd - (P.s + PHD); const back = o.s + o.hd - (P.s - PHD);
    if (back < 0) continue;
    if (o.T.moving) { const rel = P.v - o.u; if (rel <= 0.5) { if (front > 2.5) continue; } else if (front > 0) front = front / rel * Math.max(P.v, 6); }
    if (front > h) continue;
    let need = o.T.need;
    if (o.t === 'gate') { const gy = gateY(o, g.t + Math.max(0, front) / Math.max(P.v, 1) + 0.06); need = gy >= 1.92 ? 'free' : gy >= 1.14 ? 'duck' : 'jump'; if (need === 'free') continue; }
    if (g.vault && o.T.vault && need === 'jump') need = 'vault';
    if (need !== 'duck' && need !== 'ramp' && P.y >= o.y1 - 0.05) continue;
    if (need === 'ramp' && P.y >= o.y1 - 0.05) continue;
    if (!best || front < best.front) best = { o, front, need };
  }
  for (const c of g.crs) {
    if (c.done) continue; const ahead = c.s - P.s; if (ahead < -1 || ahead > h) continue;
    const tRel = c.t0 >= 0 ? g.t - c.t0 + ahead / Math.max(P.v, 3) : c.trig / Math.max(P.v, 3), xa = c.x0 + c.dir * c.v * tRel;
    if (Math.abs(LX(l) - xa) < c.hw + 1.05 && (!best || ahead - 0.6 < best.front)) best = { o: c, front: ahead - 0.6, need: 'block', crit: 1 };
  }
  return best;
}
function aiThink(g, skill = 1) {
  const P = g.p; if (!P.alive) return null;
  const h = P.v * 1.2 + 8, info = LANES.map(l => aiLane(g, l, h));
  // freno: semáforo en rojo, bajada desbocada o animal sin salida
  let brake = P.over > 0.5, stopAhead = false;
  const dStop = P.v * P.v / (2 * g.brakeDec);
  for (const X of g.xs) {
    const line = X.s - 7.5 - P.s; if (X.pass || line < -1.2 || line > 90) continue;
    const tArr = Math.max(0, line) / Math.max(P.v, 4), tClr = tArr + 17 / Math.max(P.v, 9);
    const red = lightAt(X, g.t + tArr) === 2 || lightAt(X, g.t + tClr) === 2 || lightAt(X, g.t + (tArr + tClr) / 2) === 2 || (lightAt(X, g.t + tArr) === 1 && tClr - tArr > 0.9);
    if (red) stopAhead = true;
    if (P.v < 1.5 && line < 8) { const p = lightP(X, g.t); if (!(p < TG - 1.7)) brake = true; }
    else if (red && line <= dStop + P.v * 0.12 + 1.5) brake = true;
  }
  const cost = info.map((f, l) => {
    let c = Math.abs(l - P.lane) * 0.7 + (l < 2 ? 0.5 : 0) + (stopAhead && l < 2 ? 4 : 0);
    const fa = g.forks.find(f => P.s > f.a - 70 && P.s < f.b); if (fa) { if (P.s > fa.a - 8 && (l < 2) !== (P.lane < 2)) c += 300; else if ((l < 2) === !(fa.dl ^ (g.aiPad ? 1 : 0))) c -= 2.5; }
    if (f) {
      if (f.need === 'block') c += f.front < 0.5 ? 200 : f.front < P.v * 0.75 + 3 ? 60 + Math.max(0, 40 - f.front) : 5;
      else if (f.need === 'ramp') c += f.front < 0 && P.lane !== l ? 200 : -0.3;
      else if (f.need === 'vault') c += 1.2;
      else c += f.need === 'jump' ? (f.o.T.minor ? 3 : 2) : 2.4;
      if (l !== P.lane && f.need !== 'ramp' && f.front < P.v * 0.42) c += 40;
      if (f.need !== 'block' && f.front < 0 && P.lane !== l) c += 150;
    }
    let n = 0; for (const cn of g.coins) if (cn.alive && cn.lane === l && cn.s > P.s && cn.s < P.s + 22) n++;
    return c - Math.min(1.5, n * 0.18);
  });
  let bl = P.lane;
  for (const l of LANES) if (cost[l] < cost[bl] - 0.25) bl = l;
  if (bl !== P.lane && !laneOk(g, P.lane, P.lane + Math.sign(bl - P.lane), P.s + P.v * 0.4)) bl = P.lane;
  if (bl !== P.lane) { const nx = P.lane + Math.sign(bl - P.lane), m = info[nx]; if (nx !== bl && m && m.need === 'block' && m.front < P.v * 0.3) bl = P.lane; }
  const cur = info[bl === P.lane ? P.lane : P.lane + Math.sign(bl - P.lane)];
  if (cur && cur.need === 'block' && (cur.crit || (cur.o.T.moving && cur.o.u > 0) || P.v > 3) && cur.front < dStop + 1.5 && cost[bl] > 50) brake = true;
  if (brake !== !!P.brake) return brake ? 'K' : 'k';
  const tx = LX(P.lane);
  if (bl !== P.lane && Math.abs(P.x - tx) < 0.3) return bl < P.lane ? 'L' : 'R';
  const f = info[P.lane];
  if (f) {
    const lead = P.v * (0.2 + (1 - skill) * 0.08) + 0.35;
    if (f.need === 'jump' && !P.air && f.front <= lead && f.front > -0.3) return 'U';
    if (f.need === 'jump' && P.air && P.vy < 2 && !P.fastFall && f.front > 0.5) { const tl = (P.vy + Math.sqrt(P.vy * P.vy + 2 * GRAV * Math.max(0, P.y - P.gy))) / GRAV; if (f.front / P.v < tl + 0.16) return 'D'; }
    if (f.need === 'duck' && f.front <= P.v * 0.3 + 0.4 && P.crouch < 0.18 && f.front > -0.5) return 'D';
  }
  for (const d of g.dels) if (!d.done && !d.miss) { const a = d.s - P.s; if (a > 3 && a < 8.5) return d.side < 0 ? 'Q' : 'E'; }
  return null;
}

/* Simulación rápida sin render (bot de pruebas) */
function simulate(o) {
  const g = newGame({ seed: o.seed, veh: o.veh || 'foot', ai: true, up: o.up, mult: 1, cluesLeft: 12, pet: o.pet, letters: 'EMSAY', fit: o.fit == null ? 50 : o.fit, inj: o.inj, perks: o.perks, skill: o.skill2 || 0, tut: o.tut, evt: o.evt, vup: o.vup });
  const maxT = o.maxT || 240; let n = 0, inp = null, errs = [], stuck = 0; g.aiPad = !!o.padRoute;
  while (g.p.alive && g.t < maxT) {
    if (n % 3 === 0) inp = aiThink(g, o.skill == null ? 1 : o.skill); else inp = null;
    if (!inp && o.boost && n % 30 === 7) inp = 'B';
    step(g, DT, inp); n++;
    g.ev.length = 0;
    const P = g.p;
    if (!Number.isFinite(P.s + P.x + P.y + P.v + g.score + P.en)) { errs.push('NaN en estado a t=' + g.t.toFixed(2)); break; }
    if (g.obs.length > 500 || g.coins.length > 900 || g.scen.length > 600 || g.dels.length > 80) { errs.push('fuga de objetos'); break; }
    if (P.y < -0.01 || P.y > 12) { errs.push('altura fuera de rango ' + P.y); break; }
    if (P.v < 0.3 && !g.tutWait) { if ((stuck += DT) > 14) { errs.push('atascado en s=' + Math.round(P.s)); break; } } else stuck = 0;
    if (o.revive && !P.alive && g.revives < 1) { revive(g); }
  }
  return { seed: o.seed, veh: g.veh.id, dist: Math.round(g.p.s), t: +g.t.toFixed(1), score: Math.round(g.score), coins: g.coinsRun, cause: g.p.alive ? 'tiempo' : g.cause, pat: g.causePat || '', bad: g.bad, rows: g.rows,
    jumps: g.jumps, ducks: g.ducks, tricks: g.tricks, trucks: g.trucks, gifts: g.gifts, clues: g.clues, powers: g.powers, deliv: g.deliv, pads: g.pads, forks: g.forksN, perf: g.perf, cross: g.crossN, red: g.redRuns, civic: g.civic, fines: g.fines, esc: g.escapes,
    badK: g.badK || '', near: g.near, vaults: g.vaults, grind: Math.round(g.grindM), duels: g.duels, rivLost: g.rivLost, crit: g.critOk, errs };
}
