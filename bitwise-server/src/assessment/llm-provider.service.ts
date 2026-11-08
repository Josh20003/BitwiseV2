import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AI_CONFIG, createGoogleProvider } from '../config/ai.config';

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
      timeoutMs?: number;
    },
  ): Promise<string> {
    const temp = options?.temperature ?? AI_CONFIG.temperature;
    const topP = options?.topP ?? AI_CONFIG.topP;

    const validKeys = AI_CONFIG.assessmentApiKeys;
    if (validKeys.length === 0) {
      throw new Error('Valid GOOGLE_AI_API_KEY for assessment not found.');
    }

    // Key rotation and SDK retries must share one deadline, not multiply it.
    const budgetMs = Math.max(1, Math.min(options?.timeoutMs ?? 15000, 20000));
    const deadline = Date.now() + budgetMs;
    for (const apiKey of validKeys) {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) break;
      try {
        const google = createGoogleProvider(apiKey);
        this.logger.log(
          `Executing primary prompt with model: ${AI_CONFIG.modelName}`,
        );
        const primaryResult = await generateText({
          model: google(AI_CONFIG.modelName),
          prompt: primaryPrompt,
          temperature: temp,
          topP: topP,
          maxOutputTokens: options?.maxOutputTokens ?? 8192,
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(remainingMs),
        });
        return primaryResult.text;
      } catch (primaryError: any) {
        this.logger.warn(
          `API call failed with key ending in ...${apiKey.slice(-4)}. Trying next key if available. Error: ${primaryError.message}`,
        );
        continue;
      }
    }

    this.logger.error('All API keys failed or rate limited.');
    throw new Error('All API keys failed or rate limited.');
  }
}
