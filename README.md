# Run Scooter · la ciclovía sin fin

Corredor sin fin en 3D (estilo arcade) por una ciclovía: scooter, patines quad, skate, bicicleta y monopatín eléctrico.
Estética de la revista **EMSAY** (portada teal y crema, páginas amarilla, gris, roja, marino con naranja y mostaza) y la edición neón de **Doc Element**.
Funciona **sin internet**, en un solo `index.html`, sin librerías externas (motor WebGL propio y audio sintetizado).

**Jugar:** https://juanfeliperico369-stack.github.io/RunRunZero/ · **APK:** https://juanfeliperico369-stack.github.io/RunRunZero/RunScooter.apk

## Cómo se juega
- Desliza **← →** para cambiar de carril, **↑** para saltar y **↓** para agacharte (en el aire: caída rápida).
- En PC: flechas / WASD / espacio; **P** o **Esc** para pausar.
- Esquiva baches, rocas, vallas, ramas bajas (solo agachado), carritos, puestos de revistas, furgones EMSAY (sube por la rampa amarilla) y otros ciclistas.
- Dos golpes leves en menos de 3 s (conos, charcos o roces laterales) te tumban.
- Poderes: imán, turbo (atraviesa todo), ×2 puntos y casco (te salva de un choque).
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
