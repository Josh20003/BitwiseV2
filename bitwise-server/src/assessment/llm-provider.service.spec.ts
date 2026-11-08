import { generateText } from 'ai';
import { AI_CONFIG } from '../config/ai.config';
import { LlmProviderService } from './llm-provider.service';

jest.mock('ai', () => ({ generateText: jest.fn() }));
jest.mock('../config/ai.config', () => ({
  AI_CONFIG: { assessmentApiKeys: ['test-one', 'test-two'], modelName: 'test-model', temperature: 0.3, topP: 0.9 },
  createGoogleProvider: () => () => ({}),
}));

describe('LLM request deadline', () => {
  beforeEach(() => jest.clearAllMocks());

  it('aborts a stalled provider within the shared budget without SDK retries', async () => {
    (generateText as jest.Mock).mockImplementation(({ abortSignal }) => new Promise((_, reject) => {
      abortSignal.addEventListener('abort', () => reject(abortSignal.reason), { once: true });
    }));
    const started = Date.now();
    await expect(new LlmProviderService().generateStrict('prompt', { timeoutMs: 30 })).rejects.toThrow('All API keys failed');
    expect(Date.now() - started).toBeLessThan(2000);
    expect(generateText).toHaveBeenCalledTimes(1);
    expect(generateText).toHaveBeenCalledWith(expect.objectContaining({ maxRetries: 0, abortSignal: expect.any(AbortSignal) }));
  });

  it('rotates keys after an immediate failure and returns the successful response', async () => {
    (generateText as jest.Mock).mockRejectedValueOnce(new Error('rate limited')).mockResolvedValueOnce({ text: 'valid response' });
    await expect(new LlmProviderService().generateStrict('prompt')).resolves.toBe('valid response');
    expect(generateText).toHaveBeenCalledTimes(AI_CONFIG.assessmentApiKeys.length);
  });
});
