// Bot de lógica: corre N partidas simuladas sin render (Node) y reporta errores/estadísticas
import fs from 'node:fs'; import vm from 'node:vm';
const dir = new URL('../src/', import.meta.url);
const code = ['engine.js', 'data.js', 'game.js'].map(f => fs.readFileSync(new URL(f, dir), 'utf8')).join('\n') + '\n;globalThis.__sim={simulate,VEH};';
const ctx = { console, Math, Object, Array, JSON, Number, Float32Array, Uint8Array, Error, Set, Map };
vm.createContext(ctx); vm.runInContext(code, ctx);
const N = +(process.argv[2] || 100), maxT = +(process.argv[3] || 240);
const vehs = ctx.__sim.VEH.map(v => v.id); const res = []; let errs = 0, bad = 0; const causes = {};
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  let r; try { r = ctx.__sim.simulate({ seed: 1000 + i * 7919, veh: vehs[i % vehs.length], maxT, skill: 1, boost: i % 2 === 0, pet: i % 3 === 0 }); }
  catch (e) { console.log('EXCEPCIÓN seed', i, e.stack); errs++; continue; }
  res.push(r); errs += r.errs.length; bad += r.bad; causes[r.cause] = (causes[r.cause] || 0) + 1;
  if (r.errs.length) console.log('ERR', r.seed, r.errs);
}
const avg = k => Math.round(res.reduce((a, r) => a + r[k], 0) / res.length);
console.log(JSON.stringify({ partidas: res.length, errores: errs, filasImposibles: bad, distProm: avg('dist'), distMax: Math.max(...res.map(r => r.dist)), puntosProm: avg('score'), monedasProm: avg('coins'), saltos: avg('jumps'), agachadas: avg('ducks'), trucos: avg('tricks'), furgones: avg('trucks'), regalos: avg('gifts'), pistas: avg('clues'), causas: causes, ms: Date.now() - t0 }, null, 1));
process.exit(errs || bad ? 1 : 0);
