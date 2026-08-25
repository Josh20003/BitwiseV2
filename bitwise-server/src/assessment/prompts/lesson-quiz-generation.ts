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
    mastery: number;           // 0.0 to 1.0
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;     // 3 or 4 (weakest gets bonus)
    contentText: string;
    tags: string[];
  }>;
  totalQuestions: number;      // Always 10
}

/**
 * Determine difficulty based on mastery level
 */
export function getDifficultyFromMastery(mastery: number): 'easy' | 'medium' | 'hard' {
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
- Focus: Base-2, base-8, base-10, base-16; positional values; digit representation
- Question Types: Text-based conceptual questions, positional value calculations
- Visual Requirement: 10-20% (mostly text-based)
- EASY: Identify the base/radix of a number, count digits in a base
- MEDIUM: Positional value of a digit, largest digit allowed in a base
- HARD: Compare values across bases, identify the number of symbols in a base
- DO NOT ask about converting between bases (that is Lesson 3)`,

    2: `**LESSON 2: Types of Number Systems**
- Focus: Relationships between binary, decimal, octal, hex; grouping patterns
- Question Types: Text questions about relationships and groupings
- Visual Requirement: 10-20%
- EASY: Identify which number systems are used in computing, 4-bit grouping = 1 hex digit
- MEDIUM: Binary-to-hex shortcut (group 4 bits), binary-to-octal (group 3 bits)
- HARD: Compare grouping schemes, identify patterns across systems
- DO NOT ask step-by-step conversion procedures`,

    3: `**LESSON 3: Conversion of Number Systems**
- Focus: Manual conversion between decimal, binary, hex, octal (division/remainder, expansion)
- Question Types: Step-by-step conversion calculations
- Visual Requirement: 10-20%
- EASY: Convert small decimal to binary (≤16) or binary to decimal
- MEDIUM: Convert decimal to hex/octal or hex to binary
- HARD: Multi-step conversions (decimal → hex → binary)
- Always show intermediate calculation steps in solutionSteps`,

    4: `**LESSON 4: Binary Arithmetic**
- Focus: Binary addition, subtraction, multiplication, division
- Question Types: Arithmetic calculation problems
- Visual Requirement: 10-20%
- EASY: Single-bit addition (with carry), 4-bit + 4-bit without overflow
- MEDIUM: 4-8 bit addition with carry chain, binary subtraction with borrow
- HARD: Multi-byte addition, binary multiplication (shift-and-add)
- Show binary arithmetic working column-by-column in solutionSteps`,

    5: `**LESSON 5: Complements**
- Focus: 1's complement (bit inversion), 2's complement (invert + 1), cascading carry
- Question Types: Complement calculation problems
- Visual Requirement: 10-20%
- EASY: 1's complement of a 4-bit number (just invert)
- MEDIUM: 2's complement of a 6-8 bit number
- HARD: Use 2's complement to perform subtraction (A - B = A + ~B + 1)
- DO NOT ask about overflow conditions or signed interpretation (MSB)`,

    6: `**LESSON 6: Signed and Unsigned Numbers**
- Focus: MSB role, signed vs unsigned interpretation, range calculations
- Question Types: Interpretation and range calculation problems
- Visual Requirement: 10-20%
- EASY: Identify MSB of a binary number, determine if signed or unsigned
- MEDIUM: Calculate the range of n-bit signed vs unsigned numbers
- HARD: Interpret the same binary pattern as both signed and unsigned`,

    7: `**LESSON 7: Binary Codes (BCD & ASCII)**
- Focus: BCD encoding/decoding, ASCII character codes
- Question Types: Encoding/decoding calculations
- Visual Requirement: 10-20%
- EASY: Convert single decimal digit to BCD (e.g., 7 → 0111)
- MEDIUM: Convert multi-digit decimal to BCD or BCD to decimal
- HARD: Identify invalid BCD codes, ASCII character lookups`,

    8: `**LESSON 8: Introduction to Boolean Algebra**
- Focus: Basic concepts, Boolean values (0/1, true/false), real-world applications
- Question Types: Text-based conceptual questions, simple calculations
- Visual Requirement: 20-30% (mostly text-based)
- EASY: Basic definitions applied to scenarios, simple OR/AND calculations
- MEDIUM: Multi-step reasoning, comparing Boolean expressions
- HARD: Complex application scenarios, edge cases
- Example stems: "Calculate A OR B when A=1, B=0", "Which expression equals 1?"`,

    9: `**LESSON 9: Logic Gates**
- Focus: AND, OR, NOT, NAND, NOR, XOR, XNOR gate behavior and symbols
- Question Types: **MUST USE CIRCUIT DIAGRAMS AND TRUTH TABLES**
- Visual Requirement: 80-90% (circuits and tables are essential)
- EASY: Single gate analysis, basic truth table reading
- MEDIUM: 2-gate circuits, truth table to gate identification
- HARD: 3+ gate circuits, complex signal tracing
- Limit truth tables to 2 questions max; prefer circuits`,

    10: `**LESSON 10: Truth Tables**
- Focus: Reading and analyzing truth tables to derive expressions
- Question Types: **TRUTH TABLES AND ALGEBRAIC EXPRESSIONS** (READ ONLY - DO NOT ASK TO CONSTRUCT)
- Visual Requirement: 60-70% (truth tables are the focus)
- EASY: Read output from a simple 2-variable table, identify the expression
- MEDIUM: Analyze a 3-variable truth table to find the equivalent Boolean expression
- HARD: Derive minimal expressions from complex tables, find logical equivalences
- **CRITICAL**: Always provide the truth table in the question. Ask students to READ/ANALYZE it, NOT to construct it
- Example: "Given the truth table below, which expression represents the output Y?"`,

    11: `**LESSON 11: Simplification & K-Maps**
- Focus: Boolean laws, Karnaugh maps, SOP/POS optimization
- Question Types: **KARNAUGH MAPS AND ALGEBRAIC SIMPLIFICATION**
- Visual Requirement: 70-80% (K-maps for optimization, text for laws)
- EASY: Apply single law (Identity, Null), 2-variable K-map
- MEDIUM: Multi-law simplification, 3-variable K-map grouping
- HARD: Complex expressions, 4-variable K-maps, optimal grouping
- Use K-maps for visual questions, text for law application`,
  };

  return guidelines[lessonId] || `**Lesson ${lessonId}**
- Focus: Core concepts relevant to this lesson
- Question Types: Text-based conceptual and calculation questions
- EASY: Basic definitions and simple single-step problems
- MEDIUM: Multi-step reasoning and application
- HARD: Complex scenarios combining multiple concepts`;
}

/**
 * Build the lesson-specific quiz prompt
 */
export function buildLessonQuizPrompt(context: LessonQuizContext): string {
  const topicInstructions = context.topics.map(topic => {
    const masteryPercent = Math.round(topic.mastery * 100);
    const isWeakest = topic.questionCount > 3;
    
    return `
📚 **${topic.topicTitle}** (Topic ID: ${topic.topicId})
   - User Mastery: ${masteryPercent}%
   - Difficulty: **${topic.difficulty.toUpperCase()}**
   - Questions: **${topic.questionCount}** ${isWeakest ? '🔥 (WEAKEST - BONUS QUESTION)' : ''}
   - Tags to use: ${topic.tags.join(', ')}
   - Content Summary: ${topic.contentText.substring(0, 300)}...`;
  }).join('\n');
  const isLogicVisualLesson = [9, 10, 11].includes(context.lessonId);

  const difficultyGuidelines = isLogicVisualLesson ? `
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
- **solutionSteps**: 5-7 comprehensive steps with full mathematical derivations` : `
📊 DIFFICULTY GUIDELINES:

**EASY Questions** (for mastery < 40%):
- Single-step calculations or conceptual questions
- Direct application of base/positional rules
- Small values or straightforward base identification
- **solutionSteps**: 2-3 simple steps showing the basic calculation

**MEDIUM Questions** (for mastery 40-69%):
- Multi-step calculations required
- Comparing or combining multiple representations
- Medium range values or intermediate calculations
- **solutionSteps**: 3-5 detailed steps showing intermediate calculations and conversion/arithmetic stages

**HARD Questions** (for mastery ≥ 70%):
- Complex multi-step problems or word problems
- Comparing multiple expressions or values across different bases
- Larger values or complex encoding/decoding sequences
- **solutionSteps**: 5-7 comprehensive steps with detailed calculations and logic verified`;

  const visualFormatsSection = isLogicVisualLesson ? `
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

**Example HARD Circuit** (3-variable, 4 gates):
{
  "type": "circuit",
  "circuit": {
    "inputs": ["A", "B", "C"],
    "gates": [
      {"id": "G1", "type": "NOT", "inputs": ["A"], "output": "A_NOT", "position": {"x": 1, "y": 0}},
      {"id": "G2", "type": "NOT", "inputs": ["B"], "output": "B_NOT", "position": {"x": 1, "y": 2}},
      {"id": "G3", "type": "AND", "inputs": ["A_NOT", "C"], "output": "G3_OUT", "position": {"x": 2, "y": 0}},
      {"id": "G4", "type": "OR", "inputs": ["G3_OUT", "B_NOT"], "output": "Y", "position": {"x": 3, "y": 1}}
    ],
    "finalOutput": "Y",
    "caption": "Determine the Boolean expression: Y = (A'·C) + B'"
  }
}

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
` : `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 VISUAL ELEMENT FORMATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**TEXT-ONLY (MANDATORY for Lesson ${context.lessonId})**
For number systems and arithmetic, do not use circuits, truth tables, or Karnaugh maps. Instead, the "stem" of each question MUST be a pure string.
Example stems: 
- "What is the positional value of the digit '5' in the octal number 357_8?"
- "Compare the following numbers. Which one represents the largest value? A = 10110_2, B = 24_10, C = 17_16"
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
      "Step 2: Show the first calculation or conversion step.",
      "Step 3: Show intermediate calculation steps or comparisons.",
      "Step 4: Execute the final calculation or conversion stage.",
      "Final Step: Conclude with the final result matching the correct option."
    ],
    "options": [
      {
        "id": "opt_a", 
        "text": "First conceptually distinct distractor", 
        "isCorrect": false, 
        "rationale": "Detailed explanation why this is WRONG. Point out the specific error or misconception."
      },
      {
        "id": "opt_b", 
        "text": "Correct Answer", 
        "isCorrect": true, 
        "rationale": "Comprehensive explanation why this is CORRECT. Justify with mathematical reasoning, show verification, and connect to concepts."
      },
      {
        "id": "opt_c", 
        "text": "Second conceptually distinct distractor", 
        "isCorrect": false, 
        "rationale": "Detailed explanation why this is WRONG. Identify the mistake made."
      },
      {
        "id": "opt_d", 
        "text": "Third conceptually distinct distractor", 
        "isCorrect": false, 
        "rationale": "Detailed explanation why this is WRONG. Clarify the misconception."
      }
    ],
    "answerId": "opt_b"
  }
]
`;

  const criticalRequirementsSection = isLogicVisualLesson ? `
⚠️ **CRITICAL REQUIREMENTS FOR solutionSteps AND rationale:**

**For solutionSteps (Lessons 9, 10, 11 - PROBLEM SOLVING):**
- **LESSON 9 (Logic Gates)**: 
  - Step 1: Identify the gate types and inputs
  - Step 2: Trace signal through first gate with specific values
  - Step 3: Show intermediate outputs
  - Step 4: Trace through subsequent gates
  - Step 5: Derive final expression or output
  - Example: "Apply NOT to A (1) → A' = 0", "AND gate: A'(0) AND B(1) = 0"

- **LESSON 10 (Truth Tables)**:
  - Step 1: Examine the provided truth table and identify the pattern
  - Step 2: Look at rows where output Y = 1 (identify minterms)
  - Step 3: Write the expression for each minterm (e.g., A'B'C for row where A=0, B=0, C=1 gives Y=1)
  - Step 4: Combine minterms with OR operations to form Sum of Products (SOP)
  - Step 5: Simplify if possible using Boolean laws
  - Step 6: Verify by checking the expression against the table
  - Example: "Rows with Y=1: [0,0,0], [0,1,1] → Minterms: A'B'C' + A'BC → Expression found"

- **LESSON 11 (Simplification & K-Maps)**:
  - Step 1: Write the original expression
  - Step 2: Identify groupings in K-map or applicable Boolean law
  - Step 3: Apply law/grouping (show explicitly: A + A'B = A + B by Absorption)
  - Step 4: Continue simplification with next law
  - Step 5: Verify by truth table or expansion
  - Example: "Group cells [1,3]: A'B' + A'B = A'(B'+B) = A'(1) = A'"

- **LESSON 8**: Can use simpler steps (2-3 steps) for conceptual questions` : `
⚠️ **CRITICAL REQUIREMENTS FOR solutionSteps AND rationale:**

**For solutionSteps (Number Systems & Arithmetic):**
- Step 1: Clearly define the starting value/expression and goal (e.g. converting a value, finding positional value, complements, arithmetic operations)
- Step 2: Perform the primary calculation/conversion step, showing intermediate values (e.g. dividing by base, multiplying weights, inverting bits)
- Step 3: Complete subsequent steps, showing all calculations explicitly
- Final Step: Conclude with the final result and relate it directly to the correct answer choice
- ALWAYS write detailed, easy-to-follow explanations so students can learn from mistakes!`;

  const logicVerificationSection = isLogicVisualLesson ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ LOGIC VERIFICATION (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You MUST verify answers in "_reasoning" field:
- TRUTH TABLE: Check ALL rows. NAND: 0,0→1; 0,1→1; 1,0→1; 1,1→0
- CIRCUIT: Trace signal from inputs through each gate
- K-MAP: Verify groupings produce the correct minimal expression
- EXPRESSION: Show algebraic steps

**⚠️ CRITICAL: VARIABLE COUNT MUST MATCH!**
- If the expression has 2 variables (A, B): Truth table has 4 rows, headers: ["A", "B", "Y"]
- If the expression has 3 variables (A, B, C): Truth table has 8 rows, headers: ["A", "B", "C", "Y"]
- The number of variables in the expression MUST equal the number of input columns in the truth table
- Y = A' + B' uses ONLY A and B, so table has ONLY A and B columns (4 rows)
- Y = A·B + C uses A, B, and C, so table has A, B, and C columns (8 rows)
- **NEVER add extra variables that don't appear in the expression!**
- **If you want 3 variables for MEDIUM difficulty, the EXPRESSION must use 3 variables!**
- WRONG: Expression "Y = A' + B'" with table columns [A, B, C] ❌
- RIGHT: Expression "Y = A' + B' + C" with table columns [A, B, C] ✓
- RIGHT: Expression "Y = A·B·C'" with table columns [A, B, C] ✓

DO NOT HALLUCINATE. Verify before outputting.` : `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MATHEMATICAL VERIFICATION (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You MUST verify answers in "_reasoning" field:
- Check all conversions and calculations manually.
- Double-check positional powers (e.g. 2^0 = 1, 2^1 = 2, 2^2 = 4, 8^0 = 1, 8^1 = 8, 16^0 = 1, 16^1 = 16).
- Ensure that subtraction borrows and addition carries are calculated correctly for binary arithmetic.
- Verify complement calculations (1's complement = flip all bits; 2's complement = flip all bits and add 1).

DO NOT HALLUCINATE. Verify before outputting.`;

  const correctOptionRationaleDesc = `
**For rationale (ALL OPTIONS):**
- **Correct option**: 3-4 sentences minimum
  - Sentence 1: State why it's correct
  - Sentence 2: Show mathematical verification
  - Sentence 3: Connect to underlying concept/rule
  - Sentence 4: Optional - relate to common applications

- **Incorrect options**: 2-3 sentences minimum
  - Sentence 1: Identify the specific error or misconception
  - Sentence 2: Explain what would be needed for this to be correct
  - Sentence 3: Optional - show correct calculation for comparison`;

  return `
You are a distinguished University Professor of Digital Logic and Boolean Algebra. Your task is to generate a focused, high-quality **10-question** assessment for a single lesson.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 LESSON: ${context.lessonTitle} (Lesson ID: ${context.lessonId})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 TARGET COLLEGE-LEVEL DIFFICULTY ("College-Level Engineering/Computer Science" persona):
- "Easy": Accessible to a first-year university student. Requires understanding a single foundational concept and executing 1-2 basic steps (e.g., standard binary subtraction, basic truth table evaluation). Absolutely no trivia, no-brainers, or definitions that can be answered without conceptual application.
- "Medium": Requires combining 2 or more concepts or multi-step execution.
- "Hard": Requires edge-case handling, complex optimization, or deep analytical troubleshooting.

🛑 STRICT OPTION UNIQUENESS & INTEGRITY CONSTRAINTS:
- Each of the 4 choices generated must be completely distinct in both text and conceptual meaning. Under no circumstances may two options evaluate to or display the same value.
- Distractors (incorrect choices) must be derived from common student misconceptions or logical slips related to the question, not random filler data.
- The 'answerId' must point exclusively to the correct option that matches your 'solutionSteps'.

${getLessonGuidelines(context.lessonId)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TOPIC-SPECIFIC REQUIREMENTS (MUST FOLLOW EXACTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topicInstructions}

${difficultyGuidelines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MANDATORY: GENERATE EXACTLY ${context.totalQuestions} QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ CRITICAL RULES:
1. **MATCH DIFFICULTY TO TOPIC**: Each question's difficulty MUST match the topic's assigned difficulty
2. **EXACT QUESTION COUNT**: Generate exactly ${context.topics.map(t => t.questionCount).join(' + ')} = ${context.totalQuestions} questions
3. **CORRECT TOPIC IDs**: Each question must have the correct topicId from above
4. **NO MEMORIZATION**: Use "Calculate", "Analyze", "Design", "Simplify" - NOT "Define" or "What is"
5. **ONE CORRECT ANSWER**: Exactly one option must be correct with clear mathematical justification

${visualFormatsSection}

${outputFormatSection}

${criticalRequirementsSection}

${correctOptionRationaleDesc}

${logicVerificationSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 GENERATE ${context.totalQuestions} QUESTIONS NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remember:
${context.topics.map(t => `- ${t.topicTitle}: ${t.questionCount} ${t.difficulty.toUpperCase()} questions`).join('\n')}
Total: ${context.totalQuestions} questions in valid JSON array format.
`;
}

/**
 * Build the fallback lesson-specific quiz prompt
 * This is a stripped down version of the prompt designed specifically for smaller,
 * lower-context models (like llama-3.1-8b-instant). It removes complex JSON properties
 * like reasoning, solutionSteps, and incorrect rationales.
 */
export function buildFallbackLessonQuizPrompt(context: LessonQuizContext): string {
  const topicInstructions = context.topics.map(topic => {
    return `
📚 **${topic.topicTitle}** (Topic ID: ${topic.topicId})
   - Difficulty: **${topic.difficulty.toUpperCase()}**
   - Questions: **${topic.questionCount}**
   - Content Summary: ${topic.contentText.substring(0, 150)}...`;
  }).join('\n');

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
🎯 LESSON: ${context.lessonTitle} (Lesson ID: ${context.lessonId})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getLessonGuidelines(context.lessonId)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TOPICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topicInstructions}

⚠️ CRITICAL RULES:
1. NO VISUAL FORMATS (no circuits, no truth tables). Stems must be TEXT ONLY.
2. Generate EXACTLY ${context.totalQuestions} questions.
3. Only the correct option should have a "rationale" string.
4. Return ONLY raw JSON array.

${outputFormatSection}
`;
}
