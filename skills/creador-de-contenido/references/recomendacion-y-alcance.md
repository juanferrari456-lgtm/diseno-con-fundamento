# Recomendación, alcance y gobernanza

Cortes 6, 10 y 11 en detalle. Salen de devoluciones reales sobre un entregable que se tomó
como ejemplo del rol: el relevamiento de un sistema de gestión de unos veinte módulos que
había que migrar a una plataforma nueva. Los números de los ejemplos son ficticios. El entregable no mostró hallazgos sueltos:
recomendó con fundamento, mostró las alternativas, hizo visible el costo de su propia
recomendación y le dejó a Producto decisiones concretas.

> La decisión sigue siendo del negocio. Nuestro trabajo es facilitarla con criterio.

---

## Abrir con lo que mueve la aguja

El mensaje más importante va primero, claro y corto. No el contexto, no el método:
lo que se recomienda y qué se necesita de quien escucha. Detalle y ejemplo en
`curaduria-y-narrativa.md` § "Abrir con lo que mueve la aguja".

---

## Recomendar con las alternativas a la vista

Una recomendación sola se lee como imposición o como la única idea que tuvimos. Una
recomendación entre alternativas documentadas se lee como criterio.

**Estructura que funciona:**

1. **Una slide resumen** con los escenarios lado a lado: nombre, lógica en una línea
   ("5 olas por criticidad", "3 niveles de impacto en los datos", "secuencia lineal")
   y la secuencia en 3 a 5 pasos. La recomendada marcada.
2. **Debajo, el porqué en una línea, con el criterio.** No "es el mejor", sino con qué
   se midió: *"Es el de menor riesgo: tiene en cuenta la criticidad, los equipos, los
   procesos y la cantidad de cambios de cada módulo."*
3. **Lo que comparten los escenarios, dicho.** *"Los tres terminan igual: lo
   transaccional en vivo va al final."* Le dice a quien decide qué no está en discusión
   y achica la decisión a lo que de verdad cambia entre caminos.
4. **Una slide por escenario** con cuatro bloques: en qué consiste, pros, contras y el
   orden concreto (qué entra en cada etapa). Las alternativas no elegidas tienen el
   mismo nivel de detalle que la recomendada; si no, no son alternativas, son relleno.

**Las contras de la propia recomendación van a la vista.** La recomendada tiene contras
y se escriben con el mismo peso que sus pros. Ejemplo: *"Convivencia temporal de las dos
plataformas. La última ola concentra los módulos más importantes de la operación."*
Mostrar el trade off propio hace dos cosas: le da a Producto lo que necesita para
decidir con los ojos abiertos, y construye la credibilidad que hace que la próxima
recomendación se crea. Una recomendada sin contras se lee como venta.

Antes: *"Recomendamos migrar por olas de riesgo porque minimiza el impacto."*

Después: *"Recomendamos migrar por olas de riesgo: lo crítico va al final y la operación
se adopta de a poco. El costo es convivir con dos plataformas durante la migración y
que la última ola concentre lo más sensible. Las otras dos rutas reducen esa
convivencia a cambio de más riesgo temprano."*

---

## Del mapeo al alcance (corte 10)

El as is es el insumo, no el entregable. Un relevamiento completo termina en una
decisión de alcance: qué conviene, qué no conviene y por qué.

**Patrón:**

1. **El total y el corte por uso.** *"31 secciones: 25 en uso, 6 sin uso por ningún
   equipo."* Lo que no usa nadie es la primera decisión de alcance y suele ser la más
   barata.
2. **La clasificación de cada una**, con el número de cada grupo: se migra, se construye
   desde cero, queda a definir, no se migra. Si se puede, visual (una grilla con un
   cuadro por sección, coloreada por grupo) y con el nombre de las excepciones.
3. **El volumen de cambio dentro de lo que sí va**, separado entre mejoras de lo que
   existe y cosas nuevas que hay que construir. *"147 cambios: 84 mejoras de lo que hay
   y 63 nuevos."* Dice el tamaño real del trabajo, no solo la cantidad de módulos.
4. **El porqué de cada exclusión** y **quién decide cada pendiente.** *"Notificaciones:
   a definir por Producto. Hoy salen por una herramienta externa y por eso dejó de
   usarse esta sección."*

*Señal de que falta:* el mapeo muestra todo con el mismo peso y nadie sale sabiendo qué
se deja de hacer.

---

## De la pantalla a la operación sostenible (corte 11)

Cuando la solución cambia quién puede hacer qué, roles y permisos no son un detalle
técnico ni una lista de pantallas: son un desafío de gobernanza, seguridad y exposición
de datos. Aunque "sea de Tecnología" o "de Producto", Service Design lo levanta porque
define si la experiencia funciona y es segura el día que sale.

**Qué lleva la pieza:**

- El modelo de roles sobre las secciones: cuántos roles, quién usa qué. *"12 roles sobre
  22 secciones."*
- Los niveles de permiso y qué habilita cada uno. *"4 niveles de permiso según la
  sección."*
- Qué datos quedan expuestos hoy a quien no debería verlos, si aparece.
- La traducción a experiencia: qué hay que hacer para que el que opera no pierda
  usabilidad por la restricción, y qué hay que hacer para que la restricción exista.

Mostrar cómo funciona el caos actual no alcanza. La pieza propone cómo se gobierna el
backstage para que la operación sea sostenible: eso es service readiness.

---

## El artefacto según quién lo usa

Antes de elegir el formato del relevamiento, preguntarse quién lo va a abrir y para qué.
Un PM que tiene que planificar veinte módulos necesita filtrar, contar y comparar: un
tablero navegable le sirve más que veinte flujos. Un equipo de diseño que va a
rediseñar un recorrido necesita el flujo. El artefacto se elige por el uso, no por la
costumbre del equipo.

Show, don't tell: el entregable tangible y navegable elimina la ambigüedad, le baja el
esfuerzo a quien decide (no tiene que imaginarse la estructura ni cómo se clasificó el
alcance) y deja clara nuestra posición sobre lo que tiene que estar sí o sí.

---

## La repregunta del dueño (antes de proponer una mejora)

El cliente pide con títulos globales ("invitaciones", "reportes", "que me avisen"). Detrás suele haber un problema puntual, y el dueño del sistema lo va a buscar con dos preguntas: "¿eso no existe ya?" y "¿qué quieren decir exactamente?". Si la pieza no las responde, la sala sale más confundida que con respuestas y la mejora se cae aunque el dolor sea real. Vale para las mejoras puntuales y también para las decisiones estratégicas.

Antes de llevar una mejora a la pieza:

1. **Bajar el pedido al problema.** Quién, qué pasó la última vez, cuándo y qué le costó. Si la entrevista no tiene esa repregunta, se dice: es un pedido sin problema identificado, no un hallazgo.
2. **Separar lo que el título junta.** Un mismo nombre suele agrupar problemas con dueños distintos. Ejemplo ficticio: "invitaciones" eran cuatro problemas: quién las emite (producto), el dato de cuáles se usaron (datos y reportes), el uso indebido en la entrada (operación) y el volumen que se pide (negociación comercial).
3. **Clasificar con el dueño del sistema, no con el ticket:**
   - no existe;
   - existe y no lo saben (rol no asignado, no se ofreció, no se comunicó);
   - existe y no les sirve, con el porqué (formato, permiso, momento);
   - no es de este sistema (CRM, sistema de gestión, operación) y necesita dueño allá.
   La clase cambia el tipo de decisión: construir, hacer llegar o asignar dueño. "No es de este sistema" no borra el dolor: el cliente no ve los límites entre sistemas.
4. **"En camino" lo confirma el dueño funcional, con fecha.** Un ticket respalda solo si describe exactamente lo mismo. Un "en ejecución" viejo, un "pendiente de aprobación" o un "listo para pase" no acreditan trabajo activo ni despliegue. En la pieza no van claves de ticket: va el estado, quién lo confirmó y cuándo.
5. **Palabras que piden aclaración.** "A medida", "con registro", "integrado", o un término que ya nombra otra cosa en la organización (por ejemplo, "anticipo" cuando ya existe un adelanto durante la venta), se reemplazan por lo que concretamente cambia.
6. **Anticipar la objeción del dueño y formular lo que sí se puede comprometer.** Si Tecnología no puede asegurar cuándo se resuelve una falla, el pedido se formula como fecha estimada, avisada y actualizada si cambia.

Test: leer cada mejora como si fuera el dueño del sistema. Si la primera reacción es "eso ya lo tenemos" o "¿qué sería eso?" y la respuesta no está en la slide o en el guion, falta trabajo nuestro.

---

## El cierre: decisiones para Producto

El cierre en dos columnas funciona bien: **a lo que llegamos** (lo que produjo el
trabajo, en números) y **lo que sigue para [equipo]** (lo que ese equipo tiene que
decidir). La segunda columna se escribe como decisiones, no como tareas.

Antes: *"Próximos pasos: revisar el relevamiento, analizar los escenarios, avanzar con
el diseño de las secciones."*

Después:

- *Definir si siguen el escenario recomendado o prefieren otro.*
- *Definir si las secciones de notificaciones se migran o quedan en la herramienta
  externa.*
- *Definir si este trimestre arranca el diseño de la arquitectura de información.*
- *Planificar los próximos trimestres con el ciclo completo: discovery si aplica,
  diseño e ingeniería.*

**Pedir espacio para el otro rol, sin hacer su parte.** Si el siguiente paso necesita
que otro equipo piense antes de ejecutar, la pieza lo pide de forma explícita. *"Antes
de diseñar cada sección, Product Design necesita un espacio para pensar la arquitectura
de información del nuevo admin con lo relevado."* Eso es cuidar el trabajo de Product
Design, no meterse en sus pantallas.

---

## Antes de la reunión

El consenso con Diseño, Tecnología y Producto se construye antes, no en la sala. Cada uno
aporta desde su expertise y eso se ve en la pieza (con quién se validó la
clasificación, quién revisó el modelo de roles). Si algo de lo que se presenta es
sorpresa para alguno de ellos, la reunión se va a usar para discutir eso y no para
decidir.
