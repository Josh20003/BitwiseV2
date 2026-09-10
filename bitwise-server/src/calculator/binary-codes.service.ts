import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

export interface EncodingRule {
  pattern: string;
  rule: string;
  example?: string;
}

export interface DecodingStep {
  description: string;
  result: string;
}

export interface BinaryCodeResult {
  input: string;
  output: string;
  steps: DecodingStep[];
  explanation: string;
  codeUsed: string;
}

@Injectable()
export class BinaryCodesService {
  private readonly logger = new Logger(BinaryCodesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Encode a decimal number using BCD (Binary Coded Decimal)
   */
  encodeBCD(decimalValue: string): BinaryCodeResult {
    const steps: DecodingStep[] = [];
    const digits = decimalValue.split('');
    const bcdResults: string[] = [];

    steps.push({
      description: `Convert each decimal digit to its 4-bit binary equivalent`,
      result: `Processing: ${decimalValue}`,
    });

    for (const digit of digits) {
      const num = parseInt(digit);
      const binary = num.toString(2).padStart(4, '0');
      bcdResults.push(binary);
      steps.push({
        description: `Digit ${digit} → ${binary}`,
        result: binary,
      });
    }

    const output = bcdResults.join(' ');

    return {
      input: decimalValue,
      output: output,
      steps: steps,
      explanation: this.generateBCDExplanation(decimalValue, output),
      codeUsed: 'BCD (Binary Coded Decimal)',
    };
  }

  /**
   * Decode BCD (Binary Coded Decimal) to decimal
   */
  decodeBCD(bcdValue: string): BinaryCodeResult {
    const steps: DecodingStep[] = [];
    const bcdGroups = bcdValue.split(/\s+/).filter((g) => g.length > 0);
    const decimalDigits: string[] = [];

    steps.push({
      description: `Split BCD value into 4-bit groups`,
      result: `Groups: ${bcdGroups.join(', ')}`,
    });

    for (const group of bcdGroups) {
      if (group.length !== 4 || !/^[01]{4}$/.test(group)) {
        throw new Error(
          `Invalid BCD group: ${group} (must be 4 binary digits)`,
        );
      }
      const decimal = parseInt(group, 2);
      decimalDigits.push(decimal.toString());
      steps.push({
        description: `Group ${group} → ${decimal}`,
        result: decimal.toString(),
      });
    }

    const output = decimalDigits.join('');

    return {
      input: bcdValue,
      output: output,
      steps: steps,
      explanation: this.generateBCDDecodeExplanation(bcdValue, output),
      codeUsed: 'BCD (Binary Coded Decimal)',
    };
  }

  /**
   * Encode a binary number using Gray Code
   */
  encodeGrayCode(binaryValue: string): BinaryCodeResult {
    if (!/^[01]+$/.test(binaryValue)) {
      throw new Error('Invalid binary input');
    }

    const steps: DecodingStep[] = [];
    const bits = binaryValue.split('');
    const grayBits: string[] = [];

    // First bit stays the same
    grayBits.push(bits[0]);
    steps.push({
      description: `First bit remains the same`,
      result: `G[0] = B[0] = ${bits[0]}`,
    });

    // Remaining bits are XOR of adjacent binary bits
    for (let i = 1; i < bits.length; i++) {
      const xorResult = (parseInt(bits[i - 1]) ^ parseInt(bits[i])).toString();
      grayBits.push(xorResult);
      steps.push({
        description: `G[${i}] = B[${i - 1}] ⊕ B[${i}] = ${bits[i - 1]} ⊕ ${bits[i]} = ${xorResult}`,
        result: xorResult,
      });
    }

    const output = grayBits.join('');

    return {
      input: binaryValue,
      output: output,
      steps: steps,
      explanation: this.generateGrayCodeExplanation(binaryValue, output),
      codeUsed: 'Gray Code',
    };
  }

  /**
   * Decode Gray Code to binary
   */
  decodeGrayCode(grayValue: string): BinaryCodeResult {
    if (!/^[01]+$/.test(grayValue)) {
      throw new Error('Invalid gray code input');
    }

    const steps: DecodingStep[] = [];
    const grayBits = grayValue.split('');
    const binaryBits: string[] = [];

    // First bit stays the same
    binaryBits.push(grayBits[0]);
    steps.push({
      description: `First bit remains the same`,
      result: `B[0] = G[0] = ${grayBits[0]}`,
    });

    // Remaining bits are XOR of previous binary bit and current gray bit
    for (let i = 1; i < grayBits.length; i++) {
      const xorResult = (
        parseInt(binaryBits[i - 1]) ^ parseInt(grayBits[i])
      ).toString();
      binaryBits.push(xorResult);
      steps.push({
        description: `B[${i}] = B[${i - 1}] ⊕ G[${i}] = ${binaryBits[i - 1]} ⊕ ${grayBits[i]} = ${xorResult}`,
        result: xorResult,
      });
    }

    const output = binaryBits.join('');

    return {
      input: grayValue,
      output: output,
      steps: steps,
      explanation: this.generateGrayDecodeExplanation(grayValue, output),
      codeUsed: 'Gray Code',
    };
  }

  /**
   * Get all binary code definitions
   */
  async getBinaryCodes(complexity?: string) {
    const where: any = { isActive: true };
    if (complexity) where.complexity = complexity;

    return this.prisma.binaryCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a specific binary code definition
   */
  async getBinaryCodeById(id: string) {
    return this.prisma.binaryCode.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new binary code definition
   */
  async createBinaryCode(data: {
    name: string;
    description: string;
    encodingRules: EncodingRule[];
    decodingRules: EncodingRule[];
    examples: Array<{ input: string; output: string }>;
    complexity: string;
    tags: string[];
  }) {
    return this.prisma.binaryCode.create({
      data: {
        name: data.name,
        description: data.description,
        encodingRules: data.encodingRules as any,
        decodingRules: data.decodingRules as any,
        examples: data.examples as any,
        complexity: data.complexity,
        tags: data.tags,
        isActive: true,
      },
    });
  }

  /**
   * Hamming code single error detection and correction
   */
  calculateHammingCode(dataValue: string): BinaryCodeResult {
    // Simple Hamming(7,4) implementation
    if (dataValue.length > 4 || !/^[01]+$/.test(dataValue)) {
      throw new Error('Hamming(7,4) requires up to 4 data bits');
    }

    const steps: DecodingStep[] = [];
    const data = dataValue.padStart(4, '0').split('').map(Number);

    // Calculate parity bits
    const p1 = (data[0] ^ data[1] ^ data[3]).toString();
    const p2 = (data[0] ^ data[2] ^ data[3]).toString();
    const p3 = (data[1] ^ data[2] ^ data[3]).toString();

    steps.push({
      description: `Calculate parity bit P1 for positions 1,3,5,7`,
      result: `P1 = D1 ⊕ D2 ⊕ D4 = ${data[0]} ⊕ ${data[1]} ⊕ ${data[3]} = ${p1}`,
    });

    steps.push({
      description: `Calculate parity bit P2 for positions 2,3,6,7`,
      result: `P2 = D1 ⊕ D3 ⊕ D4 = ${data[0]} ⊕ ${data[2]} ⊕ ${data[3]} = ${p2}`,
    });

    steps.push({
      description: `Calculate parity bit P4 for positions 4,5,6,7`,
      result: `P4 = D2 ⊕ D3 ⊕ D4 = ${data[1]} ⊕ ${data[2]} ⊕ ${data[3]} = ${p3}`,
    });

    // Hamming code: P1 D1 P2 D2 D3 D4 P4
    const output = p1 + data[0] + p2 + data[1] + data[2] + data[3] + p3;

    return {
      input: dataValue,
      output: output,
      steps: steps,
      explanation: this.generateHammingExplanation(dataValue, output),
      codeUsed: 'Hamming(7,4)',
    };
  }

  // Helper functions for explanations
  private generateBCDExplanation(input: string, output: string): string {
    return `
BCD (Binary Coded Decimal) represents each decimal digit as a 4-bit binary number.

Input: ${input}
Output: ${output}

BCD is useful in digital systems that need to display decimal numbers directly
without conversion, such as digital clocks and calculators.
    `.trim();
  }

  private generateBCDDecodeExplanation(input: string, output: string): string {
    return `
Decoding BCD back to decimal:

Input: ${input}
Output: ${output}

Each 4-bit group represents one decimal digit. This allows easy conversion between
binary representation and human-readable decimal display.
    `.trim();
  }

  private generateGrayCodeExplanation(input: string, output: string): string {
    return `
Gray Code (also called Reflected Binary Code) converts binary to a code where
only one bit changes between consecutive numbers.

Binary: ${input}
Gray: ${output}

This property is useful in error detection and in systems where changing multiple
bits simultaneously could cause errors (like rotary encoders).
    `.trim();
  }

  private generateGrayDecodeExplanation(input: string, output: string): string {
    return `
Decoding Gray Code back to binary:

Gray: ${input}
Binary: ${output}

The first bit is kept as-is, then each subsequent bit is the XOR of the previous
binary bit and the current gray bit.
    `.trim();
  }

  private generateHammingExplanation(input: string, output: string): string {
    return `
Hamming(7,4) Code adds 3 parity bits to 4 data bits for single-bit error correction.

Data: ${input}
Hamming Code: ${output}

The parity bits are calculated using XOR operations on specific bit positions,
allowing the receiver to detect and correct single-bit errors.
    `.trim();
  }
}
