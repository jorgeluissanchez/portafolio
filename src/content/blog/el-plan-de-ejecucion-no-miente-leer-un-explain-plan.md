---
titulo: "El plan de ejecución no miente: leer un EXPLAIN PLAN"
extracto: "Antes de añadir otro índice: qué mirar primero, por qué el coste no sirve para comparar y cómo se lee el árbol."
categoria: "Oracle"
fecha: "2025-07-15"
minutos: 6
demo: "plan-ejecucion"
cierre: {"titulo": "¿Esa consulta que tarda un minuto?", "texto": "Casi nunca es el volumen de datos. Miro el plan real y te digo dónde se va el tiempo antes de tocar un solo índice.", "accionEtiqueta": "Mira mi consulta"}
---

## 1. La consulta no es lenta "porque hay muchos datos"

Es el diagnóstico por defecto y casi nunca es la causa. Una tabla de diez millones de filas puede responder en milisegundos con el índice adecuado, y una de cincuenta mil puede tardar un minuto si el plan decide recorrerla entera por cada fila de otra.

El plan de ejecución te dice cuál de los dos casos tienes. No hay que adivinarlo.

## 2. Lo primero que se mira

No es el coste. El coste es una estimación relativa y comparar el de dos consultas distintas no significa nada.

Lo que se mira es la diferencia entre las filas **estimadas** y las **reales**. Si el optimizador cree que un paso devuelve 10 filas y devuelve 400.000, todo lo que decidió a partir de ahí está construido sobre una suposición falsa: eligió un bucle anidado donde hacía falta un hash join.

### De dónde sale esa diferencia

Casi siempre de estadísticas viejas, de una función aplicada sobre la columna del filtro —`WHERE UPPER(nombre) = ...` inutiliza el índice sobre `nombre`— o de una conversión implícita de tipos.

## 3. Los accesos, de mejor a peor

`INDEX UNIQUE SCAN` — una fila por clave. Perfecto.

`INDEX RANGE SCAN` — un tramo del índice. Bien, si el tramo es pequeño.

`TABLE ACCESS FULL` — la tabla entera. **No es malo por sí mismo**: si vas a leer el 60% de las filas, recorrerla es más rápido que saltar por el índice. Es malo cuando buscabas tres filas.

`NESTED LOOPS` sobre un conjunto grande — el clásico de la consulta que tarda. Por cada fila del primer conjunto se ataca el segundo.

<demo-plan-ejecucion></demo-plan-ejecucion>

## 4. Léelo de dentro hacia fuera

El plan es un árbol y se ejecuta empezando por la operación más indentada. Esa es la primera fuente de datos; lo de arriba consume lo de abajo. Leerlo de arriba abajo, como una lista, es lo que hace que no se entienda.

## 5. Conclusión

Antes de añadir un índice, mira el plan real. Un índice de más ralentiza cada escritura de la tabla para siempre, y muchas veces el problema era una función en el `WHERE` que ya tenía índice y no lo podía usar.
