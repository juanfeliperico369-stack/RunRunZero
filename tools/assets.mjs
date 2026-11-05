// Genera íconos, imagen para compartir, manifest y service worker en web/
import fs from 'node:fs'; import http from 'node:http'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const root = new URL('../', import.meta.url).pathname, web = root + 'web/', VERSION = (fs.readFileSync(root + 'src/ui.js', 'utf8').match(/VERSION = '([\d.]+)'/) || [])[1];
const fonts = fs.readFileSync(root + 'src/fonts.css', 'utf8');
const icon = (S, kind) => `<!doctype html><html><head><style>${fonts}
*{margin:0;box-sizing:border-box}html,body{width:${S}px;height:${S}px;overflow:hidden}
.i{width:${S}px;height:${S}px;background:${kind === 'mask' ? '#0e6378' : '#f3efe0'};position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Titulos,Impact,sans-serif;color:#1d4e79}
.b{position:absolute;left:0;right:0;top:0;height:${S * .2}px;background:#0e6378;color:#fff;font:800 ${S * .075}px Cuerpo,sans-serif;letter-spacing:.38em;display:flex;align-items:center;justify-content:center;padding-left:.38em}
.r{position:absolute;left:0;right:0;bottom:${S * .07}px;height:${S * .045}px;background:#c0191c}
.c{display:flex;flex-direction:column;align-items:center;${kind === 'mask' ? `background:#f3efe0;width:${S * .7}px;height:${S * .7}px;border-radius:${S * .08}px;justify-content:center;` : `margin-top:${S * .14}px;`}}
.t1{font-size:${S * (kind === 'mask' ? .36 : .46)}px;line-height:.82}.t2{font-size:${S * (kind === 'mask' ? .155 : .2)}px;line-height:.9;letter-spacing:.01em}
.k{font:italic ${S * .06}px Georgia,serif;color:#e03a2f;margin-top:${S * .01}px}
.s{font-size:${S * .62}px;line-height:.8;margin-top:${S * .12}px}
</style></head><body><div class="i">${kind === 'mask' ? '' : '<div class="b">' + (S > 100 ? 'EMSAY' : '') + '</div>'}
${kind === 'fav' ? '<div class="s">RS</div>' : `<div class="c"><div class="t1">RUN</div><div class="t2">SCOOTER</div>${S > 150 ? '<div class="k">sin fin</div>' : ''}</div>`}${kind === 'reg' ? '<div class="r"></div>' : ''}</div></body></html>`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function shot(html, w, h, file) { const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }); await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150); await p.screenshot({ path: file }); await p.close(); }
for (const [S, kind, f] of [[192, 'reg', 'icon-192.png'], [512, 'reg', 'icon-512.png'], [512, 'mask', 'icon-maskable-512.png'], [180, 'reg', 'apple-touch-icon.png'], [48, 'fav', 'favicon.png']]) await shot(icon(S, kind), S, S, web + f);
fs.mkdirSync(root + 'apk', { recursive: true });
await shot(icon(1024, 'reg'), 1024, 1024, root + 'apk/icon-only.png'); await shot(icon(1024, 'mask'), 1024, 1024, root + 'apk/icon-foreground.png'); await shot('<body style="margin:0;background:#0e6378"></body>', 1024, 1024, root + 'apk/icon-background.png');
// captura del juego en horizontal para la imagen de compartir
const srv = http.createServer((q, r) => { const f = path.join(web, q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0]); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200); fs.createReadStream(f).pipe(r); });
await new Promise(r => srv.listen(0, r));
const g = await browser.newPage({ viewport: { width: 760, height: 630 }, deviceScaleFactor: 1 });
await g.goto(`http://127.0.0.1:${srv.address().port}/?nosw`); await g.waitForFunction(() => window.__RS); await g.waitForTimeout(800);
await g.evaluate(() => { const S = window.__RS.S; S.daily.last = 'x'; S.tut = 0; S.veh = 'bike'; S.owned.bike = 1; S.cos.estela = 't2'; S.ownedCos.t2 = 1; document.getElementById('oDaily').classList.remove('on'); window.__RS.start(); window.__RS.autoplay = true; });
for (let i = 0; i < 400; i++) { const st = await g.evaluate(() => { const R = window.__RS; if (R.mode !== 'play') { R.start(); R.autoplay = true; } if (R.G) R.G.p.shield = 1; return R.G ? R.G.p.s : 0; }); if (st > 140) break; await g.waitForTimeout(400); }
await g.evaluate(() => { document.getElementById('hud').hidden = true; document.getElementById('toasts').innerHTML = ''; window.__RS.act('pause'); document.getElementById('oPause').classList.remove('on'); });
await g.waitForTimeout(300); await g.screenshot({ path: root + 'tools/.shot.png' }); await g.close(); srv.close();
const b64 = fs.readFileSync(root + 'tools/.shot.png').toString('base64');
await shot(`<!doctype html><html><head><style>${fonts}*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;background:#f3efe0;font-family:Titulos,Impact,sans-serif}
.l{position:absolute;left:0;top:0;width:470px;height:630px;display:flex;flex-direction:column;padding:0 34px;color:#1d4e79}
.band{position:absolute;left:0;top:0;width:1200px;height:58px;background:#0e6378;display:flex;color:#fff;font:800 18px Cuerpo,sans-serif;letter-spacing:.42em;align-items:center;padding-left:34px;z-index:3}
.band span{margin-left:auto;background:#e8e4c4;color:#0e6378;height:42px;display:flex;align-items:center;padding:0 26px;letter-spacing:.2em;font-weight:600;margin-right:0}
.t1{font-size:232px;line-height:.8;margin-top:96px}.t2{font-size:100px;line-height:.88}
.k{font:italic 30px Georgia,serif;color:#e03a2f;margin:10px 0 14px}.tag{font-size:44px;color:#0e6378;line-height:.9}
.ph{position:absolute;right:0;top:58px;width:730px;height:572px;background:url(data:image/png;base64,${b64}) center/cover;border-left:8px solid #111}
.adv{position:absolute;right:26px;bottom:24px;background:#f3efe0;border:3px solid #111;font-size:20px;text-align:center;padding:4px 10px;line-height:.9;color:#111;box-shadow:6px 6px 0 #111}
.adv b{display:block;font-size:30px;font-weight:400;background:#111;color:#f3efe0;margin:3px -10px;padding:2px}
.foot{position:absolute;left:0;bottom:0;width:470px;height:46px;background:#e8e4c4;display:flex;align-items:center;padding-left:34px;font-size:24px;color:#1d4e79}</style></head><body>
<div class="band">EMSAY<span>DISPONIBLE CADA DOMINGO</span></div><div class="ph"></div>
<div class="l"><div class="t1">RUN</div><div class="t2">SCOOTER</div><div class="k">¿Sabes a dónde lleva?</div><div class="tag">¡RECORRE LA CICLOVÍA SIN FIN!!!</div></div>
<div class="foot">LA REVISTA SOBRE RUEDAS MÁS ACTUAL</div><div class="adv">JUEGA<b>GRATIS</b>SIN INTERNET</div></body></html>`, 1200, 630, web + 'compartir.png');
await browser.close(); fs.unlinkSync(root + 'tools/.shot.png');
// quitar transparencia (RGB puro)
execFileSync('python3', ['-I', '-c', `import sys\nfrom PIL import Image\nfor f in sys.argv[1:]:\n  im=Image.open(f).convert('RGB'); im.save(f, optimize=True)`, ...['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.png', 'compartir.png'].map(f => web + f).concat(['icon-only.png', 'icon-foreground.png', 'icon-background.png'].map(f => root + 'apk/' + f))]);
fs.writeFileSync(web + 'manifest.webmanifest', JSON.stringify({
  id: './', name: 'Run Scooter · la ciclovía sin fin', short_name: 'Run Scooter', description: 'Corredor sin fin en 3D por la ciclovía: scooter, bici, skate, patines y monopatín eléctrico. Funciona sin internet.',
  lang: 'es', dir: 'ltr', start_url: './', scope: './', display: 'standalone', orientation: 'portrait', background_color: '#f3efe0', theme_color: '#0e6378', categories: ['games', 'entertainment'],
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]
}, null, 1));
fs.writeFileSync(web + 'sw.js', `/* Service worker de Run Scooter: guarda el juego para jugar sin internet */
const CACHE = 'run-scooter-v${VERSION}';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon.png', './compartir.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('run-scooter-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin || u.pathname.endsWith('.apk')) return;
  if (r.mode === 'navigate') {
    e.respondWith(Promise.race([fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); } return res; }), new Promise((_, no) => setTimeout(no, 4000))])
      .catch(() => caches.match('./index.html', { ignoreSearch: true }).then(m => m || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })));
});
`);
fs.writeFileSync(web + '.nojekyll', '');
console.log('assets OK', VERSION, fs.readdirSync(web).join(' '));
