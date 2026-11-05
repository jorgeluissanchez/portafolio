---
titulo: "Tailwind without the mess: color in five layers"
extracto: "Why variables aren't enough, what separates a primitive from a role, and why --primary is not your brand color."
categoria: "Design systems"
fecha: "2025-05-06"
minutos: 6
demo: "capas-color"
es: "tailwind-sin-desorden-el-color-en-cinco-capas"
cierre: {"titulo": "How many different blues are in your product?", "texto": "If nobody knows which one is right, you don't need a palette: you need a cast of roles. I'll help you set it up.", "accionEtiqueta": "Let's organize your system"}
---

## 1. The problem with loose colors

A project starts with `--blue: #2563eb`. Three months later there's `--blue-2`, `--dark-blue` and a `#2463ea` copied by hand into two components. Nobody remembers which one is right, and changing the brand becomes a global search.

The failure isn't a lack of variables. It's that the variables name **colors** instead of **roles**.

## 2. Five layers

The structure I use separates what a color *is* from what it's *for*:

**Primitives.** The raw ramps: `--neutral-100`, `--vermilion-500`. Nobody uses them directly in a component.

**Themes.** This is where roles get assigned: `--background`, `--foreground`, `--primary`. A theme is a different assignment of the same primitives.

**Bridge.** It translates those roles into framework utilities, so you can write `bg-background` without thinking.

**Base.** Default element styles, so a document without classes already speaks with the system's voice.

**Utilities.** The recurring custom gestures: a top rule, a label, a reveal.

### What you gain

A component written against roles works in every theme without touching it. Adding dark mode stops being component work and becomes work on a single layer.

<demo-capas-color></demo-capas-color>

## 3. `--primary` is not the brand

It's the most common conceptual mistake. `--primary` means "the main action in this area", and its value changes with context: on an accent background, the main action has to be dark, not the brand color.

If you tie `--primary` to the corporate color, the day you paint a section in that color the button disappears into the background.

## 4. Derive instead of declaring

In-between shades are computed:

```css
--primary-stroke: color-mix(in oklab, var(--primary) 30%, transparent);
```

That way a button's soft border follows the role's color without declaring it four times. And in OKLab the mix keeps perceived lightness, which doesn't happen in sRGB, where the in-between shades come out dull.

## 5. Conclusion

A color system is not a palette, it's a cast of roles. The palette changes; the roles almost never do.
