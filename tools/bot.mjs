// Bot de navegador: abre el juego real, recorre la UI, juega con IA, corre 100 partidas simuladas y reporta errores
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const root = path.resolve(new URL('../web/', import.meta.url).pathname), shots = process.env.SHOTS || '';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.apk': 'application/vnd.android.package-archive' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = path.join(root, p); if (!f.startsWith(root) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(r => srv.listen(0, r)); const url = `http://127.0.0.1:${srv.address().port}/`;
const N = +(process.argv[2] || 100), PLAY = +(process.argv[3] || 20);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, acceptDownloads: true });
const page = await ctx.newPage(); const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await page.goto(url + '?nosw'); await page.waitForFunction(() => window.__RS, null, { timeout: 15000 }); await page.waitForTimeout(1500);
const rep = { ui: [], play: {}, sim: {} };
if (await page.locator('#oDaily.on').count()) { await page.click('[data-act=daily]'); rep.ui.push('regalo diario ✔'); }
if (shots) await page.screenshot({ path: shots + '/portada.png' });
// recorrido de pantallas
for (const [scr, extra] of [['sGarage', ['[data-act=gtab][data-arg=cos]', '[data-act=gtab][data-arg=up]', '[data-act=gtab][data-arg=veh]', '[data-act=veh][data-arg=bike]', '[data-act=cfNo]']], ['sRank', ['[data-act=rtab][data-arg=me]', '[data-act=rtab][data-arg=city]']], ['sStory', []], ['sMis', []], ['sSet', ['[data-act=set][data-arg=fps]', '[data-act=qual][data-arg=baja]', '[data-act=qual][data-arg=auto]', '[data-act=set][data-arg=fps]']]]) {
  await page.evaluate(s => window.__RS.act('go', s), scr); await page.waitForTimeout(250);
  for (const sel of extra) { const l = page.locator(sel); if (await l.count() && await l.first().isVisible()) { await l.first().click(); await page.waitForTimeout(120); } }
  rep.ui.push(scr + ' ✔');
  if (shots && scr === 'sGarage') await page.screenshot({ path: shots + '/garaje.png' });
  await page.evaluate(() => window.__RS.act('go', 'sCover')); await page.waitForTimeout(120);
}
// partida real con render + IA
await page.click('[data-act=play][data-arg=ch]'); await page.evaluate(() => { window.__RS.autoplay = true; });
const t0 = Date.now(); let shot = false, maxDraws = 0;
while (Date.now() - t0 < PLAY * 1000) {
  await page.waitForTimeout(500);
  const st = await page.evaluate(() => ({ m: window.__RS.mode, d: window.__RS.R.draws, s: window.__RS.G && window.__RS.G.p.s }));
  maxDraws = Math.max(maxDraws, st.d || 0);
  if (shots && !shot && st.s > 300) { shot = true; await page.screenshot({ path: shots + '/juego.png' }); }
  if (st.m === 'dead') await page.click('[data-act=norevive]');
  if (st.m === 'over') { rep.play.overScreen = true; await page.click('#oOver [data-act=play]'); await page.evaluate(() => { window.__RS.autoplay = true; }); }
}
rep.play.drawsMax = maxDraws;
rep.play.state = await page.evaluate(() => { const G = window.__RS.G; return G ? { dist: Math.round(G.p.s), score: Math.round(G.score), obs: G.obs.length, coins: G.coins.length, scen: G.scen.length, parts: window.__RS.RN.parts.length } : null; });
// pausa / reanudar
await page.evaluate(() => window.__RS.act('pause')); rep.play.pause = await page.evaluate(() => window.__RS.mode); await page.evaluate(() => window.__RS.act('resume')); await page.waitForTimeout(3300); rep.play.resumed = await page.evaluate(() => window.__RS.mode);
// forzar fin y pantalla final
await page.evaluate(() => { const G = window.__RS.G; G.p.shield = 0; G.p.turbo = 0; G.p.inv = 0; window.__RS.autoplay = false; });
for (let i = 0; i < 60; i++) { const m = await page.evaluate(() => window.__RS.mode); if (m === 'dead') { await page.click('[data-act=norevive]'); break; } if (m === 'over') break; await page.waitForTimeout(250); }
rep.play.final = await page.evaluate(() => window.__RS.mode);
if (shots) await page.screenshot({ path: shots + '/final.png' });
// exportar
const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.evaluate(() => window.__RS.act('exp'))]);
if (dl) { const p = await dl.path(); const j = JSON.parse(fs.readFileSync(p, 'utf8')); rep.export = { file: dl.suggestedFilename(), runs: j.partidas.length, ok: !!j.perfil }; }
rep.export2 = await page.evaluate(() => { const t = window.__RS.exportJSON(); return window.__RS.importJSON(t) && window.__RS.exportCSV().split('\n').length; });
// 100 partidas simuladas dentro del navegador
rep.sim = await page.evaluate(n => { const out = { n, err: 0, bad: 0, dist: 0, causes: {} }; const V = ['scooter', 'quad', 'skate', 'bike', 'escooter'];
  for (let i = 0; i < n; i++) { const r = window.__RS.simulate({ seed: 77 + i * 104729, veh: V[i % 5], maxT: 180, revive: i % 4 === 0 }); out.err += r.errs.length; out.bad += r.bad; out.dist += r.dist / n; out.causes[r.cause] = (out.causes[r.cause] || 0) + 1; }
  out.dist = Math.round(out.dist); return out; }, N);
rep.ERR = await page.evaluate(() => window.__RS.ERR.slice(0, 10)); rep.errores = errs.slice(0, 10);
console.log(JSON.stringify(rep, null, 1));
await browser.close(); srv.close();
process.exit(errs.length || rep.ERR.length || rep.sim.err || rep.sim.bad ? 1 : 0);
