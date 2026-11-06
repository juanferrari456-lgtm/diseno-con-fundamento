---
name: priorizacion-de-conceptos
description: "Prioriza conceptos con criterio a la vista: matriz 2x2 con ejes definidos y un ejemplo de calibración, chequeo de honestidad sobre lo que cae en 'mucho valor, poco esfuerzo', prueba de deseabilidad, factibilidad y viabilidad con veredicto por pata (sostenida, contradicha, sin probar), y el supuesto que mata cada concepto con su prueba más barata. Sale con ahora, después y estacionado. Usar cuando pidan priorizar conceptos o ideas, armar una matriz de valor y esfuerzo o de impacto y confianza, 'no podemos hacer todo', 'qué hacemos primero', 'esta idea tiene sentido', probar deseabilidad, factibilidad y viabilidad, 'cuál es la apuesta más riesgosa' o 'qué probamos primero'."
---

# Priorización de conceptos

La matriz 2x2 es simple; la disciplina no. Con ejes sin calibrar, todo cae arriba a la izquierda, que es la forma educada de decir que el equipo puntuó su propio optimismo. Ubicar sin razonamiento escrito es votar; ubicar con razonamiento es una decisión que se puede defender en seis meses.

Esta skill hace tres cosas sobre el mismo conjunto de conceptos: los ubica en la matriz, les toma las tres preguntas que deciden su vida (¿la gente lo quiere?, ¿lo podemos hacer?, ¿se sostiene?) y nombra la apuesta que los mata.

Principios del paquete en `references/principios.md`. Escala de certeza en `references/certeza-y-muestras.md`.

## Cuándo usarla y cuándo no

- **Sí:** con varios conceptos escritos y la necesidad de elegir dónde va el esfuerzo, o antes de que un concepto reciba inversión.
- **No:** para priorizar problemas u oportunidades (va `arbol-de-oportunidades`) ni con ideas sin escribir (va `ideacion`, ficha de concepto).

## Qué necesita para arrancar

Los conceptos escritos con el mismo formato, la evidencia detrás (insights, arquetipos, árbol) y lo que se sepa de factibilidad y negocio.

Según cómo llega el pedido (principio P1):

- **Completo:** seguir el proceso.
- **Con huecos:** si los conceptos no están escritos con el mismo formato, ofrecer pasarlos primero por la ficha de `ideacion`. Si falta contexto de factibilidad o de negocio, esas patas quedan "sin probar" y se dice qué haría falta.
- **De alguien que arranca:** explicar en una línea la idea ("ubicamos cada idea con un porqué escrito, para que la decisión se pueda discutir y no sea un voto") y elegir los ejes juntos.

## Térmica

| Si falta esto | Saltar a |
|---|---|
| Los conceptos escritos con el mismo formato | `ideacion`, ficha de concepto |
| Evidencia de deseabilidad | `sintesis-de-entrevistas`, `evidencia` |
| El concepto elegido y la prueba a diseñar | `prueba-de-conceptos` |

## Proceso

### 1 | Matriz calibrada

Con `references/matriz.md`:

1. **Elegir y definir los ejes** según la decisión real: valor para la persona contra esfuerzo, o impacto contra confianza, u otro par. Definidos antes de ubicar nada.
2. **Calibrar con un ejemplo:** ubicar juntos un concepto bien conocido, discutirlo, y usarlo como vara para el resto.
3. **Ubicar cada concepto con su razonamiento** en una o dos oraciones. El valor sostenido por investigación pesa distinto que el sostenido por entusiasmo, y el razonamiento dice cuál es cuál.
4. **Chequeo de honestidad** de todo lo que cae en "mucho valor, poco esfuerzo": si es tan bueno y tan barato, ¿por qué no existe? ¿Quién lo hace y qué deja de hacer para hacerlo? Lo que no responde se mueve.

**Freno.** Mostrar ejes, calibración y ubicaciones antes de seguir: es la parte de criterio.

### 2 | Deseabilidad, factibilidad y viabilidad

Con `references/dfv.md`, por concepto y solo con evidencia:

- **Deseabilidad:** lo que personas reales dijeron e hicieron en la investigación.
- **Factibilidad:** hechos técnicos y operativos reales.
- **Viabilidad:** números reales de costos y de disposición a pagar.

Cada pata: sostenida, contradicha o sin probar, con su evidencia. "Sin probar" es el veredicto más común y más honesto a esta altura: un concepto con dos patas sin probar no es malo, es no validado. Nombrar la pata más débil de cada uno.

### 3 | El supuesto que mata

Con `references/supuestos.md`, por concepto:

1. La pila de supuestos: qué tiene que ser cierto sobre las personas, sobre la capacidad de hacerlo y sobre la economía, escrito de forma que pueda resultar falso.
2. Ordenarla por cuánto muere el concepto si es falso y qué tan poca evidencia tiene.
3. Nombrar **uno** para probar primero y resistir la tentación de probar cinco a la vez.
4. Su prueba más barata y honesta: qué evidencia lo movería, de qué personas, en cuánto tiempo.

### 4 | Ahora, después, estacionado

- **Ahora:** lo que arranca ya, con su primera prueba.
- **Después:** lo que espera una dependencia o un resultado.
- **Estacionado:** con la condición que lo revive, para no volver a discutirlo cada mes.

## Formato de salida

`Priorizacion_{Tema}_{Proyecto}.md` (o la convención de `contexto.md`): definición de ejes y ejemplo de calibración, la matriz como tabla con el razonamiento de cada concepto, la tabla de las tres patas con la más débil marcada, el supuesto que mata cada concepto con su prueba, y ahora, después y estacionado con dueños si se saben.

## La regla que no se negocia

Nada en verde sin evidencia citada. El entusiasmo del equipo, la convicción de quien patrocina o el tamaño del mercado no mueven la deseabilidad: si ninguna persona real respondió al concepto, dice "sin probar" por más segura que esté la sala.

## Errores que existe para evitar

- Ejes sin definir: todo cae arriba a la izquierda.
- Ubicar por intuición sin escribir por qué.
- Un "mucho valor, poco esfuerzo" que nadie revisó.
- Probar el supuesto fácil en vez del que importa.
- Estacionar sin condición de regreso.

## Referencias

- `references/matriz.md`: ejes, calibración y chequeo de honestidad.
- `references/dfv.md`: las tres patas y cómo darles veredicto.
- `references/supuestos.md`: la pila de supuestos y la prueba más barata.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
