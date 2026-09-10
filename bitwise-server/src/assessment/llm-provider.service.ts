import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AI_CONFIG, google } from '../config/ai.config';

@Injectable()
export class LlmProviderService {
  private readonly logger = new Logger(LlmProviderService.name);

  /**
   * Executes a prompt with the primary model strictly, throwing an error if it fails.
   */
  async generateStrict(
    primaryPrompt: string,
    options?: {
      temperature?: number;
      topP?: number;
      maxOutputTokens?: number;
    },
  ): Promise<string> {
    const temp = options?.temperature ?? AI_CONFIG.temperature;
    const topP = options?.topP ?? AI_CONFIG.topP;

    // Attempt Primary Model
    try {
      this.logger.log(
        `Executing primary prompt with model: ${AI_CONFIG.modelName}`,
      );
      const primaryResult = await generateText({
        model: google(AI_CONFIG.modelName),
        prompt: primaryPrompt,
        temperature: temp,
        topP: topP,
        maxOutputTokens: options?.maxOutputTokens ?? 8192,
      });
      return primaryResult.text;
    } catch (primaryError: any) {
      this.logger.error(
        `Primary model failed: ${primaryError.message}. No fallback configured.`,
      );
      throw primaryError;
    }
  }
}
