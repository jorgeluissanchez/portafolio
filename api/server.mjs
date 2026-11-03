/**
 * API de reacciones del blog: me gusta y comentarios por párrafo.
 *
 * Node 24 sin dependencias (http + node:sqlite). Se despliega en Dokploy como una app aparte con la ruta
 * /api del mismo dominio, así el navegador no necesita CORS.
 *
 *   GET    /api/reacciones?articulo=slug&visitante=uuid → { likes, comentarios, misLikes }
 *   POST   /api/like        { articulo, parrafo, visitante }            → { total, mio }
 *   POST   /api/comentario  { articulo, parrafo, nombre, texto, sitio } → comentario publicado
 *   DELETE /api/comentario/:id   (cabecera Authorization: Bearer ADMIN_TOKEN) → borra un comentario
 *   GET    /api/comentarios/recientes (Authorization) → últimos 100, para moderar
 *   GET    /api/salud → ok
 *
 * Antispam: campo trampa «sitio», límite por IP (6 comentarios / 10 min, 120 likes / 10 min), largo máximo,
 * máximo 2 enlaces por comentario y bloqueo de comentarios repetidos.
 */
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const PUERTO = Number(process.env.PORT ?? 3001);
const RUTA_DB = process.env.DB_PATH ?? '/data/reacciones.db';
const ADMIN = process.env.ADMIN_TOKEN ?? '';
const ORIGEN = process.env.ALLOWED_ORIGIN ?? 'https://jorgesanchez.engineer';

mkdirSync(dirname(RUTA_DB), { recursive: true });
const db = new DatabaseSync(RUTA_DB);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS likes (articulo TEXT NOT NULL, parrafo TEXT NOT NULL, visitante TEXT NOT NULL, creado TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (articulo, parrafo, visitante));
  CREATE TABLE IF NOT EXISTS comentarios (id INTEGER PRIMARY KEY AUTOINCREMENT, articulo TEXT NOT NULL, parrafo TEXT NOT NULL, nombre TEXT NOT NULL, texto TEXT NOT NULL, visitante TEXT, ip TEXT, creado TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')));
  CREATE INDEX IF NOT EXISTS ix_com_articulo ON comentarios (articulo);
`);

const sql = {
  likes: db.prepare('SELECT parrafo, COUNT(*) AS n FROM likes WHERE articulo = ? GROUP BY parrafo'),
  misLikes: db.prepare('SELECT parrafo FROM likes WHERE articulo = ? AND visitante = ?'),
  comentarios: db.prepare('SELECT id, parrafo, nombre, texto, creado FROM comentarios WHERE articulo = ? ORDER BY id'),
  tieneLike: db.prepare('SELECT 1 FROM likes WHERE articulo = ? AND parrafo = ? AND visitante = ?'),
  ponerLike: db.prepare('INSERT OR IGNORE INTO likes (articulo, parrafo, visitante) VALUES (?, ?, ?)'),
  quitarLike: db.prepare('DELETE FROM likes WHERE articulo = ? AND parrafo = ? AND visitante = ?'),
  totalLike: db.prepare('SELECT COUNT(*) AS n FROM likes WHERE articulo = ? AND parrafo = ?'),
  repetido: db.prepare("SELECT 1 FROM comentarios WHERE articulo = ? AND texto = ? AND creado > strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 day')"),
  comentar: db.prepare('INSERT INTO comentarios (articulo, parrafo, nombre, texto, visitante, ip) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, parrafo, nombre, texto, creado'),
  borrar: db.prepare('DELETE FROM comentarios WHERE id = ?'),
  recientes: db.prepare('SELECT id, articulo, parrafo, nombre, texto, ip, creado FROM comentarios ORDER BY id DESC LIMIT 100'),
};

/** Límite por IP con ventana deslizante en memoria (se reinicia con el contenedor, suficiente para un blog). */
const ventanas = new Map();
function permitido(clave, max, ms) {
  const ahora = Date.now();
  const lista = (ventanas.get(clave) ?? []).filter((t) => ahora - t < ms);
  if (lista.length >= max) return false;
  lista.push(ahora);
  ventanas.set(clave, lista);
  return true;
}
setInterval(() => ventanas.clear(), 60 * 60 * 1000).unref();

const ID = /^[a-z0-9-]{1,120}$/;
const PARRAFO = /^p\d{1,3}(-[a-z0-9-]{0,56})?$/;
const limpiar = (s, max) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

function responder(res, estado, datos) {
  res.writeHead(estado, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': ORIGEN,
    'x-content-type-options': 'nosniff',
  });
  res.end(JSON.stringify(datos));
}

async function cuerpo(req) {
  let datos = '';
  for await (const parte of req) {
    datos += parte;
    if (datos.length > 8_000) throw Object.assign(new Error('demasiado grande'), { estado: 413 });
  }
  try { return JSON.parse(datos || '{}'); } catch { throw Object.assign(new Error('JSON inválido'), { estado: 400 }); }
}

const ipDe = (req) => String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '').split(',')[0].trim();
const esAdmin = (req) => ADMIN && req.headers.authorization === `Bearer ${ADMIN}`;

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  const ruta = url.pathname.replace(/^\/api/, '') || '/';
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'access-control-allow-origin': ORIGEN, 'access-control-allow-methods': 'GET,POST,DELETE', 'access-control-allow-headers': 'content-type,authorization' });
      return res.end();
    }
    if (req.method === 'GET' && ruta === '/salud') return responder(res, 200, { ok: true });

    if (req.method === 'GET' && ruta === '/reacciones') {
      const articulo = url.searchParams.get('articulo') ?? '';
      const visitante = limpiar(url.searchParams.get('visitante'), 64);
      if (!ID.test(articulo)) return responder(res, 400, { error: 'artículo inválido' });
      const likes = Object.fromEntries(sql.likes.all(articulo).map((r) => [r.parrafo, Number(r.n)]));
      const comentarios = {};
      for (const c of sql.comentarios.all(articulo)) (comentarios[c.parrafo] ??= []).push(c);
      const misLikes = visitante ? sql.misLikes.all(articulo, visitante).map((r) => r.parrafo) : [];
      return responder(res, 200, { likes, comentarios, misLikes });
    }

    if (req.method === 'POST' && ruta === '/like') {
      const { articulo, parrafo, visitante } = await cuerpo(req);
      const v = limpiar(visitante, 64);
      if (!ID.test(articulo ?? '') || !PARRAFO.test(parrafo ?? '') || v.length < 8) return responder(res, 400, { error: 'datos inválidos' });
      if (!permitido(`like:${ipDe(req)}`, 120, 10 * 60_000)) return responder(res, 429, { error: 'demasiadas solicitudes' });
      const tenia = sql.tieneLike.get(articulo, parrafo, v);
      (tenia ? sql.quitarLike : sql.ponerLike).run(articulo, parrafo, v);
      return responder(res, 200, { total: Number(sql.totalLike.get(articulo, parrafo).n), mio: !tenia });
    }

    if (req.method === 'POST' && ruta === '/comentario') {
      const b = await cuerpo(req);
      if (b.sitio) return responder(res, 201, { id: 0, parrafo: b.parrafo, nombre: 'ok', texto: '', creado: new Date().toISOString() }); // trampa: el bot cree que publicó
      const nombre = limpiar(b.nombre, 60);
      const texto = limpiar(b.texto, 800);
      if (!ID.test(b.articulo ?? '') || !PARRAFO.test(b.parrafo ?? '') || nombre.length < 2 || texto.length < 2) return responder(res, 400, { error: 'datos inválidos' });
      if ((texto.match(/https?:\/\//g) ?? []).length > 2) return responder(res, 400, { error: 'demasiados enlaces' });
      const ip = ipDe(req);
      if (!permitido(`com:${ip}`, 6, 10 * 60_000)) return responder(res, 429, { error: 'demasiadas solicitudes' });
      if (sql.repetido.get(b.articulo, texto)) return responder(res, 409, { error: 'comentario repetido' });
      const c = sql.comentar.get(b.articulo, b.parrafo, nombre, texto, limpiar(b.visitante, 64), ip);
      console.log(`comentario ${c.id} en ${b.articulo}/${b.parrafo} de «${nombre}»`);
      return responder(res, 201, c);
    }

    if (req.method === 'DELETE' && ruta.startsWith('/comentario/')) {
      if (!esAdmin(req)) return responder(res, 401, { error: 'no autorizado' });
      sql.borrar.run(Number(ruta.split('/').pop()));
      return responder(res, 200, { ok: true });
    }
    if (req.method === 'GET' && ruta === '/comentarios/recientes') {
      if (!esAdmin(req)) return responder(res, 401, { error: 'no autorizado' });
      return responder(res, 200, sql.recientes.all());
    }
    return responder(res, 404, { error: 'no existe' });
  } catch (e) {
    if (!e.estado) console.error(e);
    return responder(res, e.estado ?? 500, { error: e.estado ? e.message : 'error interno' });
  }
});

servidor.listen(PUERTO, () => console.log(`API de reacciones en :${PUERTO} (base ${RUTA_DB})`));
for (const s of ['SIGTERM', 'SIGINT']) process.on(s, () => servidor.close(() => (db.close(), process.exit(0))));
