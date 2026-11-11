/* ===== DATOS · vehículos, ediciones (zonas), historia, misiones, rangos ===== */
const VEH = [
  { id: 'foot', name: 'A pie', price: 0, kind: 'h', spd: 0.62, jmp: 1.0, hnd: 1.3, boost: 3.5, perk: 'Parkour: saltas solo rocas, vallas y bolardos', desc: 'Así empieza todo repartidor de EMSAY: tenis, morral y ganas.' },
  { id: 'quad', name: 'Patines quad', price: 600, kind: 'h', spd: 0.8, jmp: 1.0, hnd: 1.32, boost: 4.5, perk: 'Doble salto en el aire', desc: 'Dos ruedas adelante y dos atrás: el más ágil entre carriles.' },
  { id: 'inline', name: 'Patines en línea', price: 1400, kind: 'h', spd: 0.86, jmp: 1.02, hnd: 1.18, boost: 5.5, perk: 'Rueda en hilera: los charcos no te tumban', desc: 'Cuatro ruedas en fila: veloces sobre el asfalto.' },
  { id: 'skate', name: 'Skate', price: 2000, kind: 'h', spd: 0.84, jmp: 1.17, hnd: 1.06, boost: 4.5, perk: 'Ollie alto y trucos ×2', desc: 'Tabla, lija y actitud. Cada salto es un truco.' },
  { id: 'long', name: 'Longboard', price: 2800, kind: 'h', spd: 0.88, jmp: 0.95, hnd: 0.96, boost: 5, perk: 'Bajadas más rápidas y sin perder el control', desc: 'Tabla larga y ruedas blandas: vuela en las bajadas.' },
  { id: 'scooter', name: 'Monopatín', price: 3500, kind: 'h', spd: 0.85, jmp: 1.0, hnd: 1.0, boost: 4.5, perk: 'Equilibrio: el tambaleo dura 2,2 s (no 3 s)', desc: 'El clásico de empuje. Estable y noble.' },
  { id: 'uni', name: 'Monociclo', price: 4200, kind: 'h', spd: 0.83, jmp: 1.05, hnd: 1.2, boost: 4, perk: 'Equilibrista: los roces laterales no te tambalean', desc: 'Una rueda, un sillín y mucho circo.' },
  { id: 'bike', name: 'Bicicleta', price: 5500, kind: 'h', spd: 0.96, jmp: 0.93, hnd: 0.94, boost: 7, perk: '+15 % de puntos', desc: 'La reina de la ciclovía, con canasta de revistas.' },
  { id: 'trike', name: 'Triciclo de carga', price: 7000, kind: 'h', spd: 0.88, jmp: 0.86, hnd: 0.9, boost: 5, perk: 'Entregas ×2 (puntos y monedas)', desc: 'El vehículo oficial de reparto EMSAY, con cajón de revistas.' },
  { id: 'ebike', name: 'Bicicleta eléctrica', price: 9000, kind: 'e', spd: 1.0, jmp: 0.93, hnd: 0.96, boost: 8, perk: 'Asistencia: las subidas no te frenan', desc: 'Pedaleo asistido para repartir sin sudar.' },
  { id: 'escooter', name: 'Monopatín eléctrico', price: 11000, kind: 'e', spd: 0.98, jmp: 0.96, hnd: 1.0, boost: 7, perk: 'Poderes +35 % de duración', desc: 'Batería llena: imán, turbo y x2 duran más.' },
  { id: 'euc', name: 'Monociclo eléctrico', price: 13000, kind: 'e', spd: 1.0, jmp: 1.05, hnd: 1.12, boost: 7.5, perk: 'Mini imán: atrae monedas cercanas', desc: 'Una sola rueda y mucho equilibrio. El más moderno.' },
  { id: 'moped', name: 'Scooter eléctrico', price: 16000, kind: 'e', spd: 1.06, jmp: 0.9, hnd: 0.98, boost: 8.5, perk: 'Batería grande: +50 % de energía', desc: 'Parece una mini moto y no hace ruido.' },
  { id: 'moto', name: 'Moto de reparto', price: 22000, kind: 'm', street: 1, spd: 1.14, jmp: 0.9, hnd: 1.0, boost: 10, perk: 'Sale a la calle · entregas +25 %', desc: 'Con baúl EMSAY. Ojo con el límite de velocidad.' },
  { id: 'auto', name: 'Auto de prensa', price: 30000, kind: 'm', street: 1, spd: 1.18, jmp: 0.92, hnd: 0.92, boost: 10, perk: 'Carrocería: aguanta un golpe cada 45 s', desc: 'El carro de la redacción, con letrero en el techo.' },
  { id: 'camion', name: 'Camión EMSAY', price: 40000, kind: 'm', street: 1, spd: 1.05, jmp: 0.86, hnd: 0.82, boost: 7, perk: 'Cuadrilla: las entregas se hacen solas y perfectas', desc: 'Con personal que te ayuda a repartir toda la edición.' },
  { id: 'jetpack', name: 'Jetpack', price: 60000, kind: 'f', spd: 1.1, jmp: 1.0, hnd: 1.15, boost: 9, perk: 'Propulsión: 4 impulsos en el aire y caída lenta', desc: 'El invento de la Capitana Cometa. Corre en tierra, vuela con ↑.' }
];
const VEHI = Object.fromEntries(VEH.map(v => [v.id, v]));

const COS = {
  casco: [
    { id: 'h0', name: 'Teal EMSAY', c: '#0e6378', p: 0 }, { id: 'h1', name: 'Crema portada', c: '#e8e4c4', p: 300 },
    { id: 'h2', name: 'Rojo sesión 3', c: '#c0191c', p: 600 }, { id: 'h3', name: 'Mostaza final', c: '#c49a2c', p: 900 },
    { id: 'h4', name: 'Neón morado', c: '#a42cff', p: 1500, e: 1 }, { id: 'h5', name: 'Oro del domingo', c: '#ffc23a', st: 5, e: 1 }
  ],
  ropa: [
    { id: 'r0', name: 'Repartidor', a: '#e8e4c4', b: '#1b4459', p: 0 }, { id: 'r1', name: 'Tipologías', a: '#ff5a2a', b: '#1b4459', p: 500 },
    { id: 'r2', name: 'Oralidad gris', a: '#9a9ea6', b: '#2b2d33', p: 700 }, { id: 'r3', name: 'Rojo y negro', a: '#c0191c', b: '#151515', p: 1000 },
    { id: 'r4', name: 'Sesión final', a: '#c49a2c', b: '#4a2e12', p: 1200 }, { id: 'r6', name: 'Sakura', a: '#f4a6c0', b: '#2b2d33', p: 900 }, { id: 'r7', name: 'Caribe', a: '#2f9fd1', b: '#f0d9a0', p: 900 }, { id: 'r8', name: 'Cafetal', a: '#3f8a3a', b: '#6b4226', p: 1100 }, { id: 'r5', name: 'Doc Element', a: '#1a0636', b: '#39c8ff', st: 4, e: 1 }
  ],
  pintura: [
    { id: 'p0', name: 'Teal', c: '#0e6378', p: 0 }, { id: 'p1', name: 'Crema', c: '#e8e4c4', p: 400 },
    { id: 'p2', name: 'Rojo', c: '#c0191c', p: 800 }, { id: 'p3', name: 'Naranja', c: '#ff5a2a', p: 1200 },
    { id: 'p4', name: 'Mostaza', c: '#c49a2c', p: 1600 }, { id: 'p6', name: 'Negro mate', c: '#22242a', p: 1000 }, { id: 'p7', name: 'Rosa sakura', c: '#f4a6c0', p: 1400 }, { id: 'p8', name: 'Verde menta', c: '#2dffb3', p: 2000, e: 1 }, { id: 'p5', name: 'Neón azul', c: '#39c8ff', st: 6, e: 1 }
  ],
  estela: [
    { id: 't0', name: 'Ninguna', p: 0 }, { id: 't1', name: 'Polvo', p: 600 }, { id: 't2', name: 'Confeti EMSAY', p: 1500 },
    { id: 't3', name: 'Línea neón', st: 8 }, { id: 't4', name: 'Estrellas ✦', st: 12 }
  ],
  piel: [
    { id: 's0', name: 'Canela', c: '#c98e62', p: 0 }, { id: 's1', name: 'Miel', c: '#e0b089', p: 0 }, { id: 's2', name: 'Marfil', c: '#f0c9a8', p: 0 },
    { id: 's3', name: 'Cacao', c: '#8a5a3a', p: 0 }, { id: 's4', name: 'Ébano', c: '#5a3a24', p: 0 }
  ],
  pelo: [
    { id: 'k0', name: 'Corto negro', hair: 'corto', c: '#1b1410', p: 0 }, { id: 'k1', name: 'Coleta castaña', hair: 'coleta', c: '#5a3a1e', p: 0 },
    { id: 'k2', name: 'Afro', hair: 'afro', c: '#141010', p: 200 }, { id: 'k3', name: 'Coleta roja', hair: 'coleta', c: '#c0391c', p: 400 },
    { id: 'k6', name: 'Rubio corto', hair: 'corto', c: '#e0b84a', p: 300 }, { id: 'k7', name: 'Moño azul', hair: 'moño', c: '#39c8ff', p: 600 },
    { id: 'k4', name: 'Moño morado', hair: 'moño', c: '#a42cff', ach: 'a8' }, { id: 'k5', name: 'Canas de editor', hair: 'canoso', c: '#e6e6e6', ach: 'a14' }
  ],
  mascota: [
    { id: 'm0', name: 'Sin mascota', p: 0 }, { id: 'm1', name: 'Perro Bache', c: '#c9935e', p: 2500 },
    { id: 'm2', name: 'Gata Tinta', c: '#3a3a46', p: 3500 }, { id: 'm3', name: 'Loro Domingo', c: '#2dbd5a', st: 10 }
  ]
};
const COSI = {}; for (const k in COS) for (const c of COS[k]) COSI[c.id] = Object.assign({ cat: k }, c);

/* Logros: [id, nombre, descripción, estrellas, condición(S, g), cosmético que regala] */
const ACH = [
  ['a1', 'Primera entrega', 'Entrega tu primera revista', 1, S => S.tot.deliv >= 1], ['a2', 'Cartero del barrio', 'Entrega 100 revistas en total', 2, S => S.tot.deliv >= 100],
  ['a3', 'Racha de oro', 'Encadena 10 entregas seguidas', 2, (S, g) => g && g.dBest >= 10], ['a4', 'Medio camino', 'Recorre 2.000 m en una partida', 1, (S, g) => g && g.p.s >= 2000],
  ['a5', 'Sin fin', 'Recorre 5.000 m en una partida', 3, (S, g) => g && g.p.s >= 5000], ['a6', 'Maratón', 'Suma 42.195 m en total', 2, S => S.tot.dist >= 42195],
  ['a7', 'Bolsillo lleno', 'Junta 10.000 monedas en total', 2, S => S.tot.coins >= 10000], ['a8', 'Acróbata', 'Haz 25 trucos en una partida', 2, (S, g) => g && g.tricks >= 25, 'k4'],
  ['a9', 'Rey del camión', 'Sube a 8 camiones en una partida', 1, (S, g) => g && g.trucks >= 8], ['a10', 'Bajo la lluvia', 'Llega a una edición con lluvia', 1, (S, g) => g && g.rainSeen],
  ['a11', 'Topo urbano', 'Atraviesa un túnel', 1, (S, g) => g && g.tunSeen], ['a12', 'Coleccionista', 'Ten 10 vehículos', 3, S => VEH.filter(v => S.owned[v.id]).length >= 10],
  ['a13', 'Con estilo', 'Ten 15 cosméticos', 2, S => Object.keys(S.ownedCos).length >= 15], ['a14', 'Lector de EMSAY', 'Recupera las 12 páginas', 3, S => S.clues >= 12, 'k5'],
  ['a15', 'Madrugador', 'Racha de 7 días de regalo', 2, S => S.daily.streak >= 7], ['a16', 'Retador', 'Supera un Reto del día', 1, S => !!S.ch.rew],
  ['a17', 'Leyenda', 'Llega al rango Leyenda', 3, S => rankOf(S.xp) >= 9], ['a18', 'Poder total', 'Usa 8 poderes en una partida', 1, (S, g) => g && g.powers >= 8],
  ['a21', 'Deletreo', 'Completa la palabra EMSAY', 2, S => S.word && S.word.done >= 1], ['a22', 'Planeador', 'Vuela con el paraguas', 1, (S, g) => g && g.glides >= 1],
  ['a23', 'Buen ciudadano', 'Respeta 10 semáforos en rojo', 1, S => (S.cnt.civic || 0) >= 10], ['a24', 'Escurridizo', 'Pierde a la policía 3 veces', 2, S => (S.cnt.esc || 0) >= 3],
  ['a25', 'Duelista', 'Gana 5 duelos a rivales', 2, S => (S.cnt.duels || 0) >= 5], ['a26', 'Equilibrio total', 'Desliza 150 m por barandas en una partida', 2, (S, g) => g && g.grindM >= 150],
  ['a27', 'Lector voraz', 'Recupera 50 páginas', 3, S => S.clues >= 50], ['a28', 'Hemeroteca', 'Recupera todas las páginas', 5, S => S.clues >= STORY.length],
  ['a29', 'En forma', 'Llega a 80 de capacidad física', 2, S => S.fit >= 80], ['a30', 'Aprendiz aplicado', 'Aprende 3 habilidades de mentores', 2, S => Object.keys(S.ment).length >= 3],
  ['a19', 'Mejor amigo', 'Consigue una mascota', 1, S => Object.keys(S.ownedCos).some(k => /^m[1-9]/.test(k))], ['a20', 'Velocista', 'Toca ⚡ 150 veces en una partida', 1, (S, g) => g && (g.boosts || 0) >= 150]
];
const UPG = [
  { id: 'magnet', name: 'Imán', base: 8, per: 2, icon: '∩' },
  { id: 'turbo', name: 'Turbo', base: 4.5, per: 1, icon: '⚡' },
  { id: 'x2', name: 'Puntos x2', base: 10, per: 3, icon: '×2' },
  { id: 'gift', name: 'Suerte en regalos', base: 0, per: 0, icon: '◆' }
];
UPG.push({ id: 'en', name: 'Aliento y batería', base: 0, per: 8, icon: '♥', pct: 1 }, { id: 'rue', name: 'Ruedas y tenis', base: 0, per: 7, icon: '◎', pct: 1 }, { id: 'fre', name: 'Frenos', base: 0, per: 8, icon: '■', pct: 1 }, { id: 'mor', name: 'Morral de reparto', base: 0, per: 6, icon: '✉', pct: 1 });
const UPC = [400, 900, 1800, 3500, 6000];

/* Ediciones: cada 1000 m cambia la "página" de la revista EMSAY */
const Z = (o) => {
  const r = {}; for (const k in o) r[k] = Array.isArray(o[k]) && typeof o[k][0] === 'string' ? o[k].map(hex) : (typeof o[k] === 'string' && o[k][0] === '#' ? hex(o[k]) : o[k]); return r;
};
const ZRAW = [
  Z({ name: 'PORTADA', sub: 'Disponible cada domingo', bill: 0, top: '#5fb3c9', hor: '#e8e4c4', sunC: '#fff7d6', sun: [0.32, 0.78, 0.05], stars: 0, amb: 0.82, sunI: 0.42, emit: 0.18, fog: [70, 185],
    road: ['#0e6378', '#d9d2b0', '#6f9e5a', '#e8e4c4', '#e8e4c4'], scen: ['#3f8a4f', '#5b4636', '#0e6378', '#e8e4c4', '#ffd36b'], ui: '#0e6378' }),
  Z({ name: 'SESIÓN 1 · ESCUCHAR & OÍR', sub: '¿Estamos realmente conectados?', bill: 2, top: '#ffd77a', hor: '#fbe7a9', sunC: '#fffbe8', sun: [-0.3, 0.72, 0.06], stars: 0, amb: 0.85, sunI: 0.4, emit: 0.18, fog: [70, 185],
    road: ['#c94f3d', '#fff0c2', '#9cbf4a', '#fff6d5', '#3a2a1a'], scen: ['#6fae3e', '#6b4a2b', '#f4c95d', '#e7a33e', '#ffe9a8'], ui: '#b8281f' }),
  Z({ name: 'SESIÓN 2 · ORALIDAD', sub: '7 componentes & técnicas', bill: 3, top: '#c9ccd2', hor: '#9a9ea6', sunC: '#ffffff', sun: [0.2, 0.86, 0.04], stars: 0, amb: 0.8, sunI: 0.35, emit: 0.22, fog: [60, 175],
    road: ['#3a3d44', '#b9bcc2', '#7f8d6c', '#ffffff', '#111111'], scen: ['#5f7a55', '#2b2d33', '#5c6068', '#7c8088', '#fff3c4'], ui: '#2b2d33', tun: 1 }),
  Z({ name: 'SESIÓN 3 · DESENTRAÑAR', sub: 'Niveles de lectura', bill: 4, top: '#ff7a52', hor: '#c0191c', sunC: '#ffe2c2', sun: [0, 0.6, 0.11], stars: 0, amb: 0.75, sunI: 0.45, emit: 0.35, fog: [55, 170],
    road: ['#1a1a1a', '#e8e0d8', '#5a1d17', '#f2f2f2', '#f2f2f2'], scen: ['#2d2d2d', '#111111', '#8e1013', '#e8e0d8', '#ffd0a0'], ui: '#c0191c' }),
  Z({ name: 'TIPOLOGÍAS TEXTUALES', sub: 'Los tipos de texto en la ciudad', bill: 5, top: '#0c2533', hor: '#1b4459', sunC: '#ffe7c7', sun: [0.36, 0.8, 0.035], stars: 0.9, amb: 0.62, sunI: 0.3, emit: 0.8, fog: [55, 170],
    road: ['#0f2a38', '#24506a', '#163847', '#ff5a2a', '#ff5a2a'], scen: ['#2f7d6d', '#0b1d27', '#ff5a2a', '#e8c25a', '#ffd27a'], ui: '#ff5a2a', tun: 1 }),
  Z({ name: 'SESIÓN FINAL · LA RUTA', sub: 'En el discurso y la oratoria', bill: 6, top: '#f6cf6a', hor: '#c49a2c', sunC: '#fff3c8', sun: [-0.15, 0.62, 0.09], stars: 0, amb: 0.82, sunI: 0.42, emit: 0.3, fog: [65, 180],
    road: ['#5a3a1a', '#f5e6c0', '#8a7a2c', '#ffffff', '#ffffff'], scen: ['#8c6d1f', '#3b2410', '#6b3f16', '#f5e6c0', '#fff0b0'], ui: '#6b3f16' }),
  Z({ name: 'EDICIÓN NEÓN · DOC ELEMENT', sub: 'Negro total, bordes morados, letra azul', bill: 7, top: '#000000', hor: '#0b0418', sunC: '#a42cff', sun: [0, 0.7, 0.07], stars: 1, amb: 0.5, sunI: 0.22, emit: 1, fog: [50, 165],
    road: ['#0b0418', '#4d1785', '#05010b', '#39c8ff', '#a42cff'], scen: ['#2dffb3', '#1a0636', '#0b0418', '#1a0636', '#ff2fb3'], ui: '#a42cff', tun: 1 }),
  Z({ name: 'MALECÓN · EDICIÓN PLAYA', sub: 'Brisa, arena y revistas', bill: 1, top: '#5cc6ee', hor: '#f7e7c4', sunC: '#fff7d6', sun: [0.25, 0.8, 0.06], stars: 0, amb: 0.85, sunI: 0.42, emit: 0.2, fog: [75, 190],
    road: ['#d9572b', '#efe2bf', '#f0d9a0', '#ffffff', '#1d4e79'], scen: ['#3aa35a', '#8a5a32', '#ff5a2a', '#2f9fd1', '#ffd23a'], ui: '#2f9fd1' }),
  Z({ name: 'BOSQUE NUBLADO', sub: 'Entre pinos y neblina', bill: 8, top: '#9fbab3', hor: '#d7e3dc', sunC: '#ffffff', sun: [-0.2, 0.85, 0.04], stars: 0, amb: 0.78, sunI: 0.3, emit: 0.3, fog: [35, 145],
    road: ['#2f5d3a', '#c9c2a8', '#3d6b3f', '#f4f1e6', '#8a7a5a'], scen: ['#2e6b3a', '#4a3426', '#5a7d5a', '#e8efe9', '#ffd36b'], ui: '#2f5d3a' }),
  Z({ name: 'FINCA CAFETERA', sub: 'Montañas verdes y casitas de colores', bill: 9, top: '#7fc8f5', hor: '#fff1cf', sunC: '#fff8e0', sun: [0.3, 0.75, 0.06], stars: 0, amb: 0.85, sunI: 0.42, emit: 0.2, fog: [70, 185],
    road: ['#7a3b1f', '#e9d8b4', '#7fb24a', '#ffffff', '#e9d8b4'], scen: ['#3f8a3a', '#6b4226', '#e7dfc8', '#c0191c', '#ff3b30'], ui: '#7a3b1f' }),
  Z({ name: 'PUENTE SOBRE EL RÍO', sub: 'Rueda sobre el agua', bill: 0, top: '#6fb2d6', hor: '#cfe6ee', sunC: '#ffffff', sun: [-0.3, 0.8, 0.05], stars: 0, amb: 0.84, sunI: 0.4, emit: 0.25, fog: [70, 185],
    road: ['#4a4f58', '#b9bcc2', '#2f7fb0', '#ffd23a', '#e8e4c4'], scen: ['#3f8a4f', '#3a3f4a', '#e8e4c4', '#f4f1e6', '#ffd23a'], ui: '#2f7fb0' })
];
/* orden de las ediciones: la revista alterna sus páginas con los nuevos escenarios */
const ZORD = [0, 1, 7, 2, 9, 3, 8, 4, 10, 5, 6];
const ZONES = ZORD.map(i => ZRAW[i]);
/* nombre corto de la zona para letreros de esquina */
const zShort = Z => { const p = Z.name.split(' · '); return p.length > 1 && /^(SESIÓN|EDICIÓN)/.test(p[0]) ? p[1] : p[0]; };
/* zona libre: retos para ganar habilidad */
const DRILL = [
  { k: 'jumps', n: 10, t: 'Salta {n} veces' },
  { k: 'pads', n: 4, t: 'Pisa {n} impulsores' },
  { k: 'grindM', n: 25, t: 'Desliza {n} m en barandas' },
  { k: 'tricks', n: 5, t: 'Haz {n} trucos en el aire' },
  { k: 'combo', n: 1.8, abs: 1, t: 'Sube el estilo a ×{n}' },
  { k: 'jumps', n: 25, t: 'Salta {n} veces' },
  { k: 'parkTr', n: 12, t: 'Haz {n} trucos en el parque' },
  { k: 'cleanS', n: 500, abs: 1, t: 'Rueda {n} m sin caerte' },
  { k: 'grindM', n: 70, t: 'Desliza {n} m en barandas' }
];

/* Misiones (3 activas) — run:1 = dentro de una sola partida */
const MIS = [
  { k: 'coins', t: 'Recoge {n} monedas en una partida', n: [50, 120, 250, 400, 650], run: 1 },
  { k: 'dist', t: 'Recorre {n} m en una partida', n: [500, 1000, 2000, 3500, 5500], run: 1 },
  { k: 'jumps', t: 'Salta {n} veces', n: [15, 35, 70, 120, 200] },
  { k: 'ducks', t: 'Agáchate bajo {n} ramas o talanqueras', n: [3, 8, 16, 28, 45] },
  { k: 'gifts', t: 'Abre {n} regalos', n: [1, 3, 6, 10, 16] },
  { k: 'powers', t: 'Usa {n} poderes', n: [2, 5, 10, 16, 25] },
  { k: 'tricks', t: 'Haz {n} trucos en el aire', n: [5, 12, 25, 45, 70] },
  { k: 'score', t: 'Haz {n} puntos en una partida', n: [1500, 4000, 9000, 18000, 35000], run: 1 },
  { k: 'clean', t: 'Recorre {n} m sin tambalearte', n: [300, 700, 1200, 2000, 3000], run: 1 },
  { k: 'trucks', t: 'Sube a {n} camiones', n: [1, 3, 6, 10, 16] },
  { k: 'zone', t: 'Llega a la edición {n}', n: [2, 3, 4, 6, 8], run: 1 },
  { k: 'deliv', t: 'Haz {n} entregas', n: [8, 20, 40, 70, 110] },
  { k: 'perf', t: 'Haz {n} entregas perfectas', n: [4, 10, 20, 35, 60] },
  { k: 'near', t: 'Pasa rozando a {n} personas', n: [5, 12, 25, 40, 60] },
  { k: 'civic', t: 'Respeta {n} semáforos en rojo', n: [1, 3, 6, 10, 15] },
  { k: 'grind', t: 'Desliza {n} m por barandas', n: [30, 80, 160, 280, 450] },
  { k: 'duels', t: 'Gana {n} duelos a rivales', n: [1, 2, 4, 7, 10] },
  { k: 'dstreak', t: 'Encadena {n} entregas seguidas', n: [3, 5, 8, 12, 16], run: 1 }
];

const RANKS = ['Novato', 'Aprendiz', 'Ciclista', 'Rodador', 'Acróbata', 'Veloz', 'Experto', 'Maestro', 'Élite', 'Leyenda'];
const RANKXP = [0, 400, 1200, 2800, 5500, 9500, 15000, 23000, 34000, 50000];
const rankOf = xp => { let i = 0; while (i < RANKXP.length - 1 && xp >= RANKXP[i + 1]) i++; return i; };

/* Ranking de la ciudad (rivales ficticios) */
const CITY = [
  ['Don Gustavo', 250000], ['La Patinadora', 120000], ['Capitana Cometa', 90000], ['Rueda Loca', 65000], ['Mango Biche', 48000],
  ['Doña Ciclo', 36000], ['El Ollie', 27000], ['Kiko Quad', 20000], ['Paz Pedal', 15000], ['Lu Neón', 11000],
  ['Tomás Turbo', 8200], ['Bache Bravo', 6000], ['Sofi Scooter', 4500], ['Nico Manubrio', 3200], ['La Canasta', 2300],
  ['Pepe Piñón', 1600], ['Rita Rampa', 1100], ['Juancho Cono', 700], ['Bici Bebé', 400], ['El Domingo', 200]
];

const TIPS = [
  'Desliza ↓ en el aire para caer rápido y agacharte al tocar el suelo.',
  'Dos golpes leves en 3 segundos te tumban: conos, charcos y roces cuentan.',
  'Los carriles de la izquierda vienen de frente: úsalos solo para adelantar.',
  'Toca el botón de entrega cuando el aro esté verde: entrega PERFECTA y doble puntaje.',
  'En rojo cruzan carros. Mantén FRENO, espera el verde y ganas puntos por buen ciudadano.',
  'En las bajadas fuertes frena un poco o perderás el control.',
  'El impulso gasta aliento. Entrena a pie o en vehículos de fuerza y tu capacidad física crece.',
  'Con motor no superes el límite: si te sigue la policía, acelera a fondo o frena y cambia de carril.',
  'Salta sobre las barandas para deslizar: dan puntos, estilo y energía.',
  'Si un animalito cruza, frena o pasa por donde ya cruzó.',
  'Las zonas libres recargan tu energía y los trucos valen doble.',
  'Los mentores enseñan habilidades: cúmpleles un favor o págales la clase.',
  'Cada 1000 m cambia la edición: Orbe tiene barrios de todo el mundo.',
  'Las páginas perdidas cuentan la historia de Don Gustavo.',
  'El Reto del día es igual para todos: misma ruta, mismo orden de obstáculos.'
];

/* Mentores: personajes especiales que enseñan habilidades (por un favor o pagando la clase) */
const MENT = [
  { id: 'kiko', look: { skin: '#8a5a3a', hair: 'corto', hc: '#141010', acc: 'banda', shirt: '#ff5a2a' }, barrio: 'Pequeña Lagos', vfav: 'A pie (y por las paredes)', frase: 'Si hay muro, hay camino.', bio: 'Creció saltando bancas en Pequeña Lagos y hoy entrena a los repartidores más jóvenes. Dicen que una vez entregó el periódico subiendo por el andamio de la torre del reloj. Enseña a caer bien antes que a saltar alto.', name: 'Kiko Parkour', perk: 'parkour', hab: 'Parkour', desc: 'Doble salto a pie y en todo vehículo de fuerza.', favor: 'Recorre 8.000 m a pie', key: 'footM', n: 8000, price: 3000, col: '#ff5a2a' },
  { id: 'pati', look: { skin: '#c98e62', hair: 'moño', hc: '#a42cff', acc: 'gafas', shirt: '#a42cff' }, barrio: 'Avenida Neón', vfav: 'Patines en línea', frase: '¡Esto no es una carrera, es una conversación!', bio: 'Patina la Avenida Neón cada noche desde hace quince años. Fue la primera en llevar EMSAY sobre ruedas y nunca ha perdido una página. Le encanta conversar mientras derrapa entre la gente sin rozar a nadie.', name: 'La Patinadora', perk: 'derrape', hab: 'Derrape', desc: 'Cambias de carril 20 % más rápido.', favor: 'Pasa rozando a 60 personas', key: 'near', n: 60, price: 3500, col: '#a42cff' },
  { id: 'correo', look: { skin: '#e0b089', hair: 'canoso', hc: '#d8d8d8', acc: 'gorra', shirt: '#0e6378' }, barrio: 'Centro de Orbe', vfav: 'Triciclo de carga', frase: 'Una carta a tiempo vale por dos.', bio: 'Jefa de correspondencia de EMSAY desde antes de que existiera la ciclovía. Conoce de memoria cada buzón de Orbe y el nombre de cada perro de cada casita. Su lanzamiento de sobres es leyenda en la redacción.', name: 'Doña Correo', perk: 'brazo', hab: 'Brazo de cartero', desc: 'Entregas perfectas más fáciles y desde más lejos.', favor: 'Haz 80 entregas perfectas', key: 'perf', n: 80, price: 4000, col: '#0e6378' },
  { id: 'tito', look: { skin: '#5a3a24', hair: 'calvo', hc: '#111', acc: 'silbato', shirt: '#c49a2c' }, barrio: 'Sabana Dorada', vfav: 'Bicicleta', frase: 'Respira, pedalea, repite.', bio: 'Exmaratonista y entrenador de la selección de Orbe. Corre al lado de sus alumnos con un silbato y un termo de aguapanela. Asegura que el aliento se entrena como cualquier músculo, un metro a la vez.', name: 'Entrenador Tito', perk: 'pulmon', hab: 'Pulmón de acero', desc: '+30 % de aliento y lo recuperas más rápido.', favor: 'Usa el impulso 1.500 veces', key: 'boosts', n: 1500, price: 4500, col: '#c49a2c' },
  { id: 'freno', look: { skin: '#f0c9a8', hair: 'coleta', hc: '#5a3a1e', acc: 'casco', shirt: '#c0191c' }, barrio: 'Puente del Río Mundo', vfav: 'Monopatín eléctrico', frase: 'Frenar a tiempo también es ganar.', bio: 'Instructora de seguridad vial y fan número uno de los semáforos. Ha enseñado a medio Orbe a bajar las cuestas sin desbocarse. Los perros del barrio la saludan porque siempre pasa despacio frente a sus casas.', name: 'Maestra Freno', perk: 'freno', hab: 'Freno fino', desc: 'Frenas 40 % más rápido y los perros no te persiguen.', favor: 'Respeta 25 semáforos en rojo', key: 'civic', n: 25, price: 3500, col: '#c0191c' },
  { id: 'ollie', look: { skin: '#c98e62', hair: 'corto', hc: '#e0b84a', acc: 'gorra2', shirt: '#2dffb3' }, barrio: 'Barrio Sakura', vfav: 'Skate', frase: 'Cada baranda es una página en blanco.', bio: 'Skater del Barrio Sakura que convirtió el parque del Kilómetro Cero en su sala de clases. Inventó tres trucos que llevan su nombre y los regala a quien le haga un buen deslizamiento.', name: 'Ollie', perk: 'trucos', hab: 'Trucos de calle', desc: 'Trucos y barandas valen el doble.', favor: 'Desliza 1.200 m por barandas', key: 'grind', n: 1200, price: 5000, col: '#2dffb3' },
  { id: 'gus', look: { skin: '#d9a47e', hair: 'canoso', hc: '#e6e6e6', acc: 'boina', shirt: '#1b4459', must: 1 }, barrio: 'Kilómetro Cero', vfav: 'Bicicleta antigua', frase: 'La revista nunca fue mía. Es de quien la reparte.', bio: 'Fundador de EMSAY. Desapareció hace diez años el día que inauguraron la ciclovía y desde entonces deja notas en los márgenes de las páginas perdidas. Algunos dicen que aún reparte en algún carril de Orbe.', name: 'Don Gustavo', perk: 'ojo', hab: 'Ojo de editor', desc: 'Aparecen más páginas perdidas y letras.', favor: 'Recupera 30 páginas', key: 'pages', n: 30, price: 6000, col: '#e8e4c4' },
  { id: 'cometa', look: { skin: '#a8754e', hair: 'coleta', hc: '#141010', acc: 'aviador', shirt: '#39c8ff' }, barrio: 'Puerto Nórdico', vfav: 'Jetpack', frase: '¿Atajo? Mejor por arriba.', bio: 'Inventora y piloto del único jetpack de reparto del mundo. Entrega los pedidos urgentes del Puerto Nórdico volando sobre los tejados. Solo le presta su invento a quien gane suficientes duelos en la ciclovía.', name: 'Capitana Cometa', perk: '', veh: 'jetpack', hab: 'Te regala su Jetpack', desc: 'El vehículo más especial de Orbe.', favor: 'Gana 15 duelos a rivales', key: 'duels', n: 15, price: 60000, col: '#39c8ff' }
];
/* Nombres de trucos por vehículo: [salto, truco 1, truco 2] */
const TRK = {
  foot: ['Salto de gato', 'Mortal', 'Giro 360'], quad: ['Giro 360', 'Mortal', 'Spagat'], inline: ['Giro 360', 'Mortal', 'Spagat'], skate: ['Ollie', 'Kickflip', '360 Flip'],
  long: ['Ollie', 'Shove-it', 'Slide'], scooter: ['Bunny hop', 'Tailwhip', 'Barspin'], uni: ['Salto', 'Giro', 'Salto loco'], bike: ['Bunny hop', 'Tailwhip', 'Superman'],
  trike: ['Salto', 'Caballito', 'Giro'], ebike: ['Bunny hop', 'Tailwhip', 'Superman'], escooter: ['Salto', 'Tailwhip', 'Barspin'], euc: ['Salto', 'Giro', 'Mortal'],
  moped: ['Salto', 'Caballito', '360'], moto: ['Salto', 'Caballito', 'Superman'], auto: ['Salto', 'Giro', 'Tonel'], camion: ['Salto', 'Giro', 'Tonel'], jetpack: ['Despegue', 'Tirabuzón', 'Rizo']
};
/* Evento especial de Orbe según el día de la semana (domingo = 0) */
const EVT = [
  { id: 'dominical', name: 'Edición dominical', desc: 'Todas las entregas valen ×1,5', bill: 10 },
  { id: 'libro', name: 'Feria del Libro de Orbe', desc: 'El doble de páginas perdidas', bill: 10 },
  { id: 'maraton', name: 'Maratón de la Ciclovía', desc: 'Corredores por todas partes y +50 % de XP', bill: 12 },
  { id: 'carnaval', name: 'Carnaval de las Mil Ruedas', desc: 'Monedas ×1,5 y confeti para todos', bill: 11 },
  { id: 'correo', name: 'Jueves de Correo', desc: 'El correo vale el doble', bill: 10 },
  { id: 'cometas', name: 'Festival de Cometas', desc: 'Muchos más paraguas planeadores', bill: 13 },
  { id: 'pulgas', name: 'Mercado de las Pulgas', desc: 'Más regalos en la vía', bill: 10 }
];
const evToday = () => EVT[new Date().getDay()];
/* Rivales: otros repartidores que compiten contigo */
const RIV = [['Rueda Loca', '#ff5a2a'], ['Lu Neón', '#a42cff'], ['Tomás Turbo', '#ffc23a'], ['Sofi Scooter', '#2dffb3'], ['Nico Manubrio', '#39c8ff']];
/* Secciones de las páginas de EMSAY */
const SECT = { h: 'Historia', f: 'Farándula', n: 'Noticias', l: 'Libros', e: 'Eventos', d: 'Editorial' };
/* Orbe: la ciudad donde caben todas las ciudades */
['Centro de Orbe', 'Barrio Sakura', 'Puerto Nórdico', 'La Medina', 'Pequeña Lagos', 'Sabana Dorada', 'Avenida Neón', 'Malecón del Caribe', 'Bosque Nublado', 'Alto Andino', 'Puente del Río Mundo'].forEach((b, i) => { ZRAW[i].sub = b; });
ZRAW[1].scen[0] = hex('#f4a6c0');
