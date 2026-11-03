---
titulo: "Screaming architecture: que la carpeta te diga qué hace la app"
extracto: "Una estructura que nombra el dominio en vez del framework, y la prueba de fuego para saber si la separación es real."
categoria: "Arquitectura"
fecha: "2025-04-22"
minutos: 4
demo: "carpetas-gritan"
cierre: {"titulo": "¿Cada cambio pequeño rompe tres sitios?", "texto": "Eso no es mala suerte, es acoplamiento. Revisamos la estructura de tu proyecto y por dónde empezar a separarlo sin parar el desarrollo.", "accionEtiqueta": "Revisemos tu estructura"}
---

## 1. Abre la carpeta y dime qué hace

Un proyecto con carpetas `components`, `utils`, `hooks` y `services` no dice nada sobre lo que hace la aplicación. Podría ser una tienda, un panel médico o un blog. La estructura describe la tecnología, no el problema.

La *screaming architecture* invierte eso: la primera carpeta que ves nombra el dominio. `proyectos`, `blog`, `contacto`. Abres el repositorio y sabes de qué va antes de leer una línea.

## 2. La regla práctica

Cada dominio se organiza igual por dentro:

- `ui/` — lo que se pinta. Marcado y estilos, sin lógica de negocio.
- `model/` — los tipos y las transformaciones puras.
- `api/` — de dónde salen los datos.
- `motion/` — el comportamiento en cliente.

La repetición es deliberada. Cuando toda feature tiene la misma forma, entrar en una que no conoces cuesta lo mismo que entrar en la tuya.

### Por qué separar `motion`

Una animación mezclada dentro del componente convierte cualquier cambio de diseño en un cambio de animación. Separada, el contrato entre las dos es un atributo (`data-reveal`) y no un `import`: puedes reescribir el componente entero sin abrir el archivo de la animación.

<demo-carpetas-gritan></demo-carpetas-gritan>

## 3. Lo compartido, al final

`shared/` existe, pero no es donde empiezas. Algo se mueve ahí cuando **ya** lo usan dos dominios, no cuando crees que lo van a usar. La abstracción prematura es la forma más cara de tener razón demasiado pronto.

## 4. La prueba de fuego

Si borras una feature entera, ¿el resto compila?

Si la respuesta es sí, la separación es real. Si aparecen veinte errores en sitios que no tenían nada que ver, lo que tienes son carpetas bonitas sobre un ovillo.

## 5. Conclusión

La estructura de carpetas es la primera documentación que lee alguien nuevo, y la única que nunca se queda obsoleta. Que grite el dominio, no el framework.
