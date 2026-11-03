---
titulo: "Payload CMS: bloques que componen, no que almacenan"
extracto: "La regla que evita que la misma información acabe duplicada en cuatro páginas y desincronizada al mes siguiente."
categoria: "CMS"
fecha: "2025-06-17"
minutos: 5
demo: "bloques-cms"
cierre: {"titulo": "¿Tu equipo edita la misma información en cuatro sitios?", "texto": "Se arregla con el modelo, no con disciplina. Te monto un CMS donde el dato vive en un solo sitio.", "accionEtiqueta": "Hablemos de tu CMS"}
---

## 1. El error de guardar en el bloque

La primera vez que montas una página por bloques, la tentación es obvia: el bloque "Proyectos" guarda los proyectos. Título, descripción, imagen, todo dentro.

Funciona durante un mes. Luego quieres los mismos proyectos en la portada y en la página "Sobre mí", y acabas con dos copias. La tercera semana ya no coinciden.

## 2. Un bloque compone, no almacena

La regla que lo ordena todo: **el bloque decide cómo se presenta algo, no qué es ese algo.**

El bloque de proyectos guarda el titular de la sección, la etiqueta, cuántos mostrar y en qué orden aparece. Los proyectos siguen viviendo en su colección. La portada y "Sobre mí" muestran los mismos datos porque los referencian, no porque los repitan.

### La excepción

Los bloques de contenido libre —un texto, una imagen suelta, un cierre— sí guardan lo suyo. Ahí el contenido **es** de esa página y no lo comparte nadie. Referenciarlo sería inventar una colección para un uso único.

La pregunta para decidir es siempre la misma: ¿esto lo va a querer enseñar otra página? Si sí, es una colección. Si no, va dentro del bloque.

<demo-bloques-cms></demo-bloques-cms>

## 3. Campos que aparecen cuando toca

Un bloque con doce campos de los que sólo aplican cuatro es un bloque que nadie rellena bien. Las condiciones de visibilidad no son un lujo:

```ts
admin: { condition: (_, hermanos) => hermanos?.modo === 'manual' }
```

Un campo que no aplica es peor que un campo que no existe: obliga a decidir si dejarlo vacío significa algo.

## 4. El editor no debería tener que saber maquetar

Si para que una página quede bien hay que elegir el orden correcto de siete bloques y acertar con tres números, el sistema está mal repartido. Los valores por defecto tienen que dar un resultado presentable, y las decisiones que siempre son la misma no deberían ser campos.

## 5. Conclusión

Cuando dudes de si un dato va en el bloque o en una colección, pregúntate cuántas páginas van a querer enseñarlo. Esa respuesta decide sola.
