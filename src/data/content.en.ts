/**
 * English copy for the home page (/en). Same structure as content.ts; images, colors and links are reused from it.
 */
import { projects as proyectosEs, type Project } from '@/data/content';

export const nav = [
  { label: 'Projects', href: '/en#proyectos' },
  { label: 'Blog', href: '/en/blog' },
  { label: 'Services', href: '/en/web-developer-miami' },
  { label: 'About', href: '/en/about' },
  { label: 'Contact', href: '#contacto' },
];

export const hero = {
  name: ['Jorge', 'Sanchez'],
  h1: { before: 'Full stack ', accent: 'developer', after: ' for US businesses' },
  description:
    "I'm Jorge Sánchez, a systems engineer and full stack developer based in Barranquilla, Colombia. I design and build websites, online stores and custom AI apps for businesses in Miami and across the US: same time zone, fully bilingual.",
  quote: '“I lead the build of your product end to end: architecture, security and user experience in a single delivery.”',
};

export const projectsIntro = {
  eyebrow: 'Selected work',
  h2: { before: 'My ', accent: 'projects' },
  description: 'Websites, online stores and applications I have built for companies in Colombia and abroad.',
};

const en: Record<string, Pick<Project, 'title' | 'category' | 'description'>> = {
  pulxxe: { title: ['Pulxxe', 'Construction'], category: 'Website', description: 'Website for a construction company: 96–100 on Google PageSpeed and direct contact through WhatsApp.' },
  larueda: { title: ['LaRueda', 'E-commerce'], category: 'Online store', description: 'Online store for an automotive service network: catalog, promotions and easy checkout on mobile.' },
  'caribbean-green': { title: ['Caribbean', 'Green'], category: 'Landing page', description: 'Solar energy landing page that explains the savings in seconds and leads visitors to request a quote.' },
  hockey: { title: ['Hockey is', 'Melting Down'], category: 'AI game', description: 'Educational AI game about climate change: interactive missions to learn by playing.' },
  grixxo: { title: ['Grixxo', 'Software'], category: 'Web product', description: 'Website and digital products for a tech consultancy where I worked as a full stack developer.' },
  innovinc: { title: ['Innovinc', 'Processes'], category: 'Corporate website', description: 'Corporate site for a process consultancy: clear services and one-click contact.' },
};

export const projects: Project[] = proyectosEs.map((p) => ({ ...p, ...en[p.slug] }));

export const contact = {
  eyebrow: "Let's talk",
  h2: { before: 'Shall we build your ', accent: 'project', after: '?' },
  description: "You've seen my work and how I build. Tell me your idea and I'll tell you how I'd make it real, in English or Spanish.",
};

export const footerColumns = [
  { title: 'Explore', items: nav.map((n) => n.label) },
  { title: 'What I build', items: ['Websites', 'Online stores', 'Custom applications', 'AI automation'] },
];

/** Service links shown in the English footer. */
export const servicios = [
  { label: 'Web developer for Miami businesses', href: '/en/web-developer-miami' },
  { label: 'Hire a full stack developer in Colombia', href: '/en/hire-full-stack-developer-colombia' },
];
