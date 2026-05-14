import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.userTopic.deleteMany();
  await prisma.userLesson.deleteMany();
  await prisma.userLessonMastery.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.lesson.deleteMany();

  // Lesson 1: Intro to Boolean Algebra
  const lesson1 = await prisma.lesson.create({ data: { title: 'Intro to Boolean Algebra' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'What is Boolean Algebra?', lessonId: lesson1.id, tags: ['basics','history'],
      contentText: 'Boolean Algebra is a branch of mathematics that deals with true/false values.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'What is Boolean Algebra?', level: 2 },
        { type: 'text', text: 'Boolean Algebra is a branch of algebra where the values of variables are true (1) or false (0). It was introduced by George Boole in 1854 and forms the foundation of digital logic and computer science.' },
        { type: 'callout', callout: { type: 'info', title: 'Key Concept', content: 'Unlike regular algebra with infinite numbers, Boolean algebra only uses two values: 1 (TRUE) and 0 (FALSE).' } },
        { type: 'heading', text: 'History', level: 3 },
        { type: 'text', text: 'George Boole published "An Investigation of the Laws of Thought" in 1854, laying the groundwork for Boolean algebra. Claude Shannon later applied it to electrical circuits in 1937, revolutionizing digital electronics.' },
        { type: 'heading', text: 'Why It Matters', level: 3 },
        { type: 'list', list: ['Every digital computer operates using Boolean logic', 'Search engines use Boolean operators (AND, OR, NOT)', 'Programming conditions are Boolean expressions', 'Digital circuits are designed using Boolean algebra'] },
        { type: 'callout', callout: { type: 'tip', title: 'Remember', content: 'Boolean algebra is the mathematical foundation that makes all modern computing possible!' } }
      ]))
    },
    {
      title: 'Boolean Values', lessonId: lesson1.id, tags: ['values','binary'],
      contentText: 'Understanding TRUE/FALSE, 1/0 values in Boolean algebra.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Boolean Values: True and False', level: 2 },
        { type: 'text', text: 'In Boolean algebra, there are exactly two possible values for any variable. These can be represented in several equivalent ways:' },
        { type: 'table', table: { headers: ['Representation', 'True Value', 'False Value'], rows: [['Binary', '1', '0'], ['Logic', 'TRUE', 'FALSE'], ['Voltage', 'HIGH', 'LOW'], ['Switch', 'ON', 'OFF'], ['Set Theory', 'Member', 'Not Member']], caption: 'Different representations of Boolean values' } },
        { type: 'heading', text: 'Variables', level: 3 },
        { type: 'text', text: 'Boolean variables are typically represented by uppercase letters like A, B, C. Each variable can only hold the value 0 or 1.' },
        { type: 'codeBlock', code: 'A = 1    (A is TRUE)\nB = 0    (B is FALSE)\nC = 1    (C is TRUE)', language: 'boolean' },
        { type: 'callout', callout: { type: 'important', title: 'Binary System', content: 'The binary number system used in computers is directly based on Boolean values. Each bit in a computer is a Boolean value!' } }
      ]))
    },
    {
      title: 'Applications', lessonId: lesson1.id, tags: ['applications','real-world'],
      contentText: 'Real-world applications of Boolean algebra.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Applications of Boolean Algebra', level: 2 },
        { type: 'text', text: 'Boolean algebra is used extensively across many fields of technology and science.' },
        { type: 'heading', text: '1. Digital Circuit Design', level: 3 },
        { type: 'text', text: 'Every processor, memory chip, and digital device is built using logic gates that implement Boolean operations. Engineers use Boolean algebra to design and optimize these circuits.' },
        { type: 'heading', text: '2. Programming', level: 3 },
        { type: 'codeBlock', code: 'if (age >= 18 AND hasID == true) {\n  allowEntry = true;\n} else {\n  allowEntry = false;\n}', language: 'pseudocode' },
        { type: 'heading', text: '3. Database Queries', level: 3 },
        { type: 'codeBlock', code: "SELECT * FROM users\nWHERE age > 18 AND (country = 'PH' OR country = 'US');", language: 'sql' },
        { type: 'heading', text: '4. Search Engines', level: 3 },
        { type: 'text', text: 'Google and other search engines use Boolean operators to refine search results. For example: "machine learning" AND "python" NOT "beginner"' },
        { type: 'callout', callout: { type: 'tip', title: 'Fun Fact', content: 'Every time you use an if-else statement in programming, you are applying Boolean algebra!' } }
      ]))
    }
  ]});

  // Lesson 2: Logic Gates
  const lesson2 = await prisma.lesson.create({ data: { title: 'Logic Gates' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'AND, OR, NOT', lessonId: lesson2.id, tags: ['basic-gates'],
      contentText: 'The three fundamental logic gates.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Basic Logic Gates', level: 2 },
        { type: 'text', text: 'Logic gates are the building blocks of digital circuits. The three fundamental gates are AND, OR, and NOT.' },
        { type: 'logicGate', logicGate: { type: 'AND', inputs: ['A', 'B'], output: 'A·B', description: 'Output is 1 only when ALL inputs are 1' } },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A AND B'], rows: [['0','0','0'], ['0','1','0'], ['1','0','0'], ['1','1','1']], caption: 'AND Gate Truth Table' } },
        { type: 'logicGate', logicGate: { type: 'OR', inputs: ['A', 'B'], output: 'A+B', description: 'Output is 1 when ANY input is 1' } },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A OR B'], rows: [['0','0','0'], ['0','1','1'], ['1','0','1'], ['1','1','1']], caption: 'OR Gate Truth Table' } },
        { type: 'logicGate', logicGate: { type: 'NOT', inputs: ['A'], output: "A'", description: 'Inverts the input: 0 becomes 1, 1 becomes 0' } },
        { type: 'truthTable', truthTable: { inputs: ['A'], outputs: ['NOT A'], rows: [['0','1'], ['1','0']], caption: 'NOT Gate Truth Table' } }
      ]))
    },
    {
      title: 'NAND, NOR', lessonId: lesson2.id, tags: ['universal-gates'],
      contentText: 'Universal logic gates NAND and NOR.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Universal Gates: NAND & NOR', level: 2 },
        { type: 'text', text: 'NAND and NOR are called "universal gates" because any Boolean function can be implemented using only NAND gates or only NOR gates.' },
        { type: 'callout', callout: { type: 'important', title: 'Universal Gates', content: 'NAND and NOR are special because you can build AND, OR, and NOT gates using only NAND (or only NOR) gates!' } },
        { type: 'logicGate', logicGate: { type: 'NAND', inputs: ['A', 'B'], output: "(A·B)'", description: 'NOT-AND: Output is 0 only when all inputs are 1' } },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A NAND B'], rows: [['0','0','1'], ['0','1','1'], ['1','0','1'], ['1','1','0']], caption: 'NAND Gate Truth Table' } },
        { type: 'logicGate', logicGate: { type: 'NOR', inputs: ['A', 'B'], output: "(A+B)'", description: 'NOT-OR: Output is 1 only when all inputs are 0' } },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A NOR B'], rows: [['0','0','1'], ['0','1','0'], ['1','0','0'], ['1','1','0']], caption: 'NOR Gate Truth Table' } }
      ]))
    },
    {
      title: 'XOR, XNOR', lessonId: lesson2.id, tags: ['exclusive-gates'],
      contentText: 'Exclusive OR and Exclusive NOR gates.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Exclusive Gates: XOR & XNOR', level: 2 },
        { type: 'text', text: 'XOR and XNOR gates compare inputs and check if they are different or the same.' },
        { type: 'logicGate', logicGate: { type: 'XOR', inputs: ['A', 'B'], output: 'A⊕B', description: 'Output is 1 when inputs are DIFFERENT' } },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A XOR B'], rows: [['0','0','0'], ['0','1','1'], ['1','0','1'], ['1','1','0']], caption: 'XOR Gate Truth Table' } },
        { type: 'logicGate', logicGate: { type: 'XNOR', inputs: ['A', 'B'], output: '(A⊕B)\'', description: 'Output is 1 when inputs are the SAME' } },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A XNOR B'], rows: [['0','0','1'], ['0','1','0'], ['1','0','0'], ['1','1','1']], caption: 'XNOR Gate Truth Table' } },
        { type: 'callout', callout: { type: 'tip', title: 'Practical Use', content: 'XOR is widely used in parity checking, error detection, and encryption algorithms.' } }
      ]))
    }
  ]});

  // Lesson 3: Truth Tables
  const lesson3 = await prisma.lesson.create({ data: { title: 'Truth Tables' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'Constructing Truth Tables', lessonId: lesson3.id, tags: ['construction'],
      contentText: 'How to build truth tables step by step.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'How to Construct Truth Tables', level: 2 },
        { type: 'text', text: 'A truth table lists all possible combinations of inputs and their corresponding outputs for a Boolean expression.' },
        { type: 'heading', text: 'Step-by-Step Process', level: 3 },
        { type: 'list', ordered: true, list: ['Identify all input variables (A, B, C, ...)', 'Calculate total rows: 2^n where n = number of variables', 'List all input combinations in binary order', 'Evaluate the expression for each combination', 'Write the output in the final column'] },
        { type: 'heading', text: 'Example: A AND B', level: 3 },
        { type: 'text', text: 'For 2 variables (A, B), we need 2² = 4 rows:' },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['A · B'], rows: [['0','0','0'], ['0','1','0'], ['1','0','0'], ['1','1','1']], caption: 'Truth Table for A AND B', highlightRows: [3] } },
        { type: 'callout', callout: { type: 'tip', title: 'Quick Formula', content: 'For n variables, you always need 2^n rows. 2 variables = 4 rows, 3 variables = 8 rows, 4 variables = 16 rows.' } }
      ]))
    },
    {
      title: 'Reading Truth Tables', lessonId: lesson3.id, tags: ['interpretation'],
      contentText: 'How to interpret and analyze truth tables.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Reading & Interpreting Truth Tables', level: 2 },
        { type: 'text', text: 'Reading a truth table means understanding what input combinations produce a 1 (TRUE) output.' },
        { type: 'heading', text: 'Finding the Expression', level: 3 },
        { type: 'text', text: 'To derive a Boolean expression from a truth table, look at rows where the output is 1:' },
        { type: 'truthTable', truthTable: { inputs: ['A', 'B'], outputs: ['F'], rows: [['0','0','0'], ['0','1','1'], ['1','0','1'], ['1','1','1']], caption: 'What expression does this represent?', highlightRows: [1,2,3] } },
        { type: 'text', text: "The highlighted rows show F=1 when: (A=0,B=1) OR (A=1,B=0) OR (A=1,B=1). This simplifies to F = A + B (OR gate)." },
        { type: 'callout', callout: { type: 'info', title: 'Minterms', content: "Each row where output=1 is called a 'minterm'. The Boolean expression is the OR of all minterms." } }
      ]))
    },
    {
      title: 'Truth Tables for Gates', lessonId: lesson3.id, tags: ['gates','examples'],
      contentText: 'Truth tables for all standard logic gates.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Complete Gate Truth Tables', level: 2 },
        { type: 'text', text: 'Here is a comprehensive comparison of all logic gates with 2 inputs:' },
        { type: 'table', table: { headers: ['A', 'B', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'], rows: [['0','0','0','0','1','1','0','1'], ['0','1','0','1','1','0','1','0'], ['1','0','0','1','1','0','1','0'], ['1','1','1','1','0','0','0','1']], caption: 'All 2-Input Gates Comparison' } },
        { type: 'heading', text: 'Key Observations', level: 3 },
        { type: 'list', list: ['AND and OR are complements of NAND and NOR respectively', 'XOR and XNOR are complements of each other', 'NAND outputs 1 for 3 out of 4 combinations', 'NOR outputs 1 for only 1 combination'] },
        { type: 'callout', callout: { type: 'tip', title: 'Memory Trick', content: 'AND = "both must be 1", OR = "at least one must be 1", XOR = "exactly one must be 1"' } }
      ]))
    }
  ]});

  // Lesson 4: Simplification
  const lesson4 = await prisma.lesson.create({ data: { title: 'Simplification' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'Boolean Laws', lessonId: lesson4.id, tags: ['laws','rules'],
      contentText: 'Fundamental laws of Boolean algebra for simplification.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Boolean Algebra Laws', level: 2 },
        { type: 'text', text: 'These laws are used to simplify Boolean expressions, reducing the number of gates needed in a circuit.' },
        { type: 'table', table: { headers: ['Law', 'AND Form', 'OR Form'], rows: [['Identity', 'A · 1 = A', 'A + 0 = A'], ['Null', 'A · 0 = 0', 'A + 1 = 1'], ['Idempotent', 'A · A = A', 'A + A = A'], ['Complement', "A · A' = 0", "A + A' = 1"], ['Commutative', 'A · B = B · A', 'A + B = B + A'], ['Associative', '(A·B)·C = A·(B·C)', '(A+B)+C = A+(B+C)'], ['Distributive', 'A·(B+C) = A·B+A·C', 'A+(B·C) = (A+B)·(A+C)']], caption: 'Fundamental Boolean Laws' } },
        { type: 'heading', text: "De Morgan's Theorems", level: 3 },
        { type: 'list', list: ["(A · B)' = A' + B' — The complement of AND equals OR of complements", "(A + B)' = A' · B' — The complement of OR equals AND of complements"] },
        { type: 'callout', callout: { type: 'important', title: "De Morgan's Laws", content: "These are the most important simplification tools! They allow you to convert between AND and OR operations." } }
      ]))
    },
    {
      title: 'Karnaugh Maps', lessonId: lesson4.id, tags: ['kmap','visual'],
      contentText: 'Visual method for simplifying Boolean expressions.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Karnaugh Maps (K-Maps)', level: 2 },
        { type: 'text', text: 'A Karnaugh Map is a visual tool for simplifying Boolean expressions. It arranges truth table values in a grid where adjacent cells differ by exactly one variable.' },
        { type: 'heading', text: '2-Variable K-Map Example', level: 3 },
        { type: 'text', text: 'For F = A\'B + AB\' + AB:' },
        { type: 'karnaughMap', karnaughMap: { variables: ['A', 'B'], values: [0, 1, 1, 1], caption: 'K-Map for F = A + B' } },
        { type: 'heading', text: 'How to Use K-Maps', level: 3 },
        { type: 'list', ordered: true, list: ['Fill in the K-map with values from the truth table', 'Group adjacent 1s in powers of 2 (1, 2, 4, 8...)', 'Groups can wrap around edges', 'Write the simplified expression from the groups'] },
        { type: 'callout', callout: { type: 'tip', title: 'Try It!', content: 'Use the Karnaugh Maps tool in the navigation bar to practice with interactive K-maps!' } }
      ]))
    },
    {
      title: 'Practical Examples', lessonId: lesson4.id, tags: ['examples','practice'],
      contentText: 'Step-by-step simplification examples.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Practical Simplification Examples', level: 2 },
        { type: 'heading', text: "Example 1: Using Boolean Laws", level: 3 },
        { type: 'text', text: "Simplify: F = A·B + A·B'" },
        { type: 'booleanExpression', booleanExpression: { expression: "A·B + A·B'", simplified: 'A', steps: ["F = A·B + A·B'", "F = A·(B + B')  — Distributive Law", "F = A·1  — Complement Law", "F = A  — Identity Law"], description: 'Factor out the common variable A' } },
        { type: 'heading', text: "Example 2: De Morgan's Theorem", level: 3 },
        { type: 'text', text: "Simplify: F = (A + B)'" },
        { type: 'booleanExpression', booleanExpression: { expression: "(A + B)'", simplified: "A' · B'", steps: ["F = (A + B)'", "F = A' · B'  — De Morgan's Theorem"], description: "Apply De Morgan's theorem to break the complement" } },
        { type: 'heading', text: 'Example 3: Multi-step', level: 3 },
        { type: 'text', text: "Simplify: F = A'·B'·C + A'·B·C + A·B'·C + A·B·C" },
        { type: 'booleanExpression', booleanExpression: { expression: "A'B'C + A'BC + AB'C + ABC", simplified: 'C', steps: ["F = A'B'C + A'BC + AB'C + ABC", "F = A'C(B'+B) + AC(B'+B)  — Factor", "F = A'C(1) + AC(1)  — Complement", "F = A'C + AC  — Identity", "F = C(A'+A)  — Factor", "F = C  — Complement & Identity"], description: 'All terms contain C, so the expression simplifies to just C' } },
        { type: 'callout', callout: { type: 'tip', title: 'Practice', content: 'Use the Calculator tool to verify your simplifications! Try entering expressions and see the results.' } }
      ]))
    }
  ]});

  console.log('✅ Seeded 4 lessons with 12 topics successfully!');
  console.log(`  Lesson 1 (id=${lesson1.id}): Intro to Boolean Algebra - 3 topics`);
  console.log(`  Lesson 2 (id=${lesson2.id}): Logic Gates - 3 topics`);
  console.log(`  Lesson 3 (id=${lesson3.id}): Truth Tables - 3 topics`);
  console.log(`  Lesson 4 (id=${lesson4.id}): Simplification - 3 topics`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
