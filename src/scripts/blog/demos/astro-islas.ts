/** Demo · Islas en Astro: HTML estático por defecto y JavaScript solo donde hace falta, según la directiva. */
import { css, html } from 'lit';
import { Demo, espera } from './base';

type Directiva = 'load' | 'idle' | 'visible';
type Isla = { id: string; nombre: string; kb: number; directiva: Directiva; y: number };

class DemoAstroIslas extends Demo {
  static properties = { islas: { state: true }, t: { state: true }, corriendo: { state: true }, modoSpa: { state: true } };
  declare islas: Isla[];
  declare t: number;
  declare corriendo: boolean;
  declare modoSpa: boolean;
  private raf = 0;

  constructor() {
    super();
    this.islas = [
      { id: 'buscador', nombre: 'Buscador con filtros', kb: 42, directiva: 'load', y: 1 },
      { id: 'galeria', nombre: 'Galería', kb: 18, directiva: 'visible', y: 3 },
      { id: 'chat', nombre: 'Chat de soporte', kb: 31, directiva: 'idle', y: 4 },
    ];
    this.t = 0;
    this.corriendo = false;
    this.modoSpa = false;
  }

  protected alVer() { this.reproducir(); }

  /** Momento (0–1) en que cada isla se hidrata según su directiva. */
  private cuando(d: Directiva, y: number) {
    if (this.modoSpa) return 0.35;
    return d === 'load' ? 0.25 : d === 'idle' ? 0.55 : 0.55 + y * 0.09;
  }

  private async reproducir() {
    cancelAnimationFrame(this.raf);
    this.corriendo = true;
    this.t = 0;
    await espera(100);
    const inicio = performance.now();
    const dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 4200;
    const paso = (ahora: number) => {
      this.t = Math.min(1, (ahora - inicio) / dur);
      if (this.t < 1) this.raf = requestAnimationFrame(paso);
      else this.corriendo = false;
    };
    this.raf = requestAnimationFrame(paso);
  }

  private ciclo(i: number) {
    const orden: Directiva[] = ['load', 'idle', 'visible'];
    this.islas = this.islas.map((x, j) => (j === i ? { ...x, directiva: orden[(orden.indexOf(x.directiva) + 1) % 3] } : x));
    this.marcar('directiva');
    this.reproducir();
  }

  render() {
    const kbTotal = this.modoSpa ? 140 + this.islas.reduce((s, x) => s + x.kb, 0) : this.islas.filter((x) => this.t >= this.cuando(x.directiva, x.y)).reduce((s, x) => s + x.kb, 0);
    const kbMostrado = this.modoSpa ? Math.round(kbTotal * Math.min(1, this.t / 0.35)) : kbTotal;
    const scroll = Math.max(0, (this.t - 0.6) / 0.4);
    return html`<div class="marco">
      <div class="cab">
        <p class="eyebrow">Demo · <b>¿cuándo llega el JavaScript?</b></p>
        <div class="seg" role="group" aria-label="Modelo">
          <button aria-pressed=${!this.modoSpa} @click=${() => { this.modoSpa = false; this.reproducir(); }}>Astro con islas</button>
          <button aria-pressed=${this.modoSpa} @click=${() => { this.modoSpa = true; this.reproducir(); this.marcar('spa'); }}>Todo en el cliente</button>
        </div>
      </div>
      <div class="escena">
        <div class="pagina" style="--s:${scroll}">
          <div class="bloque html titulo">HTML · título</div>
          ${[0, 1, 2, 3, 4, 5].map((y) => {
            const isla = this.islas.find((x) => x.y === y);
            if (!isla) return html`<div class="bloque html">HTML estático · 0 KB de JS</div>`;
            const viva = this.t >= this.cuando(isla.directiva, isla.y);
            const i = this.islas.indexOf(isla);
            return html`<button class="bloque isla ${viva ? 'viva' : ''}" @click=${() => this.ciclo(i)} aria-label=${`${isla.nombre}: client:${isla.directiva}. Toca para cambiar la directiva`}>
              <span>${isla.nombre}</span>
              <code>${this.modoSpa ? 'todo hidrata' : `client:${isla.directiva}`}</code>
              <em>${viva ? `+${isla.kb} KB` : 'aún HTML'}</em>
            </button>`;
          })}
        </div>
        <div class="medidor" aria-live="polite">
          <p class="eyebrow">JS descargado</p>
          <p class="kb">${kbMostrado}<small> KB</small></p>
          <div class="linea"><i style="width:${this.t * 100}%"></i></div>
          <p class="fase">${this.t < 0.25 ? 'llega el HTML y se pinta' : this.t < 0.55 ? 'carga inicial' : this.t < 0.99 ? 'el lector hace scroll…' : 'listo'}</p>
          <button class="btn" @click=${() => { this.reproducir(); this.marcar('repetir'); }} ?disabled=${this.corriendo}>↺ Repetir carga</button>
        </div>
      </div>
      <p class="pie">${this.modoSpa
        ? html`Todo se hidrata al cargar: <b>el framework y cada componente viajan aunque nadie los use</b>.`
        : html`Solo las islas traen JavaScript, y cada una cuando le toca. <b>Toca una isla</b> para cambiar su directiva (<code>load</code> → <code>idle</code> → <code>visible</code>).`}</p>
    </div>`;
  }

  static styles = [Demo.base, css`
    .escena { display: grid; gap: 16px; }
    @media (min-width: 640px) { .escena { grid-template-columns: 1.4fr 1fr; } }
    .pagina { height: 260px; overflow: hidden; background: #fff; border: 1px solid var(--l); padding: 10px; display: flex; flex-direction: column; gap: 8px; }
    .pagina > * { transform: translateY(calc(var(--s) * -110px)); }
    .bloque { all: unset; box-sizing: border-box; min-height: 38px; padding: 8px 10px; font-size: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .html { background: var(--color-paper-2); color: var(--color-gray); }
    .titulo { min-height: 46px; font-weight: 600; color: var(--color-ink); }
    .isla { cursor: pointer; border: 1.5px dashed var(--color-gray); background: #fff; transition: border-color .3s, background-color .3s, box-shadow .4s; }
    .isla span { font-weight: 600; }
    .isla em { margin-left: auto; font-style: normal; color: var(--color-gray); }
    .isla.viva { border-style: solid; border-color: var(--r); background: #fff4f2; box-shadow: 0 0 0 4px rgb(229 52 29 / .12); }
    .isla.viva em { color: var(--r); font-weight: 600; }
    .medidor { display: flex; flex-direction: column; gap: 8px; }
    .kb { margin: 0; font: 400 56px/1 var(--font-anton, Impact), sans-serif; font-variant-numeric: tabular-nums; }
    .kb small { font-size: 18px; color: var(--color-gray); font-family: var(--font-grotesk); }
    .linea { height: 4px; background: var(--l); } .linea i { display: block; height: 100%; background: var(--color-ink); }
    .fase { margin: 0; font-size: 13px; color: var(--color-gray); min-height: 1.4em; }
    .btn { align-self: flex-start; } .btn[disabled] { opacity: .4; pointer-events: none; }
  `];
}
customElements.define('demo-astro-islas', DemoAstroIslas);
