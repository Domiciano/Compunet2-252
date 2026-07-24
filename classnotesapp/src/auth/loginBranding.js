// src/auth/loginBranding.js
//
// Per-course look of the login / profile gate. This is a variation axis like
// the theme: only the values below change per course, the rendering lives in
// the shared LoginScreen.jsx / LoginIllustration.jsx.
//
//   courseName:      shown on the login card.
//   backgroundImages: optional array of photos for the left panel (slideshow).
//                    When null, the generated prototype mosaic is used instead.
//   motif:           mosaic pattern when backgroundImage is null —
//                    'mobile' | 'network' | 'geometric'.

export const loginBranding = {
  courseName: 'Computación en Internet II',
  backgroundImages: null,
  motif: 'network',
};
