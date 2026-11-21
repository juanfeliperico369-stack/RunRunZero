# Informe de Motor City 4.5 para Run Scooter

> **Para la IA que siga con Run Scooter (Codex, Gemini, Claude o cualquier otra).** Lo escribió Claude el 21‑nov‑2026 por pedido del autor: «compártele a cada repositorio un documento detallado con lo que has cambiado, lo que has mejorado, lo que queda por auditar y lo que falta que ellos hagan; solo compárteles el motor y especifica cómo usarlo para terminar de desarrollar y mejorar su propio videojuego».
>
> Después de este informe: `TAREAS-IA.md`, `README.md`, `docs/CONTEXTO-MOTOR-CITY.md` y, si vas a usar el motor, `motor-city/docs/DOCUMENTO-UNICO.md`.

## 1. La decisión del autor (lo que cambia para ti)
- **Run Scooter sigue con su propio motor** (WebGL propio en `src/engine.js`, `src/render.js`). Motor City lo **importa** como «Run en la ciclovía» (`motor-city/run/run-scooter.js`, con `node motor-city/herramientas/importar-run.mjs --run .`), pero tu juego no depende del motor.
- **Motor City 4.5.0 está ahora en `motor-city/`** (antes no lo tenías aquí) como referencia y caja de herramientas (§ 6). La página (`web/`) no lo incluye: no pesa en el juego.
- **Todo público.** Nada de *Turno Cero* entra aquí.

## 2. Lo que Claude cambió en este repositorio (rama `claude/motor-city-engine-xu7p4y`, publicada en `main` el 21‑nov‑2026; el flujo `publicar.yml` hace la APK y la página)
| Qué | Dónde | Notas |
|---|---|---|
| **C‑R40 «Run por la carretera de la nada»:** cuatro zonas nuevas (COSTA, DESIERTO, NEVADO y BOSQUE DE LAGOS) con arena, hielo que resbala (no deja cambiar de carril) y troncos; botón 🛣️ en la portada | `src/data.js` (`ZRAW`, `ZSEQ`, `ZRUTA`), `src/game.js`, `src/models.js` (`log()`, `ice()`), `src/render.js`, `src/main.js`, `src/index.html` | El simulador corre una de cada 4 partidas por la ruta (`tools/sim.mjs`). |
| **Regalo diario sin ventana** que tape el juego: se cobra solo y avisa | `src/main.js` | Regla del autor: mundo abierto primero, nada obligatorio. |
| **Tutorial opcional:** ya no se impone en la primera partida; se pide en Ajustes → Tutorial | `src/main.js`, `src/ui.js` | |
| Protocolo entre IAs y notas de relevo | `coord/` | |
| **Motor City 4.5.0** en `motor-city/` | `motor-city/` | Nuevo aquí. |

## 3. Lo que mejoró para quien juega
- Una ruta nueva y distinta (carretera de la nada) con superficies que se sienten distinto.
- Se entra a jugar sin ventanas que tapen.

## 4. Lo que queda por auditar (y cómo)
| # | Qué | Cómo |
|---|---|---|
| A1 | En un celular real: fluidez de las zonas nuevas (sobre todo el nevado y el bosque de lagos) | La telemetría del juego y el bot del navegador. |
| A2 | Que el hielo no sea injusto (que se vea antes de pisarlo y que dure poco) | Jugar 10 partidas por la ruta. |
| A3 | La página publicada: carga, modo sin conexión e instalación | `node tools/verify.mjs https://juanfeliperico369-stack.github.io/RunRunZero/` (lo corre el flujo). |
| A4 | Que el regalo diario se cobre una sola vez por día con el reloj del celular cambiado | Cambiar la fecha del teléfono. |

## 5. Lo que les toca hacer (en orden de valor)
1. **El control (lo más importante):** el cambio de carril, el salto y el freno deben responder al primer toque, sin quedarse «pegados» contra un obstáculo. Del motor 4.5: «coyote time» y memoria del botón de salto (`motor-city/js/32-fisica.js`), y la idea de deslizar en vez de frenar en seco al rozar (`_mover`). Que un roce lateral empuje al carril libre en vez de terminar la partida.
2. **Modelos 3D:** los 9 vehículos, el personaje y los obstáculos. El generador `motor-city/juegos/getaway/arte3d/generar_modelos.py` (Python sin dependencias) muestra cómo dar silueta, AO horneada y malla indexada.
3. **Rostros detallados** de los mentores y los personajes (`MC.Rostro`, manera B).
4. **Guatapé:** una zona del corredor por el malecón y la subida a la Piedra (los datos reales están en `motor-city/datos/guatape/mundo.mc4`; para Run basta con su paleta y su perfil de alturas).
5. **Efectos para todo público:** derrape con marca y polvo, chispas al rozar una baranda, conos que salen volando (`MC.Efectos`, `MC.Rotos`), sin explosiones.
6. **Interfaz y espaciados:** rejilla de 8 px y área segura en la portada y el HUD.
7. Seguir publicando con `publicar.yml` (APK + página) y verificar con `tools/verify.mjs`.
## 6. Cómo usar Motor City sin dejar tu motor
El autor decidió que **cada juego sigue con su propio motor** (el Motor del Valle en EnCicla y El Metro; el motor WebGL propio en Run Scooter). Motor City viaja en `motor-city/` como **referencia y caja de herramientas**: no se compila dentro del juego a menos que tú lo decidas.

### 6.1 Tres maneras, de la más liviana a la más completa
| Manera | Qué haces | Peso que suma | Cuándo conviene |
|---|---|---|---|
| **A. Leer y portar** | Lees la función en `motor-city/js/NN-*.js` y escribes la tuya en un archivo **aditivo** de tu juego (rango libre de tu `src/js`). | 0 | Lo pequeño: el choque que desliza, el desatascador, la asistencia de manejo, las reglas de los árboles. |
| **B. Un módulo suelto** | Copias un archivo del motor que no depende de nada (o de muy poco) y lo llamas con tu propia proyección. | 10–30 KB | `MC.Rostro` (`js/71-rostros.js`), `MC.Efectos` (`js/88-efectos.js`), `MC.Colormap` (`js/47-colormap.js`), `MC.Semilla` y `MC.DDA` (`js/47-clasicos.js`). |
| **C. El motor entero como librería** | Metes `motor-city/dist/motor.js` en tu HTML **antes** de tu código. Todo queda bajo el objeto global `MC`, que no choca con tus nombres. | ≈ 1 MB (≈ 250 KB comprimido) | Un modo nuevo que use mundos MC4 (por ejemplo **Guatapé**: `motor-city/datos/guatape/mundo.mc4`, 0,4 MB), `MC.Planeta`, `MC.Vistas`, `MC.Trafico`. |

### 6.2 Ejemplos
**Retratos (manera B):** copia `motor-city/js/71-rostros.js` y lo que usa (`hex3`, `css3`, `mez3`, `mulberry32`, `TAU`, de `motor-city/js/00-nucleo.js`), o usa la manera C. Luego:
```js
const R = { piel: '#c68a5e', pelo: '#16110d', ojos: '#3b2414', peinado: 'cola', fem: true, edad: .2, ropa: '#2b343d', acc: ['gafas'] };
img.src = MC.Rostro.url(R, 128, { expresion: 'sonrisa' });          /* o MC.Rostro.dibujar(ctx, R, x, y, tam) */
const cualquiera = MC.Rostro.azar(semilla);                         /* una persona de la calle */
```
**Efectos (manera B o C):** solo necesitan una función que pase del mundo a la pantalla.
```js
MC.Efectos.chispas(x, y, 14, rumbo); MC.Efectos.humo(x, y, 3); MC.Efectos.marca(x1, y1, x2, y2);
/* en tu dibujo, al final de cada cuadro: */
MC.Efectos.dibujar(ctx, (x, y, z) => [pantallaX(x, y), pantallaY(x, y) - z * escala], { t: tiempoEnSegundos });
```
**El motor entero (manera C) en tu compilación:** en tu script de compilación, antes de tu código:
```js
const motorCity = fs.readFileSync('motor-city/dist/motor.js', 'utf8');   /* node motor-city/motor.mjs construir lo rehace */
html = html.replace('/*TU_CODIGO*/', () => motorCity + '\n' + tuCodigo);
```
y para un mundo MC4 sin internet: guarda el archivo en base64 dentro de un `<script type="text/plain" id="mc4-guatape">` y ábrelo con `await MC.Mundo.cargar(texto)`.

### 6.3 Lo nuevo del motor 4.5 que más te sirve
| Qué | Archivo | Para qué en tu juego |
|---|---|---|
| Choque que desliza, desatascar, asistencia, derrape | `js/32-fisica.js` (`_mover`, `_despues`, `_asistencia`, `_desatascar`) y `js/36-taller.js` | Que el vehículo no se trabe en las paredes ni se quede pegado; que no se estrelle por un dedo nervioso. Documento: `motor-city/docs/INVESTIGACION-MANEJO.md`. |
| Qué pisa cada vehículo | `js/31-vehiculos.js` (`VEH_SUELO_*`) | Andén, ladrillo, pasto, arena, nieve y roca suelta, despacio; la moto por escalas. |
| Cosas que se rompen | `js/32-rotos.js` | Conos, canecas, vallas y bancas que se tumban según la velocidad y la masa. |
| Efectos | `js/88-efectos.js` | Chispas, humo, marcas de llanta, pedazos y restos. (La explosión es para juegos 18+.) |
| Rostros | `js/71-rostros.js` | Retratos en diálogos, tarjetas y perfiles. |
| Árboles con lógica | `js/29-arboleda.js` (`sembrable`, `despejada`) | Nada de árboles en canchas, piscinas o en la mitad de una plaza dura. |
| PVS horneado | `herramientas/pvs.mjs`, `js/45-pvs.js` | Si tu 3D dibuja una ciudad densa: no dibujar lo que tapan los edificios. |
| Sin conexión | `sw.js` y `pruebas/sin-conexion.mjs` | Abrir sin internet lo que ya se abrió, consultando solo un archivo de versión. |
| Modelos 3D con cara y AO | `juegos/getaway/arte3d/generar_modelos.py` | Un generador de GLB en Python sin dependencias para tus propios modelos. |

### 6.4 Comandos del motor (desde tu repositorio)
```bash
node motor-city/motor.mjs construir          # rehace dist/motor.js y los juegos del motor
node motor-city/motor.mjs prueba             # 144 pruebas de Node del motor
node motor-city/motor.mjs documento          # todo el contexto del motor en un archivo
node motor-city/motor.mjs skills --instalar --agente codex   # (o antigravity, gemini-cli) las skills externas
```
Para traer una versión nueva del motor, desde el repositorio `motorcity`: `node motor.mjs sincronizar ../<tu repositorio>`.

## 7. Reglas que no cambian
- Un solo HTML, sin internet ni librerías en el juego; celulares modestos (Android 7 con WebView 119, iPhone 8/X con iOS 16).
- Español de Colombia; **todo público** (sin armas, sangre ni explosiones de violencia: un choque suave, chispas y humo sí).
- **No romper el guardado** (la clave de guardado de tu juego no cambia sin migración).
- Las pruebas de tu repositorio en verde antes de subir. Nunca subir llaves.
- **El mapa es tuyo:** las calles, el relieve y los edificios de tu juego los decide y los mejora tu IA. Motor City no los cambia.
- Coordinación: tu ficha en `coord/agentes/<tu-id>.json` (o `.ai-coord/`) y un mensaje nuevo en el buzón por cada entrega.

## 8. Comandos de este repositorio
```bash
node tools/build.mjs          # web/index.html
node tools/sim.mjs 100 240    # 100 partidas simuladas: 0 errores
node tools/verify.mjs <url>   # verifica la página publicada
```
Si cambias el juego, avisa al motor: desde `motorcity`, `node herramientas/importar-run.mjs --run ../RunRunZero`.
