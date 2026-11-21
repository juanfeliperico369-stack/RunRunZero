# Tareas de cada IA · Run Scooter

> **Motor City 4.5 (21‑nov‑2026) · LEE PRIMERO `docs/INFORME-MOTOR-CITY-4.5.md`.** El autor decidió que este juego **sigue con su propio motor**: no se migra a Motor City (si abajo dice «Migrar a `motor-city/`», queda anulado). El motor 4.5 viaja en `motor-city/` como referencia y caja de herramientas; el informe dice qué cambió Claude, qué mejoró, qué falta auditar, qué te toca (manejo y controles, modelos, rostros, árboles con lógica, Guatapé, la forma cenital, efectos para todo público, interfaz) y **cómo usar el motor sin dejar el tuyo**.


> **Motor City 4.0 (20‑nov‑2026): el planeta y *Turno Cero*.**
> - El motor une Manhattan, Medellín y el Valle y Guatapé en un planeta (`MC.Planeta`), con carreteras de la nada entre ellas.
> - Trae la búsqueda 0–5 (`MC.Busqueda`) y lee modelos GLB (`MC.Modelos`).
> - *Turno Cero* es el juego adulto de Motor City y vive aislado en `../motorcity/juegos/getaway/`: **su violencia y su lenguaje no entran a este juego**.
> - Lee `../motorcity/docs/TURNO-CERO.md` y `../motorcity/TAREAS-IA.md` § 4.0.
>
> **✅ Hecho por Claude (21‑nov‑2026), porque Codex ya no sigue:** C‑R40 «Run por la carretera de la nada».
> - El botón nuevo **🛣️ Carretera de la nada** recorre costa, desierto, nevado y bosque de lagos, cada uno con su paleta, su paisaje y sus obstáculos: arena, hielo (resbala: no se cambia de carril un rato) y troncos caídos.
> - Además, el regalo diario ya no abre una ventana que tapa el juego: se entrega solo y se avisa (mundo abierto primero).
> - `node tools/sim.mjs 100 240` corre una de cada cuatro partidas en la carretera, con 0 errores.
>
> **Para Run Scooter (Codex, C‑R40):** «Run por la carretera de la nada». Es una variante del runner sobre los biomas de `MC.Planeta.BIOMAS`: costa, desierto, nieve y bosque, con su paleta y obstáculos por bioma (arena, hielo, troncos). Sale del mismo generador de carreteras del motor.


> **Motor City 3.0 (20‑nov‑2026):** antes de tu encargo, lee **las 10 reglas que dejó el feedback del autor** en `../motorcity/docs/PROXIMO-NUEVA-YORK.md` §3:
> - un solo mundo con varias cámaras;
> - volumen en lo que se levanta;
> - fachadas con detalle;
> - cámara con topes y un mapa para ver todo;
> - tutoriales opcionales;
> - fluidez medida;
> - probar en un celular real con GPU.
>
> Lo que sigue después de los encargos de Gemini y ChatGPT es «Getaway Nueva York».

> **Si te dijeron «mira el repositorio y haz tu parte», empieza aquí.** Run Scooter **sigue siendo su propio juego** y no depende del motor. Lo que debes saber del motor está en `docs/CONTEXTO-MOTOR-CITY.md`.
> Al terminar, informa en 5–10 líneas: qué hiciste, cómo lo probaste, qué aprendiste y qué falta.

**Reparto (nov‑2026, del autor):**
- **Gemini con Antigravity** («hydrogen») hace lo fácil.
- **ChatGPT con Codex** («astra») hace lo fuerte.

**Nuevo (20‑nov‑2026, Motor City 2.10):** las skills y plugins de los videos del autor ya están en `.claude/settings.json`: Hallmark, Modern Web Guidance y HyperFrames. Las demás IA las instalan desde el motor (`node ../motorcity/motor.mjs skills --instalar --agente codex`).
- **Codex:**
  - un **tráiler de 20 s** de Run Scooter con HyperFrames, con capturas reales y sin cifras inventadas;
  - antes de tocar la interfaz, consulta Modern Web Guidance.
- **Gemini:** corre `node tools/sim.mjs 100 240` y anota el resultado.

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
