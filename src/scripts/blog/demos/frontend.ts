/** Demos de frontend: capas de color, movimiento reducido, screaming architecture y bloques de CMS. */
import { css, html, nothing } from 'lit';
import { Demo, espera, t as tr } from './base';

/* ---------------------------------------------------------------- Capas de color */
const MARCAS = {
  Coral: { 500: '#e5341d', 600: '#c92b16', 50: '#fdeeeb' },
  Océano: { 500: '#1f6fd1', 600: '#185bb0', 50: '#e8f1fc' },
  Selva: { 500: '#1f8a5b', 600: '#18724a', 50: '#e5f4ec' },
};
class DemoCapasColor extends Demo {
  static properties = { marca: { state: true }, capa: { state: true } };
  declare marca: keyof typeof MARCAS;
  declare capa: number;
  constructor() { super(); this.marca = 'Coral'; this.capa = -1; }
  private nombre(k: string) { return tr(k, ({ Coral: 'Coral', Océano: 'Ocean', Selva: 'Jungle' } as Record<string, string>)[k]); }
  protected async alVer() {
    for (let i = 0; i < 5; i++) { this.capa = i; await espera(650); }
    this.capa = -1;
  }
  render() {
    const m = MARCAS[this.marca];
    const capas = [
      { n: tr('Primitivo', 'Primitive'), t: `--coral-500: ${m[500]}`, d: tr('El valor crudo. Nadie lo usa directamente.', 'The raw value. Nobody uses it directly.') },
      { n: tr('Marca', 'Brand'), t: tr('--marca: var(--coral-500)', '--brand: var(--coral-500)'), d: tr('Qué color es «nosotros».', 'Which color is "us".') },
      { n: tr('Rol', 'Role'), t: tr('--primary: var(--marca)', '--primary: var(--brand)'), d: tr('Para qué se usa: acción principal.', 'What it is for: the main action.') },
      { n: tr('Componente', 'Component'), t: tr('--boton-fondo: var(--primary)', '--button-bg: var(--primary)'), d: tr('Dónde se aplica.', 'Where it is applied.') },
      { n: tr('Estado', 'State'), t: tr('--boton-hover: var(--marca-600)', '--button-hover: var(--brand-600)'), d: tr('Cómo reacciona.', 'How it reacts.') },
    ];
    return html`<div class="marco" style="--m:${m[500]};--m6:${m[600]};--m0:${m[50]}">
      <div class="cab">
        <p class="eyebrow">Demo · <b>${tr('cambia la marca, cambia una línea', 'change the brand, change one line')}</b></p>
        <div class="seg" role="group" aria-label=${tr('Marca', 'Brand')}>${Object.keys(MARCAS).map((k) => html`<button aria-pressed=${this.marca === k} @click=${() => { this.marca = k as keyof typeof MARCAS; this.marcar(k); }}>${this.nombre(k)}</button>`)}</div>
      </div>
      <div class="grid">
        <ol class="capas">${capas.map((c, i) => html`<li class=${this.capa === i ? 'on' : ''} @mouseenter=${() => (this.capa = i)} @mouseleave=${() => (this.capa = -1)} tabindex="0" @focus=${() => (this.capa = i)}><span class="i">${i + 1}</span><span><b>${c.n}</b><code>${c.t}</code><small>${c.d}</small></span></li>`)}</ol>
        <div class="ui">
          <div class="tarjeta"><span class="etq">${tr('Nuevo', 'New')}</span><p>${tr('Plan Pyme', 'Small Business')}</p><small>${tr('Sitio web + tienda', 'Website + store')}</small><button class="cta">${tr('Cotizar', 'Get a quote')}</button><a>${tr('Ver detalles', 'See details')}</a></div>
        </div>
      </div>
      <p class="pie">${tr(html`Los componentes nunca escriben un color: piden un <b>rol</b>. Por eso cambiar de marca toca <b>una sola capa</b> y el resto se reacomoda solo.`, html`Components never write a color: they ask for a <b>role</b>. That's why changing the brand touches <b>a single layer</b> and everything else follows.`)}</p>
    </div>`;
  }
  static styles = [Demo.base, css`
    .grid { display: grid; gap: 16px; } @media (min-width: 680px) { .grid { grid-template-columns: 1.3fr 1fr; } }
    .capas { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
    .capas li { display: flex; gap: 10px; align-items: flex-start; padding: 8px 10px; background: #fff; border: 1px solid var(--l); transition: transform .3s cubic-bezier(.22,1,.36,1), border-color .3s; cursor: default; }
    .capas li.on { transform: translateX(8px); border-color: var(--m); }
    .capas .i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 600; background: var(--m0); color: var(--m); transition: background-color .5s, color .5s; }
    .capas b { display: block; font-size: 13px; } .capas code { display: inline-block; margin: 3px 0; font-size: 11.5px; word-break: break-all; } .capas small { color: var(--color-gray); font-size: 12px; }
    .ui { display: grid; place-items: center; background: #fff; border: 1px solid var(--l); padding: 20px; }
    .tarjeta { width: 100%; max-width: 230px; padding: 18px; border: 1px solid var(--l); display: grid; gap: 6px; transition: border-color .5s; }
    .etq { justify-self: start; font-size: 11px; padding: 3px 8px; background: var(--m0); color: var(--m); transition: all .5s; }
    .tarjeta p { margin: 0; font: 400 26px/1 var(--font-instrument, Georgia), serif; }
    .tarjeta small { color: var(--color-gray); }
    .cta { all: unset; cursor: pointer; text-align: center; padding: 11px; background: var(--m); color: #fff; font-weight: 500; font-size: 14px; transition: background-color .5s; }
    .cta:hover { background: var(--m6); }
    .tarjeta a { font-size: 13px; color: var(--m); text-decoration: underline; transition: color .5s; }
  `];
}

/* ---------------------------------------------------------------- Movimiento reducido */
class DemoMovimientoReducido extends Demo {
  static properties = { reducir: { state: true }, mal: { state: true }, k: { state: true } };
  declare reducir: boolean; declare mal: boolean; declare k: number;
  constructor() { super(); this.reducir = false; this.mal = false; this.k = 0; }
  protected alVer() { this.k++; }
  private repetir() { this.k++; }
  render() {
    const clase = this.reducir ? (this.mal ? 'oculto' : 'quieto') : 'anima';
    return html`<div class="marco">
      <div class="cab">
        <p class="eyebrow">Demo · <b>${tr('la misma entrada, tres lectores', 'same entrance, three readers')}</b></p>
        <div class="seg" role="group" aria-label=${tr('Preferencia del sistema', 'System preference')}>
          <button aria-pressed=${!this.reducir} @click=${() => { this.reducir = false; this.repetir(); }}>${tr('Movimiento normal', 'Normal motion')}</button>
          <button aria-pressed=${this.reducir} @click=${() => { this.reducir = true; this.repetir(); this.marcar('reducir'); }}>${tr('Reducir movimiento', 'Reduce motion')}</button>
        </div>
      </div>
      ${this.reducir ? html`<label class="trampa"><input type="checkbox" .checked=${this.mal} @change=${(e: Event) => { this.mal = (e.target as HTMLInputElement).checked; this.repetir(); }} /> ${tr(html`Implementación ingenua: <code>animation: none</code> sobre un elemento que empieza en <code>opacity: 0</code>`, html`Naive implementation: <code>animation: none</code> on an element that starts at <code>opacity: 0</code>`)}</label>` : nothing}
      <div class="pantalla">
        ${[0, 1, 2].map((i) => html`<div class="tarj ${clase}" style="--d:${i * 120}ms" data-k=${this.k}>${`${tr('Bloque', 'Block')} ${i + 1}`}<span></span><span></span></div>`)}
        ${this.reducir && this.mal ? html`<p class="vacio">${tr('Página en blanco: el contenido existe, pero nunca se hace visible.', 'Blank page: the content exists, but it never becomes visible.')}</p>` : nothing}
      </div>
      <button class="btn" @click=${() => this.repetir()}>↺ ${tr('Repetir entrada', 'Replay entrance')}</button>
      <p class="pie">${!this.reducir ? tr(html`Con movimiento normal, los bloques <b>suben y aparecen</b>.`, html`With normal motion, the blocks <b>rise and fade in</b>.`) : this.mal ? tr(html`El error grave: quitar la animación <b>sin quitar el estado inicial</b>. Quien pidió menos movimiento se queda sin contenido.`, html`The serious bug: removing the animation <b>without removing the initial state</b>. Whoever asked for less motion gets no content.`) : tr(html`Lo correcto: <b>sin desplazamiento</b> y el contenido visible desde el primer momento.`, html`The right way: <b>no movement</b> and the content visible from the start.`)}</p>
    </div>`;
  }
  updated() {
    // reinicia la animación de entrada en cada repetición
    this.renderRoot.querySelectorAll<HTMLElement>('.tarj').forEach((t) => { t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; });
  }
  static styles = [Demo.base, css`
    .trampa { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; margin-bottom: 12px; line-height: 1.4; }
    .pantalla { position: relative; display: grid; gap: 8px; padding: 16px; background: #fff; border: 1px solid var(--l); min-height: 170px; margin-bottom: 12px; }
    .tarj { padding: 12px; background: var(--color-paper-2); font-weight: 600; font-size: 13px; display: grid; gap: 6px; }
    .tarj span { height: 6px; background: var(--l); } .tarj span:last-child { width: 60%; }
    .anima { animation: sube .7s cubic-bezier(.22,1,.36,1) var(--d) both; }
    .quieto { animation: none; }
    .oculto { opacity: 0; animation: none; }
    .vacio { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; padding: 20px; text-align: center; color: var(--r); font-weight: 600; font-size: 14px; }
    @keyframes sube { from { opacity: 0; transform: translateY(40px); } }
  `];
}

/* ---------------------------------------------------------------- Screaming architecture */
const POR_TIPO = () => tr(['components/', '  Boton.astro', '  Tarjeta.astro', '  FormularioContacto.astro', 'hooks/', '  useCarrusel.ts', 'utils/', '  formatoFecha.ts', '  enviarLead.ts', 'pages/'],
  ['components/', '  Button.astro', '  Card.astro', '  ContactForm.astro', 'hooks/', '  useCarousel.ts', 'utils/', '  formatDate.ts', '  sendLead.ts', 'pages/']);
const POR_FUNCION = () => tr(['features/', '  blog/', '    ui/  api/  motion/', '  proyectos/', '    ui/  api/  motion/', '  contacto/', '    ui/  api/', 'shared/', '  ui/  lib/', 'pages/'],
  ['features/', '  blog/', '    ui/  api/  motion/', '  projects/', '    ui/  api/  motion/', '  contact/', '    ui/  api/', 'shared/', '  ui/  lib/', 'pages/']);
class DemoCarpetasGritan extends Demo {
  static properties = { funcion: { state: true } };
  declare funcion: boolean;
  constructor() { super(); this.funcion = false; }
  protected async alVer() { await espera(1400); this.funcion = true; }
  render() {
    const lineas = this.funcion ? POR_FUNCION() : POR_TIPO();
    return html`<div class="marco">
      <div class="cab">
        <p class="eyebrow">Demo · <b>${tr('abre la carpeta: ¿qué hace la app?', 'open the folder: what does the app do?')}</b></p>
        <div class="seg" role="group" aria-label=${tr('Organización', 'Organization')}><button aria-pressed=${!this.funcion} @click=${() => (this.funcion = false)}>${tr('Por tipo de archivo', 'By file type')}</button><button aria-pressed=${this.funcion} @click=${() => { this.funcion = true; this.marcar('funcion'); }}>${tr('Por función', 'By feature')}</button></div>
      </div>
      <div class="arbol" role="list">
        <p class="raiz">src/</p>
        ${lineas.map((l, i) => html`<p role="listitem" style="--i:${i};padding-left:${(l.length - l.trimStart().length) * 7 + 14}px" class=${l.includes('features') || /^ {2}(blog|proyectos|contacto|projects|contact)/.test(l) ? 'grita' : ''}>${l.trim().endsWith('/') ? '📁' : l.includes('/') ? '' : '📄'} ${l.trim()}</p>`)}
      </div>
      <p class="pie">${this.funcion ? tr(html`La carpeta <b>grita el negocio</b>: blog, proyectos, contacto. Lo que cambia junto vive junto.`, html`The folder <b>screams the business</b>: blog, projects, contact. What changes together lives together.`) : tr(html`Por tipo, la carpeta solo dice «esto es React/Astro». Para tocar el contacto hay que <b>abrir cuatro carpetas</b>.`, html`By type, the folder only says "this is React/Astro". To touch the contact form you have to <b>open four folders</b>.`)}</p>
    </div>`;
  }
  static styles = [Demo.base, css`
    .arbol { background: #111; color: #e8e4dc; padding: 14px 6px; font: 13px/1.7 ui-monospace, Menlo, monospace; min-height: 220px; }
    .arbol p { margin: 0; animation: entra .45s cubic-bezier(.22,1,.36,1) calc(var(--i, 0) * 45ms) both; }
    .raiz { color: #8f8a82; padding-left: 14px; }
    .grita { color: #ff7a63; font-weight: 600; }
    @keyframes entra { from { opacity: 0; transform: translateX(-10px); } }
  `];
}

/* ---------------------------------------------------------------- Bloques de CMS */
type Bloque = { tipo: 'Texto' | 'Imagen' | 'Llamada'; id: number };
class DemoBloquesCms extends Demo {
  static properties = { bloques: { state: true }, sel: { state: true }, fondo: { state: true } };
  declare bloques: Bloque[]; declare sel: number; declare fondo: boolean;
  private n = 3;
  constructor() { super(); this.bloques = [{ tipo: 'Texto', id: 1 }, { tipo: 'Imagen', id: 2 }]; this.sel = 2; this.fondo = false; }
  protected async alVer() { await espera(900); this.agregar('Llamada'); }
  private agregar(tipo: Bloque['tipo']) { this.bloques = [...this.bloques, { tipo, id: this.n++ }]; this.sel = this.n - 1; this.marcar(tipo); }
  render() {
    const b = this.bloques.find((x) => x.id === this.sel);
    const campos: Record<Bloque['tipo'], string[]> = tr(
      { Texto: ['Contenido'], Imagen: ['Archivo', 'Texto alternativo', '¿Ocupa todo el ancho?'], Llamada: ['Título', 'Botón', '¿Lleva fondo de color?'] },
      { Texto: ['Content'], Imagen: ['File', 'Alt text', '¿Full width?'], Llamada: ['Heading', 'Button', '¿Colored background?'] },
    );
    const nombre = (x: Bloque['tipo']) => tr(x, ({ Texto: 'Text', Imagen: 'Image', Llamada: 'Call to action' } as const)[x]);
    return html`<div class="marco">
      <div class="cab"><p class="eyebrow">Demo · <b>${tr('el bloque compone, la página decide', 'the block composes, the page decides')}</b></p>
        <div class="seg" role="group" aria-label=${tr('Añadir bloque', 'Add block')}>${(['Texto', 'Imagen', 'Llamada'] as const).map((k) => html`<button aria-pressed="false" @click=${() => this.agregar(k)}>+ ${nombre(k)}</button>`)}</div></div>
      <div class="grid">
        <ol class="lista">${this.bloques.map((x) => html`<li class=${x.id === this.sel ? 'on' : ''}><button @click=${() => (this.sel = x.id)}>${nombre(x.tipo)}</button><button class="q" aria-label=${tr('Quitar bloque', 'Remove block')} @click=${() => (this.bloques = this.bloques.filter((y) => y.id !== x.id))}>×</button></li>`)}</ol>
        <div class="panel">${b ? html`<p class="eyebrow">${tr('Campos de', 'Fields for')} «${nombre(b.tipo)}»</p>${campos[b.tipo].map((c) => c.startsWith('¿') ? html`<label class="sw"><input type="checkbox" @change=${(e: Event) => (this.fondo = (e.target as HTMLInputElement).checked)} /> ${tr(c, c.slice(1))}</label>` : html`<label>${c}<span></span></label>`)}${b.tipo === 'Llamada' && this.fondo ? html`<label class="nuevo">${tr('Color de fondo', 'Background color')}<span></span></label>` : nothing}` : html`<p class="eyebrow">${tr('Elige un bloque', 'Pick a block')}</p>`}</div>
        <div class="vista">${this.bloques.map((x) => html`<div class="pv ${x.tipo} ${x.tipo === 'Llamada' && this.fondo ? 'fondo' : ''} ${x.id === this.sel ? 'on' : ''}">${x.tipo === 'Texto' ? html`<i></i><i></i><i class="c"></i>` : x.tipo === 'Imagen' ? html`<div class="img"></div>` : html`<b>${tr('¿Hablamos?', "Let's talk?")}</b><span>${tr('Escríbeme', 'Message me')}</span>`}</div>`)}</div>
      </div>
      <p class="pie">${tr(html`Cada bloque guarda <b>solo lo suyo</b> y muestra un campo cuando tiene sentido (activa el fondo de la llamada). El orden y el espaciado los pone la página, no quien edita.`, html`Each block stores <b>only its own content</b> and shows a field only when it applies (turn on the call to action's background). Order and spacing come from the page, not from the editor.`)}</p>
    </div>`;
  }
  static styles = [Demo.base, css`
    .grid { display: grid; gap: 12px; } @media (min-width: 720px) { .grid { grid-template-columns: 150px 1fr 1fr; } }
    .lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; align-content: start; }
    .lista li { display: flex; background: #fff; border: 1px solid var(--l); animation: entra .35s cubic-bezier(.22,1,.36,1); }
    .lista li.on { border-color: var(--color-ink); }
    .lista button { all: unset; cursor: pointer; padding: 8px 10px; font-size: 13px; flex: 1; } .lista .q { flex: 0; color: var(--color-gray); }
    .panel { background: #fff; border: 1px solid var(--l); padding: 12px; display: grid; gap: 8px; align-content: start; }
    .panel label { display: grid; gap: 4px; font-size: 12px; color: var(--color-gray); animation: entra .3s ease-out; }
    .panel label span { height: 30px; border: 1px solid var(--l); }
    .panel .sw { display: flex; align-items: center; gap: 8px; color: var(--color-ink); }
    .panel .nuevo span { background: linear-gradient(90deg, var(--r) 30%, #fff 30%); }
    .vista { background: #fff; border: 1px solid var(--l); padding: 12px; display: grid; gap: 10px; align-content: start; }
    .pv { padding: 8px; outline: 1px dashed transparent; transition: outline-color .3s, background-color .4s; animation: entra .35s cubic-bezier(.22,1,.36,1); display: grid; gap: 5px; }
    .pv.on { outline-color: var(--r); }
    .pv i { height: 6px; background: var(--l); } .pv i.c { width: 55%; }
    .pv .img { height: 56px; background: linear-gradient(135deg, #d9d3c9, #f1ede6); }
    .pv.Llamada { text-align: center; } .pv.Llamada b { font: 400 20px/1 var(--font-instrument, Georgia), serif; } .pv.Llamada span { font-size: 12px; text-decoration: underline; }
    .pv.fondo { background: var(--r); color: #fff; }
    @keyframes entra { from { opacity: 0; transform: translateY(6px); } }
  `];
}

customElements.define('demo-capas-color', DemoCapasColor);
customElements.define('demo-movimiento-reducido', DemoMovimientoReducido);
customElements.define('demo-carpetas-gritan', DemoCarpetasGritan);
customElements.define('demo-bloques-cms', DemoBloquesCms);
