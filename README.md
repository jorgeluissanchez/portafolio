# Portafolio · Jorge Sánchez

Sitio en Astro 7 + Tailwind 4 que replica el Figma «Portafolio · Jorge Sánchez» (escritorio 1366 y móvil 390).

## Uso
```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # genera dist/
```

## Estructura
- `src/data/` — textos, proyectos y datos de contacto (aquí se cambia el contenido).
- `src/components/atoms` — Botón, Ícono, Sello Grixxo.
- `src/components/organisms` — Menú, Inicio, Mis proyectos (slider), Contacto/Footer, Contacto flotante.
- `src/styles/global.css` — colores y tipografías del Figma.

## Pendiente
- URLs de GitHub y LinkedIn en `src/data/site.ts`.
- Secciones Servicios, Proceso y Sobre mí (el menú apunta a #contacto por ahora).
