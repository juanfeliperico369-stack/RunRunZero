# Run Scooter · la ciclovía sin fin

Corredor sin fin en 3D (estilo arcade) por una ciclovía con 9 vehículos: scooter, patines quad (2+2), patines en línea (4 en fila), skate, longboard, bicicleta, triciclo de carga, monopatín eléctrico y monociclo eléctrico.
Estética de la revista **EMSAY** (portada teal y crema, páginas amarilla, gris, roja, marino con naranja y mostaza) y la edición neón de **Doc Element**.
Funciona **sin internet**, en un solo `index.html`, sin librerías externas (motor WebGL propio y audio sintetizado).

**Jugar:** https://juanfeliperico369-stack.github.io/RunRunZero/ · **APK:** https://juanfeliperico369-stack.github.io/RunRunZero/RunScooter.apk

## Cómo se juega
- Desliza **← →** para cambiar de carril, **↑** para saltar y **↓** para agacharte (en el aire: caída rápida).
- En PC: flechas / WASD / espacio; **P** o **Esc** para pausar.
- Esquiva baches, rocas, vallas, ramas bajas (solo agachado), carritos, puestos de revistas, furgones EMSAY (sube por la rampa amarilla) y otros ciclistas.
- Dos golpes leves en menos de 3 s (conos, charcos o roces laterales) te tumban.
- Poderes: imán, turbo (atraviesa todo), ×2 puntos y casco (te salva de un choque).
- Botón **⚡ IMPULSO** (o tecla E/Shift): tócalo seguido para acelerar (hasta +6,5 m/s) y ganar hasta ×1,5 puntos.
- **Subidas y bajadas**: el relieve frena en subida y acelera en bajada (±16 %).
- Fauna silvestre decorativa: mariposas, pájaros, conejos, flores, semillas y luciérnagas de noche.
- **Entregas**: pasa por el carril del borde junto a un buzón o casita y lanzas la revista (la bandera sube, se abre la puerta y el vecino saluda). Las rachas multiplican los puntos.
- 11 ediciones: las 7 páginas de la revista más Malecón (playa), Bosque nublado, Finca cafetera y Puente sobre el río.
- **Reto del día**: la misma ruta para todos cada día; llegar a 1500 m da ✦ 2.
- Si te tambaleas, la **Tinta Gris** te persigue: otro golpe y te atrapa.
- Cada 1000 m cambia la **edición** (paleta y escenario). Las **páginas perdidas** (12) cuentan la historia de Don Ramiro.

## Fórmulas
- Velocidad: `v = (14 + 21·(1 − e^(−s/2600)))·vehículo` m/s, con turbo ×1,4.
- Salto: `vy = √(2·g·1,55·salto)` con g = 42 m/s². Espacio entre filas: `max(11, v·t)` con `t` de 1,22 s a 0,74 s según la dificultad.
- Puntos: metros × multiplicador + 10 por moneda; multiplicador = (1 + 0,25·rango) × (×2) × (bici 1,15).

## Estructura
- `src/` código fuente (motor, datos, lógica, modelos, render, audio, UI, arranque).
- `tools/build.mjs` compila `web/index.html` · `tools/assets.mjs` íconos, `compartir.png`, manifest y service worker.
- `tools/sim.mjs` bot de lógica (N partidas en Node) · `tools/bot.mjs` bot de navegador (UI + partida real + 100 simuladas) · `tools/verify.mjs` verificación del enlace publicado.
- `.github/workflows/publicar.yml` compila el APK (Capacitor), publica la rama `gh-pages` y verifica el enlace.

```bash
node tools/build.mjs && node tools/assets.mjs
node tools/sim.mjs 100 240      # 100 partidas simuladas
node tools/bot.mjs 100 25       # bot de navegador
```
