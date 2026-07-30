// src/admin/adminData.js
//
// Lecturas y escrituras que solo hace el profesor. Todas dependen del custom
// claim `profesor: true` (ver firestore/firestore.rules): sin él, Firestore
// rechaza tanto el barrido de `students` como el documento de la lista.
//
// La lista de clase se guarda en Firestore, no en el bundle ni en el repo de
// contenido, y la razón es concreta: el sitio es público. Nombres y códigos de
// 27 personas dentro del JS servido por GitHub Pages —o en un `raw.github...`—
// quedan al alcance de cualquiera. En `rosters/{courseId}` los lee únicamente
// quien tiene el claim.

import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { courseId } from '@/auth/firebaseConfig';

const rosterRef = () => doc(db, 'rosters', courseId);

/** Todos los perfiles del proyecto. Un proyecto Firebase por curso, así que la
 *  colección es del tamaño del curso; el filtro por `courseId` es defensivo. */
export async function fetchStudents() {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((s) => !s.courseId || s.courseId === courseId);
}

/** @returns {{ entries: {codigo,nombre}[], label: string|null, updatedAt: Date|null }|null} */
export async function fetchRoster() {
  const snap = await getDoc(rosterRef());
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    entries: Array.isArray(data.entries) ? data.entries : [],
    label: data.label ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
}

export async function saveRoster({ entries, label, uid }) {
  await setDoc(rosterRef(), {
    courseId,
    label: label ?? null,
    // Se normaliza aquí para no guardar campos sueltos que las reglas no esperan.
    entries: entries.map(({ codigo, nombre }) => ({ codigo: codigo ?? '', nombre: nombre ?? '' })),
    count: entries.length,
    updatedAt: serverTimestamp(),
    updatedBy: uid ?? null,
  });
}
