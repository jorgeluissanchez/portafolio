---
titulo: "Screaming architecture: let the folder tell you what the app does"
extracto: "A structure that names the domain instead of the framework, and the acid test to know whether the separation is real."
categoria: "Architecture"
fecha: "2025-04-22"
minutos: 4
demo: "carpetas-gritan"
es: "screaming-architecture-que-la-carpeta-te-diga-que-hace-la-app"
cierre: {"titulo": "Does every small change break three things?", "texto": "That's not bad luck, it's coupling. Let's review your project structure and where to start separating it without stopping development.", "accionEtiqueta": "Let's review your structure"}
---

## 1. Open the folder and tell me what it does

A project with `components`, `utils`, `hooks` and `services` folders says nothing about what the application does. It could be a store, a medical dashboard or a blog. The structure describes the technology, not the problem.

*Screaming architecture* flips that: the first folder you see names the domain. `projects`, `blog`, `contact`. You open the repository and know what it's about before reading a line.

## 2. The practical rule

Every domain is organized the same way inside:

- `ui/`: what gets rendered. Markup and styles, no business logic.
- `model/`: types and pure transformations.
- `api/`: where the data comes from.
- `motion/`: client-side behavior.

The repetition is deliberate. When every feature has the same shape, stepping into one you don't know costs the same as stepping into your own.

### Why separate `motion`

An animation mixed inside the component turns every design change into an animation change. Separated, the contract between the two is an attribute (`data-reveal`), not an `import`: you can rewrite the whole component without opening the animation file.

<demo-carpetas-gritan></demo-carpetas-gritan>

## 3. Shared code, last

`shared/` exists, but it's not where you start. Something moves there when two domains **already** use it, not when you think they will. Premature abstraction is the most expensive way to be right too early.

## 4. The acid test

If you delete an entire feature, does the rest compile?

If the answer is yes, the separation is real. If twenty errors show up in places that had nothing to do with it, what you have is pretty folders on top of a tangle.

## 5. Conclusion

The folder structure is the first documentation a newcomer reads, and the only one that never goes stale. Let it scream the domain, not the framework.
