'use server';

import { getGeminiResponse } from '@/lib/ai/gemini';
import { SYSTEM_PROMPT, US_STATES_ELECTION_DATA, MYTH_BUSTING_KB, ELECTION_PROTECTION_HOTLINE } from '@/lib/ai/constants';
import { findStateData, getNextDeadline, formatDateShort, getDeadlinesForState } from '@/lib/engine/deadline-engine';
import { ChatRequestSchema, Message, Location } from '@/features/chat/schemas';

export async function chatAction(
  messages: Message[],
  location: Location | null,
  language: string = 'English'
) {
  try {
    // Basic validation
    const parsed = ChatRequestSchema.safeParse({ messages, location, language });
    if (!parsed.success) {
      return { error: 'Invalid input format' };
    }

    const validMessages = parsed.data.messages;

    if (!validMessages || validMessages.length === 0) {
      return { error: 'No messages provided' };
    }

    // Limit context window for efficiency and security (keep only last 10 messages)
    const limitedMessages = validMessages.slice(-10);

    let systemMessage = SYSTEM_PROMPT;
    systemMessage += `\n\nLANGUAGE: You MUST respond in ${language}. If the user provides an image or text in another language, translate your analysis into ${language}.`;

    // Vision-specific instruction if an image is present
    if (limitedMessages[limitedMessages.length - 1].image) {
      systemMessage += "\n\nVISION TASK: The user has uploaded an image. IMPORTANT: For privacy and security, focus ONLY on civic-relevant data like State, County, or EPIC number. DO NOT repeat or echo sensitive PII like date of birth, father's name, or full signatures in your text response. Extract the jurisdiction and landmark/address. You MUST include a [MAP: address] tag for the detected polling station or locality to help the user visualize where they vote.";
    }

    systemMessage += "\n\nUI WIDGETS: If the user asks how to find their polling booth location AND they are voting in India (or their location is currently unknown), you MUST ask them for their EPIC Number or Part Number alongside asking for their location. You MUST include the exact string `[SHOW_VOTER_ID_GUIDE]` anywhere in your response to trigger the visual guide. DO NOT ask for EPIC/Part numbers or use this tag if the user is explicitly voting in the US, Canada, or any other non-India jurisdiction.";

    if (location?.state) {
      const stateData = findStateData(location.state, US_STATES_ELECTION_DATA);
      if (stateData) {
        const nextDeadline = getNextDeadline(stateData);
        const allDeadlines = getDeadlinesForState(stateData);

        const deadlineInfo = `\n\nUser's jurisdiction: ${location.state}\nNext election: ${formatDateShort(stateData.electionDate)}\n${
          nextDeadline
            ? `Next deadline: ${nextDeadline.type} is ${nextDeadline.display}`
            : 'Election has passed'
        }\nAll deadlines:\n${allDeadlines.map(d => `- ${d.type}: ${d.display}`).join('\n')}
\n\nRegistration portal: ${stateData.registrationUrl}
Polling place lookup: ${stateData.pollingPlaceUrl}`;

        systemMessage += deadlineInfo;
      }
    }

    if (location?.country && !location?.state) {
      systemMessage += `\n\nNote: User is in ${location.country.toUpperCase()} but specific state/province is not known. Ask for more details.`;
    }

    const mythBustingSection = MYTH_BUSTING_KB.map(m => `- "${m.claim}": ${m.reality} (Source: ${m.source})`).join('\n');
    systemMessage += `\n\nMYTH-BUSTING KNOWLEDGE BASE:\n${mythBustingSection}`;

    systemMessage += `\n\nELECTION PROTECTION HOTLINE: ${ELECTION_PROTECTION_HOTLINE} (for voters who are turned away, intimidated, or blocked)`;

    const response = await getGeminiResponse(limitedMessages, systemMessage);

    return { response };
  } catch (error) {
    console.error('Chat Action error:', error);
    return { error: 'Failed to generate response' };
  }
}
