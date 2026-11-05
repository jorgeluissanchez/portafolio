/**
 * Idiomas del sitio. El español es el principal y vive en la raíz (/, /blog, /proyectos/…); el inglés vive en /en/…
 * Las URLs en español NO cambian: así no se pierde nada de lo que Google ya tiene indexado.
 *
 * Cada página declara su equivalente en el otro idioma (`alternates`) y BaseLayout publica las etiquetas hreflang
 * (es-CO, en y x-default → español). No hay redirección automática por idioma del navegador: Google rastrea desde
 * EE. UU. y dejaría de ver el español. Solo hay un selector ES / EN en el menú.
 */
export type Lang = 'es' | 'en';
export type Alternates = Partial<Record<Lang, string>>;

export const hreflang: Record<Lang, string> = { es: 'es-CO', en: 'en' };
export const ogLocale: Record<Lang, string> = { es: 'es_CO', en: 'en_US' };

/** Textos cortos de la interfaz (botones, etiquetas, accesibilidad). */
export const ui = {
  es: {
    cotiza: 'Cotiza conmigo',
    verProyectos: 'Ver proyectos',
    verCaso: 'Ver el caso',
    verProyecto: 'Ver proyecto',
    anio: 'Año',
    anterior: 'Proyecto anterior',
    siguiente: 'Proyecto siguiente',
    proyectos: 'Proyectos',
    de: 'de',
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    inicio: 'inicio',
    principal: 'Principal',
    escribeWa: 'Escríbeme por WhatsApp',
    correo: 'Envíame un correo',
    volver: 'Volver al inicio',
    privacidad: 'Privacidad',
    cookies: 'Cookies',
    servicios: 'Servicios',
    lema: 'Diseño, código y una buena idea.',
    realizadoEn: 'Realizado en:',
    capturaDe: 'Captura del proyecto',
    otroIdioma: 'English',
    otroIdiomaCorto: 'EN',
    waDefecto: 'Hola Jorge, vengo de tu portafolio.',
  },
  en: {
    cotiza: 'Get a quote',
    verProyectos: 'See projects',
    verCaso: 'Read the case study',
    verProyecto: 'See project',
    anio: 'Year',
    anterior: 'Previous project',
    siguiente: 'Next project',
    proyectos: 'Projects',
    de: 'of',
    abrirMenu: 'Open menu',
    cerrarMenu: 'Close menu',
    inicio: 'home',
    principal: 'Main',
    escribeWa: 'Message me on WhatsApp',
    correo: 'Send me an email',
    volver: 'Back to top',
    privacidad: 'Privacy',
    cookies: 'Cookies',
    servicios: 'Services',
    lema: 'Design, code and a good idea.',
    realizadoEn: 'Built at:',
    capturaDe: 'Screenshot of',
    otroIdioma: 'Español',
    otroIdiomaCorto: 'ES',
    waDefecto: 'Hi Jorge, I found your portfolio.',
  },
} satisfies Record<Lang, Record<string, string>>;

/** Inicio de cada idioma: el selector cae aquí si la página no tiene equivalente (nunca a un 404). */
export const inicioDe: Record<Lang, string> = { es: '/', en: '/en' };
