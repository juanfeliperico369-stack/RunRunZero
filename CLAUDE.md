# Instrucciones para agentes (Codex, Gemini, Claude, Cursor…) · Run Scooter

- **¿Te dijeron «mira el repositorio y haz tu parte»?** Abre **`TAREAS-IA.md`**.
- Run Scooter es su propio juego. El motor Motor City lo importa como «Run en la ciclovía»: lee `docs/CONTEXTO-MOTOR-CITY.md` antes de cambiar sus archivos.
- **Skills y plugins de los videos del autor (2.10):** Hallmark, Modern Web Guidance, find-skills y HyperFrames.
  - Claude Code las recibe por `.claude/settings.json`.
  - Las demás IA corren `node ../motorcity/motor.mjs skills --instalar --agente codex` (o `antigravity`).
  - Cuándo usar cada una: `motorcity/.claude/skills/motor-city-skills-externas/SKILL.md`.
- **Comandos:**
  - `node tools/build.mjs`;
  - `node tools/sim.mjs 100 240` (0 errores).
