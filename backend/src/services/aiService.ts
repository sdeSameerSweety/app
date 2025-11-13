import { config } from '../config/env';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const getAIResponse = async (
  messages: Message[],
  userId: string
): Promise<string> => {
  try {
    if (!config.openai.apiKey) {
      return 'AI service is not configured. Please set OPENAI_API_KEY in environment variables.';
    }

    const systemMessage: Message = {
      role: 'system',
      content: `You are an AI career guidance assistant for 2minreview, India's trusted career transformation platform.
      Your role is to help students, professionals, and entrepreneurs make informed career decisions.

      Provide guidance on:
      - College and course selection
      - Career paths and transitions
      - Skill development recommendations
      - Interview preparation
      - Industry insights

      Be encouraging, practical, and specific to the Indian job market. Use simple language and provide actionable advice.`,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('Failed to get AI response');
  }
};
