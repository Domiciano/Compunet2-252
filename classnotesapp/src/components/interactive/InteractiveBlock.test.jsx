import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import { SIMS, parseSpec, jwtSteps } from './springSecuritySims';

const renderBlock = (spec) => render(<ThemeProvider><InteractiveBlock spec={spec} /></ThemeProvider>);

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const BAND = {
  client: 0, others: 1, jwt: 1, etf: 1, authz: 1, ctx: 1, chain: 1,
  auth: 2, posts: 2, manager: 3, jwtService: 3,
};
const GAP_BANDS = { g1: [0, 1], g2: [1, 2], g3: [2, 3] };

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
