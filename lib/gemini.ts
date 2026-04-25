import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function getGeminiResponse(
  messages: { role: 'user' | 'assistant'; content: string; image?: string; imageType?: string }[],
  systemPrompt: string
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => {
        const parts: any[] = [{ text: m.content }];
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
    const lastParts: any[] = [{ text: lastMessage.content }];
    
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
