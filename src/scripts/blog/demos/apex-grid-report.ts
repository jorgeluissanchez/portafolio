/** Demo · Interactive Report (consultar) frente a Interactive Grid (editar), y el «quien guarda último pisa». */
import { css, html, nothing } from 'lit';
import { Demo, espera, t } from './base';

type Fila = { id: number; cliente: string; ciudad: string; total: number };
const DATOS_ES: Fila[] = [
  { id: 101, cliente: 'Ferretería El Puerto', ciudad: 'Barranquilla', total: 1840 },
  { id: 102, cliente: 'Llantas Costa', ciudad: 'Cartagena', total: 920 },
  { id: 103, cliente: 'Solar Caribe', ciudad: 'Barranquilla', total: 2310 },
  { id: 104, cliente: 'Café Rodadero', ciudad: 'Santa Marta', total: 640 },
  { id: 105, cliente: 'Obras del Norte', ciudad: 'Cartagena', total: 1500 },
];
// En inglés, pedidos de negocios del sur de Florida en dólares
const DATOS_EN: Fila[] = [
  { id: 101, cliente: 'Bayfront Hardware', ciudad: 'Miami', total: 1840 },
  { id: 102, cliente: 'Coastal Tires', ciudad: 'Fort Lauderdale', total: 920 },
  { id: 103, cliente: 'Sunshine Solar', ciudad: 'Miami', total: 2310 },
  { id: 104, cliente: 'Key Coffee Co.', ciudad: 'Key West', total: 640 },
  { id: 105, cliente: 'Northside Builders', ciudad: 'Fort Lauderdale', total: 1500 },
];
const num = (n: number) => n.toLocaleString(t('es-CO', 'en-US'));

class DemoApexGridReport extends Demo {
  static properties = { modo: { state: true }, filas: { state: true }, agrupar: { state: true }, bloqueo: { state: true }, conflicto: { state: true }, editando: { state: true } };
  declare modo: 'report' | 'grid';
  declare filas: Fila[];
  declare agrupar: boolean;
  declare bloqueo: boolean;
  declare conflicto: '' | 'pisado' | 'detenido';
  declare editando: number | null;

  constructor() {
    super();
    this.modo = 'report';
    this.filas = t(DATOS_ES, DATOS_EN).map((f) => ({ ...f }));
    this.agrupar = false;
    this.bloqueo = false;
    this.conflicto = '';
    this.editando = null;
  }

  protected async alVer() {
    await espera(900);
    this.agrupar = true;
    await espera(1800);
    this.modo = 'grid';
    this.agrupar = false;
    await espera(700);
    this.editando = 102;
  }

  private cambiar(campo: 'total', id: number, v: string) {
    this.filas = this.filas.map((f) => (f.id === id ? { ...f, [campo]: Number(v) || 0 } : f));
  }

  private async simular() {
    this.marcar('conflicto');
    this.conflicto = '';
    await espera(250);
    this.conflicto = this.bloqueo ? 'detenido' : 'pisado';
  }

  private tabla() {
    const filas = [...this.filas];
    if (this.modo === 'report' && this.agrupar) filas.sort((a, b) => a.ciudad.localeCompare(b.ciudad));
    let ciudadPrevia = '';
    const total = (c: string) => filas.filter((f) => f.ciudad === c).reduce((s, f) => s + f.total, 0);
    return html`
      <table class=${this.modo}>
        <thead><tr><th>${t('Pedido', 'Order')}</th><th>${t('Cliente', 'Customer')}</th><th>${t('Ciudad', 'City')}</th><th class="n">${t('Total (miles)', 'Total ($)')}</th></tr></thead>
        <tbody>
          ${filas.map((f) => {
            const corte = this.modo === 'report' && this.agrupar && f.ciudad !== ciudadPrevia;
            ciudadPrevia = f.ciudad;
            return html`
              ${corte ? html`<tr class="corte"><td colspan="4">${f.ciudad} <span>· subtotal ${num(total(f.ciudad))}</span></td></tr>` : nothing}
              <tr class=${this.editando === f.id ? 'editando' : ''}>
                <td>${f.id}</td><td>${f.cliente}</td><td>${f.ciudad}</td>
                <td class="n">
                  ${this.modo === 'grid'
                    ? html`<input inputmode="numeric" .value=${String(f.total)} @focus=${() => (this.editando = f.id)} @input=${(e: InputEvent) => this.cambiar('total', f.id, (e.target as HTMLInputElement).value)} aria-label=${t(`Total del pedido ${f.id}`, `Order ${f.id} total`)} />`
                    : num(f.total)}
                </td>
              </tr>`;
          })}
        </tbody>
      </table>`;
  }

  render() {
    return html`<div class="marco">
      <div class="cab">
        <p class="eyebrow">Demo · <b>${t('la misma tabla, dos trabajos', 'same table, two jobs')}</b></p>
        <div class="seg" role="group" aria-label=${t('Tipo de región', 'Region type')}>
          <button aria-pressed=${this.modo === 'report'} @click=${() => { this.modo = 'report'; this.conflicto = ''; this.marcar('report'); }}>Interactive Report</button>
          <button aria-pressed=${this.modo === 'grid'} @click=${() => { this.modo = 'grid'; this.agrupar = false; this.marcar('grid'); }}>Interactive Grid</button>
        </div>
      </div>
      <div class="barra">
        ${this.modo === 'report'
          ? html`<span class="chip">🔍 ${t('Ciudad', 'City')}</span><button class="chip ${this.agrupar ? 'on' : ''}" @click=${() => (this.agrupar = !this.agrupar)}>${t('Control Break por ciudad', 'Control Break by city')}</button><span class="chip">⬇ ${t('Descargar', 'Download')}</span>`
          : html`<span class="chip">✎ ${t('Edición en línea', 'Inline editing')}</span>
              <button class="chip ${this.bloqueo ? 'on' : ''}" @click=${() => { this.bloqueo = !this.bloqueo; this.conflicto = ''; }}>${t('Bloqueo optimista', 'Optimistic locking')}: ${this.bloqueo ? t('sí', 'on') : t('no', 'off')}</button>
              <button class="chip accion" @click=${this.simular}>${t('Simular que otra persona guarda primero', 'Simulate someone else saving first')}</button>`}
      </div>
      <div class="tabla">${this.tabla()}</div>
      ${this.conflicto === 'pisado' ? html`<p class="alerta mal">${t(html`Ana guardó el pedido 102 hace un segundo. Tú guardaste después y <b>su cambio desapareció sin aviso</b>.`, html`Anna saved order 102 a second ago. You saved after her and <b>her change vanished without warning</b>.`)}</p>` : nothing}
      ${this.conflicto === 'detenido' ? html`<p class="alerta bien">${t(html`«Otra persona cambió esta fila». El bloqueo optimista detiene tu guardado y <b>nadie pierde datos</b>.`, html`"Someone else changed this row." Optimistic locking stops your save and <b>nobody loses data</b>.`)}</p>` : nothing}
      <p class="pie">${this.modo === 'report'
        ? t(html`<b>Report:</b> el usuario <b>mira</b>. Agrupa, filtra y descarga sin tocar la aplicación. Nadie escribe, así que no hay conflictos.`, html`<b>Report:</b> the user <b>reads</b>. They group, filter and download without touching the app. Nobody writes, so there are no conflicts.`)
        : t(html`<b>Grid:</b> el usuario <b>escribe</b>. Toca un total y cámbialo. Es rápido para capturar, pero exige clave primaria real y bloqueo optimista.`, html`<b>Grid:</b> the user <b>writes</b>. Tap a total and change it. Fast for data entry, but it needs a real primary key and optimistic locking.`)}</p>
    </div>`;
  }

  static styles = [Demo.base, css`
    .barra { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .chip { all: unset; font-size: 12px; padding: 6px 10px; background: #fff; border: 1px solid var(--l); }
    button.chip { cursor: pointer; transition: all .2s; }
    .chip.on { border-color: var(--r); color: var(--r); }
    .chip.accion { background: var(--color-ink); color: #fff; border-color: var(--color-ink); }
    .tabla { overflow-x: auto; background: #fff; border: 1px solid var(--l); }
    table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 520px; }
    th { text-align: left; font-weight: 500; color: var(--color-gray); padding: 10px 12px; border-bottom: 1px solid var(--l); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
    td { padding: 10px 12px; border-bottom: 1px solid var(--l); transition: background-color .3s; }
    .n { text-align: right; font-variant-numeric: tabular-nums; }
    .corte td { background: var(--color-paper-2); font-weight: 600; animation: baja .4s cubic-bezier(.22,1,.36,1); }
    .corte span { font-weight: 400; color: var(--color-gray); }
    table.grid td { background: #fff; }
    table.grid tr.editando td { background: #fff4f2; }
    input { width: 90px; text-align: right; font: inherit; padding: 4px 6px; border: 1px solid var(--r); background: #fff; animation: celda .35s ease-out; }
    input:focus { outline: 2px solid var(--r); outline-offset: 0; }
    .alerta { margin: 12px 0 0; padding: 10px 12px; font-size: 14px; animation: baja .35s cubic-bezier(.22,1,.36,1); }
    .mal { background: #fde8e5; border-left: 3px solid var(--r); }
    .bien { background: #e3f4ea; border-left: 3px solid #1f7a4d; }
    @keyframes baja { from { opacity: 0; transform: translateY(-6px); } }
    @keyframes celda { from { box-shadow: 0 0 0 6px rgb(229 52 29 / .25); } }
  `];
}
customElements.define('demo-apex-grid-report', DemoApexGridReport);
