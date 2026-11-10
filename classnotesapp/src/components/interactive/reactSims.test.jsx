import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import {
  JS_SNIPPETS, runSnippet, formatValue, buildDocument, VANILLA_EXAMPLES,
  transformJsx, evaluateJsx, JSX_PRESETS, BUNDLE_STEPS, BUNDLE_FILES, BUNDLE_OUTPUT,
  COUNTER_STEPS, COUNTER_CODE, COUNTER_TREE, EFFECT_STEPS, EFFECT_CODE, effectTree, postsPage, SAMPLE_TOKEN,
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

describe('react-effect steps', () => {
  const ops = (kind) => EFFECT_STEPS[kind].map((s) => s.op);
  const KNOWN = ['render', 'diff', 'commit', 'paint', 'show', 'effect', 'response', 'check', 'click', 'setpage', 'spin'];

  it('uses only known ops and highlights lines that exist', () => {
    Object.entries(EFFECT_STEPS).forEach(([kind, steps]) => {
      const code = EFFECT_CODE[kind === 'next' ? 'deps' : kind];
      const n = code.split('\n').length;
      steps.forEach((s) => {
        expect(KNOWN).toContain(s.op);
        (s.lines || []).forEach((l) => expect(l).toBeLessThan(n));
      });
    });
  });

  it('the effect runs only after the screen is painted', () => {
    ['mount', 'deps', 'next'].forEach((kind) => {
      const o = ops(kind);
      const effect = o.indexOf('effect');
      expect(effect).toBeGreaterThan(o.indexOf('paint'));
      expect(o.indexOf('render')).toBeLessThan(o.indexOf('paint'));
    });
  });

  it('every effect-driven run ends checking the dependencies', () => {
    ['mount', 'deps', 'next'].forEach((kind) => expect(ops(kind).at(-1)).toBe('check'));
  });

  it('without useEffect there is no effect step and the request leaves during render', () => {
    expect(ops('loop')).not.toContain('effect');
    expect(EFFECT_STEPS.loop.filter((s) => s.fetch).every((s) => s.op === 'render')).toBe(true);
    expect(ops('loop').at(-1)).toBe('spin');
  });

  it('builds the tree from the state snapshot', () => {
    expect(effectTree({ posts: [], page: 1 }, 'mount').map((n) => n.key)).toEqual(['App', 'div', 'h1', 'loading']);
    const keys = effectTree({ posts: postsPage(2), page: 2 }, 'deps').map((n) => n.key);
    expect(keys).toEqual(['App', 'div', 'h1', 'ul', 'li-4', 'li-5', 'li-6', 'button']);
  });
});

describe('react-effect block', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  const runAll = () => act(() => { vi.advanceTimersByTime(60000); });

  it('mount: one request, two renders, the list on screen and the effect does not run again', () => {
    renderBlock('react-effect');
    fireEvent.click(screen.getByTestId('effect-load'));
    runAll();
    expect(screen.getByTestId('effect-screen').querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByTestId('effect-requests').textContent).toBe('peticiones: 1');
    expect(screen.getByTestId('effect-renders').textContent).toBe('2');
    expect(screen.getByTestId('effect-status').textContent).toContain('no corre');
  });

  it('step mode: the screen shows Cargando... before any request leaves', () => {
    renderBlock('react-effect');
    fireEvent.click(screen.getByTestId('effect-stepmode'));
    fireEvent.click(screen.getByTestId('effect-load'));
    const paintAt = EFFECT_STEPS.mount.findIndex((s) => s.op === 'paint');
    for (let i = 0; i < paintAt; i += 1) fireEvent.click(screen.getByTestId('effect-step'));
    expect(screen.getByTestId('effect-screen').textContent).toContain('Cargando...');
    expect(screen.getByTestId('effect-requests').textContent).toBe('peticiones: 0');
    fireEvent.click(screen.getByTestId('effect-step'));
    expect(screen.getByTestId('effect-requests').textContent).toBe('peticiones: 1');
  });

  it('deps: Siguiente changes page, the effect runs again and loads page 2', () => {
    renderBlock('react-effect deps');
    expect(screen.getByTestId('effect-tab-deps').className).toContain('rs-sel');
    fireEvent.click(screen.getByTestId('effect-load'));
    runAll();
    fireEvent.click(screen.getByTestId('effect-next-page'));
    runAll();
    expect(screen.getByTestId('effect-page').textContent).toBe('2');
    expect(screen.getByTestId('effect-screen').textContent).toContain('página 2');
    expect(screen.getByTestId('effect-screen').textContent).toContain(postsPage(2)[0].title);
    expect(screen.getByTestId('effect-requests').textContent).toBe('peticiones: 2');
    expect(screen.getByTestId('effect-api').textContent).toContain('page=2');
  });

  it('without useEffect the requests keep piling up', () => {
    renderBlock('react-effect loop');
    fireEvent.click(screen.getByTestId('effect-load'));
    runAll();
    const n = Number(screen.getByTestId('effect-requests').textContent.replace(/\D/g, ''));
    expect(n).toBeGreaterThan(5);
  });
});

describe('local-storage block', () => {
  it('setItem survives a reload, the page variable does not', () => {
    renderBlock('local-storage');
    fireEvent.click(screen.getByTestId('ls-get'));
    expect(screen.getByTestId('ls-token').textContent).toBe('null');
    fireEvent.click(screen.getByTestId('ls-set'));
    expect(screen.getByTestId('ls-table').textContent).toContain(SAMPLE_TOKEN);
    fireEvent.click(screen.getByTestId('ls-get'));
    expect(screen.getByTestId('ls-token').textContent).toBe(`'${SAMPLE_TOKEN}'`);
    fireEvent.click(screen.getByTestId('ls-reload'));
    expect(screen.getByTestId('ls-token').textContent).toBe('—');
    expect(screen.getByTestId('ls-table').textContent).toContain(SAMPLE_TOKEN);
    fireEvent.click(screen.getByTestId('ls-remove'));
    expect(screen.getByTestId('ls-table').textContent).toContain('vacío');
  });
});
