import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AI_CONFIG, groq } from '../config/ai.config';

@Injectable()
export class LlmProviderService {
  private readonly logger = new Logger(LlmProviderService.name);

  /**
   * Executes a prompt with the primary model, automatically falling back
   * to a secondary model and fallback prompt if the primary fails.
   */
  async generateWithFailover(
    primaryPrompt: string,
    fallbackPrompt: string,
    options?: {
      temperature?: number;
      topP?: number;
      maxOutputTokens?: number;
    }
  ): Promise<string> {
    const temp = options?.temperature ?? AI_CONFIG.temperature;
    const topP = options?.topP ?? AI_CONFIG.topP;
    
    // Attempt Primary Model
    try {
      this.logger.log(`Executing primary prompt with model: ${AI_CONFIG.modelName}`);
      const primaryResult = await generateText({
        model: groq(AI_CONFIG.modelName),
        prompt: primaryPrompt,
        temperature: temp,
        topP: topP,
        maxOutputTokens: options?.maxOutputTokens ?? 8192,
      });
      return primaryResult.text;
    } catch (primaryError: any) {
      this.logger.warn(`Primary model failed: ${primaryError.message}. Initiating failover.`);
      
      // Attempt Fallback Model with simplified prompt
      try {
        const fallbackModel = 'llama-3.1-8b-instant';
        this.logger.log(`Executing fallback prompt with model: ${fallbackModel}`);
        const fallbackResult = await generateText({
          model: groq(fallbackModel),
          prompt: fallbackPrompt,
          temperature: Math.max(0.1, temp - 0.1), // Slightly lower temp for consistency
          topP: topP,
          maxOutputTokens: 2048, // Reduced token limit for smaller model
        });
        return fallbackResult.text;
      } catch (fallbackError: any) {
        this.logger.error(`Fallback model also failed: ${fallbackError.message}`);
        throw new Error(`AI generation failed completely. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
      }
    }
  }
}
