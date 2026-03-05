import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the lessonImporter (uses import.meta.glob — not available in tests)
vi.mock('@/utils/lessonImporter', () => ({
  default: {
    'lesson1.md': '[t] Lección Local Uno\n[st] Sección A\nTexto.',
    'lesson2.md': '[t] Lección Local Dos\n[st] Sección B\nTexto.',
  },
}));

import TableOfContentsParser from './tableOfContentsParser';

const REMOTE_CONTENT = '[t] Lección Remota\n[st] Sección Remote\nTexto remoto.';

describe('TableOfContentsParser — local lessons', () => {
  it('parses a [t] section title', async () => {
    const toc = '[t] SEMANA 1 · HTTP\n[lesson] lesson1.md';
    const sections = await TableOfContentsParser(toc);
    const title = sections.find(s => s.type === 'title');
    expect(title).toBeDefined();
    expect(title.label).toBe('SEMANA 1 · HTTP');
  });

  it('parses a local [lesson] entry and extracts its title', async () => {
    const toc = '[lesson] lesson1.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe('lesson');
    expect(sections[0].source).toBe('local');
    expect(sections[0].label).toBe('Lección Local Uno');
    expect(sections[0].filePath).toBe('lesson1.md');
  });

  it('assigns sequential IDs to lessons', async () => {
    const toc = '[lesson] lesson1.md\n[lesson] lesson2.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections[0].id).toBe('1');
    expect(sections[1].id).toBe('2');
  });

  it('produces a fallback label for a missing local lesson', async () => {
    const toc = '[lesson] missing.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections[0].label).toContain('no encontrada');
  });

  it('parses a [d] divider entry', async () => {
    const toc = '[t] Bloque A\n[d]\n[lesson] lesson1.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections.some(s => s.type === 'divider')).toBe(true);
  });

  it('skips lines prefixed with **', async () => {
    const toc = '**[lesson] lesson1.md\n[lesson] lesson2.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
    expect(sections[0].label).toBe('Lección Local Dos');
  });

  it('ignores empty lines', async () => {
    const toc = '\n\n[lesson] lesson1.md\n\n';
    const sections = await TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
  });

  it('IDs are sequential across mixed [t] and [lesson] entries', async () => {
    const toc = '[t] Semana 1\n[lesson] lesson1.md\n[t] Semana 2\n[lesson] lesson2.md';
    const sections = await TableOfContentsParser(toc);
    const lessons = sections.filter(s => s.type === 'lesson');
    expect(lessons[0].id).toBe('1');
    expect(lessons[1].id).toBe('2');
  });
});

describe('TableOfContentsParser — remote lessons [lesson:url]', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('fetches a remote lesson and extracts its title', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => REMOTE_CONTENT,
    });
    const toc = '[lesson:url] https://example.com/lesson-remote.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections).toHaveLength(1);
    expect(sections[0].type).toBe('lesson');
    expect(sections[0].source).toBe('remote');
    expect(sections[0].label).toBe('Lección Remota');
    expect(sections[0].url).toBe('https://example.com/lesson-remote.md');
    expect(sections[0].rawContent).toBe(REMOTE_CONTENT);
  });

  it('assigns the correct sequential ID to a remote lesson', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, text: async () => REMOTE_CONTENT });
    const toc = '[lesson] lesson1.md\n[lesson:url] https://example.com/r.md';
    const sections = await TableOfContentsParser(toc);
    const lessons = sections.filter(s => s.type === 'lesson');
    expect(lessons[0].id).toBe('1');
    expect(lessons[1].id).toBe('2');
  });

  it('produces an error-state section when the remote fetch returns non-200', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const toc = '[lesson:url] https://example.com/gone.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections[0].source).toBe('remote');
    expect(sections[0].label).toContain('Error');
    expect(sections[0].rawContent).toContain('No se pudo cargar');
  });

  it('produces an error-state section when fetch throws a network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const toc = '[lesson:url] https://example.com/offline.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections[0].label).toContain('Error');
  });

  it('mixes local and remote lessons in the same toc', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, text: async () => REMOTE_CONTENT });
    const toc = '[lesson] lesson1.md\n[lesson:url] https://example.com/r.md\n[lesson] lesson2.md';
    const sections = await TableOfContentsParser(toc);
    expect(sections).toHaveLength(3);
    expect(sections[0].source).toBe('local');
    expect(sections[1].source).toBe('remote');
    expect(sections[2].source).toBe('local');
  });
});
