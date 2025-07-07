// src/theme/colors.js

export const light = {
  // Títulos y textos
  contentTitle: '#fff',         // Títulos de contenido en blanco
  contentSubtitle: '#6DB33F',      // Verde Spring Boot para subtítulos
  drawerTitle: '#1b1f23',          // Gris muy oscuro para títulos del drawer
  drawerSection: '#6DB33F',        // Verde Spring Boot para secciones del drawer
  textPrimary: '#23272f',          // Texto principal sobre fondo claro
  textSecondary: '#4b5563',        // Texto secundario

  // Fondos
  background: '#f6f8fa',           // Fondo general claro
  backgroundLight: '#ffffff',      // Fondo alternativo (cards, etc.)
  drawerBg: '#f6f8fa',             // Drawer y TOC fondo

  // Drawer y TOC
  tocTitle: '#6DB33F',             // Verde Spring Boot para título TOC
  tocText: '#23272f',              // Texto TOC

  // Accentos y bordes
  accent: '#43a047',               // Verde acento (Spring)
  accentSecondary: '#6DB33F',      // Verde Spring Boot para detalles menores
  border: '#e0e0e0',               // Bordes sutiles

  // Inline code
  inlineCodeBg: 'rgba(60,60,60,0.08)',
  inlineCodeText: '#388e3c',

  // Otros
  error: '#d32f2f',                // Errores
  success: '#388e3c',              // Éxito
  warning: '#ffa000',              // Advertencia

  // CodeBlock
  codeBg: '#f3f6fa',
  codeText: '#23272f',

  appBarBg: '#6DB33F',             // Fondo AppBar verde Spring Boot
  appBarText: '#ffffff',           // Texto AppBar blanco
};

export const dark = {
  // Títulos y textos
  contentTitle: '#fff',         // Títulos de contenido en blanco
  contentSubtitle: '#6DB33F',      // Verde Spring Boot para subtítulos
  drawerTitle: '#e0e0e0',          // Gris claro para títulos del drawer
  drawerSection: '#6DB33F',        // Verde Spring Boot para secciones del drawer
  textPrimary: '#f3f6fb',          // Texto principal sobre fondo oscuro
  textSecondary: '#aab4be',        // Texto secundario

  // Fondos
  background: '#181c23',           // Fondo general oscuro
  backgroundLight: '#232936',      // Fondo alternativo (cards, etc.)
  drawerBg: '#181c23',             // Drawer y TOC fondo

  // Drawer y TOC
  tocTitle: '#6DB33F',             // Verde Spring Boot para título TOC
  tocText: '#f3f6fb',              // Texto TOC

  // Accentos y bordes
  accent: '#43a047',               // Verde acento (Spring)
  accentSecondary: '#6DB33F',      // Verde Spring Boot para detalles menores
  border: '#232936',               // Bordes sutiles

  // Inline code
  inlineCodeBg: 'rgba(60,60,60,0.22)',
  inlineCodeText: '#43a047',

  // Otros
  error: '#ff5370',                // Errores
  success: '#43d39e',              // Éxito
  warning: '#ffb300',              // Advertencia

  // CodeBlock
  codeBg: '#23272e',
  codeText: '#f8f8f2',

  appBarBg: '#6DB33F',             // Fondo AppBar verde Spring Boot
  appBarText: '#ffffff',           // Texto AppBar blanco
};

// Por defecto exportamos dark
const colors = dark;
export default colors; 