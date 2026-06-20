import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CoachPage } from '@/pages/CoachPage';
import * as aiService from '@/services/aiService';
import { makeEntry } from '../fixtures';

describe('CoachPage', () => {
  const onMessage = vi.fn();
  const onCache = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(aiService, 'getCoachResponse').mockResolvedValue({
      response: 'Try biking once a week.',
      fromCache: false,
    });
  });

  it('renders heading and chat interface', () => {
    render(
      <CoachPage messages={[]} aiCache={{}} onMessage={onMessage} onCache={onCache} />
    );
    expect(screen.getByRole('heading', { name: 'AI Sustainability Coach' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ask the sustainability coach')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('shows example exchange when no messages', () => {
    render(
      <CoachPage messages={[]} aiCache={{}} onMessage={onMessage} onCache={onCache} />
    );
    expect(screen.getByText('Example exchange:')).toBeInTheDocument();
  });

  it('disables send when input is empty', () => {
    render(
      <CoachPage messages={[]} aiCache={{}} onMessage={onMessage} onCache={onCache} />
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('sends message and displays assistant reply', async () => {
    render(
      <CoachPage messages={[]} aiCache={{}} onMessage={onMessage} onCache={onCache} />
    );

    const input = screen.getByLabelText('Ask the sustainability coach');
    fireEvent.change(input, { target: { value: 'How can I reduce driving?' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalledTimes(2);
    });
    expect(onMessage.mock.calls[0][0]).toMatchObject({
      role: 'user',
      content: 'How can I reduce driving?',
    });
    expect(onMessage.mock.calls[1][0]).toMatchObject({
      role: 'assistant',
      content: 'Try biking once a week.',
    });
    expect(onCache).toHaveBeenCalled();
  });

  it('renders existing messages', () => {
    render(
      <CoachPage
        messages={[
          { role: 'user', content: 'Hello', timestamp: '2025-06-01T00:00:00.000Z' },
          { role: 'assistant', content: 'Hi there!', timestamp: '2025-06-01T00:00:01.000Z' },
        ]}
        aiCache={{}}
        onMessage={onMessage}
        onCache={onCache}
      />
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('passes latest entry context to AI service', async () => {
    const entry = makeEntry('2025-06-15');
    render(
      <CoachPage
        latestEntry={entry}
        messages={[]}
        aiCache={{}}
        onMessage={onMessage}
        onCache={onCache}
      />
    );

    fireEvent.change(screen.getByLabelText('Ask the sustainability coach'), {
      target: { value: 'Tips?' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(aiService.getCoachResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          userMessage: 'Tips?',
          latestResult: entry.result,
          breakdown: entry.result.breakdown,
        }),
        expect.any(String),
        undefined
      );
    });
  });

  it('does not cache when response is from cache', async () => {
    vi.spyOn(aiService, 'getCoachResponse').mockResolvedValue({
      response: 'Cached reply',
      fromCache: true,
    });
    render(
      <CoachPage messages={[]} aiCache={{ 'hello::none': 'Cached reply' }} onMessage={onMessage} onCache={onCache} />
    );

    fireEvent.change(screen.getByLabelText('Ask the sustainability coach'), {
      target: { value: 'hello' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => expect(onMessage).toHaveBeenCalledTimes(2));
    expect(onCache).not.toHaveBeenCalled();
  });
});
