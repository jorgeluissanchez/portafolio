import type { APIRoute } from 'astro';
import { json } from '@/lib/api';
export const prerender = false;
export const GET: APIRoute = () => json({ ok: true });
