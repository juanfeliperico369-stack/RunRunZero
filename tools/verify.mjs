// Verifica una URL publicada: carga, service worker activo, abre sin conexión, instalable, etiquetas para compartir
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const url = process.argv[2]; if (!url) { console.error('uso: node verify.mjs URL'); process.exit(2); }
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-'));
const ctx = await chromium.launchPersistentContext(dir, { headless: true, viewport: { width: 390, height: 844 }, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'], ...(process.env.CHROME ? { executablePath: process.env.CHROME } : {}) });
const page = ctx.pages()[0] || await ctx.newPage(); const errs = [];
page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const R = {}; const t0 = Date.now();
const res = await page.goto(url, { waitUntil: 'load' }); R.http = res.status();
await page.waitForFunction(() => window.__RS, null, { timeout: 20000 }); R.carga_ms = Date.now() - t0;
R.sw = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; await new Promise(ok => setTimeout(ok, 1500)); return { estado: r.active && r.active.state, scope: r.scope, cache: (await caches.keys()).join(',') }; });
const cdp = await ctx.newCDPSession(page);
R.instalable = (await cdp.send('Page.getInstallabilityErrors')).installabilityErrors.map(e => e.errorId);
const man = await cdp.send('Page.getAppManifest'); R.manifest = { url: man.url, errores: man.errors.map(e => e.message) };
R.meta = await page.evaluate(async () => {
  const q = s => (document.querySelector(s) || {}).content || (document.querySelector(s) || {}).href || null;
  const img = new Image(); img.src = q('meta[property="og:image"]'); await img.decode().catch(() => {});
  const at = await fetch(q('link[rel="apple-touch-icon"]')).then(r => r.ok).catch(() => false);
  return { ogUrl: q('meta[property="og:url"]'), ogImage: q('meta[property="og:image"]'), ogSize: img.naturalWidth + 'x' + img.naturalHeight, appleTitle: q('meta[name="apple-mobile-web-app-title"]'), appleCapable: q('meta[name="apple-mobile-web-app-capable"]'), viewportFit: /viewport-fit=cover/.test(q('meta[name="viewport"]')), appleIcon: at, favicon: !!document.querySelector('link[rel="icon"]') };
});
await page.reload({ waitUntil: 'load' }); R.controlado = await page.evaluate(() => !!navigator.serviceWorker.controller);
await ctx.setOffline(true);
await page.reload({ waitUntil: 'load' }).catch(e => { R.offlineError = e.message; });
R.offline = await page.waitForFunction(() => window.__RS && window.__RS.mode === 'menu', null, { timeout: 15000 }).then(() => true).catch(() => false);
if (R.offline) { await page.evaluate(() => { document.getElementById('oDaily').classList.remove('on'); window.__RS.start(); window.__RS.autoplay = true; }); await page.waitForTimeout(4000); R.offlineJuego = await page.evaluate(() => Math.round(window.__RS.G.p.s)); }
await ctx.setOffline(false);
R.erroresConsola = errs.filter(e => !/net::ERR_INTERNET_DISCONNECTED/.test(e));
R.ok = R.http === 200 && R.sw.estado === 'activated' && R.controlado && R.offline && R.instalable.length === 0 && R.manifest.errores.length === 0 && R.meta.ogSize === '1200x630' && R.meta.appleIcon && R.erroresConsola.length === 0;
console.log(JSON.stringify(R, null, 1));
await ctx.close(); process.exit(R.ok ? 0 : 1);
