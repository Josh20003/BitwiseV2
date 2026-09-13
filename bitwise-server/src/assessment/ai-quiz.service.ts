import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { AI_CONFIG, createGoogleProvider } from '../config/ai.config';

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

@Injectable()
export class AiQuizService {
  private readonly logger = new Logger(AiQuizService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Generates a 10-item adaptive quiz based on the user's EMA mastery.
   * Lower EMA = easier, foundational questions.
   * Higher EMA = applied, complex questions.
   */
  async generateQuiz(userId: string, topic: string): Promise<QuizQuestion[]> {
    const mastery = await this.prisma.ema_mastery.findUnique({
      where: { user_id_topic: { user_id: userId, topic } },
    });

    const ema = mastery ? Number(mastery.currentEMA) : 0.0;

    // Determine difficulty spread based on EMA
    let easyCount = 4,
      mediumCount = 4,
      hardCount = 2;
    if (ema < 0.4) {
      easyCount = 7;
      mediumCount = 3;
      hardCount = 0;
    } else if (ema > 0.8) {
      easyCount = 1;
      mediumCount = 4;
      hardCount = 5;
    }

    return this.generateDynamicQuestions(
      topic,
      easyCount,
      mediumCount,
      hardCount,
    );
  }

  private async generateDynamicQuestions(
    topic: string,
    easy: number,
    medium: number,
    hard: number,
  ): Promise<QuizQuestion[]> {
    const validKeys = AI_CONFIG.assessmentApiKeys.filter(key => key.startsWith('AIza'));

    if (validKeys.length === 0) {
      this.logger.warn('Valid GOOGLE_AI_API_KEY for assessment not found, using fallback questions.');
      return this.generateFallbackQuestions(topic, easy, medium, hard);
    }

    const total = easy + medium + hard;

    // Mapping for syllabus injection
    const QUIZ_SCOPES: Record<
      string,
      { title: string; scope: string; exclusion: string }
    > = {
      'number-systems': {
        title: 'Introduction to Number Systems',
        scope:
          '- Definition of base-2, base-8, base-10, base-16\n- Positional values\n- Digit representation in different bases',
        exclusion:
          '- Conversion between bases\n- Binary arithmetic\n- Complements',
      },
      'binary-arithmetic': {
        title: 'Binary Arithmetic',
        scope:
          '- Binary addition rules and carry\n- Binary subtraction and borrow\n- Binary multiplication (shift and add)\n- Binary division',
        exclusion:
          "- 1's and 2's complements\n- Signed vs unsigned numbers\n- Floating point",
      },
      complements: {
        title: 'Complements',
        scope:
          "- 1's complement (bit inversion)\n- 2's complement (invert and add 1)\n- Cascading carry in 2's complement",
        exclusion:
          '- Signed number interpretation (MSB)\n- Overflow conditions\n- BCD',
      },
      'boolean-algebra': {
        title: 'Intro to Boolean Algebra',
        scope:
          '- True/False and 1/0 values\n- Basic boolean logic concepts\n- Applications in circuit design',
        exclusion:
          '- Specific logic gates (AND, OR, NOT)\n- Truth tables\n- Karnaugh Maps',
      },
      'logic-gates': {
        title: 'Logic Gates',
        scope:
          '- AND, OR, NOT gates\n- NAND, NOR universal gates\n- XOR, XNOR gates',
        exclusion:
          '- Truth tables for complex expressions\n- Boolean algebra simplification\n- K-Maps',
      },
      'truth-tables': {
        title: 'Truth Tables',
        scope:
          '- Constructing truth tables for basic gates\n- Reading input/output combinations\n- Evaluating simple boolean expressions',
        exclusion:
          "- Karnaugh maps\n- Boolean laws (De Morgan's)\n- Advanced circuit design",
      },
      'karnaugh-maps': {
        title: 'Simplification and K-Maps',
        scope:
          '- Boolean laws (Commutative, Associative, Distributive)\n- Karnaugh Maps structure and grouping\n- Simplifying expressions',
        exclusion: '- Sequential logic\n- Flip-flops\n- Number systems',
      },
    };

    const syllabus = QUIZ_SCOPES[topic] || {
      title: topic,
      scope: `- Core concepts of ${topic}`,
      exclusion: '- Topics outside the current lesson scope',
    };

    const systemPrompt = `You are a strict, precision-focused educational assessor. Your task is to generate multiple-choice questions that are 100% EXCLUSIVE to the provided lesson syllabus. 

STRICT SCOPE BOUNDARIES:
1. EXCLUSIVITY: You must ONLY test concepts explicitly listed in the "Permitted Lesson Scope". Do not introduce vocabulary, formulas, or concepts from future lessons or outside knowledge.
2. NO FORWARD-TESTING: If a concept is a logical next step but is not explicitly in the permitted scope, do NOT test it. 
3. Verify Knowledge, Not Trivia: Generate specific questions that test application or recall of the permitted concepts. Do not ask meta-questions (e.g., "What did we learn in Lesson 8?").
4. Options: Create exactly 4 plausible options. The incorrect options must be common mistakes related ONLY to the permitted scope. Never include labels like "Option A" or "(Correct)" in the text.
5. Output format: Return STRICTLY as a raw JSON object matching the exact schema below. No markdown formatting, backticks, or conversational text.

🎓 TARGET COLLEGE-LEVEL DIFFICULTY ("College-Level Engineering/Computer Science" persona):
- "Easy": Accessible to a first-year university student. Requires understanding a single foundational concept and executing 1-2 basic steps (e.g., standard binary subtraction, basic truth table evaluation). Absolutely no trivia, no-brainers, or definitions that can be answered without conceptual application.
- "Medium": Requires combining 2 or more concepts or multi-step execution.
- "Hard": Requires edge-case handling, complex optimization, or deep analytical troubleshooting.

🛑 STRICT OPTION UNIQUENESS & INTEGRITY CONSTRAINTS:
- Each of the 4 choices generated must be completely distinct in both text and conceptual meaning. Under no circumstances may two options evaluate to or display the same value.
- Distractors (incorrect choices) must be derived from common student misconceptions or logical slips related to the question, not random filler data.
- Verify that exactly ONE option matches your 'stepByStepDerivation' perfectly. The 'correctOptionIndex' must point exclusively to that option.

REQUIRED JSON SCHEMA (You MUST output the fields in this exact order):
[
  {
    "question": "The specific question text.",
    "stepByStepDerivation": "Perform the required math/logic and explicitly derive the correct answer first.",
    "options": [
      "First conceptually distinct option",
      "Second conceptually distinct option",
      "Third conceptually distinct option",
      "Fourth conceptually distinct option"
    ],
    "correctOptionIndex": 0
  }
]`;

    // Note: difficulty target dynamically builds a string of difficulties
    const difficultyList = [
      ...Array(easy).fill('Easy'),
      ...Array(medium).fill('Medium'),
      ...Array(hard).fill('Hard'),
    ].join(', ');

    const userPrompt = `Generate a set of exactly ${total} questions for the following exact lesson. 

- Target Lesson: ${syllabus.title}
- Difficulty Target: ${difficultyList}

PERMITTED LESSON SCOPE (You may ONLY test these concepts):
${syllabus.scope}

EXCLUSION ZONE (Do NOT test these concepts under any circumstances):
${syllabus.exclusion}

Ensure the questions strictly honor these boundaries and return the exact JSON array format requested in the system prompt.`;

    let parsed: any = null;

    for (const apiKey of validKeys) {
      try {
        const google = createGoogleProvider(apiKey);
        this.logger.log(`Attempting to generate quiz with ${AI_CONFIG.modelName}...`);
        
        const result = await (generateText as any)({
          model: google(AI_CONFIG.modelName),
          system: systemPrompt,
          prompt: userPrompt,
          maxTokens: 4096,
          temperature: 0.7,
        });
        
        const text = result.text;
        this.logger.log(`Google AI response received, parsing JSON...`);

        // Extract JSON array from response (handles any surrounding text)
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          this.logger.error(`No JSON array found in response. Trying next key if available.`);
          continue;
        }

        parsed = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          this.logger.error('Parsed result is not a valid array. Trying next key if available.');
          parsed = null;
          continue;
        }
        
        // Success!
        break;
      } catch (error: any) {
        this.logger.warn(`API call failed with key ending in ...${apiKey.slice(-4)}. Trying next key if available. Error: ${error.message}`);
        continue;
      }
    }

    if (!parsed) {
      this.logger.error(`All API keys failed or returned invalid JSON for topic "${topic}". Using fallback questions.`);
      return this.generateFallbackQuestions(topic, easy, medium, hard);
    }

    const questions: QuizQuestion[] = parsed.map((q: any, i: number) => {
      const idx =
        typeof q.correctOptionIndex === 'number' &&
        q.correctOptionIndex >= 0 &&
        q.correctOptionIndex <= 3
          ? q.correctOptionIndex
          : 0;
      return {
        id: `q-${Date.now()}-${i}`,
        topic,
        question: q.question,
        options: q.options,
        correctAnswer: q.options[idx],
        explanation: q.stepByStepDerivation,
      };
    });

    this.logger.log(
      `Successfully generated ${questions.length} AI questions for topic "${topic}"`,
    );
    return questions;
  }

  private generateFallbackQuestions(
    topic: string,
    easy: number,
    medium: number,
    hard: number,
  ): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const total = easy + medium + hard;

    for (let i = 0; i < total; i++) {
      let difficulty = 'easy';
      if (i >= easy && i < easy + medium) difficulty = 'medium';
      if (i >= easy + medium) difficulty = 'hard';

      if (topic === 'binary-arithmetic') {
        questions.push(this.generateBinaryArithmeticQuestion(difficulty));
      } else if (topic === 'complements') {
        questions.push(this.generateComplementQuestion(difficulty));
      } else {
        // Generic fallback — at least meaningful for the topic
        questions.push({
          id: `q-fallback-${i}`,
          topic,
          question: `[Fallback] This question about "${topic}" could not be generated. Please check the server logs.`,
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          explanation: 'Fallback question — Groq API was unavailable.',
        });
      }
    }

    return questions;
  }

  private generateBinaryArithmeticQuestion(difficulty: string): QuizQuestion {
    const val1 = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 10 : 25;
    const val2 = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 14;
    const bin1 = val1.toString(2);
    const bin2 = val2.toString(2);
    const result = (val1 + val2).toString(2);

    const opts = [
      result,
      (val1 + val2 + 1).toString(2),
      (val1 + val2 - 1).toString(2),
      (val1 + val2 + 2).toString(2),
    ].sort(() => Math.random() - 0.5);

    return {
      id: `ba-${Math.random()}`,
      topic: 'binary-arithmetic',
      question: `What is the binary sum of ${bin1} + ${bin2}?`,
      options: opts,
      correctAnswer: result,
      explanation: `${bin1} is ${val1} decimal, ${bin2} is ${val2} decimal. Sum = ${val1 + val2} = ${result} in binary.`,
    };
  }

  private generateComplementQuestion(difficulty: string): QuizQuestion {
    const val = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : 28;
    const bin = val.toString(2).padStart(6, '0');
    let ones = '';
    for (const b of bin) ones += b === '1' ? '0' : '1';

    const opts = [
      ones,
      bin,
      (parseInt(ones, 2) + 1).toString(2).padStart(6, '0'),
      (parseInt(ones, 2) - 1).toString(2).padStart(6, '0'),
    ].sort(() => Math.random() - 0.5);

    return {
      id: `comp-${Math.random()}`,
      topic: 'complements',
      question: `What is the 1's complement of the 6-bit binary number ${bin}?`,
      options: opts,
      correctAnswer: ones,
      explanation: `To find the 1's complement, invert every bit: 0 becomes 1, and 1 becomes 0. ${bin} → ${ones}.`,
    };
  }

  async submitQuiz(
    userId: string,
    topic: string,
    score: number,
    answersJson: any,
  ) {
    await this.prisma.quiz_results.create({
      data: {
        user_id: userId,
        topic,
        score,
        answersJson,
      },
    });
  }
}
