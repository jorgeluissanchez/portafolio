/**
 * Perfil profesional: una sola fuente para la página «Sobre mí», las páginas de servicio y los datos
 * estructurados (Person). Datos tomados de LinkedIn y del CV del portafolio anterior.
 */
export const perfil = {
  nombreCompleto: 'Jorge Luis Sánchez Barreneche',
  nombre: 'Jorge Sánchez',
  profesion: 'Ingeniero de Sistemas y desarrollador full stack',
  resumen:
    'Soy Jorge Sánchez, ingeniero de sistemas y computación de la Universidad del Norte y desarrollador full stack en Barranquilla. Desde 2023 construyo sitios web, tiendas en línea y aplicaciones a la medida: landing pages que traen clientes, e-commerce para redes de servicio y sistemas de gestión en Oracle APEX para empresas medianas y grandes.',
  experiencia: [
    { cargo: 'Full Stack Engineer', empresa: 'Solinces', desde: '2026-06', hasta: null, modalidad: 'Remoto',
      texto: 'Desarrollo front-end y back-end de productos web.' },
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
