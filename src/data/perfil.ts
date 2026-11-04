/**
 * Perfil profesional: una sola fuente para la página «Sobre mí», las páginas de servicio y los datos
 * estructurados (Person). Datos tomados de LinkedIn y del CV del portafolio anterior.
 */
type Experiencia = {
  cargo: string; empresa: string; desde: string; hasta: string | null; modalidad: string; texto: string;
  proyecto?: string; logros?: { t: string; d: string }[]; tecnologias?: string[];
};

export const perfil = {
  nombreCompleto: 'Jorge Luis Sánchez Barreneche',
  nombre: 'Jorge Sánchez',
  profesion: 'Ingeniero de Sistemas y desarrollador full stack',
  cargoActual: 'Lead Fullstack Engineer en Solinces',
  resumen:
    'Soy Jorge Sánchez, ingeniero de sistemas y computación de la Universidad del Norte y desarrollador full stack en Barranquilla. Hoy lidero el equipo técnico de Colombia Evaluadora en Solinces. Desde 2023 construyo sitios web, tiendas en línea y aplicaciones a la medida: landing pages que traen clientes, e-commerce para redes de servicio y sistemas de gestión en Oracle APEX para empresas medianas y grandes.',
  experiencia: <Experiencia[]>[
    { cargo: 'Lead Fullstack Engineer', empresa: 'Solinces', desde: '2026-06', hasta: null, modalidad: 'Remoto',
      proyecto: 'Colombia Evaluadora',
      texto: 'Lidero a un equipo de 6 personas en Colombia Evaluadora, una plataforma educativa que reúne en un solo sistema la gestión académica, la comunicación institucional y un asistente de inteligencia artificial para colegios en Colombia. Combino la dirección técnica y del equipo con el desarrollo fullstack: defino la arquitectura, priorizo con QA y producto, reviso la calidad de las entregas y llevo funcionalidades de punta a punta.',
      logros: [
        { t: 'Asistente de IA con LLM y RAG', d: 'Un agente que responde con el contexto del sistema, navega entre pantallas, lee y llena formularios y pide confirmación antes de actuar, respetando los permisos de cada rol.' },
        { t: 'Gestión académica', d: 'Matrícula, periodos, planes de estudio, escalas de valoración, planeador docente, calificaciones, asistencia y boletines en PDF, alineados al Decreto 1290.' },
        { t: 'Comunicación en tiempo real', d: 'Chat, grupos, foros, comunicados, encuestas, elecciones y evaluaciones en línea con WebSockets, notificaciones push y notas de voz.' },
        { t: 'Seguridad y control de acceso', d: 'SSO, JWT, menús y permisos dinámicos por rol, alcance por colegio, sede y jornada, auditoría y Cloudflare Turnstile.' },
        { t: 'Arquitectura y entrega', d: 'Microservicios en Java sobre PostgreSQL (Flyway), auditoría en ClickHouse y Redis; React 19 con TypeScript, TanStack y Storybook; CI/CD con GitHub Actions y despliegue en Cloudflare Workers.' },
      ],
      tecnologias: ['React', 'TypeScript', 'Java', 'PostgreSQL', 'ClickHouse', 'Redis', 'WebSockets', 'LLM', 'RAG', 'Docker', 'GitHub Actions', 'Cloudflare'] },
    { cargo: 'Desarrollador Full Stack', empresa: 'Grixxo', desde: '2024-07', hasta: '2026-04', modalidad: 'Híbrido',
      texto: 'Landing pages y tiendas en línea en WordPress, sistemas de gestión en Oracle APEX (entre ellos la migración de PRIME, la plataforma de investigación de la Universidad Pedagógica Nacional), el e-commerce de LaRueda y el sitio de Grixxo en Astro.' },
    { cargo: 'Full Stack Engineer', empresa: 'Outlier (Upwork)', desde: '2023-06', hasta: '2024-07', modalidad: 'Remoto',
      texto: 'Entrenamiento y evaluación de modelos de IA para clientes internacionales, y proyectos que integran IA generativa con Python, TypeScript, React y Node.js.' },
    { cargo: 'Desarrollador Full Stack Junior', empresa: 'AIM Edge Apps', desde: '2023-04', hasta: '2023-06', modalidad: 'Remoto',
      texto: 'Nueva versión de la API de transcripción y corrección de errores con React, Express y FFmpeg.' },
  ],
  formacion: [
    { titulo: 'Ingeniería de Sistemas y Computación', institucion: 'Universidad del Norte', anio: 2026, url: 'https://www.uninorte.edu.co' },
  ],
  certificaciones: [
    { nombre: 'IELTS · Inglés B2 (MCER)', emisor: 'IELTS', anio: 2026 },
    { nombre: 'University Internship Program for Cloud & DevOps', emisor: 'EPAM Systems', anio: 2025 },
  ],
  reconocimientos: [
    { titulo: 'Mejor grupo estudiantil', por: 'IEEE', anio: 2026 },
    { titulo: 'Primer puesto, Feria Gamer Uninorte (Hockey is Melting Down)', por: 'Universidad del Norte', anio: 2025 },
    { titulo: 'Segundo puesto nacional, IEEEXtreme', por: 'IEEE', anio: 2024 },
  ],
  habilidades: {
    'Lenguajes': ['TypeScript', 'JavaScript', 'Python', 'PHP', 'PL/SQL', 'SQL'],
    'Frameworks': ['React', 'Next.js', 'NestJS', 'Node.js', 'Astro', 'Angular'],
    'Datos': ['Oracle Database', 'PostgreSQL', 'MySQL', 'MongoDB'],
    'Plataformas': ['Oracle APEX', 'WordPress', 'Docker', 'Dokploy', 'AWS'],
  } as Record<string, string[]>,
};

/** Mes y año en español: «jun. 2026». */
export const mesAnio = (ym: string) =>
  new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric' }).format(new Date(`${ym}-15T12:00:00`));

/** Tecnologías con artículo en el blog: el chip se vuelve enlace (antes se tocaba y no pasaba nada). */
export const articuloDe: Record<string, string> = {
  'Oracle APEX': '/blog/interactive-grid-o-interactive-report-cual-usar-en-apex',
  'Oracle Database': '/blog/el-plan-de-ejecucion-no-miente-leer-un-explain-plan',
  'PL/SQL': '/blog/el-plan-de-ejecucion-no-miente-leer-un-explain-plan',
  'SQL': '/blog/el-plan-de-ejecucion-no-miente-leer-un-explain-plan',
  'Astro': '/blog/islas-en-astro-cuando-cargar-javascript-y-cuando-no',
};
