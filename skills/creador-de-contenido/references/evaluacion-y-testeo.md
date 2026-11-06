# Corte 8 | De la observación a la evaluación

Aplica a todo entregable que reporte un testeo, una validación o cualquier instancia
donde se fue a medir algo, no solo a observarlo. La diferencia no es de método, es de
qué puede hacer el otro con el resultado.

> Observar es contar lo que vimos. Evaluar es contar lo que fuimos a medir, con qué
> criterio, y si pasó o no pasó.

## Hipótesis testeables

Una pregunta de investigación no se testea. Se testea una afirmación que puede resultar
falsa. La pregunta se baja a entre tres y cinco hipótesis escritas **antes** de salir, y
se escriben de forma que el resultado sea leíble como confirmado, refutado o nuevo.

Antes: *"Queremos entender cómo la empresa cliente usa el portal."*

Después:
- *"H1: la empresa cliente no encuentra el reporte de asistencia de su personal sin ayuda de comercial."*
- *"H2: la empresa cliente interpreta el resumen mensual como factura, no como estado de uso."*
- *"H3: las empresas que vienen de otro gimnasio abandonan la carga de su personal en
  el paso de planes."*

Cada una se puede confirmar o tirar abajo con lo que pase en la sesión. La pregunta
original, no.

Sin hipótesis declaradas, el entregable solo puede contar observaciones, y el stakeholder
no tiene cómo actualizar lo que creía. Contrastar contra supuestos ajenos es más potente
que un hallazgo nuevo: al que asumía lo contrario, el hallazgo le cambia una decisión.

## Atributos de calidad y criterio de aprobado

Un test maduro declara qué atributos evalúa, por qué esos, y cómo se sabe si pasó o no
pasó. Eso se escribe antes y se muestra en la pieza. Ejemplos de atributo: tasa de
acierto en la tarea sin ayuda, cantidad de intentos, comprensión del estado del sistema,
recuperación después del error, confianza declarada al terminar.

Lo que no sirve: contar lo que la gente dijo en la sesión como si eso fuera el resultado
del test. Eso es observación con formato de evaluación.

## La tarea a la vista

**No negociable:** cada hallazgo se muestra junto a la tarea que lo generó, con lo que
hay hoy en producción y el prototipo que se testeó, a la vista.

"Ejecución de tareas puntuales con el prototipo" no es información. Producto no puede
juzgar la validez de un hallazgo si no ve la consigna que lo produjo, porque la mitad de
los hallazgos de usabilidad dependen de cómo estaba formulada la tarea.

Estructura que funciona por hallazgo:

| Qué mostrar | Ejemplo |
|---|---|
| La tarea, textual | "Cargá una tarifa promocional para el segundo lote" |
| Qué hay hoy en producción | captura de la pantalla actual |
| Qué se testeó | captura del prototipo |
| Resultado | 4 de 9 completaron sin ayuda |
| Qué pasó | dónde se trabaron, con cita o video corto |
| Severidad y frecuencia | ver más abajo |

## Métrica de acierto, siempre y del mismo modo

Si en un slide dice "5 de 9" y en el siguiente no dice nada, el lector no sabe si el
segundo hallazgo fue universal o anecdótico. La métrica de aciertos va en todos los
hallazgos o en ninguno, con el mismo formato.

Complementos que suben mucho la credibilidad y cuestan poco: videos cortos del momento
exacto, y el contraste **"esperábamos esto y pasó esto"**, que es la forma más
económica de mostrar que había hipótesis.

## Severidad de los hallazgos

Un tablero de banderitas todas del mismo color no es una priorización. Si todos los
hallazgos pesan igual, el equipo que recibe no puede decidir y se va con parálisis.

Mínimo: una escala de severidad cruzada con frecuencia, con el criterio escrito en la
pieza.

| | Baja frecuencia | Alta frecuencia |
|---|---|---|
| **Bloquea la tarea** | Revisar | Arreglar ya |
| **Genera error recuperable** | Backlog | Revisar |
| **Molesta sin impedir** | No hacer | Backlog |

El criterio puede ser otro. Lo que no puede faltar es que esté escrito y que se sepa
quién lo validó.

## El momento de decision-making

Todo reporte de evaluación cierra separando dos listas:

- **Lo que ya podemos decidir hoy**, con la evidencia que lo sostiene.
- **Lo que necesitamos seguir investigando**, con qué haría falta para cerrarlo.

Es el antídoto contra "mucha info, no sé por dónde empezar". Sin esa separación, incluso
un buen testeo termina como material de consulta en lugar de insumo de decisión.

## Conectar el hallazgo con el negocio

"El usuario se confunde con el porcentaje cuando hay adicionales" no le dice nada a
Producto hasta que se le agrega qué produce eso: caída de conversión en el carrito,
aumento de cancelaciones, contactos a soporte. Cuando no hay dato cuantitativo, va la
hipótesis de impacto declarada como hipótesis:

> *"Estimamos que este punto contribuye al abandono en el paso de pago. No lo tenemos
> medido; se puede verificar con el porcentaje de carritos abandonados en ese paso, que
> hoy no está instrumentado."*
