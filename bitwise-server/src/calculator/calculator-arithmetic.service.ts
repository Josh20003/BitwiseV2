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
  
  public calculate(operand1: string, operand2: string, operation: '+' | '-' | '*' | '/'): ArithmeticResult {
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
      throw new Error(`Operation ${operation} trace not implemented yet.`);
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
        resultBit: resultBit.toString()
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
        resultBit: carry.toString()
      });
      result = carry.toString() + result;
    }

    return {
      operation: '+',
      operand1: a,
      operand2: b,
      result,
      traceSteps
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
        carryOut: borrow.toString(),  // We use carryOut for BorrowOut
        resultBit: resultBit.toString()
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
      traceSteps
    };
  }

  private multiplyBinary(a: string, b: string): ArithmeticResult {
    const num1 = parseInt(a, 2);
    const num2 = parseInt(b, 2);
    const resNum = num1 * num2;
    const result = resNum.toString(2);
    
    const traceSteps: ArithmeticTraceStep[] = [];
    for (let i = 0; i < result.length; i++) {
      const bit = result[result.length - 1 - i];
      traceSteps.push({
        id: `mul-col-${i}`,
        column: i,
        description: `Multiplier output bit ${i}: ${bit}`,
        topBit: '0',
        bottomBit: '0',
        carryIn: '0',
        carryOut: '0',
        resultBit: bit
      });
    }

    return {
      operation: '*',
      operand1: a,
      operand2: b,
      result,
      traceSteps
    };
  }

  private divideBinary(a: string, b: string): ArithmeticResult {
    const num1 = parseInt(a, 2);
    const num2 = parseInt(b, 2);
    
    if (num2 === 0) {
      // Return a basic error trace or throw
      throw new Error("Division by zero");
    }

    const resNum = Math.floor(num1 / num2);
    const result = resNum.toString(2);
    
    const traceSteps: ArithmeticTraceStep[] = [];
    for (let i = 0; i < result.length; i++) {
      const bit = result[result.length - 1 - i];
      traceSteps.push({
        id: `div-col-${i}`,
        column: i,
        description: `Quotient output bit ${i}: ${bit}`,
        topBit: '0',
        bottomBit: '0',
        carryIn: '0',
        carryOut: '0',
        resultBit: bit
      });
    }

    return {
      operation: '/',
      operand1: a,
      operand2: b,
      result,
      traceSteps
    };
  }
}
