// src/content/config.js
// SPEC-10: Single build-time artifact that points the app at its content source.
// Change tocUrl to point at a different branch or repo without rebuilding the app.
// Set tocUrl to '' to use the local src/content/toc.md (development / offline mode).

const courseConfig = {
  tocUrl: 'https://raw.githubusercontent.com/DomicianoRincon/Computacion2/refs/heads/main/toc.md',

  // Calendario del curso. Es dato del profesor, no del alumno: constante en el repo,
  // sin UI. Lo consume el análisis, no la app — ver analitics/features.md § F4.4.
  //
  // courseStartDate: lunes de la SEMANA 1. De aquí sale la fecha planeada de cada
  // lección (`courseStartDate + (week − 1) × 7 días`, con `week` que el parser arrastra
  // desde los títulos [t] de toc.md, SPEC-13), y sin ella no existe `scheduleLagDays`
  // — H3, la hipótesis núcleo de la alerta temprana de RQ4.
  courseStartDate: '2026-07-27',

  // Cortes evaluativos, en orden. Cada uno { id, label, date } con `date` en AAAA-MM-DD.
  // Definen las "48 h previas" de `crammingRatio` (H2) y son la clave para unir con
  // `gradeMidterm{n}` de datadict.md § 4.
  // PENDIENTE: fechas sin definir. Mientras esté vacío H2 no se puede evaluar, pero no
  // se pierden datos: se calcula después sobre la traza ya recogida.
  assessments: [],

  // --- Módulo de IA (F2) ---------------------------------------------------
  // El id del modelo va aquí y no incrustado en un componente: cambiarlo por uno
  // más nuevo o más barato no debería obligar a tocar la UI del chat.
  // gemini-2.5-flash: rápido, cuota gratuita generosa y contexto de sobra para
  // meter una lección entera (mediana ~6 KB, p90 ~15 KB).
  aiModel: 'gemini-2.5-flash',

  // Pista de dominio para la instrucción del sistema. Es lo único del prompt que
  // cambia por curso; el resto del andamiaje es idéntico entre repos.
  aiCourseHint: 'Java, Spring Boot, REST, React',
};

export default courseConfig;
