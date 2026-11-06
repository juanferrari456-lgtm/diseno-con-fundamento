# Arquitectura: cuántos blueprints y dónde se corta cada uno

La arquitectura es la decisión más cara del trabajo y la que menos se discute.
Si está mal, cada blueprint puede estar bien escrito y el conjunto igual no
sirve: dos cuentan lo mismo, un tramo no lo cuenta nadie, y un mismo dolor
aparece en tres lugares con tres ids.

## 1. El ciclo de la relación

Antes de pensar en blueprints, escribir el ciclo completo del cliente con la
organización, en cuatro a siete etapas de negocio. Ejemplo genérico: llegar,
acordar, preparar, operar, cobrar, continuar. Cada etapa con una línea de qué
pasa.

El ciclo es el lienzo donde se marcan los blueprints. Sirve para ver de un
vistazo qué etapas tienen dueño, cuáles tienen dos y cuáles ninguno. Va en
`arquitectura.ciclo` y cada blueprint dice qué etapas cubre.

## 2. Segmentos

Un segmento es un grupo de clientes que recorre el servicio de forma distinta.
Sale del campo (el tablero de hipótesis por segmento, la guía de entrevistas,
los espejos entre roles), no del organigrama ni de la cartera comercial.

Para cada segmento, escribir el criterio que lo separa en términos del
recorrido: quién decide, qué contrato lo ata, con qué frecuencia vuelve, qué
tecnología trae.

Después, por cada segmento, la pregunta de la regla del tercio:

| Cuánto cambia el recorrido | Qué es |
|---|---|
| Cambia un detalle (volumen, canal, plazo) | Nota en el momento. El blueprint es el mismo |
| Cambia un momento o una decisión | Decisión dentro del mismo blueprint |
| Cambia más de un tercio de los momentos, o el actor, o la cadencia | Otro blueprint |

Un segmento que no tiene blueprint se declara en `fuera_de_alcance` con el
porqué. Callarlo es dejarle la pregunta al primer stakeholder que lo note.

## 3. Los tests de corte

Un blueprint es **un actor con una intención, desde un disparador hasta un
resultado que recibe alguien**. Se abre un blueprint nuevo cuando alguna de
estas cuatro cosas cambia:

1. **El actor.** El dueño de un local y la marca que lo alquila para una
   activación no hacen el mismo recorrido aunque usen la misma tecnología.
2. **La intención.** Cerrar un contrato y operar el servicio son intenciones
   distintas aunque las haga la misma persona.
3. **La cadencia.** Lo que pasa una vez (el alta), lo que pasa por pedido (la
   programación) y lo que pasa siempre (el local equipado) no se mezclan. La
   cadencia va en el blueprint como `cadencia`.
4. **El segmento**, cuando pasa la regla del tercio.

Y **no** se abre un blueprint nuevo por estas razones:

- porque el recorrido es largo;
- porque un área interna quiere ver su parte sola (eso es un process map);
- porque una etapa quedó corta y se la pega a otra para emparejar.

Ninguna de las tres dice nada del servicio. Si un momento merece detalle propio,
se abre un zoom (ver abajo).

Cada corte se escribe en `arquitectura.cortes` con la decisión, el porqué, la
alternativa que se descartó (`descartado`) y la fuente. Es lo que defiende la
arquitectura en la reunión: una arquitectura que no muestra qué otro corte era
posible se discute como si fuera la única.

**Zoom.** Cuando un momento merece su propio detalle (el cobro, el día de la
entrega), no se parte el blueprint padre: se declara un blueprint hijo con
`zoom_de: "BP2.m4"`. El padre sigue contando el recorrido entero a su nivel y el
hijo detalla ese momento. Es la forma de tener los archivos que hagan falta sin
que ninguno pierda el hilo.

## 4. Traspasos

Cada blueprint declara:

- `entrada.disparador`: qué pasa para que empiece, en palabras del cliente o
  del negocio;
- `entrada.viene_de`: el blueprint anterior, si hay;
- `salida.resultado` y `salida.recibe`: qué deja y quién lo recibe. El alcance
  no termina en la última acción del cliente sino en lo que le llega al
  siguiente actor;
- `salida.va_a`: el blueprint siguiente, si hay.

La cadena tiene que cerrar: la salida de uno es la entrada de otro, o es el
final declarado. El `check` avisa cuando un traspaso no es recíproco.

Donde cambia el dueño de la relación (de una marca a otra, de un área a otra),
el momento lo dice, y casi siempre hay un dolor ahí.

## 5. Paralelos

Hay recorridos que pasan a la vez para el mismo cliente: mientras programa la
venta, también prepara el acceso; mientras el taller espera, el cliente hace el
trámite del seguro. Son dos intenciones simultáneas y por lo tanto **dos
blueprints**, nunca dos tarjetas del cliente en el mismo momento ni un blueprint
que "corre en paralelo a otro" sin decir dónde se tocan.

Se declaran en `arquitectura.sincronizaciones`:

```json
{ "de": "BP3.m4", "a": "BP1.m6", "tipo": "desbloquea",
  "texto": "La orden de la aseguradora habilita la aprobación", "fuente": ["E02"] }
```

Tipos útiles: `desbloquea` (a no puede pasar sin de), `informa` (de le da un dato
a a), `compite` (los dos piden lo mismo al mismo recurso). El `check` avisa si
dos blueprints del mismo actor, misma cadencia y misma etapa no declaran
sincronización: o se pisan o falta escribir dónde se tocan.

## 6. Antipatrones

Salen de auditar blueprints reales con `auditar`, que pasaban la rúbrica de
forma con 8 o 9 sobre 10. Los ejemplos están contados en otros rubros.

**El blueprint partido por largo.** Un ciclo de servicio se partió en dos
archivos porque el formato no lo dejaba leer entero. El segundo quedó con dos
recorridos pegados que no tienen nada que ver (cobrar por adelantado y atender
en el lugar) y arrancando con una decisión huérfana, que había quedado del primero.
Se reconoce porque el blueprint empieza con una decisión o porque sus fases
tienen intenciones distintas.

**El mismo tramo contado tres veces.** La preparación de una cuenta (alta del
administrador, permisos, configuración en otro sistema) aparecía en el día de
la operación, en la tecnología y en el servicio permanente. La facturación para
cobrar aparecía en el adelanto y en la liquidación. Se reconoce con `auditar` (acciones repetidas entre archivos) y se
resuelve con un dueño y referencias, o descubriendo que el tramo repetido es en
realidad su propio blueprint (cobrar, con una decisión adelanto o
liquidación).

**El paralelo declarado y no modelado.** "Corre en paralelo a la planificación"
escrito en el subtítulo, sin decir dónde se toca con la programación. El lector
no puede saber qué espera a qué.

**El segmento disfrazado de decisión.** Tres ramas (cliente corporativo,
cliente con plan anual, cliente que elige cada vez) que llegan todas al mismo
paso siguiente. No
decide nada en el recorrido: describe quién es el cliente. Va como segmento en
la arquitectura, o como nota si de verdad no cambia nada.

**El blueprint hecho antes del campo.** Un carril del cliente entero escrito
desde entrevistas internas, sin una sola entrevista al cliente, y después
quince entrevistas al cliente que nunca volvieron al blueprint. Se reconoce con
`check --corpus` o `auditar --corpus`: entrevistas del corpus que el modelo no
cita. Se presenta como hipótesis hasta que el campo lo confirme.

**El blueprint sin validar.** Un modelo armado solo desde evidencia escrita es
una hipótesis prolija. Un blueprint se termina de pensar con quienes prestan el
servicio: se les muestra el `.md`, se corrigen momentos y actores, y eso queda
en `validacion`. Si nadie que opere lo vio, se presenta como borrador.

**El volcado de research.** Entre 60 y 140 hallazgos por blueprint, la mitad sin
apuntar a ninguna acción. El blueprint deja de ser una herramienta de decisión
y pasa a ser un archivo. Se resuelve en la síntesis (ver `momentos.md`), no
achicando la letra.

## 7. Cuántos blueprints

No hay un número correcto. Hay señales:

- si dos blueprints tienen el mismo actor, la misma cadencia y la misma etapa,
  probablemente sean uno o falte la sincronización;
- si un blueprint cubre más de tres etapas del ciclo, mirá si no son dos
  intenciones;
- si un segmento importante no aparece en ninguno, falta uno o falta declararlo
  afuera;
- si cada área interna tiene "su" blueprint, se armaron por organigrama.

Un conjunto chico, completo y sin pisarse vale más que muchos blueprints que se
superponen.
