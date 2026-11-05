/** Demo · La cascada de red que decide el LCP: el problema casi nunca es el peso de la imagen sino cuándo se descubre. */
import { css, html } from 'lit';
import { Demo, t } from './base';

type Ajustes = { js: boolean; lazy: boolean; fuenteExterna: boolean; comprimir: boolean };
type Barra = { nombre: string; ini: number; dur: number; tipo: 'html' | 'css' | 'font' | 'js' | 'img'; bloquea?: boolean };

function cascada(a: Ajustes): { barras: Barra[]; lcp: number } {
  const b: Barra[] = [{ nombre: 'index.html', ini: 0, dur: 320, tipo: 'html' }];
  b.push({ nombre: t('estilos.css', 'styles.css'), ini: 260, dur: 240, tipo: 'css', bloquea: true });
  let fin = 500;
  if (a.fuenteExterna) {
    b.push({ nombre: t('fuente (otro dominio: DNS + TLS)', 'font (other domain: DNS + TLS)'), ini: 500, dur: 420, tipo: 'font', bloquea: true });
    fin = 920;
  }
  let descubre = 300; // el preload scanner ve la <img> en el HTML
  if (a.js) {
    b.push({ nombre: t('app.js (pinta la imagen)', 'app.js (renders the image)'), ini: 300, dur: 520, tipo: 'js' });
    descubre = 820;
  }
  if (a.lazy) descubre = Math.max(descubre, fin) + 380; // espera al layout para saber si está en pantalla
  const pesoImg = a.comprimir ? 230 : 300;
  b.push({ nombre: `${t('foto-portada', 'hero-photo')}.webp (${a.comprimir ? '120' : '180'} KB)`, ini: descubre, dur: pesoImg, tipo: 'img' });
  const lcp = Math.max(fin, descubre + pesoImg) + 40;
  return { barras: b, lcp };
}

class DemoCascadaLcp extends Demo {
  static properties = { a: { state: true }, animar: { state: true } };
  declare a: Ajustes;
  declare animar: number;

  constructor() {
    super();
    this.a = { js: true, lazy: true, fuenteExterna: true, comprimir: false };
    this.animar = 0;
  }
  protected alVer() { this.animar++; }

  private alternar(k: keyof Ajustes) {
    this.a = { ...this.a, [k]: !this.a[k] };
    this.animar++;
    this.marcar(k);
  }

  render() {
    const { barras, lcp } = cascada(this.a);
    const escala = 2600;
    const pct = (ms: number) => `${(ms / escala) * 100}%`;
    const nivel = lcp <= 1200 ? 'bien' : lcp <= 2000 ? 'medio' : 'mal';
    const op = (k: keyof Ajustes, si: string, no: string) => html`<button role="switch" aria-checked=${this.a[k]} class="op ${this.a[k] ? 'on' : ''}" @click=${() => this.alternar(k)}><i></i>${this.a[k] ? si : no}</button>`;
    return html`<div class="marco">
      <div class="cab"><p class="eyebrow">Demo · <b>${t('apaga los problemas y mira moverse el LCP', 'switch off the problems and watch LCP move')}</b></p></div>
      <div class="ops">
        ${op('js', t('La imagen la pinta JavaScript', 'JavaScript renders the image'), t('La imagen está en el HTML', 'The image is in the HTML'))}
        ${op('lazy', t('loading="lazy" en la portada', 'loading="lazy" on the hero'), t('Portada sin lazy', 'Hero without lazy'))}
        ${op('fuenteExterna', t('Fuente desde otro dominio', 'Font from another domain'), t('Fuente auto-alojada', 'Self-hosted font'))}
        ${op('comprimir', t('Imagen comprimida a 120 KB', 'Image compressed to 120 KB'), t('Imagen de 180 KB', '180 KB image'))}
      </div>
      <div class="red" data-v=${this.animar}>
        ${barras.map((x, i) => html`<div class="fila"><span class="nom">${x.nombre}</span><span class="pista"><i class="b ${x.tipo} ${x.bloquea ? 'bloq' : ''}" style="left:${pct(x.ini)};width:${pct(x.dur)};animation-delay:${i * 90}ms"></i></span></div>`)}
        <div class="lcp ${nivel}" style="left:calc(var(--col) + (100% - var(--col)) * ${lcp / escala})"><span>LCP ${t((lcp / 1000).toFixed(2).replace('.', ','), (lcp / 1000).toFixed(2))} s</span></div>
      </div>
      <p class="pie">${this.a.comprimir && (this.a.js || this.a.lazy)
        ? t(html`Comprimir ahorró <b>unos 70 ms</b>. El hueco antes de que arranque la imagen sigue ahí: eso es lo que hay que atacar primero.`, html`Compressing saved <b>about 70 ms</b>. The gap before the image starts is still there: that's what to fix first.`)
        : !this.a.js && !this.a.lazy
          ? t(html`La imagen se descubre en el <b>primer barrido del HTML</b> y arranca casi junto al CSS. Así se gana de verdad.`, html`The image is discovered in the <b>first pass over the HTML</b> and starts almost with the CSS. That's the real win.`)
          : t(html`Mira el hueco antes de la barra roja: ahí <b>no hay ni un byte de imagen</b>, y es lo que más suma al LCP.`, html`Look at the gap before the red bar: <b>not a single byte of image</b> loads there, and it's what adds the most to LCP.`)}</p>
    </div>`;
  }

  static styles = [Demo.base, css`
    .ops { display: grid; gap: 6px; margin-bottom: 16px; }
    @media (min-width: 640px) { .ops { grid-template-columns: 1fr 1fr; } }
    .op { all: unset; cursor: pointer; display: flex; gap: 10px; align-items: center; font-size: 13px; padding: 8px 10px; background: #fff; border: 1px solid var(--l); }
    .op i { flex: none; width: 30px; height: 16px; border-radius: 99px; background: #cfcac2; position: relative; transition: background-color .25s; }
    .op i::after { content: ''; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: #fff; transition: transform .25s cubic-bezier(.34,1.56,.64,1); }
    .op.on i { background: var(--r); } .op.on i::after { transform: translateX(14px); }
    .red { --col: 34%; position: relative; background: #fff; border: 1px solid var(--l); padding: 10px 0; }
    .fila { display: grid; grid-template-columns: var(--col) 1fr; align-items: center; height: 28px; }
    .nom { font-size: 11px; padding: 0 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: ui-monospace, Menlo, monospace; }
    .pista { position: relative; height: 100%; border-left: 1px solid var(--l); }
    .b { position: absolute; top: 8px; height: 12px; transform-origin: left; animation: crece .5s cubic-bezier(.22,1,.36,1) both; transition: left .5s cubic-bezier(.22,1,.36,1), width .5s cubic-bezier(.22,1,.36,1); }
    .html { background: #4a7bd0; } .css { background: #8a5cd0; } .font { background: #2fa36b; } .js { background: #e2a400; } .img { background: var(--r); }
    .bloq { background-image: repeating-linear-gradient(45deg, rgb(255 255 255 / .35) 0 4px, transparent 4px 8px); }
    .lcp { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--color-ink); transition: left .6s cubic-bezier(.22,1,.36,1); }
    .lcp span { position: absolute; bottom: calc(100% + 4px); transform: translateX(-50%); white-space: nowrap; font-size: 12px; font-weight: 600; padding: 3px 8px; color: #fff; background: var(--color-ink); }
    .lcp.bien span { background: #1f7a4d; } .lcp.medio span { background: #b07800; } .lcp.mal span { background: var(--r); }
    .red { margin-top: 30px; }
    @keyframes crece { from { transform: scaleX(0); } }
  `];
}
customElements.define('demo-cascada-lcp', DemoCascadaLcp);
