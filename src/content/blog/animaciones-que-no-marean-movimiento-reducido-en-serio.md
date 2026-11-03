---
titulo: "Animaciones que no marean: movimiento reducido en serio"
extracto: "El fallo que deja la página en blanco, y por qué hay que tocar tres capas y no una para respetar prefers-reduced-motion."
categoria: "Animación"
fecha: "2025-05-20"
minutos: 5
demo: "movimiento-reducido"
cierre: {"titulo": "¿Has probado tu web con el movimiento desactivado?", "texto": "En la mitad de los sitios que lo llevan, el contenido no llega a aparecer. Lo compruebo en el tuyo y te digo qué falta.", "accionEtiqueta": "Que lo revise"}
---

## 1. Marear no es animar

`prefers-reduced-motion` no es una preferencia estética. Hay gente a la que un desplazamiento paralaje le provoca náuseas reales, del mismo modo que un coche en el asiento de atrás. Cuando el sistema operativo dice "menos movimiento", está transmitiendo eso.

La respuesta correcta no es apagar la animación y ya está. Es enseñar el mismo contenido sin el movimiento.

## 2. El fallo grave: la página en blanco

Casi todas las animaciones de entrada empiezan con el elemento en `opacity: 0` y lo llevan a `1`. Si la animación no corre porque el usuario pidió movimiento reducido, el elemento se queda **invisible**.

La página no "no anima": desaparece.

Y es un fallo que se cuela con facilidad, porque quien lo prueba ve que efectivamente no hay movimiento y da por bueno el resultado sin comprobar que además no se ve nada.

### La regla

El estado final tiene que ser alcanzable sin la animación. En la práctica: la clase que oculta se aplica sólo cuando hay animación disponible, o existe una regla que la revierte bajo `prefers-reduced-motion`.

<demo-movimiento-reducido></demo-movimiento-reducido>

## 3. Tres sitios, no uno

Cubrir esto de verdad exige tocar tres capas:

**CSS.** Las duraciones a 1 ms bajo la media query. Esto apaga las transiciones de los componentes.

**JavaScript.** `gsap.matchMedia()` en vez de `window.matchMedia`, porque revierte solo todo lo que se creó dentro cuando la condición deja de cumplirse — incluidos los disparadores de scroll, que si no se quedan colgados.

**La utilidad de revelado.** Devuelve los elementos a su estado visible.

Ninguna de las tres basta por su cuenta. Sólo con CSS, las librerías que escriben estilos en línea los ignoran. Sólo con JavaScript, las transiciones CSS siguen corriendo.

## 4. Lo que sí puede quedarse

Movimiento reducido no significa cero movimiento. Un cambio de color, una opacidad corta, un subrayado que crece: nada de eso produce mareo porque no simula desplazamiento en el espacio.

Lo que se quita es lo que se mueve mucho: paralaje, entradas desde fuera de la pantalla, rotaciones, escalados grandes.

## 5. Conclusión

Pruébalo con la preferencia activada antes de dar por terminada una animación. Si la página se queda vacía, no has hecho una animación accesible: has hecho una página que a algunas personas no les carga.
