import { Injectable } from '@nestjs/common';
import { CalculatorArithmeticService } from './calculator-arithmetic.service';

export interface ComplementResult {
  originalValue: string;
  onesComplement: string;
  twosComplement: string;
  cascadeSteps: any[];
}

@Injectable()
export class CalculatorComplementService {
  constructor(private arithmeticService: CalculatorArithmeticService) {}

  public getComplements(value: string): ComplementResult {
    // 1's complement: flip bits
    let onesComplement = '';
    for (const bit of value) {
      onesComplement += bit === '1' ? '0' : '1';
    }

    // 2's complement: onesComplement + 1
    // We can use the arithmetic service to get the +1 cascade trace
    const addResult = this.arithmeticService.calculate(
      onesComplement,
      '1',
      '+',
    );

    return {
      originalValue: value,
      onesComplement,
      twosComplement: addResult.result,
      cascadeSteps: addResult.traceSteps,
    };
  }
}
