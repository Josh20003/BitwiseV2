import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const AI_CONFIG = {
  apiKey: process.env.GOOGLE_AI_API_KEY || "",
  modelName: "gemini-3.6-flash",
  temperature: 0.3,
  topP: 0.9,
  maxRetries: 2,
};

// Initialize Google Generative AI client
export const google = createGoogleGenerativeAI({
  apiKey: AI_CONFIG.apiKey,
});
