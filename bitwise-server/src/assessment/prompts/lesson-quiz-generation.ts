/**
 * Lesson-Specific Quiz Generation Prompt
 *
 * This prompt generates a focused 10-question quiz for a single lesson.
 * Each topic gets questions with difficulty matching the user's mastery.
 */

export interface LessonQuizContext {
  lessonId: number;
  lessonTitle: string;
  topics: Array<{
    topicId: number;
    topicTitle: string;
    mastery: number; // 0.0 to 1.0
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number; // 3 or 4 (weakest gets bonus)
    contentText: string;
    tags: string[];
  }>;
  totalQuestions: number; // Always 10
}

/**
 * Determine difficulty based on mastery level
 */
export function getDifficultyFromMastery(
  mastery: number,
): 'easy' | 'medium' | 'hard' {
  if (mastery < 0.4) return 'easy';
  if (mastery < 0.7) return 'medium';
  return 'hard';
}

/**
 * Get lesson-specific visual and question type guidelines
 */
function getLessonGuidelines(lessonId: number): string {
  const guidelines: Record<number, string> = {
    1: `**LESSON 1: Introduction to Number Systems**
- Topics in this lesson: Binary (Base-2), Decimal (Base-10), Octal (Base-8), Hexadecimal (Base-16)
- ALLOWED SCOPE (ONLY TEST THESE):
  * Radix/base definitions and how many unique symbols/digits exist in each base (base 2 has 2: {0,1}; base 8 has 8: {0-7}; base 10 has 10: {0-9}; base 16 has 16: {0-9, A-F}).
  * Identifying invalid digits for a base (e.g., digit '8' is illegal in octal; 'G' is illegal in hex).
  * Positional values and weights: powers of the base (e.g., in binary: 2^0, 2^1, 2^2, 2^3; in octal: 8^0, 8^1, 8^2; in hex: 16^0, 16^1; in decimal: 10^0, 10^1).
  * Finding the positional value or weight of a specific digit in a number (e.g., "In the octal number 357_8, what is the weight/place value of the digit '5'? Answer: 5 × 8^1 = 40").
  * Counting in binary, powers of 2 size definitions (nibble = 4 bits, byte = 8 bits).
  * Determining the largest single digit or maximum value representable with n digits in a base ((base^n) - 1).
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT ask multi-step manual base conversions (e.g., repeated division by 2 or 16, converting 237_10 to binary/hex) — that belongs exclusively to Lesson 3.
  * DO NOT test binary arithmetic (addition, subtraction, multiplication, division) — that is Lesson 4.
  * DO NOT test 1's or 2's complements — that is Lesson 5.
  * DO NOT test signed vs unsigned representation or MSB sign bits — that is Lesson 6.
  * DO NOT test BCD or ASCII encoding — that is Lesson 7.
  * DO NOT test logic gates, truth tables, or Boolean algebra — that is Lessons 8-11.`,

    2: `**LESSON 2: Types of Number Systems**
- Topics in this lesson: Binary ↔ Decimal relationship, Binary ↔ Hex relationship, Digit Groupings
- ALLOWED SCOPE (ONLY TEST THESE):
  * The fundamental relationships between number systems (why base 2 is natural for computers, base 10 for humans, base 16/8 as human-readable binary shorthands).
  * The 4-bit grouping relationship between binary and hexadecimal (16 = 2^4, so each hex digit corresponds to exactly 4 binary bits / 1 nibble).
  * The 3-bit grouping relationship between binary and octal (8 = 2^3, so each octal digit corresponds to 3 bits, e.g., Unix file permissions chmod 755).
  * Digit groupings: definitions and bit widths of Bit (1 bit), Nibble (4 bits), Byte (8 bits), Word (16 bits), Double Word (32 bits), Quad Word (64 bits), and their unsigned ranges (e.g., nibble: 0-15, byte: 0-255).
  * Quick mental shortcuts based on relationships: e.g., LSB = 1 means odd, LSB = 0 means even; 1 byte = 2 hex digits; 32-bit address = 8 hex digits.
  * Direct inspection of 4-bit grouping (e.g., grouping 1101 0110_2 into hex digits D6_16).
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test step-by-step manual base conversion algorithms (like repeated division by 2 or continuous multiplication for fractions) — that is Lesson 3.
  * DO NOT test binary arithmetic (addition, subtraction, multiplication, division) — that is Lesson 4.
  * DO NOT test 1's or 2's complements — that is Lesson 5.
  * DO NOT test signed representation ranges (-128 to +127) or sign bits — that is Lesson 6.
  * DO NOT test BCD or ASCII encoding — that is Lesson 7.
  * DO NOT test logic gates, truth tables, or Boolean algebra — that is Lessons 8-11.`,

    3: `**LESSON 3: Conversion of Number Systems**
- Topics in this lesson: Decimal to Binary, Binary to Decimal, Hex Conversion (and Octal)
- ALLOWED SCOPE (ONLY TEST THESE):
  * Manual conversion algorithms from decimal to binary (repeated division by 2 recording remainders, or sum-of-powers-of-2).
  * Manual conversion algorithms from binary to decimal (expanding positional powers 2^n and summing).
  * Conversion between decimal and hexadecimal (repeated division by 16 or sum-of-powers-of-16).
  * Multi-step conversions between number systems (e.g., decimal → hex → binary, or octal ↔ binary ↔ hex).
  * Conversion steps must be clearly shown in solutionSteps.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test binary arithmetic (addition, subtraction, multiplication, division) — that is Lesson 4.
  * DO NOT test 1's or 2's complements — that is Lesson 5.
  * DO NOT test signed vs unsigned representation — that is Lesson 6.
  * DO NOT test BCD or ASCII — that is Lesson 7.
  * DO NOT test logic gates or Boolean algebra — that is Lessons 8-11.`,

    4: `**LESSON 4: Binary Arithmetic**
- Topics in this lesson: Binary Addition, Subtraction, Multiplication, Division
- ALLOWED SCOPE (ONLY TEST THESE):
  * Binary addition column-by-column with carry bits (0+0=0, 0+1=1, 1+1=10 [0 carry 1], 1+1+1=11 [1 carry 1]).
  * Binary subtraction column-by-column with borrow mechanics (0-0=0, 1-0=1, 1-1=0, 0-1=1 with borrow from next higher bit).
  * Binary multiplication using shift-and-add partial products.
  * Binary long division using quotient and remainder.
  * Arithmetic operations performed directly on binary numbers.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test 2's complement subtraction (A - B = A + ~B + 1) — that belongs to Lesson 5. Keep Lesson 4 strictly to direct binary arithmetic with carries and borrows.
  * DO NOT test signed vs unsigned overflow or negative number representation — that is Lesson 6.
  * DO NOT test BCD or ASCII — that is Lesson 7.
  * DO NOT test logic gates or Boolean algebra — that is Lessons 8-11.`,

    5: `**LESSON 5: Complements**
- Topics in this lesson: 1's Complement, 2's Complement, Bit Inversion
- ALLOWED SCOPE (ONLY TEST THESE):
  * Bit inversion (NOT operation on each bit: 0→1, 1→0) to find 1's complement.
  * Calculating 2's complement of an n-bit binary number (invert all bits and add 1; or shortcut: copy bits from right up to and including first '1', then invert remaining bits).
  * Cascading carries when adding 1 during 2's complement derivation (e.g., 1111 → invert 0000 → add 1 = 0001).
  * Using 2's complement to perform subtraction: A - B = A + (2's complement of B), discarding end carry if positive.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test signed vs unsigned range formulas (e.g., -2^(n-1) to 2^(n-1)-1) or sign bit interpretation — that is Lesson 6.
  * DO NOT test base conversions (decimal to hex, etc.) — that is Lesson 3.
  * DO NOT test BCD or ASCII — that is Lesson 7.
  * DO NOT test logic gates or Boolean algebra — that is Lessons 8-11.`,

    6: `**LESSON 6: Signed and Unsigned Numbers**
- Topics in this lesson: MSB (Most Significant Bit), Signed Representation, Unsigned Representation
- ALLOWED SCOPE (ONLY TEST THESE):
  * Role of the Most Significant Bit (MSB): in unsigned it has positional weight 2^(n-1); in signed representation it acts as the sign bit (0 = positive, 1 = negative).
  * Range calculations for n-bit numbers: unsigned range [0 to 2^n - 1] vs signed 2's complement range [-2^(n-1) to 2^(n-1) - 1].
  * Comparing representations: Sign-Magnitude, 1's Complement (two zeros: +0 and -0), and 2's Complement (single zero).
  * Interpreting the exact same bit pattern (e.g., 11111111) as unsigned (255) vs signed 2's complement (-1).
  * Determining whether an arithmetic result causes signed overflow.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test binary multiplication or long division — that is Lesson 4.
  * DO NOT test BCD or ASCII — that is Lesson 7.
  * DO NOT test logic gates or Boolean algebra — that is Lessons 8-11.`,

    7: `**LESSON 7: Binary Codes (BCD & ASCII)**
- Topics in this lesson: BCD Encoding, ASCII Conversion, Character-to-Binary Translator
- ALLOWED SCOPE (ONLY TEST THESE):
  * Binary Coded Decimal (BCD 8421): encoding each decimal digit (0-9) individually as a 4-bit binary group (e.g., decimal 95 → 1001 0101_BCD).
  * Identifying valid vs invalid BCD codes: values 1010 to 1111 (10 to 15 decimal) are invalid in BCD.
  * Comparing BCD with pure binary (BCD requires more bits but is easier to interface with decimal displays).
  * ASCII character encoding: standard 7-bit/8-bit ASCII codes for characters (e.g., 'A' = 65 = 01000001_2, 'a' = 97 = 01100001_2, '0' = 48 = 00110000_2, uppercase/lowercase bit difference at bit 5).
  * Character-to-binary translation: encoding/decoding short text strings using ASCII.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test binary arithmetic (addition, subtraction, multiplication, division) — that is Lesson 4.
  * DO NOT test complements — that is Lesson 5.
  * DO NOT test signed vs unsigned representation — that is Lesson 6.
  * DO NOT test logic gates or Boolean algebra — that is Lessons 8-11.`,

    8: `**LESSON 8: Introduction to Boolean Algebra**
- Topics in this lesson: What is Boolean Algebra?, Boolean Values, Applications
- ALLOWED SCOPE (ONLY TEST THESE):
  * Fundamental concepts and history of Boolean algebra (George Boole, Claude Shannon mapping to telephone switching circuits).
  * Boolean values: binary states (0/1, false/true, LOW/HIGH, open/closed switch).
  * Conceptual basic operations: AND (conjunction / logical multiplication ·), OR (disjunction / logical addition +), NOT (negation / inversion ').
  * Evaluating simple Boolean algebraic expressions for specific variable assignments (e.g., "Given A=1, B=0, evaluate Y = A · B + A'").
  * Real-world applications of Boolean logic in computer switching, digital design, and programming conditions.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT include schematic circuit diagrams or multi-gate circuits — that is Lesson 9.
  * DO NOT ask truth table construction or minterm derivation from tables — that is Lesson 10.
  * DO NOT ask Karnaugh maps or minimization laws (De Morgan's, Absorption) — that is Lesson 11.
  * DO NOT ask number systems, conversions, or binary arithmetic — that is Lessons 1-7.`,

    9: `**LESSON 9: Logic Gates**
- Topics in this lesson: AND, OR, NOT; NAND, NOR; XOR, XNOR
- ALLOWED SCOPE (ONLY TEST THESE):
  * Gate operation, logic symbols, and behavior for: NOT, AND, OR, NAND, NOR, XOR, XNOR.
  * Universal gates: why NAND and NOR are universal gates (can implement NOT, AND, OR).
  * Exclusive gates: XOR (odd parity / inequality detector: output 1 when inputs differ) and XNOR (equality detector: output 1 when inputs are equal).
  * Circuit diagrams: tracing signals through 1-gate, 2-gate, or 3-gate circuits to determine intermediate and final outputs.
  * Visual requirement: 80-90% circuits and truth tables for gate behavior.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test Karnaugh maps or algebraic minimization laws — that is Lesson 11.
  * DO NOT test number systems, conversions, or arithmetic — that is Lessons 1-7.`,

    10: `**LESSON 10: Truth Tables**
- Topics in this lesson: Constructing Truth Tables, Reading Truth Tables, Truth Tables for Gates
- ALLOWED SCOPE (ONLY TEST THESE):
  * Reading and analyzing truth tables: determining the output row-by-row for 2-variable and 3-variable functions.
  * Deriving the Boolean expression from a truth table by identifying minterms (rows where Y=1) in Sum of Products (SOP) form.
  * Truth tables for combination of gates.
  * CRITICAL: Truth tables must ALWAYS be provided in the question for the student to read and analyze (multiple choice). Do NOT ask students to create an empty table.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test Karnaugh maps — that is Lesson 11.
  * DO NOT test number systems, conversions, or arithmetic — that is Lessons 1-7.`,

    11: `**LESSON 11: Simplification & Karnaugh Maps**
- Topics in this lesson: Boolean Laws, Karnaugh Maps, Practical Examples
- ALLOWED SCOPE (ONLY TEST THESE):
  * Boolean laws: Identity (A·1=A, A+0=A), Null/Dominance (A·0=0, A+1=1), Idempotent (A·A=A, A+A=A), Complement/Inverse (A·A'=0, A+A'=1), Involution (A''=A), Commutative, Associative, Distributive, De Morgan's Laws ((A·B)' = A' + B', (A+B)' = A'·B'), Absorption (A + A·B = A, A·(A+B) = A, A + A'·B = A + B).
  * Karnaugh Maps (K-maps): Gray code labeling (00, 01, 11, 10), 2-variable (2x2), 3-variable (2x4), and 4-variable (4x4) K-maps.
  * Grouping rules: groups must be powers of 2 (1, 2, 4, 8, 16), rectangular, can wrap around edges, must find minimal Sum-of-Products (SOP) expressions.
- STRICT EXCLUSION ZONE (DO NOT TEST UNDER ANY CIRCUMSTANCES):
  * DO NOT test sequential logic, flip-flops, or latches.
  * DO NOT test number systems, conversions, or binary arithmetic — that is Lessons 1-7.`
  };

  return (
    guidelines[lessonId] ||
    `**Lesson ${lessonId}**
- Focus: Core concepts strictly relevant to this lesson
- STRICT EXCLUSION: Do not test topics from any other lesson.`
  );
}

/**
 * Get lesson-specific verification rules to prevent hallucinations or cross-lesson bleed
 */
function getVerificationGuidelines(lessonId: number): string {
  switch (lessonId) {
    case 1:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify radix/base limits: Base 2 (digits 0, 1), Base 8 (digits 0-7), Base 10 (digits 0-9), Base 16 (digits 0-9, A-F).
- Verify powers and positional values: 2^0=1, 2^1=2, 2^2=4, 2^3=8, 2^4=16; 8^0=1, 8^1=8, 8^2=64; 16^0=1, 16^1=16, 16^2=256.
- Double-check digit place values (e.g., place value = digit * base^position).
- Verify strictly that NO questions test topics from other lessons (no conversions, no arithmetic, no complements, no logic gates).`;

    case 2:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify groupings: 1 hex digit = 4 bits (nibble); 1 octal digit = 3 bits; 1 byte = 8 bits = 2 hex digits; 1 word = 16 bits = 4 hex digits.
- Verify range values: 4-bit nibble = 0 to 15 (2^4 - 1); 8-bit byte = 0 to 255 (2^8 - 1).
- Verify LSB odd/even property and powers of 2 mapping.
- Verify strictly that NO questions test topics from other lessons (no conversions, no arithmetic, no complements, no logic gates).`;

    case 3:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Manually calculate each conversion step (division-remainder, expansion of powers) to ensure exact correctness.
- Double-check intermediate quotients and remainders.
- Verify strictly that NO questions test topics from other lessons (no arithmetic, no complements, no logic gates).`;

    case 4:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify column-by-column binary addition carries and subtraction borrows manually.
- Verify binary multiplication shift-and-add results.
- DO NOT test complements here — that is Lesson 5. Keep arithmetic direct!`;

    case 5:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify 1's complement: every 0 becomes 1 and every 1 becomes 0.
- Verify 2's complement: invert all bits and add 1 (accounting for any carry ripple).
- Verify 2's complement subtraction: A - B = A + (2's comp of B).`;

    case 6:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify MSB (leftmost bit) role: 0 = positive, 1 = negative in signed numbers.
- Verify range formulas: Unsigned [0, 2^n - 1], Signed 2's complement [-2^(n-1), 2^(n-1) - 1].
- Double check signed vs unsigned interpretation of the same binary string.`;

    case 7:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY FOR LESSON 7)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify BCD 8421: each decimal digit is encoded independently in 4 bits. Values 1010-1111 are illegal.
- Verify ASCII codes: 'A' = 65, 'B' = 66, 'a' = 97, '0' = 48.
- Verify character to binary mappings.`;

    case 8:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ LOGIC VERIFICATION (MANDATORY FOR LESSON 8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Verify Boolean value substitutions (e.g. A=1, B=0 into expression).
- Verify basic operations: 1 AND 0 = 0, 1 OR 0 = 1, NOT 1 = 0.
- DO NOT include multi-gate circuit diagrams (Lesson 9) or K-maps (Lesson 11).`;

    case 9:
    case 10:
    case 11:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ LOGIC & CIRCUIT VERIFICATION (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- TRUTH TABLE: Check ALL rows. NAND: 0,0→1; 0,1→1; 1,0→1; 1,1→0.
- CIRCUIT: Trace signal from inputs through each gate.
- K-MAP: Verify groupings produce the correct minimal expression.
- VARIABLE COUNT MUST MATCH: The number of variables in expression MUST match truth table columns.`;

    default:
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL & LOGICAL VERIFICATION (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST verify answers in "_reasoning" field:
- Check all calculations and reasoning manually before outputting.
- Ensure questions strictly align with the topics of Lesson ${lessonId}.`;
  }
}

/**
 * Build the lesson-specific quiz prompt
 */
export function buildLessonQuizPrompt(context: LessonQuizContext): string {
  const topicInstructions = context.topics
    .map((topic) => {
      const masteryPercent = Math.round(topic.mastery * 100);
      const isWeakest = topic.questionCount > 3;

      return `
📚 **${topic.topicTitle}** (Topic ID: ${topic.topicId})
   - User Mastery: ${masteryPercent}%
   - Difficulty: **${topic.difficulty.toUpperCase()}**
   - Questions: **${topic.questionCount}** ${isWeakest ? '🔥 (WEAKEST - BONUS QUESTION)' : ''}
   - Tags to use: ${topic.tags.join(', ')}
   - Content Summary: ${topic.contentText.substring(0, 300)}...`;
    })
    .join('\n');
  const isLogicVisualLesson = [9, 10, 11].includes(context.lessonId);

  const difficultyGuidelines = isLogicVisualLesson
    ? `
📊 DIFFICULTY GUIDELINES:

**EASY Questions** (for mastery < 40%):
- Single-step problems
- Direct application of concepts
- Clear, unambiguous scenarios
- 2-variable expressions (A, B) → truth tables have 4 rows
- Confidence-building questions
- **solutionSteps**: 2-3 clear, simple steps showing the basic process

**MEDIUM Questions** (for mastery 40-69%):
- Multi-step reasoning required
- Application to new scenarios
- 3-variable expressions (A, B, C) → truth tables have 8 rows
- **The expression MUST use all 3 variables!** (e.g., Y = A'B + C, NOT Y = A' + B')
- Requires connecting concepts
- **solutionSteps**: 3-5 detailed steps showing intermediate calculations and reasoning

**HARD Questions** (for mastery ≥ 70%):
- Complex multi-step problems
- Synthesis of multiple concepts
- 3-4 variable expressions → truth tables have 8-16 rows
- **The expression MUST use all 3-4 variables!**
- Optimization and edge cases
- **solutionSteps**: 5-7 comprehensive steps with full mathematical derivations`
    : `
📊 DIFFICULTY GUIDELINES:

**EASY Questions** (for mastery < 40%):
- Single-step problems or conceptual understanding strictly within this lesson's topics
- Direct application of rules (e.g. valid digits, positional weights, or grouping definitions)
- Small values or straightforward identification
- **solutionSteps**: 2-3 simple steps showing the basic calculation

**MEDIUM Questions** (for mastery 40-69%):
- Multi-step reasoning or calculations within this lesson's scope
- Comparing or combining concepts from this lesson's topics
- Medium range values or intermediate steps
- **solutionSteps**: 3-5 detailed steps showing intermediate calculation stages

**HARD Questions** (for mastery ≥ 70%):
- Complex multi-step problems or deep analytical questions within this lesson's scope
- Comparing multiple representations or edge-case constraints
- **solutionSteps**: 5-7 comprehensive steps with detailed calculations and logic verified`;

  const visualFormatsSection = isLogicVisualLesson
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 VISUAL ELEMENT FORMATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TYPE 1: TRUTH TABLE** (for Lessons 9, 10)
{
  "type": "table",
  "table": {
    "headers": ["A", "B", "Y"],
    "rows": [["0","0","1"], ["0","1","1"], ["1","0","1"], ["1","1","0"]],
    "caption": "Analyze the logic function"
  }
}

**TYPE 2: CIRCUIT DIAGRAM** (for Lesson 9)
{
  "type": "circuit",
  "circuit": {
    "inputs": ["A", "B", "C"],  // List all input variables
    "gates": [
      {
        "id": "G1",
        "type": "NOT",           // Gate types: NOT, AND, OR, NAND, NOR, XOR, XNOR
        "inputs": ["A"],         // Input(s) - can be input variables or outputs from other gates
        "output": "A_NOT",       // Unique identifier for this gate's output
        "position": {"x": 1, "y": 1}  // Grid position for layout (x=column, y=row)
      },
      {
        "id": "G2",
        "type": "AND",
        "inputs": ["A_NOT", "B"],  // Uses output from G1 and input B
        "output": "G2_OUT",
        "position": {"x": 2, "y": 1}
      },
      {
        "id": "G3",
        "type": "OR",
        "inputs": ["G2_OUT", "C"],  // Uses output from G2 and input C
        "output": "Y",              // Final output
        "position": {"x": 3, "y": 1}
      }
    ],
    "finalOutput": "Y",           // Must match the output of the last gate
    "caption": "Analyze the circuit to determine the Boolean expression for Y"
  }
}

**CIRCUIT DIAGRAM RULES:**
- **Gate Order**: Gates MUST be listed in topological order (dependencies first)
- **Input References**: Each gate's "inputs" array references either:
  - Original input variables (A, B, C, etc.)
  - Output identifiers from previous gates (e.g., "A_NOT", "G2_OUT")
- **Output Naming**: Use descriptive names like "A_NOT" for NOT gates, "G2_OUT" for intermediate outputs
- **Position Grid**: x=column (left to right), y=row (top to bottom). Space gates appropriately
- **Final Output**: Must be the output of the last gate in the signal path
- **Complexity Levels:**
  - EASY: 1-2 gates, single path (e.g., NOT→AND or just AND)
  - MEDIUM: 2-3 gates, may have parallel paths converging
  - HARD: 3-5 gates, multiple levels, parallel paths, requires careful tracing

**TYPE 3: KARNAUGH MAP** (for Lesson 11)
{
  "type": "karnaughMap",
  "karnaughMap": {
    "headers": ["B=0", "B=1"],
    "sideLabels": ["A=0", "A=1"],
    "rows": [["1", "0"], ["1", "1"]],
    "caption": "Find the minimal SOP expression"
  }
}

**TYPE 4: TEXT-ONLY** (for Lessons 8, 10, 11 algebraic)
Just use a string: "Simplify the expression: A + A·B"
`
    : `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 VISUAL ELEMENT FORMATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TEXT-ONLY (MANDATORY for Lesson ${context.lessonId})**
For number systems and arithmetic, do not use circuits, truth tables, or Karnaugh maps. Instead, the "stem" of each question MUST be a pure string.
`;

  const outputFormatSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT (JSON ARRAY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY a valid JSON array. No markdown, no text before/after.

[
  {
    "lessonId": ${context.lessonId},
    "topicId": <topic_id_from_above>,
    "difficulty": "<easy|medium|hard matching topic>",
    "stem": ${isLogicVisualLesson ? '"<string OR visual object>"' : '"<pure string stem>"'},
    "questionType": "multiple-choice",
    "tags": ["<valid-tags-from-topic>"],
    "_reasoning": "Internal verification of the correct answer (not shown to user)",
    "solutionSteps": [
      "Step 1: State the problem or calculation to be performed.",
      "Step 2: Show the first calculation or analytical step.",
      "Step 3: Show intermediate calculation steps or comparisons.",
      "Step 4: Execute the final calculation stage.",
      "Final Step: Conclude with the final result matching the correct option."
    ],
    "options": [
      {
        "id": "opt_a", 
        "text": "First distinct option", 
        "isCorrect": false
      },
      {
        "id": "opt_b", 
        "text": "Second distinct option", 
        "isCorrect": false
      },
      {
        "id": "opt_c", 
        "text": "Third distinct option (Correct Answer)", 
        "isCorrect": true, 
        "rationale": "Clear explanation showing why this answer is correct."
      },
      {
        "id": "opt_d", 
        "text": "Fourth distinct option", 
        "isCorrect": false
      }
    ],
    "answerId": "opt_c"
  }
]
(NOTE: The correct option MUST vary across questions. Distribute correct answers across opt_a, opt_b, opt_c, and opt_d).
`;

  const criticalRequirementsSection = isLogicVisualLesson
    ? `
⚠️ **CRITICAL REQUIREMENTS FOR solutionSteps AND rationale:**

**For solutionSteps (Lessons 9, 10, 11 - PROBLEM SOLVING):**
- **LESSON 9 (Logic Gates)**: 
  - Step 1: Identify the gate types and inputs
  - Step 2: Trace signal through first gate with specific values
  - Step 3: Show intermediate outputs
  - Step 4: Trace through subsequent gates
  - Step 5: Derive final expression or output

- **LESSON 10 (Truth Tables)**:
  - Step 1: Examine the provided truth table and identify the pattern
  - Step 2: Look at rows where output Y = 1 (identify minterms)
  - Step 3: Write the expression for each minterm
  - Step 4: Combine minterms with OR operations to form Sum of Products (SOP)
  - Step 5: Simplify if possible using Boolean laws
  - Step 6: Verify by checking the expression against the table

- **LESSON 11 (Simplification & K-Maps)**:
  - Step 1: Write the original expression
  - Step 2: Identify groupings in K-map or applicable Boolean law
  - Step 3: Apply law/grouping (show explicitly: A + A'B = A + B by Absorption)
  - Step 4: Continue simplification with next law
  - Step 5: Verify by truth table or expansion

- **LESSON 8**: Can use simpler steps (2-3 steps) for conceptual questions`
    : `
⚠️ **CRITICAL REQUIREMENTS FOR solutionSteps AND rationale:**

**For solutionSteps:**
- Step 1: Clearly define the starting value/concept and goal within this lesson's topic
- Step 2: Perform the primary calculation or analytical step, showing intermediate values
- Step 3: Complete subsequent steps, showing all reasoning explicitly
- Final Step: Conclude with the final result and relate it directly to the correct answer choice
- ALWAYS write detailed, easy-to-follow explanations so students can learn from mistakes!`;

  const logicVerificationSection = getVerificationGuidelines(context.lessonId);

  const correctOptionRationaleDesc = `
**For rationale:**
- **Correct option**: 1-2 clear sentences explaining why this answer is correct and verified.
- **Incorrect options**: Optional 1 concise sentence noting the misconception, keeping responses fast and complete.`;

  return `
You are a distinguished University Professor of Digital Logic and Computer Systems. Your task is to generate a focused, high-quality **${context.totalQuestions}-question** assessment exclusively for a single lesson.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 STRICT LESSON EXCLUSIVITY MANDATE (HIGHEST PRIORITY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THIS ASSESSMENT IS EXCLUSIVELY FOR:
🎯 LESSON ${context.lessonId}: "${context.lessonTitle}"

You MUST generate questions that test ONLY the permitted concepts of Lesson ${context.lessonId} and its assigned topics:
${context.topics.map((t) => `  • Topic ${t.topicId}: "${t.topicTitle}" (${t.questionCount} questions, ${t.difficulty.toUpperCase()} difficulty)`).join('\n')}

DO NOT include, mention, or test ANY concepts, algorithms, operations, or formulas that belong to OTHER lessons!
Under NO circumstances may you bleed into other lessons. Strictly adhere to these boundaries:

${getLessonGuidelines(context.lessonId)}

🎓 TARGET COLLEGE-LEVEL DIFFICULTY ("College-Level Engineering/Computer Science" persona):
- "Easy": Accessible to a first-year university student. Requires understanding a single foundational concept and executing 1-2 basic steps strictly within this lesson's scope. Absolutely no trivia, no-brainers, or definitions that can be answered without conceptual application.
- "Medium": Requires combining 2 or more concepts or multi-step execution strictly within this lesson's scope.
- "Hard": Requires edge-case handling, complex optimization, or deep analytical troubleshooting strictly within this lesson's scope.

🛑 STRICT OPTION UNIQUENESS & INTEGRITY CONSTRAINTS:
- Each of the 4 choices generated must be completely distinct in both text and conceptual meaning. Under no circumstances may two options evaluate to or display the same value.
- Distractors (incorrect choices) must be derived from common student misconceptions or logical slips related to the question, not random filler data.
- The 'answerId' must point exclusively to the correct option that matches your 'solutionSteps'.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TOPIC-SPECIFIC REQUIREMENTS (MUST FOLLOW EXACTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topicInstructions}

${difficultyGuidelines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MANDATORY: GENERATE EXACTLY ${context.totalQuestions} QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ CRITICAL RULES:
1. **STRICT EXCLUSIVITY**: Questions must ONLY cover Lesson ${context.lessonId} ("${context.lessonTitle}"). Zero questions from other lessons.
2. **MATCH DIFFICULTY TO TOPIC**: Each question's difficulty MUST match the topic's assigned difficulty
3. **EXACT QUESTION COUNT**: Generate exactly ${context.topics.map((t) => t.questionCount).join(' + ')} = ${context.totalQuestions} questions
4. **CORRECT TOPIC IDs**: Each question must have the correct topicId from above (${context.topics.map((t) => t.topicId).join(', ')})
5. **NO MEMORIZATION**: Use "Calculate", "Analyze", "Determine", "Evaluate", "Identify" - NOT "Define" or "What is"
6. **ONE CORRECT ANSWER**: Exactly one option must be correct with clear mathematical/logical justification
7. **NO LATEX NOTATION**: Do NOT use LaTeX math syntax like $2^i$, $(101100)_2$, or $n$. Instead write plain text: 2^i, 101100 (base 2), n. All question text, options, explanations, rationales, and solutionSteps MUST use plain readable text only. Never wrap anything in dollar signs ($).
8. **RANDOMIZE CORRECT OPTION (A, B, C, D)**: The correct option MUST NOT always be B or A! Across the ${context.totalQuestions} questions, evenly distribute correct answers: roughly 2-3 questions with opt_a correct, 2-3 with opt_b, 2-3 with opt_c, and 2-3 with opt_d. Set answerId to match the correct option's id.

${visualFormatsSection}

${outputFormatSection}

${criticalRequirementsSection}

${correctOptionRationaleDesc}

${logicVerificationSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 GENERATE ${context.totalQuestions} QUESTIONS NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remember:
${context.topics.map((t) => `- ${t.topicTitle}: ${t.questionCount} ${t.difficulty.toUpperCase()} questions (Topic ID: ${t.topicId})`).join('\n')}
Total: ${context.totalQuestions} questions strictly exclusive to Lesson ${context.lessonId}: "${context.lessonTitle}" in valid JSON array format.
`;
}

/**
 * Build the fallback lesson-specific quiz prompt
 * This is a stripped down version of the prompt designed specifically for smaller,
 * lower-context models (like llama-3.1-8b-instant). It removes complex JSON properties
 * like reasoning, solutionSteps, and incorrect rationales.
 */
export function buildFallbackLessonQuizPrompt(
  context: LessonQuizContext,
): string {
  const topicInstructions = context.topics
    .map((topic) => {
      return `
📚 **${topic.topicTitle}** (Topic ID: ${topic.topicId})
   - Difficulty: **${topic.difficulty.toUpperCase()}**
   - Questions: **${topic.questionCount}**
   - Content Summary: ${topic.contentText.substring(0, 150)}...`;
    })
    .join('\n');

  const outputFormatSection = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT (JSON ARRAY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY a valid JSON array. No markdown, no text before/after.

[
  {
    "lessonId": ${context.lessonId},
    "topicId": <topic_id_from_above>,
    "difficulty": "<easy|medium|hard matching topic>",
    "stem": "<pure string stem>",
    "questionType": "multiple-choice",
    "tags": ["<valid-tags-from-topic>"],
    "options": [
      { "id": "opt_a", "text": "Option A", "isCorrect": false },
      { "id": "opt_b", "text": "Option B", "isCorrect": true, "rationale": "Briefly explain why this is CORRECT." },
      { "id": "opt_c", "text": "Option C", "isCorrect": false },
      { "id": "opt_d", "text": "Option D", "isCorrect": false }
    ],
    "answerId": "opt_b",
    "explanation": "Brief explanation of the correct answer."
  }
]
`;

  return `
You are a Digital Logic quiz generator. Generate a focused **${context.totalQuestions}-question** assessment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 STRICT LESSON EXCLUSIVITY MANDATE (HIGHEST PRIORITY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THIS ASSESSMENT IS EXCLUSIVELY FOR:
🎯 LESSON ${context.lessonId}: "${context.lessonTitle}"

You MUST generate questions that test ONLY the permitted concepts of Lesson ${context.lessonId} and its assigned topics:
${context.topics.map((t) => `  • Topic ${t.topicId}: "${t.topicTitle}" (${t.questionCount} questions, ${t.difficulty.toUpperCase()} difficulty)`).join('\n')}

DO NOT include or test ANY concepts, algorithms, operations, or formulas from OTHER lessons!

${getLessonGuidelines(context.lessonId)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TOPICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topicInstructions}

⚠️ CRITICAL RULES:
1. STRICT EXCLUSIVITY: Questions must ONLY cover Lesson ${context.lessonId} ("${context.lessonTitle}"). Zero questions from other lessons.
2. NO VISUAL FORMATS (no circuits, no truth tables). Stems must be TEXT ONLY.
3. Generate EXACTLY ${context.totalQuestions} questions. The returned JSON array MUST have length ${context.totalQuestions}.
4. Only the correct option should have a "rationale" string.
5. Return ONLY raw JSON array.
6. NO LATEX NOTATION: Do NOT use LaTeX like $2^i$ or $(101)_2$. Write plain text: 2^i, 101 (base 2).
7. RANDOMIZE CORRECT OPTION (A, B, C, D): Evenly balance correct answers among opt_a, opt_b, opt_c, and opt_d across the questions. Do NOT make opt_b or opt_a always correct.

${outputFormatSection}
`;
}
