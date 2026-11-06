# Narrativa y copy

El sistema visual no salva un deck mal contado. Esta es la estructura que el formato
espera y las convenciones de escritura que lo sostienen.

## Arco del deck

Es un esqueleto, no una obligación: si el trabajo no tuvo benchmark, ese bloque no va.

1. **Portada**: qué es esto y de qué etapa se trata.
2. **Agenda**: el mapa del recorrido.
3. **Reglas de juego** (`statement` en negro): cómo se va a manejar la conversación,
   por ejemplo dónde anotar dudas. Opcional pero baja mucho la ansiedad de la sala.
4. **Contexto**: origen (qué es el objeto de estudio), problema (a quién le duele y
   cómo), objetivo (qué se busca lograr). El problema se cuenta por actor: usuario,
   negocio, equipo.
5. **Abordaje metodológico**: qué se hizo y con qué alcance. Da derecho a afirmar lo
   que viene después.
6. **Qué está pasando afuera**: tendencias, cifras y benchmark. Cierra con un
   `statement` mint que dice la conclusión transversal.
7. **Hallazgos**: un slide por hallazgo, ordenados por el momento del recorrido
   (antes / durante / después) o por actor. Es el corazón del deck.
8. **Niveles de solución**: opciones con pros y riesgos, matriz de factibilidad y
   flujos high level de las más viables. Mostrar el terreno y marcar la opción
   recomendada con su trade-off: nunca se presenta como empate.
9. **La importancia del para quién**: el dato o la tensión que obliga a mirar al
   usuario antes de elegir. Buen lugar para el `bigStat`.
10. **Anexos enlazados** (`linkCard`): el material largo no va en el deck: va
    referenciado. El deck principal se lee en una reunión; los anexos se consultan.
11. **Próximos pasos**: dos o tres, con dueño y plazo, y la decisión que le pedimos a
    quien decide, dicha explícitamente: qué tiene que decidir, quién y para cuándo.
12. **Cierre**: cómo seguir la conversación.

## Variante: relevamiento y propuesta

Cuando el trabajo es mapear algo que existe y proponer cómo cambiarlo (una migración, un
rediseño de backoffice, un modelo de roles), el arco cambia:

1. **Portada** y **agenda**.
2. **Lo que mueve la aguja**: la recomendación y la decisión que se pide, en un
   `statement`, antes del contexto.
3. **Objetivos**: qué responde el trabajo y cómo un objetivo alimenta al otro (`cards`).
4. **De dónde partimos**: el tamaño de lo que existe y sus tipos (`breakdown`).
5. **Lo que encontramos al mapear**: la decisión de alcance (`scopeGrid`) y el enlace
   al relevamiento completo (`linkCard`).
6. **Escenarios**: los caminos lado a lado con el recomendado (`scenarios`), una ficha
   por escenario con sus contras (`scenario`) y el detalle ola por ola (`waves`, con
   construcción progresiva en el recomendado).
7. **Gobernanza**: cómo es hoy y cómo debería ser (`breakdown`), los niveles (`scale`) y
   los perfiles (`profiles`), con el enlace a la matriz completa (`linkCard`).
8. **Conclusiones**: a lo que llegamos y lo que tiene que decidir el otro equipo
   (`conclusions`).
9. **Cierre**.

## Variante: síntesis de un discovery

Para devolver lo que salió del campo y pedir decisiones. Orden sugerido:

1. **Portada**.
2. **El insight principal** a sangre (`insight`), antes del método.
3. **Contexto**: quiénes tocan el problema (`ecosystem`).
4. **Qué pasó con lo que creíamos**: el resumen (`hypothesisBoard`) y, si la audiencia
   quiere el detalle, el arcoíris (`rainbow`).
5. **Cómo lo vive cada uno**: el recorrido (`emotionCurve`), los segmentos
   (`perSegment`) o los arquetipos (`archetypes`).
6. **Por qué pasa**: la cadena causal (`causalChain`), la tensión en números
   (`comparisonStat`) y qué tan firme es (`triangulation`).
7. **Recomendación**: qué ya tiene dueño (`ownerCheck`), quién hace qué
   (`ownershipMatrix`), cómo se mide (`keyResults`) y qué hay que decidir (`decisionAsk`).
8. **Lo que todavía no sabemos** (`unknowns`).
9. **Anexo**: muestra (`sampleTable`) y verbatims (`verbatimGrid`).

No hacen falta todos. Un deck para dirección puede ser 2, 6 y 7; uno para el equipo que
va a diseñar, 4, 5 y 9.

## Convenciones de escritura

**Títulos-afirmación.** El título dice la conclusión; el cuerpo la sostiene.

- Sí: "El momento más crítico ocurre cuando el evento ya terminó."
- No: "Análisis de la etapa post-evento."

**Observación ≠ recomendación.** La observación es lo que se vio, con su evidencia, sin
salida propuesta. La recomendación es una sola acción, acotada a lo que el equipo puede
decidir. Mezclarlas es el error más común y hace que el hallazgo no se pueda discutir.

**Cifras con lectura.** Cada número lleva qué mide, de cuándo es y de dónde sale. Una
cifra sin fuente se saca del deck; no se maquilla con "aproximadamente".

**Aprendizaje, no ficha técnica.** En un benchmark, lo que importa no es cómo funciona
la solución ajena sino qué se transfiere a la nuestra, incluyendo el problema que esa
solución ya se comió.

**Riesgos a la vista.** Cuando una opción tiene una fragilidad conocida (legal,
operativa, reputacional), se dice en el mismo slide donde se la propone. El formato
tiene bloques oscuros justamente para eso.

**Posición, con la decisión pedida.** El deck no devuelve el problema ordenado: recomienda
una opción con su trade-off y le pide la decisión, de forma explícita, a quien decide.
Recomendar no es imponer: la decisión sigue siendo de quien la tiene, pero no se le deja
un empate. La fuerza de la recomendación acompaña la evidencia: con evidencia sólida se
recomienda; con un indicio se propone como algo a validar y se dice cómo. Criterio
completo en el corte 6 de `creador-de-contenido`.

**Recursos de relato.** Apertura que desmonta una creencia, voz externa, falso final,
pantalla anotada, árbol en apertura y cierre: cuándo usar cada uno está en
`creador-de-contenido/references/recursos-de-relato.md`. Acá están los arquetipos
para armarlos: `statement`, `voice`, `annotatedScreen`, `tree` y `sources`.

**Separadores.** Sin punto medio ni raya larga en ningún texto del deck. Para separar se usa |, - o ,.

## Idioma y tono

- Se escribe en el español del equipo. Si el material de origen usa voseo rioplatense
  ("anotalos", "revisemos"), el deck lo mantiene: cambiar a "anótalos" suena a otro
  autor.
- Primera persona del plural para el trabajo del equipo ("analizamos", "no capturamos"),
  tercera para lo que hacen los actores del sistema.
- Nada de jerga vacía: "ecosistémico", "accionable" y "first-party data" solo si el
  equipo ya los usa con un significado preciso.
- Frases cortas. Si una oración necesita dos comas para respirar, son dos oraciones.

## Autoría y datos del proyecto

Nada de esto se hardcodea: color de acento, logo, nombres de quienes presentan, fecha,
cliente y contenido
vienen de cada persona que use el formato. Si faltan, preguntar o dejar el campo
afuera: un deck con el nombre de otra persona en la portada es peor que uno sin nombre.
