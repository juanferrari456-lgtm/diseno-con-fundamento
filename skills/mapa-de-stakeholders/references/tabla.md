# Entrega como tabla descargable (fallback sin Figma)

Cuando no hay conector de Figma, el mapa se entrega como `.xlsx` con filtros más un
`.csv` espejo. La tabla no es un premio consuelo: es filtrable, se pega en un mail y se
puede completar a mano en una reunión, cosa que el board no.

## Paso 1, Armar el JSON

El script consume un JSON con esta forma. Los campos vacíos van como `""`, nunca
inventados.

```json
{
  "proyecto": "Nombre del proyecto",
  "fecha": "2026-07-30",
  "niveles": [
    { "nombre": "Operan el canal todos los días", "definicion": "Quienes cargan y responden pedidos" },
    { "nombre": "Habilitan presupuesto y alcance", "definicion": "Aprueban el trimestre" }
  ],
  "stakeholders": [
    {
      "nombre": "Nombre o rol",
      "rol": "Cargo tal como se dijo",
      "area": "Área u organización",
      "tipo": "interno",
      "nivel": "Operan el canal todos los días",
      "poder": 4,
      "interes": 5,
      "postura": "promotor",
      "que_espera": "En sus términos",
      "que_teme": "Que el proyecto le sume trabajo manual",
      "que_aporta": "Datos de operación y acceso a la herramienta",
      "tension": "Con X por el alcance",
      "estrategia": "",
      "accion": "Entrevistar antes del kickoff",
      "fuente": "Transcripción del kickoff",
      "confianza": "confirmado"
    }
  ]
}
```

- `tipo`: `interno` | `externo` | `proveedor` | `cliente` | `regulador`
- `postura`: `promotor` | `neutral` | `resistente` | `desconocida`
- `confianza`: `confirmado` | `VERIFICAR`
- `estrategia`: dejarlo vacío y el script lo deriva del cuadrante; completarlo solo para
  pisar la derivación con un criterio propio.

## Paso 2, Correr el script

```bash
python scripts/tabla-stakeholders.py mapa.json --salida /mnt/user-data/outputs/
```

Produce dos archivos con el nombre derivado del proyecto y la fecha. Se puede forzar el
nombre con `--nombre`:

```bash
python scripts/tabla-stakeholders.py mapa.json \
  --salida /mnt/user-data/outputs/ \
  --nombre Mapa-Stakeholders_Reservas_202611
```

Si `contexto.md` define una convención de nombres, usarla.

## Qué genera

Tres hojas:

1. **Mapa**, una fila por actor, con filtros activados y la fila de encabezado
   congelada. Las filas con `confianza: VERIFICAR` quedan resaltadas en ámbar.
   Incluye columnas derivadas: cuadrante y estrategia.
2. **Niveles**, nombre y definición de cada nivel, en orden del centro hacia afuera.
3. **Leyenda**, las escalas de poder e interés con sus anclas y los cuatro cuadrantes
   con su estrategia. Va en la pieza para que el criterio no viva solo en la cabeza de
   quien la armó.

## Al entregar

Presentar los archivos y, en el chat, la lectura corta: quién falta, dónde está la
tensión, por quién empezar y qué quedó en `[VERIFICAR]`. Si hay pendientes de
confirmación, listarlos como preguntas antes de dar el mapa por cerrado.
