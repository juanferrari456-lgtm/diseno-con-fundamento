# Repartir en carriles: casos borde

Los cinco carriles por defecto son evidencias (EV), customer journey (CJ),
frontstage (FS), backstage (BS) y procesos de soporte (PS). El criterio base
está en el SKILL.md. Acá están los casos que se discuten de verdad.

## Un sistema hace algo solo

Un mail automático, un cobro recurrente, una validación de un motor de riesgo.
No lo hace una persona, pero sí lo hace la organización.

- Si el cliente lo ve pasar en el momento (recibe el mail, ve la pantalla de
  confirmación), va en **frontstage**, con el sistema como actor.
- Si el cliente no se entera, va en **backstage**.
- Lo que el cliente recibe, el mail en sí, es una **evidencia**.

Declarar el sistema como actor está bien y suele ser revelador: un blueprint
donde el actor más frecuente es "el sistema" cuenta una historia distinta a uno
donde es "atención al cliente".

## Un tercero que no es la organización

Un courier, una pasarela de pago, un proveedor.

- Si el cliente interactúa con el tercero creyendo que es parte del servicio, va
  en **frontstage**. Esa confusión suele ser el hallazgo.
- Si el tercero trabaja sin que el cliente lo vea, va en **backstage**.
- Si el tercero sostiene el servicio pero no participa de este recorrido, por
  ejemplo el que entrega la harina, va en **procesos de soporte**.

## Autoservicio

El cliente hace algo que antes hacía un empleado: se saca su propio turno,
completa un formulario, escanea un producto.

La acción va en **customer journey**, porque la hace el cliente. Frontstage
queda vacío en ese momento, y ese vacío es información: nadie lo está
acompañando. Si el sistema le devuelve algo, eso es evidencia.

Un error frecuente es duplicar: poner "el cliente completa el formulario" en
journey y "el formulario recibe los datos" en backstage. Lo segundo no es una
acción de nadie, es la misma cosa contada dos veces.

## El cliente es interno

Blueprints de procesos internos: onboarding de un empleado, un pedido de compras,
un ticket de soporte interno.

Funciona igual, con una traducción: el "cliente" es quien recibe el servicio, y
la "organización" es el área que lo presta. Renombrá el carril en `carriles`
para que se lea bien, por ejemplo `"label": "Recorrido del colaborador"`. La
estructura no cambia.

## Una reunión entre dos áreas internas

Si el cliente no está, es **backstage**, aunque haya varias personas. Poné una
tarjeta por área si cada una hace algo distinto, o una sola si el hecho
relevante es que se reunieron.

Si la reunión pasa todas las semanas y no por este caso en particular, es
**procesos de soporte**.

## Algo que pasa "todo el tiempo"

Mantener un catálogo, revisar un calendario, tener el stock al día. No pasa en un
momento, pasa siempre.

Va en **procesos de soporte**, en la columna del momento donde más se nota su
efecto. Si no hay un momento claro, ponelo en el primero.

## Dudas entre backstage y soporte

La pregunta que resuelve casi todas: **¿esto empieza por este caso, o ya venía
pasando?**

- El pizzero estira la masa porque este cliente pidió esta pizza: backstage.
- Compras cerró el pedido de mozzarella la semana pasada: soporte.

## Un momento donde no pasa nada visible

Si el cliente espera y la organización trabaja, el journey lleva una tarjeta de
tipo `espera` con el `span` de las columnas que dura, y cada tarea interna abre
su propia columna abajo de esa barra. Ese es el patrón más común y más útil de
todo el blueprint: muestra de un vistazo cuánto trabajo invisible sostiene un
silencio, y en qué orden pasa.

Si el cliente espera y la organización tampoco hace nada, decilo. Una espera con
backstage vacío es el dolor más caro que vas a encontrar.

## El mismo actor en dos carriles

Lo que ubica una tarjeta es la acción, no la persona. El vendedor que saluda al
cliente está en frontstage; el mismo vendedor que se va al depósito a buscar el
producto está en backstage, en el mismo momento o en el siguiente.

Es un error frecuente armar los carriles por área o por puesto: eso es un process
map, no un blueprint. La línea de visibilidad divide por lo que el cliente ve, no
por quién cobra el sueldo.

## Frontstage con personas y frontstage con máquinas

Frontstage tiene dos formas y las dos valen:

- **Persona a persona**: alguien de la organización interactúa directo con el
  cliente.
- **Persona a máquina**: el cliente usa una tecnología de autoservicio, y lo que
  responde es la organización a través de esa máquina. El cajero automático, el
  chatbot, el kiosco. El actor es el sistema.

No hay una acción de frontstage por cada momento del cliente. Los momentos sin
frontstage son información: ahí el cliente está solo.

## Varios clientes en el mismo recorrido

Hay servicios con más de un cliente: la pareja que compra un electrodoméstico, el
que contrata y el que usa, el que paga y el que recibe. El carril CJ los acepta a
todos, y se distinguen con `actor`. Cuando el recorrido se parte de verdad entre
dos personas, mirá si no son dos blueprints.

## Cuando falta el actor

En frontstage y backstage el actor no es decorativo: es lo que permite preguntar
quién se hace cargo del rediseño. Si el material no lo dice, poné el rol genérico
más probable y sumá un hallazgo `pregunta` en ese paso. Nunca inventes un área
con nombre y apellido.

Sé específico cuando puedas. "Analista de riesgos" es mejor que "el back", y
"revisar la deuda fiscal en el padrón" es mejor que "revisar". La especificidad
es lo que hace que el blueprint sirva en la etapa de implementación.

## Cuántas tarjetas por celda

Hasta cuatro, y se dibujan lado a lado: el plugin abre una subcolumna por cada
una. Sirve tanto para lo simultáneo (el mozo sugiere la especial mientras toma el
pedido) como para lo secuencial dentro del mismo momento (corta ventas, deduce
comisiones, habilita el giro).

A partir de la quinta el plugin apila en una segunda fila y el board crece a lo
alto. Cuando llegás a eso, casi siempre son dos momentos y conviene partir el
paso. El ancho es barato, el alto no.

Mientras la organización encadena cuatro acciones, el carril del cliente lleva
una sola barra de espera que se estira sobre todo el paso. Eso es justamente lo
que se quiere ver: cuatro movimientos de la organización contra un solo silencio
del cliente.
