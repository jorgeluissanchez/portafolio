---
titulo: "Tailwind sin desorden: el color en cinco capas"
extracto: "Por qué las variables no bastan, qué separa un primitivo de un papel, y el motivo de que --primary no sea el color de tu marca."
categoria: "Design systems"
fecha: "2025-05-06"
minutos: 6
demo: "capas-color"
cierre: {"titulo": "¿Cuántos azules distintos hay en tu producto?", "texto": "Si nadie sabe cuál es el bueno, no te falta una paleta: te falta un reparto de papeles. Te ayudo a montarlo.", "accionEtiqueta": "Ordenemos tu sistema"}
---

## 1. El problema de los colores sueltos

Un proyecto empieza con `--azul: #2563eb`. A los tres meses hay `--azul-2`, `--azul-oscuro` y un `#2463ea` copiado a mano en dos componentes. Nadie recuerda cuál es el bueno y cambiar la marca se convierte en una búsqueda global.

El fallo no es la falta de variables. Es que las variables nombran **colores** en vez de nombrar **papeles**.

## 2. Cinco capas

La estructura que uso separa lo que un color *es* de para lo que *sirve*:

**Primitivos.** Las rampas en crudo: `--neutral-100`, `--bermellon-500`. Nadie las usa directamente en un componente.

**Temas.** Aquí se reparten los papeles: `--background`, `--foreground`, `--primary`. Un tema es una asignación distinta de los mismos primitivos.

**Puente.** Traduce esos papeles a utilidades del framework, para poder escribir `bg-background` sin pensar.

**Base.** Los estilos por defecto de los elementos, para que un documento sin clases ya salga con la voz del sistema.

**Utilidades.** Los gestos propios que se repiten: una regla superior, una etiqueta, un revelado.

### Lo que gana

Un componente escrito contra papeles funciona en todos los temas sin tocarlo. Añadir un modo oscuro deja de ser trabajo de componentes y pasa a ser trabajo de una capa.

<demo-capas-color></demo-capas-color>

## 3. `--primary` no es la marca

Es el error conceptual más común. `--primary` significa "la acción principal de esta zona", y cambia de valor según el contexto: sobre un fondo de acento, la acción principal tiene que ser oscura, no del color de la marca.

Si atas `--primary` al color corporativo, el día que pintes una sección de ese color el botón desaparecerá dentro del fondo.

## 4. Derivar en vez de declarar

Los tonos intermedios se calculan:

```css
--primary-trazo: color-mix(in oklab, var(--primary) 30%, transparent);
```

Así el borde suave de un botón sigue al color del papel sin declararlo cuatro veces. Y en OKLab la mezcla mantiene la luminosidad percibida, cosa que en sRGB no ocurre: ahí los intermedios salen apagados.

## 5. Conclusión

Un sistema de color no es una paleta, es un reparto de papeles. La paleta cambia; los papeles, casi nunca.
