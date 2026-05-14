import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatAction } from './chat';
import * as gemini from '@/lib/ai/gemini';

vi.mock('@/lib/ai/gemini', () => ({
  getGeminiResponse: vi.fn()
}));

describe('chatAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error on empty messages array', async () => {
    const res = await chatAction([], null);
    expect(res).toEqual({ error: 'No messages provided' });
  });

  it('validates input schema and returns error on invalid messages structure', async () => {
    const res = await chatAction([{ role: 'invalid' } as any], null);
    expect(res).toEqual({ error: 'Invalid input format' });
  });

  it('calls getGeminiResponse on valid input and returns response', async () => {
    vi.mocked(gemini.getGeminiResponse).mockResolvedValue('Hello from AI');
    
    const messages = [{ id: '1', role: 'user' as const, content: 'When is the election?' }];
    const location = { country: 'USA', state: 'Texas' };
    
    const res = await chatAction(messages, location);
    
    expect(res).toEqual({ response: 'Hello from AI' });
    expect(gemini.getGeminiResponse).toHaveBeenCalled();
    const callArgs = vi.mocked(gemini.getGeminiResponse).mock.calls[0];
    // Check if the state info is injected in system prompt
    expect(callArgs[1]).toContain("User's jurisdiction: Texas");
  });

  it('handles image input and adds vision prompt', async () => {
    vi.mocked(gemini.getGeminiResponse).mockResolvedValue('Analyzed image');
    
    const messages = [{ id: '1', role: 'user' as const, content: 'Analyze this', image: 'data', imageType: 'image/png' }];
    
    await chatAction(messages, null);
    const callArgs = vi.mocked(gemini.getGeminiResponse).mock.calls[0];
    expect(callArgs[1]).toContain("VISION TASK:");
  });

  it('catches and returns error if getGeminiResponse throws', async () => {
    vi.mocked(gemini.getGeminiResponse).mockRejectedValue(new Error('API Failure'));
    
    const messages = [{ id: '1', role: 'user' as const, content: 'Hi' }];
    
    const res = await chatAction(messages, null);
    expect(res).toEqual({ error: 'Failed to generate response' });
  });
});
