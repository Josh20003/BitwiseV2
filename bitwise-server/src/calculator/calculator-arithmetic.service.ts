import { Injectable } from '@nestjs/common';

export interface ArithmeticTraceStep {
  id: string;
  column: number;
  description: string;
  topBit: string;
  bottomBit: string;
  carryIn: string;
  carryOut: string;
  resultBit: string;
  partialProduct?: string;
  shift?: number;
  currentTotal?: string;
  dividend?: string;
  divisor?: string;
  quotientBit?: string;
  remainder?: string;
}

export interface ArithmeticResult {
  operation: '+' | '-' | '*' | '/';
  operand1: string;
  operand2: string;
  result: string;
  traceSteps: ArithmeticTraceStep[];
}

@Injectable()
export class CalculatorArithmeticService {
  public calculate(
    operand1: string,
    operand2: string,
    operation: '+' | '-' | '*' | '/',
  ): ArithmeticResult {
    const op1 = operand1 || '0';
    const op2 = operand2 || '0';

    if (operation === '+') {
      return this.addBinary(op1, op2);
    } else if (operation === '-') {
      return this.subtractBinary(op1, op2);
    } else if (operation === '*') {
      return this.multiplyBinary(op1, op2);
    } else if (operation === '/') {
      return this.divideBinary(op1, op2);
    } else {
      throw new Error(
        `Operation ${String(operation)} trace not implemented yet.`,
      );
    }
  }

  private addBinary(a: string, b: string): ArithmeticResult {
    const maxLength = Math.max(a.length, b.length);
    const op1 = a.padStart(maxLength, '0');
    const op2 = b.padStart(maxLength, '0');

    let carry = 0;
    let result = '';
    const traceSteps: ArithmeticTraceStep[] = [];

    for (let i = maxLength - 1; i >= 0; i--) {
      const bit1 = parseInt(op1[i], 10);
      const bit2 = parseInt(op2[i], 10);

      const sum = bit1 + bit2 + carry;
      const resultBit = sum % 2;
      const nextCarry = Math.floor(sum / 2);

      traceSteps.push({
        id: `add-col-${maxLength - i - 1}`,
        column: maxLength - i - 1, // 0 is Right-most (LSB)
        description: `Column ${maxLength - i - 1}: ${bit1} + ${bit2} + Carry In ${carry} = ${sum} -> Result Bit ${resultBit}, Carry Out ${nextCarry}`,
        topBit: bit1.toString(),
        bottomBit: bit2.toString(),
        carryIn: carry.toString(),
        carryOut: nextCarry.toString(),
        resultBit: resultBit.toString(),
      });

      result = resultBit.toString() + result;
      carry = nextCarry;
    }

    if (carry > 0) {
      traceSteps.push({
        id: `add-col-${maxLength}`,
        column: maxLength,
        description: `Final Carry Out ${carry} becomes the new MSB.`,
        topBit: '0',
        bottomBit: '0',
        carryIn: carry.toString(),
        carryOut: '0',
        resultBit: carry.toString(),
      });
      result = carry.toString() + result;
    }

    return {
      operation: '+',
      operand1: a,
      operand2: b,
      result,
      traceSteps,
    };
  }

  private subtractBinary(a: string, b: string): ArithmeticResult {
    const maxLength = Math.max(a.length, b.length);
    const op1 = a.padStart(maxLength, '0');
    const op2 = b.padStart(maxLength, '0');

    let borrow = 0;
    let result = '';
    const traceSteps: ArithmeticTraceStep[] = [];

    for (let i = maxLength - 1; i >= 0; i--) {
      let bit1 = parseInt(op1[i], 10);
      const bit2 = parseInt(op2[i], 10);
      const borrowIn = borrow;

      bit1 = bit1 - borrow;
      if (bit1 < bit2) {
        bit1 += 2;
        borrow = 1;
      } else {
        borrow = 0;
      }

      const resultBit = bit1 - bit2;

      traceSteps.push({
        id: `sub-col-${maxLength - i - 1}`,
        column: maxLength - i - 1,
        description: `Column ${maxLength - i - 1}: Top ${op1[i]} - Borrow In ${borrowIn} - Bottom ${bit2} = Result Bit ${resultBit}, Borrow Out ${borrow}`,
        topBit: op1[i],
        bottomBit: bit2.toString(),
        carryIn: borrowIn.toString(), // We use carryIn for BorrowIn
        carryOut: borrow.toString(), // We use carryOut for BorrowOut
        resultBit: resultBit.toString(),
      });

      result = resultBit.toString() + result;
    }

    // Remove leading zeros
    result = result.replace(/^0+/, '') || '0';

    return {
      operation: '-',
      operand1: a,
      operand2: b,
      result,
      traceSteps,
    };
  }

  private multiplyBinary(a: string, b: string): ArithmeticResult {
    const multiplicand = a.replace(/^0+/, '') || '0';
    const multiplier = b.replace(/^0+/, '') || '0';

    const traceSteps: ArithmeticTraceStep[] = [];
    let runningTotal = '0';
    const partialProducts: string[] = [];

    // LSB to MSB of multiplier
    for (let i = multiplier.length - 1, stepIdx = 0; i >= 0; i--, stepIdx++) {
      const bit = multiplier[i];
      const shift = multiplier.length - 1 - i;
      let pp = '0';
      if (bit === '1') {
        pp = multiplicand + '0'.repeat(shift);
      } else {
        pp = '0'.repeat(multiplicand.length + shift);
      }
      partialProducts.push(pp);

      runningTotal = this.addBinaryStrings(runningTotal, pp);

      traceSteps.push({
        id: `mul-step-${stepIdx}`,
        column: stepIdx,
        description:
          bit === '1'
            ? `The current bottom bit is 1. We take the top number (${multiplicand})${shift > 0 ? ` and add ${shift} zero(s) at the end` : ''} to get ${pp}. We then add this to our running total.`
            : `The current bottom bit is 0. The result for this row is 0, so our running total doesn't change.`,
        topBit: '0',
        bottomBit: bit,
        carryIn: '0',
        carryOut: '0',
        resultBit: bit,
        partialProduct: pp,
        shift,
        currentTotal: runningTotal,
      });
    }

    return {
      operation: '*',
      operand1: a,
      operand2: b,
      result: runningTotal,
      traceSteps,
    };
  }

  private addBinaryStrings(a: string, b: string): string {
    const num1 = BigInt('0b' + (a || '0'));
    const num2 = BigInt('0b' + (b || '0'));
    return (num1 + num2).toString(2);
  }

  private divideBinary(a: string, b: string): ArithmeticResult {
    const dividend = a.replace(/^0+/, '') || '0';
    const divisor = b.replace(/^0+/, '') || '0';

    if (divisor === '0') {
      throw new Error('Division by zero');
    }

    const traceSteps: ArithmeticTraceStep[] = [];
    let currentDividend = '';
    let quotient = '';

    for (let i = 0; i < dividend.length; i++) {
      currentDividend += dividend[i];
      // remove leading zeros for comparison
      const currentVal = BigInt('0b' + currentDividend);
      const divVal = BigInt('0b' + divisor);

      let qBit = '0';
      let subResult = currentDividend;

      if (currentVal >= divVal) {
        qBit = '1';
        subResult = (currentVal - divVal).toString(2);
      }

      quotient += qBit;

      traceSteps.push({
        id: `div-step-${i}`,
        column: i,
        description:
          qBit === '1'
            ? `Bring down '${dividend[i]}'. Current dividend is ${currentDividend} >= divisor (${divisor}). Subtract divisor from current dividend to get ${subResult}. Quotient bit is 1.`
            : `Bring down '${dividend[i]}'. Current dividend is ${currentDividend} < divisor (${divisor}). Cannot subtract. Quotient bit is 0.`,
        topBit: '0',
        bottomBit: '0',
        carryIn: '0',
        carryOut: '0',
        resultBit: qBit,
        dividend: currentDividend,
        divisor: divisor,
        quotientBit: qBit,
        remainder: subResult,
      });

      currentDividend = subResult;
    }

    // strip leading zeros from quotient
    quotient = quotient.replace(/^0+/, '') || '0';

    return {
      operation: '/',
      operand1: a,
      operand2: b,
      result: quotient,
      traceSteps,
    };
  }
}
