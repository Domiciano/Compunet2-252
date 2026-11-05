import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import {
  JS_SNIPPETS, runSnippet, formatValue, buildDocument, VANILLA_EXAMPLES,
  transformJsx, evaluateJsx, JSX_PRESETS, BUNDLE_STEPS, BUNDLE_FILES, BUNDLE_OUTPUT,
  COUNTER_STEPS, COUNTER_CODE, COUNTER_TREE,
} from './reactSims';

const renderBlock = (spec) => render(<ThemeProvider><InteractiveBlock spec={spec} /></ThemeProvider>);
const texts = (lines) => lines.map((line) => line.text);
const flat = (code) => code.replace(/\(\s+/g, '(').replace(/,\s+/g, ', ').replace(/\s+\)/g, ')');

describe('js-run', () => {
  it('formats values like a browser console', () => {
    expect(formatValue('hola')).toBe('hola');
    expect(formatValue(['a', 1, true])).toBe('["a", 1, true]');
    expect(formatValue({ nombre: 'Ana', tags: ['x'] })).toBe('{nombre: "Ana", tags: ["x"]}');
    expect(formatValue(null)).toBe('null');
  });

  it('prints the expected output for the lesson snippets', () => {
    expect(texts(runSnippet(JS_SNIPPETS.variables))).toEqual(['21', 'Ana']);
    expect(texts(runSnippet(JS_SNIPPETS.types))).toEqual([
      'string number boolean', 'object undefined', 'Hola, tengo 25 años',
    ]);
    expect(texts(runSnippet(JS_SNIPPETS.arrays))).toEqual(['manzana 3', '["manzana", "kiwi", "uva", "banano"]']);
    expect(texts(runSnippet(JS_SNIPPETS.destructuring))).toEqual(['Lucía lucia@icesi.edu.co', 'rojo verde']);
    expect(texts(runSnippet(JS_SNIPPETS['map-filter']))).toEqual(['[6.4, 9, 5.6, 10]', '[3.2, 4.5, 5]', '[3.2, 4.5, 2.8, 5]']);
    expect(texts(runSnippet(JS_SNIPPETS.spread))).toEqual([
      '[1, 2] [1, 2, 3]', '{nombre: "Ana", edad: 20}', '{nombre: "Ana", edad: 21}',
    ]);
    expect(texts(runSnippet(JS_SNIPPETS.callbacks))).toEqual(['Antes', '¡Me llamaron!', 'Después']);
  });

  it('every snippet runs; only var shows an error, on purpose', () => {
    Object.entries(JS_SNIPPETS).forEach(([key, code]) => {
      const errors = runSnippet(code).filter((line) => line.kind === 'error');
      if (key === 'var') expect(texts(errors)).toEqual(['Uncaught ReferenceError: b is not defined']);
      else expect(errors, key).toEqual([]);
    });
  });

  it('reports assignment to a const as a TypeError', () => {
    const lines = runSnippet(JS_SNIPPETS.variables.replace('// nombre = "Luis";', 'nombre = "Luis";'));
    expect(lines[lines.length - 1].text).toMatch(/^Uncaught TypeError/);
  });

  it('runs from the block and can be restored', () => {
    renderBlock('js-run callbacks');
    fireEvent.click(screen.getByText('▶ Ejecutar'));
    expect(screen.getByTestId('js-run-output').textContent).toContain('¡Me llamaron!');
  });

  it('collects lines printed later by async code', async () => {
    vi.useFakeTimers();
    const later = [];
    runSnippet(JS_SNIPPETS.async, (line) => later.push(line.text));
    expect(later).toEqual(['Cargando…', 'Esto sale antes de Listo']);
    await vi.advanceTimersByTimeAsync(1000);
    expect(later).toEqual(['Cargando…', 'Esto sale antes de Listo', 'Listo']);
    vi.useRealTimers();
  });
});

describe('vanilla-dom', () => {
  it('inlines app.js where index.html loads it', () => {
    Object.values(VANILLA_EXAMPLES).forEach(({ html, js }) => {
      const { doc, loadsApp } = buildDocument(html, js);
      expect(loadsApp).toBe(true);
      expect(doc).toContain(js.split('\n')[0]);
      expect(doc).not.toContain('src="app.js"');
    });
  });

  it('notices when the HTML no longer loads the script', () => {
    const { html, js } = VANILLA_EXAMPLES.greet;
    expect(buildDocument(html.replace('<script src="app.js"></script>', ''), js).loadsApp).toBe(false);
  });

  it('mounts with both files as tabs', () => {
    renderBlock('vanilla-dom list');
    expect(screen.getByText('index.html')).toBeTruthy();
    expect(screen.getByText('app.js')).toBeTruthy();
  });
});

describe('bundler', () => {
  it('ends with the three files of dist/ and every module of the graph seen', () => {
    const out = BUNDLE_STEPS.flatMap((s) => s.out || []);
    BUNDLE_OUTPUT.forEach((file) => expect(out).toContain(file.key));
    const seen = BUNDLE_STEPS.flatMap((s) => s.seen || []);
    BUNDLE_FILES.filter((f) => !f.folder && !f.ghost).forEach((f) => expect(seen, f.key).toContain(f.key));
  });

  it('walks every step with Siguiente', () => {
    renderBlock('bundler');
    const next = screen.getByTestId('bundler-next');
    BUNDLE_STEPS.forEach(() => fireEvent.click(next));
    expect(next.disabled).toBe(true);
    expect(screen.getByText('index-B7xQ2k.js')).toBeTruthy();
  });
});

describe('JSX', () => {
  it('turns JSX into React.createElement calls', () => {
    const out = transformJsx('const a = <h1 className="t">Hola, {nombre}</h1>;');
    expect(out).toBe('const a = React.createElement("h1", { className: "t" }, "Hola, ", nombre);');
  });

  it('handles fragments, self-closing tags, components and JSX inside expressions', () => {
    expect(flat(transformJsx('x = <><br /></>'))).toBe('x = React.createElement(React.Fragment, null, React.createElement("br", null))');
    expect(transformJsx('x = <Header title="A" />')).toBe('x = React.createElement(Header, { title: "A" })');
    expect(flat(transformJsx('x = <ul>{a.map((f) => <li>{f}</li>)}</ul>')))
      .toBe('x = React.createElement("ul", null, a.map((f) => React.createElement("li", null, f)))');
  });

  it('leaves comparisons alone', () => {
    expect(transformJsx('if (a < b) x = 1;')).toBe('if (a < b) x = 1;');
  });

  it('rejects two roots with the message React developers see', () => {
    const preset = JSX_PRESETS.jsx.find((p) => p.key === 'adjacent');
    expect(() => transformJsx(preset.code)).toThrow(/Adjacent JSX elements/);
  });

  it('reports a mismatched closing tag', () => {
    expect(() => transformJsx('x = <div><p>hola</div>')).toThrow(/<\/p>/);
  });

  it('evaluates every preset except the broken one', () => {
    [...JSX_PRESETS.jsx, ...JSX_PRESETS.header].forEach((preset) => {
      if (preset.key === 'adjacent') return;
      const { tree } = evaluateJsx(preset.code);
      expect(tree.length, preset.key).toBeGreaterThan(0);
    });
  });

  it('passes props down to Header', () => {
    const preset = JSX_PRESETS.header.find((p) => p.key === 'props');
    const app = evaluateJsx(preset.code).tree[0];
    const headers = app.children[0].children;
    expect(headers.map((h) => h.props.title)).toEqual(['Computación 2', 'Semana 14']);
    expect(headers[1].children[0].children[0].children[0].text).toBe('Semana 14');
  });

  it('warns about class instead of className', () => {
    const { warnings } = evaluateJsx('function App() { return <div class="x">a</div>; }');
    expect(warnings[0]).toMatch(/className/);
  });

  it('shows a compile error in the screen panel', () => {
    renderBlock('jsx-live adjacent');
    expect(screen.getByTestId('jsx-error').textContent).toMatch(/Adjacent JSX elements/);
    expect(screen.queryByText(/JAVASCRIPT QUE LLEGA/)).toBeNull();
  });

  it('renders the preview from the block', () => {
    renderBlock('props-header props');
    expect(screen.getByTestId('jsx-preview').textContent).toContain('Semana 14');
    expect(screen.getByTestId('jsx-tree').textContent).toContain('title="Computación 2"');
  });
});

describe('react-counter steps', () => {
  it('highlights only lines that exist in the code', () => {
    Object.entries(COUNTER_STEPS).forEach(([variant, steps]) => {
      const n = COUNTER_CODE[variant].split('\n').length;
      steps.forEach((s) => (s.lines || []).forEach((l) => expect(l).toBeLessThan(n)));
    });
  });

  it('with useState the value moves variable → tree → DOM → screen, in that order', () => {
    expect(COUNTER_STEPS.state.filter((s) => s.set).map((s) => s.set)).toEqual(['vars', 'built', 'dom', 'painted']);
    const render = COUNTER_STEPS.state.findIndex((s) => s.render);
    expect(render).toBeGreaterThan(COUNTER_STEPS.state.findIndex((s) => s.set === 'vars'));
    expect(render).toBeLessThan(COUNTER_STEPS.state.findIndex((s) => s.set === 'built'));
  });

  it('the plain variable never re-renders', () => {
    expect(COUNTER_STEPS.forget.flatMap((s) => (s.set ? [s.set] : []))).toEqual(['vars']);
    expect(COUNTER_STEPS.forget.some((s) => s.render)).toBe(false);
  });

  it('only the node that reads the state changes in the diff', () => {
    expect(COUNTER_TREE.filter((n) => n.reads).map((n) => n.key)).toEqual(['p']);
  });
});

describe('react-counter block', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const runAll = () => act(() => { vi.advanceTimersByTime(30000); });
  const ids = (container) => [...container.querySelectorAll('.rs-oid')].map((n) => n.textContent);

  it('a click updates state, tree and screen, and renews the tree objects', () => {
    const { container } = renderBlock('react-counter');
    const before = ids(container);
    fireEvent.click(screen.getByTestId('counter-plus'));
    runAll();
    expect(screen.getByTestId('counter-comp-value').textContent).toBe('1');
    expect(screen.getByTestId('counter-screen-value').textContent).toBe('1');
    expect(container.querySelector('[data-node=p]').textContent).toContain('<p>1</p>');
    expect(container.querySelector('[data-node=dom-p]').textContent).toContain('<p>1</p>');
    expect(ids(container)).not.toEqual(before);
  });

  it('the plain-variable tab changes the value but not the screen nor the tree', () => {
    const { container } = renderBlock('react-counter');
    fireEvent.click(screen.getByTestId('counter-tab-forget'));
    const before = ids(container);
    fireEvent.click(screen.getByTestId('counter-plus'));
    runAll();
    fireEvent.click(screen.getByTestId('counter-plus'));
    runAll();
    expect(screen.getByTestId('counter-comp-value').textContent).toBe('2');
    expect(screen.getByTestId('counter-screen-value').textContent).toBe('0');
    expect(ids(container)).toEqual(before);
    expect(container.querySelector('[data-node=dom-p]').textContent).toContain('<p>0</p>');
    expect(screen.getByTestId('counter-state').textContent).toContain('React no se enteró');
  });

  it('opens on the plain-variable tab with the forget option', () => {
    renderBlock('react-counter forget');
    expect(screen.getByTestId('counter-tab-forget').className).toContain('rs-sel');
  });

  it('step mode waits for Siguiente paso', () => {
    renderBlock('react-counter');
    fireEvent.click(screen.getByTestId('counter-stepmode'));
    fireEvent.click(screen.getByTestId('counter-plus'));
    runAll();
    expect(screen.getByTestId('counter-screen-value').textContent).toBe('0');
    const steps = COUNTER_STEPS.state;
    const domAt = steps.findIndex((s) => s.set === 'dom');
    for (let i = 1; i <= domAt; i += 1) fireEvent.click(screen.getByTestId('counter-next'));
    expect(screen.getByTestId('counter-dom').textContent).toContain('<p>1</p>');
    expect(screen.getByTestId('counter-screen-value').textContent).toBe('0');
    steps.slice(domAt).forEach(() => fireEvent.click(screen.getByTestId('counter-next')));
    expect(screen.getByTestId('counter-screen-value').textContent).toBe('1');
  });
});
