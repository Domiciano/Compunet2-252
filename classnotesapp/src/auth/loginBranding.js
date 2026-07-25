// src/auth/loginBranding.js
//
// Per-course look of the login / profile gate. This is a variation axis like
// the theme: only the values below change per course, the rendering lives in
// the shared LoginScreen.jsx / LoginIllustration.jsx.
//
//   courseName:       shown on the login card.
//   backgroundImages: optional array of photos for the left panel. With more
//                     than one they cross-fade as a slideshow. When null, the
//                     generated mosaic (LoginIllustration) is used instead.
//   motif:            mosaic pattern when backgroundImages is null —
//                     'mobile' | 'network' | 'geometric'.

// Distinctive display face for the course title (loaded in index.html).
export const DISPLAY_FONT = "'Space Grotesk', 'Segoe UI', sans-serif";

export const loginBranding = {
  courseName: 'Computación en Internet II',
  backgroundImages: null,
  motif: 'network',
};
