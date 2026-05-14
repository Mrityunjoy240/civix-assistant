import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatEngine } from './useChatEngine';
import * as chatActionModule from '@/app/actions/chat';

vi.mock('@/app/actions/chat', () => ({
  chatAction: vi.fn()
}));

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn()
};
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true
});

describe('useChatEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGeolocation.getCurrentPosition.mockImplementation((success) => 
      success({ coords: { latitude: 0, longitude: 0 } })
    );
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ address: { country: 'USA', state: 'Texas' } })
    });
  });

  it('initializes correctly and fetches geolocation', async () => {
    const { result } = renderHook(() => useChatEngine());
    
    // Check initial state
    expect(result.current.messages).toEqual([]);
    expect(result.current.language).toBe('English');
    expect(result.current.isPending).toBe(false);

    // After useEffect runs (using a small delay to let fetch resolve)
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });

    expect(result.current.location?.state).toBe('Texas');
    expect(result.current.steps[0].isCompleted).toBe(true); // Register step completed because location is set
  });

  it('handleSend updates messages and calls chatAction', async () => {
    vi.mocked(chatActionModule.chatAction).mockResolvedValue({ response: 'AI response' });
    
    const { result } = renderHook(() => useChatEngine());

    await act(async () => {
      result.current.handleSend('Hello', undefined, undefined);
    });

    // Optimistic update
    expect(result.current.messages[0].content).toBe('Hello');

    // Wait for transition to resolve
    await act(async () => {
      await new Promise(r => setTimeout(r, 10));
    });

    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[1].content).toBe('AI response');
  });
});
