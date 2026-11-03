---
titulo: "Islas en Astro: cuándo cargar JavaScript y cuándo no"
extracto: "La mayoría de lo que se marca como isla es en realidad un script suelto. La diferencia en peso es un framework entero."
categoria: "Astro"
fecha: "2025-06-03"
minutos: 5
demo: "astro-islas"
cierre: {"titulo": "¿Tu web estática carga medio megabyte de JavaScript?", "texto": "Casi siempre sobra la mayor parte. Miramos qué necesita hidratarse de verdad y qué puede ser HTML.", "accionEtiqueta": "Aligeremos tu sitio"}
---

## 1. Por defecto, cero JavaScript

La idea de Astro es sencilla y radical: los componentes se ejecutan en el servidor y lo que llega al navegador es HTML. Sin runtime, sin hidratación, sin árbol de componentes en cliente.

Cuando una parte concreta necesita interactividad, se marca como isla. Sólo esa parte se hidrata; el resto de la página sigue siendo HTML estático.

<demo-astro-islas></demo-astro-islas>

## 2. Cuándo hace falta una isla

La pregunta útil no es "¿esto es interactivo?" sino "¿el estado tiene que sobrevivir en el cliente?".

- Un menú que abre y cierra: no necesita isla. Es un `<script>` de quince líneas.
- Una animación al hacer scroll: no necesita isla. Es un script que busca elementos por atributo.
- Un buscador con filtros que se combinan: eso sí es una isla.

La mayoría de lo que se marca como isla es en realidad un script suelto. La diferencia en peso es un framework entero.

### Las directivas

`client:load` hidrata en cuanto llega. `client:idle` espera a que el hilo principal esté libre. `client:visible` espera a que el componente entre en pantalla — es la buena para cualquier cosa bajo el pliegue.

`client:only` no renderiza en el servidor: úsala sólo cuando el componente toque `window` durante el render, y sabiendo que dejas un hueco vacío hasta que hidrate.

## 3. El coste escondido de las islas

Cada isla arrastra su framework. Dos islas de React en una página no cargan React dos veces, pero una isla de React y otra de Vue sí cargan los dos.

Y las islas no comparten estado entre sí sin un almacén externo. Si te encuentras montando uno para que tres islas se hablen, lo que quieres probablemente es una sola isla más grande — o ninguna.

## 4. Lo que se gana

Una página de blog no necesita JavaScript para mostrar texto. Con este modelo, no lo lleva. El resultado no es "más rápido": es que no hay nada que ejecutar.

## 5. Conclusión

Empieza sin islas. Añade una cuando el `<script>` se te haga incómodo de mantener, no antes.
