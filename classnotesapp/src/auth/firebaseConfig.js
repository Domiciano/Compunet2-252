// src/auth/firebaseConfig.js
//
// Per-course Firebase web-app config. This is PUBLIC information, not a secret:
// the apiKey is just a project identifier. Real security is enforced by
// Firestore security rules + the "Authorized domains" list in the Firebase
// console (Authentication → Settings). So it is safe to commit these values.
//
// Curso: Computación en Internet II — proyecto Firebase "computacion-fcc47".
// (Pasos de consola para fundar otro curso: docs/AUTH_SETUP.md.)

export const firebaseConfig = {
  apiKey: 'AIzaSyCMxEq4Gkd0WSdoSMVtEHYqxGbl9NNyDxI',
  authDomain: 'computacion-fcc47.firebaseapp.com',
  projectId: 'computacion-fcc47',
  storageBucket: 'computacion-fcc47.firebasestorage.app',
  messagingSenderId: '623207781442',
  appId: '1:623207781442:web:e6dd0e8661f94e9eb089db',
  measurementId: 'G-G8LH0SHJTR',
};

// Short identifier for this course, saved on every student record.
export const courseId = 'compunet2';

// The gate is active only once a real apiKey is present.
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 0 &&
  !firebaseConfig.apiKey.startsWith('REPLACE');
