import { Injectable } from '@nestjs/common';

export interface MathTreeStep {
  id: string;
  operation: string; // e.g. "42 ÷ 2" or "1 × 2^3"
  quotient?: string;
  remainder?: string;
  result?: string;
  isFractional?: boolean;
}

@Injectable()
export class LessonsConverterService {
  /**
   * Generates successive division/multiplication steps or positional weight
   * expansion for rendering an interactive math tree.
   */
  generateConversionSteps(value: string, fromBase: number, toBase: number): { steps: MathTreeStep[] } {
    const steps: MathTreeStep[] = [];
    
    // For simplicity, we implement two main modes:
    // 1. Any base to Decimal (Positional Weight expansion)
    // 2. Decimal to Any base (Successive Division for integers)
    // Complex paths (e.g. Base 2 to Base 8) can be direct grouping, but we'll stick to
    // decimal routing or direct division if requested.

    if (toBase === 10 && fromBase !== 10) {
      // Any to Decimal: Positional Weight Expansion
      const digits = value.split('');
      for (let i = 0; i < digits.length; i++) {
        const power = digits.length - 1 - i;
        const digitVal = parseInt(digits[i], fromBase);
        const result = digitVal * Math.pow(fromBase, power);
        steps.push({
          id: `step-${i}`,
          operation: `${digits[i]} × ${fromBase}^${power}`,
          result: result.toString()
        });
      }
    } else if (fromBase === 10 && toBase !== 10) {
      // Decimal to Any: Successive Division
      let currentVal = parseInt(value, 10);
      let stepCount = 0;
      
      if (currentVal === 0) {
        steps.push({ id: 'step-0', operation: `0 ÷ ${toBase}`, quotient: '0', remainder: '0' });
      }

      while (currentVal > 0) {
        const remainder = currentVal % toBase;
        const quotient = Math.floor(currentVal / toBase);
        steps.push({
          id: `step-${stepCount++}`,
          operation: `${currentVal} ÷ ${toBase}`,
          quotient: quotient.toString(),
          remainder: remainder.toString(toBase).toUpperCase()
        });
        currentVal = quotient;
      }
    } else if (fromBase !== 10 && toBase !== 10) {
      // For Any to Any, we just string together the two methods.
      // First Any to 10
      let decValue = 0;
      const digits = value.split('');
      for (let i = 0; i < digits.length; i++) {
        const power = digits.length - 1 - i;
        const digitVal = parseInt(digits[i], fromBase);
        decValue += digitVal * Math.pow(fromBase, power);
      }
      steps.push({
        id: `step-info-1`,
        operation: `Convert ${value} (base ${fromBase}) to Decimal:`,
        result: decValue.toString()
      });

      // Then 10 to Any
      let currentVal = decValue;
      let stepCount = 0;
      while (currentVal > 0) {
        const remainder = currentVal % toBase;
        const quotient = Math.floor(currentVal / toBase);
        steps.push({
          id: `step-div-${stepCount++}`,
          operation: `${currentVal} ÷ ${toBase}`,
          quotient: quotient.toString(),
          remainder: remainder.toString(toBase).toUpperCase()
        });
        currentVal = quotient;
      }
    }

    return { steps };
  }
}
