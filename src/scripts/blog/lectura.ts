/**
 * Lectura interactiva, estilo Wattpad: cada párrafo del artículo recibe su me gusta y su hilo de comentarios.
 *
 * - El HTML del artículo llega completo desde el servidor (Google y las IA lo leen tal cual). Este script solo
 *   añade los controles encima, así que sin JavaScript el artículo se lee igual.
 * - Los ids de párrafo salen del orden y de las primeras palabras del texto: si se corrige una coma, el hilo no se
 *   pierde; si se reescribe el párrafo, empieza uno nuevo (que es lo correcto: el comentario era sobre otro texto).
 */
import { LitElement, css, html, nothing } from 'lit';
import { alternarLike, cargar, comentar, type Comentario, type Estado } from './reacciones-api';

const bus = new EventTarget();
let estado: Estado = { likes: {}, comentarios: {}, misLikes: [], enLinea: false };
let articulo = '';
const textos = new Map<string, string>();

const fijar = (e: Estado) => {
  estado = e;
  bus.dispatchEvent(new Event('cambio'));
};

function idParrafo(i: number, el: Element): string {
  const base = (el.textContent ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join('-');
  return `p${i}-${base}`.slice(0, 60);
}

class ReaccionParrafo extends LitElement {
  static properties = { pid: {}, _burst: { state: true } };
  declare pid: string;
  declare _burst: boolean;
  private onCambio = () => this.requestUpdate();

  constructor() {
    super();
    this._burst = false;
  }
  connectedCallback() {
    super.connectedCallback();
    bus.addEventListener('cambio', this.onCambio);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    bus.removeEventListener('cambio', this.onCambio);
  }

  private async like() {
    const ahora = !estado.misLikes.includes(this.pid);
    if (ahora && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._burst = true;
      setTimeout(() => (this._burst = false), 700);
    }
    fijar(await alternarLike(articulo, this.pid, estado));
    (window as any).dataLayer?.push({ event: 'blog_like', articulo, parrafo: this.pid, valor: ahora ? 1 : -1 });
  }
  private abrir() {
    bus.dispatchEvent(new CustomEvent('abrir', { detail: this.pid }));
  }

  render() {
    const n = estado.likes[this.pid] ?? 0;
    const c = estado.comentarios[this.pid]?.length ?? 0;
    const mio = estado.misLikes.includes(this.pid);
    return html`
      <button class="like ${mio ? 'on' : ''}" @click=${this.like} aria-pressed=${mio} aria-label=${mio ? 'Quitar me gusta a este párrafo' : 'Me gusta este párrafo'}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.4-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.7-7.5 10.1-7.5 10.1Z" /></svg>
        ${this._burst ? html`<span class="burst" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map((i) => html`<i style="--a:${i * 60}deg"></i>`)}</span>` : nothing}
        <span class="n">${n || ''}</span>
      </button>
      <button class="com" @click=${this.abrir} aria-label=${`Comentar este párrafo${c ? ` (${c} comentarios)` : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H9l-4 4V5Z" /></svg>
        <span class="n">${c || '+'}</span>
      </button>
    `;
  }

  static styles = css`
    :host { display: inline-flex; gap: 2px; font: 500 12px/1 var(--font-grotesk, system-ui), sans-serif; color: var(--color-gray, #6e6b66); }
    button { all: unset; cursor: pointer; position: relative; display: inline-flex; align-items: center; gap: 4px; padding: 6px 8px; border-radius: 999px; transition: background-color .2s, color .2s, transform .2s cubic-bezier(.34,1.56,.64,1); }
    button:hover { background: rgb(17 17 17 / .06); color: var(--color-ink, #111); }
    button:focus-visible { outline: 2px solid var(--color-red, #e5341d); outline-offset: 1px; }
    button:active { transform: scale(.92); }
    svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; transition: transform .35s cubic-bezier(.34,1.56,.64,1), fill .2s; }
    .like.on { color: var(--color-red, #e5341d); }
    .like.on svg { fill: currentColor; transform: scale(1.12); }
    .n { min-width: 1ch; font-variant-numeric: tabular-nums; }
    .burst { position: absolute; left: 16px; top: 15px; pointer-events: none; }
    .burst i { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: var(--color-red, #e5341d); animation: chispa .6s ease-out forwards; transform: rotate(var(--a)) translateY(0); }
    @keyframes chispa { to { transform: rotate(var(--a)) translateY(-18px) scale(.3); opacity: 0; } }
  `;
}

class PanelComentarios extends LitElement {
  static properties = { _pid: { state: true }, _enviando: { state: true }, _error: { state: true }, _ok: { state: true } };
  declare _pid: string | null;
  declare _enviando: boolean;
  declare _error: string;
  declare _ok: boolean;
  private onCambio = () => this.requestUpdate();
  private onAbrir = (e: Event) => {
    this._pid = (e as CustomEvent<string>).detail;
    this._error = '';
    this._ok = false;
    document.documentElement.style.overflow = 'hidden';
    this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('textarea')?.focus());
  };
  private onTecla = (e: KeyboardEvent) => e.key === 'Escape' && this._pid && this.cerrar();

  constructor() {
    super();
    this._pid = null;
    this._enviando = false;
    this._error = '';
    this._ok = false;
  }
  connectedCallback() {
    super.connectedCallback();
    bus.addEventListener('cambio', this.onCambio);
    bus.addEventListener('abrir', this.onAbrir);
    addEventListener('keydown', this.onTecla);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    bus.removeEventListener('cambio', this.onCambio);
    bus.removeEventListener('abrir', this.onAbrir);
    removeEventListener('keydown', this.onTecla);
  }
  private cerrar() {
    this._pid = null;
    document.documentElement.style.overflow = '';
  }

  private async enviar(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const datos = new FormData(form);
    const nombre = String(datos.get('nombre') ?? '').trim();
    const texto = String(datos.get('texto') ?? '').trim();
    if (!nombre || texto.length < 2) {
      this._error = 'Escribe tu nombre y un comentario.';
      return;
    }
    this._enviando = true;
    this._error = '';
    try {
      const c = await comentar(articulo, this._pid!, nombre, texto, String(datos.get('sitio') ?? ''));
      try { localStorage.setItem('nombre-comentario', nombre); } catch { /* */ }
      const lista = [...(estado.comentarios[this._pid!] ?? []), c];
      fijar({ ...estado, comentarios: { ...estado.comentarios, [this._pid!]: lista } });
      form.reset();
      this._ok = true;
      (window as any).dataLayer?.push({ event: 'blog_comentario', articulo, parrafo: this._pid });
    } catch (err: any) {
      this._error = err?.status === 429 ? 'Vas muy rápido. Espera un minuto y vuelve a intentarlo.' : 'No se pudo publicar. Inténtalo de nuevo en un momento.';
    } finally {
      this._enviando = false;
    }
  }

  render() {
    if (!this._pid) return nothing;
    const lista: Comentario[] = estado.comentarios[this._pid] ?? [];
    let nombreGuardado = '';
    try { nombreGuardado = localStorage.getItem('nombre-comentario') ?? ''; } catch { /* */ }
    const fecha = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' });
    return html`
      <div class="velo" @click=${this.cerrar}></div>
      <aside role="dialog" aria-modal="true" aria-labelledby="t">
        <header>
          <p class="eyebrow" id="t">Comentarios del párrafo</p>
          <button class="x" @click=${this.cerrar} aria-label="Cerrar comentarios">×</button>
        </header>
        <blockquote>${textos.get(this._pid)}</blockquote>
        <ol>
          ${lista.length
            ? lista.map((c) => html`<li><p class="quien"><b>${c.nombre}</b> · ${fecha.format(new Date(c.creado))}</p><p>${c.texto}</p></li>`)
            : html`<li class="vacio">Nadie ha comentado este párrafo. ¿Qué te pareció?</li>`}
        </ol>
        ${estado.enLinea
          ? html`<form @submit=${this.enviar}>
              <label>Tu nombre<input name="nombre" maxlength="60" autocomplete="name" .value=${nombreGuardado} required /></label>
              <label>Tu comentario<textarea name="texto" maxlength="800" rows="3" required></textarea></label>
              <label class="trampa" aria-hidden="true">No llenar<input name="sitio" tabindex="-1" autocomplete="off" /></label>
              ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
              ${this._ok ? html`<p class="ok" role="status">¡Publicado! Gracias por comentar.</p>` : nothing}
              <button type="submit" ?disabled=${this._enviando}>${this._enviando ? 'Publicando…' : 'Publicar comentario'}</button>
            </form>`
          : html`<p class="aviso">Los comentarios se están activando. Mientras tanto, ¿me lo cuentas por <a href="https://wa.me/573225822789?text=${encodeURIComponent('Hola Jorge, leí tu artículo y quería comentarte algo.')}" target="_blank" rel="noopener">WhatsApp</a>?</p>`}
      </aside>
    `;
  }

  static styles = css`
    :host { font-family: var(--font-grotesk, system-ui), sans-serif; color: var(--color-ink, #111); }
    .velo { position: fixed; inset: 0; z-index: 60; background: rgb(17 17 17 / .32); backdrop-filter: blur(2px); animation: aparece .25s ease-out; }
    aside { position: fixed; z-index: 61; background: var(--color-paper, #fdfdfd); display: flex; flex-direction: column; gap: 16px; padding: 20px; overflow: auto;
      inset: auto 0 0 0; max-height: 82dvh; border-radius: 16px 16px 0 0; animation: sube .35s cubic-bezier(.22,1,.36,1); }
    @media (min-width: 768px) { aside { inset: 0 0 0 auto; width: min(440px, 100vw); max-height: none; border-radius: 0; animation: entra .35s cubic-bezier(.22,1,.36,1); padding: 28px; } }
    header { display: flex; justify-content: space-between; align-items: center; }
    .eyebrow { margin: 0; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 500; color: var(--color-gray, #6e6b66); }
    .x { all: unset; cursor: pointer; font-size: 28px; line-height: 1; padding: 4px 8px; }
    blockquote { margin: 0; padding: 12px 14px; border-left: 3px solid var(--color-red, #e5341d); background: var(--color-paper-2, #f9f7f2); font: 400 18px/1.35 var(--font-instrument, Georgia), serif; max-height: 9.5em; overflow: hidden; }
    ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
    li p { margin: 0; line-height: 1.5; color: var(--color-body, #40403d); }
    .quien { font-size: 12px; color: var(--color-gray, #6e6b66); margin-bottom: 2px; }
    .quien b { color: var(--color-ink, #111); font-weight: 600; }
    .vacio { color: var(--color-gray, #6e6b66); }
    form { display: grid; gap: 10px; margin-top: auto; border-top: 1px solid rgb(17 17 17 / .12); padding-top: 16px; }
    label { display: grid; gap: 4px; font-size: 12px; color: var(--color-gray, #6e6b66); }
    input, textarea { font: inherit; font-size: 16px; color: var(--color-ink, #111); padding: 10px 12px; border: 1px solid rgb(17 17 17 / .2); background: #fff; border-radius: 4px; resize: vertical; }
    input:focus, textarea:focus { outline: 2px solid var(--color-red, #e5341d); outline-offset: 0; border-color: transparent; }
    .trampa { position: absolute; left: -9999px; }
    button[type=submit] { font-family: inherit; font-size: 15px; font-weight: 500; line-height: 1.3; background: #dc3019; color: #fff; border: 0; padding: 13px 18px; cursor: pointer; transition: background-color .2s; }
    button[type=submit]:hover { background: #c92b16; }
    button[disabled] { opacity: .6; cursor: progress; }
    .error { color: #b3261e; margin: 0; font-size: 14px; }
    .ok { color: #1f7a4d; margin: 0; font-size: 14px; }
    .aviso { margin-top: auto; padding: 14px; background: var(--color-paper-2, #f9f7f2); line-height: 1.5; font-size: 14px; }
    .aviso a { color: var(--color-red, #e5341d); }
    @keyframes aparece { from { opacity: 0; } }
    @keyframes sube { from { transform: translateY(100%); } }
    @keyframes entra { from { transform: translateX(100%); } }
    @media (prefers-reduced-motion: reduce) { .velo, aside { animation: none; } }
  `;
}

customElements.define('reaccion-parrafo', ReaccionParrafo);
customElements.define('panel-comentarios', PanelComentarios);

/** Prepara el artículo: un control por bloque de texto (párrafos, listas, citas). */
export async function iniciarLectura(raiz: HTMLElement) {
  articulo = raiz.dataset.articulo ?? location.pathname;
  const bloques = [...raiz.querySelectorAll<HTMLElement>(':scope > p, :scope > ul, :scope > ol, :scope > blockquote, :scope > [data-reaccionable]')]
    .filter((b) => (b.textContent ?? '').trim().length > 30);
  bloques.forEach((b, i) => {
    const pid = idParrafo(i, b);
    textos.set(pid, (b.textContent ?? '').trim().slice(0, 400));
    b.classList.add('bloque-reaccion');
    const r = document.createElement('reaccion-parrafo') as ReaccionParrafo;
    r.pid = pid;
    r.className = 'reaccion';
    if (b.tagName === 'P') b.append(r);
    else {
      // Listas y citas: el control va justo debajo (dentro de un <ul> solo puede haber <li>)
      const fila = document.createElement('div');
      fila.className = 'reaccion-fila';
      fila.append(r);
      b.after(fila);
    }
  });
  document.body.append(document.createElement('panel-comentarios'));
  fijar(await cargar(articulo));
}
