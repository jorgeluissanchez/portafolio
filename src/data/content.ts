/**
 * Textos y datos de cada sección (Figma: archivo «Portafolio · Jorge Sánchez»).
 */
import pulxxe from '@/assets/img/pulxxe.jpg';
import larueda from '@/assets/img/larueda.jpg';
import caribbean from '@/assets/img/caribbean-green.jpg';
import hockey from '@/assets/img/hockey.jpg';
import grixxo from '@/assets/img/grixxo.jpg';
import innovinc from '@/assets/img/innovinc.jpg';

export const nav = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Servicios', href: '#contacto' },
  { label: 'Proceso', href: '#contacto' },
  { label: 'Sobre mí', href: '#contacto' },
];

export const hero = {
  // Nombre gigante decorativo sin tilde (la tilde se cortaba arriba); el nombre correcto va en el h1 y el alt
  name: ['Jorge', 'Sanchez'],
  h1: { before: 'Ingeniero de ', accent: 'Sistemas', after: ' en Barranquilla' },
  description:
    'Soy Jorge Sánchez. Te ayudo a convertir tus ideas en productos digitales: desarrollo web, tiendas en línea y aplicaciones a la medida, construidas con IA desde Barranquilla para todo Colombia.',
  quote: '“Lidero la construcción del software de tu negocio: arquitectura, seguridad y experiencia de usuario, todo en una misma entrega.”',
};

export type Project = {
  slug: string;
  name: string;
  bg: string;
  title: [string, string];
  category: string;
  description: string;
  year: string;
  color: string;
  image: ImageMetadata;
  grixxo?: boolean;
  /** Sitio publicado del proyecto (si no hay, el botón lleva a contacto). */
  url?: string;
};

export const projectsIntro = {
  eyebrow: 'Lo que he hecho',
  h2: { before: 'Mis ', accent: 'proyectos' },
  description: 'Sitios web, tiendas en línea y aplicaciones que he construido para empresas de Barranquilla y de toda Colombia.',
};

export const projects: Project[] = [
  { slug: 'pulxxe', name: 'Pulxxe', bg: 'PULXXE', title: ['Pulxxe', 'Constructora'], category: 'Sitio web', year: '2026', color: '#F5C518', image: pulxxe, url: 'https://pulxxe.co',
    description: 'Sitio web para una constructora en Barranquilla: puntaje 96–100 en Google y contacto directo por WhatsApp.' },
  { slug: 'larueda', name: 'LaRueda', bg: 'LARUEDA', title: ['LaRueda', 'E-commerce'], category: 'Tienda en línea', year: '2025', color: '#F28C28', image: larueda, grixxo: true, url: 'https://larueda.co/',
    description: 'Tienda en línea para el sector automotriz: catálogo, promociones y compra fácil desde el celular.' },
  { slug: 'caribbean-green', name: 'Caribbean Green', bg: 'GREEN', title: ['Caribbean', 'Green'], category: 'Landing page', year: '2025', color: '#2FA36B', image: caribbean, grixxo: true, url: 'https://caribbeangreen.net/',
    description: 'Página de energía solar que explica el ahorro en segundos y lleva al cliente a pedir su cotización.' },
  { slug: 'hockey', name: 'Hockey is Melting Down', bg: 'HOCKEY', title: ['Hockey is', 'Melting Down'], category: 'Juego con IA', year: '2025', color: '#2D6BE4', image: hockey, url: 'https://revistasescuelanaval.com/obk/article/view/117/301',
    description: 'Juego educativo con IA sobre el cambio climático: misiones interactivas para aprender jugando.' },
  { slug: 'grixxo', name: 'Grixxo', bg: 'GRIXXO', title: ['Grixxo', 'Software'], category: 'Producto web', year: '2024–2026', color: '#7B4BE0', image: grixxo, grixxo: true, url: 'https://grixxo.com/',
    description: 'Sitio y productos digitales para una consultora tecnológica donde trabajé como desarrollador full stack.' },
  { slug: 'innovinc', name: 'Innovinc', bg: 'INNOVINC', title: ['Innovinc', 'Procesos'], category: 'Sitio corporativo', year: '2023', color: '#19A7CE', image: innovinc, url: 'https://innovinc.com.co/',
    description: 'Sitio corporativo para una consultora de procesos: servicios claros y contacto en un clic.' },
];

export const contact = {
  eyebrow: 'Empecemos',
  h2: { before: '¿Construimos tu ', accent: 'proyecto', after: '?' },
  description: 'Ya viste lo que he hecho y cómo trabajo. Cuéntame tu idea y te digo cómo la haría realidad.',
};

export const footerColumns = [
  { title: 'Explora', items: nav.map((n) => n.label) },
  { title: 'Lo que construyo', items: ['Sitios web', 'Tiendas en línea', 'Aplicaciones a medida', 'Automatización con IA'] },
];
