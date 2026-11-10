/* ===== MODELOS low-poly + atlas estilo revista EMSAY ===== */
const PC = (i, sh = 1) => [i / 4, sh, 0];           // color de paleta (índice 0..4, sombra)
const DK = hex('#1c1c22'), GR = hex('#8a8f96'), WH = hex('#f4f1e6'), SKIN = hex('#c98e62');
const AR = (x, y, w, h) => { const p = 1; return [(x + p) / 1024, (y + p) / 1024, (x + w - p) / 1024, (y + h - p) / 1024]; };
const BILL = i => AR((i % 2) * 512, Math.floor(i / 2) * 192, 512, 192);
const ATR = { shadow: AR(32, 960, 64, 64), bike: AR(96, 960, 64, 64), arrow: AR(160, 960, 64, 64), x2: AR(224, 960, 64, 64), cover: AR(288, 960, 48, 64), star: AR(336, 960, 64, 64), eye: AR(400, 960, 64, 64) };

function makeAtlas() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
  const x = c.getContext('2d'), TT = '"Titulos","Arial Narrow",Impact,sans-serif', CU = '"Cuerpo",system-ui,sans-serif', SE = 'Georgia,"Times New Roman",serif', MO = 'ui-monospace,Consolas,monospace';
  x.textBaseline = 'middle'; x.textAlign = 'center';
  const sp = (t, n) => t.split('').join(String.fromCharCode(8202).repeat(n));
  const fit = (t, f, maxW, size) => { let s = size; do { x.font = f.replace('#', s); s -= 2; } while (x.measureText(t).width > maxW && s > 8); };
  const D = [
    (X, Y) => { x.fillStyle = '#0e6378'; x.fillRect(X, Y, 512, 192); x.fillStyle = '#fff'; fit(sp('EMSAY', 3), '800 #px ' + CU, 250, 64); x.fillText(sp('EMSAY', 3), X + 140, Y + 92);
      x.fillStyle = '#e8e4c4'; x.fillRect(X + 286, Y + 40, 206, 112); x.fillStyle = '#0e6378'; fit('DISPONIBLE', '600 #px ' + CU, 180, 30); x.fillText('DISPONIBLE', X + 389, Y + 76); x.fillText('CADA DOMINGO', X + 389, Y + 116);
      x.fillStyle = '#e8e4c4'; x.fillRect(X, Y + 176, 512, 6); },
    (X, Y) => { x.fillStyle = '#f3efe0'; x.fillRect(X, Y, 512, 192); x.fillStyle = '#1d4e79'; fit('RUN SCOOTER', '#px ' + TT, 480, 132); x.fillText('RUN SCOOTER', X + 256, Y + 84);
      x.fillStyle = '#e03a2f'; x.font = 'italic 26px ' + SE; x.fillText('¿Sabes a dónde lleva?', X + 256, Y + 160); },
    (X, Y) => { x.fillStyle = '#fbe7a9'; x.fillRect(X, Y, 512, 192); x.lineWidth = 10; x.strokeStyle = '#111'; x.strokeRect(X + 14, Y + 14, 484, 164);
      x.fillStyle = '#111'; fit(sp('SESIÓN 1:', 2), '800 #px ' + CU, 440, 40); x.fillText(sp('SESIÓN 1:', 2), X + 256, Y + 66); fit(sp('ESCUCHAR & OÍR', 2), '800 #px ' + CU, 440, 40); x.fillText(sp('ESCUCHAR & OÍR', 2), X + 256, Y + 126); },
    (X, Y) => { x.fillStyle = '#9a9ea6'; x.fillRect(X, Y, 512, 192); x.lineWidth = 8; x.strokeStyle = '#111'; x.strokeRect(X + 12, Y + 12, 488, 168);
      x.lineWidth = 2.5; fit(sp('ORALIDAD', 3), '700 #px ' + CU, 330, 46); x.strokeText(sp('ORALIDAD', 3), X + 200, Y + 58); x.fillStyle = '#111'; x.fillRect(X + 40, Y + 94, 300, 8);
      fit(sp('COMPONENTES & TÉCNICAS', 1), '800 #px ' + CU, 330, 22); x.fillText(sp('COMPONENTES & TÉCNICAS', 1), X + 196, Y + 136);
      x.lineWidth = 4; x.font = '150px ' + TT; x.strokeText('7', X + 430, Y + 100); },
    (X, Y) => { x.fillStyle = '#c0191c'; x.fillRect(X, Y, 512, 192); x.fillStyle = '#111'; x.textAlign = 'left'; x.font = 'italic 46px ' + SE; x.fillText('Niveles de', X + 22, Y + 56); x.fillText('Lectura', X + 22, Y + 108);
      x.font = '300 24px ' + CU; x.fillText('DESENTRAÑAR EL TEXTO', X + 22, Y + 160); x.textAlign = 'center';
      x.fillStyle = '#f2f2f2'; x.beginPath(); x.ellipse(X + 410, Y + 96, 82, 60, 0, 0, 7); x.fill(); x.fillStyle = '#111'; x.beginPath(); x.arc(X + 410, Y + 96, 40, 0, 7); x.fill();
      x.fillStyle = '#c0191c'; x.beginPath(); x.arc(X + 410, Y + 96, 14, 0, 7); x.fill(); },
    (X, Y) => { x.fillStyle = '#1b4459'; x.fillRect(X, Y, 512, 192); x.strokeStyle = '#ff5a2a'; x.lineWidth = 9; x.lineCap = 'round';
      for (const yy of [Y + 26, Y + 168]) { x.beginPath(); for (let i = 0; i <= 40; i++) { const xx = X + 30 + i * 11.3; const w = yy + Math.sin(i * 0.9) * 8; i ? x.lineTo(xx, w) : x.moveTo(xx, w); } x.stroke(); }
      fit('TIPOLOGÍAS', '#px ' + TT, 440, 96); x.fillStyle = '#0b1d27'; x.fillText('TIPOLOGÍAS', X + 261, Y + 91); x.fillStyle = '#ff5a2a'; x.fillText('TIPOLOGÍAS', X + 256, Y + 86);
      x.fillStyle = '#e8c25a'; x.font = '800 20px ' + CU; x.fillText(sp('¡SIN FIN!', 2), X + 256, Y + 142); },
    (X, Y) => { x.fillStyle = '#c49a2c'; x.fillRect(X, Y, 512, 192); x.fillStyle = '#111'; x.fillRect(X, Y + 140, 512, 52); x.fillStyle = '#c49a2c';
      for (let i = 0; i < 22; i++) { x.fillRect(X + 8 + i * 23, Y + 146, 12, 10); x.fillRect(X + 8 + i * 23, Y + 176, 12, 10); }
      x.fillStyle = '#fff'; x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowOffsetY = 4; fit('En la Ruta y', '800 #px ' + CU, 460, 50); x.fillText('En la Ruta y', X + 256, Y + 46); x.fillText('la Ciclovía', X + 256, Y + 102); x.shadowColor = 'transparent';
      x.fillStyle = '#fff'; x.font = '600 15px ' + MO; x.fillText('FILM KJ188 PLUS · VIVE A TU ESTILO', X + 256, Y + 166); },
    (X, Y) => { x.fillStyle = '#000'; x.fillRect(X, Y, 512, 192); x.strokeStyle = '#a42cff'; x.lineWidth = 8; x.shadowColor = '#a42cff'; x.shadowBlur = 18; x.strokeRect(X + 12, Y + 12, 488, 168);
      x.shadowColor = '#39c8ff'; x.fillStyle = '#39c8ff'; fit('RUN SCOOTER', '#px ' + TT, 440, 104); x.fillText('RUN SCOOTER', X + 256, Y + 86); x.shadowBlur = 8; x.shadowColor = '#ff2fb3'; x.fillStyle = '#ff2fb3';
      x.font = '700 20px ' + MO; x.fillText(sp('DOC ELEMENT EDITION', 1), X + 256, Y + 152); x.shadowBlur = 0; x.shadowColor = 'transparent'; },
    (X, Y) => { x.fillStyle = '#f3efe0'; x.fillRect(X, Y, 512, 192); x.lineWidth = 10; x.strokeStyle = '#c0191c'; x.strokeRect(X + 10, Y + 10, 492, 172);
      x.fillStyle = '#c0191c'; fit('KILÓMETRO CERO', '#px ' + TT, 460, 100); x.fillText('KILÓMETRO CERO', X + 256, Y + 84); x.fillStyle = '#1d4e79'; x.font = '800 20px ' + CU; x.fillText(sp('LA CICLOVÍA SIN FIN', 2), X + 256, Y + 148); },
    (X, Y) => { x.fillStyle = '#e8e4c4'; x.fillRect(X, Y, 512, 192); x.fillStyle = '#0e6378'; x.fillRect(X, Y, 512, 34); x.fillRect(X, Y + 158, 512, 34);
      x.fillStyle = '#1d4e79'; fit('LA REVISTA SOBRE RUEDAS', '#px ' + TT, 480, 70); x.fillText('LA REVISTA SOBRE RUEDAS', X + 256, Y + 78); fit('MÁS ACTUAL', '#px ' + TT, 480, 56); x.fillText('MÁS ACTUAL', X + 256, Y + 128); }
  ];
  D.forEach((f, i) => { x.save(); x.beginPath(); x.rect((i % 2) * 512, Math.floor(i / 2) * 192, 512, 192); x.clip(); f((i % 2) * 512, Math.floor(i / 2) * 192); x.restore(); });
  // tira inferior: blanco, sombra, símbolos
  x.clearRect(0, 960, 1024, 64); x.fillStyle = '#fff'; x.fillRect(0, 960, 32, 64);
  const gr = x.createRadialGradient(64, 992, 2, 64, 992, 31); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(32, 960, 64, 64);
  x.strokeStyle = '#fff'; x.lineWidth = 4; x.lineCap = 'round';
  x.beginPath(); x.arc(110, 1000, 11, 0, 7); x.stroke(); x.beginPath(); x.arc(146, 1000, 11, 0, 7); x.stroke();
  x.beginPath(); x.moveTo(110, 1000); x.lineTo(122, 980); x.lineTo(140, 980); x.lineTo(146, 1000); x.moveTo(122, 980); x.lineTo(128, 1000); x.lineTo(140, 980); x.moveTo(118, 974); x.lineTo(126, 974); x.moveTo(138, 974); x.lineTo(144, 972); x.stroke();
  x.fillStyle = '#fff'; x.beginPath(); x.moveTo(192, 966); x.lineTo(214, 996); x.lineTo(201, 996); x.lineTo(201, 1020); x.lineTo(183, 1020); x.lineTo(183, 996); x.lineTo(170, 996); x.closePath(); x.fill();
  x.fillStyle = '#ffc23a'; x.beginPath(); x.arc(256, 992, 30, 0, 7); x.fill(); x.fillStyle = '#111'; x.font = '38px ' + TT; x.fillText('×2', 256, 994);
  x.fillStyle = '#e8e4c4'; x.fillRect(288, 960, 48, 64); x.fillStyle = '#0e6378'; x.fillRect(288, 960, 48, 9); x.fillStyle = '#1d4e79'; x.font = '24px ' + TT; x.fillText('RS', 312, 988);
  x.fillStyle = '#c0191c'; x.fillRect(294, 1004, 36, 4); x.fillRect(294, 1012, 26, 3);
  x.fillStyle = '#ffc23a'; x.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, r = i % 2 ? 10 : 30; x.lineTo(368 + Math.cos(a) * r, 992 + Math.sin(a) * r); } x.closePath(); x.fill();
  x.strokeStyle = '#fff'; x.lineWidth = 5; x.beginPath(); x.arc(432, 992, 26, 0, 7); x.stroke(); x.fillStyle = '#c0191c'; x.beginPath(); x.arc(432, 992, 10, 0, 7); x.fill();
  return c;
}

/* barra entre dos puntos en el plano y-z (x fijo) */
function bar(mb, x, y0, z0, y1, z1, t, col, e = 0) {
  const dy = y1 - y0, dz = z1 - z0, L = Math.hypot(dy, dz);
  mb.at(x, (y0 + y1) / 2, (z0 + z1) / 2, 0, Math.atan2(dz, dy), 0, 1, 1, 1, m => m.box(0, 0, 0, t, L, t, col, e));
}
const wheelX = (mb, x, y, z, r, w, col, seg = 12) => mb.at(x, y, z, 0, 0, Math.PI / 2, 1, 1, 1, m => m.cyl(0, -w / 2, 0, r, w, seg, col));

const MOD = {
  road() {
    const m = new MB(), S = 4;
    for (let k = -11; k < 60; k++) {
      const z0 = -k * S, z1 = z0 - S, alt = k & 1, q = (x0, x1, y, col, e = 0, uv) => m.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col, e, uv);
      q(-3.2, 3.2, 0, PC(0, alt ? 1 : 0.955));
      for (const lx of [-1, 1]) { m.quad([lx - 0.06, 0.012, z0], [lx + 0.06, 0.012, z0], [lx + 0.06, 0.012, z0 - 2], [lx - 0.06, 0.012, z0 - 2], PC(3), 1); }
      for (const sd of [-1, 1]) {
        const a = sd * 3.02, b = sd * 3.12; q(Math.min(a, b), Math.max(a, b), 0.012, PC(3), 1);
        const c0 = sd * 3.2, c1 = sd * 3.5; q(Math.min(c0, c1), Math.max(c0, c1), 0.16, PC(4), 1);
        m.quad([c0, 0, z0], [c0, 0.16, z0], [c0, 0.16, z1], [c0, 0, z1], PC(4, 0.8), 1);
        const w0 = sd * 3.5, w1 = sd * 5.3; q(Math.min(w0, w1), Math.max(w0, w1), 0.16, PC(1, alt ? 1 : 0.92));
        m.quad([w1, 0.16, z0], [w1, 0, z0], [w1, 0, z1], [w1, 0.16, z1], PC(1, 0.75));
        const g0 = sd * 5.3, g1 = sd * 80; q(Math.min(g0, g1), Math.max(g0, g1), 0, PC(2, (k >> 1) & 1 ? 1 : 0.9));
      }
      if (k % 10 === 0) {
        m.quad([-0.6, 0.014, z0 - 1], [0.6, 0.014, z0 - 1], [0.6, 0.014, z0 - 2.4], [-0.6, 0.014, z0 - 2.4], PC(3), 1, ATR.bike);
        for (const lx of [-2, 2]) m.quad([lx - 0.45, 0.014, z0 - 20], [lx + 0.45, 0.014, z0 - 20], [lx + 0.45, 0.014, z0 - 21.8], [lx - 0.45, 0.014, z0 - 21.8], PC(3), 1, ATR.arrow);
      }
    }
    return m;
  },
  tree() { const m = new MB(), r = rngOf(5); m.cyl(0, 0, 0, 0.16, 1.7, 6, PC(1)); m.ico(0, 2.45, 0, 1.15, PC(0), 0, 1, r, 0.25); m.ico(0.45, 3.1, 0.2, 0.75, PC(0, 0.88), 0, 1, r, 0.2); return m; },
  pine() { const m = new MB(); m.cyl(0, 0, 0, 0.14, 1.1, 6, PC(1)); m.cyl(0, 0.9, 0, 1.05, 1.5, 7, PC(0, 0.9), 0, 0, false); m.cyl(0, 1.8, 0, 0.82, 1.3, 7, PC(0), 0, 0, false); m.cyl(0, 2.6, 0, 0.55, 1.2, 7, PC(0, 1.08), 0, 0, false); return m; },
  bush() { const m = new MB(), r = rngOf(9); m.ico(0, 0.45, 0, 0.72, PC(0, 0.9), 0, 0.7, r, 0.3); m.ico(0.5, 0.35, 0.2, 0.5, PC(0, 1.05), 0, 0.75, r, 0.3); return m; },
  lamp() { const m = new MB(); m.cyl(0, 0, 0, 0.08, 4.3, 6, PC(1, 0.8)); m.box(-0.7, 4.25, 0, 1.4, 0.09, 0.09, PC(1, 0.8)); m.box(-1.35, 4.12, 0, 0.5, 0.16, 0.3, PC(1, 0.7)); m.box(-1.35, 4.02, 0, 0.42, 0.05, 0.24, PC(4), 1); m.box(0, 0.15, 0, 0.3, 0.3, 0.3, PC(1, 0.7)); return m; },
  bench() { const m = new MB(); m.box(0, 0.45, 0, 0.5, 0.07, 1.6, PC(1, 1.1)); m.box(0.22, 0.75, 0, 0.06, 0.4, 1.6, PC(1, 1.1)); for (const z of [-0.65, 0.65]) m.box(0, 0.22, z, 0.45, 0.45, 0.08, PC(1, 0.6)); return m; },
  hill() { const m = new MB(); m.ico(0, 0, 0, 11, PC(0, 0.8), 0, 0.4, rngOf(3), 0.3); return m; },
  bld(v, pi) {
    const m = new MB(), dims = [[7, 18, 8, 3, 8], [8, 11, 9, 3, 5], [11, 6.5, 9, 5, 3]][v], [w, h, d, cx, cy] = dims;
    m.box(0, h / 2, 0, w, h, d, PC(pi)); m.box(0, h + 0.3, 0, w + 0.3, 0.6, d + 0.3, PC(1, 0.9));
    for (let i = 0; i < cx; i++) for (let j = 0; j < cy; j++) {
      const wx = -w / 2 + (i + 0.5) * w / cx, wy = 1.6 + j * (h - 2.2) / cy, ww = w / cx * 0.5, wh = (h - 2.2) / cy * 0.5, lit = ((i * 7 + j * 3 + v) % 5) > 1 ? 1 : 0;
      const col = lit ? PC(4) : PC(1, 0.6);
      for (const sz of [-1, 1]) m.quad([wx - ww / 2, wy, sz * (d / 2 + 0.02)], [wx + ww / 2, wy, sz * (d / 2 + 0.02)], [wx + ww / 2, wy + wh, sz * (d / 2 + 0.02)], [wx - ww / 2, wy + wh, sz * (d / 2 + 0.02)], col, lit);
      const zz = -d / 2 + (i + 0.5) * d / cx;
      for (const sx of [-1, 1]) m.quad([sx * (w / 2 + 0.02), wy, zz - ww / 2], [sx * (w / 2 + 0.02), wy, zz + ww / 2], [sx * (w / 2 + 0.02), wy + wh, zz + ww / 2], [sx * (w / 2 + 0.02), wy + wh, zz - ww / 2], col, lit);
    }
    return m;
  },
  billFrame() { const m = new MB(); for (const x of [-2, 2]) m.box(x, 1.6, 0.12, 0.16, 3.2, 0.16, PC(1, 0.8)); m.box(0, 3.95, 0.06, 5.0, 1.95, 0.12, PC(1, 0.7)); return m; },
  billPanel(i) { const m = new MB(); m.quad([-2.4, 3.05, 0], [2.4, 3.05, 0], [2.4, 4.85, 0], [-2.4, 4.85, 0], WH, 1, BILL(i)); return m; },
  gateFrame() { const m = new MB(); for (const x of [-4.4, 4.4]) { m.box(x, 3, 0, 0.5, 6, 0.5, PC(1, 0.85)); m.box(x, 0.2, 0, 0.8, 0.4, 0.8, PC(1, 0.7)); } m.box(0, 6.0, 0, 9.4, 0.4, 0.5, PC(1, 0.85)); m.box(0, 5.05, 0.02, 7.1, 2.0, 0.2, PC(1, 0.6)); return m; },
  gatePanel(i) { const m = new MB(); m.quad([-3.4, 4.15, -0.14], [3.4, 4.15, -0.14], [3.4, 5.9, -0.14], [-3.4, 5.9, -0.14], WH, 1, BILL(i)); m.quad([3.4, 4.15, 0.14], [-3.4, 4.15, 0.14], [-3.4, 5.9, 0.14], [3.4, 5.9, 0.14], WH, 1, BILL(i)); return m; },
  rock() { const m = new MB(), r = rngOf(11); m.ico(0, 0.43, 0, 0.62, GR, 0, 0.7, r, 0.3); m.ico(0.45, 0.2, 0.25, 0.3, hex('#6f747b'), 0, 0.7, r, 0.3); return m; },
  cone() { const m = new MB(), o = hex('#ff5a2a'); m.box(0, 0.025, 0, 0.56, 0.05, 0.56, DK); m.cyl(0, 0.05, 0, 0.27, 0.6, 10, o, 0.0, 0.03); m.cyl(0, 0.28, 0, 0.2, 0.12, 10, WH, 0, 0.175, false); return m; },
  barrier() {
    const m = new MB(), red = hex('#c0191c');
    for (const x of [-0.8, 0.8]) { m.box(x, 0.5, 0, 0.08, 1.0, 0.08, GR); m.box(x, 0.03, 0, 0.12, 0.06, 0.5, DK); }
    for (const y of [0.56, 0.9]) for (let i = 0; i < 5; i++) m.box(-0.72 + i * 0.36, y, 0, 0.36, 0.2, 0.06, i % 2 ? WH : red);
    m.box(0.8, 1.06, 0, 0.12, 0.12, 0.12, hex('#ffc23a'), 1); return m;
  },
  pothole() { const m = new MB(), r = rngOf(4); m.at(0, 0, 0, 0, 0, 0, 1, 1, 0.95, q => q.cyl(0, 0.004, 0, 0.78, 0.014, 12, hex('#0d0d10'))); for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; m.box(Math.cos(a) * 0.78, 0.03, Math.sin(a) * 0.72, 0.18 + r() * 0.1, 0.06, 0.14, hex('#55585e')); } return m; },
  puddle() { const m = new MB(); m.at(0, 0, 0, 0, 0, 0, 1, 1, 1.55, q => { q.cyl(0, 0.004, 0, 0.85, 0.012, 12, hex('#5fb4e6'), 1); q.cyl(0.25, 0.006, -0.2, 0.3, 0.012, 8, hex('#d8f1ff'), 1); }); return m; },
  branch(side, lanes) {
    const m = new MB(), brown = hex('#5b4636'), leaf = hex('#3f8a4f'), leaf2 = hex('#2f6e3c'), r = rngOf(lanes.length * 7 + side + 20);
    const tx = side * 4.4, xs = lanes.map(l => (l - 1) * LW), far = side > 0 ? Math.min(...xs) - 1 : Math.max(...xs) + 1, near = side > 0 ? Math.max(...xs) + 1 : Math.min(...xs) - 1;
    m.cyl(tx, 0, 0, 0.32, 4.2, 7, brown); m.ico(tx, 4.6, 0, 1.7, leaf2, 0, 0.85, r, 0.25);
    const len = Math.abs(tx - far); m.at((tx + far) / 2, 3.1, 0, 0, 0, Math.PI / 2, 1, 1, 1, q => q.cyl(0, -len / 2, 0, 0.15, len, 6, brown));
    const lw = Math.abs(near - far); m.at((near + far) / 2, 1.5, 0, 0, 0, Math.PI / 2, 1, 1, 1, q => q.cyl(0, -lw / 2, 0, 0.12, lw, 6, brown));
    for (const x of [near, far]) m.box(x, 2.3, 0, 0.1, 1.6, 0.1, brown);
    for (let x = Math.min(near, far) + 0.3; x < Math.max(near, far); x += 0.62) { m.ico(x, 1.42 + r() * 0.12, (r() - 0.5) * 0.3, 0.36 + r() * 0.1, r() < 0.5 ? leaf : leaf2, 0, 0.8, r, 0.3); }
    return m;
  },
  cart() {
    const m = new MB(), y = hex('#ffd23a'), g = hex('#2f8a3f');
    for (const z of [-0.55, 0.55]) wheelX(m, 0, 0.28, z, 0.28, 1.5, DK, 10);
    m.box(0, 0.85, 0, 1.45, 0.9, 1.6, y); m.box(0, 0.75, 0, 1.47, 0.18, 1.62, g); m.box(0, 1.45, 0, 1.2, 0.3, 1.3, hex('#bfe6ff'), 1);
    m.cyl(0, 1.3, 0, 0.04, 0.8, 5, GR); m.cyl(0, 2.05, 0, 1.15, 0.45, 8, hex('#e03a2f'), 0, 0.05, true); m.cyl(0, 2.07, 0, 0.6, 0.3, 8, WH, 0, 0.05, false);
    return m;
  },
  kiosk() {
    const m = new MB(), t = hex('#0e6378');
    m.box(0, 1.1, 0, 1.75, 2.2, 1.9, t); m.box(0, 2.33, 0, 2.0, 0.18, 2.15, hex('#e8e4c4')); m.box(0, 0.95, 1.0, 1.8, 0.1, 0.3, hex('#e8e4c4'));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = -0.55 + i * 0.55, yy = 1.25 + j * 0.6; m.quad([x - 0.2, yy, 0.96], [x + 0.2, yy, 0.96], [x + 0.2, yy + 0.5, 0.96], [x - 0.2, yy + 0.5, 0.96], WH, 1, ATR.cover); }
    m.quad([-0.86, 0.15, 0.96], [0.86, 0.15, 0.96], [0.86, 0.8, 0.96], [-0.86, 0.8, 0.96], WH, 0, BILL(0)); return m;
  },
  truck(col) {
    const m = new MB(), c = hex(['#0e6378', '#c0191c', '#c49a2c'][col]);
    m.box(0, 1.35, 1.4, 1.86, 2.1, 11.2, c); m.box(0, 2.42, 1.4, 1.9, 0.06, 11.25, hex('#d9d2b0'));
    m.box(0, 1.25, -5.6, 1.86, 1.9, 2.8, c); m.box(0, 1.65, -7.02, 1.7, 0.8, 0.06, hex('#bfe6ff'), 1);
    for (const sx of [-1, 1]) {
      m.quad([sx * 0.94, 0.55, 6.8], [sx * 0.94, 0.55, -4.0], [sx * 0.94, 2.25, -4.0], [sx * 0.94, 2.25, 6.8], WH, 0.3, BILL(sx > 0 ? 0 : 9));
      for (const z of [5, 3.4, -5.4]) wheelX(m, sx * 0.82, 0.38, z, 0.38, 0.3, DK, 10);
    }
    m.quad([-0.9, 0.5, 7.02], [0.9, 0.5, 7.02], [0.9, 2.3, 7.02], [-0.9, 2.3, 7.02], WH, 0.3, BILL(1));
    for (const x of [-0.8, 0.8]) m.box(x, 0.55, 7.03, 0.2, 0.12, 0.05, hex('#ff2a2a'), 1);
    m.box(0, 0.28, 7.0, 1.9, 0.12, 0.2, DK);
    return m;
  },
  ramp(h, len, col) {
    const m = new MB(); m.wedge(0, len / 2, 1.84, len, h, hex(col));
    for (let t = 0.1; t < 0.95; t += 0.2) { const z = len / 2 - len * t, yy = h * t + 0.02, dz = len * 0.07, dh = h * 0.07; m.quad([-0.92, yy, z], [0.92, yy, z], [0.92, yy + dh, z - dz], [-0.92, yy + dh, z - dz], DK); }
    for (const sx of [-1, 1]) m.box(sx * 0.95, h * 0.5, -len / 2 + 0.1, 0.08, h, 0.12, GR);
    return m;
  },
  coin() { const m = new MB(), g = hex('#ffc23a'), g2 = hex('#e09a12'); m.at(0, 0, 0, 0, Math.PI / 2, 0, 1, 1, 1, q => { q.cyl(0, -0.045, 0, 0.34, 0.09, 14, g, 1); q.cyl(0, -0.055, 0, 0.2, 0.11, 10, g2, 1); }); return m; },
  gift() { const m = new MB(), mg = hex('#ff2fb3'), au = hex('#ffc23a'); m.box(0, 0, 0, 0.62, 0.62, 0.62, mg, 0.2); m.box(0, 0, 0, 0.66, 0.64, 0.14, au, 1); m.box(0, 0, 0, 0.14, 0.64, 0.66, au, 1); m.at(0, 0.38, 0, 0.6, 0, 0.5, 1, 1, 1, q => q.box(0, 0, 0, 0.32, 0.12, 0.1, au, 1)); m.at(0, 0.38, 0, -0.6, 0, -0.5, 1, 1, 1, q => q.box(0, 0, 0, 0.32, 0.12, 0.1, au, 1)); return m; },
  clue() { const m = new MB(); m.box(0, 0, 0, 0.56, 0.74, 0.04, hex('#e8e4c4')); m.quad([-0.26, -0.35, -0.025], [0.26, -0.35, -0.025], [0.26, 0.35, -0.025], [-0.26, 0.35, -0.025], WH, 1, ATR.eye); m.quad([0.26, -0.35, 0.025], [-0.26, -0.35, 0.025], [-0.26, 0.35, 0.025], [0.26, 0.35, 0.025], WH, 1, ATR.cover); return m; },
  halo(col) { const m = new MB(), c = hex(col); for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28; m.box(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0, 0.12, 0.12, 0.06, c, 1); } return m; },
  magnet() { const m = new MB(), red = hex('#e03a2f'); for (const x of [-0.18, 0.18]) { m.box(x, 0.05, 0, 0.13, 0.38, 0.14, red); m.box(x, -0.2, 0, 0.13, 0.12, 0.14, WH, 1); } m.box(0, 0.27, 0, 0.5, 0.12, 0.14, red); return m; },
  shield() { const m = new MB(), b = hex('#39c8ff'); m.hemi(0, -0.15, 0, 0.36, 10, 3, b, 0.6); m.box(0, -0.05, -0.33, 0.4, 0.08, 0.1, DK); return m; },
  turbo() { const m = new MB(), y = hex('#ffc23a'); const P = [[-0.05, 0.42], [0.22, 0.42], [0.04, 0.06], [0.2, 0.06], [-0.18, -0.45], [-0.02, -0.05], [-0.2, -0.05]];
    for (const z of [-0.05, 0.05]) { m.tri([P[0][0], P[0][1], z], [P[1][0], P[1][1], z], [P[2][0], P[2][1], z], y, 1); m.tri([P[0][0], P[0][1], z], [P[2][0], P[2][1], z], [P[6][0], P[6][1], z], y, 1); m.tri([P[6][0], P[6][1], z], [P[3][0], P[3][1], z], [P[5][0], P[5][1], z], y, 1); m.tri([P[3][0], P[3][1], z], [P[4][0], P[4][1], z], [P[5][0], P[5][1], z], y, 1); m.tri([P[6][0], P[6][1], z], [P[2][0], P[2][1], z], [P[3][0], P[3][1], z], y, 1); }
    return m; },
  x2() { const m = new MB(); m.quad([-0.34, -0.34, -0.02], [0.34, -0.34, -0.02], [0.34, 0.34, -0.02], [-0.34, 0.34, -0.02], WH, 1, ATR.x2); m.quad([0.34, -0.34, 0.02], [-0.34, -0.34, 0.02], [-0.34, 0.34, 0.02], [0.34, 0.34, 0.02], WH, 1, ATR.x2); return m; },
  cube() { const m = new MB(); m.box(0, 0, 0, 1, 1, 1, [1, 1, 1], 1); return m; },
  shadow() { const m = new MB(); m.quad([-0.5, 0.03, 0.5], [0.5, 0.03, 0.5], [0.5, 0.03, -0.5], [-0.5, 0.03, -0.5], [0, 0, 0], 0, ATR.shadow); return m; },
  /* ---- vehículos (adelante = -z, suelo y=0) ---- */
  veh(id, paint, pe) {
    const m = new MB(), c = hex(paint), e = pe ? 1 : 0, w = hex('#2a2a30'), cr = hex('#e8e4c4');
    if (id === 'scooter') {
      m.box(0, 0.1, 0.02, 0.16, 0.045, 0.66, c, e); m.box(0, 0.13, 0.34, 0.14, 0.03, 0.12, w);
      wheelX(m, 0, 0.09, 0.32, 0.09, 0.05, w, 10); wheelX(m, 0, 0.09, -0.32, 0.09, 0.05, w, 10);
      bar(m, 0, 0.1, -0.32, 1.0, -0.42, 0.05, c, e); m.box(0, 1.0, -0.42, 0.54, 0.04, 0.04, w); m.box(0, 0.98, -0.42, 0.62, 0.06, 0.06, DK);
    } else if (id === 'escooter') {
      m.box(0, 0.15, 0, 0.22, 0.07, 0.86, c, e); m.box(0, 0.1, 0, 0.18, 0.06, 0.6, DK);
      wheelX(m, 0, 0.12, 0.4, 0.12, 0.07, w, 10); wheelX(m, 0, 0.12, -0.42, 0.12, 0.07, w, 10);
      bar(m, 0, 0.16, -0.42, 1.05, -0.48, 0.075, c, e); m.box(0, 1.05, -0.48, 0.56, 0.045, 0.045, w); m.box(0, 0.82, -0.5, 0.12, 0.08, 0.06, hex('#fff6c8'), 1);
      m.box(0, 0.22, 0.46, 0.2, 0.04, 0.1, hex('#ff2a2a'), 1);
    } else if (id === 'bike') {
      for (const z of [0.52, -0.52]) { wheelX(m, 0, 0.34, z, 0.34, 0.04, w, 14); wheelX(m, 0, 0.34, z, 0.08, 0.07, GR, 8); }
      bar(m, 0, 0.36, -0.02, 0.95, -0.42, 0.06, c, e); bar(m, 0, 0.9, 0.12, 0.95, -0.42, 0.055, c, e); bar(m, 0, 0.36, -0.02, 0.92, 0.12, 0.055, c, e);
      bar(m, 0, 0.36, -0.02, 0.34, 0.52, 0.04, c, e); bar(m, 0, 0.9, 0.12, 0.34, 0.52, 0.04, c, e); bar(m, 0, 0.95, -0.42, 0.34, -0.52, 0.045, c, e);
      m.box(0, 0.97, 0.14, 0.14, 0.05, 0.26, DK); m.box(0, 1.05, -0.46, 0.56, 0.04, 0.04, w); bar(m, 0, 0.95, -0.42, 1.05, -0.46, 0.04, w);
      m.box(0, 0.36, -0.02, 0.32, 0.03, 0.06, DK);
      m.box(0, 0.86, -0.72, 0.42, 0.04, 0.34, GR); for (const sx of [-1, 1]) m.box(sx * 0.2, 0.96, -0.72, 0.03, 0.2, 0.34, GR); m.box(0, 0.96, -0.89, 0.42, 0.2, 0.03, GR);
      m.box(0, 0.95, -0.72, 0.34, 0.14, 0.26, cr); m.box(0, 1.03, -0.72, 0.3, 0.04, 0.24, hex('#0e6378'));
    } else if (id === 'skate') {
      m.box(0, 0.12, 0, 0.25, 0.035, 0.6, c, e); m.at(0, 0.15, -0.36, 0, -0.35, 0, 1, 1, 1, q => q.box(0, 0, 0, 0.25, 0.035, 0.16, c, e)); m.at(0, 0.15, 0.36, 0, 0.35, 0, 1, 1, 1, q => q.box(0, 0, 0, 0.25, 0.035, 0.16, c, e));
      m.box(0, 0.14, 0, 0.24, 0.01, 0.58, DK);
      for (const z of [-0.24, 0.24]) { m.box(0, 0.085, z, 0.2, 0.04, 0.05, GR); for (const sx of [-1, 1]) wheelX(m, sx * 0.11, 0.05, z, 0.05, 0.045, cr, 8); }
    } else if (id === 'trike') {
      for (const sx of [-1, 1]) wheelX(m, sx * 0.42, 0.26, -0.62, 0.26, 0.05, w, 12);
      wheelX(m, 0, 0.32, 0.55, 0.32, 0.04, w, 14); m.box(0, 0.33, -0.62, 0.9, 0.05, 0.08, c, e);
      m.box(0, 0.64, -0.62, 0.86, 0.5, 0.6, hex('#0e6378')); m.box(0, 0.9, -0.62, 0.9, 0.04, 0.64, cr);
      for (const sx of [-1, 1]) m.quad([sx * 0.432, 0.45, -0.88], [sx * 0.432, 0.45, -0.36], [sx * 0.432, 0.84, -0.36], [sx * 0.432, 0.84, -0.88], WH, 0.3, ATR.cover);
      m.quad([-0.3, 0.45, -0.922], [0.3, 0.45, -0.922], [0.3, 0.84, -0.922], [-0.3, 0.84, -0.922], WH, 0.3, BILL(0));
      bar(m, 0, 0.36, -0.02, 0.95, -0.36, 0.06, c, e); bar(m, 0, 0.9, 0.12, 0.95, -0.36, 0.055, c, e); bar(m, 0, 0.36, -0.02, 0.92, 0.12, 0.055, c, e);
      bar(m, 0, 0.36, -0.02, 0.32, 0.55, 0.04, c, e); bar(m, 0, 0.9, 0.12, 0.32, 0.55, 0.04, c, e); bar(m, 0, 0.36, -0.02, 0.36, -0.34, 0.05, c, e);
      m.box(0, 0.97, 0.14, 0.14, 0.05, 0.26, DK); m.box(0, 1.08, -0.4, 0.6, 0.04, 0.04, w); bar(m, 0, 0.95, -0.36, 1.08, -0.4, 0.04, w); m.box(0, 0.36, -0.02, 0.32, 0.03, 0.06, DK);
    } else if (id === 'euc') {
      wheelX(m, 0, 0.3, 0, 0.3, 0.1, w, 14); wheelX(m, 0, 0.3, 0, 0.12, 0.13, GR, 8);
      for (const sx of [-1, 1]) { m.box(sx * 0.085, 0.36, 0, 0.05, 0.42, 0.5, c, e); m.box(sx * 0.15, 0.17, 0, 0.12, 0.025, 0.2, DK); }
      m.box(0, 0.6, 0, 0.2, 0.06, 0.36, c, e); m.box(0, 0.45, -0.31, 0.1, 0.05, 0.03, hex('#fff6c8'), 1); m.box(0, 0.45, 0.31, 0.1, 0.04, 0.03, hex('#ff2a2a'), 1);
    } else if (id === 'long') {
      m.box(0, 0.13, 0, 0.27, 0.035, 1.0, c, e); m.box(0, 0.152, 0, 0.26, 0.01, 0.96, DK);
      for (const z of [-0.36, 0.36]) { m.box(0, 0.09, z, 0.24, 0.04, 0.06, GR); for (const sx of [-1, 1]) wheelX(m, sx * 0.13, 0.06, z, 0.06, 0.055, hex('#ff5a2a'), 10); }
    } else if (id === 'inline') {
      m.box(0, 0.2, 0.02, 0.125, 0.24, 0.27, c, e); m.box(0, 0.36, 0.07, 0.13, 0.12, 0.15, c, e); m.box(0, 0.3, 0.075, 0.135, 0.03, 0.155, DK);
      m.box(0, 0.07, 0, 0.045, 0.05, 0.36, GR); m.box(0, 0.055, 0.2, 0.05, 0.07, 0.07, DK);
      for (const z of [-0.135, -0.045, 0.045, 0.135]) wheelX(m, 0, 0.05, z, 0.05, 0.03, hex('#39c8ff'), 8);
    } else if (id === 'quad') {
      m.box(0, 0.16, 0.01, 0.13, 0.2, 0.27, c, e); m.box(0, 0.24, 0.08, 0.12, 0.14, 0.12, c, e); m.box(0, 0.05, 0, 0.14, 0.03, 0.28, GR); m.box(0, 0.035, -0.16, 0.06, 0.06, 0.05, hex('#ff2fb3'));
      for (const z of [-0.09, 0.09]) for (const sx of [-1, 1]) wheelX(m, sx * 0.065, 0.045, z, 0.045, 0.035, cr, 8);
    }
    return m;
  },
  /* ---- repartidor (origen en la cadera) ---- */
  rider(cos) {
    const sh = hex(cos.shirt), pa = hex(cos.pants), he = hex(cos.helmet), se = cos.se ? 1 : 0, hE = cos.he ? 1 : 0;
    const t = new MB();
    t.box(0, 0.06, 0, 0.36, 0.16, 0.22, pa); t.box(0, 0.36, 0, 0.4, 0.5, 0.24, sh, se); t.box(0, 0.62, 0, 0.13, 0.08, 0.13, SKIN);
    t.ico(0, 0.82, 0, 0.165, SKIN); for (const x of [-0.055, 0.055]) t.box(x, 0.84, -0.155, 0.04, 0.035, 0.02, DK);
    t.hemi(0, 0.86, 0, 0.19, 10, 3, he, hE); t.box(0, 0.88, -0.18, 0.3, 0.035, 0.1, he, hE);
    t.box(0, 0.38, 0.2, 0.36, 0.4, 0.18, hex('#0e6378')); t.box(0, 0.5, 0.295, 0.36, 0.08, 0.01, hex('#e8e4c4'), 0.5);
    for (const x of [-0.13, 0.13]) t.box(x, 0.4, -0.125, 0.04, 0.46, 0.02, DK);
    const th = new MB(); th.box(0, -0.21, 0, 0.155, 0.44, 0.165, pa);
    const sn = new MB(); sn.box(0, -0.2, 0, 0.13, 0.42, 0.14, pa); sn.box(0, -0.44, -0.05, 0.14, 0.09, 0.26, WH); sn.box(0, -0.47, -0.05, 0.145, 0.03, 0.265, DK);
    const ar = new MB(); ar.box(0, -0.13, 0, 0.11, 0.27, 0.12, sh, se); ar.box(0, -0.39, 0, 0.09, 0.26, 0.1, SKIN); ar.box(0, -0.55, 0, 0.1, 0.09, 0.11, SKIN);
    return { t, th, sn, ar };
  },
  ink() {
    const m = new MB(), r = rngOf(31), k = hex('#2b2b33'), k2 = hex('#45454f');
    m.ico(0, 0.72, 0, 0.78, k, 0, 0.85, r, 0.35); for (const sx of [-1, 1]) { m.ico(sx * 0.62, 0.38, 0.05, 0.42, k2, 0, 0.8, r, 0.4); m.box(sx * 0.35, 0.1, -0.2, 0.12, 0.2, 0.12, k); }
    for (const sx of [-1, 1]) { m.box(sx * 0.24, 0.98, -0.66, 0.2, 0.16, 0.06, WH, 1); m.box(sx * 0.24, 0.95, -0.7, 0.08, 0.08, 0.04, hex('#c0191c'), 1); }
    m.box(0, 0.62, -0.7, 0.4, 0.07, 0.05, hex('#c0191c'), 1); return m;
  },
  flowers() {
    const m = new MB(), r = rngOf(17);
    for (let i = 0; i < 9; i++) { const a = r() * 6.28, d = r() * 0.9, x = Math.cos(a) * d, z = Math.sin(a) * d, h = 0.25 + r() * 0.3;
      m.box(x, h / 2, z, 0.03, h, 0.03, PC(0, 0.8)); const pc = i % 3 ? PC(4) : PC(3, 1.15);
      for (let k = 0; k < 4; k++) { const b = k * Math.PI / 2 + r(); m.box(x + Math.cos(b) * 0.06, h, z + Math.sin(b) * 0.06, 0.08, 0.025, 0.08, pc, 1); } m.box(x, h + 0.01, z, 0.05, 0.04, 0.05, PC(1, 1.3), 1); }
    for (let i = 0; i < 4; i++) m.cyl((r() - 0.5) * 1.4, 0, (r() - 0.5) * 1.4, 0.16, 0.3 + r() * 0.2, 5, PC(0, 1.05), 0, 0, false);
    return m;
  },
  wing() { const m = new MB(), W = [1, 1, 1];
    m.quad([0, 0, -0.02], [0.08, 0, -0.17], [0.27, 0, -0.13], [0.24, 0, 0.0], W, 1); m.quad([0, 0, 0.0], [0.2, 0, 0.03], [0.17, 0, 0.16], [0.04, 0, 0.12], W, 1);
    m.tri([0.19, 0.003, -0.13], [0.265, 0.003, -0.125], [0.235, 0.003, -0.05], DK); m.tri([0.12, 0.003, 0.06], [0.16, 0.003, 0.12], [0.1, 0.003, 0.11], DK); return m; },
  bfly() { const m = new MB(); m.box(0, 0, 0.02, 0.035, 0.035, 0.2, DK); m.ico(0, 0.005, -0.1, 0.03, DK); for (const sx of [-1, 1]) m.at(sx * 0.02, 0.02, -0.13, 0, 0.9, sx * 0.4, 1, 1, 1, q => q.box(0, 0.05, 0, 0.008, 0.1, 0.008, DK)); return m; },
  bird() { const m = new MB(), b = hex('#3a3f4a'); m.box(0, 0, 0, 0.12, 0.1, 0.38, b); m.ico(0, 0.05, -0.22, 0.07, b); m.box(0, 0.04, -0.3, 0.03, 0.03, 0.07, hex('#ffb02e')); m.box(0, 0.02, 0.24, 0.16, 0.02, 0.12, b); return m; },
  bwing() { const m = new MB(); m.tri([0, 0, -0.1], [0.5, 0.02, 0.06], [0, 0, 0.12], hex('#2d323c')); return m; },
  rabbit() { const m = new MB(), c = hex('#a08a72'), w = hex('#f4f1e6');
    m.ico(0, 0.22, 0.03, 0.2, c, 0, 0.8); m.ico(0, 0.38, -0.17, 0.13, c); for (const sx of [-1, 1]) { m.at(sx * 0.05, 0.55, -0.15, 0, 0.25, sx * 0.15, 1, 1, 1, q => q.box(0, 0, 0, 0.045, 0.2, 0.05, c)); m.box(sx * 0.07, 0.41, -0.28, 0.025, 0.03, 0.02, DK); m.box(sx * 0.09, 0.06, -0.12, 0.06, 0.08, 0.14, c); }
    m.ico(0, 0.26, 0.23, 0.07, w); m.box(0, 0.36, -0.3, 0.03, 0.025, 0.02, hex('#e8a0a0')); return m; },
  /* ---- escenarios nuevos (modo paleta) ---- */
  palm() { const m = new MB(); let x = 0, y = 0; for (let i = 0; i < 6; i++) { const nx = x + 0.12 * i * 0.25; m.at(nx, y, 0, 0, 0, -0.06 * i, 1, 1, 1, q => q.cyl(0, 0, 0, 0.17 - i * 0.015, 0.75, 6, PC(1, i % 2 ? 0.9 : 1.05))); x = nx + 0.05; y += 0.73; }
    for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; m.at(x, y, 0, a, 0, 0, 1, 1, 1, q => q.at(0, 0, -0.9, 0, 0.45, 0, 1, 1, 1, f => f.box(0, 0, 0, 0.5, 0.04, 1.9, PC(0, i % 2 ? 0.9 : 1.08)))); }
    for (let i = 0; i < 3; i++) m.ico(x + Math.cos(i * 2) * 0.18, y - 0.18, Math.sin(i * 2) * 0.18, 0.12, PC(1, 0.7)); return m; },
  parasol() { const m = new MB(); m.cyl(0, 0, 0, 0.04, 2.2, 5, PC(3, 1.6)); m.cyl(0, 1.95, 0, 1.25, 0.5, 8, PC(2), 0, 0.05, true); m.cyl(0, 1.97, 0, 0.7, 0.32, 8, PC(4), 0, 0.05, false); m.box(0.9, 0.03, 0.3, 0.8, 0.04, 1.7, PC(4, 1.1)); return m; },
  sea() { const m = new MB(); m.quad([0, 0.03, 7.5], [80, 0.03, 7.5], [80, 0.03, -7.5], [0, 0.03, -7.5], PC(3), 1); for (const x of [2, 7, 15, 26]) m.quad([x, 0.05, 5], [x + 2.5, 0.05, 5], [x + 2.5, 0.05, -5], [x, 0.05, -5], PC(3, 1.3), 1); m.box(-0.2, 0.08, 0, 0.6, 0.16, 15, PC(1, 1.2)); return m; },
  mount() { const m = new MB(); m.cyl(0, -1, 0, 24, 30, 7, PC(0, 0.72), 0, 0, false); m.cyl(0, 19.6, 0, 7.6, 9.4, 7, PC(3, 1.05), 0, 0, false); return m; },
  fence() { const m = new MB(); for (let z = -6; z <= 6; z += 2) m.box(0, 0.55, z, 0.12, 1.1, 0.12, PC(1, 1.1)); for (const y of [0.45, 0.85]) m.box(0, y, 0, 0.06, 0.12, 12.2, PC(1, 1.25)); return m; },
  coffee() { const m = new MB(), r = rngOf(23); for (let i = 0; i < 4; i++) { const z = -4.5 + i * 3; m.ico(0, 0.6, z, 0.75, PC(0, 0.85 + r() * 0.2), 0, 0.9, r, 0.3); for (let k = 0; k < 7; k++) m.box((r() - 0.5) * 1.1, 0.35 + r() * 0.7, z + (r() - 0.5) * 1.1, 0.1, 0.1, 0.1, PC(4), 1); } return m; },
  rail() { const m = new MB(); for (let z = -6; z <= 6; z += 2) m.box(0, 0.55, z, 0.14, 1.1, 0.14, PC(2)); m.box(0, 1.1, 0, 0.2, 0.12, 12.2, PC(2, 1.1)); m.box(0, 0.6, 0, 0.06, 0.08, 12.2, PC(2, 0.9)); m.box(0, -0.6, 0, 0.6, 1.4, 12.2, PC(1, 0.8)); return m; },
  boat() { const m = new MB(); m.box(0, 0.25, 0, 1.6, 0.5, 4.2, PC(2)); m.box(0, 0.52, 0, 1.7, 0.08, 4.3, PC(4)); m.cyl(0, 0.5, 0.3, 0.06, 3.4, 5, PC(1)); m.tri([0, 3.8, 0.28], [0, 0.9, 0.28], [0, 0.9, -1.6], PC(3, 1.2), 1); return m; },
  tunnel() { const m = new MB(); for (const sx of [-1, 1]) { m.box(sx * 5.8, 3.1, 0, 0.5, 6.2, 12.2, PC(2, 0.7)); m.box(sx * 5.53, 1.0, 0, 0.05, 0.12, 12.2, PC(4), 1); m.box(sx * 5.53, 4.6, 0, 0.05, 0.08, 12.2, PC(4, 0.8), 1); }
    m.box(0, 6.35, 0, 12.1, 0.5, 12.2, PC(1, 0.7)); for (const sx of [-1, 1]) m.box(sx * 2.4, 6.08, 0, 0.45, 0.05, 9.5, hex('#fff3c4'), 1); return m; },
  portal() { const m = new MB(); for (const sx of [-1, 1]) m.box(sx * 10, 4.8, 0, 8.4, 9.6, 1.2, PC(2, 0.85)); m.box(0, 8.0, 0, 12, 3.2, 1.2, PC(2, 0.85)); m.box(0, 6.4, -0.62, 12, 0.3, 0.05, PC(4), 1); m.box(0, 9.7, 0, 28.4, 0.3, 1.4, PC(1, 0.8)); return m; },
  pet(k, col) {
    const m = new MB(), c = hex(col), w = hex('#f4f1e6');
    if (k === 'm1') { m.box(0, 0.42, 0, 0.26, 0.24, 0.55, c); m.box(0, 0.58, -0.36, 0.2, 0.2, 0.24, c); m.box(0, 0.53, -0.5, 0.12, 0.09, 0.1, w); m.box(0, 0.56, -0.56, 0.06, 0.05, 0.03, DK);
      for (const sx of [-1, 1]) { m.box(sx * 0.11, 0.66, -0.3, 0.05, 0.16, 0.09, hex('#7a4f2a')); m.box(sx * 0.06, 0.62, -0.48, 0.03, 0.03, 0.02, DK); for (const z of [-0.18, 0.18]) m.box(sx * 0.09, 0.15, z, 0.07, 0.3, 0.07, c); }
      m.box(0, 0.5, -0.12, 0.27, 0.05, 0.06, hex('#c0191c')); }
    else if (k === 'm2') { m.box(0, 0.32, 0, 0.2, 0.2, 0.46, c); m.ico(0, 0.48, -0.3, 0.13, c); for (const sx of [-1, 1]) { m.at(sx * 0.07, 0.6, -0.3, 0, 0, sx * -0.2, 1, 1, 1, q => q.cyl(0, 0, 0, 0.05, 0.11, 4, c, 0, 0)); m.box(sx * 0.05, 0.5, -0.42, 0.035, 0.03, 0.02, hex('#ffd23a'), 1); for (const z of [-0.15, 0.15]) m.box(sx * 0.07, 0.12, z, 0.05, 0.24, 0.05, c); } }
    else { m.ico(0, 0, 0, 0.13, c, 0, 1.3); m.ico(0, 0.17, -0.06, 0.09, c); m.box(0, 0.15, -0.16, 0.04, 0.05, 0.06, hex('#ffc23a')); m.box(0, -0.2, 0.12, 0.07, 0.04, 0.22, hex('#c0191c')); for (const sx of [-1, 1]) m.box(sx * 0.04, 0.2, -0.13, 0.025, 0.025, 0.01, DK); }
    return m;
  },
  petTail(k, col) { const m = new MB(), c = hex(col); if (k === 'm3') { m.tri([0, 0, -0.08], [0.32, 0.02, 0.04], [0, 0, 0.12], c); } else m.at(0, 0, 0, 0, -0.9, 0, 1, 1, 1, q => q.box(0, 0.14, 0, 0.05, 0.28, 0.05, c)); return m; },
  /* ---- entregas: buzón, casitas, puerta, vecino, revista ---- */
  buzon() { const m = new MB(), t = hex('#0e6378'); m.box(0, 0.55, 0, 0.09, 1.1, 0.09, GR); m.box(0, 1.24, 0, 0.36, 0.34, 0.52, t); m.at(0, 1.4, 0, 0, Math.PI / 2, 0, 1, 1, 1, q => q.cyl(0, -0.26, 0, 0.18, 0.52, 8, t, 0, 0.18, false));
    m.box(-0.182, 1.26, 0, 0.01, 0.06, 0.3, DK); m.quad([0.182, 1.1, 0.2], [0.182, 1.1, -0.2], [0.182, 1.38, -0.2], [0.182, 1.38, 0.2], WH, 0.3, ATR.cover); m.box(0, 1.08, 0, 0.38, 0.05, 0.54, hex('#e8e4c4')); return m; },
  flag() { const m = new MB(); m.box(0, 0.16, 0, 0.025, 0.32, 0.025, GR); m.box(0, 0.3, -0.09, 0.02, 0.12, 0.18, hex('#c0191c'), 1); return m; },
  house(v) {
    const m = new MB(), wall = hex(['#e8e4c4', '#fbe7a9', '#9fd3c7'][v]), roof = hex(['#c0191c', '#1b4459', '#6b3f16'][v]), hx = 2.75;
    m.box(hx, 1.05, 0, 2.6, 2.1, 2.6, wall); m.box(hx, 0.08, 0, 2.8, 0.16, 2.8, hex('#8a8f96'));
    const Y0 = 2.1, Y1 = 3.25; for (const s of [-1, 1]) m.quad([hx - 1.5, Y0, s * 1.5], [hx + 1.5, Y0, s * 1.5], [hx + 1.5, Y1, 0], [hx - 1.5, Y1, 0], roof);
    for (const xx of [hx - 1.3, hx + 1.3]) m.tri([xx, Y0, -1.3], [xx, Y0, 1.3], [xx, Y1, 0], wall);
    m.box(hx + 0.4, 2.9, 0.6, 0.35, 0.8, 0.35, hex('#5b4636'));
    for (const z of [-0.75]) { m.box(hx - 1.31, 1.25, z, 0.04, 0.6, 0.6, hex('#ffd36b'), 1); m.box(hx - 1.33, 1.25, z, 0.04, 0.66, 0.05, DK); m.box(hx - 1.33, 1.25, z, 0.04, 0.05, 0.66, DK); }
    m.box(hx - 1.32, 0.72, 0.4, 0.03, 1.42, 0.78, DK); m.box(hx - 1.5, 0.08, 0.4, 0.4, 0.06, 0.9, hex('#b9bcc2'));
    for (const z of [-1.2, 1.2]) m.ico(hx - 1.5, 0.3, z, 0.32, hex('#3f8a4f'), 0, 0.8); return m;
  },
  door() { const m = new MB(); m.box(0, 0.66, -0.35, 0.05, 1.3, 0.7, hex('#8a5a32')); m.box(-0.04, 0.66, -0.62, 0.04, 0.06, 0.06, hex('#ffc23a'), 1); return m; },
  resi(v) { const m = new MB(), c = hex(['#ff5a2a', '#2dffb3', '#a42cff'][v]); m.box(0, 0.45, 0, 0.32, 0.5, 0.2, hex('#1b4459')); m.box(0, 0.95, 0, 0.36, 0.5, 0.22, c); m.ico(0, 1.38, 0, 0.16, hex('#a8754e')); m.hemi(0, 1.42, 0.02, 0.17, 8, 2, hex('#2b2112'));
    m.box(-0.08, 1.4, -0.15, 0.04, 0.035, 0.02, DK); m.box(0.08, 1.4, -0.15, 0.04, 0.035, 0.02, DK); m.box(0, 1.31, -0.155, 0.1, 0.025, 0.02, hex('#c0191c')); m.at(-0.22, 1.18, 0, 0, 0, -0.2, 1, 1, 1, q => q.box(0, -0.24, 0, 0.09, 0.48, 0.1, c)); return m; },
  rarm() { const m = new MB(); m.box(0, 0.22, 0, 0.09, 0.44, 0.1, hex('#a8754e')); m.box(0, 0.48, 0, 0.11, 0.11, 0.06, hex('#a8754e')); return m; },
  mag() { const m = new MB(); m.at(0, 0, 0, 0, 0, Math.PI / 2, 1, 1, 1, q => { q.cyl(0, -0.16, 0, 0.06, 0.32, 8, hex('#e8e4c4')); q.cyl(0, -0.05, 0, 0.065, 0.1, 8, hex('#0e6378'), 0.4); }); return m; },
  npc(col) {
    const m = new MB(), c = hex(['#ff5a2a', '#2dffb3', '#a42cff', '#ffc23a'][col]), w = hex('#2a2a30'), sk = hex('#a8754e');
    for (const z of [0.52, -0.52]) wheelX(m, 0, 0.34, z, 0.34, 0.04, w, 12);
    bar(m, 0, 0.36, -0.02, 0.95, -0.42, 0.06, GR); bar(m, 0, 0.9, 0.12, 0.95, -0.42, 0.055, GR); bar(m, 0, 0.36, -0.02, 0.92, 0.12, 0.055, GR); bar(m, 0, 0.95, -0.42, 0.34, -0.52, 0.045, GR);
    m.box(0, 1.0, 0.1, 0.34, 0.16, 0.22, DK); m.at(0, 1.08, 0.05, 0, -0.5, 0, 1, 1, 1, q => { q.box(0, 0.3, 0, 0.4, 0.55, 0.26, c); q.ico(0, 0.75, 0, 0.16, sk); q.hemi(0, 0.79, 0, 0.18, 8, 2, c, 0); });
    for (const sx of [-1, 1]) { bar(m, sx * 0.1, 1.0, 0.1, 0.62, -0.18, 0.13, DK); bar(m, sx * 0.1, 0.62, -0.18, 0.25, -0.05, 0.11, DK); bar(m, sx * 0.22, 1.42, -0.2, 1.06, -0.46, 0.09, c); }
    return m;
  }
};
