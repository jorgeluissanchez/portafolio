---
titulo: "Payload CMS: blocks that compose, not store"
extracto: "The rule that keeps the same information from ending up duplicated across four pages and out of sync the next month."
categoria: "CMS"
fecha: "2025-06-17"
minutos: 5
demo: "bloques-cms"
es: "payload-cms-bloques-que-componen-no-que-almacenan"
cierre: {"titulo": "Does your team edit the same information in four places?", "texto": "It's fixed with the content model, not with discipline. I'll set up a CMS where each piece of data lives in one place.", "accionEtiqueta": "Let's talk about your CMS"}
---

## 1. The mistake of storing data in the block

The first time you build a page out of blocks, the temptation is obvious: the "Projects" block stores the projects. Title, description, image, all inside.

It works for a month. Then you want the same projects on the home page and the "About" page, and you end up with two copies. By the third week they no longer match.

## 2. A block composes, it doesn't store

The rule that sorts everything out: **the block decides how something is presented, not what that something is.**

The projects block stores the section heading, the label, how many to show and the order. The projects keep living in their collection. The home page and "About" show the same data because they reference it, not because they repeat it.

### The exception

Free-content blocks (a piece of text, a standalone image, a closing section) do store their own content. There the content **belongs** to that page and nobody shares it. Referencing it would mean inventing a collection for a single use.

The question to decide is always the same: will another page want to show this? If yes, it's a collection. If not, it goes inside the block.

<demo-bloques-cms></demo-bloques-cms>

## 3. Fields that appear when they apply

A block with twelve fields of which only four apply is a block nobody fills in correctly. Visibility conditions aren't a luxury:

```ts
admin: { condition: (_, siblings) => siblings?.mode === 'manual' }
```

A field that doesn't apply is worse than a field that doesn't exist: it forces people to decide whether leaving it empty means something.

## 4. Editors shouldn't need to know layout

If getting a page to look right means choosing the correct order of seven blocks and nailing three numbers, the system is badly divided. Defaults must produce a presentable result, and decisions that are always the same shouldn't be fields.

## 5. Conclusion

When you're unsure whether a piece of data goes in the block or in a collection, ask how many pages will want to show it. That answer decides on its own.
