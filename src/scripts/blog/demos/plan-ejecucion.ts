/** Demo · Leer un EXPLAIN PLAN de dentro hacia fuera, y lo que pasa cuando una función en el WHERE apaga el índice. */
import { css, html } from 'lit';
import { Demo, espera, t } from './base';

type Op = { op: string; obj?: string; nivel: number; est: number; real: number; malo?: boolean };

// En inglés el esquema de ejemplo usa nombres en inglés, igual que en el artículo (UPPER(name))
const tabla = () => t('CLIENTES', 'CUSTOMERS');
const idxNombre = () => t('IDX_CLIENTES_NOMBRE', 'IDX_CUSTOMERS_NAME');
const idxPedidos = () => t('IDX_PEDIDOS_CLIENTE', 'IDX_ORDERS_CUSTOMER');
const BUENO = (): Op[] => [
  { op: 'SELECT STATEMENT', nivel: 0, est: 12, real: 12 },
  { op: 'NESTED LOOPS', nivel: 1, est: 12, real: 12 },
  { op: 'TABLE ACCESS BY INDEX ROWID', obj: tabla(), nivel: 2, est: 3, real: 3 },
  { op: 'INDEX RANGE SCAN', obj: idxNombre(), nivel: 3, est: 3, real: 3 },
  { op: 'INDEX RANGE SCAN', obj: idxPedidos(), nivel: 2, est: 4, real: 4 },
];
const MALO = (): Op[] => [
  { op: 'SELECT STATEMENT', nivel: 0, est: 12, real: 12 },
  { op: 'NESTED LOOPS', nivel: 1, est: 10, real: 412000, malo: true },
  { op: 'TABLE ACCESS FULL', obj: tabla(), nivel: 2, est: 10, real: 103000, malo: true },
  { op: 'INDEX RANGE SCAN', obj: idxPedidos(), nivel: 2, est: 4, real: 4 },
];

/** Orden de ejecución: primero lo más indentado (hojas), luego quien las consume. */
function orden(ops: Op[]): number[] {
  const hijos = (i: number) => {
    const r: number[] = [];
    for (let j = i + 1; j < ops.length && ops[j].nivel > ops[i].nivel; j++) if (ops[j].nivel === ops[i].nivel + 1) r.push(j);
    return r;
  };
  const visita = (i: number): number[] => [...hijos(i).flatMap(visita), i];
  return visita(0);
}

class DemoPlanEjecucion extends Demo {
  static properties = { conFuncion: { state: true }, paso: { state: true } };
  declare conFuncion: boolean;
  declare paso: number;
  private corrida = 0;

  constructor() {
    super();
    this.conFuncion = false;
    this.paso = -1;
  }
  protected alVer() { this.recorrer(); }

  private get ops() { return this.conFuncion ? MALO() : BUENO(); }

  private async recorrer() {
    const yo = ++this.corrida;
    const seq = orden(this.ops);
    for (let k = 0; k < seq.length; k++) {
      if (yo !== this.corrida) return;
      this.paso = k;
      await espera(900);
    }
  }

  render() {
    const seq = orden(this.ops);
    const activo = seq[this.paso] ?? -1;
    const max = Math.max(...this.ops.map((o) => Math.max(o.est, o.real)));
    const ancho = (n: number) => `${Math.max(2, (Math.log10(n + 1) / Math.log10(max + 1)) * 100)}%`;
    return html`<div class="marco">
      <div class="cab">
        <p class="eyebrow">Demo · <b>${t('el plan se lee de dentro hacia fuera', 'read the plan from the inside out')}</b></p>
        <div class="seg" role="group" aria-label=${t('Filtro de la consulta', 'Query filter')}>
          <button aria-pressed=${!this.conFuncion} @click=${() => { this.conFuncion = false; this.recorrer(); }}><code>${t('nombre', 'name')} = :n</code></button>
          <button aria-pressed=${this.conFuncion} @click=${() => { this.conFuncion = true; this.recorrer(); this.marcar('upper'); }}><code>UPPER(${t('nombre', 'name')}) = :n</code></button>
        </div>
      </div>
      <ol class="plan">
        ${this.ops.map((o, i) => {
          const n = seq.indexOf(i);
          const hecho = n <= this.paso;
          return html`<li class="${i === activo ? 'activo' : ''} ${hecho ? 'hecho' : ''} ${o.malo && hecho ? 'malo' : ''}" style="--nivel:${o.nivel}">
            <span class="num">${n + 1}</span>
            <span class="op">${o.op}${o.obj ? html` <small>${o.obj}</small>` : ''}</span>
            <span class="barras" aria-label=${t(`Estimadas ${o.est}, reales ${o.real}`, `Estimated ${o.est}, actual ${o.real}`)}>
              <i class="est" style="width:${ancho(o.est)}"></i>
              <i class="real" style="width:${hecho ? ancho(o.real) : '0%'}"></i>
            </span>
            <span class="cifras">${o.est.toLocaleString(t('es-CO', 'en-US'))} → <b>${hecho ? o.real.toLocaleString(t('es-CO', 'en-US')) : '…'}</b></span>
          </li>`;
        })}
      </ol>
      <div class="leyenda"><span><i class="est"></i> ${t('filas estimadas', 'estimated rows')}</span><span><i class="real"></i> ${t('filas reales', 'actual rows')}</span><button class="btn" @click=${() => this.recorrer()}>▶ ${t('Recorrer el plan', 'Walk the plan')}</button></div>
      <p class="pie">${this.conFuncion
        ? t(html`<b>UPPER()</b> sobre la columna apaga el índice: el optimizador esperaba 10 filas y salieron 103.000. Todo lo de arriba se decidió sobre una suposición falsa.`, html`<b>UPPER()</b> on the column switches off the index: the optimizer expected 10 rows and got 103,000. Everything above was decided on a false assumption.`)
        : t(html`El número indica el orden real: <b>primero lo más indentado</b>. Estimadas y reales coinciden, así que el plan es confiable.`, html`The number shows the real order: <b>the most indented step runs first</b>. Estimated and actual match, so the plan can be trusted.`)}</p>
    </div>`;
  }

  static styles = [Demo.base, css`
    .plan { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: 12px; }
    li { display: grid; grid-template-columns: 26px 1fr; gap: 4px 10px; align-items: center; padding: 8px 10px 8px calc(10px + var(--nivel) * 18px); background: #fff; border: 1px solid var(--l); transition: border-color .3s, background-color .3s, transform .3s cubic-bezier(.22,1,.36,1); }
    @media (min-width: 720px) { li { grid-template-columns: 26px minmax(0, 1.2fr) 1fr 150px; } }
    .num { grid-row: span 2; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; background: var(--l); font-weight: 600; font-size: 11px; transition: background-color .3s, color .3s; }
    @media (min-width: 720px) { .num { grid-row: auto; } }
    .op { font-family: ui-monospace, Menlo, monospace; font-weight: 600; }
    .op small { font-weight: 400; color: var(--color-gray); }
    .barras { position: relative; height: 14px; }
    .barras i { position: absolute; left: 0; height: 5px; transition: width .7s cubic-bezier(.22,1,.36,1); }
    .barras .est { top: 0; background: #b9b4ac; } .barras .real { top: 8px; background: var(--color-ink); }
    .cifras { font-variant-numeric: tabular-nums; color: var(--color-gray); }
    li.activo { border-color: var(--color-ink); transform: translateX(4px); }
    li.activo .num, li.hecho .num { background: var(--color-ink); color: #fff; }
    li.malo { background: #fde8e5; border-color: var(--r); }
    li.malo .real { background: var(--r); } li.malo .num { background: var(--r); }
    .leyenda { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-top: 12px; font-size: 12px; color: var(--color-gray); }
    .leyenda i { display: inline-block; width: 18px; height: 5px; vertical-align: middle; margin-right: 4px; }
    .leyenda .est { background: #b9b4ac; } .leyenda .real { background: var(--color-ink); }
    .leyenda .btn { margin-left: auto; }
  `];
}
customElements.define('demo-plan-ejecucion', DemoPlanEjecucion);
