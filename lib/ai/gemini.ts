import { GoogleGenerativeAI, Part, Tool } from '@google/generative-ai';
import { Message } from '@/features/chat/schemas';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function getGeminiResponse(
  messages: Message[],
  systemPrompt: string
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      tools: [
        {
          googleSearch: {},
        } as unknown as Tool, // Still an issue with googleSearch type in older versions, but safer than any
      ],
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => {
        const parts: Part[] = [{ text: m.content }];
        if (m.image && m.imageType) {
          parts.push({
            inlineData: {
              data: m.image,
              mimeType: m.imageType
            }
          });
        }
        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts,
        };
      }),
    });

    const lastMessage = messages[messages.length - 1];
    const lastParts: Part[] = [{ text: lastMessage.content }];
    
    if (lastMessage.image && lastMessage.imageType) {
      lastParts.push({
        inlineData: {
          data: lastMessage.image,
          mimeType: lastMessage.imageType
        }
      });
    }

    const result = await chat.sendMessage(lastParts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
