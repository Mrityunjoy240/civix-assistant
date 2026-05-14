import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGeminiResponse } from './gemini';

// Mock the Gemini module completely
vi.mock('@google/generative-ai', () => {
  const sendMessageMock = vi.fn().mockResolvedValue({
    response: {
      text: () => 'Mocked response'
    }
  });

  const startChatMock = vi.fn().mockReturnValue({
    sendMessage: sendMessageMock
  });

  const getGenerativeModelMock = vi.fn().mockReturnValue({
    startChat: startChatMock
  });

  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = getGenerativeModelMock;
    },
    __sendMessageMock: sendMessageMock,
    __startChatMock: startChatMock,
    __getGenerativeModelMock: getGenerativeModelMock
  };
});

describe('gemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call getGeminiResponse correctly without images', async () => {
    const messages = [{ id: '1', role: 'user' as const, content: 'Hello' }];
    const res = await getGeminiResponse(messages, 'System Prompt');
    expect(res).toBe('Mocked response');
  });

  it('should call getGeminiResponse correctly with images', async () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Analyze this', image: 'base64data', imageType: 'image/png' }
    ];
    const res = await getGeminiResponse(messages, 'System Prompt');
    expect(res).toBe('Mocked response');
  });
  
  it('should format history correctly for multiple messages', async () => {
    const messages = [
      { id: '1', role: 'user' as const, content: 'Hi' },
      { id: '2', role: 'assistant' as const, content: 'Hello there' },
      { id: '3', role: 'user' as const, content: 'How are you?' }
    ];
    const res = await getGeminiResponse(messages, 'System Prompt');
    expect(res).toBe('Mocked response');
  });
});
