# Tareas de cada IA · Run Scooter

> **Si te dijeron «mira el repositorio y haz tu parte», empieza aquí.** Run Scooter **sigue siendo su propio juego** y no depende del motor. Lo que debes saber del motor está en `docs/CONTEXTO-MOTOR-CITY.md`.
> Al terminar, informa en 5–10 líneas: qué hiciste, cómo lo probaste, qué aprendiste y qué falta.

**Reparto (nov‑2026, del autor):**
- **Gemini con Antigravity** («hydrogen») hace lo fácil.
- **ChatGPT con Codex** («astra») hace lo fuerte.

## La IA de Run Scooter (Codex «astra» o Claude): lo fuerte
1. **Que nada choque al arrancar.** El banner «HOY: …» y el aviso «IMPULSO…» salen al mismo tiempo sobre el marcador. Ponlos en una cola y muéstralos uno tras otro. Lo vio la auditoría de Gemini.
2. **Más realismo, familiar:**
   - asfalto con desgaste y parches;
   - andenes con baldosa;
   - árboles con volumen (no esferas planas);
   - un poco menos de saturación.

   Es el mismo estilo de Motor City 2.6.
3. **Tutoriales opcionales:** un botón, nunca una ventana que salga sola.
4. **Si cambias** `src/engine.js`, `data.js`, `story.js`, `game.js`, `models.js`, `models2.js`, `render.js` o `audio.js`, avisa: Motor City los importa con parches (`motorcity/herramientas/importar-run.mjs`).
5. **Pruebas:** `node tools/build.mjs`, `node tools/sim.mjs 100 240` (0 errores) y el bot de navegador.

## Gemini con Antigravity («hydrogen»): lo fácil
1. Corre la construcción y las pruebas de arriba, y pega el resultado en un reporte, sin cambiar código.
2. Capturas en 412 × 860 del arranque, una partida y la pausa, con una tabla foto → hallazgo → gravedad.

## ChatGPT (imágenes): el arte
Si el juego necesita arte nuevo, usa las reglas de `motorcity/TAREAS-IA.md` (C‑A1…C‑A7): realista familiar, a escala, sin texto ni marcas y sin sombra horneada.
