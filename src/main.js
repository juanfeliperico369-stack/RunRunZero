/* ===== ARRANQUE, BUCLE Y FLUJO DE PARTIDA ===== */
const Q = [];
let lastCh = false, G = null, DEMO = null, GAR = null, mode = 'menu', acc = 0, last = 0, now = 0, count = 0, reviveT = 0, overShown = false, autoplay = false, fpsA = [], qChecked = false, misT = 0, confirmFn = null;
const ERR = [];
window.addEventListener('error', e => { ERR.push(String(e.message || e)); });
window.addEventListener('unhandledrejection', e => { ERR.push('promesa: ' + String(e.reason && e.reason.message || e.reason)); });

function vib(ms) { if (SV.S.set.vib && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { /* sin vibración */ } }
function applyQuality() {
  const q = SV.S.set.q, d = window.devicePixelRatio || 1;
  const sc = q === 'alta' ? 1 : q === 'baja' ? Math.min(1, 1 / d) * 0.8 : Math.min(1, (SV.S.set.qAuto === 'low' ? 1.0 : 1.5) / d);
  RN.quality = q === 'baja' || (q === 'auto' && SV.S.set.qAuto === 'low') ? 0.6 : 1;
  R.resize(sc);
}
function newDemo() { DEMO = newGame({ seed: (Math.random() * 1e9) | 0, veh: SV.S.veh, ai: true, demo: true, cluesLeft: 0 }); }
function newGarage() { GAR = newGame({ seed: 7, veh: SV.S.veh, demo: true }); GAR.obs = []; GAR.coins = []; GAR.items = []; GAR.scen = GAR.scen.filter(s => Math.abs(s.x) > 9); }
function refreshPlayer(vid) { RN.setPlayer(cosCfg(SV.S), vid || SV.S.veh); }

const daySeed = () => { let h = 2166136261; for (const c of 'RS' + dayKey()) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
function startRun(ch) {
  const S = SV.S; AU.init(); AU.music(true); if (ch === undefined) ch = lastCh; lastCh = !!ch;
  UI.ov('oOver', 0); UI.ov('oRevive', 0); UI.ov('oPause', 0); UI.hideScreens(); UI.preview = null;
  refreshPlayer();
  G = newGame({ seed: ch ? daySeed() : (Math.random() * 4294967295) >>> 0, veh: S.veh, up: S.up, mult: 1 + 0.25 * rankOf(S.xp), cluesLeft: STORY.length - S.clues, letters: (S.word.day !== dayKey() ? (S.word = { day: dayKey(), got: '', done: S.word.done || 0, doneDay: S.word.doneDay || '' }, 'EMSAY') : S.word.doneDay === dayKey() ? '' : 'EMSAY'.slice(S.word.got.length)), tut: S.tut === 1, pet: S.cos.mascota && S.cos.mascota !== 'm0', fit: S.fit, inj: S.inj, perks: perksOf(S), skill: S.skill, rivLv: rankOf(S.xp) });
  if (ch) { G.race = 1; G.nextRiv = 260; }
  $('enL').textContent = ENL[G.veh.kind]; $('bBrake').classList.remove('hit');
  Q.length = 0; acc = 0; overShown = false; reviveT = 0; RN.parts.length = 0; UI.hud = { s: -1, c: -1, d: -1, m: '', pk: '', b: -1, sl: 99, dl: '', en: -1, top: '' };
  $('hud').hidden = false; $('hBanner').innerHTML = ''; UI.tut(-1); $('hCnt').hidden = true;
  if (S.boostTip < 3) { S.boostTip++; setTimeout(() => { if (mode === 'play') UI.toast('⚡ IMPULSO gasta ' + ENL[G.veh.kind].toLowerCase() + ' · ■ FRENO para semáforos, bajadas y animales', 'g'); }, 2600); }
  G.ch = !!ch; UI.banner(0); AU.zone = 0; mode = 'play'; if (ch) UI.toast('★ CARRERA DEL DÍA · misma ruta para todos y rivales en pista', 'g'); fpsA = []; qChecked = false;
}
function toMenu() {
  mode = 'menu'; G = null; $('hud').hidden = true; UI.ov('oOver', 0); UI.ov('oRevive', 0); UI.ov('oPause', 0);
  newDemo(); refreshPlayer(); UI.show('sCover'); AU.zone = 0;
}
function pause(on) {
  if (on && mode === 'play') { if (G) G.p.brake = 0; $('bBrake').classList.remove('hit'); mode = 'pause'; UI.ov('oPause', 1); $('pSfx').textContent = 'Sonido: ' + (SV.S.set.sfx ? 'SÍ' : 'NO'); $('pMus').textContent = 'Música: ' + (SV.S.set.music ? 'SÍ' : 'NO'); }
  else if (!on && mode === 'pause') { UI.ov('oPause', 0); mode = 'count'; count = 3; }
}
function checkMissions(g, final) {
  const S = SV.S;
  S.mis.forEach((m, i) => {
    const d = misDef(m.k), tg = d.n[m.lvl], v = misVal(m.k, g), cur = d.run ? v : m.prog + v;
    if (cur >= tg) {
      S.coins += MREW[m.lvl]; S.xp += MXP[m.lvl]; S.misDone++; if (S.misDone % 3 === 0) { S.stars++; UI.toast('✦ +1 estrella por 3 misiones', 'g'); }
      S.misLvl[m.k] = Math.min(4, (S.misLvl[m.k] || 0) + 1);
      UI.toast('✔ MISIÓN: ' + misText(m) + ' · +◉' + MREW[m.lvl], 'c'); AU.sfx('buy');
      const nm = newMis(S, S.mis.map(x => x.k)); const nd = misDef(nm.k); nm.prog = nd.run || final ? 0 : -misVal(nm.k, g); S.mis[i] = nm;
    } else if (final) { if (d.run) m.best = Math.max(m.best || 0, v); else m.prog += v; }
  });
}
function events(g) {
  const S = SV.S, play = g === G;
  for (const e of g.ev) {
    RN.events(g, e);
    if (!play) continue;
    switch (e.k) {
      case 'coin': AU.sfx('coin'); break;
      case 'jump': case 'jump2': case 'land': case 'duck': case 'lane': case 'smash': case 'trick': case 'pEnd': case 'shield': AU.sfx(e.k); break;
      case 'stumble': AU.sfx('stumble'); vib(40); break;
      case 'crash': AU.sfx('crash'); vib([60, 40, 90]); break;
      case 'power': AU.sfx('power'); UI.toast({ magnet: '∩ IMÁN', turbo: '⚡ TURBO', x2: '×2 PUNTOS', shield: '⛑ CASCO PROTECTOR', glide: '☂ PARAGUAS PLANEADOR: ¡a volar!' }[e.a] || 'PODER', 'g'); break;
      case 'zone': UI.banner(e.a); AU.sfx('zone'); AU.zone = e.a; break;
      case 'clue': {
        AU.sfx('clue'); if (S.clues < STORY.length) { S.clues++; UI.toast('📰 PÁGINA ' + S.clues + ' RECUPERADA: ' + STORY[S.clues - 1][0], 'c'); }
        break;
      }
      case 'gift': {
        AU.sfx('gift'); const a = e.a;
        if (a.k === 'coins' || a.k === 'big') UI.toast('🎁 REGALO: ◉ ' + a.a + ' monedas', 'm');
        else if (a.k === 'star') UI.toast('🎁 REGALO: ✦ 1 estrella', 'm');
        else if (a.k === 'power') UI.toast('🎁 REGALO: poder ' + a.a.toUpperCase(), 'm');
        else if (a.k === 'cos') {
          const pool = Object.values(COSI).filter(c => !S.ownedCos[c.id] && !c.st);
          if (pool.length) { const c = pool[Math.floor(Math.random() * pool.length)]; S.ownedCos[c.id] = 1; UI.toast('🎁 COSMÉTICO NUEVO: ' + c.name, 'm'); }
          else { g.coinsRun += 300; UI.toast('🎁 REGALO: ◉ 300 monedas', 'm'); }
        }
        break;
      }
      case 'tut': UI.tut(e.a); AU.sfx('tut'); break;
      case 'tutOk': UI.tut(-1); if (g.tut >= TUT.length && S.tut) { S.tut = 0; SV.save(); } break;
      case 'revive': AU.sfx('revive'); break;
      case 'boost': AU.pumpLv = e.a; AU.sfx('pump'); break;
      case 'deliver': AU.sfx('deliver'); vib(15); UI.pop(DICO[e.a.k] + (e.a.q === 2 ? ' ¡PERFECTA! +' : ' ' + DEL[e.a.k][2] + ' +') + fmt(e.a.pts) + (g.dStreak > 1 ? ' · racha ×' + g.dStreak : '')); break;
      case 'dnone': if (now - (events.dn || 0) > 1.5) { events.dn = now; UI.pop('Nada que entregar de ese lado', 'miss'); } break;
      case 'dstolen': AU.sfx('dmiss'); UI.pop('🏁 ' + e.a.name + ' te quitó una entrega', 'miss'); break;
      case 'vault': AU.sfx('jump'); break;
      case 'trickGo': AU.sfx('trick'); break;
      case 'near': AU.sfx('near'); UI.pop('¡ROZADA! +' + Math.round(15 * g.mult)); break;
      case 'grindOn': AU.sfx('grind'); UI.pop('¡BARANDA! desliza y suma'); break;
      case 'grind': AU.sfx('grind'); break;
      case 'brake': AU.sfx('brake'); break;
      case 'noen': if (now - (events.ne || 0) > 1.2) { events.ne = now; UI.pop('Sin ' + ENL[g.veh.kind].toLowerCase() + ' · espera a recuperar', 'miss'); AU.sfx('dmiss'); } break;
      case 'combo': AU.sfx('combo'); break;
      case 'rival': AU.sfx('zone'); UI.toast('🏁 ' + e.a.name + ' viene a pasarte: usa ⚡ y no lo dejes', 'm'); break;
      case 'rivPass': AU.sfx('dmiss'); UI.pop('🏁 ' + e.a.name + ' te pasó · −' + Math.round(40 * g.mult), 'miss'); break;
      case 'rivWin': AU.sfx('rank'); UI.pop('🏁 ¡Pasaste a ' + e.a.name + '! +' + Math.round(250 * g.mult)); break;
      case 'rivLost': UI.toast('🏁 ' + e.a.name + ' se escapó con ' + g.stolen + ' entrega(s)'); break;
      case 'chase': if (e.a === 'pol') { AU.sfx('siren'); UI.toast('🚓 ¡Exceso de velocidad! Acelera a fondo o frena y cambia de carril', 'm'); } else { AU.sfx('bark'); UI.toast('🐕 ¡Te persigue un perro! Acelera o frena para calmarlo', 'm'); } break;
      case 'polEsc': AU.sfx('rank'); UI.pop('🚓 ¡Lo perdiste! +' + Math.round(300 * g.mult)); break;
      case 'polDodge': AU.sfx('rank'); UI.pop('🚓 ¡Maniobra evasiva! +' + Math.round(400 * g.mult)); break;
      case 'polFine': AU.sfx('crash'); vib(60); UI.pop('🚓 Multa por exceso: −◉ ' + e.a, 'miss'); break;
      case 'dogCalm': UI.pop('🐕 El perro se calmó'); break;
      case 'dogEsc': UI.pop('🐕 ¡Lo dejaste atrás! +' + Math.round(80 * g.mult)); break;
      case 'dogBite': AU.sfx('bark'); UI.pop('🐕 ¡Te alcanzó el perro!', 'miss'); break;
      case 'redrun': AU.sfx('siren'); UI.pop('🚦 ¡Te pasaste el rojo!', 'miss'); break;
      case 'civic': AU.sfx('buy'); UI.pop('🚦 Buen ciudadano +' + Math.round(60 * g.mult)); break;
      case 'crit': AU.sfx('warn'); break;
      case 'splash': AU.sfx('duck'); break;
      case 'letter': {
        const W = S.word; if (W.day !== dayKey()) { W.day = dayKey(); W.got = ''; } W.got += e.a; AU.sfx('clue'); UI.pop('🔤 LETRA ' + e.a + ' · ' + 'EMSAY'.split('').map((c, i) => i < W.got.length ? c : '_').join(' '));
        if (W.got === 'EMSAY') { W.doneDay = dayKey(); W.done = (W.done || 0) + 1; S.stars += 2; g.coinsRun += 500; UI.toast('🔤 ¡EMSAY COMPLETO! +✦ 2 · +◉ 500', 'g'); AU.sfx('rank'); }
        SV.save(); break;
      }
      case 'dmiss': AU.sfx('dmiss'); UI.pop('✉ Entrega perdida', 'miss'); break;
    }
  }
  g.ev.length = 0;
}
function onDeath() {
  overShown = true; const S = SV.S, cost = G.revives + 1;
  if (G.revives < 2 && (S.stars + G.starsRun >= cost || S.coins + G.coinsRun >= 500 * cost)) {
    const st = S.stars + G.starsRun >= cost; $('rvBtn').textContent = st ? `Revivir · ✦ ${cost}` : `Revivir · ◉ ${fmt(500 * cost)}`; $('rvBtn').dataset.cur = st ? 's' : 'c';
    $('rvWhy').textContent = 'Te tumbó ' + G.cause + '.'; UI.ov('oRevive', 1); mode = 'dead'; reviveT = 5;
  } else endRun();
}
function doRevive() {
  const S = SV.S, cost = G.revives + 1;
  if ($('rvBtn').dataset.cur === 's') { let c = cost; const fromRun = Math.min(G.starsRun, c); G.starsRun -= fromRun; c -= fromRun; S.stars -= c; }
  else { let c = 500 * cost; const fromRun = Math.min(G.coinsRun, c); G.coinsRun -= fromRun; c -= fromRun; S.coins -= c; }
  UI.ov('oRevive', 0); revive(G); overShown = false; mode = 'count'; count = 3;
}
function endRun() {
  const S = SV.S, g = G; UI.ov('oRevive', 0); mode = 'over'; $('hud').hidden = true;
  checkMissions(g, true);
  const rk0 = rankOf(S.xp), xp = Math.floor(g.score / 25); S.xp += xp; const rk1 = rankOf(S.xp);
  const rec = g.score > S.best, recD = g.p.s > S.bestDist;
  S.coins += g.coinsRun; S.stars += g.starsRun; S.best = Math.max(S.best, Math.floor(g.score)); S.bestDist = Math.max(S.bestDist, Math.floor(g.p.s));
  S.tot.deliv = (S.tot.deliv || 0) + g.deliv;
  // el cuerpo: capacidad física (a pie y con vehículos de fuerza), habilidad (trucos) y lesiones
  const hum = g.veh.kind === 'h', f0 = S.fit, k0 = S.skill, inj0 = S.inj, C = S.cnt;
  if (hum) S.fit = Math.min(100, S.fit + g.p.s / 500 * (g.veh.id === 'foot' ? 1.6 : 1) * (1 - S.fit / 115));
  S.skill = Math.min(100, S.skill + (g.parkTr * 0.6 + g.tricks * 0.12 + g.grindM / 90 + g.near * 0.05 + g.perf * 0.04) * (1 - S.skill / 115));
  if (g.veh.id === 'foot') C.footM += Math.floor(g.p.s); C.near += g.near; C.perf += g.perf; C.boosts += g.boosts; C.civic += g.civic; C.grind += Math.floor(g.grindM); C.duels += g.duels; C.esc += g.escapes + g.dodges;
  S.riv.w += g.duels; S.riv.l += g.rivLost;
  if (g.hard) S.inj = Math.min(3, S.inj + 1); else if (g.p.s > 1500 && S.inj > 0) S.inj--;
  S.tot.runs++; S.tot.dist += Math.floor(g.p.s); S.tot.coins += g.coinsRun; S.tot.time += Math.round(g.t);
  let extra = '';
  if (g.ch) {
    const d = dayKey(); if (S.ch.day !== d) { S.ch.day = d; S.ch.best = 0; }
    const nb = g.p.s > S.ch.best; S.ch.best = Math.max(S.ch.best, Math.floor(g.p.s));
    if (g.p.s >= 1500 && S.ch.rew !== d) { S.ch.rew = d; S.stars += 2; extra += '<div class="badge">★ CARRERA SUPERADA: +✦ 2</div>'; }
    extra += `<p><b>Carrera del día:</b> ${g.duels} duelo(s) ganado(s) · ${nb ? '¡nuevo mejor! ' : ''}${fmt(S.ch.best)} m · meta 1.500 m</p>`;
  }
  if (rk1 > rk0) { S.coins += 250 * rk1; S.stars += 1 + Math.floor(rk1 / 3); extra += `<div class="badge">¡NUEVO RANGO: ${esc(RANKS[rk1])}!</div><p>Premio: ◉ ${250 * rk1} · ✦ ${1 + Math.floor(rk1 / 3)} · puntos ×${(1 + 0.25 * rk1).toFixed(2)}</p>`; AU.sfx('rank'); }
  S.runs.push({ d: new Date().toISOString(), seed: g.seed, veh: g.veh.id, dist: Math.floor(g.p.s), score: Math.floor(g.score), coins: g.coinsRun, stars: g.starsRun, clues: g.clues, gifts: g.gifts, jumps: g.jumps, ducks: g.ducks, tricks: g.tricks, powers: g.powers, trucks: g.trucks, deliv: g.deliv, ch: g.ch ? 1 : 0, ed: g.edition + 1, rev: g.revives, time: Math.round(g.t), cause: g.cause });
  if (S.runs.length > 200) S.runs.splice(0, S.runs.length - 200);
  SV.save();
  $('oDate').textContent = new Date().toLocaleDateString('es-CO');
  $('oBadge').innerHTML = rec ? '<span class="badge">★ ¡NUEVO RÉCORD!</span>' : recD ? '<span class="badge">★ ¡RÉCORD DE DISTANCIA!</span>' : '';
  $('oStats').innerHTML = `<div class="kv"><span>Puntos</span><b>${fmt(g.score)}</b><span>Distancia</span><b>${fmt(g.p.s)} m</b><span>Monedas</span><b>◉ ${fmt(g.coinsRun)}</b><span>Edición alcanzada</span><b>Nº ${g.edition + 1}</b><span>Entregas · perfectas</span><b>✉ ${g.deliv} · ${g.perf}</b><span>Semáforos · duelos · rozadas</span><b>${g.civic} · ${g.duels} · ${g.near}</b><span>Trucos · Furgones</span><b>${g.tricks} · ${g.trucks}</b><span>XP ganada</span><b>+${fmt(xp)}</b><span>Mejor</span><b>${fmt(S.best)}</b></div>`;
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  extra += (g.clues ? `<p><b>📰 ${g.clues} página(s) nueva(s).</b> Léelas en Historia.</p>` : '') + `<p style="font-family:var(--fs);font-style:italic">Te tumbó ${esc(g.cause || 'el destino')}. Consejo: ${esc(tip)}</p>`;
  extra += `<p><b>Físico</b> ${f0.toFixed(1)} → ${S.fit.toFixed(1)} · <b>Habilidad</b> ${k0.toFixed(1)} → ${S.skill.toFixed(1)}${hum ? '' : ' <small>(el físico solo crece a pie o con vehículos de fuerza)</small>'}</p>`;
  if (S.inj > inj0) extra += '<p class="inj">🩹 Choque fuerte: lesión leve (−12 % de aliento). Cúrala con el botiquín del garaje o rodando 1.500 m sin choques fuertes.</p>'; else if (S.inj < inj0) extra += '<p>💪 Te recuperaste de una lesión.</p>';
  const ach = checkAch(g); if (ach.length) extra += '<p><b>🏆 Logros nuevos:</b> ' + ach.map(a => esc(a[1])).join(', ') + '</p>';
  $('oExtra').innerHTML = extra; UI.ov('oOver', 1);
}
function claimDaily() {
  const S = SV.S, today = dayKey(), y = dayKey(new Date(Date.now() - 864e5));
  S.daily.streak = S.daily.last === y ? S.daily.streak + 1 : 1; S.daily.last = today;
  const r = DAILY[(S.daily.streak - 1) % 7];
  if (typeof r === 'string') S.stars += +r.slice(1); else S.coins += r;
  checkAch(null); SV.save(); UI.ov('oDaily', 0); AU.init(); AU.sfx('gift'); UI.toast('🎁 Regalo diario: ' + (typeof r === 'string' ? '✦ ' + r.slice(1) : '◉ ' + r), 'm'); UI.cover();
}
function askDaily() {
  const S = SV.S; if (S.daily.last === dayKey()) return;
  const y = dayKey(new Date(Date.now() - 864e5)), st = S.daily.last === y ? S.daily.streak + 1 : 1;
  $('dlBody').innerHTML = '<div class="row" style="justify-content:center">' + DAILY.map((r, i) => `<span class="chip" style="${i === (st - 1) % 7 ? 'background:var(--amb)' : ''}">Día ${i + 1}<br><b>${typeof r === 'string' ? '✦ ' + r.slice(1) : '◉ ' + r}</b></span>`).join('') + `</div><p class="pag" style="margin-top:8px">Racha: ${st} día(s)</p>`;
  UI.ov('oDaily', 1);
}
function confirmBox(txt, fn) { $('cfT').textContent = txt; confirmFn = fn; UI.ov('oConf', 1); }

/* ---- acciones de botones ---- */
function act(a, arg, el) {
  const S = SV.S; AU.init(); if (a !== 'play') AU.sfx('click');
  switch (a) {
    case 'play': startRun(arg === 'ch' ? true : arg === 'n' ? false : undefined); break;
    case 'go':
      if (mode === 'over') { UI.ov('oOver', 0); mode = 'menu'; G = null; newDemo(); }
      UI.show(arg); if (arg === 'sGarage') { newGarage(); refreshPlayer(); } else { UI.preview = null; refreshPlayer(); }
      break;
    case 'pause': pause(true); break;
    case 'resume': pause(false); break;
    case 'restart': UI.ov('oPause', 0); startRun(); break;
    case 'quit': toMenu(); break;
    case 'revive': doRevive(); break;
    case 'norevive': endRun(); break;
    case 'tsfx': S.set.sfx = S.set.sfx ? 0 : 1; AU.set(S.set.sfx, S.set.music); SV.save(); $('pSfx').textContent = 'Sonido: ' + (S.set.sfx ? 'SÍ' : 'NO'); break;
    case 'tmus': S.set.music = S.set.music ? 0 : 1; AU.set(S.set.sfx, S.set.music); SV.save(); $('pMus').textContent = 'Música: ' + (S.set.music ? 'SÍ' : 'NO'); break;
    case 'gtab': UI.gtab = arg; UI.garage(); break;
    case 'rtab': UI.rtab = arg; UI.rank(); break;
    case 'veh': {
      const v = VEHI[arg]; if (!v) break;
      if (S.owned[arg]) { S.veh = arg; UI.preview = null; SV.save(); refreshPlayer(); UI.garage(); }
      else { UI.preview = arg; refreshPlayer(arg); UI.garage(); if (S.coins >= v.price) confirmBox(`¿Comprar ${v.name} por ◉ ${fmt(v.price)}?`, () => { S.coins -= v.price; S.owned[arg] = 1; S.veh = arg; UI.preview = null; checkAch(null); SV.save(); AU.sfx('buy'); refreshPlayer(); UI.garage(); }); else UI.toast(`Te faltan ◉ ${fmt(v.price - S.coins)} para ${v.name}`); }
      break;
    }
    case 'cos': {
      const c = COSI[arg]; if (!c) break;
      const equip = () => { S.cos[c.cat] = c.id; SV.save(); refreshPlayer(UI.preview); UI.garage(); };
      if (S.ownedCos[arg]) equip();
      else if (c.ach) UI.toast('Se desbloquea con el logro: ' + priceTxt(c).replace('🏆 Logro: ', ''));
      else if (c.st ? S.stars >= c.st : S.coins >= (c.p || 0)) confirmBox(`¿Comprar «${c.name}» por ${priceTxt(c)}?`, () => { if (c.st) S.stars -= c.st; else S.coins -= c.p || 0; S.ownedCos[c.id] = 1; AU.sfx('buy'); checkAch(null); equip(); });
      else UI.toast('No te alcanza: ' + priceTxt(c));
      break;
    }
    case 'upg': {
      const lv = S.up[arg] || 0; if (lv >= 5) break; const pr = UPC[lv];
      if (S.coins >= pr) { S.coins -= pr; S.up[arg] = lv + 1; SV.save(); AU.sfx('buy'); UI.garage(); } else UI.toast(`Te faltan ◉ ${fmt(pr - S.coins)}`);
      break;
    }
    case 'read': UI.read(+arg); break;
    case 'closeRead': if (el && el.id === 'oRead' || el.tagName === 'BUTTON') { UI.ov('oRead', 0); UI.story(); } break;
    case 'set': S.set[arg] = S.set[arg] ? 0 : 1; SV.save(); document.body.classList.toggle('lh', !!S.set.lh); AU.set(S.set.sfx, S.set.music); $('hFps').hidden = !S.set.fps; UI.settings(); break;
    case 'qual': S.set.q = arg; SV.save(); applyQuality(); UI.settings(); break;
    case 'tut': S.tut = 1; SV.save(); UI.toast('El tutorial saldrá en tu próxima partida'); break;
    case 'exp': saveFile('runscooter-partidas-' + dayKey() + '.json', exportJSON(), 'application/json').then(ok => ok && UI.toast('Partidas exportadas ✔')); break;
    case 'csv': saveFile('runscooter-partidas-' + dayKey() + '.csv', '﻿' + exportCSV(), 'text/csv').then(ok => ok && UI.toast('CSV exportado ✔')); break;
    case 'imp': $('fImp').click(); break;
    case 'reset': confirmBox('¿Borrar TODO tu progreso? No se puede deshacer (exporta antes).', () => { SV.S = SV.def(); SV.fix(); SV.save(); refreshPlayer(); UI.settings(); UI.toast('Progreso borrado'); }); break;
    case 'cfYes': UI.ov('oConf', 0); if (confirmFn) { const f = confirmFn; confirmFn = null; f(); } break;
    case 'cfNo': UI.ov('oConf', 0); confirmFn = null; if (UI.preview) { UI.preview = null; refreshPlayer(); UI.garage(); } break;
    case 'daily': claimDaily(); break;
    case 'stab': UI.stab = arg; UI.story(); break;
    case 'mus': S.set.mus = arg; SV.save(); AU.style = arg; UI.settings(); break;
    case 'heal': if (S.inj > 0 && S.coins >= 250) { S.coins -= 250; S.inj--; SV.save(); AU.sfx('buy'); UI.garage(); } else UI.toast(S.inj ? 'Te faltan ◉ ' + (250 - S.coins) + ' para el botiquín' : 'No tienes lesiones'); break;
    case 'ment': {
      const [id, how] = String(arg).split(':'), m = MENT.find(x => x.id === id); if (!m || S.ment[id]) break;
      const learn = () => { S.ment[id] = 1; if (m.veh) { S.owned[m.veh] = 1; } checkAch(null); SV.save(); AU.sfx('rank'); UI.ment(); UI.toast('🎓 ' + m.name + ': ' + m.hab + (m.veh ? ' · ¡' + VEHI[m.veh].name + ' en tu garaje!' : ' aprendida'), 'g'); };
      if (how === 'f') { if (mentProg(S, m) >= m.n) learn(); }
      else if (S.coins >= m.price) confirmBox(`¿Pagar ◉ ${fmt(m.price)} a ${m.name} por «${m.hab}»?`, () => { S.coins -= m.price; learn(); }); else UI.toast('Te faltan ◉ ' + fmt(m.price - S.coins));
      break;
    }
    case 'share': {
      const g = G, url = (document.querySelector('meta[property="og:url"]') || {}).content || location.href;
      const txt = g ? `¡Hice ${fmt(g.score)} puntos, ${fmt(g.p.s)} m y ${g.deliv} entregas en Run Scooter! 🛴 ¿Me ganas?` : '¡Juega Run Scooter, la ciclovía sin fin! 🛴';
      const P = window.Capacitor && window.Capacitor.Plugins;
      const wa = () => { window.open('https://wa.me/?text=' + encodeURIComponent(txt + ' ' + url), '_blank'); };
      if (P && P.Share) P.Share.share({ title: 'Run Scooter', text: txt, url }).catch(wa);
      else if (navigator.share) navigator.share({ title: 'Run Scooter', text: txt, url }).catch(e => { if (!e || e.name !== 'AbortError') wa(); });
      else wa();
      break;
    }
  }
}

/* ---- entrada: deslizar / teclado ---- */
let sw = null;
function key(k) { if (mode === 'play' && G && G.p.alive && (Q.length < 4 || k === 'k')) Q.push(k); }
window.addEventListener('pointerdown', e => { if (mode !== 'play') return; if (e.target.closest && e.target.closest('button')) return; sw = { x: e.clientX, y: e.clientY, id: e.pointerId, used: false }; }, { passive: true });
window.addEventListener('pointermove', e => {
  if (!sw || sw.used || e.pointerId !== sw.id) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y, th = 24;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < th) return; sw.used = true;
  key(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'L' : 'R') : (dy < 0 ? 'U' : 'D'));
}, { passive: true });
window.addEventListener('pointerup', () => { sw = null; }, { passive: true });
window.addEventListener('pointercancel', () => { sw = null; }, { passive: true });
window.addEventListener('keyup', e => { if ((e.key === 'x' || e.key === 'X' || e.key === 'Control') && G) Q.push('k'); });
window.addEventListener('keydown', e => {
  const k = e.key, m = { ArrowLeft: 'L', a: 'L', A: 'L', ArrowRight: 'R', d: 'R', D: 'R', ArrowUp: 'U', w: 'U', W: 'U', ' ': 'U', ArrowDown: 'D', s: 'D', S: 'D', f: 'B', F: 'B', Shift: 'B', q: 'Q', Q: 'Q', e: 'E', E: 'E', x: 'K', X: 'K', Control: 'K' }[k];
  if (m && (mode === 'play')) { e.preventDefault(); if (!e.repeat) key(m); return; }
  if ((k === 'Escape' || k === 'p' || k === 'P') && (mode === 'play' || mode === 'pause')) { e.preventDefault(); pause(mode === 'play'); }
  if (k === 'Enter' && mode === 'menu' && UI.cur === 'sCover') startRun(false);
});
document.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; act(b.dataset.act, b.dataset.arg, e.target); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { if (mode === 'play') pause(true); if (AU.ctx) AU.ctx.suspend().catch(() => {}); } else if (AU.ctx) AU.ctx.resume().catch(() => {}); });
document.addEventListener('contextmenu', e => { if (mode === 'play') e.preventDefault(); });

/* ---- bucle principal ---- */
function loop(ts) {
  requestAnimationFrame(loop);
  now = ts / 1000; let dt = Math.min(0.1, Math.max(0, now - (last || now))); last = now;
  try { tick(dt); } catch (e) { ERR.push('tick: ' + (e && e.stack || e)); }
}
function tick(dt) {
  let g = DEMO, view = 'menu';
  if (mode === 'menu' && UI.cur === 'sGarage') { g = GAR; view = 'garage'; }
  else if (mode !== 'menu') { g = G; view = 'play'; }
  if (!g) return;
  if (mode === 'menu' && (UI.cur === 'sRank' || UI.cur === 'sStory' || UI.cur === 'sMis' || UI.cur === 'sAch' || UI.cur === 'sMent' || UI.cur === 'sSet')) return;
  if (mode === 'play' || (mode === 'menu' && view === 'menu')) {
    acc += dt; let n = 0;
    while (acc >= DT && n < 14) {
      let inp = mode === 'play' ? (Q.shift() || null) : null;
      if ((autoplay || mode === 'menu') && n % 3 === 0) inp = aiThink(g, mode === 'menu' ? 0.85 : 1) || inp;
      if (!inp && (autoplay || mode === 'menu') && (g._bt = (g._bt || 0) + 1) % 40 === 0 && g.p.en > g.enMax * 0.5 && !g.p.brake) inp = 'B';
      step(g, DT, inp); acc -= DT; n++;
    }
    if (n >= 14) acc = 0;
    events(g);
    if (mode === 'menu' && !g.p.alive && g.p.deadT > 1.5) { newDemo(); }
    if (mode === 'play') {
      UI.updHud(g);
      if ((misT += dt) > 0.3) { misT = 0; checkMissions(g, false); }
      if (!g.p.alive && g.p.deadT > 1.1 && !overShown) onDeath();
      fpsA.push(dt); if (fpsA.length > 240) fpsA.shift();
      if (!qChecked && fpsA.length >= 240 && SV.S.set.q === 'auto') { qChecked = true; const avg = fpsA.reduce((a, b) => a + b, 0) / fpsA.length; if (avg > 1 / 40 && SV.S.set.qAuto !== 'low') { SV.S.set.qAuto = 'low'; SV.save(); applyQuality(); } }
    }
  } else if (mode === 'dead' || mode === 'over') {
    if (mode === 'dead') { reviveT -= dt; $('rvRing').textContent = Math.max(0, Math.ceil(reviveT)); if (reviveT <= 0) endRun(); }
    step(g, dt, null); g.ev.length = 0;
  } else if (mode === 'count') {
    count -= dt; const el = $('hCnt'); el.hidden = count <= 0; el.textContent = Math.ceil(count);
    if (count <= 0) { mode = 'play'; acc = 0; }
  }
  if (view !== 'garage') RN.trail(g, dt, SV.S.cos.estela);
  const rn = view === 'play' && RN.rk > 0.35; if (rn !== tick.rain) { tick.rain = rn; $('rain').classList.toggle('on', rn); AU.rainOn(rn); }
  if (rn && mode === 'play' && Math.random() < dt * 0.06) { const f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); setTimeout(() => AU.sfx('thunder'), 300 + Math.random() * 600); }
  if (SV.S.set.fps && mode === 'play') { const f = fpsA.length ? fpsA.length / fpsA.reduce((a, b) => a + b, 0) : 0; $('hFps').textContent = Math.round(f) + ' FPS · ' + R.draws + ' dibujos'; }
  AU.tempo = 112 + (g.p.v > 14 ? Math.min(26, (g.p.v - 14) * 1.2) : 0); AU.inPlay = mode === 'play' || mode === 'count';
  const sir = mode === 'play' && !!(g.pol && g.pol.k === 'pol'); if (sir !== tick.sir) { tick.sir = sir; AU.sirenOn(sir); }
  RN.frame(g, view, now, dt);
}

/* ---- inicio ---- */
function boot() {
  SV.load();
  const cv = $('cv'); let ok = false;
  try { ok = R.init(cv); } catch (e) { ERR.push('webgl: ' + e.message); }
  if (!ok) { document.body.insertAdjacentHTML('beforeend', '<div class="nogl"><div><h1 class="mega" style="font-size:60px;color:#1d4e79">RUN SCOOTER</h1><p>Tu navegador no tiene WebGL activado. Prueba con Chrome, Safari o Firefox actualizados.</p></div></div>'); return; }
  applyQuality(); window.addEventListener('resize', applyQuality); document.body.classList.toggle('lh', !!SV.S.set.lh);
  RN.init(); AU.set(SV.S.set.sfx, SV.S.set.music);
  const atlas = () => { try { R.texture(makeAtlas()); } catch (e) { ERR.push('atlas: ' + e.message); } };
  const fl = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('40px "Titulos"'), document.fonts.load('800 40px "Cuerpo"')]) : Promise.resolve();
  Promise.race([fl, new Promise(r => setTimeout(r, 1500))]).then(atlas, atlas);
  newDemo(); refreshPlayer(); UI.show('sCover'); $('hFps').hidden = !SV.S.set.fps;
  $('fImp').addEventListener('change', e => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { if (importJSON(String(r.result))) { refreshPlayer(); UI.show('sSet'); UI.toast('Partidas importadas ✔'); } else UI.toast('Archivo no válido'); }; r.readAsText(f); e.target.value = ''; });
  const bk = $('bBrake'), rel = () => { if (bk.classList.contains('hit')) { bk.classList.remove('hit'); if (G) Q.push('k'); } };
  bk.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (mode !== 'play') return; try { bk.setPointerCapture(e.pointerId); } catch (x) { /* sin captura */ } key('K'); bk.classList.add('hit'); });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) bk.addEventListener(t, rel);
  for (const [id, k] of [['bDelL', 'Q'], ['bDelR', 'E']]) $(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (mode === 'play') key(k); });
  AU.style = SV.S.set.mus || 'mix';
  const bb = $('bBoost'); bb.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (mode !== 'play') return; key('B'); bb.classList.add('hit'); clearTimeout(bb._t); bb._t = setTimeout(() => bb.classList.remove('hit'), 70); });
  setTimeout(askDaily, 600);
  requestAnimationFrame(loop);
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol) && !window.Capacitor && !/[?&]nosw/.test(location.search)) navigator.serviceWorker.register('sw.js').catch(e => ERR.push('sw: ' + e.message));
}
window.__RS = { simulate, aiThink, ERR, get G() { return G; }, get mode() { return mode; }, get S() { return SV.S; }, start: startRun, menu: toMenu, act, key, set autoplay(v) { autoplay = !!v; }, R, RN, UI, SV, exportJSON, exportCSV, importJSON, VERSION };
boot();
