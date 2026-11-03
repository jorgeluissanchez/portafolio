/**
 * Demos · Flujos de Oracle APEX: Workflows, Automations y Task Definitions.
 * Un mismo motor dibuja el diagrama y mueve una ficha por él; cada artículo trae su propio flujo.
 */
import { css, html, svg } from 'lit';
import { Demo, espera } from './base';

type Nodo = { id: string; x: number; y: number; texto: string; tipo: 'inicio' | 'fin' | 'act' | 'switch' | 'espera' | 'humano' | 'reloj' | 'consulta' };
type Arista = [string, string, string?];
type Escenario = { nombre: string; ruta: string[]; pasos: Record<string, string> };
type Flujo = { titulo: string; nodos: Nodo[]; aristas: Arista[]; escenarios: Escenario[] };

const W = 690, H = 230, M = 54; // M: media anchura de cada caja

class FlujoApex extends Demo {
  static properties = { esc: { state: true }, actual: { state: true }, visitados: { state: true }, texto: { state: true } };
  declare esc: number;
  declare actual: string;
  declare visitados: string[];
  declare texto: string;
  protected flujo!: Flujo;
  private corrida = 0;

  constructor() {
    super();
    this.esc = 0;
    this.actual = '';
    this.visitados = [];
    this.texto = 'Pulsa ▶ o elige un caso para ver el recorrido.';
  }
  protected alVer() { this.correr(0); }

  private async correr(i: number) {
    const yo = ++this.corrida;
    this.esc = i;
    this.visitados = [];
    const e = this.flujo.escenarios[i];
    for (const id of e.ruta) {
      if (yo !== this.corrida) return;
      this.actual = id;
      this.visitados = [...this.visitados, id];
      this.texto = e.pasos[id] ?? this.flujo.nodos.find((n) => n.id === id)!.texto;
      await espera(1150);
    }
  }

  /** En pantallas angostas el diagrama se desplaza solo para seguir la ficha. */
  updated() {
    const lienzo = this.renderRoot.querySelector<HTMLElement>('.lienzo');
    const n = this.flujo.nodos.find((x) => x.id === this.actual);
    if (!lienzo || !n || lienzo.scrollWidth <= lienzo.clientWidth) return;
    lienzo.scrollTo({ left: (n.x / W) * lienzo.scrollWidth - lienzo.clientWidth / 2, behavior: 'smooth' });
  }

  private icono(t: Nodo['tipo']) {
    return { inicio: '▶', fin: '■', act: '⚙', switch: '◆', espera: '⏸', humano: '👤', reloj: '⏰', consulta: '🔎' }[t];
  }

  render() {
    const f = this.flujo;
    const pos = new Map(f.nodos.map((n) => [n.id, n]));
    const ruta = f.escenarios[this.esc].ruta;
    const usada = (a: string, b: string) => {
      const i = ruta.indexOf(a);
      return i >= 0 && ruta[i + 1] === b && this.visitados.includes(b);
    };
    const n = pos.get(this.actual);
    return html`<div class="marco">
      <div class="cab">
        <p class="eyebrow">Demo · <b>${f.titulo}</b></p>
        <div class="seg" role="group" aria-label="Caso">
          ${f.escenarios.map((e, i) => html`<button aria-pressed=${this.esc === i} @click=${() => { this.correr(i); this.marcar(e.nombre); }}>${e.nombre}</button>`)}
        </div>
      </div>
      <div class="lienzo">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label=${`Diagrama: ${f.titulo}`}>
          <defs><marker id="m" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="currentColor" /></marker></defs>
          ${f.aristas.map(([a, b, et]) => {
            const p = pos.get(a)!, q = pos.get(b)!;
            const mx = (p.x + q.x) / 2;
            const d = p.y === q.y ? `M${p.x + M} ${p.y}L${q.x - M - 4} ${q.y}` : `M${p.x + M} ${p.y}C${mx} ${p.y} ${mx} ${q.y} ${q.x - M - 4} ${q.y}`;
            return svg`<path class="ar ${usada(a, b) ? 'on' : ''}" d=${d} marker-end="url(#m)" />${et ? svg`<text class="et" x=${mx} y=${(p.y + q.y) / 2 - 6}>${et}</text>` : ''}`;
          })}
          ${f.nodos.map((x) => svg`<g class="nodo ${x.tipo} ${this.visitados.includes(x.id) ? 'visto' : ''} ${this.actual === x.id ? 'actual' : ''}" transform="translate(${x.x} ${x.y})">
            ${x.tipo === 'switch' ? svg`<rect x=${-M} y="-24" width=${M * 2} height="48" rx="24" />` : svg`<rect x=${-M} y="-22" width=${M * 2} height="44" rx=${x.tipo === 'inicio' || x.tipo === 'fin' ? 22 : 4} />`}
            <text y="-3">${this.icono(x.tipo)}</text><text class="t" y="12">${x.texto}</text></g>`)}
          ${n ? svg`<circle class="ficha" r="7" cx=${n.x} cy=${n.y - 30} />` : ''}
        </svg>
      </div>
      <p class="pie" aria-live="polite">${this.texto}</p>
      <button class="btn" @click=${() => this.correr(this.esc)}>▶ Reproducir</button>
    </div>`;
  }

  static styles = [Demo.base, css`
    .lienzo { background: #fff; border: 1px solid var(--l); overflow-x: auto; }
    svg { display: block; width: 100%; min-width: 560px; height: auto; color: #b9b4ac; }
    .ar { fill: none; stroke: currentColor; stroke-width: 1.5; transition: stroke .4s, stroke-width .4s; }
    .ar.on { stroke: var(--color-ink); stroke-width: 2.5; color: var(--color-ink); }
    .et { font-size: 10px; fill: var(--color-gray); text-anchor: middle; }
    .nodo rect { fill: #fff; stroke: #cfcac2; stroke-width: 1.5; transition: fill .35s, stroke .35s; }
    .nodo text { font-size: 11px; text-anchor: middle; fill: var(--color-gray); }
    .nodo .t { font-size: 9px; font-weight: 600; fill: var(--color-ink); }
    .nodo.visto rect { stroke: var(--color-ink); fill: var(--color-paper-2); }
    .nodo.actual rect { fill: var(--color-ink); stroke: var(--color-ink); }
    .nodo.actual text { fill: #fff; }
    .ficha { fill: var(--r); transition: cx .6s cubic-bezier(.65,0,.35,1), cy .6s cubic-bezier(.65,0,.35,1); filter: drop-shadow(0 2px 4px rgb(229 52 29 / .4)); }
  `];
}

const nodo = (id: string, x: number, y: number, texto: string, tipo: Nodo['tipo']): Nodo => ({ id, x, y, texto, tipo });

class DemoFlujoApex extends FlujoApex {
  flujo: Flujo = {
    titulo: 'un workflow de aprobación de vacaciones',
    nodos: [
      nodo('ini', 62, 115, 'Workflow Start', 'inicio'),
      nodo('sol', 185, 115, 'Registra solicitud', 'act'),
      nodo('sw', 310, 115, '¿Más de 5 días?', 'switch'),
      nodo('jefe', 445, 55, 'Aprueba el jefe', 'humano'),
      nodo('auto', 445, 175, 'Aprobación directa', 'act'),
      nodo('fin', 620, 115, 'Workflow End', 'fin'),
    ],
    aristas: [['ini', 'sol'], ['sol', 'sw'], ['sw', 'jefe', 'sí'], ['sw', 'auto', 'no'], ['jefe', 'fin'], ['auto', 'fin']],
    escenarios: [
      { nombre: '3 días', ruta: ['ini', 'sol', 'sw', 'auto', 'fin'], pasos: { ini: 'Arranca una instancia con los parámetros de entrada (empleado, fechas).', sw: 'Workflow Switch evalúa la condición: 3 días, rama «no».', auto: 'Una actividad de ejecución actualiza la tabla sin esperar a nadie.', fin: 'Workflow End: no se ejecuta nada más en esta rama.' } },
      { nombre: '12 días', ruta: ['ini', 'sol', 'sw', 'jefe', 'fin'], pasos: { sw: 'Workflow Switch: 12 días, rama «sí».', jefe: 'Una Human Task crea la tarea en la bandeja del jefe. El flujo queda en espera hasta que responda.', fin: 'Con la aprobación, el flujo termina y el resultado vuelve como parámetro de salida.' } },
    ],
  };
}

class DemoAutomatizacionApex extends FlujoApex {
  flujo: Flujo = {
    titulo: 'una automation que avisa de facturas vencidas',
    nodos: [
      nodo('reloj', 62, 115, 'Cada lunes 8:00', 'reloj'),
      nodo('q', 185, 115, 'Query: vencidas', 'consulta'),
      nodo('sw', 310, 115, '¿Hay filas?', 'switch'),
      nodo('mail', 445, 55, 'Correo por fila', 'act'),
      nodo('log', 445, 175, 'Nada que hacer', 'act'),
      nodo('fin', 620, 115, 'Queda en el log', 'fin'),
    ],
    aristas: [['reloj', 'q'], ['q', 'sw'], ['sw', 'mail', '3 filas'], ['sw', 'log', '0 filas'], ['mail', 'fin'], ['log', 'fin']],
    escenarios: [
      { nombre: 'Lunes con vencidas', ruta: ['reloj', 'q', 'sw', 'mail', 'fin'], pasos: { reloj: 'Type «Scheduled»: el Database Scheduler la dispara según el Schedule Expression.', q: 'Actions Initiated On «Query»: la consulta devuelve 3 facturas.', mail: 'La acción se ejecuta una vez por cada fila: 3 correos.', fin: 'La ejecución y sus mensajes quedan en APEX_AUTOMATION_LOG y APEX_AUTOMATION_MSG_LOG.' } },
      { nombre: 'Lunes al día', ruta: ['reloj', 'q', 'sw', 'log', 'fin'], pasos: { q: 'La consulta no devuelve filas.', log: 'Sin filas no se ejecuta ninguna acción, y tampoco hay error.', fin: 'Igual queda registro de que corrió: útil para saber que el horario funciona.' } },
    ],
  };
}

class DemoTareaApex extends FlujoApex {
  flujo: Flujo = {
    titulo: 'el ciclo de una task definition',
    nodos: [
      nodo('crear', 62, 115, 'Se crea la tarea', 'inicio'),
      nodo('asig', 185, 115, 'Potential Owners', 'humano'),
      nodo('plazo', 310, 115, '¿A tiempo?', 'switch'),
      nodo('ok', 445, 55, 'Aprobada', 'act'),
      nodo('esc', 445, 175, 'Escala al admin', 'humano'),
      nodo('fin', 620, 115, 'Acciones', 'fin'),
    ],
    aristas: [['crear', 'asig'], ['asig', 'plazo'], ['plazo', 'ok', 'sí'], ['plazo', 'esc', 'vence'], ['ok', 'fin'], ['esc', 'fin']],
    escenarios: [
      { nombre: 'Responde a tiempo', ruta: ['crear', 'asig', 'plazo', 'ok', 'fin'], pasos: { crear: 'La tarea nace con sus parámetros (por ejemplo, el monto de la solicitud).', asig: 'Aparece en la bandeja de los Potential Owners definidos por la consulta de participantes.', ok: 'Uno la reclama y la aprueba antes del Due On.', fin: 'Se disparan las acciones configuradas para «Complete».' } },
      { nombre: 'Se vence', ruta: ['crear', 'asig', 'plazo', 'esc', 'fin'], pasos: { plazo: 'Pasa la fecha de vencimiento sin respuesta.', esc: 'La tarea se marca como vencida y queda en manos del Business Administrator.', fin: 'Se ejecutan las acciones de «Expire» o «Escalate» que definiste.' } },
    ],
  };
}

customElements.define('demo-flujo-apex', DemoFlujoApex);
customElements.define('demo-automatizacion-apex', DemoAutomatizacionApex);
customElements.define('demo-tarea-apex', DemoTareaApex);
