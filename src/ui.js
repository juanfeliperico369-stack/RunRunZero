/* ===== INTERFAZ · progreso, guardado, pantallas ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = n => Math.round(n).toLocaleString('es-CO');
const dayKey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const VERSION = '2.4.0', SKEY = 'runscooter.v1';
const MREW = [100, 200, 350, 550, 800], MXP = [150, 300, 500, 800, 1200], DAILY = [100, 150, 200, 's1', 300, 400, 's3'];

const SV = {
  S: null,
  def() {
    return { v: 1, coins: 0, stars: 0, xp: 0, best: 0, bestDist: 0, veh: 'foot', owned: { foot: 1 }, cos: { casco: 'h0', ropa: 'r0', pintura: 'p0', estela: 't0', mascota: 'm0', piel: 's0', pelo: 'k0' }, ownedCos: { h0: 1, r0: 1, p0: 1, t0: 1, m0: 1 }, ach: {},
      fit: 25, skill: 0, inj: 0, ment: {}, vup: {}, cnt: { footM: 0, near: 0, perf: 0, boosts: 0, civic: 0, grind: 0, duels: 0, esc: 0 }, riv: { w: 0, l: 0 },
      up: { magnet: 0, turbo: 0, x2: 0, gift: 0, en: 0, rue: 0, fre: 0, mor: 0 }, clues: 0, readClues: 0, mis: [], misLvl: {}, misDone: 0, daily: { last: '', streak: 0 }, ch: { day: '', best: 0, rew: '' }, word: { day: '', got: '', done: 0, doneDay: '' }, boostTip: 0, rank: 0,
      set: { sfx: 1, music: 1, vib: 1, q: 'auto', fps: 0, lh: 0, mus: 'mix' }, tut: 1, runs: [], tot: { runs: 0, dist: 0, coins: 0, time: 0, deliv: 0 }, created: Date.now() };
  },
  merge(a, b) {
    if (!b || typeof b !== 'object' || Array.isArray(b)) return a;
    for (const k of Object.keys(b)) {
      const av = a[k], bv = b[k];
      if (av === undefined) { if (['number', 'string', 'boolean'].includes(typeof bv)) a[k] = bv; else if (bv && typeof bv === 'object' && !Array.isArray(bv)) a[k] = this.merge({}, bv); continue; }
      if (Array.isArray(av)) { if (Array.isArray(bv)) a[k] = bv.slice(0, 300); }
      else if (av && typeof av === 'object') a[k] = this.merge(av, bv);
      else if (typeof av === typeof bv && (typeof bv !== 'number' || Number.isFinite(bv))) a[k] = bv;
    }
    return a;
  },
  load() { let d = null; try { d = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { d = null; } this.S = this.merge(this.def(), d); this.fix(); return this.S; },
  fix() {
    const S = this.S;
    S.owned.foot = 1; if (!VEHI[S.veh] || !S.owned[S.veh]) S.veh = 'foot';
    for (const id in COSI) { const c = COSI[id]; if (!c.p && !c.st && !c.ach) S.ownedCos[id] = 1; }
    for (const c in S.cos) if (!COS[c]) delete S.cos[c];
    for (const c in COS) if (!COSI[S.cos[c]] || COSI[S.cos[c]].cat !== c || !S.ownedCos[S.cos[c]]) S.cos[c] = COS[c][0].id;
    S.fit = clamp(+S.fit || 0, 0, 100); S.skill = clamp(+S.skill || 0, 0, 100); S.inj = clamp(S.inj | 0, 0, 3);
    S.mis = S.mis.filter(m => m && MIS.some(d => d.k === m.k) && typeof m.prog === 'number').slice(0, 3);
    while (S.mis.length < 3) S.mis.push(newMis(S, S.mis.map(m => m.k)));
    S.clues = clamp(S.clues | 0, 0, STORY.length); S.coins = Math.max(0, S.coins | 0); S.stars = Math.max(0, S.stars | 0);
  },
  save() { try { localStorage.setItem(SKEY, JSON.stringify(this.S)); return true; } catch (e) { return false; } }
};
function newMis(S, ex) { const pool = MIS.filter(m => !ex.includes(m.k)); const d = pool[Math.floor(Math.random() * pool.length)]; return { k: d.k, lvl: Math.min(4, S.misLvl[d.k] || 0), prog: 0, best: 0 }; }
const misDef = k => MIS.find(m => m.k === k);
const misVal = (k, g) => k === 'coins' ? g.coinsRun : k === 'dist' ? g.p.s : k === 'jumps' ? g.jumps : k === 'ducks' ? g.ducks : k === 'gifts' ? g.gifts : k === 'powers' ? g.powers : k === 'tricks' ? g.tricks : k === 'score' ? g.score : k === 'clean' ? Math.max(g.cleanBest, g.cleanS) : k === 'trucks' ? g.trucks : k === 'deliv' ? g.deliv : k === 'dstreak' ? g.dBest : k === 'perf' ? g.perf : k === 'near' ? g.near : k === 'civic' ? g.civic : k === 'grind' ? g.grindM : k === 'duels' ? g.duels : g.edition + 1;
const misText = m => misDef(m.k).t.replace('{n}', fmt(misDef(m.k).n[m.lvl]));
const cosCfg = S => { const h = COSI[S.cos.casco], r = COSI[S.cos.ropa], p = COSI[S.cos.pintura]; return { helmet: h.c, he: !!h.e, shirt: r.a, pants: r.b, se: !!r.e, paint: p.c, pe: !!p.e, pet: S.cos.mascota || 'm0', skin: (COSI[S.cos.piel] || COSI.s0).c, hair: (COSI[S.cos.pelo] || COSI.k0).hair, hc: (COSI[S.cos.pelo] || COSI.k0).c }; };
const perksOf = S => { const k = {}; for (const m of MENT) if (S.ment[m.id] && m.perk) k[m.perk] = 1; return k; };
const mentProg = (S, m) => m.key === 'pages' ? S.clues : (S.cnt[m.key] || 0);
const VUP = [['v', 'Velocidad', 2, 'Motor y ruedas: +2 % de velocidad por nivel'], ['b', 'Impulso', 6, 'Más empuje en cada toque de ⚡'], ['h', 'Manejo', 5, 'Cambios de carril más rápidos']];
const vupCost = (v, lv) => Math.round(Math.max(250, v.price * 0.1) * (lv + 1) / 50) * 50;
/* íconos dibujados de las entregas */
const DSVG = {
  per: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1.5" fill="#f4f1e6" stroke="#111" stroke-width="1.6"/><rect x="5.5" y="7.5" width="13" height="2.6" fill="#111"/><rect x="5.5" y="11.5" width="6" height="5" fill="#8a8f96"/><path d="M13.5 12h5M13.5 14h5M13.5 16h4" stroke="#111" stroke-width="1.2"/></svg>',
  rev: '<svg viewBox="0 0 24 24"><rect x="5" y="2.5" width="14" height="19" rx="1.2" fill="#39c8ff" stroke="#111" stroke-width="1.6"/><rect x="7" y="4.5" width="10" height="3" fill="#111"/><circle cx="12" cy="13" r="3.6" fill="#ffc23a" stroke="#111" stroke-width="1.2"/><path d="M7.5 18.5h9" stroke="#111" stroke-width="1.4"/></svg>',
  cor: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="1.5" fill="#ffc23a" stroke="#111" stroke-width="1.6"/><path d="M3 6.5l9 6.5 9-6.5" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="18" cy="15.5" r="1.6" fill="#c0191c"/></svg>',
  pos: '<svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="18" fill="#ff2fb3" stroke="#111" stroke-width="1.6"/><circle cx="12" cy="3.6" r="1.7" fill="#c0191c" stroke="#111"/><path d="M8 9h8M8 12.5h8M8 16h5" stroke="#fff" stroke-width="1.8"/></svg>',
  kio: '<svg viewBox="0 0 24 24"><path d="M3.5 8 12 4l8.5 4v9L12 21l-8.5-4z" fill="#c9935e" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/><path d="M3.5 8 12 12l8.5-4M12 12v9" fill="none" stroke="#111" stroke-width="1.4"/><path d="M7.5 6l8.5 4" stroke="#2dffb3" stroke-width="2.2"/></svg>'
};
const DNAME = { per: 'Periódico', rev: 'Revista', cor: 'Correo', pos: 'Póster', kio: 'Paquete' };
/* retratos de los mentores (SVG generado) */
function avatar(m) {
  const L = m.look || {}, sk = L.skin || '#c98e62', hc = L.hc || '#222', sh = L.shirt || m.col, h = L.hair || 'corto', a = L.acc || '';
  let s = `<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="${m.col}"/><circle cx="52" cy="10" r="16" fill="rgba(255,255,255,.22)"/>`;
  s += `<path d="M10 64c2-12 10-17 22-17s20 5 22 17z" fill="${sh}" stroke="#111" stroke-width="1.5"/><path d="M27 47h10l-5 7z" fill="#fff" opacity=".85"/><rect x="28" y="40" width="8" height="9" fill="${sk}"/>`;
  if (h === 'coleta') s += `<path d="M44 22c8 2 9 14 4 20-1-7-3-12-6-14z" fill="${hc}" stroke="#111" stroke-width="1"/>`;
  if (h === 'moño') s += `<circle cx="32" cy="9" r="6.5" fill="${hc}" stroke="#111" stroke-width="1"/>`;
  s += `<ellipse cx="18.5" cy="30" rx="3" ry="4" fill="${sk}"/><ellipse cx="45.5" cy="30" rx="3" ry="4" fill="${sk}"/><ellipse cx="32" cy="29" rx="13.5" ry="15.5" fill="${sk}" stroke="#111" stroke-width="1.5"/>`;
  if (h === 'corto' || h === 'coleta' || h === 'moño') s += `<path d="M18.5 27c-1-11 6-17 13.5-17s14.5 6 13.5 17c-3-5-8-7-13.5-7s-10.5 2-13.5 7z" fill="${hc}" stroke="#111" stroke-width="1"/>`;
  if (h === 'canoso') s += `<path d="M18 31c-1-5 0-9 3-11M46 31c1-5 0-9-3-11" stroke="${hc}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
  s += `<ellipse cx="26.5" cy="30" rx="2" ry="2.4" fill="#111"/><ellipse cx="37.5" cy="30" rx="2" ry="2.4" fill="#111"/><path d="M26 37.5c3.5 3 8.5 3 12 0" stroke="#111" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  if (L.must) s += `<path d="M24.5 35.5c3-2.5 5.5-2 7.5-.5 2-1.5 4.5-2 7.5.5-3 .5-5 1.5-7.5.6-2.5.9-4.5-.1-7.5-.6z" fill="${hc}" stroke="#111" stroke-width=".8"/>`;
  if (a === 'gafas') s += `<g fill="rgba(57,200,255,.35)" stroke="#111" stroke-width="1.6"><rect x="21" y="26.5" width="9" height="7" rx="2.5"/><rect x="34" y="26.5" width="9" height="7" rx="2.5"/></g><path d="M30 29h4" stroke="#111" stroke-width="1.6"/>`;
  if (a === 'aviador') s += `<path d="M18 22c3-11 25-11 28 0" fill="#7a4a1e" stroke="#111" stroke-width="1.4"/><g fill="#9ee8ff" stroke="#111" stroke-width="1.4"><circle cx="26" cy="22" r="4.5"/><circle cx="38" cy="22" r="4.5"/></g>`;
  if (a === 'banda') s += `<rect x="18.5" y="19" width="27" height="4.5" rx="2" fill="#fff" stroke="#111" stroke-width="1"/>`;
  if (a === 'gorra' || a === 'gorra2') s += `<path d="M18 22c0-9 6-13 14-13s14 4 14 13z" fill="${a === 'gorra' ? '#0e6378' : '#111'}" stroke="#111" stroke-width="1.2"/><path d="M${a === 'gorra' ? '30 21h20' : '14 21h20'}" stroke="#111" stroke-width="3" stroke-linecap="round"/>`;
  if (a === 'boina') s += `<ellipse cx="31" cy="15" rx="16" ry="6" fill="#c0191c" stroke="#111" stroke-width="1.2"/><circle cx="31" cy="9.5" r="1.6" fill="#111"/>`;
  if (a === 'casco') s += `<path d="M17 25c0-12 7-17 15-17s15 5 15 17z" fill="#ffc23a" stroke="#111" stroke-width="1.4"/><path d="M24 10v14M32 8v16M40 10v14" stroke="#111" stroke-width="1" opacity=".5"/>`;
  if (a === 'silbato') s += `<path d="M30 47l4 6" stroke="#ffc23a" stroke-width="2"/><rect x="31" y="51" width="7" height="4" rx="1.5" fill="#c0c4cc" stroke="#111"/>`;
  return s + '</svg>';
}
const KIND = { h: 'Fuerza', e: 'Eléctrico', m: 'Motor', f: 'Especial' }, ENL = { h: 'ALIENTO', e: 'BATERÍA', m: 'GASOLINA', f: 'COMBUSTIBLE' }, DICO = { per: '📰', rev: '📖', cor: '✉', pos: '🖼', kio: '📦' }, DCOLS = { per: '#8a8f96', rev: '#39c8ff', cor: '#ffc23a', pos: '#ff2fb3', kio: '#2dffb3' };
const priceTxt = it => it.ach ? '🏆 Logro: ' + (ACH.find(a => a[0] === it.ach) || ['', ''])[1] : it.st ? '✦ ' + it.st : '◉ ' + fmt(it.p || 0);
function checkAch(g) {
  const S = SV.S, got = [];
  for (const a of ACH) { if (S.ach[a[0]]) continue; let ok = false; try { ok = !!a[4](S, g); } catch (e) { ok = false; } if (!ok) continue;
    S.ach[a[0]] = dayKey(); S.stars += a[3]; got.push(a); if (a[5]) S.ownedCos[a[5]] = 1; UI.toast('🏆 LOGRO: ' + a[1] + ' · +✦ ' + a[3] + (a[5] ? ' · ¡' + COSI[a[5]].name + ' desbloqueado!' : ''), 'g'); }
  if (got.length) { SV.save(); if (typeof AU !== 'undefined') AU.sfx('rank'); }
  return got;
}

const UI = {
  cur: 'sCover', gtab: 'veh', rtab: 'city', preview: null, toastN: 0,
  show(id) {
    for (const s of document.querySelectorAll('.scr')) s.classList.toggle('on', s.id === id);
    this.cur = id;
    if (id === 'sCover') this.cover(); else if (id === 'sGarage') this.garage(); else if (id === 'sRank') this.rank(); else if (id === 'sStory') this.story(); else if (id === 'sMis') this.missions(); else if (id === 'sAch') this.ach(); else if (id === 'sMent') this.ment(); else if (id === 'sSet') this.settings();
    const el = $(id); if (el) el.scrollTop = 0;
  },
  hideScreens() { for (const s of document.querySelectorAll('.scr')) s.classList.remove('on'); this.cur = ''; },
  ov(id, on) { $(id).classList.toggle('on', !!on); },
  toast(txt, cls = '') {
    const box = $('toasts'); if (box.children.length > 3) box.firstChild.remove();
    const d = document.createElement('div'); d.className = 'toast ' + cls; d.textContent = txt; box.appendChild(d); setTimeout(() => d.remove(), 2500);
  },
  wallet() { const S = SV.S; return `<span>◉ <b>${fmt(S.coins)}</b></span><span>✦ <b>${fmt(S.stars)}</b></span>`; },
  bars(S) { return `<div class="bar2"><span>Físico</span><i><b style="width:${S.fit.toFixed(0)}%"></b></i><span>${S.fit.toFixed(0)}</span></div><div class="bar2 sk"><span>Habilidad</span><i><b style="width:${S.skill.toFixed(0)}%"></b></i><span>${S.skill.toFixed(0)}</span></div>`; },
  cover() {
    const S = SV.S, rk = rankOf(S.xp), wg = S.word.day === dayKey() ? S.word.got : '';
    $('cCard').innerHTML = `<div class="rk">${rk + 1}</div><div class="nm">${esc(RANKS[rk])} · ${esc(VEHI[S.veh].name)}<span>◉ ${fmt(S.coins)} · ✦ ${S.stars}</span></div>${this.bars(S)}<div style="grid-column:span 2;display:flex;justify-content:space-between;gap:8px"><span>Mejor ${fmt(S.best)} · Letras ${'EMSAY'.split('').map((c, i) => i < wg.length ? c : '·').join('')}</span><span class="${S.inj ? 'inj' : ''}">${S.inj ? '🩹'.repeat(S.inj) + ' lesión' : 'Sin lesiones'}</span></div>`;
    const E = evToday(); $('cEvt').innerHTML = `<b>HOY</b> ${esc(E.name)} · <span>${esc(E.desc)}</span>`;
    const news = STORY.filter((p, i) => i < S.clues && (p[2] === 'n' || p[2] === 'e' || p[2] === 'f')).map(p => p[0]);
    $('cTick').textContent = (news.length ? news.slice(-6) : ['EMSAY busca a los mejores velocistas de Orbe', 'Recupera páginas perdidas para leer los titulares', 'Hoy: carrera del día en la ciclovía']).join('  ✦  ');
    $('dCh').hidden = S.ch.day === dayKey();
    $('dStory').hidden = S.readClues >= S.clues; $('dMis').hidden = !S.mis.some(m => (misDef(m.k).run ? m.best : m.prog) >= misDef(m.k).n[m.lvl] * 0.8);
    $('cEd').textContent = 'Nº ' + Math.max(1, Math.floor(S.bestDist / 1000) + 1);
    requestAnimationFrame(() => this.fit());
    $('dMent').hidden = !MENT.some(m => !S.ment[m.id] && (mentProg(S, m) >= m.n || S.coins >= m.price));
  },
  /* que el título nunca se salga de la pantalla (fuentes grandes del celular, pantallas angostas) */
  fit() { for (const el of document.querySelectorAll('.cover .mega.t1, .cover .mega.t2')) { el.style.fontSize = ''; let fs = parseFloat(getComputedStyle(el).fontSize), n = 0; while (el.scrollWidth > el.clientWidth + 1 && fs > 24 && n++ < 60) { fs *= 0.95; el.style.fontSize = fs.toFixed(1) + 'px'; } } },
  ment() {
    const S = SV.S; $('mtWallet').innerHTML = this.wallet();
    $('mtBody').innerHTML = MENT.map(m => {
      const ok = S.ment[m.id], pr = mentProg(S, m), done = pr >= m.n;
      return `<div class="ment${ok ? ' ok' : ''}"><button class="av" data-act="mprof" data-arg="${m.id}" aria-label="Perfil de ${esc(m.name)}">${avatar(m)}</button><div class="nm">${esc(m.name)}</div><div class="hb">${esc(m.hab)} · ${esc(m.barrio || '')}</div><div class="ds">${esc(m.desc)}</div>
        <div class="fv">Favor: ${esc(m.favor)} · ${fmt(Math.min(pr, m.n))} / ${fmt(m.n)}</div><div class="bar2"><i><b style="width:${clamp(pr / m.n * 100, 0, 100).toFixed(0)}%"></b></i></div>
        <div class="row"><button class="btn gh" data-act="mprof" data-arg="${m.id}">Ver perfil</button>${ok ? '<b>✔ Aprendido</b>' : `<button class="btn pri" data-act="ment" data-arg="${m.id}:f"${done ? '' : ' disabled'}>${done ? '¡Reclamar!' : 'Favor pendiente'}</button><button class="btn" data-act="ment" data-arg="${m.id}:p">◉ ${fmt(m.price)}</button>`}</div></div>`;
    }).join('');
  },
  mprof(id) {
    const S = SV.S, m = MENT.find(x => x.id === id); if (!m) return; this.mcur = id;
    const ok = S.ment[m.id], pr = mentProg(S, m), done = pr >= m.n;
    $('mpBody').innerHTML = `<div class="mprof"><div class="av">${avatar(m)}</div><div><div class="nm">${esc(m.name)}</div><div class="bz">${esc(m.barrio || 'Orbe')}</div></div></div>
      <p class="mquote">«${esc(m.frase || '')}»</p><p style="line-height:1.45;margin:0 0 8px">${esc(m.bio || '')}</p>
      <div class="mfacts"><b>Enseña</b><span>${esc(m.hab)} · ${esc(m.desc)}</span><b>Su vehículo</b><span>${esc(m.vfav || '')}</span><b>Favor</b><span>${esc(m.favor)} (${fmt(Math.min(pr, m.n))} / ${fmt(m.n)})</span><b>Clase</b><span>◉ ${fmt(m.price)}</span></div>
      <div class="row" style="margin-top:10px">${ok ? '<b>✔ Ya aprendiste su habilidad</b>' : `<button class="btn pri" data-act="ment" data-arg="${m.id}:f"${done ? '' : ' disabled'}>${done ? '¡Reclamar favor!' : 'Favor pendiente'}</button><button class="btn" data-act="ment" data-arg="${m.id}:p">Pagar ◉ ${fmt(m.price)}</button>`}<button class="btn gh" data-act="closeMent">Cerrar</button></div>`;
    this.ov('oMent', 1);
  },
  garage() {
    const S = SV.S; $('gWallet').innerHTML = this.wallet();
    const v = VEHI[this.preview || S.veh]; $('gName').textContent = v.name;
    for (const b of $('gTabs').children) b.classList.toggle('on', b.dataset.arg === this.gtab);
    let h = '';
    if (this.gtab === 'veh') {
      h = `<div class="pcard" style="margin-bottom:12px"><div class="rk">♥</div><div class="nm">Tu cuerpo<span>${S.inj ? '<b class="inj">' + '🩹'.repeat(S.inj) + ' −' + S.inj * 12 + ' % aliento</b>' : 'sano'}</span></div>${this.bars(S)}<div style="grid-column:span 2">El físico crece a pie y con vehículos de fuerza; la habilidad, con trucos y barandas.${S.inj ? ' <button class="btn" style="font-size:15px;min-height:32px;padding:2px 10px" data-act="heal">Botiquín ◉ 250</button>' : ''}</div></div>` + '<div class="cards">' + VEH.map(v => {
        const own = S.owned[v.id], sel = S.veh === v.id;
        const st = (n, x, a = 0.55, b = 0.75) => `<div class="stat">${n}<i style="--v:${Math.round(clamp((x - a) / b, 0.08, 1) * 100)}%"></i></div>`;
        return `<button class="card${sel ? ' sel' : ''}" data-act="veh" data-arg="${v.id}">${sel ? '<span class="tag">EN USO</span>' : ''}<span class="nm">${esc(v.name)}</span><span class="ds"><span class="vkind">${KIND[v.kind]}</span>${v.street ? '<span class="vkind">Calle</span>' : ''}${esc(v.desc)}</span>${st('Vel', v.spd)}${st('Impulso', v.boost, 2, 8)}${st('Salto', v.jmp, 0.4, 0.8)}${st('Manejo', v.hnd, 0.7, 0.65)}<span class="ds"><b>★ ${esc(v.perk)}</b></span><span class="pr">${own ? (sel ? '✔ Seleccionado' : 'Toca para usar') : v.id === 'jetpack' ? '🎓 Capitana Cometa · ◉ ' + fmt(v.price) : '◉ ' + fmt(v.price)}</span></button>`;
      }).join('') + '</div>';
    } else if (this.gtab === 'cos') {
      const N = { piel: 'Tu personaje · piel', pelo: 'Tu personaje · peinado', casco: 'Casco', ropa: 'Ropa', pintura: 'Pintura del vehículo', estela: 'Estela', mascota: 'Mascota (atrapa monedas del carril vecino)' };
      for (const cat in COS) {
        h += `<div class="cat">${N[cat]}</div><div class="cards">` + COS[cat].map(c => {
          const own = S.ownedCos[c.id], sel = S.cos[cat] === c.id;
          const sw = cat === 'ropa' ? `linear-gradient(90deg,${c.a} 50%,${c.b} 50%)` : cat === 'estela' || !c.c ? '#111' : c.c;
          return `<button class="card${sel ? ' sel' : ''}" data-act="cos" data-arg="${c.id}">${sel ? '<span class="tag">PUESTO</span>' : ''}<span class="sw" style="background:${sw}"></span><span class="nm" style="font-size:18px">${esc(c.name)}</span><span class="pr">${own ? (sel ? '✔ Puesto' : 'Toca para usar') : priceTxt(c)}</span></button>`;
        }).join('') + '</div>';
      }
    } else {
      const V = VEHI[S.veh], VU = S.vup[S.veh] || {};
      h = `<div class="cat">Mejoras de tu ${esc(V.name)}</div><div class="cards">` + VUP.map(q => { const lv = VU[q[0]] || 0, max = lv >= 5; return `<button class="card" data-act="vup" data-arg="${q[0]}"><span class="nm">${esc(q[1])}</span><span class="ds">${'■'.repeat(lv)}${'□'.repeat(5 - lv)} · +${q[2] * lv} %</span><span class="ds">${esc(q[3])}</span><span class="pr">${max ? 'MÁXIMO' : '◉ ' + fmt(vupCost(V, lv))}</span></button>`; }).join('') + '</div><div class="cat">Mejoras generales</div>' +
      '<div class="cards">' + UPG.map(u => {
        const lv = S.up[u.id] || 0, max = lv >= 5, pr = UPC[lv];
        const eff = u.id === 'gift' ? `Suerte +${lv * 3}%` : u.pct ? `+${u.per * lv} %` : `${(u.base + u.per * lv).toFixed(1).replace('.0', '')} s`;
        return `<button class="card" data-act="upg" data-arg="${u.id}"><span class="nm">${u.icon} ${esc(u.name)}</span><span class="ds">${'■'.repeat(lv)}${'□'.repeat(5 - lv)} · ${eff}</span><span class="pr">${max ? 'MÁXIMO' : '◉ ' + fmt(pr)}</span></button>`;
      }).join('') + '</div>';
    }
    $('gBody').innerHTML = h;
  },
  rank() {
    const S = SV.S, rk = rankOf(S.xp), nx = RANKXP[rk + 1], cur = RANKXP[rk], pct = nx ? (S.xp - cur) / (nx - cur) * 100 : 100;
    $('rCard').innerHTML = `<div class="rkcard"><div class="rkn">${rk + 1}</div><div class="rkt"><div class="pag">Rango</div><div class="mega">${esc(RANKS[rk])}</div><div class="xpbar"><i style="width:${pct.toFixed(1)}%"></i></div><div class="pag" style="margin-top:4px">${fmt(S.xp)} XP${nx ? ' / ' + fmt(nx) : ' · ¡máximo!'} · Puntos ×${(1 + 0.25 * rk).toFixed(2)}</div></div></div>`;
    for (const b of $('rTabs').children) b.classList.toggle('on', b.dataset.arg === this.rtab);
    let h = '<div class="list">';
    if (this.rtab === 'city') {
      const L = CITY.map(c => ({ n: c[0], v: c[1] })); L.push({ n: 'Tú', v: S.best, me: 1 }); L.sort((a, b) => b.v - a.v);
      L.forEach((x, i) => { h += `<div class="li${x.me ? ' me' : ''}"><span class="p">${i + 1}</span><span class="n">${esc(x.n)}${x.me ? ' <small>' + esc(RANKS[rk]) + ' · tu mejor partida</small>' : ''}</span><span class="v">${fmt(x.v)}</span></div>`; });
    } else {
      const R2 = S.runs.slice().sort((a, b) => b.score - a.score).slice(0, 10);
      if (!R2.length) h += '<div class="li"><span class="n">Aún no hay partidas. ¡A rodar!</span></div>';
      R2.forEach((r, i) => { h += `<div class="li"><span class="p">${i + 1}</span><span class="n">${fmt(r.score)} pts<small>${fmt(r.dist)} m · ${esc((VEHI[r.veh] || VEH[0]).name)} · ${esc((r.d || '').slice(0, 10))}</small></span><span class="v">◉ ${fmt(r.coins)}</span></div>`; });
      h += `</div><div class="film" style="margin-top:14px">Partidas: ${fmt(S.tot.runs)} · Distancia total: ${fmt(S.tot.dist)} m<br>Monedas totales: ${fmt(S.tot.coins)} · Tiempo: ${Math.round(S.tot.time / 60)} min<br>Récord de distancia: ${fmt(S.bestDist)} m</div><div>`;
    }
    $('rBody').innerHTML = h + '</div>';
  },
  stab: 'all',
  story() {
    const S = SV.S, tb = this.stab;
    $('stLede').textContent = S.clues >= STORY.length ? '¡Hemeroteca completa! Recuperaste todas las páginas. Don Gustavo estaría orgulloso.' : `Has recuperado ${S.clues} de ${STORY.length} páginas. Búscalas en la ciclovía: brillan en verde menta.`;
    $('stTabs').innerHTML = [['all', 'Todas']].concat(Object.entries(SECT)).map(x => `<button class="${tb === x[0] ? 'on' : ''}" data-act="stab" data-arg="${x[0]}">${x[1]}</button>`).join('');
    $('stGrid').innerHTML = STORY.map((p, i) => tb !== 'all' && p[2] !== tb ? '' : i < S.clues ? `<button class="ptile" data-act="read" data-arg="${i}"><span class="sc">${SECT[p[2]]}</span><span class="k">Nº${i + 1}</span><span class="t">${esc(p[0])}</span></button>` : `<div class="ptile lock"><span class="sc">${SECT[p[2]]}</span><span class="k">?</span><span class="t">Página ${i + 1}</span></div>`).join('');
  },
  read(i) {
    const p = STORY[i]; if (!p) return; $('rdN').textContent = SECT[p[2]].toUpperCase() + ' · ' + (i + 1) + ' / ' + STORY.length; $('rdT').textContent = p[0]; $('rdX').textContent = p[1];
    SV.S.readClues = Math.max(SV.S.readClues, i + 1); SV.save(); this.ov('oRead', 1);
  },
  ach() {
    const S = SV.S, n = ACH.filter(a => S.ach[a[0]]).length;
    $('achN').textContent = n + ' / ' + ACH.length;
    $('achBody').innerHTML = ACH.map((a, i) => { const ok = S.ach[a[0]]; return `<div class="ach${ok ? ' ok' : ''}" style="--r:${((i * 37) % 9 - 4) * 0.7}deg"><b>${ok ? '★' : '?'}</b><span class="nm">${esc(a[1])}</span><span class="ds">${esc(a[2])}</span><span class="rw">✦ ${a[3]}${a[5] ? ' + ' + esc(COSI[a[5]].name) : ''}</span></div>`; }).join('');
  },
  missions() {
    const S = SV.S;
    $('mBody').innerHTML = S.mis.map(m => {
      const d = misDef(m.k), tg = d.n[m.lvl], cur = d.run ? m.best : m.prog, pct = clamp(cur / tg, 0, 1) * 100;
      return `<div class="mis"><div class="t">${esc(misText(m))}</div><div class="bar"><i style="width:${pct.toFixed(1)}%"></i></div><div class="r"><span>${d.run ? 'Mejor: ' : ''}${fmt(Math.max(0, cur))} / ${fmt(tg)}</span><span>◉ ${MREW[m.lvl]} · ${MXP[m.lvl]} XP</span></div></div>`;
    }).join('') + `<p style="font-family:var(--fs);font-style:italic">Misiones cumplidas: ${S.misDone}. Cada 3 misiones ganas ✦ 1 estrella.</p>`;
  },
  settings() {
    const S = SV.S, t = (k, on, lab, sub) => `<div class="opt"><span>${lab}${sub ? '<small>' + sub + '</small>' : ''}</span><button class="tg${on ? ' on' : ''}" data-act="set" data-arg="${k}">${on ? 'SÍ' : 'NO'}</button></div>`;
    const q = ['auto', 'alta', 'baja'].map(x => `<button class="${S.set.q === x ? 'on' : ''}" data-act="qual" data-arg="${x}">${x}</button>`).join('');
    $('setBody').innerHTML = t('sfx', S.set.sfx, 'Efectos de sonido') + t('music', S.set.music, 'Música') + t('vib', S.set.vib, 'Vibración', 'En celulares compatibles') + t('fps', S.set.fps, 'Mostrar FPS') + t('lh', S.set.lh, 'Modo zurdo', 'Botón ⚡ IMPULSO a la izquierda') +
      `<div class="opt"><span>Calidad gráfica<small>Auto ajusta según tu celular</small></span><div class="seg">${q}</div></div>
      <div class="opt"><span>Banda sonora<small>Rock, electrónica o mezcla según la edición</small></span><div class="seg">${[['mix', 'Mezcla'], ['rock', 'Rock'], ['electro', 'Electro']].map(x => `<button class="${S.set.mus === x[0] ? 'on' : ''}" data-act="mus" data-arg="${x[0]}">${x[1]}</button>`).join('')}</div></div>
      <div class="opt"><span>Controles<small>Desliza ← → ↑ ↓ · Botones: ⚡ impulso, ■ freno, ✉ entregas · Teclado: flechas/WASD, espacio salta, F o Shift impulso, X freno, Q y E entregan, P pausa</small></span></div>
      <div class="opt"><span>Tutorial<small>Volver a ver los gestos básicos</small></span><button class="tg" data-act="tut">VER</button></div>
      <div class="cat" style="color:#2b2112">Mis partidas (${S.runs.length})</div>
      <div class="row"><button class="btn" data-act="exp">Exportar .json</button><button class="btn" data-act="csv">Exportar .csv</button><button class="btn gh" data-act="imp">Importar</button></div>
      <div class="cat" style="color:#2b2112">Zona peligrosa</div><button class="btn red" data-act="reset">Borrar progreso</button>
      <div class="film" style="margin-top:16px;--fc:#a42cff">RUN SCOOTER v${VERSION} · juego offline<br>Ciudad de Orbe · editorial EMSAY<br>Motor 3D propio · sin librerías · sin internet</div>`;
  },
  hud: { s: -1, c: -1, d: -1, m: '', pk: '', b: -1, sl: 99, dl: '', en: -1, top: '' },
  updHud(g) {
    const H = this.hud, P = g.p, sc = Math.floor(g.score), c = g.coinsRun, d = Math.floor(P.s);
    if (sc !== H.s) { H.s = sc; $('hScore').textContent = fmt(sc); }
    if (c !== H.c) { H.c = c; $('hCoins').textContent = fmt(c); }
    const wd = SV.S.word, wg = wd.day === dayKey() ? wd.got : ''; if (wg !== H.w) { H.w = wg; $('hWord').innerHTML = 'EMSAY'.split('').map((ch, i) => `<i class="${i < wg.length ? 'on' : ''}">${ch}</i>`).join(''); }
    const dl = g.deliv + ':' + g.dStreak; if (dl !== H.dl) { H.dl = dl; const el = $('hDel'); el.hidden = !g.deliv; el.innerHTML = `✉ <b>${g.deliv}</b>${g.dStreak > 1 ? ' <small>racha ×' + g.dStreak + '</small>' : ''}`; }
    if (d !== H.d) { H.d = d; $('hDist').textContent = fmt(d) + ' M · ED. ' + (g.edition + 1); }
    const b = Math.round(P.boost * 40); if (b !== H.b) { H.b = b; $('bbF').style.setProperty('--o', (113 * (1 - b / 40)).toFixed(1)); }
    const sl = Math.round(P.sl * 100); if (sl !== H.sl) { H.sl = sl; const el = $('hSlope'); el.hidden = Math.abs(sl) < 3; el.className = 'slope ' + (sl > 0 ? 'up' : 'dn'); el.textContent = (sl > 0 ? '▲ SUBIDA ' : '▼ BAJADA ') + Math.abs(sl) + ' %'; }
    const en = Math.round(P.en / Math.max(g.enMax, 0.01) * 25); if (en !== H.en) { H.en = en; $('enF').style.width = (en * 4) + '%'; $('enF').parentNode.parentNode.classList.toggle('low', en < 5); }
    // avisos: semáforo, policía, animales, bajada, vía angosta, rival y estilo
    let lt = '', ltc = '', pol = '', warn = '', riv = '', combo = g.combo > 1.05 ? 'ESTILO ×' + g.combo.toFixed(1) : '';
    for (const X of g.xs) { const dC = X.s - P.s; if (X.pass || dC > 95 || dC < 0) continue; const st = lightAt(X, g.t); ltc = st === 2 ? 'r' : st === 1 ? 'y' : ''; lt = (st === 2 ? 'ROJO · FRENA' : st === 1 ? 'AMARILLO' : 'VERDE · SIGUE') + ' · ' + Math.round(dC / 5) * 5 + ' m'; }
    if (g.pol) pol = g.pol.k === 'pol' ? '🚓 POLICÍA A ' + Math.round(g.pol.d) + ' m' : '🐕 ¡PERRO! acelera o frena';
    for (const c of g.crs) if (!c.done && c.s - P.s > 0 && c.s - P.s < 60 && c.t0 >= 0) warn = '⚠ ANIMAL CRUZANDO';
    if (!warn && P.over > 0.4) warn = '⚠ ¡FRENA EN LA BAJADA!';
    const nN = g.nars.find(n => n.a - P.s > 0 && n.a - P.s < 55);
    if (!warn && nN) warn = '⚠ VÍA ANGOSTA · carril' + (nN.open.length > 1 ? 'es ' : ' ') + nN.open.map(l => l + 1).join(' y ');
    if (!warn && P.inPark) warn = g.rested ? '🌳 PARQUE · trucos ×2' : '🌳 PARQUE · trucos ×2 · frena para descansar';
    if (!warn) { const f = g.forks.find(f => f.a - P.s > -4 && f.a - P.s < 75); if (f) warn = f.dl ? '⑂ ⚡ IMPULSO ◀ · ▶ ✉ ENTREGAS' : '⑂ ✉ ENTREGAS ◀ · ▶ ⚡ IMPULSO'; }
    if (g.riv) { const gp = g.riv.s - P.s; riv = '🏁 ' + g.riv.name + (gp > 0 ? ' +' + Math.round(gp) + ' m' : ' detrás'); }
    const top = lt + '|' + ltc + '|' + pol + '|' + warn + '|' + riv + '|' + combo;
    if (top !== H.top) { H.top = top; const set = (id, t, cl) => { const el = $(id); el.hidden = !t; if (t) { if (id === 'hLight') { el.className = 'lt ' + cl; el.innerHTML = '<i></i>' + t; } else el.textContent = t; } }; set('hLight', lt, ltc); set('hPol', pol); set('hWarn', warn); set('hRiv', riv); set('hCombo', combo); }
    // botones de entrega: aparecen cuando hay un buzón, casita, muro o kiosco a tiro
    for (const sd of [-1, 1]) {
      let d = null; for (const q of g.dels) { if (q.done || q.miss || q.side !== sd) continue; const a = q.s - P.s; if (a < -2.5 || a > 22) continue; if (!d || q.s < d.s) d = q; }
      const el = $(sd < 0 ? 'bDelL' : 'bDelR'), key = d ? d.k + (d.s - P.s >= 2 && d.s - P.s <= 9.5 ? '!' : '') : '';
      if (key !== el._k) { el._k = key; el.hidden = !d; if (d) { el.querySelector('.ic').innerHTML = DSVG[d.k]; el.querySelector('small').textContent = key.endsWith('!') ? '¡YA!' : DNAME[d.k]; el.style.setProperty('--dc', DCOLS[d.k]); el.classList.toggle('ok', key.endsWith('!')); } }
      if (d) el.style.setProperty('--o', (113 * clamp((d.s - P.s) / 22, 0, 1)).toFixed(0));
    }
    const m = '×' + (g.mult * (P.x2 > 0 ? 2 : 1) * (g.veh.id === 'bike' ? 1.15 : 1) * (1 + 0.5 * P.boost)).toFixed(2).replace(/\.?0+$/, '');
    if (m !== H.m) { H.m = m; $('hMult').textContent = m; }
    const pw = [['magnet', 'IMÁN', '#ff5a2a'], ['turbo', 'TURBO', '#ffc23a'], ['x2', '×2', '#ff2fb3'], ['glide', 'PARAGUAS', '#2dffb3']].filter(p => P[p[0]] > 0);
    const pk = pw.map(p => p[0]).join() + (P.shield ? 'S' : '');
    if (pk !== H.pk) { H.pk = pk; $('hPow').innerHTML = pw.map(p => `<div class="pw" style="--c:${p[2]}"><span>${p[1]}</span><i><b id="pb-${p[0]}"></b></i></div>`).join('') + (P.shield ? '<div class="pw" style="--c:#39c8ff"><span>CASCO ✔</span></div>' : ''); }
    for (const p of pw) { const el = $('pb-' + p[0]); if (el) el.style.width = (P[p[0]] / g.dur[p[0]] * 100).toFixed(1) + '%'; }
    $('hStum').hidden = !(P.stumble > 0 && P.alive);
  },
  pop(txt, cls = '') { const el = $('hPop'); el.className = ''; void el.offsetWidth; el.className = 'pop ' + cls; el.textContent = txt; },
  banner(ed) { const z = ZONES[ed % ZONES.length]; $('hBanner').innerHTML = `<div class="banner"><div class="sp">Edición ${ed + 1}${RAINY(ed) ? ' · ☂ lluvia' : ''}</div><div class="mega">${esc(z.name)}</div></div>`; },
  tut(i) { const T = TUT[i]; const el = $('hTut'); if (i < 0 || !T) { el.hidden = true; return; } el.innerHTML = `<b>${T.msg}</b><small>${esc(T.pc)}</small>`; el.hidden = false; }
};

/* ---- exportar / importar ---- */
async function saveFile(name, text, mime) {
  const P = window.Capacitor && window.Capacitor.Plugins;
  if (P && P.Filesystem) {
    try {
      await P.Filesystem.writeFile({ path: name, data: text, directory: 'CACHE', encoding: 'utf8' });
      const u = await P.Filesystem.getUri({ path: name, directory: 'CACHE' });
      if (P.Share) await P.Share.share({ title: name, url: u.uri, dialogTitle: 'Guardar partidas' });
      return true;
    } catch (e) { /* cae al método web */ }
  }
  const blob = new Blob([text], { type: mime });
  try {
    const f = new File([blob], name, { type: mime });
    if (navigator.canShare && navigator.canShare({ files: [f] }) && matchMedia('(pointer:coarse)').matches) { await navigator.share({ files: [f], title: name }); return true; }
  } catch (e) { if (e && e.name === 'AbortError') return false; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); return true;
}
function exportJSON() { const S = SV.S; return JSON.stringify({ app: 'Run Scooter', version: VERSION, exportado: new Date().toISOString(), partidas: S.runs, perfil: S }, null, 1); }
function exportCSV() {
  const K = ['d', 'ch', 'deliv', 'perf', 'duels', 'civic', 'veh', 'dist', 'score', 'coins', 'stars', 'clues', 'gifts', 'jumps', 'ducks', 'tricks', 'powers', 'trucks', 'ed', 'rev', 'time', 'cause', 'seed'];
  const H = ['fecha', 'carrera_dia', 'entregas', 'perfectas', 'duelos', 'semaforos', 'vehiculo', 'metros', 'puntos', 'monedas', 'estrellas', 'paginas', 'regalos', 'saltos', 'agachadas', 'trucos', 'poderes', 'furgones', 'edicion', 'revivir', 'segundos', 'causa', 'semilla'];
  return [H.join(';')].concat(SV.S.runs.map(r => K.map(k => '"' + String(r[k] == null ? '' : r[k]).replace(/"/g, '""') + '"').join(';'))).join('\n');
}
function importJSON(text) {
  let o; try { o = JSON.parse(text); } catch (e) { return false; }
  const p = o && o.perfil ? o.perfil : o; if (!p || p.v !== 1 || typeof p.coins !== 'number') return false;
  SV.S = SV.merge(SV.def(), p); SV.fix(); SV.save(); return true;
}
