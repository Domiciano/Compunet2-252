// src/pages/LessonPage.jsx
// SPEC-09: supports remote lessons (source: 'remote') via section.rawContent
// SPEC-08 L1: column widths derived from named constants

import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import LessonParser from '@/components/lesson/LessonParser';
import allLessonRawContents from '@/utils/lessonImporter';
import TableOfContents from '@/components/lesson/TableOfContents';
import { useThemeMode } from '@/theme/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import { useContentSpy } from '@/hooks/useContentSpy';

// Named constants — match Layout.jsx drawerWidth and TableOfContents desktop width
const DRAWER_WIDTH = 280;
const TOC_WIDTH = 235;
// Pixel offsets for the absolute-positioned content column
const CONTENT_LEFT_OFFSET = DRAWER_WIDTH - 40;  // 240px: slight inset under the fixed drawer
const CONTENT_RIGHT_OFFSET = TOC_WIDTH - 15;    // 220px: slight inset under the fixed TOC

const LessonPage = forwardRef(({ sections }, ref) => {
  const { lessonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState({ elements: null, subtitles: [], lessonTitle: '' });
  const [showMobileToc, setShowMobileToc] = useState(false);
  const { theme } = useThemeMode();

  const { activeSection } = useContentSpy(parsedContent.subtitles);

  // Store full section objects so remote rawContent is accessible
  const lessonMap = useMemo(() => {
    const map = new Map();
    sections.forEach(sec => {
      if (sec.type === 'lesson') map.set(sec.id, sec);
    });
    return map;
  }, [sections]);

  useEffect(() => {
    setLoading(true);

    const section = lessonMap.get(lessonId);
    let rawContent = null;

    if (section) {
      if (section.source === 'remote') {
        rawContent = section.rawContent ?? null;
      } else {
        rawContent = allLessonRawContents[section.filePath] ?? null;
      }
    }

    if (rawContent) {
      const parsed = LessonParser({ content: rawContent });
      setParsedContent(parsed);
    } else {
      const errorContent = `[t] Lección no encontrada\nLa lección con ID "${lessonId}" no fue encontrada o su archivo no existe.`;
      const parsed = LessonParser({ content: errorContent });
      setParsedContent(parsed);
    }

    setLoading(false);
    window.scrollTo(0, 0);
  }, [lessonId, lessonMap]);

  useImperativeHandle(ref, () => ({
    openMobileToc: () => setShowMobileToc(true),
    closeMobileToc: () => setShowMobileToc(false),
  }));

  if (loading) {
    return <div>Cargando contenido de la lección...</div>;
  }

  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      flexDirection: { xs: 'column', lg: 'row' },
      minWidth: 0,
    }}>
      {/* Lesson content — absolute to allow independent scrolling */}
      <Box
        sx={{
          flex: 1,
          right: { lg: CONTENT_RIGHT_OFFSET, xs: 10 },
          left: { lg: CONTENT_LEFT_OFFSET, xs: 10 },
          position: 'absolute',
          overflow: 'scroll',
          height: '100vh',
          bottom: 0,
        }}
        className="hide-scrollbar"
      >
        {parsedContent.elements}
      </Box>

      {/* TOC — desktop: fixed right column */}
      <Box sx={{
        width: { lg: TOC_WIDTH },
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
        mr: 2,
        position: 'fixed',
        right: 0,
        top: 64,
      }}>
        <TableOfContents
          subtitles={parsedContent.subtitles}
          lessonTitle={parsedContent.lessonTitle}
          activeSection={activeSection}
          lessonId={lessonId}
        />
      </Box>

      {/* TOC — mobile: overlay drawer */}
      {showMobileToc && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '85vw',
            maxWidth: 320,
            height: '100vh',
            backgroundColor: theme.background,
            zIndex: 2000,
            boxShadow: 6,
            p: 2,
            display: { xs: 'block', lg: 'none' },
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2100 }}>
            <button
              onClick={() => setShowMobileToc(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              aria-label="Cerrar TOC"
            >
              <CloseIcon sx={{ color: theme.primaryTitle, fontSize: 28 }} />
            </button>
          </Box>
          <Box sx={{ pt: 4 }}>
            <TableOfContents
              subtitles={parsedContent.subtitles}
              lessonTitle={parsedContent.lessonTitle}
              activeSection={activeSection}
              lessonId={lessonId}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default LessonPage;
