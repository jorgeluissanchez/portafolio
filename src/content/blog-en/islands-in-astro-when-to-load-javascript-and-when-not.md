---
titulo: "Islands in Astro: when to load JavaScript and when not to"
extracto: "Most of what gets marked as an island is really a standalone script. The weight difference is an entire framework."
categoria: "Astro"
fecha: "2025-06-03"
minutos: 5
demo: "astro-islas"
es: "islas-en-astro-cuando-cargar-javascript-y-cuando-no"
cierre: {"titulo": "Does your static site ship half a megabyte of JavaScript?", "texto": "Most of it is almost always unnecessary. Let's see what really needs to hydrate and what can be plain HTML.", "accionEtiqueta": "Let's slim down your site"}
---

## 1. Zero JavaScript by default

Astro's idea is simple and radical: components run on the server and what reaches the browser is HTML. No runtime, no hydration, no component tree on the client.

When a specific part needs interactivity, you mark it as an island. Only that part hydrates; the rest of the page stays static HTML.

<demo-astro-islas></demo-astro-islas>

## 2. When you need an island

The useful question isn't "is this interactive?" but "does the state have to survive on the client?".

- A menu that opens and closes: no island needed. It's a fifteen-line `<script>`.
- A scroll animation: no island needed. It's a script that finds elements by attribute.
- A search box with combinable filters: that is an island.

Most of what gets marked as an island is really a standalone script. The weight difference is an entire framework.

### The directives

`client:load` hydrates as soon as it arrives. `client:idle` waits for the main thread to be free. `client:visible` waits for the component to enter the viewport, which is the right one for anything below the fold.

`client:only` doesn't render on the server: use it only when the component touches `window` during render, knowing you leave an empty gap until it hydrates.

## 3. The hidden cost of islands

Each island drags its framework along. Two React islands on a page don't load React twice, but a React island and a Vue island do load both.

And islands don't share state without an external store. If you find yourself building one so three islands can talk, what you probably want is one bigger island, or none.

## 4. What you gain

A blog page doesn't need JavaScript to show text. With this model, it doesn't ship any. The result isn't "faster": there's simply nothing to execute.

## 5. Conclusion

Start without islands. Add one when the `<script>` becomes awkward to maintain, not before.
