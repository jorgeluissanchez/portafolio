/** Colecciones de contenido: artículos del blog (Markdown) y casos de proyecto (JSON). */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    extracto: z.string(),
    categoria: z.string(),
    fecha: z.coerce.date(),
    minutos: z.number(),
    demo: z.string().optional(),
    cierre: z.object({ titulo: z.string(), texto: z.string(), accionEtiqueta: z.string() }).optional(),
  }),
});

const pieza = z.union([z.string(), z.object({ imagen: z.number() })]);
const proyectos = defineCollection({
  loader: file('./src/content/proyectos/proyectos.json', { parser: (t) => JSON.parse(t).map((p: { slug: string }) => ({ id: p.slug, ...p })) }),
  schema: z.object({
    slug: z.string(),
    titulo: z.string(),
    resumen: z.string(),
    cliente: z.string().nullable(),
    anio: z.number(),
    enlace: z.string(),
    tecnologias: z.array(z.string()),
    contenido: z.array(pieza),
    imagenes: z.array(z.object({ alt: z.string(), archivo: z.string() })),
    metricas: z.array(z.object({ valor: z.string(), etiqueta: z.string(), verificada: z.boolean() })),
    reto: z.object({ titulo: z.string(), texto: z.string(), puntos: z.array(z.string()) }),
    resultados: z.array(z.string()),
    cita: z.object({ texto: z.string(), autor: z.string(), cargo: z.string() }).optional(),
    equipo: z.array(z.object({ nombre: z.string(), rol: z.string() })).optional(),
  }),
});

export const collections = { blog, proyectos };
