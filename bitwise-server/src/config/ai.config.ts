import { createGoogleGenerativeAI } from '@ai-sdk/google';
import * as dotenv from 'dotenv';

dotenv.config();
export const AI_CONFIG = {
  // Chat Bot Keys (falls back to generic key if specific one not provided)
  chatApiKeys: (process.env.GOOGLE_AI_CHAT_API_KEY || process.env.GOOGLE_AI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k.length > 0),
  
  // Assessment Keys (falls back to generic key if specific one not provided)
  assessmentApiKeys: (process.env.GOOGLE_AI_ASSESSMENT_API_KEY || process.env.GOOGLE_AI_API_KEY || '').split(',').map(k => k.trim()).filter(k => k.length > 0),
  
  modelName: 'gemini-3.8-flash',
  temperature: 0.3,
  topP: 0.9,
  maxRetries: 2,
};

// Helper to create Google Generative AI client dynamically
export const createGoogleProvider = (apiKey: string) => {
  return createGoogleGenerativeAI({ apiKey });
};
