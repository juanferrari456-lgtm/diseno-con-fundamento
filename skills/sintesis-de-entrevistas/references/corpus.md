# El corpus y su motor

Todo el ahorro de esta skill está en una decisión: **la ficha es la fuente y el
resto se deriva**. El acumulado no se escribe, se genera. Por eso nunca hace
falta leerlo ni reescribirlo para agregar una entrevista.

## Archivos del proyecto

```
proyecto/
  fichas/            una ficha .md por entrevista, lo único escrito a mano
  corpus.json        índice estructurado, lo genera el script
  NOTAS.md           análisis cualitativo transversal, escrito a mano
  ACUMULADO.md       generado por build, no editar
```

`corpus.json` no se edita a mano salvo emergencia. Si hay que tocarlo, después
correr `build` para que el acumulado quede consistente.

## Comandos

```bash
node corpus.js init <origen>         # trae corpus.json, NOTAS.md y fichas (ej. /mnt/project)
node corpus.js limpiar <transcr>     # compacta la transcripción (~30% menos), --out destino
node corpus.js add <ficha.md>        # parsea e incorpora, imprime hasta 25 candidatos (--max N)
node corpus.js map E13-D1=DC10 ...   # mapea a un consolidado existente
node corpus.js map "E13-D8=+Texto"   # el + crea un consolidado nuevo con ese texto
node corpus.js build                 # regenera ACUMULADO.md (NOTAS.md va como sección propia)
node corpus.js check <ficha.md>      # revisa la forma de la ficha
node corpus.js query [opciones]      # --top | --dc | --perfil | --buscar "a b" --max | --vacios | --datos | --sin-mapear
node corpus.js migrar <viejo.md>     # importa un acumulado escrito a mano
```

## Persistencia

El contenedor se borra entre conversaciones. `corpus.json` es lo único que guarda
el mapeo de dolores a consolidados: si no se sube de vuelta al Project después de
cada entrevista, la siguiente arranca sin recurrencia. Las fichas y
`ACUMULADO.md` también van al Project. La transcripción no.

## Contradicciones

Las líneas `[CONTRADICCIÓN]` de la sección 10 se cargan solas en
`contradicciones` con los códigos que mencionen, y `add` las reemplaza si se
reprocesa la ficha.


Todos aceptan `--dir <carpeta>` si el corpus no está en el directorio actual.

## add es idempotente

Reprocesar una ficha reemplaza todo lo de ese código de entrevistado: no
duplica filas ni menciones. Si corregís la ficha, corré `add` otra vez y listo.
Los mapeos de dolores que ya habías hecho para esa ficha se conservan si los
identificadores (`D1`, `D2`) no cambiaron.

Esta es la diferencia práctica con el acumulado escrito a mano, donde volver a
pasar una entrevista dejaba filas repetidas y recurrencias infladas.

## El mapeo de dolores

Es lo único que no se automatiza, porque decidir si dos dolores son el mismo es
criterio, no texto. `add` imprime los dolores nuevos y los consolidados
candidatos: los que ya tienen dos o más menciones, más los de una sola mención
que comparten vocabulario con los dolores nuevos. El catálogo completo se ve con
`query --top 200`.

Reglas:

- Mismo consolidado si comparten **causa**, no síntoma ni etapa.
- Ante duda, consolidado nuevo. Fusionar de más borra recurrencia real y no se
  puede deshacer sin releer las fichas.
- Un dolor que aparece en una sola entrevista no es menos importante: queda en
  "dolores de un solo perfil", que es donde suelen estar los hallazgos más
  específicos.

Si quedan dolores sin mapear, `build` avisa y los deja afuera del acumulado.
`query --sin-mapear` los lista.

## Migrar un acumulado que ya existe

```bash
node corpus.js migrar ACUMULADO-viejo.md
```

Levanta la tabla de perfiles (deduplicando), los dolores consolidados con sus
menciones y las contradicciones. Los dolores de entrevistas que todavía no
tienen ficha entran marcados como migrados, sin cita: sirven para que la
recurrencia funcione desde el primer día, y cuando se procese la ficha real de
ese código, `add` los reemplaza por los dolores anclados.

Lo que no se migra solo son las secciones narrativas: insights, notas de
cobertura, flujo consolidado. Se copian a `NOTAS.md`, que el build inserta tal
cual arriba de las tablas.

## Cuando algo no parsea

El parser busca las diez secciones por número (`## 03. Dolores`) y lee las
tablas markdown que haya adentro. Si `check` dice que una sección está vacía
cuando no lo está, casi siempre es una de estas tres:

- el encabezado cambió de número o de formato;
- la tabla no tiene la fila de separación `|---|---|`;
- hay un `|` sin escapar dentro de una celda, que parte la fila.

El contexto y el flujo as-is (secciones 01 y 02) no se parsean a propósito: son
narrativos y su lugar es la ficha. Para el blueprint se leen de la ficha del
perfil que corresponda, no del acumulado.

## Qué cuesta cada cosa

Medido sobre E15 (sesión de 30 min, corpus de 15 entrevistas). Tokens aproximados.

| Operación | v2 | v3 |
|---|---|---|
| SKILL.md + referencias leídas | 6,7k (4 archivos) | 3,1k (2 archivos) |
| Transcripción | 9,3k | 6,6k limpia |
| Orientación (acumulado, top, memoria de cuenta) | 6,8k | 0,3k con init |
| Ficha escrita | 3,6k | 3,6k |
| Candidatos de mapeo | 1,3k, crece con el corpus | tope fijo 25 líneas, ~0,9k |
| Bloque para el tablero | 4k (salida de tool + chat) | 0, se sube la ficha |
| Respuesta final | 2,6k | 0,3k |
