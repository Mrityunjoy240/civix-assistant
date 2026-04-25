'use server';

import { getGeminiResponse } from '@/lib/gemini';
import { SYSTEM_PROMPT, US_STATES_ELECTION_DATA, MYTH_BUSTING_KB, ELECTION_PROTECTION_HOTLINE } from '@/lib/constants';
import { findStateData, getNextDeadline, formatDateShort, getDeadlinesForState } from '@/lib/deadline-engine';

export async function chatAction(
  messages: { role: 'user' | 'assistant'; content: string; image?: string; imageType?: string }[],
  location: { country: string; state?: string; county?: string } | null
) {
  try {
    // Basic validation
    if (!messages || messages.length === 0) {
      return { error: 'No messages provided' };
    }

    // Limit context window for efficiency and security (keep only last 10 messages)
    const limitedMessages = messages.slice(-10);

    let systemMessage = SYSTEM_PROMPT;

    // Vision-specific instruction if an image is present
    if (messages[messages.length - 1].image) {
      systemMessage += "\n\nVISION TASK: The user has uploaded an image. IMPORTANT: For privacy and security, focus ONLY on civic-relevant data like State, County, or EPIC number. DO NOT repeat or echo sensitive PII like date of birth, father's name, or full signatures in your text response. Extract the jurisdiction and landmark/address. You MUST include a [MAP: address] tag for the detected polling station or locality to help the user visualize where they vote.";
    }

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
