import { LessonQuizContext } from './prompts/lesson-quiz-generation';

type Item = { stem: string; answer: string; wrong: string[]; explanation: string };
const item = (stem: string, answer: string | number, wrong: Array<string | number>, explanation: string): Item =>
  ({ stem, answer: String(answer), wrong: wrong.map(String), explanation });

/** Local, computed questions; no network calls and no placeholder answers. */
function makeItem(lesson: string, topic: string, index: number): Item {
  const name = lesson.toLowerCase();
  const title = topic.toLowerCase();
  const n = 5 + index;
  if (name.includes('introduction to number')) {
    const base = title.includes('hex') ? 16 : title.includes('oct') ? 8 : title.includes('decimal') ? 10 : 2;
    if (index % 3 === 0) return item(`How many distinct digits are used in base ${base}?`, base, [base + 1, base - 1, base * 2], `A base-${base} system uses exactly ${base} distinct digits.`);
    if (index % 3 === 1) return item(`What is the positional weight at position 2 in base ${base}, counting the rightmost position as 0?`, base ** 2, [base, base ** 3, 1], `The weight is base raised to the position: ${base}^2 = ${base ** 2}.`);
    const highest = base === 16 ? 'F' : String(base - 1);
    return item(`What is the highest valid single digit in base ${base}?`, highest, [String(base), base === 16 ? 'G' : 'A', 'Z'], `Valid digits run from zero through ${base - 1}; the highest digit is ${highest}.`);
  }
  if (name.includes('types of number') || name.includes('conversion')) {
    if (title.includes('group')) {
      const hex = index % 2 === 0;
      return item(`How many binary bits correspond to one ${hex ? 'hexadecimal' : 'octal'} digit?`, hex ? 4 : 3, hex ? [2, 3, 8] : [2, 4, 8], `${hex ? '16 = 2^4' : '8 = 2^3'}, so each digit corresponds to ${hex ? 4 : 3} bits.`);
    }
    const normalized = title.replace(/[-–—]/g, ' ');
    if (/decimal\s+(?:to|→)\s+binary/.test(normalized)) return item(`Convert decimal ${n} to binary.`, n.toString(2), [n + 1, n + 2, n + 3].map(x => x.toString(2)), `Express ${n} using powers of 2 to obtain ${n.toString(2)}.`);
    if (/binary\s+(?:to|→)\s+decimal/.test(normalized)) return item(`Convert binary ${n.toString(2)} to decimal.`, n, [n + 1, n + 2, n + 3], `Adding the positional weights in ${n.toString(2)} gives ${n}.`);
    if (title.includes('hex')) {
      if (name.includes('conversion') && index % 2 === 1) return item(`Convert hexadecimal ${n.toString(16).toUpperCase()} to binary.`, n.toString(2), [n + 1, n + 2, n + 3].map(x => x.toString(2)), `Each hexadecimal digit represents four bits; removing leading zeroes gives ${n.toString(2)}.`);
      return item(`What hexadecimal value equals binary ${n.toString(2)}?`, n.toString(16).toUpperCase(), [n + 1, n + 2, n + 3].map(x => x.toString(16).toUpperCase()), `Binary ${n.toString(2)} is ${n} in decimal and ${n.toString(16).toUpperCase()} in hexadecimal.`);
    }
    if (title.includes('oct')) return item(`What octal value equals decimal ${n}?`, n.toString(8), [n + 1, n + 2, n + 3].map(x => x.toString(8)), `Repeated division by 8 converts ${n} to ${n.toString(8)} in octal.`);
    return item(`What decimal value equals binary ${n.toString(2)}?`, n, [n + 1, n + 2, n + 3], `Adding the binary positional weights gives ${n}.`);
  }
  if (name.includes('arithmetic')) {
    const a = n + 3, b = 2;
    const op = title.includes('sub') ? '-' : title.includes('mult') ? '*' : title.includes('div') ? '/' : '+';
    const dividend = op === '/' ? a * b : a;
    const result = op === '-' ? a - b : op === '*' ? a * b : op === '/' ? a : a + b;
    return item(`Compute ${dividend.toString(2)} ${op} ${b.toString(2)} in binary.`, result.toString(2), [result + 1, result + 2, result + 3].map(x => x.toString(2)), `In decimal, ${dividend} ${op} ${b} = ${result}; in binary the result is ${result.toString(2)}.`);
  }
  if (name.includes('complement')) {
    const bits = n.toString(2).padStart(8, '0');
    const twos = title.includes('2') || title.includes('two');
    const result = twos ? (256 - n) % 256 : 255 - n;
    return item(`What is the 8-bit ${twos ? "2's" : "1's"} complement of ${bits}?`, result.toString(2).padStart(8, '0'), [result + 1, result + 2, result + 3].map(x => (x % 256).toString(2).padStart(8, '0')), `${twos ? 'Invert all 8 bits, then add 1 within 8 bits' : 'Invert each of the 8 bits'} to obtain ${result.toString(2).padStart(8, '0')}.`);
  }
  if (name.includes('signed')) {
    const value = 128 + n;
    const signed = !title.includes('unsigned');
    const answer = signed ? value - 256 : value;
    return item(`Interpret ${value.toString(2)} as an 8-bit ${signed ? "two's-complement signed" : 'unsigned'} integer.`, answer, [answer + 1, answer + 2, signed ? value : value - 256], signed ? `The sign bit is 1, so subtract 256: ${value} - 256 = ${answer}.` : `Add the positional weights without a sign adjustment: ${answer}.`);
  }
  if (name.includes('binary codes') || name.includes('bcd')) {
    if (title.includes('ascii') || title.includes('character')) {
      const code = 65 + index;
      if (title.includes('binary') || title.includes('character')) return item(`Encode uppercase '${String.fromCharCode(code)}' as an 8-bit ASCII binary byte.`, code.toString(2).padStart(8, '0'), [code + 1, code - 1, code + 32].map(x => x.toString(2).padStart(8, '0')), `ASCII '${String.fromCharCode(code)}' is decimal ${code}, encoded as ${code.toString(2).padStart(8, '0')}.`);
      return item(`What is the decimal ASCII code for uppercase '${String.fromCharCode(code)}'?`, code, [code + 1, code - 1, code + 32], `Uppercase A is ASCII 65; '${String.fromCharCode(code)}' is ${index} positions after A, giving ${code}.`);
    }
    const value = 20 + index;
    const bcd = (v: number) => String(v).split('').map(d => Number(d).toString(2).padStart(4, '0')).join(' ');
    return item(`Encode decimal ${value} in BCD (one 4-bit group per digit).`, bcd(value), [value + 1, value + 2, value + 3].map(bcd), `Encode each decimal digit separately: ${value} becomes ${bcd(value)}.`);
  }
  if (name.includes('logic gate') || name.includes('truth table')) {
    const a = index % 2, b = Math.floor(index / 2) % 2;
    const gates = title.includes('xnor') || title.includes('xor') ? ['XOR', 'XNOR'] : title.includes('nand') || title.includes('nor') ? ['NAND', 'NOR'] : ['AND', 'OR', 'NOT'];
    const op = gates[index % gates.length];
    const answer = op === 'NOT' ? 1 - a : op === 'OR' ? a | b : op === 'NAND' ? 1 - (a & b) : op === 'NOR' ? 1 - (a | b) : op === 'XOR' ? a ^ b : op === 'XNOR' ? 1 - (a ^ b) : a & b;
    return item(op === 'NOT' ? `For A=${a}, what is NOT A?` : `For A=${a} and B=${b}, what is A ${op} B?`, answer, [1 - answer, 'Undefined', 'Both 0 and 1'], op === 'NOT' ? 'NOT reverses a single input bit.' : `${op} gives ${answer} for inputs ${a} and ${b}.`);
  }
  if (name.includes('boolean') || name.includes('simplif')) {
    if (title.includes('map') || title.includes('karnaugh')) {
      const cases = [
        {minterms: '0, 1', answer: 'NOT A', why: 'Both cells have A=0 while B changes.'},
        {minterms: '2, 3', answer: 'A', why: 'Both cells have A=1 while B changes.'},
        {minterms: '1, 3', answer: 'B', why: 'Both cells have B=1 while A changes.'},
        {minterms: '0, 2', answer: 'NOT B', why: 'Both cells have B=0 while A changes.'},
      ];
      const selected = cases[index % cases.length];
      return item(`A two-variable Karnaugh map F(A,B) has 1s only at minterms ${selected.minterms} (binary order AB). Group the two adjacent 1s. What is the minimal expression?`, selected.answer, ['A', 'NOT A', 'B', 'NOT B'].filter(x => x !== selected.answer), `${selected.why} Grouping removes the changing variable, leaving ${selected.answer}.`);
    }
    const variants = [
      item('Simplify A AND 1.', 'A', ['0', '1', 'NOT A'], '1 is the identity for AND, so A AND 1 = A.'),
      item('Simplify A OR 0.', 'A', ['0', '1', 'NOT A'], '0 is the identity for OR, so A OR 0 = A.'),
      item('Simplify A AND (NOT A).', '0', ['A', '1', 'NOT A'], 'A and its complement cannot both be true.'),
      item('Simplify A OR (NOT A).', '1', ['A', '0', 'NOT A'], 'Either A or its complement must be true.'),
    ];
    return variants[index % variants.length];
  }
  throw new Error(`No local lesson quiz is configured for "${lesson}".`);
}

export function buildLocalLessonQuestions(context: LessonQuizContext) {
  return context.topics.flatMap(topic => Array.from({ length: topic.questionCount }, (_, i) => {
    const value = makeItem(context.lessonTitle, topic.topicTitle, i);
    const values = [...new Set([value.answer, ...value.wrong])];
    if (values.length !== 4) throw new Error('Local quiz options must be distinct.');
    return {
      id: `local-${context.lessonId}-${topic.topicId}-${i}`,
      lessonId: context.lessonId, topicId: topic.topicId, difficulty: topic.difficulty,
      tags: topic.tags, stem: value.stem, questionType: 'multiple-choice',
      options: values.map((text, index) => ({id: `opt_${index}`, text, isCorrect: index === 0, rationale: value.explanation})),
      answerId: 'opt_0', explanation: value.explanation, solutionSteps: [value.explanation],
    };
  })).slice(0, context.totalQuestions);
}
