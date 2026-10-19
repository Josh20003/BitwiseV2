import {
  parseBinaryAdditionStep,
  generateBinaryAdditionExplanation,
  AiService,
} from './ai.service';

describe('AI Binary Addition Explanation Feature', () => {
  let aiService: AiService;

  beforeEach(() => {
    aiService = new AiService();
  });

  describe('parseBinaryAdditionStep', () => {
    it('should correctly parse 0 + 0 + 0 case', () => {
      const step = 'Column 0: 0 + 0 + Carry In 0 = 0 -> Result Bit 0, Carry Out 0';
      const parsed = parseBinaryAdditionStep(step);
      expect(parsed).toEqual({
        column: '0',
        bit1: 0,
        bit2: 0,
        carryIn: 0,
        sum: 0,
        resultBit: 0,
        carryOut: 0,
        isFinalCarry: false,
      });
    });

    it('should correctly parse 0 + 1 + 0 case', () => {
      const step = 'Column 1: 0 + 1 + Carry In 0 = 1 -> Result Bit 1, Carry Out 0';
      const parsed = parseBinaryAdditionStep(step);
      expect(parsed).toEqual({
        column: '1',
        bit1: 0,
        bit2: 1,
        carryIn: 0,
        sum: 1,
        resultBit: 1,
        carryOut: 0,
        isFinalCarry: false,
      });
    });

    it('should correctly parse 1 + 1 + 0 case', () => {
      const step = 'Column 1: 1 + 1 + Carry In 0 = 2 -> Result Bit 0, Carry Out 1';
      const parsed = parseBinaryAdditionStep(step);
      expect(parsed).toEqual({
        column: '1',
        bit1: 1,
        bit2: 1,
        carryIn: 0,
        sum: 2,
        resultBit: 0,
        carryOut: 1,
        isFinalCarry: false,
      });
    });

    it('should correctly parse 1 + 1 + 1 case', () => {
      const step = 'Column 2: 1 + 1 + Carry In 1 = 3 -> Result Bit 1, Carry Out 1';
      const parsed = parseBinaryAdditionStep(step);
      expect(parsed).toEqual({
        column: '2',
        bit1: 1,
        bit2: 1,
        carryIn: 1,
        sum: 3,
        resultBit: 1,
        carryOut: 1,
        isFinalCarry: false,
      });
    });

    it('should correctly parse Final Carry Out step', () => {
      const step = 'Final Carry Out 1 becomes the new MSB.';
      const parsed = parseBinaryAdditionStep(step);
      expect(parsed).toEqual({
        bit1: 0,
        bit2: 0,
        carryIn: 1,
        sum: 1,
        resultBit: 1,
        carryOut: 0,
        isFinalCarry: true,
      });
    });
  });

  describe('generateBinaryAdditionExplanation for all cases', () => {
    it('Case 0 + 0 + 0: explains decimal total 0, result bit 0, carry out 0', () => {
      const parsed = parseBinaryAdditionStep(
        'Column 0: 0 + 0 + Carry In 0 = 0 -> Result Bit 0, Carry Out 0',
      )!;
      const explanation = generateBinaryAdditionExplanation(parsed);

      expect(explanation).toContain('0 + 0 + 0');
      expect(explanation).toContain('equals 0 in decimal');
      expect(explanation).toContain('Result Bit: We write 0 in the current column');
      expect(explanation).toContain('Carry Out: The carry out is 0');
      expect(explanation).toContain('Remember: In binary addition');
    });

    it('Case 0 + 1 + 0: explains decimal total 1, result bit 1, carry out 0', () => {
      const parsed = parseBinaryAdditionStep(
        'Column 0: 0 + 1 + Carry In 0 = 1 -> Result Bit 1, Carry Out 0',
      )!;
      const explanation = generateBinaryAdditionExplanation(parsed);

      expect(explanation).toContain('0 + 1 + 0');
      expect(explanation).toContain('equals 1 in decimal');
      expect(explanation).toContain('Result Bit: We write 1 in the current column');
      expect(explanation).toContain('Carry Out: The carry out is 0');
      expect(explanation).toContain('Remember: In binary addition');
    });

    it('Case 1 + 1 + 0: explains decimal total 2, binary 10, result bit 0, carry out 1', () => {
      const parsed = parseBinaryAdditionStep(
        'Column 1: 1 + 1 + Carry In 0 = 2 -> Result Bit 0, Carry Out 1',
      )!;
      const explanation = generateBinaryAdditionExplanation(parsed);

      expect(explanation).toContain('1 + 1 + 0');
      expect(explanation).toContain('equals 2 in decimal');
      expect(explanation).toContain('In binary, 2 is written as 10');
      expect(explanation).toContain(
        'Result Bit: We write 0 in the current column because it is the rightmost digit of the binary result, 10',
      );
      expect(explanation).toContain(
        'Carry Out: We carry 1 to the next column because it is the leftmost digit of 10',
      );
      expect(explanation).toContain('When the total is 2 or 3, we generate a carry');
    });

    it('Case 1 + 1 + 1: explains decimal total 3, binary 11, result bit 1, carry out 1', () => {
      const parsed = parseBinaryAdditionStep(
        'Column 2: 1 + 1 + Carry In 1 = 3 -> Result Bit 1, Carry Out 1',
      )!;
      const explanation = generateBinaryAdditionExplanation(parsed);

      expect(explanation).toContain('1 + 1 + 1');
      expect(explanation).toContain('equals 3 in decimal');
      expect(explanation).toContain('In binary, 3 is written as 11');
      expect(explanation).toContain(
        'Result Bit: We write 1 in the current column because it is the rightmost digit of the binary result, 11',
      );
      expect(explanation).toContain(
        'Carry Out: We carry 1 to the next column because it is the leftmost digit of 11',
      );
      expect(explanation).toContain('producing a result bit of 1 and a carry-out of 1');
    });
  });

  describe('Follow-up questions support', () => {
    const step2Data = parseBinaryAdditionStep(
      'Column 1: 1 + 1 + Carry In 0 = 2 -> Result Bit 0, Carry Out 1',
    )!;

    it('answers "Why is the carry 1?" with exact column calculation reasoning', () => {
      const answer = generateBinaryAdditionExplanation(step2Data, 'Why is the carry 1?');
      expect(answer).toContain('The carry is 1 because the sum of the bits in this column (1 + 1 + 0) equals 2 in decimal');
      expect(answer).toContain('10 in binary');
      expect(answer).toContain('carried over to the next column on the left');
    });

    it('answers "Why is the result bit 0?" with rightmost digit explanation', () => {
      const answer = generateBinaryAdditionExplanation(step2Data, 'Why is the result bit 0?');
      expect(answer).toContain('The result bit is 0 because the column total is 1 + 1 + 0 = 2 in decimal (10 in binary)');
      expect(answer).toContain('The rightmost digit of this binary value is 0');
    });

    it('answers "How does this carry affect the next column?" with carry-in propagation explanation', () => {
      const answer = generateBinaryAdditionExplanation(step2Data, 'How does this carry affect the next column?');
      expect(answer).toContain('The carry-out of 1 from this column becomes the carry-in for the next column to the left');
      expect(answer).toContain('this +1 carry will be added together with the next two input bits');
    });

    it('answers "Can you explain this calculation another way?" with decimal analogy', () => {
      const answer = generateBinaryAdditionExplanation(step2Data, 'Can you explain this calculation another way?');
      expect(answer).toContain('Think of binary addition just like normal decimal addition!');
      expect(answer).toContain('write 0 in this column and carry 1 to the next column');
    });
  });

  describe('AiService.getTutorResponse with fallback', () => {
    it('returns structured explanation when called via tutor fallback for binary addition', async () => {
      const step = 'Column 1: 1 + 1 + Carry In 0 = 2 -> Result Bit 0, Carry Out 1';
      // Mocking fallback behavior by calling directly with empty question
      const response = (aiService as any).getTutorFallback(step, '');
      expect(response).toContain('equals 2 in decimal');
      expect(response).toContain('Result Bit: We write 0 in the current column');
      expect(response).toContain('Carry Out: We carry 1 to the next column');
    });
  });
});
