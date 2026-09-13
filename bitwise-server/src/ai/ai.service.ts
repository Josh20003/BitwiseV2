import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AI_CONFIG, createGoogleProvider } from '../config/ai.config';

const SYSTEM_PROMPT = `You are BitBot, a friendly and helpful AI assistant for the Bitwise learning platform.
Bitwise teaches Boolean algebra, digital logic, number systems, and related computer science topics.

Your role is to:
- Help users navigate the platform (lessons, calculator, number converter, Karnaugh maps, digital circuits)
- Explain Boolean algebra concepts in simple terms
- Provide encouragement and learning tips
- Answer questions about number systems (binary, octal, decimal, hexadecimal)
- Help with truth tables, logic gates, and Boolean simplification

Keep your responses concise, friendly, and educational. Use emojis occasionally to keep things fun.
If someone asks something outside your scope, kindly redirect them to the relevant Bitwise tool or lesson.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async getResponse(message: string): Promise<string> {
    this.logger.log('Processing chat message');
      
    // Filter for valid keys
    const validKeys = AI_CONFIG.chatApiKeys;
    
    if (validKeys.length === 0) {
      this.logger.warn('Valid GOOGLE_AI_API_KEY not found. Using fallback mock response.');
      return this.getFallbackResponse(message);
    }

    // Try each valid key until one succeeds
    for (const apiKey of validKeys) {
      try {
        const google = createGoogleProvider(apiKey);
        const result = await generateText({
          model: google(AI_CONFIG.modelName),
          prompt: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nBitBot:`,
          temperature: AI_CONFIG.temperature,
          topP: AI_CONFIG.topP,
          maxOutputTokens: 512,
        });
        return result.text;
      } catch (error: any) {
        this.logger.warn(`API call failed with key ending in ...${apiKey.slice(-4)}. Trying next key if available. Error: ${error.message}`);
        continue;
      }
    }

    this.logger.error('All API keys failed or rate limited. Using fallback response.');
    return this.getFallbackResponse(message);
  }

  private getFallbackResponse(message: string): string {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      return "Hello there! 👋 I'm running in offline/mock mode right now because my AI API key isn't set up yet, but I'm still here to help you navigate Bitwise!";
    }
    
    if (lowerMsg.includes('boolean')) {
      return "Boolean algebra is a branch of algebra in which the values of the variables are the truth values true and false, usually denoted 1 and 0! Check out the Learn section to start mastering it.";
    }
    
    if (lowerMsg.includes('binary')) {
      return "Binary is a base-2 number system that uses only 0s and 1s. It's the fundamental language of computers. You can use our Number Converter to play around with binary values!";
    }
    
    return "I'm currently running in a limited offline mode, so I can only answer basic greetings and questions about Boolean/Binary right now. To unlock my full AI brain, please add a valid Gemini API key to the server's .env file! 🧠";
  }
}
