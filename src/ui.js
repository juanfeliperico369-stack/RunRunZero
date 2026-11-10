/* ===== INTERFAZ · progreso, guardado, pantallas ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = n => Math.round(n).toLocaleString('es-CO');
const dayKey = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const VERSION = '1.1.0', SKEY = 'runscooter.v1';
const MREW = [100, 200, 350, 550, 800], MXP = [150, 300, 500, 800, 1200], DAILY = [100, 150, 200, 's1', 300, 400, 's3'];

const SV = {
  S: null,
  def() {
    return { v: 1, coins: 0, stars: 0, xp: 0, best: 0, bestDist: 0, veh: 'scooter', owned: { scooter: 1 }, cos: { casco: 'h0', ropa: 'r0', pintura: 'p0', estela: 't0' }, ownedCos: { h0: 1, r0: 1, p0: 1, t0: 1 },
      up: { magnet: 0, turbo: 0, x2: 0, gift: 0 }, clues: 0, readClues: 0, mis: [], misLvl: {}, misDone: 0, daily: { last: '', streak: 0 }, ch: { day: '', best: 0, rew: '' }, rank: 0,
      set: { sfx: 1, music: 1, vib: 1, q: 'auto', fps: 0 }, tut: 1, runs: [], tot: { runs: 0, dist: 0, coins: 0, time: 0 }, created: Date.now() };
  },
  merge(a, b) {
    if (!b || typeof b !== 'object' || Array.isArray(b)) return a;
    for (const k of Object.keys(b)) {
      const av = a[k], bv = b[k];
      if (av === undefined) { if (['number', 'string', 'boolean'].includes(typeof bv)) a[k] = bv; continue; }
      if (Array.isArray(av)) { if (Array.isArray(bv)) a[k] = bv.slice(0, 300); }
      else if (av && typeof av === 'object') a[k] = this.merge(av, bv);
      else if (typeof av === typeof bv && (typeof bv !== 'number' || Number.isFinite(bv))) a[k] = bv;
    }
    return a;
  },
  load() { let d = null; try { d = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { d = null; } this.S = this.merge(this.def(), d); this.fix(); return this.S; },
  fix() {
    const S = this.S;
    if (!VEHI[S.veh] || !S.owned[S.veh]) S.veh = 'scooter';
    for (const c in S.cos) if (!COSI[S.cos[c]] || !S.ownedCos[S.cos[c]]) S.cos[c] = COS[c][0].id;
    S.mis = S.mis.filter(m => m && MIS.some(d => d.k === m.k) && typeof m.prog === 'number').slice(0, 3);
    while (S.mis.length < 3) S.mis.push(newMis(S, S.mis.map(m => m.k)));
    S.clues = clamp(S.clues | 0, 0, STORY.length); S.coins = Math.max(0, S.coins | 0); S.stars = Math.max(0, S.stars | 0);
  },
  save() { try { localStorage.setItem(SKEY, JSON.stringify(this.S)); return true; } catch (e) { return false; } }
};
function newMis(S, ex) { const pool = MIS.filter(m => !ex.includes(m.k)); const d = pool[Math.floor(Math.random() * pool.length)]; return { k: d.k, lvl: Math.min(4, S.misLvl[d.k] || 0), prog: 0, best: 0 }; }
const misDef = k => MIS.find(m => m.k === k);
const misVal = (k, g) => k === 'coins' ? g.coinsRun : k === 'dist' ? g.p.s : k === 'jumps' ? g.jumps : k === 'ducks' ? g.ducks : k === 'gifts' ? g.gifts : k === 'powers' ? g.powers : k === 'tricks' ? g.tricks : k === 'score' ? g.score : k === 'clean' ? Math.max(g.cleanBest, g.cleanS) : k === 'trucks' ? g.trucks : g.edition + 1;
const misText = m => misDef(m.k).t.replace('{n}', fmt(misDef(m.k).n[m.lvl]));
const cosCfg = S => { const h = COSI[S.cos.casco], r = COSI[S.cos.ropa], p = COSI[S.cos.pintura]; return { helmet: h.c, he: !!h.e, shirt: r.a, pants: r.b, se: !!r.e, paint: p.c, pe: !!p.e }; };
const priceTxt = it => it.st ? '✦ ' + it.st : '◉ ' + fmt(it.p || 0);

const UI = {
  cur: 'sCover', gtab: 'veh', rtab: 'city', preview: null, toastN: 0,
  show(id) {
    for (const s of document.querySelectorAll('.scr')) s.classList.toggle('on', s.id === id);
    this.cur = id;
    if (id === 'sCover') this.cover(); else if (id === 'sGarage') this.garage(); else if (id === 'sRank') this.rank(); else if (id === 'sStory') this.story(); else if (id === 'sMis') this.missions(); else if (id === 'sSet') this.settings();
    const el = $(id); if (el) el.scrollTop = 0;
  },
  hideScreens() { for (const s of document.querySelectorAll('.scr')) s.classList.remove('on'); this.cur = ''; },
  ov(id, on) { $(id).classList.toggle('on', !!on); },
  toast(txt, cls = '') {
    const box = $('toasts'); if (box.children.length > 3) box.firstChild.remove();
    const d = document.createElement('div'); d.className = 'toast ' + cls; d.textContent = txt; box.appendChild(d); setTimeout(() => d.remove(), 2500);
  },
  wallet() { const S = SV.S; return `<span>◉ <b>${fmt(S.coins)}</b></span><span>✦ <b>${fmt(S.stars)}</b></span>`; },
  cover() {
    const S = SV.S, rk = rankOf(S.xp);
    $('cStats').innerHTML = `<span class="chip">◉ <b>${fmt(S.coins)}</b></span><span class="chip">✦ <b>${S.stars}</b></span><span class="chip">MEJOR <b>${fmt(S.best)}</b></span><span class="chip">${esc(RANKS[rk])}</span>`;
    $('cEd').textContent = 'Nº ' + Math.max(1, Math.floor(S.bestDist / 1000) + 1);
    $('dCh').hidden = S.ch.day === dayKey();
    $('dStory').hidden = S.readClues >= S.clues; $('dMis').hidden = !S.mis.some(m => (misDef(m.k).run ? m.best : m.prog) >= misDef(m.k).n[m.lvl] * 0.8);
  },
  garage() {
    const S = SV.S; $('gWallet').innerHTML = this.wallet();
    const v = VEHI[this.preview || S.veh]; $('gName').textContent = v.name;
    for (const b of $('gTabs').children) b.classList.toggle('on', b.dataset.arg === this.gtab);
    let h = '';
    if (this.gtab === 'veh') {
      h = '<div class="cards">' + VEH.map(v => {
        const own = S.owned[v.id], sel = S.veh === v.id;
        const st = (n, x) => `<div class="stat">${n}<i style="--v:${Math.round(clamp((x - 0.85) / 0.5, 0.08, 1) * 100)}%"></i></div>`;
        return `<button class="card${sel ? ' sel' : ''}" data-act="veh" data-arg="${v.id}">${sel ? '<span class="tag">EN USO</span>' : ''}<span class="nm">${esc(v.name)}</span><span class="ds">${esc(v.desc)}</span>${st('Vel', v.spd)}${st('Salto', v.jmp)}${st('Manejo', v.hnd)}<span class="ds"><b>★ ${esc(v.perk)}</b></span><span class="pr">${own ? (sel ? '✔ Seleccionado' : 'Toca para usar') : '◉ ' + fmt(v.price)}</span></button>`;
      }).join('') + '</div>';
    } else if (this.gtab === 'cos') {
      const N = { casco: 'Casco', ropa: 'Ropa', pintura: 'Pintura del vehículo', estela: 'Estela' };
      for (const cat in COS) {
        h += `<div class="cat">${N[cat]}</div><div class="cards">` + COS[cat].map(c => {
          const own = S.ownedCos[c.id], sel = S.cos[cat] === c.id;
          const sw = cat === 'ropa' ? `linear-gradient(90deg,${c.a} 50%,${c.b} 50%)` : cat === 'estela' ? '#111' : c.c;
          return `<button class="card${sel ? ' sel' : ''}" data-act="cos" data-arg="${c.id}">${sel ? '<span class="tag">PUESTO</span>' : ''}<span class="sw" style="background:${sw}"></span><span class="nm" style="font-size:18px">${esc(c.name)}</span><span class="pr">${own ? (sel ? '✔ Puesto' : 'Toca para usar') : priceTxt(c)}</span></button>`;
        }).join('') + '</div>';
      }
    } else {
      h = '<div class="cards">' + UPG.map(u => {
        const lv = S.up[u.id] || 0, max = lv >= 5, pr = UPC[lv];
        const eff = u.id === 'gift' ? `Suerte +${lv * 3}%` : `${(u.base + u.per * lv).toFixed(1).replace('.0', '')} s`;
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
  story() {
    const S = SV.S; S.readClues = Math.max(S.readClues, 0);
    $('stLede').textContent = S.clues >= STORY.length ? '¡Temporada completa! Recuperaste las 12 páginas. Don Ramiro estaría orgulloso.' : `Has recuperado ${S.clues} de ${STORY.length} páginas. Búscalas en la ciclovía: brillan en verde menta.`;
    $('stGrid').innerHTML = STORY.map((p, i) => i < S.clues ? `<button class="ptile" data-act="read" data-arg="${i}"><span class="k">Nº${i + 1}</span><span class="t">${esc(p[0])}</span></button>` : `<div class="ptile lock"><span class="k">?</span><span class="t">Página ${i + 1}</span></div>`).join('');
  },
  read(i) {
    const p = STORY[i]; if (!p) return; $('rdN').textContent = 'PÁGINA ' + (i + 1) + ' / ' + STORY.length; $('rdT').textContent = p[0]; $('rdX').textContent = p[1];
    SV.S.readClues = Math.max(SV.S.readClues, i + 1); SV.save(); this.ov('oRead', 1);
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
    $('setBody').innerHTML = t('sfx', S.set.sfx, 'Efectos de sonido') + t('music', S.set.music, 'Música') + t('vib', S.set.vib, 'Vibración', 'En celulares compatibles') + t('fps', S.set.fps, 'Mostrar FPS') +
      `<div class="opt"><span>Calidad gráfica<small>Auto ajusta según tu celular</small></span><div class="seg">${q}</div></div>
      <div class="opt"><span>Controles<small>Desliza ← → ↑ ↓ · Teclado: flechas, WASD, espacio, P = pausa</small></span></div>
      <div class="opt"><span>Tutorial<small>Volver a ver los gestos básicos</small></span><button class="tg" data-act="tut">VER</button></div>
      <div class="cat" style="color:#2b2112">Mis partidas (${S.runs.length})</div>
      <div class="row"><button class="btn" data-act="exp">Exportar .json</button><button class="btn" data-act="csv">Exportar .csv</button><button class="btn gh" data-act="imp">Importar</button></div>
      <div class="cat" style="color:#2b2112">Zona peligrosa</div><button class="btn red" data-act="reset">Borrar progreso</button>
      <div class="film" style="margin-top:16px;--fc:#a42cff">RUN SCOOTER v${VERSION} · juego offline<br>Estilo: revista EMSAY + Doc Element<br>Motor 3D propio · sin librerías · sin internet</div>`;
  },
  hud: { s: -1, c: -1, d: -1, m: '', pk: '' },
  updHud(g) {
    const H = this.hud, P = g.p, sc = Math.floor(g.score), c = g.coinsRun, d = Math.floor(P.s);
    if (sc !== H.s) { H.s = sc; $('hScore').textContent = fmt(sc); }
    if (c !== H.c) { H.c = c; $('hCoins').textContent = fmt(c); }
    if (d !== H.d) { H.d = d; $('hDist').textContent = fmt(d) + ' M · ED. ' + (g.edition + 1); }
    const m = '×' + (g.mult * (P.x2 > 0 ? 2 : 1) * (g.veh.id === 'bike' ? 1.15 : 1)).toFixed(2).replace(/\.?0+$/, '');
    if (m !== H.m) { H.m = m; $('hMult').textContent = m; }
    const pw = [['magnet', 'IMÁN', '#ff5a2a'], ['turbo', 'TURBO', '#ffc23a'], ['x2', '×2', '#ff2fb3']].filter(p => P[p[0]] > 0);
    const pk = pw.map(p => p[0]).join() + (P.shield ? 'S' : '');
    if (pk !== H.pk) { H.pk = pk; $('hPow').innerHTML = pw.map(p => `<div class="pw" style="--c:${p[2]}"><span>${p[1]}</span><i><b id="pb-${p[0]}"></b></i></div>`).join('') + (P.shield ? '<div class="pw" style="--c:#39c8ff"><span>CASCO ✔</span></div>' : ''); }
    for (const p of pw) { const el = $('pb-' + p[0]); if (el) el.style.width = (P[p[0]] / g.dur[p[0]] * 100).toFixed(1) + '%'; }
    $('hStum').hidden = !(P.stumble > 0 && P.alive);
  },
  banner(ed) { const z = ZONES[ed % ZONES.length]; $('hBanner').innerHTML = `<div class="banner"><div class="sp">Edición ${ed + 1}</div><div class="mega">${esc(z.name)}</div></div>`; },
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
  const K = ['d', 'ch', 'veh', 'dist', 'score', 'coins', 'stars', 'clues', 'gifts', 'jumps', 'ducks', 'tricks', 'powers', 'trucks', 'ed', 'rev', 'time', 'cause', 'seed'];
  const H = ['fecha', 'reto_dia', 'vehiculo', 'metros', 'puntos', 'monedas', 'estrellas', 'paginas', 'regalos', 'saltos', 'agachadas', 'trucos', 'poderes', 'furgones', 'edicion', 'revivir', 'segundos', 'causa', 'semilla'];
  return [H.join(';')].concat(SV.S.runs.map(r => K.map(k => '"' + String(r[k] == null ? '' : r[k]).replace(/"/g, '""') + '"').join(';'))).join('\n');
}
function importJSON(text) {
  let o; try { o = JSON.parse(text); } catch (e) { return false; }
  const p = o && o.perfil ? o.perfil : o; if (!p || p.v !== 1 || typeof p.coins !== 'number') return false;
  SV.S = SV.merge(SV.def(), p); SV.fix(); SV.save(); return true;
}
