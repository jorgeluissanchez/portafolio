---
titulo: "Por qué tu página tarda: el LCP no es la imagen"
extracto: "El tiempo se va antes de que la imagen empiece a descargarse. Dónde mirar y qué tres cosas mueven de verdad la aguja."
categoria: "Rendimiento"
fecha: "2025-04-08"
minutos: 5
demo: "cascada-lcp"
cierre: {"titulo": "¿Tu web va lenta y ya no sabes por dónde seguir?", "texto": "Miro el orden de carga real de tu sitio y te digo qué está bloqueando qué, con medidas en vez de corazonadas.", "accionEtiqueta": "Auditemos tu carga"}
---

## 1. El LCP no mide lo que crees

El *Largest Contentful Paint* mide cuándo aparece el elemento más grande del primer pantallazo. Casi siempre es una imagen, así que la conclusión automática es "hay que optimizar la imagen". Y casi siempre es la conclusión equivocada.

La imagen no puede empezar a descargarse hasta que el navegador sabe que existe. Todo lo que ocurra antes de ese descubrimiento se suma al LCP sin aparecer en el peso del archivo.

## 2. Lo que pasa antes de la imagen

El orden real es este:

1. El navegador pide el HTML.
2. Lo va leyendo de arriba abajo.
3. Se topa con una hoja de estilos y **para**: el CSS bloquea el renderizado.
4. Se topa con la imagen y la pide.
5. La imagen llega y se pinta.

Entre el paso 1 y el paso 4 puede haber medio segundo largo, y ahí no hay ni un byte de imagen. Una fuente cargada desde otro dominio añade una resolución de DNS y un *handshake* de TLS antes de poder pedirla siquiera.

### Cómo verlo

En la pestaña *Network* de las herramientas de desarrollo, ordena por *Waterfall* y busca el hueco entre que llega el HTML y arranca la imagen. Ese hueco es tu problema.

<demo-cascada-lcp></demo-cascada-lcp>

## 3. Las tres cosas que sí mueven la aguja

**Que la imagen se descubra pronto.** Si la pinta JavaScript, el navegador no la ve hasta que ese JavaScript se descarga y ejecuta. Una `<img>` en el HTML se descubre en el primer barrido del *preload scanner*.

**Quitarle `loading="lazy"` a la de arriba.** Es el error más repetido: se aplica carga perezosa a todo el sitio de una pasada y se aplaza justo la imagen que define el LCP.

**Reservar el hueco.** `width` y `height` no aceleran nada, pero evitan que el resto salte cuando la imagen llega, y ese salto es lo que el usuario percibe como lentitud.

## 4. Lo que casi nunca merece la pena

Bajar la imagen de 180 KB a 120 KB. Sobre una conexión decente son unas decenas de milisegundos, mientras el hueco de descubrimiento se cuenta en cientos.

Optimiza el peso, sí, pero después de haber mirado el orden. Empezar por ahí es pulir el último tramo de una carrera que se pierde en la salida.

## 5. Conclusión

El LCP es un problema de secuencia antes que de tamaño. Antes de volver a comprimir nada, mira cuándo empieza la descarga: casi siempre hay más que ganar ahí que en el archivo.
