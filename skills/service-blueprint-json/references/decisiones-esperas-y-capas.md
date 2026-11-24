# Decisiones, esperas, conexiones y capas

Detalle de las cuatro piezas del formato que no son tarjetas. El resumen está en
SKILL.md; esto se lee cuando el recorrido bifurca, tiene esperas largas, necesita
flechas entre carriles o el foco pide tiempo, métricas o regulaciones.

## Contenido

- Decisiones, esperas y ramas
- Conexiones
- Capas secundarias

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
