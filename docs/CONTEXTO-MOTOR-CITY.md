# Run Scooter y Motor City · qué pasó y qué sigue

**19‑nov‑2026 · lo hizo Claude (la IA del motor Motor City, Claude Code), a pedido del autor.** Esta nota es para la IA de Run Scooter.

## Qué cambió en este repositorio
**Nada del juego.** Solo se agregó esta nota. Run Scooter **sigue siendo su propio juego y no depende del motor.**

## Cómo usa el motor a Run Scooter
- El motor Motor City (`juanfeliperico369-stack/motorcity`) tiene el modo **«Run en la ciclovía»**. Si el jugador va por una ciclorruta real de Medellín y toca «Run», todo cambia al estilo Run Scooter.
- Para eso, `motorcity/herramientas/importar-run.mjs` **copia casi idénticos** `src/engine.js`, `data.js`, `story.js`, `game.js`, `models.js`, `models2.js`, `render.js` y `audio.js` (commit `5b2f85d`, v2.5.0) a `motorcity/run/run-scooter.js`.
- Lo hace con **12 parches con nombre**, cada uno comprobado:
  - el relieve real en el sombreador (`uHR[64]`);
  - las curvas reales (`uBend`);
  - esquinas en los cruces reales;
  - el cielo y la lluvia del mundo.
- **No se copian** tu `ui.js`, tu `main.js` ni tu guardado.

**Si cambias esos archivos:**
- No pasa nada aquí.
- En `motorcity`, `node motor.mjs run` vuelve a importar. Si un parche ya no calza, el importador lo dice y no escribe nada; la IA del motor lo ajusta.
- Para ayudar, **evita renombrar** `HILL`, `HILLD`, `genSeg`, `turnAt`, `zoneEnv`, el texto del sombreador de lomas, `E.bend[0]` y `R.begin`. Si los cambias, avisa en tu bitácora.

## Lo que pide el plan para ti (opcional)
- **Huevos de pascua de los otros juegos** en Orbe:
  - Rosalba y el primer tren, su nieta y don Efraín;
  - Cata y el boleto de Rosalba;
  - las estaciones EnCicla y la canasta verde;
  - la aguja del Coltejer y el Orquideorama;
  - los tres timbrazos bajo una estación del Metro;
  - el tinto sin regar («Ni una gota»).
- **A cambio,** tus páginas perdidas de EMSAY pueden esconderse en EnCicla y en El Metro. El motor ya trae el enganche: `MC.huevos.poner(...)`.
- **Un nivel «Valle»:** el motor puede exportar una ciclorruta real (curvas y lomas) para que la corras en tu juego. Pídelo en `motorcity`.
