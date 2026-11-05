/* ===== DATOS · vehículos, ediciones (zonas), historia, misiones, rangos ===== */
const VEH = [
  { id: 'scooter', name: 'Scooter', price: 0, spd: 1.0, jmp: 1.0, hnd: 1.0, perk: 'Equilibrio: el tambaleo dura 2,2 s (no 3 s)', desc: 'El clásico de empuje del repartidor. Estable y noble.' },
  { id: 'quad', name: 'Patines quad', price: 1500, spd: 0.97, jmp: 1.0, hnd: 1.32, perk: 'Doble salto en el aire', desc: 'Cuatro ruedas por pie: el más ágil entre carriles.' },
  { id: 'skate', name: 'Skate', price: 3000, spd: 0.99, jmp: 1.17, hnd: 1.06, perk: 'Ollie alto y trucos ×2', desc: 'Tabla, lija y actitud. Cada salto es un truco.' },
  { id: 'bike', name: 'Bicicleta', price: 5000, spd: 1.08, jmp: 0.93, hnd: 0.94, perk: '+15 % de puntos', desc: 'La reina de la ciclovía, con canasta de revistas.' },
  { id: 'escooter', name: 'Monopatín eléctrico', price: 8000, spd: 1.04, jmp: 0.96, hnd: 1.0, perk: 'Poderes +35 % de duración', desc: 'Batería llena: imán, turbo y x2 duran más.' }
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
    { id: 'r4', name: 'Sesión final', a: '#c49a2c', b: '#4a2e12', p: 1200 }, { id: 'r5', name: 'Doc Element', a: '#1a0636', b: '#39c8ff', st: 4, e: 1 }
  ],
  pintura: [
    { id: 'p0', name: 'Teal', c: '#0e6378', p: 0 }, { id: 'p1', name: 'Crema', c: '#e8e4c4', p: 400 },
    { id: 'p2', name: 'Rojo', c: '#c0191c', p: 800 }, { id: 'p3', name: 'Naranja', c: '#ff5a2a', p: 1200 },
    { id: 'p4', name: 'Mostaza', c: '#c49a2c', p: 1600 }, { id: 'p5', name: 'Neón azul', c: '#39c8ff', st: 6, e: 1 }
  ],
  estela: [
    { id: 't0', name: 'Ninguna', p: 0 }, { id: 't1', name: 'Polvo', p: 600 }, { id: 't2', name: 'Confeti EMSAY', p: 1500 },
    { id: 't3', name: 'Línea neón', st: 8 }, { id: 't4', name: 'Estrellas ✦', st: 12 }
  ]
};
const COSI = {}; for (const k in COS) for (const c of COS[k]) COSI[c.id] = Object.assign({ cat: k }, c);

const UPG = [
  { id: 'magnet', name: 'Imán', base: 8, per: 2, icon: '∩' },
  { id: 'turbo', name: 'Turbo', base: 4.5, per: 1, icon: '⚡' },
  { id: 'x2', name: 'Puntos x2', base: 10, per: 3, icon: '×2' },
  { id: 'gift', name: 'Suerte en regalos', base: 0, per: 0, icon: '◆' }
];
const UPC = [400, 900, 1800, 3500, 6000];

/* Ediciones: cada 1000 m cambia la "página" de la revista EMSAY */
const Z = (o) => {
  const r = {}; for (const k in o) r[k] = Array.isArray(o[k]) && typeof o[k][0] === 'string' ? o[k].map(hex) : (typeof o[k] === 'string' && o[k][0] === '#' ? hex(o[k]) : o[k]); return r;
};
const ZONES = [
  Z({ name: 'PORTADA', sub: 'Disponible cada domingo', bill: 0, top: '#5fb3c9', hor: '#e8e4c4', sunC: '#fff7d6', sun: [0.32, 0.78, 0.05], stars: 0, amb: 0.82, sunI: 0.42, emit: 0.18, fog: [70, 185],
    road: ['#0e6378', '#d9d2b0', '#6f9e5a', '#e8e4c4', '#e8e4c4'], scen: ['#3f8a4f', '#5b4636', '#0e6378', '#e8e4c4', '#ffd36b'], ui: '#0e6378' }),
  Z({ name: 'SESIÓN 1 · ESCUCHAR & OÍR', sub: '¿Estamos realmente conectados?', bill: 2, top: '#ffd77a', hor: '#fbe7a9', sunC: '#fffbe8', sun: [-0.3, 0.72, 0.06], stars: 0, amb: 0.85, sunI: 0.4, emit: 0.18, fog: [70, 185],
    road: ['#c94f3d', '#fff0c2', '#9cbf4a', '#fff6d5', '#3a2a1a'], scen: ['#6fae3e', '#6b4a2b', '#f4c95d', '#e7a33e', '#ffe9a8'], ui: '#b8281f' }),
  Z({ name: 'SESIÓN 2 · ORALIDAD', sub: '7 componentes & técnicas', bill: 3, top: '#c9ccd2', hor: '#9a9ea6', sunC: '#ffffff', sun: [0.2, 0.86, 0.04], stars: 0, amb: 0.8, sunI: 0.35, emit: 0.22, fog: [60, 175],
    road: ['#3a3d44', '#b9bcc2', '#7f8d6c', '#ffffff', '#111111'], scen: ['#5f7a55', '#2b2d33', '#5c6068', '#7c8088', '#fff3c4'], ui: '#2b2d33' }),
  Z({ name: 'SESIÓN 3 · DESENTRAÑAR', sub: 'Niveles de lectura', bill: 4, top: '#ff7a52', hor: '#c0191c', sunC: '#ffe2c2', sun: [0, 0.6, 0.11], stars: 0, amb: 0.75, sunI: 0.45, emit: 0.35, fog: [55, 170],
    road: ['#1a1a1a', '#e8e0d8', '#5a1d17', '#f2f2f2', '#f2f2f2'], scen: ['#2d2d2d', '#111111', '#8e1013', '#e8e0d8', '#ffd0a0'], ui: '#c0191c' }),
  Z({ name: 'TIPOLOGÍAS TEXTUALES', sub: 'Los tipos de texto en la ciudad', bill: 5, top: '#0c2533', hor: '#1b4459', sunC: '#ffe7c7', sun: [0.36, 0.8, 0.035], stars: 0.9, amb: 0.62, sunI: 0.3, emit: 0.8, fog: [55, 170],
    road: ['#0f2a38', '#24506a', '#163847', '#ff5a2a', '#ff5a2a'], scen: ['#2f7d6d', '#0b1d27', '#ff5a2a', '#e8c25a', '#ffd27a'], ui: '#ff5a2a' }),
  Z({ name: 'SESIÓN FINAL · LA RUTA', sub: 'En el discurso y la oratoria', bill: 6, top: '#f6cf6a', hor: '#c49a2c', sunC: '#fff3c8', sun: [-0.15, 0.62, 0.09], stars: 0, amb: 0.82, sunI: 0.42, emit: 0.3, fog: [65, 180],
    road: ['#5a3a1a', '#f5e6c0', '#8a7a2c', '#ffffff', '#ffffff'], scen: ['#8c6d1f', '#3b2410', '#6b3f16', '#f5e6c0', '#fff0b0'], ui: '#6b3f16' }),
  Z({ name: 'EDICIÓN NEÓN · DOC ELEMENT', sub: 'Negro total, bordes morados, letra azul', bill: 7, top: '#000000', hor: '#0b0418', sunC: '#a42cff', sun: [0, 0.7, 0.07], stars: 1, amb: 0.5, sunI: 0.22, emit: 1, fog: [50, 165],
    road: ['#0b0418', '#4d1785', '#05010b', '#39c8ff', '#a42cff'], scen: ['#2dffb3', '#1a0636', '#0b0418', '#1a0636', '#ff2fb3'], ui: '#a42cff' })
];

/* Historia · Las páginas perdidas de EMSAY (12 recortes) */
const STORY = [
  ['La rotativa en blanco', 'Domingo, 6:00 a.m. La rotativa de EMSAY se detuvo sola. Cuando volvió a arrancar, la edición de esta semana salió en blanco. Solo quedó una nota: «Las palabras se fueron a rodar».'],
  ['Huellas de llanta', 'La primera página estaba pegada a un poste de la ciclovía. Tenía huellas de llanta y olía a pan recién horneado. Alguien la llevaba con mucha prisa.'],
  ['Oír y escuchar', 'En el margen alguien escribió: «Oír es sentir el viento. Escuchar es saber hacia dónde sopla». Es la letra de Don Ramiro, el viejo editor.'],
  ['El editor perdido', 'Don Ramiro desapareció hace diez años, el día que inauguraron la ciclovía. Salió en bicicleta a entregar la última edición y nunca volvió a la redacción.'],
  ['La rueda con un ojo', 'Cada página trae el mismo dibujo: una rueda con un ojo, igual al ojo rojo de la Sesión 3. ¿Una firma? ¿Una advertencia? Hay que leer entre líneas.'],
  ['No es una carrera', 'Los otros ciclistas no son rivales: también buscan páginas. Una patinadora me gritó al pasar: «¡Esto no es una carrera, es una conversación!».'],
  ['El mapa', 'Página siete: un mapa. La ciclovía no termina nunca; rodea la ciudad y se cruza consigo misma en un punto que nadie ha visto: el Kilómetro Cero.'],
  ['Tiza negra', 'Los baches no son casuales. Alguien los dibuja de noche con tiza negra para que los repartidores frenen. ¿Quién no quiere que la revista llegue?'],
  ['La Tinta Gris', 'La encontré: la Tinta Gris, una mancha que se come las palabras que nadie lee. Crece cada vez que la gente deja de escucharse.'],
  ['Un metro por lector', 'La única forma de vencerla es entregar cada página a tiempo. Cada vez que alguien lee, la Tinta Gris retrocede un metro.'],
  ['Kilómetro Cero', 'En el Kilómetro Cero había una bicicleta antigua y una nota de Don Ramiro: «La revista nunca fue mía. Es de quien la reparte. Sigue rodando».'],
  ['Sin fin', 'Ahora entiendo por qué la ciclovía es infinita: mientras alguien ruede con una historia que contar, EMSAY saldrá cada domingo. Fin de la temporada 1… ¿o no?']
];

/* Misiones (3 activas) — run:1 = dentro de una sola partida */
const MIS = [
  { k: 'coins', t: 'Recoge {n} monedas en una partida', n: [50, 120, 250, 400, 650], run: 1 },
  { k: 'dist', t: 'Recorre {n} m en una partida', n: [500, 1000, 2000, 3500, 5500], run: 1 },
  { k: 'jumps', t: 'Salta {n} veces', n: [15, 35, 70, 120, 200] },
  { k: 'ducks', t: 'Agáchate bajo {n} ramas', n: [4, 10, 20, 35, 60] },
  { k: 'gifts', t: 'Abre {n} regalos', n: [1, 3, 6, 10, 16] },
  { k: 'powers', t: 'Usa {n} poderes', n: [2, 5, 10, 16, 25] },
  { k: 'tricks', t: 'Haz {n} trucos en el aire', n: [5, 12, 25, 45, 70] },
  { k: 'score', t: 'Haz {n} puntos en una partida', n: [1500, 4000, 9000, 18000, 35000], run: 1 },
  { k: 'clean', t: 'Recorre {n} m sin tambalearte', n: [300, 700, 1200, 2000, 3000], run: 1 },
  { k: 'trucks', t: 'Sube a {n} furgones EMSAY', n: [2, 5, 10, 18, 30] },
  { k: 'zone', t: 'Llega a la edición {n}', n: [2, 3, 4, 6, 8], run: 1 }
];

const RANKS = ['Novato', 'Aprendiz', 'Ciclista', 'Rodador', 'Acróbata', 'Veloz', 'Experto', 'Maestro', 'Élite', 'Leyenda'];
const RANKXP = [0, 400, 1200, 2800, 5500, 9500, 15000, 23000, 34000, 50000];
const rankOf = xp => { let i = 0; while (i < RANKXP.length - 1 && xp >= RANKXP[i + 1]) i++; return i; };

/* Ranking de la ciudad (rivales ficticios) */
const CITY = [
  ['Don Ramiro', 250000], ['La Patinadora', 120000], ['Tinta Gris', 90000], ['Rueda Loca', 65000], ['Mango Biche', 48000],
  ['Doña Ciclo', 36000], ['El Ollie', 27000], ['Kiko Quad', 20000], ['Paz Pedal', 15000], ['Lu Neón', 11000],
  ['Tomás Turbo', 8200], ['Bache Bravo', 6000], ['Sofi Scooter', 4500], ['Nico Manubrio', 3200], ['La Canasta', 2300],
  ['Pepe Piñón', 1600], ['Rita Rampa', 1100], ['Juancho Cono', 700], ['Bici Bebé', 400], ['El Domingo', 200]
];

const TIPS = [
  'Desliza ↓ en el aire para caer rápido y agacharte al tocar el suelo.',
  'Dos golpes leves en 3 segundos te tumban: conos, charcos y roces cuentan.',
  'Las filas de monedas suelen marcar el carril seguro.',
  'Sube por la rampa amarilla al techo de los furgones EMSAY: arriba hay monedas.',
  'Las ramas bajas solo se esquivan agachándose (↓).',
  'El casco te salva de un choque fuerte. El turbo atraviesa todo.',
  'Cada 1000 m cambia la edición: la revista pasa de página.',
  'Las páginas perdidas cuentan la historia de Don Ramiro.',
  'Sube de rango para ganar multiplicador de puntos permanente.'
];
