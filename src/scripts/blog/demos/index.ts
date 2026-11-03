/** Carga solo las demos que el artículo usa (cada una viaja en su propio archivo). */
const DEMOS: Record<string, () => Promise<unknown>> = {
  'demo-apex-grid-report': () => import('./apex-grid-report'),
  'demo-astro-islas': () => import('./astro-islas'),
  'demo-plan-ejecucion': () => import('./plan-ejecucion'),
  'demo-cascada-lcp': () => import('./cascada-lcp'),
  'demo-flujo-apex': () => import('./flujos-apex'),
  'demo-automatizacion-apex': () => import('./flujos-apex'),
  'demo-tarea-apex': () => import('./flujos-apex'),
  'demo-capas-color': () => import('./frontend'),
  'demo-movimiento-reducido': () => import('./frontend'),
  'demo-carpetas-gritan': () => import('./frontend'),
  'demo-bloques-cms': () => import('./frontend'),
};

export function cargarDemos(raiz: ParentNode = document) {
  const usadas = Object.keys(DEMOS).filter((tag) => raiz.querySelector(tag));
  return Promise.all(usadas.map((tag) => DEMOS[tag]()));
}
