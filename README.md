# Run Scooter · la ciclovía sin fin

Corredor sin fin en 3D (estilo arcade) por una ciclovía con 9 vehículos: scooter, patines quad (2+2), patines en línea (4 en fila), skate, longboard, bicicleta, triciclo de carga, monopatín eléctrico y monociclo eléctrico.
Estética de la revista **EMSAY** (portada teal y crema, páginas amarilla, gris, roja, marino con naranja y mostaza) y la edición neón de **Doc Element**.
Funciona **sin internet**, en un solo `index.html`, sin librerías externas (motor WebGL propio y audio sintetizado).

**Jugar:** https://juanfeliperico369-stack.github.io/RunRunZero/ · **APK:** https://juanfeliperico369-stack.github.io/RunRunZero/RunScooter.apk

## La historia
EMSAY, la editorial del momento, necesita repartir sus revistas, periódicos, correo y pósters con «las nuevas nuevas» de la semana por **Orbe**, la ciudad donde caben todas las ciudades. Empiezas a pie y escalas vehículos mientras recuperas las 112 páginas perdidas (historia de Don Gustavo, farándula, noticias, libros, eventos y editorial).

## Cómo se juega (v2)
- **4 carriles**: los dos de la izquierda vienen de frente y los dos de la derecha van en tu sentido. Gente, ciclistas, patinadoras, motos y carros circulan en ambos sentidos.
- Desliza **← →** para cambiar de carril, **↑** saltar (en el aire: truco o doble salto) y **↓** agacharte.
- **⚡ IMPULSO** (tecla F/Shift): gasta aliento o batería. **■ FRENO** (tecla X): mantenlo para semáforos, bajadas fuertes, animales que cruzan y para esquivar a la policía.
- **Botones de entrega** (teclas Q/E): aparecen al acercarte a un buzón, casita, muro o kiosco. Si el aro está verde la entrega es PERFECTA.
- **Capacidad física**: crece al correr o usar vehículos de fuerza; define tu aliento y tu impulso máximo. Los choques fuertes causan lesiones.
- **Cruces con semáforo**, **tramos angostos** (2 o 1 carril), **zonas libres** de trucos con barandas y rampas, camiones descargando frente a locales y casetas con clientes solo en las orillas.
- **Policía**: con vehículos eléctricos o de motor, si excedes el límite te persigue: acelera a fondo o frena y cambia de carril. Los perros también persiguen.
- **Rivales** que te pasan y te quitan entregas; **mentores** que enseñan habilidades por un favor o pagando.
- 17 vehículos: a pie, patines quad y en línea, skate, longboard, monopatín, monociclo, bicicleta, triciclo, bici eléctrica, monopatín eléctrico, monociclo eléctrico, scooter eléctrico, moto, auto, camión con cuadrilla y jetpack.
- **Bifurcaciones**: un separador divide la vía en dos rutas; la de entregas va marcada con flechas doradas y la otra tiene impulsores, barandas y rampas.
- **Evento del día** en Orbe (Feria del Libro, Maratón, Carnaval, Jueves de Correo, Festival de Cometas, Mercado de las Pulgas, Edición dominical) con su bonificación.
- **Mejoras por vehículo** (velocidad, impulso y manejo) y trucos con nombre propio para cada vehículo.
- Banda sonora rock y electrónica generada por código.

## Fórmulas
- Velocidad: `v = (14 + 21·(1 − e^(−s/2600)))·vehículo·pendiente + impulso` m/s, con turbo ×1,4. Impulso máximo = vehículo × mejoras × (0,6 + 0,4·físico/100).
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
