# De la desgrabación al blueprint

Cómo se pasa de material crudo (entrevistas, notas de campo, manuales, tickets)
a los momentos y las tarjetas, sin inventar y sin perder lo que el material sí
dice.

---

## 1. Qué material tenés y qué le falta

Un blueprint completo se apoya en cinco perspectivas:

1. **Clientes o usuarios**: qué intentan hacer, qué esperan, dónde se traban.
2. **Frontstage**: quienes atienden. Saben lo que el cliente no dice.
3. **Backstage**: quienes hacen el trabajo invisible. Son la fuente principal de
   los carriles BS y PS, y casi siempre el material que falta.
4. **Soporte y terceros**: sistemas, proveedores, áreas que habilitan.
5. **Negocio**: qué se mide, qué restricciones hay, qué se puede cambiar.

Antes de escribir, clasificá el material por perspectiva y anotá cuáles están
vacías. Esa lista va en la entrega, y cada hueco grande se convierte en uno o dos
hallazgos `pregunta`. Un blueprint hecho solo con entrevistas a clientes tiene
frontstage y backstage inventados: decilo antes de que lo descubra otro.

Fuentes internas que suelen estar disponibles y nadie mira: logs de atención,
manuales de capacitación, documentación de procesos, auditorías, encuestas a
empleados, tickets, analítica digital.

---

## 2. Primera pasada: marcar, no resumir

Leé el material entero una vez sin escribir nada. En la segunda pasada, marcá
cada fragmento con una de estas etiquetas:

- **acción del cliente**: algo que la persona hace o espera;
- **acción de la organización**: quién la hace y si el cliente la ve;
- **cosa**: documento, pantalla, mail, objeto, lugar;
- **quiebre**: algo que falla, demora, se repite o hace abandonar;
- **número**: cualquier magnitud, aunque sea aproximada;
- **frase**: una cita que valga textual;
- **hueco**: algo que nadie supo contestar.

Las cinco primeras alimentan carriles; las tres últimas alimentan hallazgos.
Todavía no decidas el orden.

---

## 3. Segunda pasada: la secuencia

Ordená las acciones del cliente en el tiempo y agrupalas en momentos, según los
cortes de `references/criterio.md`. Esta secuencia es el esqueleto: si está mal,
todo lo demás está mal.

Dos trampas frecuentes:

- **El orden del manual no es el orden real.** Si la documentación dice que el
  cliente firma antes de pagar y las entrevistas dicen al revés, mandá lo que
  dicen las entrevistas y dejá una `nota` con la diferencia. Esa diferencia suele
  ser el hallazgo más valioso del blueprint.
- **Los relatos vienen sin esperas.** Nadie narra el tiempo muerto. Las esperas
  se detectan por el salto: si alguien dice "mandé el mail y a la semana me
  llamaron", ahí hay una espera de una semana que nadie contó.

---

## 4. Tercera pasada: bajar los carriles

Para cada momento, preguntá en este orden:

1. ¿Qué hace el cliente? (CJ)
2. ¿Quién de la organización está presente y qué hace? (FS)
3. ¿Qué pasa detrás para que eso sea posible? (BS)
4. ¿Qué tiene que haber existido antes? (PS)
5. ¿Qué se lleva o qué ve el cliente? (EV)

Si en el paso 3 te quedás sin material, no rellenes. Poné lo que sepas, dejá el
resto vacío y anotá la `pregunta`. Un backstage escrito de memoria es el motivo
más común por el que un blueprint pierde autoridad en la primera reunión.

---

## 5. Contradicciones

Cuando dos fuentes dicen cosas distintas, hay tres casos:

- **Distinto rol, distinta percepción.** El mozo dice que avisa el tiempo de
  espera y el cliente dice que nunca le avisaron. Las dos cosas van: la acción en
  frontstage y el dolor en hallazgos, con la cita del cliente al lado. Esta
  brecha entre lo que la organización cree que entrega y lo que el cliente
  recibe es material de primera.
- **Distinto caso.** Si dependen de una condición ("cuando es fin de semana"),
  probablemente sea una decisión con dos ramas, o dos blueprints si cambia más
  de un tercio.
- **Error de alguno.** Si una fuente es claramente más confiable, usala y dejá
  `nota`. Si no podés decidir, va `pregunta`.

Nunca promedies dos versiones en una tarjeta intermedia que no dijo nadie.

---

## 6. Escribir las tarjetas

- Verbo en presente y tercera persona, sujeto en `actor`, una acción por tarjeta:
  "arregla con el mozo dónde sentarse", "escribe la reseña".
- Si dos acciones van una después de la otra, son dos columnas, no dos tarjetas
  apiladas.
- En CJ, las palabras del cliente. En FS y BS, las palabras de quien lo hace.
- Específico antes que elegante: "verificar el CUIT en el padrón" antes que
  "hacer las validaciones".
- Sin adjetivos de valor. "Esperar respuesta" es la acción; que la espera sea
  eterna es un dolor.
- Si la tarjeta necesita explicación, la explicación es una `nota`.
- Cuando el relato salta en el tiempo ("mandé el mail y a la semana me
  llamaron"), ahí hay una espera: barra en el journey con el `span` de las
  columnas que ocupa el trabajo interno.

### Citas

Textuales, sin corregir, sin nombre propio, sin comillas dentro del texto.
Elegí las que prueban un dolor o desmienten un supuesto. Dos o tres citas bien
puestas sostienen un blueprint entero frente a un stakeholder escéptico.

### Números

Van como `dato`, con la fuente cuando se pueda reconstruir. Si el número es una
estimación de alguien y no un dato medido, escribilo así: "operaciones estima
que son 3 de cada 10". La diferencia entre un dato y una impresión importa
cuando alguien decida sobre esto.

---

## 7. Lo que nunca se hace

- Completar un carril porque queda feo vacío.
- Convertir una hipótesis en tarjeta sin marcarla.
- Escribir en el journey lo que hace el sistema.
- Pasar el vocabulario interno al carril del cliente. El cliente no dice
  "originación", dice "pedí el préstamo".
- Borrar lo que contradice la hipótesis del proyecto.
