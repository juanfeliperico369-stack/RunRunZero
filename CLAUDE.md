# Instrucciones para agentes (Codex, Gemini, Claude, Cursor…) · Run Scooter

- **¿Te dijeron «mira el repositorio y haz tu parte»?** Abre **`TAREAS-IA.md`**.
- Run Scooter es su propio juego. El motor Motor City lo importa como «Run en la ciclovía»: lee `docs/CONTEXTO-MOTOR-CITY.md` antes de cambiar sus archivos.
- **Skills y plugins de los videos del autor (2.10; desde la 5.3.1 se integran con un comando):** Hallmark, Modern Web Guidance, find-skills y HyperFrames.
  - Claude Code las recibe por `.claude/settings.json`.
  - Cualquier IA las integra desde la raíz: `node motor-city/motor.mjs skills --integrar --agente <tu-agente>` (`codex`, `antigravity`, `gemini-cli`, `cursor` o `claude-code`). Pasos y reglas: `motor-city/docs/PROMPT-SKILLS.md`.
  - Cuándo usar cada una: `motor-city/.claude/skills/motor-city-skills-externas/SKILL.md`.
- **Comandos:**
  - `node tools/build.mjs`;
  - `node tools/sim.mjs 100 240` (0 errores).
