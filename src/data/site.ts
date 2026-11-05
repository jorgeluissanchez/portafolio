/**
 * Datos generales del portafolio: identidad, contacto, redes y SEO.
 * Las redes vacías no se muestran ni se publican en el schema.
 */
const whatsappNumber = '573225822789';

export const site = {
  name: 'Jorge Sánchez',
  title: 'Jorge Sánchez · Full Stack e Ingeniero de Sistemas, Barranquilla',
  description:
    'Ingeniero de sistemas y desarrollador full stack en Barranquilla. Creo sitios web, tiendas en línea y aplicaciones a la medida con IA para empresas de Colombia.',
  role: 'Ingeniero de Sistemas · Desarrollador Full Stack con IA',
  lang: 'es',
  locale: 'es_CO',
  city: 'Barranquilla',
  region: 'Atlántico',
  country: 'CO',
  email: 'jorgesanchezbarreneche@outlook.com',
  whatsappNumber,
  social: {
    instagram: 'https://www.instagram.com/jorge_sanchez_col/',
    github: 'https://github.com/jorgeluissanchez',
    linkedin: 'https://www.linkedin.com/in/jorge-sanchez-systems-engineer/',
  },
  /**
   * Medición (igual que Pulxxe). Cada una se activa solo si el valor no está vacío.
   * - gtmId: contenedor de Google Tag Manager «jorgesanchez.engineer» (el que ya usa el sitio publicado).
   *   GA4 (G-FCHTNC9VHW, propiedad «jorgesanchez.engineer») vive DENTRO de GTM, no se pone aquí.
   * - searchConsole: solo el código de la etiqueta HTML de Search Console (<meta name="google-site-verification" content="ESTE">).
   *   No hace falta si verificas por DNS o con el archivo googleXXXX.html en /public.
   * - bing: código de Bing Webmaster Tools (<meta name="msvalidate.01" content="...">).
   * - clarity: ID del proyecto de Microsoft Clarity (mapas de calor y grabaciones).
   */
  analytics: {
    gtmId: 'GTM-NWNBH9KC',
    searchConsole: '',
    bing: '8A16D4A25EF52BC6D4E95EB59B2CDA67',
    clarity: 'z6hiw4tznl',
  },
} as const;

/** Lo que cambia en inglés (/en). El resto de datos es el mismo. */
export const siteEn = {
  title: 'Jorge Sánchez · Full Stack Developer for US Businesses, based in Colombia',
  description:
    'Full stack developer and systems engineer based in Colombia, working with businesses in Miami and across the US: websites, online stores and custom AI apps. Same time zone, bilingual.',
  role: 'Systems Engineer · Full Stack Developer with AI',
} as const;

export const whatsappUrl = (text = 'Hola Jorge, vengo de tu portafolio.') =>
  `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
