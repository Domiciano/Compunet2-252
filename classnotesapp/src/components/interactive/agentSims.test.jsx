import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/theme/ThemeContext';
import InteractiveBlock from './InteractiveBlock';
import { AGENT_STAGES, AGENT_PROMPTS, AGENT_ITEMS, agentScene } from './agentSims';

const renderBlock = (spec) => render(<ThemeProvider><InteractiveBlock spec={spec} /></ThemeProvider>);
const keys = (scene, col) => scene.items.filter((item) => !col || item.col === col).map((item) => item.key);

describe('agentScene', () => {
  it('only lights up items that are on screen in that stage', () => {
    AGENT_STAGES.forEach((stage) => {
      AGENT_PROMPTS[stage.key].forEach((prompt) => {
        const visible = keys(agentScene(stage.key, prompt.key));
        prompt.hot.forEach((key) => expect(visible, `${stage.key}/${prompt.key}: ${key}`).toContain(key));
      });
    });
  });

  it('keeps everything of the previous stage', () => {
    const agent = keys(agentScene('agent'));
    const skills = keys(agentScene('skills'));
    const mcp = keys(agentScene('mcp'));
    agent.forEach((key) => expect(skills).toContain(key));
    skills.forEach((key) => expect(mcp).toContain(key));
  });

  it('skills add no tools; MCP adds tools', () => {
    expect(keys(agentScene('skills'), 'tools')).toEqual(keys(agentScene('agent'), 'tools'));
    const added = AGENT_ITEMS.filter((item) => item.stage === 'mcp');
    expect(added.some((item) => item.col === 'tools')).toBe(true);
    expect(added.every((item) => item.col === 'tools' || item.ext)).toBe(true);
  });

  it('loads only the SKILL.md whose description matches the request', () => {
    expect(keys(agentScene('skills'))).not.toContain('c-spec-body');
    const spec = keys(agentScene('skills', 'spec'));
    expect(spec).toContain('c-spec-body');
    expect(spec).not.toContain('c-db-body');
    expect(spec).toContain('c-db');
  });

  it('marks as new only what the current stage adds', () => {
    expect(agentScene('agent').items.some((item) => item.isNew)).toBe(false);
    agentScene('mcp').items.forEach((item) => expect(item.isNew).toBe(item.stage === 'mcp'));
  });
});

describe('agent-stack', () => {
  it('adds the MCP tools to the tool system and walks a request', () => {
    const { container } = renderBlock('agent-stack');
    expect(container.querySelector('[data-item="t-pw-nav"]')).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: '+ MCP' }));
    expect(container.querySelector('[data-item="t-pw-nav"]')).toBeTruthy();
    expect(container.querySelector('[data-item="w-chromium"]')).toBeTruthy();
    expect(screen.getByTestId('agent-steps').hidden).toBe(true);
    fireEvent.click(container.querySelector('[data-prompt="playwright"]'));
    expect(container.querySelector('[data-item="t-pw-nav"]').classList.contains('as-hot')).toBe(true);
    expect(screen.getByTestId('agent-steps').children.length).toBe(AGENT_PROMPTS.mcp[1].steps.length);
  });

  it('opens on the stage given as option', () => {
    const { container } = renderBlock('agent-stack skills');
    expect(container.querySelector('[data-item="c-spec"]')).toBeTruthy();
  });
});
