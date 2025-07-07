// src/theme/colors.js

export const light = {
  // Títulos y textos
  contentTitle: '#222',         // Títulos en gris casi negro
  contentSubtitle: '#00D084',   // Subtítulos en verde brillante
  drawerTitle: '#222',          // Título del drawer en gris casi negro
  drawerSection: '#00B97A',     // Verde intermedio para secciones del drawer
  textPrimary: '#222',          // Texto principal sobre fondo claro
  textSecondary: '#444',        // Texto secundario

  // Fondos
  background: '#F5F7FA',        // Fondo general claro
  backgroundLight: '#FFFFFF',   // Fondo alternativo (cards, etc.)
  drawerBg: '#F5F7FA',          // Drawer y TOC fondo (igual que background)

  // Drawer y TOC
  tocTitle: '#222',             // Título TOC en gris casi negro
  tocText: '#222',              // Texto TOC

  // Accentos y bordes
  accent: '#00D084',               // Verde brillante acento
  border: '#e0e0e0',               // Bordes sutiles

  // Inline code
  inlineCodeBg: 'rgba(120,120,120,0.10)',
  inlineCodeText: '#009F6B',

  // Otros
  error: '#D32F2F',                // Errores
  success: '#00B97A',              // Éxito (verde fuerte)
  warning: '#FFA000',              // Advertencia

  // CodeBlock
  codeBg: '#f5f5f5',
  codeText: '#222',

  appBarBg: '#009F6B',             // Fondo AppBar claro - Verde muy oscuro
  appBarText: '#FFFFFF',           // Texto AppBar claro - Blanco para contraste
};

export const dark = {
  // Títulos y textos
  contentTitle: '#FFFFFF',         // Títulos en blanco
  contentSubtitle: '#00D084',      // Subtítulos en verde brillante
  drawerTitle: '#FFFFFF',          // Título del drawer en blanco
  drawerSection: '#00B97A',        // Verde intermedio para secciones del drawer
  textPrimary: '#F3F6FB',          // Texto principal sobre fondo oscuro
  textSecondary: '#AAB4BE',        // Texto secundario

  // Fondos
  background: '#181C23',           // Fondo general oscuro, elegante
  backgroundLight: '#232936',      // Fondo alternativo (cards, etc.)
  drawerBg: '#181C23',             // Drawer y TOC fondo (igual que background)

  // Drawer y TOC
  tocTitle: '#FFFFFF',             // Título TOC en blanco
  tocText: '#F3F6FB',              // Texto TOC

  // Accentos y bordes
  accent: '#00D084',               // Verde brillante acento
  border: '#232936',               // Bordes sutiles

  // Inline code
  inlineCodeBg: 'rgba(120,120,120,0.22)',
  inlineCodeText: '#00B97A',

  // Otros
  error: '#FF5370',                // Errores
  success: '#00B97A',              // Éxito (verde fuerte)
  warning: '#FFB300',              // Advertencia

  // CodeBlock
  codeBg: '#23272e',
  codeText: '#f8f8f2',

  appBarBg: '#009F6B',             // Fondo AppBar oscuro - Verde muy oscuro
  appBarText: '#ffffff',           // Texto AppBar oscuro - Blanco para contraste
};

// Por defecto exportamos dark
const colors = dark;
export default colors; 