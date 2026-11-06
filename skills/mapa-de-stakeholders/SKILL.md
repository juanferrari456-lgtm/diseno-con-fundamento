---
name: mapa-de-stakeholders
description: "Arma mapas de stakeholders (partes interesadas) para proyectos de diseño de servicios, design thinking o mejora de procesos: enumera actores, los califica por poder e interés con evidencia trazable, registra qué espera y qué teme cada uno, los prioriza y los ordena en niveles con nombre propio. Entrega en FigJam si hay conector de Figma, o como tabla descargable (.xlsx y .csv). Usar siempre que se pida un stakeholder map, mapa de actores, matriz poder e interés, mapa de involucrados o ecosistema de personas, y ante pedidos como '¿quiénes son los involucrados?', '¿con quién tengo que hablar?', '¿a quién entrevisto primero?', 'ordename quién es quién', 'armá el mapa para el kickoff', 'hay política alrededor de esto', o cuando llega una transcripción, un mail o una lista de nombres y hay que ordenar quién influye, quién decide, quién frena y quién se ve afectado."
---

# Mapa de stakeholders

Identifica y ordena a las personas, roles, áreas y entidades que influyen en el proyecto o se ven afectadas por él, con su poder, su interés y su relación con la decisión. Sirve para responder tres preguntas operativas:

1. ¿Con quién hay que colaborar para que esto salga?
2. ¿A quién hay que informar y a quién hay que gestionarle expectativas?
3. ¿A quién se entrevista primero y qué se le pregunta?

Si el mapa no cambia a quién se le manda el próximo mail, no está terminado.

Principios del paquete en `references/principios.md`.

## Cuándo usarla y cuándo no

- **Sí:** al arrancar un proyecto, antes de un kickoff, antes de planificar entrevistas, cuando aparece gente nueva en una entrevista o cuando un proyecto se traba y no se sabe quién lo frena.
- **No:** para un organigrama (el mapa se ordena por relación con la decisión, no por jerarquía) ni para seguimiento de tareas.

## Qué necesita para arrancar

Algún material con nombres o roles: una transcripción, un mail, documentos, o nombres dictados. Si hay un encuadre del problema o `contexto.md`, leerlos.

Según cómo llega el pedido (principio P1):

- **Completo:** armar el mapa y presentar los `[VERIFICAR]` al final.
- **Con huecos:** preguntar lo que más cambia el mapa. Casi siempre: quién aprueba el presupuesto o el alcance.
- **De alguien que arranca:** recorrer las categorías del paso Enumerar como preguntas ("¿quién usa el servicio todos los días? ¿quién lo opera? ¿quién lo puede frenar aunque no participe?") y armar la lista con las respuestas.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| No está claro qué problema resuelve el proyecto ni para quién | `encuadre-del-problema`, bloque A |
| El mapa está y se pide planificar entrevistas | `muestra-y-reclutamiento` y `guia-de-entrevista` |
| Aparece un actor nuevo en una entrevista | Sumarlo al mapa con la entrevista como fuente |

## La regla que ordena todo

El mapa se ordena por **relación con la decisión del proyecto**, no por jerarquía del organigrama. Un gerente que no toca el proyecto va lejos del centro; un analista que administra el canal por el que entran todos los pedidos va al núcleo. Reproducir el organigrama lleva a entrevistar por rango en vez de por conocimiento.

Su corolario: **cada actor lleva fuente**. De dónde salió ese nombre, ese cargo y esa lectura de poder: una transcripción, un mail, un documento o la propia persona que pide el mapa.

## Proceso

Desarrollado con criterios, escalas y ejemplos en `references/metodo.md`. Leerlo antes de calificar a nadie.

1. **Enumerar** todos los actores potenciales, sin filtrar. Roles y áreas también, no solo personas con nombre. Incluir quién ya pasó por un intento parecido.
2. **Calificar** cada uno: poder (1 a 5), interés (1 a 5), postura, qué espera, qué teme y qué aporta. Cada calificación se apoya en un dato o se marca `[VERIFICAR]`.
3. **Priorizar** con el criterio visible: los cuatro cuadrantes de poder e interés y la estrategia de cada uno.
4. **Ordenar en niveles y nombrarlos** según el proyecto ("Operan el día a día", "Deciden el presupuesto"), nunca "Nivel 1".
5. **Freno.** Antes de entregar, presentar la lista de `[VERIFICAR]` como preguntas concretas ("¿Confirmás que X reporta a Y?", "¿quién aprueba el presupuesto, X o Z?"). Confirmar primero, entregar después.

### Human in the loop

Este trabajo se hace sobre material desprolijo, donde es fácil inventar un apellido o ascender a alguien sin querer, y el error viaja al deck y a la agenda de entrevistas. Por eso:

- Nunca completar apellidos, cargos, áreas ni jerarquías que no estén en el material. Si falta, queda vacío con `[VERIFICAR]`.
- Marcar `[VERIFICAR]` en toda calificación inferida del tono de una conversación en vez de un hecho.
- Marcar `[VERIFICAR]` lo que venga de documentos más viejos que `UMBRAL_VIGENCIA`.

## Campos mínimos de cada actor

| Campo | Qué es |
|---|---|
| Nombre o rol | Persona, rol o área. Si es un rol sin nombre, se dice |
| Área u organización | Interna o externa, y de cuál |
| Tipo | interno, externo, proveedor, cliente, regulador |
| Nivel | El nivel con nombre al que pertenece |
| Poder (1 a 5) | Capacidad de habilitar o frenar |
| Interés (1 a 5) | Cuánto le cambia el resultado |
| Postura | promotor, neutral, resistente, desconocida |
| Qué espera | En sus términos, no en los nuestros |
| Qué teme | Qué le preocupa que el proyecto le haga. Anticipa el veto |
| Qué aporta | Decisión, datos, acceso, ejecución, veto |
| Tensión o riesgo | Con quién choca y por qué |
| Estrategia | Colaborar de cerca, mantener conforme, mantener informado, monitorear |
| Próxima acción | Entrevistar, invitar al kickoff, informar por mail |
| Fuente | De dónde salió el dato |

Un mapa sin tensiones registradas es un organigrama. Cuando dos actores quieren cosas incompatibles, eso es el hallazgo más accionable del mapa y va escrito, con nombre y con lo que quiere cada uno.

## Formato de salida

Primero verificar si hay conector de Figma en la sesión.

- **Con Figma:** FigJam. Leer `references/figjam.md` para el layout, y cargar las skills de uso de Figma y FigJam que traiga el conector antes de escribir en el board.
- **Sin conector:** tabla descargable. Leer `references/tabla.md`, armar el JSON y correr `scripts/tabla-stakeholders.py`, que produce un `.xlsx` con filtros y hojas de niveles y leyenda, más un `.csv` espejo.

En los dos casos, el mapa va con una **lectura corta en el chat** (5 a 8 líneas): quién falta, dónde está la tensión, a quién entrevistar primero y qué queda por confirmar.

Si el mapa va a un deck, el armado lo resuelve `creador-de-ppt` y la calidad del texto, `creador-de-contenido`.

## La regla que no se negocia

Los afectados por el problema van al mapa aunque nadie en la sala los represente. Un mapa de los poderosos produce un proyecto para los poderosos.

## Errores que existe para evitar

- Reproducir el organigrama y llamarlo mapa de stakeholders.
- Niveles sin nombre propio o que no explican qué los distingue.
- Poner solo personas con nombre y perder los roles y las entidades externas.
- Calificar poder e interés sin escala ni criterio escrito en la pieza.
- Un mapa donde todos son importantes: si nadie quedó en "monitorear", no se priorizó.
- Inventar apellidos, cargos o líneas de reporte para que la pieza se vea completa.
- Entregar el mapa sin próxima acción por actor.
- Tratarlo como foto fija: el mapa se versiona, y cada actor nuevo entra con su fuente.

## Referencias

- `references/metodo.md`: enumerar, calificar, priorizar, ordenar, tensiones, tipos de material y rúbrica de cierre.
- `references/tabla.md`: entrega como tabla.
- `references/figjam.md`: entrega en FigJam.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
