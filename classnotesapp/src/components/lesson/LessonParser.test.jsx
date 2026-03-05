import { describe, it, expect, vi } from 'vitest';

// Mock assets (import.meta.glob)
vi.mock('@/assets/index.js', () => ({ default: { 'image1.png': '/mock-image1.png' } }));

// Mock BeanVisualizer to avoid canvas complexity in tests
vi.mock('@/components/BeanVisualizer/BeanVisualizer', () => ({
  default: ({ initialCode }) => <div data-testid="bean-visualizer">{initialCode}</div>,
}));

import LessonParser from './LessonParser';

// Helper: call the parser and get back the plain data (no rendering needed)
const parse = (content) => LessonParser({ content });

describe('LessonParser — lessonTitle and subtitles', () => {
  it('extracts lessonTitle from the first [t] tag', () => {
    const { lessonTitle } = parse('[t] Mi Título\n[st] Sección 1');
    expect(lessonTitle).toBe('Mi Título');
  });

  it('returns null lessonTitle when there is no [t] tag', () => {
    const { lessonTitle } = parse('[st] Solo subtítulo\nTexto.');
    expect(lessonTitle).toBeNull();
  });

  it('collects subtitles from [st] tags', () => {
    const { subtitles } = parse('[t] Título\n[st] Sección A\n[st] Sección B');
    expect(subtitles).toHaveLength(2);
    expect(subtitles[0].text).toBe('Sección A');
    expect(subtitles[1].text).toBe('Sección B');
  });

  it('each subtitle has an id and text', () => {
    const { subtitles } = parse('[st] Introducción');
    expect(subtitles[0]).toHaveProperty('id');
    expect(subtitles[0]).toHaveProperty('text', 'Introducción');
  });

  it('returns empty subtitles array when no [st] tags exist', () => {
    const { subtitles } = parse('[t] Título\nTexto normal.');
    expect(subtitles).toHaveLength(0);
  });
});

describe('LessonParser — elements shape', () => {
  it('returns a React element from elements', () => {
    const { elements } = parse('[t] Título');
    expect(elements).not.toBeNull();
    expect(typeof elements).toBe('object'); // React element
  });

  it('produces elements for an empty content string', () => {
    const { elements } = parse('');
    expect(elements).not.toBeNull();
  });
});

describe('LessonParser — DSL tag recognition', () => {
  it('does not throw for all supported block tags', () => {
    const content = [
      '[t] Título',
      '[st] Subtítulo',
      '[code:java]',
      'System.out.println("hola");',
      '[endcode]',
      '[v] dQw4w9WgXcQ | Video de prueba',
      '[i] image1.png | Diagrama',
      '[icon] image1.png | Ícono',
      '[link] Enlace https://example.com',
      '[list]',
      'Elemento uno',
      'Elemento dos',
      '[endlist]',
    ].join('\n');
    expect(() => parse(content)).not.toThrow();
  });

  it('does not throw for [beansim] block', () => {
    const content = '[beansim]\n@Component\npublic class A {}\n[endbeansim]';
    expect(() => parse(content)).not.toThrow();
  });

  it('does not throw for [trycode] after a code block', () => {
    const content = '[code:java]\nint x = 1;\n[endcode]\n[trycode] abc123';
    expect(() => parse(content)).not.toThrow();
  });

  it('does not throw for [dartpad]', () => {
    expect(() => parse('[dartpad] abc123gistid')).not.toThrow();
  });
});

describe('LessonParser — [list] tag', () => {
  it('collects list items correctly (no extra subtitles)', () => {
    const { subtitles } = parse('[list]\nPrimer punto\nSegundo punto\n[endlist]');
    expect(subtitles).toHaveLength(0);
  });

  it('does not throw for an empty list', () => {
    expect(() => parse('[list]\n[endlist]')).not.toThrow();
  });
});

describe('LessonParser — [code] block', () => {
  it('does not add code block lines to subtitles', () => {
    const { subtitles } = parse('[code:java]\n// Este es código\n[endcode]');
    expect(subtitles).toHaveLength(0);
  });

  it('handles multiple code blocks', () => {
    const content = '[code:java]\nint a = 1;\n[endcode]\n[code:sql]\nSELECT * FROM t;\n[endcode]';
    expect(() => parse(content)).not.toThrow();
  });
});

describe('LessonParser — [trycode] pairing', () => {
  it('[trycode] without preceding code block is silently ignored', () => {
    expect(() => parse('[trycode] abc123')).not.toThrow();
  });
});

describe('LessonParser — inline tags', () => {
  it('handles backtick inline code inside a paragraph', () => {
    expect(() => parse('Usa `@Component` para registrar beans.')).not.toThrow();
  });

  it('handles inline [link] with space-separated syntax', () => {
    expect(() => parse('Ver [link] docs https://example.com para más info.')).not.toThrow();
  });

  it('handles inline [link] with parentheses syntax', () => {
    expect(() => parse('Ver [link] (documentación oficial) https://example.com para más info.')).not.toThrow();
  });
});

describe('LessonParser — [link] block tag', () => {
  it('handles block [link] with simple syntax', () => {
    expect(() => parse('[link] GitHub https://github.com')).not.toThrow();
  });

  it('handles block [link] with parentheses syntax', () => {
    expect(() => parse('[link] (Ir al repositorio) https://github.com')).not.toThrow();
  });
});
