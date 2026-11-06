# Entrega en FigJam (vía Figma MCP)

## Antes de tocar nada

Cargar las skills `figma:figma-use` y `figma:figma-use-figjam` antes de cualquier
llamada a `use_figma`. Son prerrequisito de esas herramientas y ahí está la mecánica
real de la API; este archivo cubre solo **qué dibujar**, no cómo llamarla.

Si no hay archivo destino, crear uno nuevo de tipo FigJam (la skill
`figma:figma-create-new-file` es prerrequisito de `create_new_file`).

Confirmar con el usuario el archivo destino antes de escribir sobre un board existente.
Escribir sobre el board equivocado es caro de deshacer.

## Composición del board

El board tiene tres zonas, de izquierda a derecha:

```
┌───────────────────────┬──────────────────┐
│                       │  MATRIZ          │
│   MAPA CONCÉNTRICO    │  poder × interés │
│   (niveles nombrados) ├──────────────────┤
│                       │  LEYENDA         │
├───────────────────────┴──────────────────┤
│  TENSIONES Y PRÓXIMAS ACCIONES           │
└──────────────────────────────────────────┘
```

### Zona 1, Mapa concéntrico

Anillos (elipses sin relleno o con relleno muy claro, trazo fino) centrados en el mismo
punto. Radios sugeridos, con el centro en (0,0):

| Nivel | Radio | Etiqueta |
|---|---|---|
| 1, Núcleo | 300 | Texto sobre el borde superior del anillo |
| 2 | 600 | ídem |
| 3 | 900 | ídem |
| 4 | 1200 | ídem |
| 5, Contexto | 1500 | ídem |

Cada anillo lleva su **nombre propio del proyecto** y, en cuerpo menor debajo, la
definición de una línea. Nada de "Nivel 2" suelto.

Los actores van como sticky notes distribuidos sobre el ancho del anillo que les toca,
repartidos en el arco para que no se amontonen arriba. Cuando un anillo tiene más de
ocho actores, agrupar por área con un rótulo pequeño dentro del mismo anillo.

**Contenido de cada sticky** (corto, se lee de lejos):

```
Nombre o rol
Área | P4 I5
```

Y en el comentario o en una segunda línea menor, la próxima acción.

### Zona 2, Matriz poder × interés

Cuadrado de 1200×1200 dividido en cuatro. Eje X = interés, eje Y = poder, ambos con la
escala 1 a 5 escrita. Cada cuadrante rotulado con su estrategia: **Colaborar de cerca**,
**Mantener conforme**, **Mantener informado**, **Monitorear**.

Los mismos actores aparecen acá como stickies chicos, ubicados por sus notas. Que un
actor esté en las dos zonas es intencional: el anillo dice dónde vive, el cuadrante dice
cómo tratarlo.

### Zona 3, Tensiones y próximas acciones

Dos columnas:

- **Tensiones**: una tarjeta por tensión, con los dos actores nombrados y qué quiere
  cada uno. Conectar los stickies involucrados en la zona 1 con una flecha roja punteada.
- **Próximas acciones**: lista ordenada por prioridad de entrevista, con actor, acción y
  quién la hace.

## Código de color

Consistente en todo el board, y siempre con leyenda visible:

| Color | Significado |
|---|---|
| Amarillo | Interno del equipo / núcleo |
| Azul | Interno de otra área |
| Verde | Externo (proveedor, socio, plataforma) |
| Gris | Cliente o usuario final |
| Naranja | `[VERIFICAR]`, dato sin confirmar |
| Rojo (solo flechas) | Tensión |

El naranja es importante: hace que lo no confirmado se vea a simple vista en la reunión,
que es exactamente cuando conviene preguntarlo.

## Conectores

Usar flechas solo para relaciones que cambian una decisión:

- **Reporta a / depende de**, flecha llena fina.
- **Da acceso a (puente)**, flecha punteada gris, con el rótulo "intro".
- **Tensión**, flecha punteada roja, bidireccional.

Todo lo demás (que todos se conocen, que todos usan la misma herramienta) satura el
board sin agregar información.

## Al terminar

Devolver el link al board y la lectura corta en el chat. Si el board quedó armado a
partir de datos con `[VERIFICAR]` sin resolver, decirlo explícitamente en el mensaje:
quien lo abra en una reunión necesita saber qué está sin confirmar antes de proyectarlo.
