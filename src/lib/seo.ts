/**
 * Meta descriptions de 150–160 caracteres (lo que pide Bing y lo que Google muestra sin cortar).
 * Parte del texto propio de la página y lo completa con una cola útil; si se pasa, corta en la última palabra.
 */
export function descripcion(base: string, cola: string, max = 160): string {
  const limpio = base.replace(/\s+/g, ' ').trim();
  let texto = limpio.length >= 150 ? limpio : `${limpio.replace(/\.?$/, '.')} ${cola}`;
  if (texto.length > max) texto = texto.slice(0, max - 1).replace(/[\s,;:.-]+\S*$/, '') + '…';
  return texto;
}

export const slugTitulo = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
