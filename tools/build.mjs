// Construye web/index.html (un solo archivo) desde src/
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const root = new URL('../', import.meta.url).pathname, src = root + 'src/', out = root + 'web/';
const URL_PUB = process.env.PUB_URL || 'https://juanfeliperico369-stack.github.io/RunRunZero/';
const order = ['engine', 'data', 'story', 'game', 'models', 'models2', 'render', 'audio', 'ui', 'main'];
const js = "(()=>{'use strict';\n" + order.map(f => `/* ---- ${f}.js ---- */\n` + fs.readFileSync(src + f + '.js', 'utf8')).join('\n') + '\n})();';
const tmp = root + 'tools/.bundle.check.js'; fs.writeFileSync(tmp, js);
try { execSync('node --check ' + tmp, { stdio: 'inherit' }); } finally { fs.unlinkSync(tmp); }
let html = fs.readFileSync(src + 'index.html', 'utf8');
html = html.replace('/*FONTS*/', () => fs.readFileSync(src + 'fonts.css', 'utf8')).replace('/*CSS*/', () => fs.readFileSync(src + 'style.css', 'utf8')).replace('/*JS*/', () => js).replaceAll('%URL%', URL_PUB);
fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(out + 'index.html', html);
console.log('web/index.html', (html.length / 1024).toFixed(1) + ' KB');
