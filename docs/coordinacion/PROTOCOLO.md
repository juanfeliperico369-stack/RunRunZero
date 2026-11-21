# Protocolo de Coordinación Multi-IA sin Mediador · RunRunZero (Run Scooter)

> **Propósito:** Permitir que dos o más IAs trabajen simultáneamente en `juanfeliperico369-stack/RunRunZero` con las mismas instrucciones del autor y **sin un tercer agente mediador**, evitando pisarse, duplicar trabajo o generar conflictos de fusión, y dejando contexto verificable para la **IA principal**.

## 1. Arquitectura de 3 capas (cero conflictos)

### Capa A · Archivos exclusivos por agente (en Git)
Cada IA usa un identificador corto en minúsculas (`antigravity`, `codex`, `claude`, etc.) y **solo edita sus propios archivos**:

| Archivo | Quién escribe | Regla |
|---|---|---|
| `docs/coordinacion/PROTOCOLO.md` | Quien inicializa (solo adiciones consensuadas) | Contrato común |
| `docs/coordinacion/estado-<id>.json` | **Solo `<id>`** | Estado estructurado vivo (fase, rama, módulos reclamados, invariantes, métricas) |
| `docs/coordinacion/buzon/<id>.md` | **Solo `<id>`** | Bitácora *append-only* (mensajes fechados UTC a la IA par y a la IA principal) |

> **Regla de oro:** Ninguna IA edita jamás el `estado-*.json` ni el `buzon/*.md` de otra IA. Así dos ramas concurrentes siempre fusionan sin conflicto en `docs/coordinacion/`.

### Capa B · Aislamiento de ramas y sincronización por fase
1. La rama base activa del código fuente de Run Scooter es `claude/motor-city-engine-xu7p4y` (nota: `main` solo tiene el commit inicial `9881123`).
2. Cada IA trabaja en su rama dedicada: `ia/<id>-runrunzero`. Nunca `git push --force` sobre la rama de otra IA ni sobre `claude/motor-city-engine-xu7p4y`.
3. Antes de iniciar cada fase (**Fase 1**, **Fase 2**, **Fase 3**) y antes de la entrega final, cada IA ejecuta:
   ```bash
   git fetch origin --prune
   git branch -r
   ```
   y lee los `estado-*.json` y `buzon/*.md` de todas las ramas `origin/ia/*` activas (y si dispone de `gh`, revisa el issue `[COORD-IA]` y los PRs abiertos).

### Capa C · Desempate determinista (sin mediador)
Si dos IAs reclaman el mismo archivo o subsistema al mismo tiempo:
1. **Gana el reclamo más antiguo** según el campo `reclamado_utc` (ISO-8601 UTC) del `estado-<id>.json` ya publicado en remoto.
2. En caso de empate exacto al segundo, **desempata el orden lexicográfico** del identificador `<id>`.
3. La IA que llega después puede:
   - tomar subsistemas complementarios libres (p. ej., narrativa/audio/UI vs física/render/adaptador), o
   - hacer `git merge`/`rebase` sobre los commits ya verificados de su par y construir encima.

## 2. Contrato técnico compartido (invariantes que NINGUNA IA debe romper)

1. **Juego autocontenido offline:** `node tools/build.mjs` debe producir `web/index.html` sin dependencias externas ni red en tiempo de juego.
2. **12 anclas de `motorcity/herramientas/importar-run.mjs`:** no renombrar ni alterar literalmente:
   - `engine.js`: `uniform vec2 uBend;uniform vec4 uHill;uniform float uH0;`, la fórmula de lomas `if(uHill.w>0.5){...}`, y `gl.uniform1f(U.uH0, env.h0);`
   - `game.js`: `const HILL = s => {`, `const HILLD = s => HILL(s + 0.5) - HILL(s - 0.5);`, `if (k === 'corner') {`, `const r = g.rng, s = g.genS;\n` en `genSeg`, y `g.turns++; g.score += 50 * g.mult; style(g, 0.25); ev(g, 'turn', { dir, z: B.z, n: B.n });`
   - `render.js`: `E.bend[0] = mode === 'garage' ? ...`, `E.hill[3] = hOn; E.h0 = HILL(P.s); this.sl = hOn ? HILLD(P.s) : 0;`, `this.zoneEnv(g, P.s);\n`, y `rt = mode === 'garage' ? 0 : RAINY(ed) ?`
3. **Compatibilidad de guardado (`runscooter.v1`):** todos los campos nuevos deben tener valor por defecto y migración segura; las 113 páginas originales de `STORY` conservan sus índices `0..112`.
4. **Verificación obligatoria antes de cada `push`:**
   - `node tools/build.mjs` (0 errores de sintaxis)
   - `node tools/sim.mjs 100 240` (0 errores, 0 filas imposibles)
   - Pruebas en Chromium móvil `412×860` (`0` `pageerror`, `0` `console.error`) + inspección visual de capturas reales.
5. **No auditar el juego de prueba de `motorcity`:** de `motorcity` solo se usa y documenta el motor (`js/`, arquitectura, contratos).

## 3. Canal espejo en GitHub Issues (opcional si hay `gh`)
Si el agente tiene acceso a `gh`, publica actualizaciones cortas en el Issue titulado `[COORD-IA] Tablero de coordinación multi-IA · RunRunZero` (una sola entrada por fase). Si un agente solo tiene `git`, todo el protocolo funciona 100 % igual usando únicamente ramas y `docs/coordinacion/`.
