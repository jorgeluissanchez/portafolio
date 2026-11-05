/**
 * Aviso de cookies con vanilla-cookieconsent (MIT): barra abajo que no bloquea la página.
 *
 * - Solo hay dos categorías: necesarias (siempre activas) y analítica (Google Analytics vía GTM y Microsoft Clarity).
 * - La analítica arranca DENEGADA (ver BaseLayout) y solo se activa si la persona acepta: es el criterio más exigente
 *   (opt-in del RGPD europeo y autorización previa de la Ley 1581 de Colombia), así sirve para cualquier país.
 * - Respeta Global Privacy Control (GPC): si el navegador lo envía, no se activa la analítica sin una decisión expresa.
 * - Cada cambio se comunica a Google Consent Mode v2 y a la Consent API v2 de Clarity.
 */
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as CC from 'vanilla-cookieconsent';

function aplicar() {
  const analitica = CC.acceptedCategory('analytics');
  const w = window as any;
  w.gtag?.('consent', 'update', { analytics_storage: analitica ? 'granted' : 'denied' });
  w.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: analitica ? 'granted' : 'denied' });
}

export function iniciarConsentimiento() {
  // Si la firma de entrada está en pantalla, el aviso espera a que termine para no taparla
  if (document.documentElement.classList.contains('splash')) {
    addEventListener('splash:done', () => setTimeout(arrancar, 300), { once: true });
  } else arrancar();
}

function arrancar() {
  CC.run({
    revision: 1,
    hideFromBots: true,
    disablePageInteraction: false,
    cookie: { name: 'cc_cookie', expiresAfterDays: 182, sameSite: 'Lax' },
    guiOptions: {
      consentModal: { layout: 'bar inline', position: 'bottom', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', equalWeightButtons: true },
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: {
        enabled: false,
        autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }, { name: /^_clck/ }, { name: /^_clsk/ }, { name: 'CLID' }, { name: 'MUID' }] },
      },
    },
    onFirstConsent: aplicar,
    onConsent: aplicar,
    onChange: aplicar,
    language: {
      default: 'es',
      // Toma el idioma del <html lang> de la página: /en muestra el aviso en inglés
      autoDetect: 'document',
      translations: {
        en: {
          consentModal: {
            title: 'Cookies, only if you want',
            description:
              'I use necessary cookies so the site works and, if you agree, analytics cookies (Google Analytics and Microsoft Clarity) to see which pages help and improve them. I never sell or share your data. You can change your choice anytime from «Cookies» at the bottom of the page.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Necessary only',
            showPreferencesBtn: 'Choose',
            footer: '<a href="/privacidad">Privacy and cookie policy (Spanish)</a>',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Necessary only',
            savePreferencesBtn: 'Save my choice',
            closeIconLabel: 'Close',
            sections: [
              { title: 'Your privacy', description: 'Choose which cookies are stored in your browser. Necessary cookies cannot be turned off because the site would not work without them.' },
              { title: 'Necessary', description: 'They store your cookie choice and your blog likes in this browser. They do not identify anyone and are never used for ads.', linkedCategory: 'necessary' },
              {
                title: 'Analytics',
                description: 'Google Analytics 4 (through Google Tag Manager) and Microsoft Clarity measure visits, page views, scrolling and clicks with aggregated data. Used only to improve the site, never for advertising.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: { name: 'Cookie', domain: 'Service', desc: 'Purpose', exp: 'Duration' },
                  body: [
                    { name: '_ga, _ga_*', domain: 'Google Analytics', desc: 'Tells visits and sessions apart', exp: '13 months' },
                    { name: '_clck, _clsk', domain: 'Microsoft Clarity', desc: 'Groups the pages of one visit', exp: '1 year / 1 day' },
                  ],
                },
              },
              { title: 'Your rights', description: 'You can access, update, correct or delete your data, or withdraw consent, by writing to <a href="mailto:jorgesanchezbarreneche@outlook.com">jorgesanchezbarreneche@outlook.com</a>.' },
            ],
          },
        },
        es: {
          consentModal: {
            title: 'Cookies, solo si tú quieres',
            description:
              'Uso cookies necesarias para que el sitio funcione y, si lo aceptas, cookies de analítica (Google Analytics y Microsoft Clarity) para saber qué páginas sirven y mejorarlas. No vendo ni comparto tus datos. Puedes cambiar tu decisión cuando quieras desde «Cookies», al pie de la página.',
            acceptAllBtn: 'Aceptar todas',
            acceptNecessaryBtn: 'Solo necesarias',
            showPreferencesBtn: 'Elegir',
            footer: '<a href="/privacidad">Política de privacidad y cookies</a>',
          },
          preferencesModal: {
            title: 'Preferencias de cookies',
            acceptAllBtn: 'Aceptar todas',
            acceptNecessaryBtn: 'Solo necesarias',
            savePreferencesBtn: 'Guardar mi elección',
            closeIconLabel: 'Cerrar',
            sections: [
              {
                title: 'Tu privacidad',
                description:
                  'Aquí decides qué cookies se guardan en tu navegador. Las necesarias no se pueden desactivar porque el sitio no funcionaría sin ellas. Más detalles en la <a href="/privacidad">política de privacidad</a>.',
              },
              {
                title: 'Necesarias',
                description: 'Guardan tu elección de cookies y tus me gusta del blog en este navegador. No identifican a nadie ni se usan para publicidad.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analítica',
                description:
                  'Google Analytics 4 (a través de Google Tag Manager) y Microsoft Clarity miden visitas, páginas vistas, desplazamiento y clics, con datos agregados. Sirven para mejorar el sitio; nunca para publicidad.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: { name: 'Cookie', domain: 'Servicio', desc: 'Para qué sirve', exp: 'Duración' },
                  body: [
                    { name: '_ga, _ga_*', domain: 'Google Analytics', desc: 'Distingue visitas y sesiones', exp: '13 meses' },
                    { name: '_clck, _clsk', domain: 'Microsoft Clarity', desc: 'Agrupa las páginas de una misma visita', exp: '1 año / 1 día' },
                  ],
                },
              },
              {
                title: 'Tus derechos',
                description:
                  'Puedes conocer, actualizar, rectificar o pedir que borre tus datos, y revocar tu autorización, escribiendo a <a href="mailto:jorgesanchezbarreneche@outlook.com">jorgesanchezbarreneche@outlook.com</a>.',
              },
            ],
          },
        },
      },
    },
  });
}
