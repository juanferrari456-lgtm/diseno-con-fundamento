# Evidencia: qué hay en la carpeta y cuánto se puede afirmar

El modelo vale lo que valen sus fuentes. Este paso no se saltea aunque el pedido
sea "armame el blueprint de esto" con un solo archivo adjunto: la carpeta del
proyecto casi siempre tiene más.

## 1. Inventario

Listar la carpeta y clasificar cada archivo en una de estas familias. No hace
falta leer todo para clasificar: el nombre, el encabezado y el tamaño alcanzan.

| Familia | Ejemplos | Cómo se usa |
|---|---|---|
| Entrevistas | fichas, `corpus.json`, `ACUMULADO.md`, `NOTAS.md` | Fuente principal de acciones, dolores y citas |
| Campo con hipótesis | `TABLERO.md`, guía de entrevistas | Segmentos, veredictos, contraste con blueprints anteriores |
| Registros | registro de dolores y oportunidades, trazabilidad | Ids P y O, estado de cada dolor |
| Datos | análisis de dashboards, casos de atención, NPS, CSV | Volúmenes, tiempos, frecuencias. Van como `dato` |
| Documentos | contratos, propuestas comerciales, correos, matrices de permisos, manuales | Lo que la organización dice que hace. Se contrasta con lo que dicen las personas |
| Artefactos previos | `.bp.json`, mapas, decks, handoffs | Evidencia a contrastar, nunca molde |
| Reuniones internas | minutas, seguimientos | Decisiones y alcance, rara vez acciones del servicio |

Cada fuente que se usa entra en `arquitectura.fuentes` con id, qué es,
perspectiva y segmento. El id de una entrevista es su código del corpus (`E13`).
Para el resto, un prefijo corto y estable (`BI`, `MAIL`, `CONT`, `RP`). Un
hallazgo con id propio de un análisis (`BI-H4`) se cita así y el `check` acepta
el prefijo declarado.

## 2. Leer sin cargar todo

Con `corpus.json` presente, no abrir fichas enteras. Del motor de
`sintesis-de-entrevistas`:

```bash
node corpus.js init /mnt/project --dir ./corpus
node corpus.js query --top 30 --dir ./corpus          # dolores consolidados por recurrencia
node corpus.js query --perfil E24 --dir ./corpus      # todo lo de una entrevista
node corpus.js query --buscar "liquidación acta" --dir ./corpus
node corpus.js query --vacios --dir ./corpus          # lo que nadie supo contestar
node corpus.js query --datos --dir ./corpus
node mapa.js abrir <ficha> --seccion 02               # solo el flujo as-is
```

El flujo as-is de cada ficha (sección 02) es la materia prima del journey. Los
consolidados (`DC`) dicen qué dolores se repiten entre perfiles.
`corpus.json` también trae `contradicciones` abiertas: leerlas antes de decidir
cualquier momento que toquen.

Si hay `TABLERO.md`, leer la hipótesis por segmento, el contraste con el
blueprint y los dolores nuevos desde el cliente. Ese contraste dice qué del
blueprint anterior se confirmó, qué se contradijo y qué se matizó.

Para datos que no están en la carpeta, `evidencia` arma la
consulta. No inventar un número que se puede pedir.

## 3. Cobertura y huecos

Un blueprint completo se apoya en cinco perspectivas: cliente, frontstage,
backstage, soporte y negocio. Hacer la cuenta por segmento: qué segmentos tienen
voz propia y cuáles solo aparecen contados por otros.

Lo que falta va a `arquitectura.huecos`, en una línea cada uno, y se convierte
en preguntas del modelo. Un carril del cliente sin entrevistas al cliente no es
un as-is: es una hipótesis interna, y el `check` lo marca cuando más de la mitad
del carril es inferencia.

## 4. Certeza

Cada elemento del modelo tiene una de dos marcas:

- `fuente`: lo dijo o lo mostró alguien, o está en un documento o un dato. Lista
  de ids.
- `inferencia`: lectura propia, con la base en el texto. "Nadie dijo cada cuánto
  llega la lista, el jefe dice que los precios cambian".

No hay una tercera opción. Si no se sabe y no se puede inferir con base, el
elemento no va y se anota la pregunta.

Dentro de `fuente`, distinguir en el texto cuando importa:

- **dicho por el actor** sobre lo que él mismo hace: lo más fuerte;
- **dicho por otro**: el cliente contando lo que hace la aseguradora. Vale, pero
  es relato;
- **documento**: lo que la organización dice que hace. Si contradice a las
  personas, ganan las personas y el documento va como nota;
- **dato**: medido. Si es una estimación de alguien, se escribe así: "operaciones
  estima que son 3 de cada 10".

## 5. Contradicciones

| Caso | Qué se hace |
|---|---|
| Distinto rol, distinta percepción | Las dos van: la acción como la cuenta quien la hace, el dolor como lo vive el cliente, con las dos fuentes. Esa brecha es hallazgo |
| Distinto segmento o condición | Es una decisión o un segmento. Pasar por la regla del tercio |
| Distinto momento en el tiempo | Lo vigente va como acción, lo anterior como nota con fecha. Las fichas de campo suelen decir cuándo pasó y si sigue pasando: un dolor resuelto no es un dolor del as-is |
| Una fuente se equivoca | Usar la más confiable y dejar nota. Si no se puede decidir, pregunta |

Nunca promediar dos versiones en una acción que no dijo nadie.

## 6. Lo que nunca se hace

- Completar un carril porque queda feo vacío.
- Copiar una tarjeta de un blueprint anterior sin volver a su fuente.
- Escribir en el carril del cliente lo que hace el sistema.
- Pasar el vocabulario interno al cliente.
- Dejar afuera lo que contradice la hipótesis del proyecto.
