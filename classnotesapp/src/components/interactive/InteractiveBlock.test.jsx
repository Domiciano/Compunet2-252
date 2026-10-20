import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import { webcrypto } from 'node:crypto';
import { SIMS, parseSpec, jwtSteps, JWT_BANDS as BAND, JWT_GAPS as GAP_BANDS, b64url, payloadJson, signJwt, JWT_SECRET, CHAIN_FILTERS } from './springSecuritySims';

const renderBlock = (spec) => render(<ThemeProvider><InteractiveBlock spec={spec} /></ThemeProvider>);

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const SCENARIOS = {
  'login ok': { endpoint: 'login', token: null, password: '123456' },
  'login con contraseña mala': { endpoint: 'login', token: null, password: 'x' },
  'posts sin token': { endpoint: 'posts', token: null },
  'posts con token': { endpoint: 'posts', token: 'ok' },
  'posts con token alterado': { endpoint: 'posts', token: 'bad' },
};

describe('parseSpec', () => {
  it('splits the simulator name from its options', () => {
    expect(parseSpec('jwt-flow')).toEqual({ name: 'jwt-flow', args: [] });
    expect(parseSpec('')).toEqual({ name: '', args: [] });
  });
});

describe('InteractiveBlock', () => {
  it('shows a visible notice for an unknown simulator instead of a blank block', () => {
    renderBlock('nope');
    expect(screen.getByText(/Diagrama interactivo desconocido/)).toBeTruthy();
  });

  it('mounts every registered simulator and cleans up on unmount', () => {
    Object.keys(SIMS).forEach((name) => {
      const { container, unmount } = renderBlock(name);
      expect(container.querySelector('.jsim')).toBeTruthy();
      unmount();
    });
    expect(document.getElementById('jsim-style')).toBeTruthy();
  });
});

describe('jwtSteps', () => {
  Object.entries(SCENARIOS).forEach(([label, input]) => {
    it(`${label}: each step starts where the previous message arrived, or next to it`, () => {
      let arrived = 0;
      jwtSteps(input).forEach((step) => {
        const here = BAND[step.hot[0]];
        expect(Math.abs(here - arrived)).toBeLessThanOrEqual(1);
        if (!step.gap) {
          arrived = here;
          return;
        }
        const [top, bottom] = GAP_BANDS[step.gap[0]];
        expect([top, bottom]).toContain(here);
        arrived = step.gap[1] === 'down' ? bottom : top;
      });
    });
  });

  it('never reaches a controller without a valid token', () => {
    ['posts sin token', 'posts con token alterado'].forEach((label) => {
      const steps = jwtSteps(SCENARIOS[label]);
      expect(steps.some((step) => step.hot.includes('posts'))).toBe(false);
      expect(steps.at(-1).response).toEqual(['fail', expect.stringContaining('401')]);
    });
  });

  it('stops a tampered token at the JwtAuthFilter', () => {
    const steps = jwtSteps(SCENARIOS['posts con token alterado']);
    expect(steps.some((step) => step.hot.includes('authz'))).toBe(false);
    expect(steps.find((step) => step.status && step.status.jwt).status.jwt[0]).toBe('stop');
  });

  it('goes down to the database through the service and the repository', () => {
    const login = jwtSteps(SCENARIOS['login ok']);
    expect(login.map((step) => step.hot[0])).toEqual(expect.arrayContaining(['userService', 'userRepo', 'db']));
    expect(login.find((step) => step.read).read).toBe('users');
    const posts = jwtSteps(SCENARIOS['posts con token']);
    expect(posts.map((step) => step.hot[0])).toEqual(expect.arrayContaining(['postService', 'postRepo', 'db']));
    expect(posts.find((step) => step.read).read).toBe('posts');
  });

  it('runs JwtAuthFilter before UsernamePasswordAuthenticationFilter', () => {
    Object.values(SCENARIOS).forEach((input) => {
      const order = jwtSteps(input).map((step) => step.hot[0]);
      const upaf = order.indexOf('upaf');
      if (upaf >= 0) expect(order.indexOf('jwt')).toBeLessThan(upaf);
    });
  });

  it('crosses the filters in one step on login and decides permitAll in AuthorizationFilter', () => {
    const steps = jwtSteps(SCENARIOS['login ok']);
    expect(steps[1].hot).toEqual(['others', 'jwt', 'upaf']);
    expect(steps[2].hot).toEqual(['authz']);
    expect(steps[2].rule).toEqual(['permit', 'pass']);
  });

  it('checks authenticated() for /posts, and only there', () => {
    expect(jwtSteps(SCENARIOS['posts con token']).find((step) => step.rule).rule).toEqual(['auth', 'pass']);
    expect(jwtSteps(SCENARIOS['posts sin token']).find((step) => step.rule).rule).toEqual(['auth', 'stop']);
    expect(jwtSteps(SCENARIOS['posts con token alterado']).some((step) => step.rule)).toBe(false);
  });

  it('only issues a token for good credentials', () => {
    expect(jwtSteps(SCENARIOS['login ok']).at(-1).saveToken).toBe(true);
    const bad = jwtSteps(SCENARIOS['login con contraseña mala']);
    expect(bad.some((step) => step.saveToken || step.hot.includes('jwtService'))).toBe(false);
  });
});

describe('jwt-flow', () => {
  const runAll = () => act(() => vi.advanceTimersByTime(60000));

  it('rejects /posts without a token, then serves it after logging in', () => {
    const { container } = renderBlock('jwt-flow');
    fireEvent.click(screen.getByTestId('call-posts'));
    runAll();
    expect(screen.getByTestId('client-response').textContent).toContain('401');
    expect(screen.getByTestId('client-token').textContent).toBe('ninguno');

    fireEvent.click(screen.getByTestId('call-login'));
    runAll();
    expect(screen.getByTestId('client-token').textContent).toMatch(/^eyJ/);

    fireEvent.click(screen.getByTestId('call-posts'));
    runAll();
    expect(screen.getByTestId('client-response').textContent).toContain('200');
    expect(screen.getByTestId('security-context').textContent).toContain('profesor@gmail.com');
    expect(container.querySelector('[data-testid="status-jwt"]').textContent).toContain('válido');
  });

  it('shows one message at a time in step-by-step mode', () => {
    const { container } = renderBlock('jwt-flow');
    fireEvent.click(screen.getByLabelText('Paso a paso'));
    fireEvent.click(screen.getByTestId('call-login'));
    const next = screen.getByText('Siguiente paso');
    for (let i = 0; i < 40 && next.style.display !== 'none'; i += 1) {
      expect(container.querySelectorAll('.js-msg').length).toBeLessThanOrEqual(1);
      fireEvent.click(next);
    }
    expect(next.style.display).toBe('none');
    expect(screen.getByTestId('client-response').textContent).toContain('200');
  });
});

describe('jwt-anatomy', () => {
  const LESSON = {
    header: 'eyJhbGciOiJIUzM4NCJ9',
    payload: 'eyJhdXRob3JpdGllcyI6WyJST0xFX1BST0ZFU09SIl0sInN1YiI6InByb2Zlc29yQGdtYWlsLmNvbSIsImlhdCI6MTc0NDI5ODQxNSwiZXhwIjoxNzQ0MzAwMjE1fQ',
    signature: 'ETLoFXS33XS084H-fSV3diLRcqh0Njjh3Ib1cDpqve0H518mYYAAqZjKqkofAHa0',
  };

  it('rebuilds the example token of the lesson byte for byte', async () => {
    expect(b64url('{"alg":"HS384"}')).toBe(LESSON.header);
    const payload = b64url(payloadJson({ sub: 'profesor@gmail.com', role: 'ROLE_PROFESOR', expired: false }));
    expect(payload).toBe(LESSON.payload);
    expect(await signJwt(`${LESSON.header}.${payload}`, JWT_SECRET, webcrypto.subtle)).toBe(LESSON.signature);
  });

  it('rejects a tampered payload and accepts it only when signed with the real secret', async () => {
    vi.useRealTimers();
    vi.stubGlobal('crypto', webcrypto);
    renderBlock('jwt-anatomy');
    const result = screen.getByTestId('jwt-result');
    await vi.waitFor(() => expect(result.textContent).toContain('Aceptado'));

    fireEvent.change(screen.getByLabelText('authorities'), { target: { value: 'ROLE_PROFESOR' } });
    await vi.waitFor(() => expect(result.textContent).toContain('la firma no coincide'));

    fireEvent.input(screen.getByLabelText('Secreto para firmar'), { target: { value: 'adivinanza' } });
    fireEvent.click(screen.getByText('Firmar de nuevo con este secreto'));
    await vi.waitFor(() => expect(screen.getByTestId('jwt-signature').textContent).not.toBe('…'));
    await vi.waitFor(() => expect(result.textContent).toContain('la firma no coincide'));

    fireEvent.input(screen.getByLabelText('Secreto para firmar'), { target: { value: JWT_SECRET } });
    fireEvent.click(screen.getByText('Firmar de nuevo con este secreto'));
    await vi.waitFor(() => expect(result.textContent).toContain('Quien firmó conocía el secreto'));

    fireEvent.change(screen.getByLabelText('exp'), { target: { value: 'yes' } });
    await vi.waitFor(() => expect(result.textContent).toContain('la firma no coincide'));
    vi.unstubAllGlobals();
  });
});

describe('filter-chain', () => {
  it('keeps JwtAuthFilter right before UsernamePasswordAuthenticationFilter and AuthorizationFilter last', () => {
    const names = CHAIN_FILTERS.map((filter) => filter.name);
    expect(names.indexOf('JwtAuthFilter')).toBe(names.indexOf('UsernamePasswordAuthenticationFilter') - 1);
    expect(names.at(-1)).toBe('AuthorizationFilter');
    expect(names[0]).toBe('SecurityContextHolderFilter');
  });

  it('shows the details of the filter that was clicked', () => {
    const { container } = renderBlock('filter-chain');
    const detail = screen.getByTestId('filter-detail');
    expect(detail.textContent).toContain('JwtAuthFilter');
    fireEvent.click(container.querySelector('[data-filter="csrf"]'));
    expect(detail.textContent).toContain('CsrfFilter');
    expect(detail.textContent).toContain('csrf.disable()');
  });
});
