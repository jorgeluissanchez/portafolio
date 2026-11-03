/**
 * Base de datos de reacciones del blog: me gusta y comentarios por párrafo.
 *
 * Astro DB se retiró en Astro 7; la guía de migración recomienda el SQLite que trae Node (`node:sqlite`), y eso es
 * lo que se usa aquí: un archivo en el volumen /data del contenedor, sin servicios ni dependencias extra.
 * Solo lo importan las rutas /api (renderizadas bajo demanda); las páginas siguen siendo HTML estático.
 */
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const RUTA = process.env.DB_PATH ?? './data/reacciones.db';
mkdirSync(dirname(RUTA), { recursive: true });
const db = new DatabaseSync(RUTA);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS likes (
    articulo TEXT NOT NULL, parrafo TEXT NOT NULL, visitante TEXT NOT NULL,
    creado TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (articulo, parrafo, visitante)
  );
  CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT, articulo TEXT NOT NULL, parrafo TEXT NOT NULL,
    nombre TEXT NOT NULL, texto TEXT NOT NULL, visitante TEXT, ip TEXT,
    creado TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  CREATE INDEX IF NOT EXISTS ix_comentarios_articulo ON comentarios (articulo);
`);
// La IP solo sirve contra el spam: se borra a los 12 meses (así lo dice la política de privacidad)
const olvidarIps = () => db.exec("UPDATE comentarios SET ip = NULL WHERE ip IS NOT NULL AND creado < strftime('%Y-%m-%dT%H:%M:%fZ','now','-12 months')");
olvidarIps();
setInterval(olvidarIps, 24 * 60 * 60 * 1000).unref();

export type Comentario = { id: number; parrafo: string; nombre: string; texto: string; creado: string };

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

export function reacciones(articulo: string, visitante: string) {
  const likes = Object.fromEntries(sql.likes.all(articulo).map((r: any) => [r.parrafo, Number(r.n)]));
  const comentarios: Record<string, Comentario[]> = {};
  for (const c of sql.comentarios.all(articulo) as Comentario[]) (comentarios[c.parrafo] ??= []).push({ ...c });
  const misLikes = visitante ? sql.misLikes.all(articulo, visitante).map((r: any) => r.parrafo as string) : [];
  return { likes, comentarios, misLikes };
}

export function alternarLike(articulo: string, parrafo: string, visitante: string) {
  const tenia = sql.tieneLike.get(articulo, parrafo, visitante);
  (tenia ? sql.quitarLike : sql.ponerLike).run(articulo, parrafo, visitante);
  return { total: Number((sql.totalLike.get(articulo, parrafo) as any).n), mio: !tenia };
}

export const esRepetido = (articulo: string, texto: string) => !!sql.repetido.get(articulo, texto);
export const comentar = (articulo: string, parrafo: string, nombre: string, texto: string, visitante: string, ip: string) =>
  ({ ...(sql.comentar.get(articulo, parrafo, nombre, texto, visitante, ip) as Comentario) });
export const borrarComentario = (id: number) => sql.borrar.run(id);
export const comentariosRecientes = () => sql.recientes.all();
