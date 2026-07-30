// src/admin/matchRoster.js
//
// Une la lista de clase (lo que la universidad dice que hay) con los perfiles de
// Firestore (quien efectivamente entró al visor). El resultado tiene tres cajas,
// y las tres importan:
//
//   rows     una fila por cada persona de la lista, con su perfil si lo tiene.
//            Las que no lo tienen son "sin ingresar" — la pregunta original.
//   extras   perfiles que no están en la lista: oyentes, otra sección, el
//            profesor, o alguien que escribió mal su código.
//   stats    los conteos que van al encabezado y al .md exportado.
//
// El emparejamiento va por código primero porque es el identificador que la
// universidad garantiza único. El nombre es respaldo: lo escribe el estudiante
// o lo trae Google, así que casa menos y se marca aparte (`matchedBy: 'nombre'`)
// para que el profesor sepa que ese código no coincidió y pueda corregirlo.

import { normalizeCodigo, normalizeName, nameSetKey } from './rosterParser';

const studentName = (s) => s?.fullName || s?.displayName || '';

// Índice de perfiles por las tres claves. El primero gana: si dos perfiles
// declaran el mismo código, el segundo cae en `extras` en vez de desaparecer.
const indexStudents = (students) => {
  const byCodigo = new Map();
  const byName = new Map();
  const byNameSet = new Map();

  for (const s of students) {
    const cod = normalizeCodigo(s?.codigo);
    if (cod && !byCodigo.has(cod)) byCodigo.set(cod, s);
    const n = normalizeName(studentName(s));
    if (n && !byName.has(n)) byName.set(n, s);
    const ns = nameSetKey(studentName(s));
    if (ns && !byNameSet.has(ns)) byNameSet.set(ns, s);
  }

  return { byCodigo, byName, byNameSet };
};

/**
 * @param {{ roster: {codigo:string,nombre:string}[], students: object[] }} input
 */
export function matchRoster({ roster = [], students = [] } = {}) {
  const idx = indexStudents(students);
  const claimed = new Set(); // uids ya asignados a una fila de la lista

  const take = (student) => {
    if (!student) return null;
    const key = student.uid ?? student.id;
    if (key && claimed.has(key)) return null;
    if (key) claimed.add(key);
    return student;
  };

  // Dos pasadas: primero todos los códigos, después los nombres sobrantes. Si se
  // hiciera fila por fila, un nombre parecido podría robarle el perfil a la fila
  // que sí tenía su código exacto más abajo en la lista.
  const matched = new Array(roster.length).fill(null);

  roster.forEach((entry, i) => {
    const cod = normalizeCodigo(entry.codigo);
    if (!cod) return;
    const hit = take(idx.byCodigo.get(cod));
    if (hit) matched[i] = { student: hit, matchedBy: 'codigo' };
  });

  roster.forEach((entry, i) => {
    if (matched[i]) return;
    const hit =
      take(idx.byName.get(normalizeName(entry.nombre))) ||
      take(idx.byNameSet.get(nameSetKey(entry.nombre)));
    if (hit) matched[i] = { student: hit, matchedBy: 'nombre' };
  });

  const rows = roster.map((entry, i) => {
    const m = matched[i];
    return {
      codigo: entry.codigo,
      nombre: entry.nombre,
      student: m?.student ?? null,
      matchedBy: m?.matchedBy ?? null,
      registered: !!m,
      // El código del perfil difiere del de la lista: casó por nombre, o el
      // estudiante se equivocó al escribirlo. Es lo único que el profesor tiene
      // que revisar a mano.
      codigoMismatch:
        !!m &&
        !!normalizeCodigo(entry.codigo) &&
        normalizeCodigo(m.student?.codigo) !== normalizeCodigo(entry.codigo),
    };
  });

  const extras = students.filter((s) => !claimed.has(s.uid ?? s.id));

  return {
    rows,
    extras,
    stats: {
      total: rows.length,
      registrados: rows.filter((r) => r.registered).length,
      pendientes: rows.filter((r) => !r.registered).length,
      extras: extras.length,
    },
  };
}

export default matchRoster;
