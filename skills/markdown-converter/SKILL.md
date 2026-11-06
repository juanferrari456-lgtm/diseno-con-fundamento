---
name: markdown-converter
description: "Convierte documentos (PDF, Word, PowerPoint, Excel, HTML, CSV, imágenes, audio, ZIP, YouTube) a Markdown con markitdown y les pone un nombre consistente según la convención de la organización, para que un repositorio de documentación se pueda buscar y ordenar. Usar cuando se pida pasar un archivo a .md para un repositorio o para otra skill, o cuando se pregunte cómo nombrar un documento."
---

# Markdown converter

Dos trabajos: convertir el archivo a Markdown y nombrarlo con una convención. El segundo es el que importa: un `.md` con el nombre original del archivo de origen no sirve en un repositorio, porque el repositorio se busca y se ordena por nombre.

Para leer un PDF, Word o imagen y trabajar con su contenido en la conversación no hace falta convertir: Claude los lee directo. Esta skill es para cuando el resultado es un archivo `.md` que va a un repositorio o que otra skill necesita como entrada (por ejemplo, una transcripción para `sintesis-de-entrevistas` o `sintesis-de-reuniones`).

Principios del paquete en `references/principios.md`.

## Qué necesita para arrancar

El archivo. Para el nombre, la convención de `contexto.md` si existe.

Según cómo llega el pedido (principio P1):

- **Completo** (hay convención): convertir y proponer el nombre.
- **Con huecos** (no hay convención): usar la de abajo y ofrecer guardarla en `contexto.md`.
- **De alguien que arranca:** explicar en una línea para qué sirve nombrar bien ("en seis meses vas a buscar este archivo por proyecto y fecha, no por cómo se llamaba el PDF") y seguir.

## Convertir

```bash
uvx markitdown entrada.docx -o salida.md
uvx --from "markitdown[pdf]" markitdown entrada.pdf -o salida.md   # PDF necesita el extra
```

Otras opciones útiles: `-x` para indicar la extensión cuando se lee de stdin, `-d` con `-e <endpoint>` para usar Azure Document Intelligence en PDFs complejos.

Después de convertir, revisar la extracción. Los decks con layout multicolumna salen con las columnas entrelazadas: reconstruir el orden de lectura real antes de entregar.

Si el archivo ya viene en Markdown (por ejemplo, exportado de un editor de documentos), no hace falta markitdown: limpiar los escapes del exportador y rearmar la estructura aplanada, sin tocar el texto.

No mostrar el documento convertido completo en la respuesta: entregarlo como archivo. Repetirlo en el chat duplica su costo.

## Nombre

Si `contexto.md` define una convención, se usa esa. Si no, esta:

```
{PROYECTO}_{AUTOR}_{FUENTE}_{DESCRIPTOR}_{PERIODO}.md
```

Ejemplos ficticios:

```
Reservas_Diseno_PPT_Discovery-Lista-de-Espera_202611.md
Reservas_Research_CSV_Encuesta-Trimestral-Socios_202609.md
Sedes_Operaciones_Doc_Manual-de-Recepcion_202603.md
Reservas_Diseno_Figjam_Blueprint-Reserva-de-Clase_202611.md
```

### Forma

- `_` separa campos y `-` separa palabras dentro de un campo.
- Sin espacios, tildes ni ñ: `Recepcion`, `Transcripcion`.
- Title-Case por palabra, con los conectores (`y`, `de`, `por`, `en`) en minúscula: `Riesgos-y-Contingencias`.
- Sin versión ni sufijos de exportador (`_v2`, `_final`, `(1)`, `_copy`).
- Extensión `.md`.

### Campos

| Campo | Qué es | Ejemplos |
|---|---|---|
| `PROYECTO` | Línea, producto o proyecto | el nombre corto que use la organización |
| `AUTOR` | Qué área produjo el documento, no quién lo archiva | `Diseno`, `Research`, `Marketing`, `Producto`, `Operaciones`, `Externo` |
| `FUENTE` | Naturaleza del artefacto original, no su contenedor | `PPT`, `CSV`, `Figjam`, `Doc`, `Audio` |
| `DESCRIPTOR` | Qué es el documento | libre, Title-Case, palabras con `-` |
| `PERIODO` | Año y mes en que se produjo | `202611` |

- **`AUTOR` es quien lo produjo.** Un brief que escribió Marketing es `Marketing` aunque lo archive diseño; una propuesta de un proveedor es `Externo`. Si el contenido no dice quién lo produjo, preguntar.
- **`FUENTE` describe el artefacto, no la extensión.** Un deck exportado a PDF es `PPT`; un board exportado es `Figjam`; una tabla es `CSV`; un documento de texto es `Doc`. Si el archivo no delata su naturaleza, preguntar.
- **`DESCRIPTOR` arranca con el tipo de entregable** cuando aplica: `Discovery-`, `Relevamiento-`, `Retro-`, `Mapeo-`, `Transcripcion-`, `Propuesta-`, `Blueprint-`, `Seguimiento-`, `Estrategia-`.
- **`PERIODO`** es cuándo se produjo el documento, no el período que describe.

Los documentos vivos de contexto general pueden llevar solo nombre y versión (`Contexto-General_V1.md`) si la persona lo pide.

## Flujo

1. Convertir y revisar la extracción.
2. Inferir cada campo desde el contenido del documento, no desde el nombre del archivo de origen.
3. **Freno.** Proponer el nombre antes de escribir el archivo, con cada campo y su evidencia. `PROYECTO`, `AUTOR` y `PERIODO` casi nunca se deducen con certeza: preguntarlos salvo que el contenido los indique sin ambigüedad.
4. Escribir el archivo ya con el nombre confirmado, así no queda una copia con otro nombre dando vueltas.

Formato de la propuesta:

```
Propuesta: Reservas_Diseno_PPT_Relevamiento-Recepcion-Sede-Norte_202611.md

  PROYECTO    Reservas     | [INFERIDO] el deck habla del sistema de reservas
  AUTOR       Diseno       | lo firma el equipo de diseño
  FUENTE      PPT          | deck exportado a PDF
  DESCRIPTOR  Relevamiento-Recepcion-Sede-Norte
  PERIODO     202611       | [INFERIDO] fecha de la portada
```

En lote, cada archivo se nombra por separado, sin heredar campos de otro. Si hay varios campos dudosos en el lote, juntarlos en una sola ronda de preguntas.

## La regla que no se negocia

El texto convertido no se edita: se reordena si la extracción lo desordenó, pero no se resume, no se corrige y no se completa.

## Referencias

- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
