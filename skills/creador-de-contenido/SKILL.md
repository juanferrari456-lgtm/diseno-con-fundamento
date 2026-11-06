---
name: "creador-de-contenido"
description: "Lleva el contenido de entregables de diseño de servicios, research y mejora de procesos (discoveries, readouts de research, hallazgos, journeys, to be, informes de testeo, relevamientos, escenarios y recomendaciones, oportunidades y próximos pasos) al estándar que resiste a un stakeholder senior. Usar para escribir, revisar, criticar o recortar ese contenido, ante preguntas como \"¿esto está listo para presentar?\" o \"me quedó genérico\", para armar la presentación de resultados o una recomendación en una página, y para procesar una devolución de un stakeholder sobre un entregable. El armado visual del .pptx es de creador-de-ppt."
---

# Contenido grado A

Esta skill es sobre **qué dice** un entregable, no sobre cómo se ve. Para el sistema visual y el .pptx está `creador-de-ppt`; se usan juntas.

El estándar sale de devoluciones reales de liderazgo sobre un discovery sólido: el trabajo estaba bien hecho, pero el entregable no lo demostraba. Ese es el riesgo que esta skill ataca. No que el research sea flojo, sino que la pieza no le haga justicia.

Principios del paquete en `references/principios.md`.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| El objetivo del entregable nombra una solución | `encuadre-del-problema`, preguntas 1 y 6 |
| Un número no tiene período, fuente o intervalo | `evidencia` |
| Las oportunidades no cuelgan de un dolor | `arbol-de-oportunidades` |
| El contenido está y falta el armado visual | `creador-de-ppt` |

Según cómo llega el pedido (principio P1): con material completo, proponer los mensajes y esperar el ok; con huecos, preguntar primero quién decide y qué tiene que decidir; para alguien que arranca, explicar en una línea la regla que ordena todo y trabajar los mensajes juntos.

## Por qué importa ahora

Cuando cualquiera produce una interfaz, un mapeo o un informe en minutos, el valor del rol está en haber decidido qué valía la pena hacer. El riesgo pasa del *cómo lo hacemos* al *qué vale la pena hacer*, y deja tres deudas a la vista: **accountability** (asumir una posición), **juicio** (hacer explícito qué consideramos bueno) e **impacto** (mostrar qué cambió gracias a nuestras decisiones). Los cortes 6 y 7 existen para eso.

## Hasta dónde llega Service Design

Hasta el borde de la decisión, sin tomarla. La pieza le deja a Producto decisiones por tomar, no tareas por hacer ni material por entender. Eso es ownership sin ser PM: Service Design garantiza que la experiencia end to end funcione y sea consistente, frontstage y backstage; el PM toma eso para gestionar el delivery y los recursos técnicos; Product Design diseña las pantallas.

Tres consecuencias para el contenido:

- **Lo que afecta la experiencia se levanta aunque "sea de otro".** Roles, permisos, exposición de datos o un proceso sin dueño se suman al análisis y se traducen a qué hay que hacer para cuidar la experiencia (corte 11).
- **Cuidar el trabajo del otro rol es pedir el espacio que necesita, no hacer su parte.** Pedir tiempo para que Product Design piense la arquitectura de información antes de diseñar sección por sección, en lugar de proponer pantallas.
- **La presentación no es una sorpresa para nadie.** Diseño, Tecnología y Producto vieron el material y aportaron desde su expertise antes de la reunión, y la pieza dice con quién se validó cada cosa. Con el consenso previo, la reunión es para decidir y no para discutir.

## La regla que ordena todo

> Si el análisis existe pero no está en el entregable, para quien lo recibe no existe.

"Eso está en el anexo, en el Excel o en la otra presentación" no es una defensa, es el diagnóstico. El entregable trae al frente una muestra jerarquizada y enlaza el resto.

El espejo: si el dato no existe porque no se midió, se dice en la pieza, con qué no se cuantificó, por qué, quién lo va a medir y cuándo. Un vacío declarado es rigor; uno disimulado con adjetivos es lo que dispara "esto parece consultora".

La vara: un buen entregable no se mide por lo clara que fue la explicación, sino por lo fácil que le resulta al stakeholder decir "sí, vamos por acá". Si se entendió perfecto y nadie sale pudiendo decidir, no cumplió.

## Cómo usarla

- **Escribir contenido nuevo:** primero proponer los 2 o 3 mensajes que el stakeholder se lleva (corte 9), cada uno con la duda suya que responde, y esperar el ok. Elegir los mensajes es la decisión de criterio de la pieza: si están mal, todo lo que se escriba después se rehace. Con el ok, armarlo desde los cortes (detalle en `references/`) y pasar `references/rubrica.md` antes de darlo por cerrado.
- **Revisar contenido existente:** aplicar `references/rubrica.md` sección por sección y devolver hallazgo más reescritura concreta. "Esto es genérico" no ayuda; la versión reescrita sí.
- **Procesar una devolución:** clasificar cada comentario con `references/rubrica.md` § "Cómo procesar una devolución" antes de contestar. Hay tres tipos y se responden distinto.

Leer solo la referencia que el pedido necesita: para un objetivo, `principios-de-contenido.md`; para un testeo, `evaluacion-y-testeo.md`; para recortar un deck largo, `curaduria-y-narrativa.md`; para escenarios, recomendación, alcance, gobernanza o el cierre para Producto, `recomendacion-y-alcance.md`.

## Los once cortes de calidad

Cada corte trae la señal más común de que falta.

1. **Del proceso al valor.** El objetivo es la pregunta de negocio que respondemos y qué se decide con eso, no lo que hicimos ("mapear", "relevar"). La metodología se cuenta por lo que habilitó descubrir. Si el objetivo nombra una solución ("implementar X", "hacer una encuesta"), es una funcionalidad disfrazada: reescribirlo con `encuadre-del-problema` (preguntas 1 y 6). *Señales:* objetivo redactado como tarea; objetivo que nombra la solución y no dice para quién es el problema. Detalle en `references/principios-de-contenido.md`.

2. **De la descripción al accionable.** Un hallazgo dice qué está roto, dónde, quién lo sufre y qué implica si sigue así. Nombrar un concepto ("manualidad", "workflow") no es un hallazgo. *Señales:* cuantificadores vagos ("ciertos equipos", "algunas tareas"); insights que no responden el "¿y ahora?".

3. **Del problema al impacto.** Todo dolor se cuantifica o se declara sin cuantificar, y se atribuye a un actor concreto. Toda mejora lleva hipótesis de impacto contra el baseline: de qué número partimos, a cuánto podría llegar, con qué métrica se verifica. *Señales:* falta el costo de no hacer nada; criticidades Alta/Media/Baja sin el criterio escrito en la pieza; hallazgos todos del mismo peso, sin severidad cruzada con frecuencia.

4. **De la afirmación a la evidencia.** El stakeholder tiene que ver, no creernos: el recorrido del dato, la cita textual, el criterio de criticidad. Si el registro existe, se muestra. Si en la narración aparece un "ya lo vamos a ver", ese slide falta. Cada hallazgo declara cuántas fuentes lo sostienen (indicio, patrón o evidencia sólida) y una diferencia entre grupos se afirma solo si no se confunde con el ruido. El artefacto se elige por quién lo va a usar, no por costumbre: un relevamiento de veinte módulos se recorre mejor en un tablero navegable que en veinte flujos. Mostrar en lugar de contar baja el esfuerzo de quien decide: no tiene que imaginarse la estructura ni cómo se clasificó el alcance. *Señales:* mejoras de interfaz o comunicación descritas y no mostradas; un hallazgo de una sola fuente presentado con el mismo peso que uno triangulado; "bajó 7 puntos" sin decir si es real; un artefacto que el destinatario no va a abrir.

5. **Del wishlist al plan.** Cada oportunidad cuelga de un dolor, con criterio de priorización visible. Los próximos pasos llevan dueño, plazo y separación entre quick wins y mediano plazo, e incluyen lo que el otro equipo necesita decidir. Un MVP va con viabilidad, dependencias, owners, restricciones y cruce con el backlog de Producto y Operaciones. El arco evolutivo va explícito: "no llegamos a X por esto, pero para tal fecha tenemos Z, que habilita tal cosa". Cada mejora, puntual o estratégica, aguanta la repregunta del dueño del sistema: "¿eso no existe ya?" y "¿qué quieren decir exactamente?". Por eso se baja del título del pedido al problema concreto, se clasifica con el dueño (no existe, existe y no lo saben, existe y no les sirve, no es de este sistema) y lo "en camino" se respalda con quien lo confirmó, no con una clave de ticket. Detalle en `references/recomendacion-y-alcance.md`, "La repregunta del dueño". *Señales:* oportunidades sueltas que no se rastrean a un dolor; una mejora con el nombre del pedido ("invitaciones", "reportes") y no el problema que hay detrás; "en camino" sostenido solo por un ticket.

6. **De la opción a la posición.** Mostrar opciones no reemplaza una decisión. La fuerza de la posición acompaña a la evidencia: con evidencia sólida se recomienda, con un indicio se propone como hipótesis a validar y se dice cómo. Las palancas van rankeadas con la recomendada marcada y su trade-off en la misma línea, y el razonamiento queda escrito: hecho, significado, consecuencia, decisión. Devolver el problema ordenado para que decida el otro no es neutralidad: es la ejecución usada como escondite. Recomendar no es imponer: la pieza le pide la decisión, de forma explícita, a quien decide (qué tiene que decidir, quién y para cuándo). Tres hallazgos sueltos que llegan como tres pedidos suelen ser un problema con tres palancas y un target. La recomendada se presenta junto a las alternativas que no elegimos, cada una con pros, contras y secuencia, para que quien decide vea el costo beneficio de cada camino; y la recomendada muestra sus propias contras. Hacer visible el trade off de la propia propuesta es lo que hace que la próxima vez nos crean. *Señales:* una sola opción presentada como la única posible; una recomendada sin contras; "sugerido por diseño" sin el criterio al lado. Detalle en `references/recomendacion-y-alcance.md`.

7. **Del número a la cadena.** Un dashboard describe; una cadena explica. Todo número se conecta con lo que lo produjo: inversión, capacidad, proceso, experiencia, resultado. *Señal:* "el CSAT bajó 6 puntos, lo monitoreamos".

8. **De la observación a la evaluación.** La pregunta de investigación se baja a tres a cinco hipótesis testeables antes del campo; sin ellas ningún resultado se lee como confirmado, refutado o nuevo. En un testeo se declaran atributos y criterio de aprobado, y cada hallazgo va junto a la tarea y el prototipo que lo generaron, porque sin eso Producto no puede juzgar su validez. Detalle en `references/evaluacion-y-testeo.md`.

9. **Del volcado a la curaduría.** El entregable compite contra la atención disponible. Se abre con el mensaje que mueve la aguja, claro y corto, antes del contexto y del método. Antes de cerrar: cuáles son los dos o tres mensajes que el stakeholder se lleva, qué duda suya responde cada uno, y qué se recorta porque no sostiene ninguno. Dentro de cada slide, jerarquía: qué es lo más importante de lo que estoy viendo. Ejes o pilares se presentan con su peso y su relación; si son interdependientes, se muestra el circuito. Si conviven clusters e insights, el cluster documenta y el insight empuja una acción. Para que los mensajes se recuerden, elegir dos o tres recursos de relato (apertura que desmonta una creencia, voz externa, falso final, pantalla anotada, árbol en apertura y cierre). Detalle en `references/curaduria-y-narrativa.md` y `references/recursos-de-relato.md`.

10. **Del mapeo al alcance.** Un relevamiento no se queda en cómo funciona hoy: termina en una decisión de alcance. Qué se usa y qué no, qué se mantiene, qué se mejora, qué se construye nuevo, qué no se hace y qué queda por definir, con el número de cada grupo, el porqué de lo que se deja afuera y quién decide lo pendiente. *Señal:* un mapeo completo y prolijo del que no sale nada que se deje de hacer. Detalle en `references/recomendacion-y-alcance.md`.

11. **De la pantalla a la operación sostenible.** La experiencia incluye el backstage que la sostiene. Si la solución cambia quién puede hacer qué, la pieza propone la gobernanza: roles, niveles de permiso, qué datos ve cada uno, dueño de cada proceso. Es service readiness: que la operación funcione y sea segura el día que sale, no solo que estén las pantallas. *Señal:* roles y permisos tratados como detalle técnico para después, o como una lista de pantallas. Detalle en `references/recomendacion-y-alcance.md`.

## Lenguaje

Escribir en el idioma del stakeholder, no en el de la disciplina. "Carga cognitiva", "blueprint as-is" o "reduce fricción" obligan al otro a aprender nuestra jerga. "Experiencia actual" y "experiencia ideal" dicen lo mismo sin poner a la herramienta de protagonista. Un to be hecho de adjetivos ("optimizado", "escalable") es un deseo: tiene que decir qué cambia, qué habilita y cómo se testea.

En todo lo que se escriba para el entregable, no usar el punto medio ni la raya larga (em dash o en dash): delatan texto hecho con IA. Usar "|", "-" o comas.

## Dos formatos de cierre

**Presentación de resultados.** Respuesta primero: lo que el proyecto vino a responder, en los primeros dos minutos, y después los dos a cuatro hallazgos que la sostienen, cada uno con su mejor evidencia. Citas textuales de participantes reales cargan el argumento, con su código y sin recortarlas para que digan más. La sección "lo que no encontramos" (creencias que la investigación no sostuvo, preguntas abiertas, segmentos sin estudiar) va en el cuerpo, no en el anexo: es lo que hace creíble el resto. Anticipar las dos preguntas más difíciles que va a hacer la sala y dejar plantadas las respuestas. Base de evidencia (quiénes, cuántos, cuándo) en el anexo.

**Recomendación en una página.** Para quien no estuvo en ninguna sesión y la va a reenviar. Primera oración: qué hacer, concreto. Después: en qué se apoya (de tres a cinco evidencias, una línea cada una con su fuente), qué sigue siendo supuesto y cómo se probaría, las primeras dos semanas (acciones, dueños, primer chequeo) y la condición para frenar: la señal que debería parar la próxima etapa, escrita ahora, cuando nadie defiende costos hundidos. La recomendación nunca va más lejos que la evidencia: un "esto no" bien fundado también es un buen cierre.

## Confidencialidad

Lo sensible (nombres, evaluación de roles, rentabilidad) no se diluye hasta que no diga nada. Se arman dos versiones declaradas: una restringida con el detalle y una amplia que enuncia la conclusión sin exponer a personas, diciendo que el detalle existe y con quién se revisa. Un hallazgo suavizado hasta la vaguedad se lee como falta de trabajo, no como discreción.

## Referencias

- `references/principios-de-contenido.md`: cortes 1 a 5 con ejemplos antes y después.
- `references/evaluacion-y-testeo.md`: corte 8, hipótesis, criterio de aprobado, severidad, momento de decisión.
- `references/curaduria-y-narrativa.md`: corte 9, jerarquía, recorte, clusters e insights, lenguaje, cierre.
- `references/recursos-de-relato.md`: recursos para contar (cuándo sí, cuándo no y con qué slide se arma cada uno).
- `references/recomendacion-y-alcance.md`: cortes 6, 10 y 11 en detalle, apertura, escenarios con la recomendada y sus contras, decisión de alcance, gobernanza y cierre con decisiones para Producto.
- `references/rubrica.md`: auditoría previa a presentar, preguntas de un stakeholder senior y cómo procesar una devolución.