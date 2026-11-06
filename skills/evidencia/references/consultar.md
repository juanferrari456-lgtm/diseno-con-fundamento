# Conseguir los datos

## Si la persona consulta sola

Orden fijo, porque cada paso decide si vale el siguiente. Vale para SQL, una herramienta de analítica, un dashboard con filtros o una planilla.

1. **Frescura:** que los datos lleguen al período que se quiere mirar. Cero filas sin error suele ser una tabla o un reporte que dejó de actualizarse.
2. **Descubrir los valores reales de los filtros:** listar los valores distintos de cada campo que se va a filtrar antes de escribir el filtro. Un filtro mal escrito devuelve cero y se confunde con "no pasó".
3. **Control de volumen:** cuántos registros hay con esos filtros.
4. **Extraer** lo que se va a analizar.
5. **Verificar que las sumas cierren** contra el control.

Reglas al escribir consultas:

- Una consulta por bloque, autocontenida, sin parámetros sin resolver. Si falta un valor, preguntarlo o hacer primero la consulta de descubrimiento.
- Una o dos líneas por consulta: qué devuelve y qué mirar en el resultado.
- Una consulta nueva o sin probar se corre primero con pocas filas y se revisa antes de exportar. Decir que no está verificada.
- **Probar la llave antes de cruzar dos fuentes:** contar cuántos registros cruzan. Un campo con nombre de llave puede no cruzar nada.
- Contar por la fecha del hecho que importa (el evento, la entrega, la visita), no por la fecha de carga o de emisión, salvo que la pregunta sea esa.

## Si lo tiene otro equipo

Plantilla de pedido. Cuanto más claro, más rápido vuelve.

```
Qué queremos saber: [en una línea]
Para qué decisión: [qué cambia según el resultado]
Período: [desde, hasta, y por qué fecha contar]
Cortes: [segmento, canal, lugar, producto]
Campos que necesitamos: [lista]
Qué no necesitamos: [para no recibir de más]
Datos personales: [no los necesitamos / solo códigos]
Formato: [CSV, planilla, captura del tablero]
Para cuándo: [fecha] y qué pasa si llega después
```

Antes de mandarlo, revisar en `contexto.md` si ya se sabe que ese camino no responde o tarda; a veces hay otra fuente que contesta lo mismo.
