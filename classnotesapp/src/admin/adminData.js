// src/admin/adminData.js
//
// Lecturas y escrituras que solo hace el profesor. Todas dependen del custom
// claim `profesor: true` (ver firestore/firestore.rules): sin él, Firestore
// rechaza tanto el barrido de `students` como el documento de la lista.
//
// La lista de clase se guarda en Firestore, no en el bundle ni en el repo de
// contenido, y la razón es concreta: el sitio es público. Nombres y códigos de
// 27 personas dentro del JS servido por GitHub Pages —o en un `raw.github...`—
// quedan al alcance de cualquiera. En `rosters/…` los lee únicamente quien tiene
// el claim.
//
// **Una lista por semestre**: el documento es `rosters/{courseId}-{term}`, p. ej.
// `rosters/compunet2-262`. El curso se repite cada periodo con otra gente, así
// que una sola lista por curso obligaría a pisar la del semestre anterior para
// empezar el siguiente; separadas, las viejas se conservan y la vista deja elegir
// cuál mirar. `rosters/{courseId}` a secas es el documento heredado de antes de
// esta separación, y se lee como una lista "sin semestre".

import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { courseId } from '@/auth/firebaseConfig';

/** `262` → `compunet2-262`; sin semestre, el id heredado. */
export const rosterDocId = (term) => (term ? `${courseId}-${term}` : courseId);

const rosterRef = (term) => doc(db, 'rosters', rosterDocId(term));

const toRoster = (snap) => {
  const data = snap.data();
  return {
    id: snap.id,
    // El heredado no trae `term`; se deduce del id cuando el id lo lleva.
    term: data.term ?? (snap.id.startsWith(`${courseId}-`) ? snap.id.slice(courseId.length + 1) : ''),
    entries: Array.isArray(data.entries) ? data.entries : [],
    count: data.count ?? (Array.isArray(data.entries) ? data.entries.length : 0),
    label: data.label ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
};

/** Todos los perfiles del proyecto. Un proyecto Firebase por curso, así que la
 *  colección es del tamaño del curso; el filtro por `courseId` es defensivo. */
export async function fetchStudents() {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((s) => !s.courseId || s.courseId === courseId);
}

/**
 * Las listas de todos los semestres de este curso, sin sus entradas: solo lo que
 * necesita el selector (semestre, cuántos, cuándo se cargó). La colección tiene
 * un documento por semestre —una decena en toda la vida del curso—, así que se
 * lee entera y se filtra en memoria.
 *
 * @returns {{ id, term, count, label, updatedAt }[]} del semestre más reciente al más viejo
 */
export async function listRosters() {
  const snap = await getDocs(collection(db, 'rosters'));
  return snap.docs
    .map(toRoster)
    .filter((r) => r.id === courseId || r.id.startsWith(`${courseId}-`))
    // Sin `entries`: el selector solo necesita el rótulo, y las listas completas
    // de todos los semestres en memoria no las usa nadie.
    .map((r) => ({ id: r.id, term: r.term, count: r.count, label: r.label, updatedAt: r.updatedAt }))
    .sort((a, b) => String(b.term).localeCompare(String(a.term)));
}

/** @returns {{ id, term, entries, count, label, updatedAt }|null} */
export async function fetchRoster(term) {
  const snap = await getDoc(rosterRef(term));
  if (!snap.exists()) return null;
  return toRoster(snap);
}

export async function saveRoster({ term, entries, label, uid }) {
  await setDoc(rosterRef(term), {
    courseId,
    term: term ?? '',
    label: label ?? null,
    // Se normaliza aquí para no guardar campos sueltos que las reglas no esperan.
    entries: entries.map(({ codigo, nombre }) => ({ codigo: codigo ?? '', nombre: nombre ?? '' })),
    count: entries.length,
    updatedAt: serverTimestamp(),
    updatedBy: uid ?? null,
  });
}
