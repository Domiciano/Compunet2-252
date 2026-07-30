// src/admin/rosterParser.js
//
// Convierte la lista de clase (el archivo Markdown que entrega la universidad,
// p. ej. `students/262.md`) en entradas `{ codigo, nombre }`.
//
// El archivo es una tabla GFM de dos columnas:
//
//   | Código | Nombre |
//   |---------|---------|
//   | A00406656 | ANDRES FELIPE RIVAS OSPINA |
//
// El parser solo mira las líneas que empiezan por `|`, así que un archivo con
// títulos, notas o varias tablas pegadas no lo rompe.

// Claves de comparación. La lista de la universidad viene en mayúsculas y sin
// tildes; el perfil lo escribe el estudiante (o lo trae Google) con tildes,
// minúsculas y espacios de más. Sin normalizar, ningún nombre casaría.

export const normalizeCodigo = (value) =>
  String(value ?? '').trim().toUpperCase().replace(/\s+/g, '');

export const normalizeName = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita las tildes ya separadas por NFD
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Clave insensible al orden de los apellidos: "RIVAS OSPINA ANDRES FELIPE" y
// "ANDRES FELIPE RIVAS OSPINA" son la misma persona, y las dos formas circulan
// (la lista oficial y el displayName de Google no siempre coinciden en orden).
export const nameSetKey = (value) => {
  const tokens = normalizeName(value).split(' ').filter(Boolean);
  return tokens.length ? [...tokens].sort().join(' ') : '';
};

const isSeparatorRow = (cells) =>
  cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));

const HEADER_CODIGO = new Set(['CODIGO', 'CODE', 'ID']);
const HEADER_NOMBRE = new Set(['NOMBRE', 'NOMBRES', 'NAME', 'ESTUDIANTE']);

const isHeaderRow = (cells) => {
  const first = normalizeName(cells[0]);
  const second = normalizeName(cells[1]);
  return HEADER_CODIGO.has(first) || HEADER_NOMBRE.has(first) || HEADER_NOMBRE.has(second);
};

// ¿Las filas de esta tabla son de la lista de clase? Un archivo puede traer
// varias tablas —el .md que exporta esta misma vista trae dos—, y la de "fuera
// de la lista" empieza por Nombre, no por Código: leerla metería correos y
// nombres como si fueran códigos. Se acepta una tabla cuando su primera columna
// es el código, o cuando es una lista de una sola columna de nombres.
const isRosterHeader = (cells) => {
  const first = normalizeName(cells[0]);
  if (HEADER_CODIGO.has(first)) return true;
  return cells.length === 1 && HEADER_NOMBRE.has(first);
};

const splitRow = (line) => {
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return inner.split('|').map((c) => c.trim());
};

/**
 * @param {string} markdown contenido crudo del .md de la lista
 * @returns {{ codigo: string, nombre: string }[]} en el orden del archivo
 */
export function parseRosterMarkdown(markdown) {
  const lines = String(markdown ?? '').split(/\r?\n/);
  const entries = [];
  const seen = new Set();
  // Una tabla sin encabezado se acepta (es lo que pasa al pegar solo las filas).
  // Cualquier línea que no sea de tabla cierra la tabla en curso.
  let accepting = true;

  for (const line of lines) {
    if (!line.trim().startsWith('|')) {
      accepting = true;
      continue;
    }
    const cells = splitRow(line);
    if (isSeparatorRow(cells)) continue;
    if (isHeaderRow(cells)) {
      accepting = isRosterHeader(cells);
      continue;
    }
    if (!accepting) continue;

    // Una sola columna se lee como nombre: hay listas que solo traen nombres.
    const [a = '', b = ''] = cells;
    const codigo = cells.length >= 2 ? a : '';
    const nombre = cells.length >= 2 ? b : a;
    if (!codigo && !nombre) continue;

    // La misma persona repetida en el archivo no debe contarse dos veces.
    const key = normalizeCodigo(codigo) || nameSetKey(nombre);
    if (seen.has(key)) continue;
    seen.add(key);

    entries.push({ codigo: codigo.trim(), nombre: nombre.trim() });
  }

  return entries;
}

export default parseRosterMarkdown;
