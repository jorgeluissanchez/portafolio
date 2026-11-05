---
titulo: "Why your page is slow: LCP is not the image"
extracto: "The time is lost before the image even starts downloading. Where to look, and the three things that actually move the needle."
categoria: "Performance"
fecha: "2025-04-08"
minutos: 5
demo: "cascada-lcp"
es: "por-que-tu-pagina-tarda-el-lcp-no-es-la-imagen"
cierre: {"titulo": "Is your site slow and you don't know where to go next?", "texto": "I'll look at your site's real loading order and tell you what's blocking what, with measurements instead of hunches.", "accionEtiqueta": "Let's audit your loading"}
---

## 1. LCP doesn't measure what you think

*Largest Contentful Paint* measures when the largest element in the first viewport appears. It's almost always an image, so the automatic conclusion is "we need to optimize the image". And it's almost always the wrong conclusion.

The image can't start downloading until the browser knows it exists. Everything that happens before that discovery adds to LCP without showing up in the file size.

## 2. What happens before the image

The real order is this:

1. The browser requests the HTML.
2. It reads it from top to bottom.
3. It hits a stylesheet and **stops**: CSS blocks rendering.
4. It hits the image and requests it.
5. The image arrives and gets painted.

Between step 1 and step 4 there can be a good half second, and not a single byte of image in it. A font loaded from another domain adds a DNS lookup and a TLS *handshake* before it can even be requested.

### How to see it

In the *Network* tab of the developer tools, sort by *Waterfall* and look for the gap between the HTML arriving and the image starting. That gap is your problem.

<demo-cascada-lcp></demo-cascada-lcp>

## 3. The three things that actually move the needle

**Get the image discovered early.** If JavaScript renders it, the browser doesn't see it until that JavaScript downloads and runs. An `<img>` in the HTML is discovered in the *preload scanner*'s first pass.

**Remove `loading="lazy"` from the top one.** It's the most repeated mistake: lazy loading gets applied to the whole site in one go, and it delays exactly the image that defines LCP.

**Reserve the space.** `width` and `height` don't speed anything up, but they stop the rest of the page from jumping when the image arrives, and that jump is what users perceive as slowness.

## 4. What's almost never worth it

Shrinking the image from 180 KB to 120 KB. On a decent connection that's a few tens of milliseconds, while the discovery gap is measured in hundreds.

Optimize the weight, yes, but after looking at the order. Starting there is polishing the last stretch of a race you lose at the start.

## 5. Conclusion

LCP is a sequencing problem before it's a size problem. Before compressing anything again, look at when the download starts: there's almost always more to gain there than in the file.
