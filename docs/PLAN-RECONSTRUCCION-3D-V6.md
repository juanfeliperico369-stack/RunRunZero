# Plan de Reconstrucción 3D v6 · Run Scooter («Escala Real, Skateparks y Game Feel Pulido»)

> **Plan maestro del ecosistema y bases de código ya iniciadas:** [`motorcity/docs/PLAN-RECONSTRUCCION-3D-V6.md`](https://github.com/juanfeliperico369-stack/motorcity/blob/main/docs/PLAN-RECONSTRUCCION-3D-V6.md) y [`motorcity/motor-v6/`](https://github.com/juanfeliperico369-stack/motorcity/tree/main/motor-v6).
> **Auditoría base que origina este plan:** [`docs/AUDITORIA-CRITICA-2026-11-27.md`](./AUDITORIA-CRITICA-2026-11-27.md).

---

## 1. Diagnóstico y oportunidad única de Run Scooter

A diferencia de los otros tres repositorios, **Run Scooter** (`RunRunZero`) ya demostró que una base liviana y enfocada (`~241 KB`, 12 archivos limpios) arranca rápido y tiene el mejor esqueleto técnico del grupo. Sin embargo, la auditoría reveló **5 problemas críticos** que arruinan hoy su diversión y coherencia con el resto del ecosistema:
1. **100 % de las vallas quedan tapadas por su respaldo** (`models.js:121-123` invierte el sentido del panel vs. la cara que mira al jugador).
2. **Montañas de 30 m se mecen como matas por el viento** (`engine.js:119`).
3. **Trampa mortal en trucos y saltos:** pre-saltar antes de aterrizar durante un truco provoca muerte injusta (`game.js:448,606`), y el hielo desliza sin señal auditiva ni visual clara (`game.js:440`).
4. **Sin guardián de sonido (P8):** la música sigue sonando al cambiar de pestaña o salir de la app.
5. **50 MB muertos** de `motor-city/` sin usar, más falta de integración visual/escala con Medellín, sus pendientes reales y sus **5 Skateparks**.

---

## 2. Qué adopta Run Scooter de Motor 3D v6

| Mejora solicitada por el autor | Aplicación concreta en `RunRunZero` v6 |
|---|---|
| **Escala SI real (`1 u = 1 m`)** | Patinador de **1,72 m** sobre patineta eléctrica (**1,12 m** largo, manubrio **1,15 m**) o skate (**0,80 m**) esquivando taxis amarillos (**4,35 × 1,78 × 1,46 m**), motos (**2,05 m**), buses urbanos (**10,8 × 2,50 × 3,10 m**) y bicicletas EnCicla (**1,78 m**) con proporciones exactas de `motor-v6/src/escala.js`. |
| **Texturas reales de Medellín (114 KB)** | Reemplazar superficies planas y vallas rotas por el atlas PBR de Medellín (`asfalto`, `ladrillo_paisa`, `anden_medellin`, `concreto_skatepark`, `fachada_vidrio`, `pasto_valle`) con respaldo procedural. |
| **Topografía real (subidas y bajadas)** | El corredor de Ciclovía deja de ser una cinta plana: incorpora **pendientes reales** (descenso rápido por Las Palmas / Poblado, repechos en Ayacucho, puentes elevados como la 4 Sur) donde la gravedad acelera o frena de verdad. |
| **5 Skateparks + Paradas de Trucos y Parkour** | Nuevo modo **«Parada en Skatepark»** (y transiciones dentro de la carrera) donde al llegar a un **Skatepark Hero** (Puente 4 Sur, Ciudad del Río, Parques del Río, Estadio o Distrito Norte) la pista se abre 30–60 segundos en un bowl/funbox 3D real con **barandas de grind**, **quarter-pipes** y **bóvedas de parkour** heredadas de `motor-v6/src/skatepark.js` y `personaje.js`. |
| **Game Feel justo (sin muertes injustas)** | Integrar del núcleo `motor-v6/src/personaje.js`: *coyote time* (**120 ms**), *jump buffer* (**140 ms**), cancelación limpia de truco al tocar salto (fin de la muerte injusta), alerta visual+sonora en hielo/charcos y *hitstop* de 45 ms en aterrizajes perfectos. |
| **Cámara inteligente suave** | En el modo corredor clásico mantiene seguimiento trasero ágil; al entrar a las plazas/skateparks activa la **cámara cenital única con auto-seguimiento gradual** (`camara.js`) para que girar en cualquier dirección sea natural e intuitivo. |

---

## 3. Hoja de ruta de migración (Fases en `RunRunZero`)

| Fase | Entregable concreto en `RunRunZero` | Criterio verificable |
|---|---|---|
| **Fase 0 (Completada)** | Auditoría forense publicada + Biblia SI + texturas Medellín + módulo funcional de **Skatepark 3D, Grind, Trucos y Parkour** probado en `motorcity/motor-v6/`. | `motor-v6` en verde (`0` errores en Chrome desktop y móvil). |
| **Fase 1 · Cirugía inmediata y limpieza (1 sesión)** | 1) Corregir orientación de vallas (`models.js:121-123`); 2) dejar fijas las montañas y solo mecer follaje (`engine.js:119`); 3) eliminar muerte por pre-salto en truco y añadir aviso de hielo (`game.js`); 4) conectar el **Guardián de Sonido (P8)**; 5) eliminar los **50 MB muertos** de `motor-city/`. | `node tools/sim.mjs 100 240` en verde + captura visual verificando vallas frontales legibles y montañas estáticas + prueba de silencio al ocultar pestaña. |
| **Fase 2 · Escala SI + Texturas PBR Medellín + Relieve** | Aplicar `escala.js` a todos los obstáculos/vehículos, activar las 9 texturas Medellín (114 KB) y sumar curvas de elevación reales (subidas y bajadas) en la Ciclovía. | Comprobación visual de proporción patinador vs. taxi/bus/EnCicla y ≥ 55 FPS en móvil `412 × 860`. |
| **Fase 3 · Zonas Hero y 5 Skateparks Jugables** | Integrar el módulo `skatepark.js` de `motor-v6` para que cada tramo de carrera cruce **Zonas Hero reconocibles** (Puente 4 Sur, Ciudad del Río, Parques del Río, Estadio, Parque Explora) y permita entrar a sus **Skateparks y Paradas de Trucos** con parkour fluido. | Completar combos de Ollie/Kickflip + 50-50 Grind + Bóveda Parkour en el skatepark sin errores, con soporte vertical y horizontal (P10). |
| **Fase 4 · Integración bidireccional con Motor City v6** | Exponer Run Scooter como módulo limpio reutilizable por `motor-v6` (sin copiar 50 MB de ida y vuelta), compartiendo el mismo banco de texturas, vehículos SI y skateparks. | Un solo paquete compartido; `0` archivos duplicados muertos entre repos. |

---

## 4. Reglas de calidad obligatorias para `RunRunZero` v6
- **Mantener la ligereza:** Run Scooter debe seguir pesando `< 1,5 MB` en su núcleo base (sin incrustar mapas gigantes no usados).
- **Audio con guardián P8:** `visibilitychange` + `pagehide` suspenden inmediatamente el `AudioContext`.
- **Cero muertes injustas:** nunca castigar al jugador por presionar salto 100 ms antes de tocar el suelo (*jump buffer* siempre perdona).
