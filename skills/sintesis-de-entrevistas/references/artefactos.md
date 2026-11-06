# Cuando el discovery tiene más que entrevistas

Un discovery maduro produce fichas, blueprints, mapas, decks y planillas. Todos
salen del mismo research y todos crecen. Cargarlos juntos en una conversación
deja de ser posible bastante antes de lo que uno espera: cuatro blueprints y un
mapa ya son doscientos mil caracteres.

La salida no es resumir, porque resumir pierde justamente lo que hace útil al
corpus. La salida es **indexar**: un archivo chico que dice qué existe y dónde,
y un comando que abre solo el pedazo que hace falta.

## El índice

```bash
node scripts/mapa.js indexar *.bp.json data.js fichas/*.md
node scripts/mapa.js indice
```

Genera `INDICE.md`, que ocupa alrededor de 2.500 tokens y cubre un corpus de
cualquier tamaño: la lista de artefactos con qué cubre cada uno, los pasos y las
fases de cada blueprint, los nodos del mapa, las fichas con su perfil, y los
avisos de consistencia.

**`INDICE.md` es lo único que se adjunta siempre.** Con eso alcanza para saber
dónde está todo y decidir qué abrir.

## Abrir un pedazo

```bash
node scripts/mapa.js donde P53                 # en qué artefactos vive un id
node scripts/mapa.js donde "lista de espera"   # búsqueda por texto en todo
node scripts/mapa.js abrir 03-tecnologia_bp.json --paso s4
node scripts/mapa.js abrir 03-tecnologia_bp.json --dolor P53
node scripts/mapa.js abrir ficha-E13.md --seccion 03
```

Un blueprint entero son 6.000 tokens; un paso son 300. Una ficha son 4.000; una
sección son 600. Esa es toda la diferencia.

## La regla

| Qué querés hacer | Qué adjuntás |
|---|---|
| Consultar cualquier cosa | `INDICE.md` y el script |
| Editar un blueprint | `INDICE.md` y ese blueprint |
| Procesar una entrevista nueva | la transcripción y `corpus.json` |
| Armar un deck o una matriz | `INDICE.md`, y abrís lo que cite |

Lo que nunca: adjuntar todo el corpus por si acaso.

## Ids compartidos

Los ids son el pegamento que permite trabajar sin cargar todo: `E13` una
entrevista, `P53` un dolor, `O28` una oportunidad, `DC2` un dolor consolidado,
`G6` o `S2` un nodo del mapa, `s4` un paso de un blueprint. Si un entregable
cita ids, después se puede verificar con `donde` sin abrir nada.

Eso solo funciona si **un id significa lo mismo en todos los artefactos**, y es
exactamente lo que se rompe cuando cada artefacto se mantiene a mano. Por eso:

```bash
node scripts/mapa.js dolores --dup
```

Lista los ids que apuntan a dolores distintos según el archivo. Distingue una
reformulación de la misma frase (no importa) de una desincronización real
(rompe toda cita cruzada). Correrlo cada vez que se agrega un artefacto nuevo.

Ids completos del proyecto:

| Id | Qué es | Quién numera |
|---|---|---|
| `E13`, `E15a` | entrevista, persona de una grupal | ficha |
| `E13-D4` | dolor de ficha | ficha |
| `DC12` | dolor consolidado (`DU` solo heredados) | `corpus.json` |
| `P12`, `O12` | dolor y oportunidad de síntesis | registro de dolores |
| `IN3` | insight transversal | `NOTAS.md` |
| `BP2-s4` | paso de un blueprint | blueprint, citado con su prefijo |
| `G6`, `S2` | nodos de un mapa de ecosistema, si existe | `data.js` |

Un prefijo no se usa para dos cosas. Un id dado de baja no se reutiliza.

## Cómo evitar que se desincronicen

Un solo lugar numera. El resto referencia ese id y no crea los suyos. Para P y O
ese lugar es el **registro de dolores**
(`Registro_Dolores-y-Oportunidades_{Proyecto}.md`, o el nombre que fije `contexto.md`): cada P lleva
blueprint y paso, si está en el mapa, entrevista, dolor de ficha y DC. Un dolor
nuevo entra primero al registro y después al blueprint o al mapa. Lo que no se
pudo anclar va con `[VERIFICAR]`, nunca con un vínculo supuesto.

Si los blueprints y el mapa ya divergieron, hay dos caminos. El barato: dejar
cada numeración como está y **citar siempre con el archivo**, nunca "P53" solo,
sino "P53 del blueprint de tecnología". El caro pero definitivo: renumerar
contra una tabla única y actualizar los artefactos, que se hace una vez y se
termina el problema.

Mientras convivan las dos numeraciones, el aviso del índice está para que nadie
cite un id suelto en un deck y termine defendiendo el dolor equivocado.
