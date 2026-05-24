import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

  /**
   * Generates a 10-item adaptive quiz based on the user's EMA mastery.
   * Lower EMA = easier, foundational questions.
   * Higher EMA = applied, complex questions.
   */
  async generateQuiz(userId: string, topic: string): Promise<QuizQuestion[]> {
    const mastery = await this.prisma.ema_mastery.findUnique({
      where: { user_id_topic: { user_id: userId, topic } }
    });
    
    const ema = mastery ? mastery.currentEMA : 0.0;
    
    // Determine difficulty spread based on EMA
    let easyCount = 4, mediumCount = 4, hardCount = 2;
    if (ema < 0.4) {
      easyCount = 7; mediumCount = 3; hardCount = 0;
    } else if (ema > 0.8) {
      easyCount = 1; mediumCount = 4; hardCount = 5;
    }

    return this.generateDynamicQuestions(topic, easyCount, mediumCount, hardCount);
  }

  private generateDynamicQuestions(topic: string, easy: number, medium: number, hard: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const total = easy + medium + hard;
    
    // Simulate AI generation by dynamically constructing questions based on topic
    for (let i = 0; i < total; i++) {
      let difficulty = 'easy';
      if (i >= easy && i < easy + medium) difficulty = 'medium';
      if (i >= easy + medium) difficulty = 'hard';

      if (topic === 'binary-arithmetic') {
        const q = this.generateBinaryArithmeticQuestion(difficulty);
        questions.push(q);
      } else if (topic === 'complements') {
        const q = this.generateComplementQuestion(difficulty);
        questions.push(q);
      } else {
        // Fallback generic
        questions.push({
          id: `q-${Date.now()}-${i}`,
          topic,
          question: `What is a core concept of ${topic} at ${difficulty} level?`,
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A (Correct)',
          explanation: `This verifies understanding of ${topic}.`
        });
      }
    }

    return questions;
  }

  private generateBinaryArithmeticQuestion(difficulty: string): QuizQuestion {
    // Basic generator
    const val1 = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 10 : 25;
    const val2 = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 14;
    const bin1 = val1.toString(2);
    const bin2 = val2.toString(2);
    const result = (val1 + val2).toString(2);

    return {
      id: `ba-${Math.random()}`,
      topic: 'binary-arithmetic',
      question: `What is the binary sum of ${bin1} + ${bin2}?`,
      options: [
        result,
        (val1 + val2 + 1).toString(2),
        (val1 + val2 - 1).toString(2),
        (val1 + val2 + 2).toString(2)
      ].sort(() => Math.random() - 0.5), // shuffle
      correctAnswer: result,
      explanation: `${bin1} is ${val1} in decimal, ${bin2} is ${val2}. Sum is ${val1+val2}, which is ${result} in binary.`
    };
  }

  private generateComplementQuestion(difficulty: string): QuizQuestion {
    const val = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : 28;
    const bin = val.toString(2).padStart(6, '0');
    // 1s complement
    let ones = '';
    for (const b of bin) ones += b === '1' ? '0' : '1';
    
    return {
      id: `comp-${Math.random()}`,
      topic: 'complements',
      question: `What is the 1's complement of the 6-bit binary number ${bin}?`,
      options: [
        ones,
        bin,
        (parseInt(ones, 2) + 1).toString(2).padStart(6, '0'),
        (parseInt(ones, 2) - 1).toString(2).padStart(6, '0')
      ].sort(() => Math.random() - 0.5),
      correctAnswer: ones,
      explanation: `To find the 1's complement, invert every bit: 0 becomes 1, and 1 becomes 0.`
    };
  }

  async submitQuiz(userId: string, topic: string, score: number, answersJson: any) {
    // Save raw result
    await this.prisma.quiz_results.create({
      data: {
        user_id: userId,
        topic: topic,
        score: score,
        answersJson: answersJson
      }
    });
  }
}
