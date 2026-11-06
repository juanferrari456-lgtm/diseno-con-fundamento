# El criterio: decisiones de service design antes del JSON

Esta referencia es para los casos que el SKILL.md resume en una línea. Leela
cuando el servicio sea grande, cuando el material se contradiga, o cuando el
blueprint tenga que resistir una reunión con stakeholders.

---

## 1. Encuadre

Tres preguntas, en este orden, antes de tocar el archivo.

### Alcance: ¿qué escenario vamos a mapear?

Un blueprint no representa un servicio entero, representa **un escenario de un
actor**. "La experiencia del cliente en el banco" no es un alcance; "un dueño de
pyme abre su primera cuenta comercial" sí lo es.

Dos zooms posibles:

| | Zoom in | Zoom out |
|---|---|---|
| Qué es | cómo se entrega una parte puntual del servicio, dos o tres puntos de contacto | la experiencia de punta a punta |
| Para qué | entrar en detalle que a alto nivel se pierde | romper silos entre áreas, entender el servicio completo |
| Cuándo | cuando la complejidad del servicio entero abruma | cuando el servicio cruza muchos canales y áreas |

Para dimensionar el esfuerzo:

- **Chico**: dos puntos de contacto o menos, el área tiene control sobre ellos,
  ya existe research, se puede impactar en los próximos sprints.
- **Mediano**: hasta cinco puntos de contacto, equipo multidisciplinario, hay
  research con lugar para sumar más, el artefacto es para stakeholders.
- **Grande**: experiencia completa, esfuerzo multi área, plan de research
  propio, varias iteraciones, con métricas.

Criterios útiles para elegir entre varios blueprints candidatos: que el problema
aparezca en más del 40% de las entrevistas, que el área tenga capacidad de
cambiar algo, que haya una decisión esperando el artefacto.

El objetivo de granularidad es **8 a 12 acciones del cliente**. Es la medida que
hace que el board se lea y que la conversación sea posible. Las columnas totales
pueden ser bastantes más, porque cada tarea interna encadenada abre la suya:
hasta veinte se sigue leyendo, arriba de treinta no.

### Estado: ¿actual o futuro?

| | As-is | To-be |
|---|---|---|
| Qué muestra | la estructura real del servicio hoy, desde el cliente y desde quien lo presta | el estado ideal o el servicio rediseñado |
| Para qué | documentar, encontrar quiebres y redundancias, construir entendimiento compartido | alinear áreas hacia una meta común, fijar el estándar de éxito, prototipar la operación |

Nunca en el mismo archivo. El to-be se construye a partir del as-is y el valor
está en poder poner los dos al lado.

### Fidelidad y momento del proceso

Baja fidelidad para co crear (post its, taller). Media para trabajar asincrónico
(planilla). Alta para circular y decidir (FigJam, Figma). Este plugin es para el
tercer momento, pero el contenido tiene que haber pasado por los dos primeros: si
nadie discutió el blueprint antes de dibujarlo, lo que sale es una hipótesis
prolija.

Prioridad siempre: **primero el contenido, después el diseño visual**.

---

## 2. Cómo se decide un momento

Un momento es una unidad de intención del cliente, no una tarea del sistema.

Cortá cuando:

- cambia lo que el cliente quiere lograr;
- cambia el canal (mostrador, app, teléfono, mail);
- cambia quién atiende: cada traspaso es un candidato a momento y a dolor;
- aparece una espera relevante;
- hay un punto sin retorno: se firma, se paga, se envía.

No cortes el journey cuando:

- el sistema hace varios llamados para una sola cosa;
- la persona repite lo mismo en otra pantalla.

Ojo con una confusión frecuente: que el cliente no cambie de actividad no
significa que el blueprint no avance. Si la organización encadena cinco tareas
mientras el cliente espera, eso son cinco columnas con una sola barra de espera
arriba. La columna es la unidad de tiempo del servicio, no solo del cliente.

### Momentos de la verdad

Uno o dos por blueprint. Son los momentos donde la percepción de la marca puede
cambiar significativamente y donde el cliente tiene más expectativa o más carga
emocional. Casi siempre son: el primer contacto real, el momento de pagar, el
momento del error, y el cierre.

El spec `bp/2` no tiene campo propio para marcarlos. La convención es un hallazgo
`nota` que diga por qué ese momento define la relación, con el `ref` apuntando a
la tarjeta del journey. Si el equipo decide que necesita marcarlos visualmente,
eso es una extensión del esquema para conversar, no una micro sintaxis dentro del
texto de la tarjeta.

### Puntos de falla

Son los momentos donde el servicio se rompe, no donde molesta. Se reconocen
porque el cliente abandona, repite el paso, o tiene que llamar para destrabar.
Van como `dolor` con id, y si el paso es un camino no feliz, la tarjeta lleva
`unhappy`. Priorizarlos es la parte del taller que produce decisiones, así que el
blueprint tiene que dejarlos evidentes.

---

## 3. Backstage o soporte, resuelto

La pregunta que resuelve casi todo: **¿esto empieza por este caso, o ya venía
pasando?**

Backstage sostiene una acción de frontstage y es secuencial: pasa por este
cliente, en este momento. Soporte habilita el backstage, muchas veces lo hace un
tercero o una plataforma, y ocurre en otro tiempo.

- El analista revisa esta carpeta porque este cliente aplicó: backstage.
- El motor de scoring existe y se actualiza todos los meses: soporte.
- Compras cerró el contrato con el courier el trimestre pasado: soporte.
- El courier retira este paquete hoy: backstage, o frontstage si el cliente lo
  ve y cree que es parte de la empresa.

---

## 4. Capas secundarias, cuándo sí

Cada capa compite con la legibilidad. Sumá solo las que el foco pide.

**Tiempo.** Cuando la duración es parte del problema. En rango y con unidad. El
salto de escala entre pasos (de minutos a días) es en sí mismo un hallazgo.

**Evidencia.** Es la capa más subestimada. Poné evidencia en todos los momentos
con contacto: es lo que vuelve tangible un servicio intangible y lo que permite
que el taller discuta cosas concretas. Si en un momento de contacto no hay
ninguna evidencia, casi siempre falta relevar, o el hallazgo es que el cliente no
se lleva nada.

**Métricas.** Tres familias: descriptivas (cuánto, cuándo, por qué canal), de
percepción (satisfacción de cliente y de empleado), de resultado (abandono,
costo, rotación). Van como `dato` en el momento que miden.

**Regulaciones.** Como `nota`. Definen qué no se puede tocar y sirven de línea
de base para el rediseño.

**Emoción.** No va en el blueprint. Va en el journey map. Si una emoción explica
una falla del servicio, entra como `cita` o como `dolor`.

---

## 5. Rúbrica: diez preguntas antes de entregar

`scripts/revisar.js` evalúa la mayoría de forma automática. Las que no se pueden
automatizar quedan a tu criterio.

| # | Pregunta | Dónde se ve |
|---|---|---|
| 1 | ¿Tiene título y actor principal claros? | `meta.titulo`, `meta.subtitulo` |
| 2 | ¿Identifica el escenario específico que se mapea? | `meta.subtitulo`, `meta.variante` |
| 3 | ¿Documenta fases y acciones del cliente? | `fases`, carril CJ |
| 4 | ¿Cubre frontstage, backstage y soporte? | carriles FS, BS, PS |
| 5 | ¿Es legible? | cantidad de pasos, largo de tarjetas |
| 6 | ¿Se entiende rápido? | tarjetas por celda, conexiones |
| 7 | ¿Marca dependencias o momentos críticos? | `conexiones`, hallazgos `nota` |
| 8 | ¿Declara la evidencia en cada columna con contacto? | carril EV |
| 9 | ¿Se sabe quién es responsable de cada acción? | `actor` en FS y BS |
| 10 | ¿Propone algo para optimizar el servicio? | hallazgos `oportunidad` |

Un punto por sí. Ocho es aceptable para un taller. Diez es para circular fuera
del equipo.

---

## 6. Qué pasa después del blueprint

El blueprint no es el final. Es la pieza del medio entre el journey y el
roadmap. Cuando entregues, dejá el camino señalado:

1. blueprint as-is con hallazgos priorizados;
2. ideación con los stakeholders sobre los dolores con id, pesando esfuerzo y
   retorno;
3. prototipo de las soluciones y blueprint to-be;
4. implementación y medición.

Para pesar el impacto de un cambio: primero asigná costo a cada intercambio de
valor (tiempo, materiales, esfuerzo de gente, clientes perdidos), después
calculá escala (cuántas veces pasa por mes, cuánto dura en el tiempo). "Bajar 200
llamados por mes por el costo de cada llamado" es un argumento; "mejorar la
experiencia" no lo es.
