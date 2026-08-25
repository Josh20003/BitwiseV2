import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

export interface ConversionStep {
  description: string;
  operation: string;
  result: string;
}

export interface ConversionResult {
  sourceValue: string;
  sourceBase: number;
  targetBase: number;
  targetValue: string;
  steps: ConversionStep[];
  explanation: string;
}

@Injectable()
export class CalculatorConverterService {
  private readonly logger = new Logger(CalculatorConverterService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Convert a number from one base to another
   */
  async convertNumber(
    value: string,
    fromBase: number,
    toBase: number,
  ): Promise<ConversionResult> {
    const steps: ConversionStep[] = [];
    
    // Validate input
    if (!/^[0-9a-fA-F]+$/.test(value)) {
      throw new Error('Invalid characters in input value');
    }

    // Step 1: Convert to decimal (base 10)
    let decimalValue = this.toDecimal(value, fromBase);
    steps.push({
      description: `Convert from base ${fromBase} to decimal`,
      operation: `${value} (base ${fromBase})`,
      result: `${decimalValue} (base 10)`,
    });

    // Step 2: Convert from decimal to target base
    let targetValue = this.fromDecimal(decimalValue, toBase);
    steps.push({
      description: `Convert from decimal to base ${toBase}`,
      operation: `${decimalValue} (base 10)`,
      result: `${targetValue} (base ${toBase})`,
    });

    const result: ConversionResult = {
      sourceValue: value,
      sourceBase: fromBase,
      targetBase: toBase,
      targetValue: targetValue,
      steps: steps,
      explanation: this.generateExplanation(value, fromBase, decimalValue, targetValue, toBase),
    };

    return result;
  }

  /**
   * Convert a decimal number to a specific base
   */
  private fromDecimal(decimal: number, base: number): string {
    if (decimal === 0) return '0';

    const digits = '0123456789ABCDEF';
    let result = '';

    while (decimal > 0) {
      result = digits[decimal % base] + result;
      decimal = Math.floor(decimal / base);
    }

    return result;
  }

  /**
   * Convert a number in any base to decimal
   */
  private toDecimal(value: string, base: number): number {
    let decimal = 0;
    const digits = '0123456789ABCDEF';
    value = value.toUpperCase();

    for (let i = 0; i < value.length; i++) {
      const digit = digits.indexOf(value[i]);
      if (digit === -1) {
        throw new Error(`Invalid digit '${value[i]}' for base ${base}`);
      }
      if (digit >= base) {
        throw new Error(`Digit '${value[i]}' is invalid for base ${base}`);
      }
      decimal = decimal * base + digit;
    }

    return decimal;
  }

  /**
   * Get all conversion examples from database
   */
  async getConversionExamples(
    sourceBase?: number,
    targetBase?: number,
    difficulty?: string,
  ) {
    const where: any = {};
    if (sourceBase) where.sourceBase = sourceBase;
    if (targetBase) where.targetBase = targetBase;
    if (difficulty) where.difficulty = difficulty;

    return this.prisma.conversionExample.findMany({
      where: {
        ...where,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single conversion example by ID
   */
  async getConversionExample(id: string) {
    return this.prisma.conversionExample.findUnique({
      where: { id },
    });
  }

  /**
   * Save a conversion example to database
   */
  async saveConversionExample(data: {
    sourceBase: number;
    targetBase: number;
    sourceValue: string;
    targetValue: string;
    steps: ConversionStep[];
    explanation: string;
    difficulty: string;
    category: string;
    tags: string[];
  }) {
    return this.prisma.conversionExample.create({
      data: {
        sourceBase: data.sourceBase,
        targetBase: data.targetBase,
        sourceValue: data.sourceValue,
        targetValue: data.targetValue,
        steps: data.steps as any,
        explanation: data.explanation,
        difficulty: data.difficulty,
        category: data.category,
        tags: data.tags,
        isActive: true,
      },
    });
  }

  /**
   * Generate educational explanation for a conversion
   */
  private generateExplanation(
    source: string,
    sourceBase: number,
    decimal: number,
    target: string,
    targetBase: number,
  ): string {
    return `
To convert ${source} from base ${sourceBase} to base ${targetBase}:

1. First, we convert to decimal (base 10):
   - Each digit position represents a power of ${sourceBase}
   - ${source} in base ${sourceBase} = ${decimal} in base 10

2. Then, we convert from decimal to base ${targetBase}:
   - We repeatedly divide by ${targetBase} and collect remainders
   - The remainders in reverse order give us: ${target}

Therefore, ${source} (base ${sourceBase}) = ${target} (base ${targetBase})
    `.trim();
  }

  /**
   * Get all supported number systems
   */
  async getNumberSystems() {
    return this.prisma.numberSystem.findMany({
      orderBy: { base: 'asc' },
    });
  }

  /**
   * Create a new number system definition
   */
  async createNumberSystem(data: {
    name: string;
    base: number;
    digits: string;
    description?: string;
    examples?: string[];
  }) {
    return this.prisma.numberSystem.create({
      data,
    });
  }

  /**
   * Perform multi-step conversion path (e.g., binary -> octal -> hexadecimal)
   */
  async convertMultiStep(
    value: string,
    fromBase: number,
    basePath: number[],
  ): Promise<{ steps: ConversionResult[] }> {
    const results: ConversionResult[] = [];
    let currentValue = value;
    let currentBase = fromBase;

    for (const nextBase of basePath) {
      const result = await this.convertNumber(currentValue, currentBase, nextBase);
      results.push(result);
      currentValue = result.targetValue;
      currentBase = nextBase;
    }

    return { steps: results };
  }

  /**
   * Validate if a number is valid for a given base
   */
  validateNumber(value: string, base: number): boolean {
    if (base < 2 || base > 36) {
      return false;
    }

    const validDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, base);
    return value
      .toUpperCase()
      .split('')
      .every(char => validDigits.includes(char));
  }
}
