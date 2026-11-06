# Memoria

La memoria guarda **el estado del proyecto**, no el corpus. Tiene tope de
tamaño, no admite datos de terceros, y un corpus metido ahí se degrada y en dos
semanas devuelve versiones deformadas de lo que dijo alguien.

## Qué entra

Si el entorno tiene memoria (por ejemplo, la memoria de Claude), en el archivo del proyecto y en líneas cortas:

- Si la etapa de campo está en curso o cerrada, y cuántas entrevistas van.
- Los códigos relevados por rol genérico, sin nombres propios:
  `E01 a E04 (socios que reservan seguido y personal de recepción)`.
- Dónde vive el corpus del proyecto.
- Decisiones del usuario sobre el discovery: alcance, perfiles que faltan.
- Vacíos que el usuario marcó como prioritarios para la próxima ronda.

```
- [stated] Etapa de campo en curso, 13 de 15 entrevistas procesadas
- [stated] Corpus en cancelaciones/, se consulta con corpus.js query
- [stated] Faltan 2 perfiles: instructores y empresas con plan corporativo
```

## Qué no entra, nunca

- Citas textuales de entrevistados.
- Nombres propios, cargos exactos o datos de contacto. La relación entre código
  y persona vive en la ficha.
- Hallazgos crudos, dolores individuales, severidades. Eso es corpus.
- Datos personales sensibles que alguien haya mencionado sobre sí mismo o sobre
  terceros. Si es relevante para el discovery, va a la ficha con su ancla.
- Inferencias sobre personas. Alguien que se quejó mucho no se convierte en
  "perfil resistente al cambio" en ningún archivo.

## Cómo actualizar

No leer archivos de memoria de la cuenta para procesar una entrevista: todo lo
que hace falta está en el corpus. Escribir solo en la copia del proyecto.


Lo que cambia después de procesar una entrevista suele ser un número. Editar esa
línea, no reescribir el archivo.
