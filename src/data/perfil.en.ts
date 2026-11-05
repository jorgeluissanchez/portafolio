/**
 * English profile for /en/about. Same facts as perfil.ts (single source in Spanish); skills are reused.
 */
import { perfil as es } from '@/data/perfil';

export const perfilEn = {
  ...es,
  profesion: 'Systems Engineer and Full Stack Developer',
  cargoActual: 'Lead Fullstack Engineer at Solinces',
  resumen:
    "I'm Jorge Sánchez, a systems and computer engineer from Universidad del Norte and a full stack developer based in Barranquilla, Colombia. Today I lead the technical team behind Colombia Evaluadora at Solinces. Since 2023 I've built websites, online stores and custom applications: landing pages that bring in clients, e-commerce for service networks and Oracle APEX management systems for mid-size and large companies. I work remotely with clients in the US, in the same time zone, in English or Spanish.",
  experiencia: [
    { ...es.experiencia[0], modalidad: 'Remote',
      texto: 'I lead a team of 6 on Colombia Evaluadora, an education platform that brings academic management, school communication and an AI assistant for K-12 schools in Colombia into a single system. I combine technical and team leadership with hands-on full stack work: I define the architecture, prioritize with QA and product, review delivery quality and ship features end to end.',
      logros: [
        { t: 'AI assistant with LLM and RAG', d: 'An agent that answers with system context, navigates between screens, reads and fills forms and asks for confirmation before acting, respecting each role\'s permissions.' },
        { t: 'Academic management', d: 'Enrollment, terms, curricula, grading scales, lesson planner, grades, attendance and PDF report cards.' },
        { t: 'Real-time communication', d: 'Chat, groups, forums, announcements, surveys, elections and online exams with WebSockets, push notifications and voice notes.' },
        { t: 'Security and access control', d: 'SSO, JWT, dynamic role-based menus and permissions, scoping by school, campus and shift, auditing and Cloudflare Turnstile.' },
        { t: 'Architecture and delivery', d: 'Java microservices on PostgreSQL (Flyway), auditing on ClickHouse and Redis; React 19 with TypeScript, TanStack and Storybook; CI/CD with GitHub Actions and deployment on Cloudflare Workers.' },
      ] },
    { ...es.experiencia[1], cargo: 'Full Stack Developer', modalidad: 'Hybrid',
      texto: "Landing pages and online stores on WordPress, Oracle APEX management systems (including the migration of PRIME, the research platform of Colombia's Universidad Pedagógica Nacional), the LaRueda e-commerce and Grixxo's own website in Astro." },
    { ...es.experiencia[2], modalidad: 'Remote',
      texto: 'Training and evaluating AI models for international clients, and projects integrating generative AI with Python, TypeScript, React and Node.js.' },
    { ...es.experiencia[3], cargo: 'Junior Full Stack Developer', modalidad: 'Remote',
      texto: 'New version of a transcription API and bug fixing with React, Express and FFmpeg.' },
  ],
  formacion: [
    { titulo: 'B.S. in Systems and Computer Engineering', institucion: 'Universidad del Norte', anio: 'graduating March 20, 2027', url: 'https://www.uninorte.edu.co' },
  ],
  certificaciones: [
    { nombre: 'IELTS · English B2 (CEFR)', emisor: 'IELTS', anio: 2026 },
    { nombre: 'University Internship Program for Cloud & DevOps', emisor: 'EPAM Systems', anio: 2025 },
  ],
  reconocimientos: [
    { titulo: 'Best student branch', por: 'IEEE', anio: 2026 },
    { titulo: 'First place, Uninorte Gamer Fair (Hockey is Melting Down)', por: 'Universidad del Norte', anio: 2025 },
    { titulo: 'Second place nationwide, IEEEXtreme', por: 'IEEE', anio: 2024 },
  ],
  habilidades: {
    Languages: es.habilidades['Lenguajes'],
    Frameworks: es.habilidades['Frameworks'],
    Data: es.habilidades['Datos'],
    Platforms: es.habilidades['Plataformas'],
  } as Record<string, string[]>,
};

/** Month and year in English: "Jun 2026". */
export const monthYear = (ym: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(`${ym}-15T12:00:00`));
