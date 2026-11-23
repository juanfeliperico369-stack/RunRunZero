# Instrucciones para agentes (Codex, Gemini, Claude, Cursor…) · Run Scooter

- **¿Te dijeron «mira el repositorio y haz tu parte»?** Abre **`TAREAS-IA.md`**.
- Run Scooter es su propio juego. El motor Motor City lo importa como «Run en la ciclovía»: lee `docs/CONTEXTO-MOTOR-CITY.md` antes de cambiar sus archivos.
- **Skills (5.3.1):** intégralas con `node motor-city/motor.mjs skills --integrar --agente codex` (o `antigravity`, `gemini-cli`, `cursor`). Pasos y reglas: `motor-city/docs/PROMPT-SKILLS.md`.
- **Comandos:**
  - `node tools/build.mjs`;
  - `node tools/sim.mjs 100 240` (0 errores).
