/**
 * Medición de contactos para Google Tag Manager (igual que Pulxxe): cada clic a WhatsApp o correo empuja un
 * evento al dataLayer en el momento del clic (más fiable que los activadores automáticos de GTM, que cargan
 * después de la página). En GTM: activador «Evento personalizado» = whatsapp_click | email_click | social_click | project_click.
 * Parámetros: cta_text (texto o aria-label), cta_location (sección) y link_url (sin parámetros).
 * El mismo nombre se envía a Microsoft Clarity para filtrar las grabaciones que terminaron en contacto.
 */
type W = { dataLayer?: Record<string, unknown>[]; clarity?: (...args: unknown[]) => void };

const SOCIAL = /linkedin\.com|github\.com|instagram\.com/;

export function initLeadTracking() {
  const w = window as unknown as W;
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href;
      const event = /wa\.me|whatsapp\.com/.test(href)
        ? 'whatsapp_click'
        : href.startsWith('mailto:')
          ? 'email_click'
          : SOCIAL.test(href)
            ? 'social_click'
            : a.hasAttribute('data-project')
              ? 'project_click'
              : '';
      if (!event) return;
      (w.dataLayer = w.dataLayer || []).push({
        event,
        cta_text: (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
        cta_location: a.closest('section[id], footer[id]')?.id || a.closest('header, footer')?.tagName.toLowerCase() || 'flotante',
        link_url: href.split('?')[0],
        ...(a.dataset.project && { project: a.dataset.project }),
      });
      w.clarity?.('event', event);
    },
    { capture: true },
  );
}
