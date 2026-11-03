/**
 * Base de las demos animadas del blog.
 *
 * Cada demo explica UN concepto del artículo con algo que el lector puede tocar. Reglas comunes:
 * - Arranca sola la primera vez que entra en pantalla (y solo una vez), así se entiende sin hacer clic.
 * - Con «reducir movimiento» se muestra el estado final, sin animar.
 * - Los colores salen de los tokens del sitio (las variables CSS atraviesan el shadow DOM).
 */
import { LitElement, css } from 'lit';

export const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const espera = (ms: number) => new Promise((r) => setTimeout(r, reducido() ? 0 : ms));

export class Demo extends LitElement {
  private io?: IntersectionObserver;
  protected visto = false;

  connectedCallback() {
    super.connectedCallback();
    this.io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting) && !this.visto) {
          this.visto = true;
          this.io?.disconnect();
          this.alVer();
        }
      },
      { threshold: 0.45 },
    );
    this.io.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.io?.disconnect();
  }
  /** Se llama la primera vez que la demo entra en pantalla. */
  protected alVer() {}

  protected marcar(accion: string) {
    (window as any).dataLayer?.push({ event: 'blog_demo', demo: this.localName, accion });
  }

  static base = css`
    :host { display: block; margin: 40px 0; font-family: var(--font-grotesk, system-ui), sans-serif; color: var(--color-ink, #111); --r: var(--color-red, #e5341d); --l: rgb(17 17 17 / .12); }
    .marco { position: relative; border: 1px solid var(--l); background: var(--color-paper-2, #f9f7f2); padding: 20px; overflow: hidden; }
    @media (min-width: 768px) { .marco { padding: 28px; } }
    .cab { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .eyebrow { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--color-gray, #6e6b66); }
    .eyebrow b { color: var(--r); font-weight: 500; }
    .seg { display: inline-flex; border: 1px solid var(--l); background: #fff; padding: 3px; gap: 3px; }
    .seg button, .btn { all: unset; cursor: pointer; font-size: 13px; font-weight: 500; padding: 8px 12px; transition: background-color .25s, color .25s; white-space: nowrap; }
    .seg button[aria-pressed=true] { background: var(--color-ink, #111); color: #fff; }
    .seg button:not([aria-pressed=true]):hover { background: rgb(17 17 17 / .06); }
    .btn { border: 1px solid var(--color-ink, #111); background: #fff; display: inline-flex; gap: 8px; align-items: center; }
    .btn:hover { background: var(--color-ink, #111); color: #fff; }
    .btn.rojo { background: #dc3019; border-color: #dc3019; color: #fff; }
    .btn.rojo:hover { background: #c92b16; }
    button:focus-visible { outline: 2px solid var(--r); outline-offset: 2px; }
    .pie { margin: 16px 0 0; font-size: 14px; line-height: 1.5; color: var(--color-body, #40403d); min-height: 3em; }
    .pie b { color: var(--color-ink, #111); }
    code { font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace; font-size: .9em; background: rgb(17 17 17 / .06); padding: 1px 5px; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; } }
  `;
}
