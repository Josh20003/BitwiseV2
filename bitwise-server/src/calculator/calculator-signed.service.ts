import { Injectable } from '@nestjs/common';

export interface SignedInterpretationResult {
  binary: string;
  bitLength: number;
  unsignedValue: number;
  signedMagnitudeValue: number;
  onesComplementValue: number;
  twosComplementValue: number;
  isNegative: boolean;
}

@Injectable()
export class CalculatorSignedService {
  
  public interpret(binary: string): SignedInterpretationResult {
    // Basic validation
    if (!/^[01]+$/.test(binary)) {
      throw new Error('Invalid binary string');
    }

    const bitLength = binary.length;
    const isNegative = binary[0] === '1';

    // Unsigned
    const unsignedValue = parseInt(binary, 2);

    // Signed Magnitude
    const magnitudeBits = binary.substring(1);
    const magnitude = parseInt(magnitudeBits, 2) || 0;
    const signedMagnitudeValue = isNegative ? -magnitude : magnitude;

    // 1's Complement
    let onesComplementValue = 0;
    if (isNegative) {
      let inverted = '';
      for (let i = 1; i < binary.length; i++) {
        inverted += binary[i] === '1' ? '0' : '1';
      }
      onesComplementValue = -(parseInt(inverted, 2) || 0);
      if (onesComplementValue === 0 && isNegative) {
          // Negative zero in 1's complement
          // Handled as -0 but represented as 0 in number type, 
          // we'll just keep it as 0
      }
    } else {
      onesComplementValue = parseInt(binary, 2);
    }

    // 2's Complement
    let twosComplementValue = 0;
    if (isNegative) {
      // Invert all bits and add 1
      let inverted = '';
      for (let i = 0; i < binary.length; i++) {
        inverted += binary[i] === '1' ? '0' : '1';
      }
      twosComplementValue = -(parseInt(inverted, 2) + 1);
    } else {
      twosComplementValue = parseInt(binary, 2);
    }

    return {
      binary,
      bitLength,
      unsignedValue,
      signedMagnitudeValue,
      onesComplementValue,
      twosComplementValue,
      isNegative
    };
  }
}
