# Way of working | reuniones de una iniciativa

## La carpeta de contexto

| Archivo | Para qué |
|---|---|
| `*_Reunion_R0N-*.md` | una minuta por reunión, la fuente |
| `*_Reunion_Seguimiento_*.md` | lo abierto y lo vigente de la iniciativa, derivado |

El seguimiento guarda su estado en un comentario al final. Para encadenar la
reunión siguiente alcanza con ese archivo: no hace falta subir minutas viejas.
Al cambiar de trimestre el seguimiento cambia de nombre; reemplazar el anterior.

Las transcripciones no viven en la carpeta. Se suben al chat de su reunión y
nada más.

## En un Project de Claude

Subir al conocimiento del Project el seguimiento y las minutas. `init` los lee
de `/mnt/project`. Instrucción sugerida:

```
Iniciativa [nombre]. Para procesar reuniones o responder qué quedó pendiente,
qué se decidió o quién tiene qué, usar la skill sintesis-de-reuniones.
No abrir el seguimiento entero: usar reuniones.js query. Toda respuesta con IDs.
```

Sin Project: adjuntar el seguimiento junto con la transcripción.

## Un chat por reunión, o dos si son cortas

```
/sintesis-de-reuniones Lista de espera | alineación con Producto 25/09
```

con la transcripción adjunta. Hasta 30 minutos de transcripción entran en un
mismo chat: dos weeklies de 15 minutos van juntas, en orden. Si falta algo (fecha, iniciativa, que es el
arranque de una serie), sumarlo en la misma línea: cada ida y vuelta reenvía la
transcripción.

Al terminar: sumar la minuta a la carpeta, reemplazar el seguimiento, contestar
preguntas solo si cambian la minuta. Confirmar los nombres que quedaron
`[A CONFIRMAR]` vale la pena aunque no cambien nada más: entran al glosario y la
próxima reunión ya los reconoce.

Orden: cronológico. Si se procesa una reunión vieja después de una nueva, la 05
de la nueva puede haber quedado sin mencionar cosas que en realidad se
cerraron: revisar con `query --id`.
