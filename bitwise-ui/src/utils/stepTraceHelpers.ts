import type { UnifiedTraceStep, StepInputItem } from '@/components/common/StepExplanationCard';

/**
 * Generates rich UnifiedTraceStep items for Number System Converter
 */
export function buildConverterTraceSteps(
  result: {
    sourceValue: string;
    sourceBase: number | string;
    targetValue: string;
    targetBase: number | string;
    steps?: Array<{
      description: string;
      operation?: string;
      result: string;
      substeps?: string[];
    }>;
  }
): UnifiedTraceStep[] {
  if (!result || !result.steps || result.steps.length === 0) return [];

  const sBase = Number(result.sourceBase);
  const tBase = Number(result.targetBase);

  return result.steps.map((rawStep, index) => {
    const isBaseToDec = rawStep.description.toLowerCase().includes('to decimal') || rawStep.description.toLowerCase().includes('base 10');
    const isDecToBase = rawStep.description.toLowerCase().includes('decimal to base') || rawStep.description.toLowerCase().includes('to base');
    const isDirectGroup = rawStep.description.toLowerCase().includes('group') || rawStep.description.toLowerCase().includes('direct');

    let inputs: StepInputItem[] = [];
    let simpleExplanation = '';
    let whyItWorks = '';
    let connectionToNext = '';
    let keyTakeaway = '';

    if (isBaseToDec) {
      inputs = [
        { label: 'Source Digits', value: result.sourceValue, color: 'blue' },
        { label: 'Source Radix', value: `Base ${sBase}`, color: 'purple' },
        { label: 'Target Radix', value: 'Base 10 (Decimal)', color: 'emerald' },
      ];
      simpleExplanation = `Every digit in base ${sBase} represents a distinct power of ${sBase}, starting from exponent 0 at the far right. We expand each digit by multiplying it by its positional value (${sBase}^position) and then sum all terms together.`;
      whyItWorks = `Positional number systems express value as digits multiplied by radix powers. Since decimal (base 10) is our reference arithmetic system, computing the weighted polynomial sum gives the exact equivalent quantity.`;
      connectionToNext = result.steps && result.steps.length > index + 1
        ? `Now that the quantity is in standard decimal (${rawStep.result}), the next step will convert this decimal integer into base ${tBase}.`
        : `This completes the conversion to the desired target representation.`;
      keyTakeaway = `Positional expansion (${sBase}^n) is the foundational method to convert any arbitrary number system into decimal.`;
    } else if (isDecToBase) {
      inputs = [
        { label: 'Decimal Input', value: rawStep.operation?.replace(/\(.*\)/, '').trim() || 'Decimal Value', color: 'blue' },
        { label: 'Target Radix', value: `Base ${tBase}`, color: 'purple' },
        { label: 'Method', value: 'Repeated Division', color: 'cyan' },
      ];
      simpleExplanation = `We continuously divide the decimal number by the target base ${tBase}. In each division cycle, the integer quotient is passed down to be divided again, and the remainder forms a digit in the target base.`;
      whyItWorks = `Because ${tBase} cannot divide into numbers smaller than itself, each remainder represents the exact coefficient of a power of ${tBase}. Reading the remainders in reverse order (bottom to top / last remainder first) arranges the digits from Most Significant Bit (MSB) to Least Significant Bit (LSB).`;
      connectionToNext = `All division remainders have been extracted and reassembled in reverse order to produce the final base-${tBase} string: ${rawStep.result}.`;
      keyTakeaway = `Repeated division by the target radix extracts digits as remainders from least significant (right) to most significant (left).`;
    } else if (isDirectGroup) {
      const groupSize = sBase === 16 || tBase === 16 ? 4 : 3;
      inputs = [
        { label: 'Source String', value: result.sourceValue, color: 'blue' },
        { label: 'Grouping Size', value: `${groupSize} bits`, color: 'purple' },
      ];
      simpleExplanation = `Since ${sBase} and ${tBase} are both powers of 2 (2³ = 8, 2⁴ = 16), digits can be mapped directly into binary bit clusters of ${groupSize} without intermediate decimal conversion.`;
      whyItWorks = `Because each digit in base ${sBase > tBase ? sBase : tBase} spans exactly 2^${groupSize} states, it maps one-to-one with a unique ${groupSize}-bit binary word.`;
      connectionToNext = `Direct mapping provides instantaneous conversion without precision loss or multi-step arithmetic.`;
      keyTakeaway = `Direct bit grouping is the most efficient method to interchange binary, octal, and hexadecimal values.`;
    } else {
      inputs = [
        { label: 'From Base', value: `${sBase}`, color: 'blue' },
        { label: 'To Base', value: `${tBase}`, color: 'purple' },
      ];
      simpleExplanation = `Carrying out conversion step: ${rawStep.description}.`;
      whyItWorks = `Systematically applies the appropriate base conversion algorithm to maintain exact mathematical value.`;
      connectionToNext = result.steps && result.steps.length > index + 1
        ? `Proceeding to the subsequent conversion phase.`
        : `Final conversion completed successfully.`;
      keyTakeaway = `Consistent base conversion guarantees mathematical equivalence across digital representations.`;
    }

    return {
      id: `conv-step-${index}`,
      stepNumber: index + 1,
      title: rawStep.description,
      inputs,
      operation: rawStep.operation,
      intermediate: rawStep.result,
      simpleExplanation,
      whyItWorks,
      connectionToNext,
      keyTakeaway,
      result: rawStep.result,
      substeps: rawStep.substeps,
      rawContextForAi: `Number Conversion (Base ${sBase} to Base ${tBase}) - Step ${index + 1}: ${rawStep.description}. Operation: ${rawStep.operation || 'none'}. Result: ${rawStep.result}. Details: ${rawStep.substeps?.join('; ') || 'none'}.`,
    };
  });
}

/**
 * Generates rich UnifiedTraceStep items for Binary Arithmetic (+, -, *, /)
 */
export function buildArithmeticTraceSteps(
  resultData: {
    operation: '+' | '-' | '*' | '/';
    operand1: string;
    operand2: string;
    result: string;
    traceSteps: Array<{
      id: string;
      column: number;
      description: string;
      topBit?: string;
      bottomBit?: string;
      carryIn?: string;
      carryOut?: string;
      resultBit?: string;
      partialProduct?: string;
      shift?: number;
      currentTotal?: string;
      dividend?: string;
      divisor?: string;
      quotientBit?: string;
      remainder?: string;
    }>;
  }
): UnifiedTraceStep[] {
  if (!resultData || !resultData.traceSteps || resultData.traceSteps.length === 0) return [];

  const { operation, operand1, operand2, traceSteps } = resultData;
  const opName = operation === '+' ? 'Addition' : operation === '-' ? 'Subtraction' : operation === '*' ? 'Multiplication' : 'Division';

  return traceSteps.map((step, idx) => {
    let inputs: StepInputItem[] = [];
    let opFormula = '';
    let simpleExplanation = '';
    let whyItWorks = '';
    let connectionToNext = '';
    let keyTakeaway = '';

    if (operation === '+') {
      const top = step.topBit ?? '0';
      const bot = step.bottomBit ?? '0';
      const cIn = step.carryIn ?? '0';
      const cOut = step.carryOut ?? '0';
      const res = step.resultBit ?? '0';

      const isFinalCarry = step.description.toLowerCase().includes('final carry');

      if (isFinalCarry) {
        inputs = [
          { label: 'Final Carry Out', value: cOut, color: 'emerald' },
        ];
        opFormula = `Carry Out ${cOut} → Most Significant Bit (MSB)`;
        simpleExplanation = `The arithmetic produced a leftover carry bit from the highest column. This carry bit shifts to the front as the brand-new most significant bit (MSB).`;
        whyItWorks = `In binary addition, when the sum of the highest-order bits equals or exceeds 2 (the radix), the overflow carry out represents 2^N, expanding the total bit length by one bit.`;
        connectionToNext = `The full sum is now assembled and complete.`;
        keyTakeaway = `A final carry out of 1 increases the bit-width of the sum by 1 compared to the operands.`;
      } else {
        inputs = [
          { label: `Col ${step.column} Top Bit`, value: top, color: 'blue' },
          { label: `Col ${step.column} Bottom Bit`, value: bot, color: 'purple' },
          { label: 'Carry In', value: cIn, color: 'cyan' },
        ];
        opFormula = `Sum = ${top} + ${bot} + ${cIn} (Carry In) = ${Number(top) + Number(bot) + Number(cIn)}`;
        const totalSum = Number(top) + Number(bot) + Number(cIn);

        simpleExplanation = `Adding the two column bits (${top} and ${bot}) plus incoming carry (${cIn}) yields a total sum of ${totalSum}. Because binary is base 2, the result bit is ${totalSum % 2} and the carry out is ${Math.floor(totalSum / 2)}.`;
        whyItWorks = totalSum === 0
          ? `0 + 0 + 0 = 0. There is no quantity, so result is 0 and no carry is generated.`
          : totalSum === 1
          ? `The sum is 1, which fits cleanly in a single binary digit (base 2). Result bit is 1, Carry Out is 0.`
          : totalSum === 2
          ? `The sum is 2 (binary 10₂). The digit 0 stays in this column (2 % 2 = 0), and a carry of 1 (2 ÷ 2 = 1) is propagated to the next higher power of 2.`
          : `The sum is 3 (binary 11₂). The digit 1 stays in this column (3 % 2 = 1), and a carry of 1 is passed to the next column.`;

        connectionToNext = idx < traceSteps.length - 1
          ? `Carry Out (${cOut}) will now be injected as the Carry In for Column ${step.column + 1}.`
          : `This was the highest column calculation.`;
        keyTakeaway = `Binary addition follows: 0+0=0, 1+0=1, 1+1=0 (carry 1), 1+1+1=1 (carry 1).`;
      }
    } else if (operation === '-') {
      const top = step.topBit ?? '0';
      const bot = step.bottomBit ?? '0';
      const borrowIn = step.carryIn ?? '0';
      const borrowOut = step.carryOut ?? '0';
      const res = step.resultBit ?? '0';

      inputs = [
        { label: `Col ${step.column} Minuend`, value: top, color: 'blue' },
        { label: `Col ${step.column} Subtrahend`, value: bot, color: 'purple' },
        { label: 'Borrow In', value: borrowIn, color: 'amber' },
      ];
      opFormula = `Col ${step.column}: (${top} - ${borrowIn} borrow) - ${bot} = Result ${res}, Borrow Out ${borrowOut}`;
      simpleExplanation = `We subtract the subtrahend bit (${bot}) and any previous borrow (${borrowIn}) from the top minuend bit (${top}). ${borrowOut === '1' ? 'Because the top bit was smaller than the subtraction demand, a borrow of 1 was pulled from the column to the left.' : 'The minuend was large enough, so no borrow was required.'}`;
      whyItWorks = borrowOut === '1'
        ? `Borrowing 1 from the next column brings over a value of 2 (since each column is worth twice as much in base 2), making the top value (2 + ${top} - ${borrowIn}) large enough to subtract ${bot}.`
        : `The available top bit minus borrow was greater than or equal to the subtrahend, leaving an exact positive difference of ${res}.`;
      connectionToNext = idx < traceSteps.length - 1
        ? `Borrow Out (${borrowOut}) is transferred to the left as Borrow In for Column ${step.column + 1}.`
        : `Subtraction is complete across all bit columns.`;
      keyTakeaway = `Borrowing in binary borrows 2 from the next column to the left, exactly analogous to borrowing 10 in decimal.`;
    } else if (operation === '*') {
      const bit = step.bottomBit ?? '0';
      const shift = step.shift ?? 0;
      inputs = [
        { label: 'Multiplier Bit', value: bit, color: 'blue' },
        { label: 'Multiplicand', value: operand1, color: 'purple' },
        { label: 'Left Shift', value: `${shift} positions`, color: 'cyan' },
      ];
      opFormula = `Partial Product = ${operand1} × ${bit} = ${step.partialProduct || '0'} (shifted << ${shift})`;
      simpleExplanation = bit === '1'
        ? `The multiplier bit is 1, so the entire multiplicand (${operand1}) is copied down as the partial product and shifted left by ${shift} positions.`
        : `The multiplier bit is 0, so the partial product is all zeros (${'0'.repeat(operand1.length)}), shifted left by ${shift} positions.`;
      whyItWorks = `Binary multiplication consists entirely of copying (multiplying by 1) or zeroing (multiplying by 0), followed by positional power shifts (multiplying by 2^shift).`;
      connectionToNext = idx < traceSteps.length - 1
        ? `We shift to the next multiplier bit to compute the next partial product.`
        : `All partial products are summed together using binary addition to yield the final product.`;
      keyTakeaway = `Binary multiplication is simpler than decimal because each partial product is either the original number or zero.`;
    } else {
      // Division
      inputs = [
        { label: 'Current Dividend Segment', value: step.dividend || operand1, color: 'blue' },
        { label: 'Divisor', value: step.divisor || operand2, color: 'purple' },
        { label: 'Quotient Bit', value: step.quotientBit || '0', color: 'emerald' },
      ];
      opFormula = step.description;
      simpleExplanation = step.quotientBit === '1'
        ? `The divisor (${step.divisor || operand2}) is smaller than or equal to the current working segment of the dividend, so it fits 1 time. We record quotient bit 1 and subtract the divisor.`
        : `The divisor does not fit into the current dividend segment, so quotient bit is 0. We bring down the next bit of the dividend.`;
      whyItWorks = `Long division in binary tests whether the divisor fits into the current dividend prefix. Because the only possible quotient digits are 0 and 1, division reduces to comparison and subtraction.`;
      connectionToNext = idx < traceSteps.length - 1
        ? `Bring down the next bit from the dividend to form the new dividend segment.`
        : `All dividend bits have been processed. The remaining value is the remainder: ${step.remainder || '0'}.`;
      keyTakeaway = `Binary long division only ever tests whether divisor <= dividend segment, producing either quotient bit 1 or 0.`;
    }

    return {
      id: step.id || `arith-step-${idx}`,
      stepNumber: idx + 1,
      title: `Step ${idx + 1}: ${step.description}`,
      inputs,
      operation: opFormula,
      intermediate: step.currentTotal || step.remainder || step.resultBit,
      simpleExplanation,
      whyItWorks,
      connectionToNext,
      keyTakeaway,
      result: step.resultBit !== undefined
        ? `Result Bit: ${step.resultBit}${step.carryOut ? `, Carry Out: ${step.carryOut}` : ''}`
        : step.partialProduct !== undefined
        ? `Partial Product: ${step.partialProduct}`
        : step.quotientBit !== undefined
        ? `Quotient Bit: ${step.quotientBit}${step.remainder ? `, Remainder: ${step.remainder}` : ''}`
        : step.description,
      rawContextForAi: `Binary ${opName} (${operand1} ${operation} ${operand2}) - Step ${idx + 1} of ${traceSteps.length}. ${step.description}. Inputs: ${inputs.map(i => `${i.label}=${i.value}`).join(', ')}. Formula: ${opFormula}. Result: ${resultData.result}.`,
    };
  });
}

/**
 * Generates rich UnifiedTraceStep items for 1's and 2's Complements
 */
export function buildComplementTraceSteps(
  resultData: {
    originalValue: string;
    onesComplement: string;
    twosComplement: string;
    cascadeSteps?: Array<{
      column?: number;
      description: string;
      topBit?: string;
      bottomBit?: string;
      carryIn?: string;
      carryOut?: string;
      resultBit?: string;
    }>;
  }
): UnifiedTraceStep[] {
  if (!resultData) return [];

  const { originalValue, onesComplement, twosComplement, cascadeSteps } = resultData;
  const steps: UnifiedTraceStep[] = [];

  // Step 1: 1's Complement
  const bitFlips = originalValue.split('').map((b, i) => `${b}→${onesComplement[i]}`).join(', ');
  steps.push({
    id: 'comp-step-1',
    stepNumber: 1,
    title: "Step 1: Compute 1's Complement (Bit Inversion)",
    inputs: [
      { label: 'Original Binary', value: originalValue, color: 'blue' },
      { label: 'Bit Width', value: `${originalValue.length} bits`, color: 'purple' },
    ],
    operation: `NOT(${originalValue}) = Invert every bit (0 ↔ 1)`,
    intermediate: `Bit-by-bit inversion: ${bitFlips}`,
    simpleExplanation: `To find the 1's complement, we take each individual bit of the binary string and flip it to its opposite: every 0 becomes 1, and every 1 becomes 0.`,
    whyItWorks: `In digital electronics, inverting every bit is equivalent to subtracting the number from (2^N - 1), which is a sequence of all 1s. This is achieved instantly in hardware with NOT gates (inverters).`,
    connectionToNext: `Now that we have the 1's complement (${onesComplement}), the next step is to add 1 to it to derive the true 2's complement.`,
    keyTakeaway: `1's complement is pure bitwise inversion (NOT). It is the intermediate stage before adding 1 for 2's complement.`,
    result: `1's Complement = ${onesComplement}`,
    substeps: originalValue.split('').map((b, i) => `Position ${originalValue.length - 1 - i}: Original bit '${b}' inverted to '${onesComplement[i]}'`),
    rawContextForAi: `1's Complement calculation of ${originalValue}. Invert all bits: ${bitFlips}. Result: ${onesComplement}.`,
  });

  // Step 2: 2's Complement (+1 addition cascade)
  const cascadeSubsteps = cascadeSteps && cascadeSteps.length > 0
    ? cascadeSteps.map((s, idx) => `Col ${idx}: ${s.description}`)
    : [`Add 1 to least significant bit (LSB) of ${onesComplement}`, `Propagate carries across bits to produce ${twosComplement}`];

  steps.push({
    id: 'comp-step-2',
    stepNumber: 2,
    title: "Step 2: Add 1 to get 2's Complement (Carry Cascade)",
    inputs: [
      { label: "1's Complement", value: onesComplement, color: 'blue' },
      { label: 'Constant to Add', value: '+1 (at LSB)', color: 'emerald' },
    ],
    operation: `${onesComplement} + 00...01 = ${twosComplement}`,
    intermediate: `Cascade resolution: ${twosComplement}`,
    simpleExplanation: `We add 1 to the least significant bit (LSB) of the 1's complement (${onesComplement}). If adding 1 creates a carry (1 + 1 = 0 carry 1), the carry ripples leftwards until absorbed by a 0 bit.`,
    whyItWorks: `2's complement represents negative numbers in digital computers because (1's complement + 1) mathematically equals (2^N - X). This eliminates the problem of dual zeros (+0 and -0) and allows standard addition circuitry to perform subtraction naturally!`,
    connectionToNext: `The 2's complement (${twosComplement}) is complete. In signed representation, the leftmost bit (MSB) '${twosComplement[0]}' signifies ${twosComplement[0] === '1' ? 'a negative value' : 'a non-negative value'}.`,
    keyTakeaway: `2's Complement = (1's Complement) + 1. It is the universal standard for representing signed integers in computer hardware.`,
    result: `2's Complement = ${twosComplement}`,
    substeps: cascadeSubsteps,
    rawContextForAi: `2's Complement calculation of ${originalValue}. 1's complement ${onesComplement} + 1 = ${twosComplement}. Carry cascade steps: ${cascadeSubsteps.join('; ')}.`,
  });

  return steps;
}

