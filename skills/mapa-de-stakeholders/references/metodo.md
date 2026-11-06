# Método, enumerar, calificar, priorizar, ordenar

Índice:
1. Paso 1, Enumerar
2. Paso 2, Calificar (escalas de poder e interés)
3. Paso 3, Priorizar (cuadrantes y estrategia)
4. Paso 4, Ordenar en niveles y nombrarlos
5. Tensiones y coaliciones
6. Cómo tratar cada tipo de input
7. Rúbrica de cierre

---

## 1. Paso 1, Enumerar

Barrer ancho antes de filtrar. Recorrer estas categorías en orden, porque cada una
destapa actores que las otras esconden:

- **Quién decide**: aprueba presupuesto, prioriza roadmap, puede frenar el proyecto.
- **Quién ejecuta**: hace el trabajo del día a día dentro del servicio.
- **Quién opera el canal**: administra la herramienta, el WhatsApp, el mail, la planilla
  por donde efectivamente pasa el flujo. Casi nunca está en el organigrama y casi
  siempre es el actor con más conocimiento operativo.
- **Quién recibe el servicio**: cliente final, y todos los intermediarios entre él y
  nosotros.
- **Quién provee**: proveedores, integradores, plataformas de terceros.
- **Quién condiciona sin participar**: legales, compliance, seguridad, finanzas,
  reguladores, socios accionistas.
- **Quién ya pasó por un intento parecido**: quién estuvo en un esfuerzo similar antes, cómo terminó y qué le quedó de eso. Explica resistencias que de otra forma parecen caprichos.
- **Quién quedó afuera de la conversación pero cobra la cuenta**: soporte, atención al
  cliente, la persona que arregla a mano lo que el sistema no resuelve.

Anotar roles cuando no hay nombre. "El equipo que carga las altas a mano" es una entrada
válida y se marca `[VERIFICAR]` para conseguir el nombre después.

Al terminar, revisar: si hay algún nivel del método sin ningún actor, probablemente
falte relevamiento, no que ese nivel no exista.

## 2. Paso 2, Calificar

### Poder (1 a 5), capacidad de habilitar o frenar

| Valor | Ancla |
|---|---|
| 5 | Puede cancelar o financiar el proyecto por decisión propia |
| 4 | Aprueba entregables, prioriza, tiene veto sobre su ámbito |
| 3 | Su rechazo obliga a rediseñar; no puede frenar el conjunto |
| 2 | Influye por opinión o por acceso a información |
| 1 | Se ve afectado, no tiene palanca formal |

### Interés (1 a 5), cuánto le cambia el resultado

| Valor | Ancla |
|---|---|
| 5 | Le cambia el trabajo diario o el número que le miden |
| 4 | Lo afecta de forma directa aunque no sea su prioridad |
| 3 | Le importa por proximidad con quien sí lo sufre |
| 2 | Consecuencias indirectas |
| 1 | Enterado, sin consecuencias prácticas |

**Cada nota se apoya en un dato.** "Poder 5" porque en la reunión de kickoff definió el
alcance, no porque tenga cargo de gerente. Si el dato no existe, la nota va con
`[VERIFICAR]` y se pregunta.

**Poder e interés no se promedian.** Un actor con poder 5 e interés 1 es un riesgo
distinto de uno con 3 y 3, y el promedio los vuelve iguales.

## 3. Paso 3, Priorizar

Los cuatro cuadrantes y lo que implica cada uno:

| | Interés bajo (1 a 3) | Interés alto (4 a 5) |
|---|---|---|
| **Poder alto (4 a 5)** | **Mantener conforme**, informar corto y a tiempo, no consumir su agenda, evitar la sorpresa que dispara el veto | **Colaborar de cerca**, co-construir, entrevistar primero, validar decisiones |
| **Poder bajo (1 a 3)** | **Monitorear**, chequear cada tanto, no invertir esfuerzo | **Mantener informado**, fuente clave de dolor operativo: entrevistar aunque no decida |

Dos advertencias que evitan el mapa inútil:

- Si **nadie** cae en "monitorear", no se priorizó: se listó.
- Los "mantener informado" son los que más conocen el problema real. Son la mejor
  primera entrevista aunque no sean quienes deciden.

## 4. Paso 4, Ordenar en niveles y nombrarlos

Los niveles son anillos concéntricos: el centro es quien vive dentro del servicio, y
hacia afuera baja la implicación operativa.

Estructura de partida (cuatro o cinco niveles funciona; más de seis no se lee):

1. **Núcleo**, quienes hacen o usan el servicio todos los días.
2. **Involucrados directos**, quienes lo operan, lo soportan o dependen de él.
3. **Decisores y habilitadores**, quienes aprueban, financian o condicionan.
4. **Informados**, quienes necesitan enterarse sin participar.
5. **Contexto**, externos, reguladores, socios, competencia relevante.

**Renombrar siempre según el proyecto.** El nombre del nivel tiene que decir qué hace
ese grupo en este proyecto en particular:

- Genérico: "Nivel 2, Involucrados"
- Bueno: "Operan el canal de pedidos todos los días"
- Genérico: "Nivel 3, Decisores"
- Bueno: "Habilitan presupuesto y definen el alcance del trimestre"

Cada nivel lleva además una **definición de una línea** con el criterio de pertenencia,
para que quien lo lea pueda ubicar a un actor nuevo sin preguntar.

Un actor va a un solo nivel. Si parece pertenecer a dos, casi siempre son dos roles
distintos de la misma persona: separarlos y decirlo.

## 5. Tensiones y coaliciones

Registrar explícitamente:

- **Tensiones**: dos actores que quieren cosas incompatibles. Se escribe qué quiere cada
  uno, no "hay diferencias de criterio". Ejemplo de forma correcta: "A quiere salir a
  hablar con todos los proveedores ya; B quiere trabajar solo con los tres más grandes.
  Se define en el kickoff."
- **Coaliciones**: quiénes se mueven juntos. Convencer a uno suele arrastrar al otro.
- **Puentes**: quién da acceso a quién. Se anota como próxima acción ("pedirle a X la
  intro con Y").
- **Puntos únicos de falla**: actores que son el único acceso a un dato o a un sistema.

Esto es lo que separa un mapa de una lista, y es lo primero que mira una jefatura.

## 6. Cómo tratar cada tipo de input

**Transcripciones y notas crudas.** Barrer los nombres propios y los roles mencionados,
incluso los de paso. Anotar quién habla de quién y en qué términos: es la mejor señal
de poder real. Distinguir el nombre citado del cargo inferido, el cargo casi nunca se
dice en una reunión, y ahí es donde se inventa.

**Documentos .md del repo.** Reutilizar los actores ya mapeados en discoveries previos
en vez de reconstruirlos, y traer su fuente original. Si el documento tiene fecha, la
antigüedad importa: la gente cambia de rol, y un mapa viejo hereda cargos muertos.
Marcar `[VERIFICAR]` en todo lo que venga de un documento más viejo que `UMBRAL_VIGENCIA` (ver `certeza-y-muestras.md`).

**Nombres dictados de memoria.** Es el input más rápido y el más frágil: apellidos
incompletos, cargos aproximados. Recibirlos tal cual, no completarlos, y devolver la
lista de faltantes al final.

**Mezcla de todo.** Consolidar por persona, no por fuente: un actor, una entrada, con
todas sus fuentes listadas. Cuando dos fuentes se contradicen (dos cargos distintos
para la misma persona), no elegir en silencio: mostrar ambas versiones y preguntar.

## 7. Rúbrica de cierre

Antes de dar el mapa por entregado:

- [ ] Todo actor tiene fuente, o `[VERIFICAR]` visible.
- [ ] Los `[VERIFICAR]` se presentaron como preguntas concretas y el usuario respondió.
- [ ] Los niveles tienen nombre propio del proyecto y definición de una línea.
- [ ] Poder e interés tienen la escala escrita en la pieza.
- [ ] Hay al menos un actor en cada cuadrante, o se explica por qué no.
- [ ] Están las tensiones, con qué quiere cada parte.
- [ ] Cada actor prioritario tiene próxima acción con verbo ("entrevistar", "invitar",
      "informar"), y los prioritarios tienen orden de entrevista.
- [ ] Hay roles y áreas, no solo personas.
- [ ] La entrega incluye la lectura corta: quién falta, dónde está la tensión, por quién
      empezar.
