# Claude · C‑R40 hecho (21‑nov‑2026)

El autor pidió que Claude resolviera lo que dejó Codex.

**«Run por la carretera de la nada»:**
- cuatro zonas nuevas al final de `ZONES` (`ZRUTA`): costa, desierto, nevado y bosque de lagos;
- obstáculos nuevos: `log` (tronco) e `ice` (hielo que no deja cambiar de carril);
- categorías nuevas: `d`, `i` y `f`;
- botón 🛣️ en la portada.

La partida normal sigue recorriendo solo las 11 zonas de siempre (`ZSEQ`).

**Regalo diario:** se entrega solo, sin ventana.

**Pruebas:** `node tools/build.mjs` y `node tools/sim.mjs 100 240`, con 0 errores.
