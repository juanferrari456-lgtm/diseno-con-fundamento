---
name: "service-blueprint-json"
description: "Redacta un archivo .bp.json (spec bp/2) para el plugin de FigJam \"Blueprint from .json\", a partir de desgrabaciones de entrevistas, notas de campo, documentación de procesos o una descripción del servicio. Usar cuando aparezca un service blueprint, un blueprint de servicio, un customer journey con carriles de frontstage y backstage, un mapeo de un proceso end to end, o cuando alguien quiera pasar research a un archivo para dibujar en FigJam. También cuando pidan \"armame el blueprint de esto\", \"pasá estas entrevistas a un blueprint\", \"mapeá este servicio\", \"esto está para blueprint o para journey\" o \"convertí esto a .bp.json\", aunque no nombren el plugin ni el formato."
---

# Blueprint de servicio en .bp.json

Esta skill convierte material de research en un archivo `.bp.json` válido que el
plugin **Blueprint from .json** dibuja en FigJam.

El trabajo difícil no es el JSON. Es el criterio: encuadrar el alcance, decidir
cuáles son los momentos del recorrido, qué acción va en qué carril, quién es
responsable de cada una, y qué es un hallazgo y qué es una tarjeta. Eso es lo
que decide si el blueprint sirve para rediseñar un servicio o si es una lista de
tareas dibujada bonito.

Trabajás como service designer, no como transcriptor. Lo que el material no dice,
no lo inventás: lo declarás como incógnita.

Principios del paquete en `references/principios.md`.

## El plugin

**Blueprint from .json** es un plugin público de FigJam que dibuja el archivo con
su propio design system y guarda el archivo dentro del board. Instalarlo desde la
comunidad de Figma: https://www.figma.com/community/plugin/1677322978727404526. Si la persona no usa FigJam, el
`.bp.json` igual sirve como modelo estructurado, y `pensar-blueprints render` da
la versión en Markdown para leer y compartir.

## Cuándo usarla y cuándo no

- **Sí:** para pasar un blueprint pensado (o material de research) al formato que
  dibuja el plugin.
- **No:** para decidir cuántos blueprints hacen falta, dónde se corta cada uno o
  si un recorrido está bien pensado: eso es `pensar-blueprints` y va antes.

## Qué necesita para arrancar

Material de research o una descripción del servicio, sin modelo de
`pensar-blueprints`.

Si ya hay modelo (`arquitectura.json` y un archivo por blueprint, spec `pbp/1`),
esta skill no hace falta: el plugin lo lee directo desde su build 14. Se sueltan
todos los archivos juntos y dibuja la portada y un board por blueprint, sin
traducir nada. Decirlo y no rehacer el modelo en `.bp.json`.

Según cómo llega el pedido (principio P1):

- **Completo** (hay modelo `pbp/1`): no traducir. Indicar que se suelta la carpeta en el plugin.
- **Completo** (hay un `.bp.json` que retocar): editarlo sobre el mismo archivo, sin volver a pensar el recorrido.
- **Con huecos** (hay material pero no modelo): si es un solo recorrido chico,
  seguir con el método de esta skill; si son varios recorridos o mucho material,
  saltar a `pensar-blueprints`.
- **De alguien que arranca:** explicar en una línea la diferencia entre journey y
  blueprint (cuadro de abajo) y preguntar qué quiere entender.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| Hay más de un recorrido, o no está claro dónde se corta | `pensar-blueprints` |
| El pedido no está encuadrado | `encuadre-del-problema`, bloques A y B |
| Hay entrevistas sin procesar | `sintesis-de-entrevistas` |
| Lo que piden es entender qué siente la persona | Es un journey: decirlo |

## Antes de arrancar: ¿esto es un blueprint?

|  | Journey map | Service blueprint | Process map |
|---|---|---|---|
| Perspectiva | del cliente | sistémica, conecta experiencia y operación | interna, eficiencia |
| Eje Y | capas de la experiencia | líneas de interacción, visibilidad e interacción interna | carriles por área o sistema |
| Sirve para | encontrar brechas y empatizar | diseñar y alinear la entrega del servicio | estandarizar y auditar |

Si lo que piden es entender qué siente la persona, es un journey map y esta
skill no es la herramienta: decilo. El blueprint responde **cómo se produce**
esa experiencia. Emoción, pensamientos y curva de ánimo viven en el journey; acá
entran solo como hallazgo (`cita`, `dolor`) cuando explican una falla del
servicio.

El orden sano es journey as-is primero, blueprint as-is después, mapas to-be al
final. Si no hay journey previo, el journey lo construís vos en el carril CJ
antes de bajar a los demás.

## El encuadre, tres decisiones antes de escribir

Se deciden explícitamente y se escriben en `meta`. Un blueprint sin encuadre se
discute para siempre.

**Alcance.** ¿Toda la experiencia o un pedazo? Apuntá a 8 a 12 acciones del
cliente. Menos de 6 y probablemente estés mapeando una pantalla; más de 15 y el
board deja de leerse: volver a `pensar-blueprints` y abrir un zoom del momento
que más pesa, en lugar de partir el recorrido por largo.
Un alcance chico y terminado vale más que uno grande a medias.

**Estado.** As-is o to-be. Nunca mezclados en el mismo archivo. El to-be se
escribe después del as-is y como archivo aparte, porque la comparación es la
mitad del valor.

**Foco.** Para qué se va a usar: alinear áreas, encontrar puntos de falla,
preparar un rediseño, bajar tiempos. El foco decide qué capas secundarias sumás
y cuáles dejás afuera.

La ficha queda así:

```json
"meta": {
  "titulo": "Alta de cuenta empresa",
  "variante": "As is",
  "subtitulo": "Dueño de pyme que abre su primera cuenta comercial",
  "estado": "borrador para taller",
  "version": "v1 | 03/2026",
  "fuentes": "6 entrevistas a clientes, 4 a operaciones, manual de onboarding"
}
```

`subtitulo` lleva actor principal y escenario, que son las dos preguntas que se
hace cualquiera al abrir el board. `fuentes` es lo que hace auditable el
archivo: sin eso, el blueprint es opinión.

**Además, qué pasa después y quién es dueño de la relación.** Si el pedido no viene
encuadrado, pasarlo por `encuadre-del-problema`, bloques A y B, antes de fijar el
alcance. Dos consecuencias en el board:

- El alcance no termina en la última acción del cliente, sino en lo que le llega al
  siguiente actor: quién recibe el resultado y qué hace con eso.
- En cada momento donde cambia el dueño de la relación (de la plataforma al comercio
  o a un socio, por ejemplo), la tarjeta de FS dice qué marca ve la persona. Un cambio de dueño
  sin marcar es un punto de falla probable: "¿quién es esta marca y por qué me
  escribe?".

## Método, cinco movimientos

1. **Leé todo el material antes de escribir una línea.** Desgrabaciones, notas,
   documentos de proceso, capturas. Fijate qué perspectivas están cubiertas:
   clientes, frontstage, backstage, soporte o terceros, y negocio. Las que
   falten son huecos que después vas a tener que declarar.
2. **Encuadrá** alcance, estado y foco, y escribí `meta`. Mirá también qué pasa
   después del último momento y dónde cambia el dueño de la relación.
3. **Escribí el journey primero**, en prosa y sin JSON: diez a veinte líneas del
   estilo "descubre, contacta, presenta, espera, firma". Mostrale siempre la
   secuencia a la persona, agrupada en fases, y esperá el ok antes de bajar a
   carriles. Corregir el recorrido después es rehacer todo.
4. **Bajá carril por carril**, en orden: CJ, FS, BS, PS, y recién al final EV.
   Bajar por carril y no por columna es lo que evita que backstage quede lleno de
   huecos que en realidad son pereza de relevamiento.
5. **Sumá capas y hallazgos**, validá con los dos scripts, y entregá.

Los frenos son dos: el alcance, cuando no está claro, y el journey, siempre.
Son las decisiones más caras de revertir. En el resto no hace falta pedir permiso.

## Las cuatro reglas que sostienen el formato

**Un paso es un momento, y dentro del momento las acciones van lado a lado.**
El plugin abre una subcolumna por cada acción del carril más cargado del paso, así
que dos tareas seguidas del mismo equipo se dibujan una al lado de la otra y no
apiladas: administración corta las ventas, después deduce comisiones, después
habilita el giro, y eso son tres tarjetas en el mismo paso, tres subcolumnas.

El tope es **cuatro por carril y por paso**. A partir de la quinta el plugin
vuelve a apilar en una segunda fila, y ahí el board crece a lo alto, que es lo
que se quiere evitar. Si un carril tiene cinco o más acciones en un mismo
momento, casi siempre son dos momentos.

Un paso nuevo se abre cuando el momento merece rótulo y tiempo propios, cuando
cambia lo que el cliente está haciendo, o cuando cambia la fase. No hace falta
abrir un paso por cada tarea interna: para eso están las subcolumnas.

**Los ids los escribís vos y no cambian nunca.** Usá prefijos legibles por
carril: `cj1`, `fs2`, `bs3`, `ev1`, `ps2`, y `s1`…`s8` para los pasos, `d1` para
decisiones. Nada de numerar por posición: si mañana se inserta una tarjeta, los
ids viejos tienen que seguir apuntando a lo mismo.

**Una tarjeta es una acción, narrada en presente.** Verbo conjugado en tercera
persona, sujeto en el `actor`, menos de 120 caracteres. "Arregla con el mozo
dónde sentarse", no "arreglar con el mozo dónde sentarse". "Escribe la reseña",
no "escribir la reseña". El board se tiene que poder leer en voz alta en un
taller como quien cuenta lo que pasa, sin traducir nada. Si tenés que escribir
"y" para unir dos verbos, fijate si no son dos tarjetas, y si esas dos cosas
pasan una después de la otra, son dos columnas.

**Los hallazgos no viven en un carril.** Un dolor no es una acción: es una
observación sobre el momento. Va en `hallazgos` del paso, y con `ref` apuntás a
la tarjeta que lo genera.

## Decidir los momentos

Un momento nuevo empieza cuando cambia lo que el cliente está haciendo o
esperando. Preguntas que ayudan:

- ¿El cliente hace algo distinto que antes? Momento nuevo.
- ¿Pasó tiempo sin que el cliente haga nada? Ese es un momento de espera, y es
  de los más valiosos del blueprint.
- ¿Cambió quién lo atiende, o cambió de canal? Casi siempre momento nuevo, y casi
  siempre un dolor: los traspasos son donde se cae el servicio.
- ¿Es la misma intención con dos tareas internas distintas? Un solo momento.

Ocho a doce **acciones del cliente** es el objetivo, y es la medida que importa
para el alcance. Las columnas pueden ser más, porque el trabajo interno abre las
suyas: veinte columnas sigue siendo legible, treinta ya no y conviene partir el
blueprint en dos zooms.

Agrupá los momentos en `fases`, tres o cuatro, con nombres del negocio y no del
proceso interno: "Llegada", "Pedido y espera", "Cierre". Las fases son lo que
permite leer el board de lejos y lo que engancha con el journey map si existe.

Entre esos momentos hay uno o dos **momentos de la verdad**: donde se define la
percepción del servicio y donde se juega la continuidad del cliente. El spec no
tiene un campo para marcarlos, así que se marcan con un hallazgo `nota` que
explique por qué ese momento decide, y el dolor asociado lleva id. No inventes
micro sintaxis dentro del texto para señalarlo.

## Repartir en carriles

Cinco carriles por defecto. El test rápido de cada uno:

- **EV, evidencias.** ¿Es una cosa? Un documento, una pantalla, un mail, un
  cartel, un plato. No es una acción, es lo que queda y lo que el cliente puede
  señalar. Si en un momento no hay nada que el cliente vea o reciba, el carril
  queda vacío, y eso también dice algo: escribí "Ninguna" solo cuando esa
  ausencia sea el hallazgo.
- **CJ, customer journey.** ¿Lo hace el cliente? Va acá, siempre desde su punto
  de vista y con sus palabras, no con las del negocio. "Esperar respuesta sin
  saber cuánto falta", no "el sistema procesa la solicitud".
- **FS, frontstage.** ¿El cliente lo ve o lo escucha? Lo hace alguien de la
  organización, delante del cliente. Persona a persona o persona a sistema: un
  chatbot que responde es frontstage, con el chatbot como actor.
- **BS, backstage.** ¿Lo hace la organización y el cliente no se entera? Acá va
  la mayor parte del trabajo real, y acá aparecen casi todos los dolores
  operativos. El mismo actor puede estar en FS y en BS: lo que ubica la tarjeta
  es la acción, no la persona.
- **PS, procesos de soporte.** ¿Habilita lo de arriba pero no arranca por este
  caso? Compras, mantenimiento, calendarios, plataformas, contratos marco,
  terceros que sostienen el servicio sin participar de este recorrido.

Un blueprint sano tiene el journey lleno y parejo, frontstage con huecos,
backstage denso, y soporte salteado. Si backstage está vacío, no relevaste el
detrás de escena y lo que tenés es un journey map con otro nombre. Si el journey
tiene huecos, te faltan momentos.

`references/lanes.md` tiene los casos borde resueltos: sistemas automáticos,
terceros, autoservicio, reuniones internas, y qué hacer cuando el cliente es
interno.

## Escribir una tarjeta

```json
{ "id": "bs3", "actor": "pizzero", "canal": "cocina",
  "texto": "Arma la pizza con los ingredientes del pedido" }
```

`actor` es quién, `canal` es por dónde. Los dos son ids de los catálogos que
declarás arriba. El spec los deja opcionales, pero el oficio no: **en FS y en BS
poné siempre actor**. Una acción sin responsable no se puede rediseñar ni
asignar, y la pregunta "¿esto quién lo hace?" es la que más se repite en los
talleres. Si el material no lo dice, poné el rol genérico y dejá una `pregunta`
al lado.

Sé específico. "Revisar" no sirve; "revisar que el CUIT tenga deuda fiscal" sí.
La especificidad es lo que hace que el blueprint sobreviva a la reunión y sirva
para implementar.

Marcá `"unhappy": true` cuando esa acción sea el camino no feliz: la tarjeta sale
con borde rojo. Usalo poco, para que signifique algo.

## Los seis tipos de hallazgo

| tipo | cuándo | ejemplo |
|---|---|---|
| `dolor` | algo que no funciona | La espera se estima a ojo y siempre se queda corta |
| `oportunidad` | algo que se podría hacer | Avisar el tiempo estimado al tomar el pedido |
| `nota` | contexto que hace falta para entender | La especial del día depende de lo que sobró del mediodía |
| `cita` | palabras textuales de alguien | Me dijeron diez minutos y estuve media hora |
| `dato` | un número que viene del research | Seis de cada diez mesas del viernes llegan sin reserva |
| `pregunta` | algo que todavía no sabés | ¿Cuántos se van durante la espera? |

Poné `id` a dolores y oportunidades (`P1`, `P2`, `O1`) porque son los que se
cruzan con otros documentos después. Notas, citas, datos y preguntas casi nunca
lo necesitan.

Las citas van textuales, sin arreglarles la gramática, sin comillas de más y sin
nombre propio. Son la evidencia de que el dolor existe.

Dos reglas de higiene: un paso con tres dolores y ninguna oportunidad es research
sin síntesis; y un blueprint sin ninguna `pregunta` casi siempre está mintiendo,
porque nadie relevó todo. Declarar la incógnita es parte del entregable, no una
debilidad.

## Decisiones, esperas y ramas

Cuando el recorrido se bifurca, el paso es una decisión:

```json
{ "id": "d1", "fase": "F1", "tipo": "decision",
  "pregunta": "Come en el salón o se lo lleva?",
  "ramas": [
    { "id": "A", "label": "Se queda", "detalle": "7 de cada 10", "sigue": "s3" },
    { "id": "B", "label": "Se lo lleva", "detalle": "3 de cada 10" }
  ]}
```

`detalle` es donde va el volumen. Si el material no lo dice, dejalo vacío en vez
de inventarlo.

**Regla de un tercio.** Si después de la bifurcación cambia más de un tercio del
blueprint, eso no es una rama: es otro blueprint. Y antes de abrir cualquier
rama, preguntate si no podés generalizar lo que pasa. Las ramas agregan
complejidad a un gráfico que ya es complejo.

Cuando el cliente no hace nada y solo espera, la tarjeta del journey es una
espera, y `span` dice cuántas columnas cubre:

```json
{ "id": "cj4", "tipo": "espera", "span": 3,
  "texto": "Espera la pizza sin saber cuánto falta" }
```

Sale como una barra baja y angosta, que es como se lee el tiempo muerto en un
blueprint. No le pongas actor ni canal.

`span` se cuenta en **pasos**, no en subcolumnas: `span: 3` cubre este paso y los
dos siguientes, con todo su ancho. Dentro de un mismo paso no hace falta
declarar nada: si el cliente tiene una sola espera y backstage tiene cuatro
acciones, la barra se estira sola sobre las cuatro subcolumnas. Dejá el carril
CJ vacío en los pasos que la barra cubre.

Este es el patrón más importante del formato y el que ordena todo lo anterior.
Mientras la organización encadena cinco tareas en cinco columnas, el cliente está
haciendo una sola cosa, esperar, y eso se ve de un vistazo. Casi siempre hay un
dolor colgando de una espera, y una espera con backstage vacío es el dolor más
caro que vas a encontrar.

## Conexiones

El journey se encadena solo, decisiones incluidas. En `conexiones` van únicamente
las flechas que cruzan carriles o que se salen de la secuencia. Tres a seis por
blueprint alcanzan. Más que eso y el board se vuelve un plato de fideos.

La semántica importa:

- `flecha`: dependencia en un sentido. A necesita que B haya pasado.
- `doble`: codependencia, las dos partes tienen que acordar. Suele marcar el
  lugar donde dos áreas negocian y nadie escribió cómo.
- `punteada`: camino alternativo, o dependencia informativa y asincrónica.

## Capas secundarias

Se suman al final, y solo si el foco las pide. Cada capa que no aporta compite
con la lectura del board.

**Tiempo.** `tiempo` en el paso. Ponelo cuando la duración sea parte del problema,
y en rango con unidad: "5 a 25 min", "5 a 12 días". El tiempo total de una fase
va como `dato` en el primer paso de la fase. Un blueprint donde el tiempo pasa de
minutos a semanas está contando el hallazgo más importante sin decir nada.

**Métricas.** Van como `dato`, pegadas al momento que miden. Sirven tres
familias: descriptivas (tiempo de atención, llamados caídos), de percepción
(satisfacción del cliente o del empleado) y de resultado (abandono, costo,
rotación). Si el material no trae números, una `pregunta` que diga qué habría que
medir vale más que un número inventado.

**Regulaciones y restricciones.** Lo que no se puede cambiar va como `nota`.
Es lo que evita que el taller proponga rediseñar algo que la normativa fija.

## Validar antes de entregar

Dos pasadas, siempre:

```bash
node <carpeta de esta skill>/scripts/validate.js ruta/al/archivo.bp.json    # el formato
node <carpeta de esta skill>/scripts/revisar.js  ruta/al/archivo.bp.json    # el criterio
```

`validate.js` devuelve el mismo veredicto que el plugin, sin abrir Figma:
errores que impiden dibujar, avisos que no, y el resumen de cuántos pasos y
tarjetas quedaron. Si sale con errores, arreglalos y volvé a correrlo. No
entregues un archivo que no pasó por acá: el plugin lo va a rechazar igual y la
persona pierde el viaje.

`revisar.js` corre la rúbrica de oficio sobre el mismo archivo: encuadre,
granularidad, cobertura de carriles, responsables, evidencia, balance de
hallazgos. Da un puntaje sobre diez. Ocho es aceptable para llevar a un taller;
diez es para circular. Los avisos de `revisar.js` no siempre hay que
corregirlos, pero sí hay que poder explicarlos.

Cuando valida, entregá el archivo y contá en tres o cuatro líneas: cuántos
momentos y fases, dónde bifurcaste, qué quedó como espera, qué perspectivas del
material faltaban, y qué preguntas quedaron abiertas. Esa última parte es la que
convierte el blueprint en la agenda del próximo taller.

## La regla que no se negocia

Lo que el material no dice no se inventa. Un campo vacío es honesto; un canal,
un actor o un tiempo inventado se discute en la reunión y le quita credibilidad a
todo lo demás.

## Errores típicos

- **Meter cinco o más acciones de un carril en un mismo paso.** Arriba de cuatro
  el plugin apila en una segunda fila y el board crece a lo alto. Casi siempre
  son dos momentos distintos.
- **Columnas del journey vacías sin espera declarada.** Si el cliente no está
  haciendo nada mientras la organización trabaja, eso no es un hueco: es una
  espera, y hay que escribirla.
- **Escribir el journey desde el negocio.** "El sistema valida los datos" no es
  algo que el cliente hace. Eso es backstage.
- **Escribir en infinitivo.** Es el error más fácil de cometer y el que más
  cambia cómo se lee el board.
- **Entregar un journey map con carriles vacíos.** Si FS, BS y PS suman menos
  tarjetas que CJ, no hiciste un blueprint: hiciste un journey con adornos.
- **Acciones sin responsable.** Frontstage y backstage sin actor no se pueden
  rediseñar.
- **Meter dolores como tarjetas.** Si empieza con "no hay", "falta" o "nadie",
  es un hallazgo, no una acción.
- **Inventar lo que el material no dice.** Un campo vacío es honesto; un canal
  inventado se discute en la reunión y te hace perder credibilidad sobre todo lo
  demás.
- **Tarjetas de tres renglones.** Si no entra en 120 caracteres, es más de una
  acción, o le estás metiendo la explicación adentro. La explicación es una nota.
- **Declarar veinte actores.** Si tenés más de ocho, agrupá por rol y no por
  persona.
- **Mezclar as-is con to-be.** Son dos archivos.

En los textos del blueprint y en el resumen de entrega, no usar el punto medio ni la raya larga (em dash o en dash). Usar
"|", "-" o comas.

## Archivos de referencia

- `references/criterio.md`: el oficio en detalle. Encuadre, granularidad, cómo se
  decide un momento, capas, rúbrica de diez puntos y qué hacer después del
  blueprint. Leelo cuando el servicio sea grande, cuando el material sea
  contradictorio o cuando haya que defender el artefacto frente a stakeholders.
- `references/sintesis.md`: cómo pasar de desgrabaciones y notas crudas a la
  estructura. Codificación, triangulación de las cinco perspectivas, qué hacer
  con las contradicciones y cómo marcar lo que es inferencia.
- `references/lanes.md`: casos borde para repartir en carriles.
- `references/schema.md`: el formato completo, campo por campo, y qué valida el
  plugin. Leelo cuando dudes de un nombre de campo o de un valor permitido.
- `assets/ejemplo.bp.json`: un blueprint completo de una pizzería. Sirve de molde:
  copiá la estructura, no el contenido. (`example.bp.json` es la versión en inglés:
  no hace falta leerla.)
- `scripts/validate.js` y `scripts/revisar.js`: el validador de formato y el de
  criterio.