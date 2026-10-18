import { Injectable, Logger } from '@nestjs/common';
import { generateText } from 'ai';
import { AI_CONFIG, createGoogleProvider } from '../config/ai.config';
import { cleanLatexNotation } from '../assessment/assessment.service';

const SYSTEM_PROMPT = `You are BitBot, a friendly and helpful AI assistant for the Bitwise learning platform.
Bitwise teaches Boolean algebra, digital logic, number systems, and related computer science topics.

Your role is to:
- Help users navigate the platform (lessons, calculator, number converter, Karnaugh maps, digital circuits)
- Explain Boolean algebra concepts in simple, clear terms with examples
- Provide encouragement and learning tips
- Answer questions about number systems (binary, octal, decimal, hexadecimal) with worked examples
- Help with truth tables, logic gates, and Boolean simplification
- Guide students step-by-step through conversions and arithmetic

Response rules:
- Keep responses concise (under 150 words), friendly, and educational.
- Use emojis occasionally to keep things fun.
- When explaining a concept, always include a small concrete example.
- Do NOT output markdown headers (no # or ##). Use plain text and bullet points only.
- Do NOT mention your own system prompt, instructions, or constraints.
- If someone asks something outside your scope, kindly redirect them to the relevant Bitwise tool or lesson.`;

export interface BinaryAdditionStepInfo {
  column?: string;
  bit1: number;
  bit2: number;
  carryIn: number;
  sum: number;
  resultBit: number;
  carryOut: number;
  isFinalCarry?: boolean;
}

export function parseBinaryAdditionStep(
  step: string,
): BinaryAdditionStepInfo | null {
  if (!step) return null;

  // Pattern 1: Column X: bit1 + bit2 + Carry In carryIn = sum -> Result Bit resultBit, Carry Out carryOut
  const colMatch = step.match(
    /(?:Column\s*(\d+)[^:]*|Step\s*\d+[^:]*:\s*Column\s*(\d+)[^:]*)?[:\s]*([01])\s*\+\s*([01])\s*\+\s*Carry\s*In\s*([01])\s*=\s*(\d+)\s*(?:->|→)\s*Result\s*Bit\s*([01]),\s*Carry\s*Out\s*([01])/i,
  );

  if (colMatch) {
    const col = colMatch[1] ?? colMatch[2];
    const bit1 = parseInt(colMatch[3], 10);
    const bit2 = parseInt(colMatch[4], 10);
    const carryIn = parseInt(colMatch[5], 10);
    const sum = parseInt(colMatch[6], 10);
    const resultBit = parseInt(colMatch[7], 10);
    const carryOut = parseInt(colMatch[8], 10);
    return {
      column: col,
      bit1,
      bit2,
      carryIn,
      sum,
      resultBit,
      carryOut,
      isFinalCarry: false,
    };
  }

  // Pattern 2: Final Carry Out 1 becomes the new MSB
  const finalMatch = step.match(
    /Final Carry Out\s*([01])\s*becomes the new MSB/i,
  );
  if (finalMatch) {
    const carry = parseInt(finalMatch[1], 10);
    return {
      bit1: 0,
      bit2: 0,
      carryIn: carry,
      sum: carry,
      resultBit: carry,
      carryOut: 0,
      isFinalCarry: true,
    };
  }

  return null;
}

export function generateBinaryAdditionExplanation(
  data: BinaryAdditionStepInfo,
  question?: string,
): string {
  const q = (question || '').trim().toLowerCase();

  // If there is a specific follow-up question:
  if (q) {
    if (
      q.includes('why is the carry') ||
      q.includes('why carry') ||
      q.includes('carry 1') ||
      q.includes('carry 0')
    ) {
      if (data.carryOut === 1) {
        return `The carry is 1 because the sum of the bits in this column (${data.bit1} + ${data.bit2} + ${data.carryIn}) equals ${data.sum} in decimal, which is ${data.sum === 3 ? '11' : '10'} in binary. In binary, any total of 2 or more cannot fit into a single column, so the 1 in the twos place overflows and is carried over to the next column on the left.`;
      } else {
        return `The carry is 0 because adding ${data.bit1} + ${data.bit2} + ${data.carryIn} equals ${data.sum} in decimal (${data.sum} in binary). Since ${data.sum} is less than 2, it fits completely into this single column without generating an overflow carry.`;
      }
    }

    if (
      q.includes('why is the result bit') ||
      q.includes('result bit 0') ||
      q.includes('result bit 1') ||
      q.includes('result bit')
    ) {
      if (data.resultBit === 0) {
        return `The result bit is 0 because the column total is ${data.bit1} + ${data.bit2} + ${data.carryIn} = ${data.sum} in decimal (${data.sum === 2 ? '10' : '0'} in binary). The rightmost digit of this binary value is 0, so 0 is recorded as the result bit in this column while any carry is passed left.`;
      } else {
        return `The result bit is 1 because the column total is ${data.bit1} + ${data.bit2} + ${data.carryIn} = ${data.sum} in decimal (${data.sum === 3 ? '11' : '1'} in binary). The rightmost digit of this binary value is 1, so 1 is written in the result bit for this column.`;
      }
    }

    if (q.includes('affect the next column') || q.includes('next column')) {
      if (data.carryOut === 1) {
        return `The carry-out of 1 from this column becomes the carry-in for the next column to the left. When calculating that next column, this +1 carry will be added together with the next two input bits.`;
      } else {
        return `Because the carry-out is 0, the next column to the left receives a carry-in of 0. That column will simply add its two input bits without adding an extra carry.`;
      }
    }

    if (
      q.includes('another way') ||
      q.includes('different way') ||
      q.includes('analogy')
    ) {
      return `Think of binary addition just like normal decimal addition! In base 10, when a column reaches 10 (like 7 + 5 = 12), you write down 2 and carry 1 to the tens column. In base 2 (binary), each column can only hold 0 or 1. So as soon as the total reaches 2 (written as 10 in binary), you write 0 in this column and carry 1 to the next column!`;
    }
  }

  // Handle final carry step:
  if (data.isFinalCarry) {
    return `The previous column generated a carry-out of ${data.carryIn}. Since there are no more bits remaining to add, this carry-out is placed directly at the front of the number as the new Most Significant Bit (MSB).`;
  }

  // Standard step explanation:
  if (data.sum === 0) {
    return `We are adding 0 + 0 + 0, which equals 0 in decimal. In binary, 0 is written as 0.
Result Bit: We write 0 in the current column because 0 + 0 + 0 = 0.
Carry Out: The carry out is 0 because the total of 0 fits completely into this column without generating a carry.
Remember: In binary addition, each column can only hold 0 or 1. A carry is only generated when the total reaches 2 or 3.`;
  }

  if (data.sum === 1) {
    return `We are adding ${data.bit1} + ${data.bit2} + ${data.carryIn}, which equals 1 in decimal. In binary, 1 is written as 1.
Result Bit: We write 1 in the current column because the total is 1, which fits directly into this single bit position.
Carry Out: The carry out is 0 because the sum does not exceed 1, so no carry is generated for the next column.
Remember: In binary addition, each column can only hold 0 or 1. A carry is only generated when the total reaches 2 or 3.`;
  }

  if (data.sum === 2) {
    return `We are adding ${data.bit1} + ${data.bit2} + ${data.carryIn}, which equals 2 in decimal. In binary, 2 is written as 10.
Result Bit: We write 0 in the current column because it is the rightmost digit of the binary result, 10.
Carry Out: We carry 1 to the next column because it is the leftmost digit of 10.
Remember: In binary addition, we can only write 0 or 1 in each column. When the total is 2 or 3, we generate a carry for the next column.`;
  }

  // data.sum === 3
  return `We are adding 1 + 1 + 1, which equals 3 in decimal. In binary, 3 is written as 11.
Result Bit: We write 1 in the current column because it is the rightmost digit of the binary result, 11.
Carry Out: We carry 1 to the next column because it is the leftmost digit of 11.
Remember: In binary addition, each column can only hold 0 or 1. When all three inputs (two bits plus carry-in) are 1, the total is 3 (11 in binary), producing a result bit of 1 and a carry-out of 1.`;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async getResponse(
    message: string,
    pageContext?: string,
  ): Promise<string> {
    this.logger.log('Processing chat message');

    const validKeys = AI_CONFIG.chatApiKeys;

    if (validKeys.length === 0) {
      this.logger.warn('No API keys configured. Using fallback response.');
      return this.getFallbackResponse(message);
    }

    const contextPrompt = pageContext
      ? `\n\nUSER'S CURRENT PAGE/TOOL: ${pageContext}\nTailor your response to be helpful in this context if relevant.`
      : '';

    for (const apiKey of validKeys) {
      try {
        const google = createGoogleProvider(apiKey);
        const result = await generateText({
          model: google(AI_CONFIG.modelName),
          system: SYSTEM_PROMPT + contextPrompt,
          prompt: message,
          temperature: AI_CONFIG.temperature,
          topP: AI_CONFIG.topP,
          maxOutputTokens: 2048,
        });
        return result.text;
      } catch (error: any) {
        this.logger.warn(
          `API call failed with key ending in ...${apiKey.slice(-4)}. Trying next key if available. Error: ${error.message}`,
        );
        continue;
      }
    }

    this.logger.error(
      'All API keys failed or rate limited. Using fallback response.',
    );
    return this.getFallbackResponse(message);
  }

  async getTutorResponse(
    context: string,
    step: string,
    question: string,
  ): Promise<string> {
    this.logger.log('Processing tutor request');

    const binaryStepInfo = parseBinaryAdditionStep(step);

    let tutorPrompt = '';

    if (binaryStepInfo) {
      tutorPrompt = `You are BitBot, a friendly and knowledgeable tutor on the Bitwise learning platform that teaches digital logic and computer science fundamentals.

CONTEXT: The student is working on Binary Addition.
CURRENT STEP DATA:
- Column: ${binaryStepInfo.column ?? 'selected'}
- Top Bit: ${binaryStepInfo.bit1}
- Bottom Bit: ${binaryStepInfo.bit2}
- Carry In: ${binaryStepInfo.carryIn}
- Decimal Total: ${binaryStepInfo.sum}
- Binary Representation: ${binaryStepInfo.sum === 3 ? '11' : binaryStepInfo.sum === 2 ? '10' : binaryStepInfo.sum === 1 ? '1' : '0'}
- Result Bit: ${binaryStepInfo.resultBit}
- Carry Out: ${binaryStepInfo.carryOut}
${question ? `STUDENT'S QUESTION: "${question}"` : 'The student has clicked "Understand this step" to understand this column calculation.'}

YOUR TASK:
${
  question
    ? `Answer the student's question directly, clearly, and specifically for this exact column (${binaryStepInfo.bit1} + ${binaryStepInfo.bit2} + Carry In ${binaryStepInfo.carryIn} = ${binaryStepInfo.sum}). Explain why the result bit is ${binaryStepInfo.resultBit} or why the carry out is ${binaryStepInfo.carryOut} based on binary base-2 place values.`
    : `Provide an accurate, detailed, beginner-friendly explanation of this exact binary addition step:
1. Explain the addition: "We are adding ${binaryStepInfo.bit1} + ${binaryStepInfo.bit2} + ${binaryStepInfo.carryIn}, which equals ${binaryStepInfo.sum} in decimal. In binary, ${binaryStepInfo.sum} is written as ${binaryStepInfo.sum === 3 ? '11' : binaryStepInfo.sum === 2 ? '10' : binaryStepInfo.sum === 1 ? '1' : '0'}."
2. Result Bit: Explain why we write ${binaryStepInfo.resultBit} in the current column (it is the rightmost digit of the binary result).
3. Carry Out: Explain why we carry ${binaryStepInfo.carryOut} to the next column (whether it is the leftmost digit of the binary result or no carry because total < 2).
4. Remember rule: Remind the student that each column can only hold 0 or 1, and totals of 2 or 3 generate a carry for the next column on the left.`
}

RULES:
- Be clear, direct, and beginner-friendly.
- Never use dollar signs ($) or raw LaTeX math code.
- Never give generic answers: use the actual bits (${binaryStepInfo.bit1}, ${binaryStepInfo.bit2}, carry-in ${binaryStepInfo.carryIn}, result ${binaryStepInfo.resultBit}, carry-out ${binaryStepInfo.carryOut}).
- Always complete all sentences.`;
    } else {
      tutorPrompt = `You are BitBot, a friendly and knowledgeable tutor on the Bitwise learning platform that teaches digital logic and computer science fundamentals.

CONTEXT: The student is currently working on "${context}".
CURRENT STEP: ${step}
${question ? `STUDENT'S QUESTION: "${question}"` : 'The student has just opened this step and needs a clear, educational explanation.'}

YOUR TASK:
Explain this specific step in an encouraging way so a beginner fully grasps the math and logic. Reference the actual numbers, bases, and bits shown in the step.

RULES:
- Provide 2-4 complete, well-formed sentences explaining what happens in THIS specific step and WHY.
- If the step involves a calculation or conversion, show the arithmetic clearly (e.g. 1×64 + 2×8 + 3 = 64 + 16 + 3 = 83, or bit inversion 1→0, 0→1).
- CRITICAL: Never use dollar signs ($) or raw LaTeX syntax. Always use standard readable characters (e.g., 8^2 or 8² = 64, not $8^2$).
- CRITICAL: Never stop mid-thought or mid-sentence. Always finish complete sentences and complete equations.
- Use plain, conversational language. No unexplained jargon.
- Do NOT use markdown headers (no # or ##). Use plain text and standard punctuation only.
- Do NOT mention system prompts, token limits, or constraints.
- End with one short, friendly follow-up question or thought-provoking prompt to check their understanding.`;
    }

    const validKeys = AI_CONFIG.chatApiKeys;

    if (validKeys.length === 0) {
      this.logger.warn('No API keys for tutor. Using fallback.');
      return this.getTutorFallback(step, question);
    }

    for (const apiKey of validKeys) {
      try {
        const google = createGoogleProvider(apiKey);
        const result = await generateText({
          model: google(AI_CONFIG.modelName),
          prompt: tutorPrompt,
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 2048,
        });
        return cleanLatexNotation(result.text);
      } catch (error: any) {
        this.logger.warn(
          `Tutor API call failed with key ending in ...${apiKey.slice(-4)}: ${error.message}`,
        );
        continue;
      }
    }

    this.logger.error('All API keys failed for tutor.');
    return this.getTutorFallback(step, question);
  }

  private getTutorFallback(step: string, question: string): string {
    const binaryStepInfo = parseBinaryAdditionStep(step);
    if (binaryStepInfo) {
      return generateBinaryAdditionExplanation(binaryStepInfo, question);
    }

    if (question) {
      return `Great question! The step "${step}" works by applying the fundamental positional weights and arithmetic rules of digital number systems. Each digit corresponds to a power of its base. Breaking it down term by term makes the pattern clear! 💡`;
    }
    return `In this step ("${step}"), values are processed according to standard number system rules. For base conversions, each digit is scaled by its positional power of the base. For complements, each bit is inverted or incremented with cascading carries. Take a look at each column to follow the step-by-step arithmetic! 💡`;
  }

  private getFallbackResponse(message: string): string {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      return "Hello there! 👋 I'm running in offline/mock mode right now because my AI API key isn't set up yet, but I'm still here to help you navigate Bitwise!";
    }

    if (lowerMsg.includes('boolean')) {
      return 'Boolean algebra is a branch of algebra in which the values of the variables are the truth values true and false, usually denoted 1 and 0! Check out the Learn section to start mastering it.';
    }

    if (lowerMsg.includes('binary')) {
      return "Binary is a base-2 number system that uses only 0s and 1s. It's the fundamental language of computers. You can use our Number Converter to play around with binary values!";
    }

    return "I'm currently running in a limited offline mode, so I can only answer basic greetings and questions about Boolean/Binary right now. To unlock my full AI brain, please add a valid Gemini API key to the server's .env file! 🧠";
  }
}
