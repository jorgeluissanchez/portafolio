/** Entradas al hacer scroll, barra de progreso de lectura, índice activo y contadores de métricas. */
export function revelar() {
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('visible'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  document.querySelectorAll('[data-revelar], .imagen-revela').forEach((el) => io.observe(el));
}

export function progresoLectura(articulo: HTMLElement) {
  const barra = document.querySelector<HTMLElement>('.progreso');
  if (!barra) return;
  let pedido = false;
  const medir = () => {
    pedido = false;
    const r = articulo.getBoundingClientRect();
    const total = r.height - innerHeight * 0.6;
    barra.style.setProperty('--p', String(Math.min(1, Math.max(0, -r.top / Math.max(1, total)))));
  };
  addEventListener('scroll', () => !pedido && (pedido = true, requestAnimationFrame(medir)), { passive: true });
  medir();
}

export function indiceActivo() {
  const enlaces = [...document.querySelectorAll<HTMLAnchorElement>('.indice a')];
  if (!enlaces.length) return;
  const titulos = enlaces.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean) as HTMLElement[];
  const io = new IntersectionObserver(
    (es) => {
      const visible = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      enlaces.forEach((a) => a.setAttribute('aria-current', String(a.hash.slice(1) === visible.target.id)));
    },
    { rootMargin: '-80px 0px -65% 0px' },
  );
  titulos.forEach((t) => io.observe(t));
}

/** Cuenta desde 0 hasta el número de cada métrica cuando entra en pantalla ("81%", "1.º", "2025"…). */
export function contadores() {
  const calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const final = el.dataset.valor ?? el.textContent ?? '';
      const m = final.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
      if (!m || calma || /^\d{4}$/.test(final)) return;
      const objetivo = parseFloat(m[2].replace(',', '.'));
      const decimales = (m[2].split(/[.,]/)[1] ?? '').length;
      const t0 = performance.now();
      const paso = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        const v = objetivo * (1 - Math.pow(1 - k, 3));
        el.textContent = m[1] + v.toFixed(decimales).replace('.', ',') + m[3];
        if (k < 1) requestAnimationFrame(paso);
        else el.textContent = final;
      };
      requestAnimationFrame(paso);
    }),
  );
  document.querySelectorAll('[data-contador]').forEach((el) => io.observe(el));
}
