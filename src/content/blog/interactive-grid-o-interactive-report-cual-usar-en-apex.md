---
titulo: "Interactive Grid o Interactive Report: cuál usar en APEX"
extracto: "No son dos versiones de lo mismo. Uno está hecho para consultar y el otro para escribir, y elegir mal se paga en soporte."
categoria: "Oracle APEX"
fecha: "2025-07-01"
minutos: 4
demo: "apex-grid-report"
cierre: {"titulo": "¿Tus usuarios pelean con la pantalla cada día?", "texto": "Muchas veces el problema no es la formación: es que esa pantalla se montó con el componente equivocado. Lo miramos.", "accionEtiqueta": "Revisemos tus pantallas"}
---

## 1. No son dos versiones de lo mismo

Es la confusión más habitual al empezar en APEX: pensar que el Interactive Grid es "el Interactive Report nuevo". No lo es. Resuelven problemas distintos y elegir mal se paga en soporte.

El **Interactive Report** está pensado para *consultar*: filtrar, agrupar, pivotar, descargar, guardar vistas.

El **Interactive Grid** está pensado para *editar*: modificar filas en pantalla y guardar en lote.

<demo-apex-grid-report></demo-apex-grid-report>

## 2. Cuándo el Report

Cuando el usuario mira datos y no los cambia.

- Listados que se exportan a Excel.
- Informes con agrupaciones y totales.
- Vistas guardadas que cada usuario configura a su gusto.

El Report trae de serie el *Control Break*, el resaltado condicional y la descarga, y el usuario puede reconfigurarlos sin tocar la aplicación. El Grid no lleva parte de eso, y replicarlo cuesta trabajo.

## 3. Cuándo el Grid

Cuando el usuario escribe.

- Captura masiva: veinte filas de una vez sin abrir un formulario por cada una.
- Corrección rápida sobre una lista.
- Maestro-detalle donde el detalle se edita en la misma pantalla.

### El detalle que se olvida

Un Interactive Grid editable necesita una clave primaria real y un bloqueo optimista. Si dos personas editan la misma fila, quien guarde último pisa al otro **en silencio** salvo que lo controles. En un Report ese problema no existe porque nadie escribe.

## 4. Lo que suele decidir de verdad

En la práctica la elección la marca el volumen. Un Grid con miles de filas y edición activa se vuelve pesado en el navegador, porque mantiene el estado de cada celda. Si la pantalla es de consulta con mucho dato, Report; si es de captura con poco dato, Grid.

## 5. Conclusión

Pregunta primero qué va a hacer el usuario con esa pantalla: si mirar o si escribir. Todo lo demás se deduce de ahí.
