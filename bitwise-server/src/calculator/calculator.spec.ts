/**
 * Unit tests for the BitWise Calculator Math Engine
 *
 * Tests the three core backend services:
 *   1. CalculatorConverterService  — Number system conversions
 *   2. CalculatorArithmeticService — Binary arithmetic (+, −, ×, ÷)
 *   3. CalculatorComplementService — 1's and 2's complements
 *
 * Framework: Jest (the NestJS-native equivalent of JUnit)
 *
 * Run with:
 *   cd bitwise-server
 *   npm run test
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculatorArithmeticService } from './calculator-arithmetic.service';
import { CalculatorComplementService } from './calculator-complement.service';
import { CalculatorConverterService } from './calculator-converter.service';

// ═══════════════════════════════════════════════════════════════════════════
//  1.  NUMBER SYSTEM CONVERSIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('CalculatorConverterService', () => {
  let service: CalculatorConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculatorConverterService,
        // Mocking the database dependency that was previously 'null as any'
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<CalculatorConverterService>(CalculatorConverterService);
  });

  // ── Happy-path conversions ────────────────────────────────────────────

  it('converts decimal 255 to hexadecimal FF', async () => {
    const result = await service.convertNumber('255', 10, 16);
    expect(result.targetValue).toBe('FF');
  });

  it('converts decimal 255 to binary 11111111', async () => {
    const result = await service.convertNumber('255', 10, 2);
    expect(result.targetValue).toBe('11111111');
  });

  it('converts binary 11111111 to decimal 255', async () => {
    const result = await service.convertNumber('11111111', 2, 10);
    expect(result.targetValue).toBe('255');
  });

  it('converts hex A to binary 1010', async () => {
    const result = await service.convertNumber('A', 16, 2);
    expect(result.targetValue).toBe('1010');
  });

  it('converts binary 1010 to octal 12', async () => {
    const result = await service.convertNumber('1010', 2, 8);
    expect(result.targetValue).toBe('12');
  });

  it('converts octal 77 to hex 3F', async () => {
    const result = await service.convertNumber('77', 8, 16);
    expect(result.targetValue).toBe('3F');
  });

  it('converts hex 1F to decimal 31', async () => {
    const result = await service.convertNumber('1F', 16, 10);
    expect(result.targetValue).toBe('31');
  });

  it('converts decimal 8 to octal 10', async () => {
    const result = await service.convertNumber('8', 10, 8);
    expect(result.targetValue).toBe('10');
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  it('converts zero from any base', async () => {
    const result = await service.convertNumber('0', 10, 2);
    expect(result.targetValue).toBe('0');
  });

  it('handles lowercase hex input', async () => {
    const result = await service.convertNumber('ff', 16, 10);
    expect(result.targetValue).toBe('255');
  });

  it('throws on invalid characters', async () => {
    await expect(service.convertNumber('XYZ', 10, 2)).rejects.toThrow();
  });

  it('populates conversion steps array', async () => {
    const result = await service.convertNumber('123', 8, 2);
    expect(result.steps.length).toBeGreaterThanOrEqual(2);
    expect(result.sourceValue).toBe('123');
    expect(result.sourceBase).toBe(8);
    expect(result.targetBase).toBe(2);
  });
});


// ═══════════════════════════════════════════════════════════════════════════
//  2.  BINARY ARITHMETIC
// ═══════════════════════════════════════════════════════════════════════════

describe('CalculatorArithmeticService', () => {
  let service: CalculatorArithmeticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorArithmeticService],
    }).compile();

    service = module.get<CalculatorArithmeticService>(CalculatorArithmeticService);
  });

  // ── Addition ──────────────────────────────────────────────────────────

  describe('Binary Addition', () => {
    it('adds 1010 + 0101 = 1111  (10 + 5 = 15)', () => {
      const result = service.calculate('1010', '0101', '+');
      expect(result.result).toBe('1111');
    });

    it('adds 1 + 1 = 10  (simple carry)', () => {
      const result = service.calculate('1', '1', '+');
      expect(result.result).toBe('10');
    });

    it('adds 1111 + 1 = 10000  (carry cascade)', () => {
      const result = service.calculate('1111', '1', '+');
      expect(result.result).toBe('10000');
    });

    it('adds 0 + 0 = 0', () => {
      const result = service.calculate('0', '0', '+');
      expect(result.result).toBe('0');
    });

    it('handles different-length operands: 11 + 1 = 100', () => {
      const result = service.calculate('11', '1', '+');
      expect(result.result).toBe('100');
    });

    it('adds 11001010 + 00110101 = 11111111  (202 + 53 = 255)', () => {
      const result = service.calculate('11001010', '00110101', '+');
      expect(result.result).toBe('11111111');
    });

    it('produces trace steps for each column', () => {
      const result = service.calculate('1010', '0101', '+');
      expect(result.traceSteps.length).toBeGreaterThanOrEqual(4);
      expect(result.operation).toBe('+');
    });
  });

  // ── Subtraction ───────────────────────────────────────────────────────

  describe('Binary Subtraction', () => {
    it('subtracts 1010 - 0101 = 101  (10 − 5 = 5)', () => {
      const result = service.calculate('1010', '0101', '-');
      expect(result.result).toBe('101');
    });

    it('subtracts 10 - 1 = 1  (borrow)', () => {
      const result = service.calculate('10', '1', '-');
      expect(result.result).toBe('1');
    });

    it('subtracts 1000 - 1 = 111  (borrow cascade)', () => {
      const result = service.calculate('1000', '1', '-');
      expect(result.result).toBe('111');
    });

    it('subtracts a number from itself = 0', () => {
      const result = service.calculate('1010', '1010', '-');
      expect(result.result).toBe('0');
    });

    it('strips leading zeros: 100 - 11 = 1  (4 − 3)', () => {
      const result = service.calculate('100', '11', '-');
      expect(result.result).toBe('1');
    });
  });

  // ── Multiplication ────────────────────────────────────────────────────

  describe('Binary Multiplication', () => {
    it('multiplies 101 × 11 = 1111  (5 × 3 = 15)', () => {
      const result = service.calculate('101', '11', '*');
      expect(result.result).toBe('1111');
    });

    it('multiplies 110 × 10 = 1100  (6 × 2 = 12)', () => {
      const result = service.calculate('110', '10', '*');
      expect(result.result).toBe('1100');
    });

    it('anything × 0 = 0', () => {
      const result = service.calculate('1010', '0', '*');
      expect(result.result).toBe('0');
    });

    it('anything × 1 = itself', () => {
      const result = service.calculate('1010', '1', '*');
      expect(result.result).toBe('1010');
    });

    it('multiplies 111 × 111 = 110001  (7 × 7 = 49)', () => {
      const result = service.calculate('111', '111', '*');
      expect(result.result).toBe('110001');
    });
  });

  // ── Division ──────────────────────────────────────────────────────────

  describe('Binary Division', () => {
    it('divides 1010 ÷ 10 = 101  (10 ÷ 2 = 5)', () => {
      const result = service.calculate('1010', '10', '/');
      expect(result.result).toBe('101');
    });

    it('divides 1111 ÷ 11 = 101  (15 ÷ 3 = 5)', () => {
      const result = service.calculate('1111', '11', '/');
      expect(result.result).toBe('101');
    });

    it('divides a number by itself = 1', () => {
      const result = service.calculate('1010', '1010', '/');
      expect(result.result).toBe('1');
    });

    it('divides a number by 1 = itself', () => {
      const result = service.calculate('1010', '1', '/');
      expect(result.result).toBe('1010');
    });

    it('throws on division by zero', () => {
      expect(() => service.calculate('1010', '0', '/')).toThrow('Division by zero');
    });

    it('divides 110000 ÷ 100 = 1100  (48 ÷ 4 = 12)', () => {
      const result = service.calculate('110000', '100', '/');
      expect(result.result).toBe('1100');
    });
  });
});


// ═══════════════════════════════════════════════════════════════════════════
//  3.  COMPLEMENTS (1's and 2's)
// ═══════════════════════════════════════════════════════════════════════════

describe('CalculatorComplementService', () => {
  let service: CalculatorComplementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculatorComplementService,
        // NestJS automatically injects ArithmeticService into ComplementService
        CalculatorArithmeticService,
      ],
    }).compile();

    service = module.get<CalculatorComplementService>(CalculatorComplementService);
  });

  // ── 1's Complement ────────────────────────────────────────────────────

  describe("1's Complement", () => {
    it('flips 01011010 → 10100101', () => {
      const result = service.getComplements('01011010');
      expect(result.onesComplement).toBe('10100101');
    });

    it('flips all zeros → all ones', () => {
      const result = service.getComplements('00000000');
      expect(result.onesComplement).toBe('11111111');
    });

    it('flips all ones → all zeros', () => {
      const result = service.getComplements('11111111');
      expect(result.onesComplement).toBe('00000000');
    });

    it('flips alternating 10101010 → 01010101', () => {
      const result = service.getComplements('10101010');
      expect(result.onesComplement).toBe('01010101');
    });

    it('flips single bit 0 → 1', () => {
      const result = service.getComplements('0');
      expect(result.onesComplement).toBe('1');
    });
  });

  // ── 2's Complement ────────────────────────────────────────────────────

  describe("2's Complement", () => {
    it("computes 2's complement of 01011010 → 10100110", () => {
      // 1's = 10100101, +1 = 10100110
      const result = service.getComplements('01011010');
      expect(result.twosComplement).toBe('10100110');
    });

    it("computes 2's complement of 00000001 → 11111111", () => {
      // 1's = 11111110, +1 = 11111111
      const result = service.getComplements('00000001');
      expect(result.twosComplement).toBe('11111111');
    });

    it("computes 2's complement of 0110 → 1010  (4-bit)", () => {
      // 1's = 1001, +1 = 1010
      const result = service.getComplements('0110');
      expect(result.twosComplement).toBe('1010');
    });

    it('preserves the original value in the result', () => {
      const result = service.getComplements('01011010');
      expect(result.originalValue).toBe('01011010');
    });

    it('includes cascade trace steps from the +1 addition', () => {
      const result = service.getComplements('01011010');
      expect(result.cascadeSteps.length).toBeGreaterThan(0);
    });
  });
});