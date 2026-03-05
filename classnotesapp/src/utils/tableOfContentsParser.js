// src/utils/tableOfContentsParser.js
// SPEC-09: supports [lesson:url] for remote lesson files fetched at runtime.
// SPEC-10: called with text fetched from a remote URL (configured in config.js).

import { getFirstTitleFromMarkdown } from './markdownUtils';

const TableOfContentsParser = async (tocContent) => {
  const lines = tocContent.split('\n').map(line => line.trim()).filter(line => line !== '');
  const sections = [];
  let lessonCounter = 0;

  for (const line of lines) {
    // Disabled entries (prefixed with **)
    if (line.startsWith('**')) continue;

    if (line.startsWith('[t]')) {
      const label = line.slice(3).trim();
      const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      sections.push({ type: 'title', id, label });

    } else if (line.startsWith('[d]')) {
      sections.push({ type: 'divider' });

    } else if (line.startsWith('[lesson:url]')) {
      // Remote lesson — fetch content at runtime
      const url = line.slice(12).trim();
      const lessonId = ++lessonCounter;
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawContent = await response.text();
        const lessonLabel = getFirstTitleFromMarkdown(rawContent);
        sections.push({
          type: 'lesson',
          source: 'remote',
          id: String(lessonId),
          label: lessonLabel || `Lección ${lessonId} (sin título)`,
          url,
          rawContent,
        });
      } catch (err) {
        console.warn(`[TableOfContentsParser] No se pudo cargar la lección remota: ${url}`, err);
        sections.push({
          type: 'lesson',
          source: 'remote',
          id: String(lessonId),
          label: `Error cargando lección (${url})`,
          url,
          rawContent: `[t] Error\nNo se pudo cargar la lección desde:\n${url}`,
        });
      }

    } else if (line.startsWith('[lesson]')) {
      // Local lesson — for development use only (requires local content files)
      console.warn(`[TableOfContentsParser] Entrada local ignorada en modo URL: ${line}`);
    }
  }

  return sections;
};

export default TableOfContentsParser;
