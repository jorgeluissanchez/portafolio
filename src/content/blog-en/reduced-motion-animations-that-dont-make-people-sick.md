---
titulo: "Animations that don't make people sick: reduced motion done right"
extracto: "The bug that leaves the page blank, and why you have to touch three layers, not one, to respect prefers-reduced-motion."
categoria: "Animation"
fecha: "2025-05-20"
minutos: 5
demo: "movimiento-reducido"
es: "animaciones-que-no-marean-movimiento-reducido-en-serio"
cierre: {"titulo": "Have you tested your site with motion turned off?", "texto": "On half the sites that support it, the content never shows up. I'll check yours and tell you what's missing.", "accionEtiqueta": "Have me check it"}
---

## 1. Making people dizzy is not animating

`prefers-reduced-motion` is not an aesthetic preference. For some people, a parallax scroll causes real nausea, like riding in the back seat of a car. When the operating system says "less motion", that's what it's telling you.

The right answer is not just turning animation off. It's showing the same content without the motion.

## 2. The serious bug: a blank page

Almost every entrance animation starts the element at `opacity: 0` and takes it to `1`. If the animation doesn't run because the user asked for reduced motion, the element stays **invisible**.

The page doesn't "not animate": it disappears.

And it's an easy bug to ship, because whoever tests it sees that there's indeed no motion and signs off without checking that nothing is visible either.

### The rule

The final state must be reachable without the animation. In practice: the class that hides is only applied when animation is available, or there's a rule that reverts it under `prefers-reduced-motion`.

<demo-movimiento-reducido></demo-movimiento-reducido>

## 3. Three places, not one

Covering this properly means touching three layers:

**CSS.** Durations set to 1 ms under the media query. This turns off component transitions.

**JavaScript.** `gsap.matchMedia()` instead of `window.matchMedia`, because it automatically reverts everything created inside it when the condition stops matching, including scroll triggers, which otherwise stay hanging.

**The reveal utility.** It returns elements to their visible state.

None of the three is enough on its own. With CSS only, libraries that write inline styles ignore it. With JavaScript only, CSS transitions keep running.

## 4. What can stay

Reduced motion doesn't mean zero motion. A color change, a short fade, an underline that grows: none of that causes dizziness because it doesn't simulate movement through space.

What goes is what moves a lot: parallax, entrances from off-screen, rotations, large scaling.

## 5. Conclusion

Test with the preference turned on before calling an animation done. If the page stays empty, you didn't build an accessible animation: you built a page that doesn't load for some people.
