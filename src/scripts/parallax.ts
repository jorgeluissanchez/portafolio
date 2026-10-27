/**
 * Parallax (igual que en Pulxxe; solo escritorio con mouse y sin «reducir movimiento"):
 * - Inicio, con el cursor: --mx/--my (−1…1) se interpolan suave hacia el mouse y vuelven al centro al salir.
 *   El nombre se mueve con el cursor y la foto en sentido contrario (da profundidad).
 * - Inicio, con el scroll: --sy = píxeles recorridos. El nombre sube más rápido que la página y la foto baja (va más lenta).
 * - Proyectos, con el scroll: --pp (−1…1) mientras la sección cruza la pantalla; el nombre de fondo se desplaza.
 */
const desktop = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

function mouse() {
  const hero = document.querySelector<HTMLElement>('[data-hero-parallax]');
  if (!hero || !matchMedia(`(pointer: fine) and ${desktop}`).matches) return;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    hero.style.setProperty('--mx', x.toFixed(4));
    hero.style.setProperty('--my', y.toFixed(4));
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    kick();
  });
  hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
}

function scroll() {
  if (!matchMedia(desktop).matches) return;
  const hero = document.querySelector<HTMLElement>('[data-hero-parallax]');
  const sections = [...document.querySelectorAll<HTMLElement>('[data-scroll-parallax]')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    if (hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0) hero.style.setProperty('--sy', Math.max(0, -r.top).toFixed(1));
    }
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) s.style.setProperty('--pp', (((vh - r.top) / (vh + r.height)) * 2 - 1).toFixed(4));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

mouse();
scroll();

