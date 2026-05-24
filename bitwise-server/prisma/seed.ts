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

  // Reset auto-increment sequences so IDs start from 1
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Lesson_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Topic_id_seq" RESTART WITH 1`);

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

  // Lesson 5: Introduction to Number Systems
  const lesson5 = await prisma.lesson.create({ data: { title: 'Introduction to Number Systems' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'Binary', lessonId: lesson5.id, tags: ['binary','base-2','radix'],
      contentText: 'The binary number system (base 2) is the foundation of all digital computing.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary Number System (Base 2)', level: 2 },
        { type: 'text', text: 'The binary system is the simplest positional number system. It uses only two digits — 0 and 1 — called bits (binary digits). Every piece of data inside a computer is ultimately stored and processed as binary.' },
        { type: 'callout', callout: { type: 'info', title: 'Why Base 2?', content: 'Digital circuits use transistors that have two states: ON (1) and OFF (0). Binary maps perfectly to this physical reality, making it the natural language of computers.' } },
        { type: 'heading', text: 'Positional Value in Binary', level: 3 },
        { type: 'text', text: 'Each position in a binary number represents a power of 2, starting from 2⁰ on the right.' },
        { type: 'codeBlock', code: 'Binary number: 1 0 1 1 0\nPosition:      4 3 2 1 0\nPower of 2:    2⁴ 2³ 2² 2¹ 2⁰\nValue:         16  8  4  2  1\n\n1×16 + 0×8 + 1×4 + 1×2 + 0×1 = 22 (decimal)', language: 'text' },
        { type: 'heading', text: 'Counting in Binary', level: 3 },
        { type: 'table', table: { headers: ['Decimal', 'Binary', 'Bits Used'], rows: [['0','0','1'], ['1','1','1'], ['2','10','2'], ['3','11','2'], ['4','100','3'], ['5','101','3'], ['6','110','3'], ['7','111','3'], ['8','1000','4'], ['15','1111','4'], ['16','10000','5']], caption: 'Counting from 0 to 16 in Binary' } },
        { type: 'callout', callout: { type: 'tip', title: 'Pattern', content: 'With n bits, you can represent values from 0 to 2ⁿ − 1. For example, 8 bits can represent 0 to 255 (2⁸ − 1 = 255).' } },
        { type: 'heading', text: 'Common Binary Sizes', level: 3 },
        { type: 'table', table: { headers: ['Name', 'Bits', 'Range (Unsigned)'], rows: [['Nibble', '4', '0 – 15'], ['Byte', '8', '0 – 255'], ['Word (16-bit)', '16', '0 – 65,535'], ['Double Word', '32', '0 – 4,294,967,295']], caption: 'Standard Binary Groupings' } }
      ]))
    },
    {
      title: 'Decimal', lessonId: lesson5.id, tags: ['decimal','base-10','radix'],
      contentText: 'The decimal number system (base 10) is the standard system for everyday human use.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Decimal Number System (Base 10)', level: 2 },
        { type: 'text', text: 'The decimal system is the number system humans use every day. It has 10 digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. The word "decimal" comes from the Latin "decem" meaning ten.' },
        { type: 'heading', text: 'Positional Value in Decimal', level: 3 },
        { type: 'text', text: 'Each position in a decimal number represents a power of 10.' },
        { type: 'codeBlock', code: 'Decimal number: 4  7  3  9\nPosition:       3  2  1  0\nPower of 10:   10³ 10² 10¹ 10⁰\nValue:        1000 100  10   1\n\n4×1000 + 7×100 + 3×10 + 9×1 = 4739', language: 'text' },
        { type: 'heading', text: 'Why Decimal?', level: 3 },
        { type: 'text', text: 'Humans likely adopted base 10 because we have 10 fingers. While natural for us, decimal is inefficient for computers because representing 10 distinct states in hardware is complex compared to just 2.' },
        { type: 'callout', callout: { type: 'info', title: 'The Radix Concept', content: 'The "radix" (or base) of a number system determines how many unique digits it uses and the multiplier for each position. Decimal has radix 10, binary has radix 2, octal has radix 8, and hexadecimal has radix 16.' } },
        { type: 'heading', text: 'Decimal as a Reference Point', level: 3 },
        { type: 'text', text: 'When learning other number systems, we often convert to and from decimal because it is the system we intuitively understand. Decimal serves as a bridge between different bases.' },
        { type: 'table', table: { headers: ['Concept', 'Decimal Example', 'Meaning'], rows: [['Digits', '0-9', '10 unique symbols'], ['Place value', '352', '3×100 + 5×10 + 2×1'], ['Carry over', '9 + 1 = 10', 'Carry 1 to next position when digit exceeds 9'], ['Largest single digit', '9', 'One less than the base']], caption: 'Key Decimal Concepts' } }
      ]))
    },
    {
      title: 'Octal', lessonId: lesson5.id, tags: ['octal','base-8','radix'],
      contentText: 'The octal number system (base 8) uses digits 0-7 and is used in Unix file permissions.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Octal Number System (Base 8)', level: 2 },
        { type: 'text', text: 'The octal system uses 8 digits: 0, 1, 2, 3, 4, 5, 6, 7. Each octal digit represents exactly 3 binary digits, making it a convenient shorthand for binary.' },
        { type: 'heading', text: 'Positional Value in Octal', level: 3 },
        { type: 'codeBlock', code: 'Octal number: 3  5  7\nPosition:     2  1  0\nPower of 8:  8² 8¹ 8⁰\nValue:       64  8  1\n\n3×64 + 5×8 + 7×1 = 192 + 40 + 7 = 239 (decimal)', language: 'text' },
        { type: 'heading', text: 'Octal ↔ Binary Shortcut', level: 3 },
        { type: 'text', text: 'Since 8 = 2³, each octal digit maps to exactly 3 binary bits. This makes conversion between octal and binary very fast.' },
        { type: 'table', table: { headers: ['Octal', 'Binary', 'Decimal'], rows: [['0','000','0'], ['1','001','1'], ['2','010','2'], ['3','011','3'], ['4','100','4'], ['5','101','5'], ['6','110','6'], ['7','111','7']], caption: 'Octal to Binary Mapping' } },
        { type: 'codeBlock', code: 'Octal 357 → Binary:\n  3    5    7\n 011  101  111\n\nResult: 011101111₂ = 11101111₂', language: 'text' },
        { type: 'heading', text: 'Real-World Use: Unix Permissions', level: 3 },
        { type: 'text', text: 'The most common modern use of octal is Unix/Linux file permissions. Each permission group (owner, group, others) uses 3 bits: read (4), write (2), execute (1).' },
        { type: 'codeBlock', code: 'chmod 755 myfile.sh\n\n7 = 111 → rwx (read + write + execute)  [Owner]\n5 = 101 → r-x (read + execute)          [Group]\n5 = 101 → r-x (read + execute)          [Others]', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Historical Note', content: 'Octal was more popular in early computing when systems used 12-bit, 24-bit, or 36-bit words — all evenly divisible by 3. As 8-bit bytes became standard, hexadecimal (groups of 4 bits) became more practical.' } }
      ]))
    },
    {
      title: 'Hexadecimal', lessonId: lesson5.id, tags: ['hexadecimal','base-16','radix'],
      contentText: 'The hexadecimal number system (base 16) is widely used in programming and digital systems.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Hexadecimal Number System (Base 16)', level: 2 },
        { type: 'text', text: 'Hexadecimal (hex) uses 16 digits: 0–9 and A–F. Letters A through F represent values 10 through 15. Hex is the most popular shorthand for binary in modern computing.' },
        { type: 'table', table: { headers: ['Hex', 'Decimal', 'Binary'], rows: [['0','0','0000'], ['1','1','0001'], ['2','2','0010'], ['3','3','0011'], ['4','4','0100'], ['5','5','0101'], ['6','6','0110'], ['7','7','0111'], ['8','8','1000'], ['9','9','1001'], ['A','10','1010'], ['B','11','1011'], ['C','12','1100'], ['D','13','1101'], ['E','14','1110'], ['F','15','1111']], caption: 'Hexadecimal Digit Reference' } },
        { type: 'heading', text: 'Positional Value in Hex', level: 3 },
        { type: 'codeBlock', code: 'Hex number: 2  F  4\nPosition:   2  1  0\nPower of 16: 16² 16¹ 16⁰\nValue:      256  16   1\n\n2×256 + 15×16 + 4×1 = 512 + 240 + 4 = 756 (decimal)', language: 'text' },
        { type: 'heading', text: 'Hex ↔ Binary Shortcut', level: 3 },
        { type: 'text', text: 'Since 16 = 2⁴, each hex digit maps to exactly 4 binary bits. This is why hex is the preferred shorthand in modern computing.' },
        { type: 'codeBlock', code: 'Hex → Binary:\n  A    5    F    0\n 1010 0101 1111 0000\n\nBinary → Hex (group in 4s from right):\n1101 0110 1011\n  D    6    B\n\nResult: 110101101011₂ = D6B₁₆', language: 'text' },
        { type: 'heading', text: 'Where Hex Is Used', level: 3 },
        { type: 'list', list: [
          'Memory addresses: 0x7FFFFFFF',
          'CSS/HTML colors: #FF6B9D (R=FF, G=6B, B=9D)',
          'MAC addresses: AA:BB:CC:DD:EE:FF',
          'Unicode characters: U+0041 = "A"',
          'Assembly & machine code: MOV AX, 0x1A3F',
          'Error codes: 0xDEADBEEF'
        ] },
        { type: 'callout', callout: { type: 'important', title: 'Notation Conventions', content: 'Hex numbers are often prefixed with 0x (programming), # (colors), or suffixed with ₁₆ or h (documentation). For example: 0xFF, #FF0000, FFh, and FF₁₆ all mean 255 in decimal.' } }
      ]))
    },
    {
      title: 'Radix Slider Visualizer', lessonId: lesson5.id, tags: ['radix','visualizer','interactive'],
      contentText: 'Understand how the same value looks across different bases using an interactive radix concept.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Radix Slider: Seeing Numbers Across Bases', level: 2 },
        { type: 'text', text: 'The "radix" (base) of a number system determines how many unique digits are available and how place values grow. By changing the radix, you change the representation — but the underlying value stays the same.' },
        { type: 'callout', callout: { type: 'info', title: 'What is a Radix?', content: 'Radix is simply another word for "base." A radix-2 system is binary, radix-8 is octal, radix-10 is decimal, and radix-16 is hexadecimal. Any integer ≥ 2 can be a valid radix!' } },
        { type: 'heading', text: 'The Same Value in Different Bases', level: 3 },
        { type: 'text', text: 'The decimal value 255 looks very different depending on which base you use:' },
        { type: 'table', table: { headers: ['Base (Radix)', 'Representation', 'Digits Used', 'Length'], rows: [['Base 2 (Binary)', '11111111', '0, 1', '8 digits'], ['Base 8 (Octal)', '377', '0-7', '3 digits'], ['Base 10 (Decimal)', '255', '0-9', '3 digits'], ['Base 16 (Hex)', 'FF', '0-F', '2 digits']], caption: 'Decimal 255 Across Different Bases' } },
        { type: 'heading', text: 'How Radix Affects Digit Count', level: 3 },
        { type: 'text', text: 'Higher bases need fewer digits to represent the same value. Lower bases need more digits but use simpler symbols.' },
        { type: 'codeBlock', code: 'Value: 1000 (decimal)\n\nBase 2:  1111101000      (10 digits)\nBase 8:  1750            (4 digits)\nBase 10: 1000            (4 digits)\nBase 16: 3E8             (3 digits)\nBase 32: V8              (2 digits)', language: 'text' },
        { type: 'heading', text: 'Positional Value Formula', level: 3 },
        { type: 'text', text: 'For ANY base b, the value of a number d₃d₂d₁d₀ is:' },
        { type: 'codeBlock', code: 'Value = d₃ × b³ + d₂ × b² + d₁ × b¹ + d₀ × b⁰\n\nExample in base 5: Number 234₅\n= 2×5² + 3×5¹ + 4×5⁰\n= 2×25 + 3×5 + 4×1\n= 50 + 15 + 4\n= 69 (decimal)', language: 'text' },
        { type: 'heading', text: 'Key Relationships Between Bases', level: 3 },
        { type: 'table', table: { headers: ['Relationship', 'Why It Matters'], rows: [['8 = 2³', '1 octal digit = 3 binary bits'], ['16 = 2⁴', '1 hex digit = 4 binary bits'], ['256 = 2⁸', '1 byte = 2 hex digits = 8 binary bits'], ['1024 = 2¹⁰', '1 Kibi (≈1K) in computing']], caption: 'Power-of-2 Base Relationships' } },
        { type: 'callout', callout: { type: 'tip', title: 'Try the Converter Tool!', content: 'Use the Number System Converter in the navigation bar to experiment with converting values between different bases in real-time!' } }
      ]))
    }
  ]});

  // Lesson 6: Types of Number Systems
  const lesson6 = await prisma.lesson.create({ data: { title: 'Types of Number Systems' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'Binary ↔ Decimal', lessonId: lesson6.id, tags: ['binary','decimal','relationship'],
      contentText: 'Understanding the relationship between binary and decimal number systems.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary ↔ Decimal Relationship', level: 2 },
        { type: 'text', text: 'Binary and decimal are the two most important number systems in computing. Decimal is how humans think about numbers; binary is how computers store and process them. Understanding the relationship between them is essential.' },
        { type: 'heading', text: 'How They Relate', level: 3 },
        { type: 'text', text: 'Every decimal number has a binary equivalent and vice versa. The key difference is the base: decimal uses powers of 10, binary uses powers of 2.' },
        { type: 'table', table: { headers: ['Decimal', 'Binary', 'Power Expansion'], rows: [['1', '1', '2⁰'], ['2', '10', '2¹'], ['5', '101', '2² + 2⁰'], ['10', '1010', '2³ + 2¹'], ['42', '101010', '2⁵ + 2³ + 2¹'], ['100', '1100100', '2⁶ + 2⁵ + 2²'], ['255', '11111111', '2⁷ + 2⁶ + ... + 2⁰']], caption: 'Common Decimal-Binary Equivalents' } },
        { type: 'heading', text: 'Quick Mental Conversion', level: 3 },
        { type: 'text', text: 'Memorize the powers of 2 to quickly convert small numbers:' },
        { type: 'codeBlock', code: 'Powers of 2:\n2⁰ = 1      2⁴ = 16     2⁸ = 256\n2¹ = 2      2⁵ = 32     2⁹ = 512\n2² = 4      2⁶ = 64     2¹⁰ = 1024\n2³ = 8      2⁷ = 128    2¹¹ = 2048\n\nTo convert decimal 45 to binary:\n45 = 32 + 8 + 4 + 1\n   = 2⁵ + 2³ + 2² + 2⁰\n   = 101101₂', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Shortcut', content: 'To check if a decimal number is odd or even, just look at the last binary digit (LSB). If it is 1, the number is odd. If 0, it is even.' } }
      ]))
    },
    {
      title: 'Binary ↔ Hex', lessonId: lesson6.id, tags: ['binary','hexadecimal','relationship'],
      contentText: 'Understanding the direct relationship between binary and hexadecimal systems.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary ↔ Hexadecimal Relationship', level: 2 },
        { type: 'text', text: 'Binary and hexadecimal have a special relationship: since 16 = 2⁴, every single hex digit corresponds to exactly 4 binary digits (bits). This makes hex the perfect compact notation for binary data.' },
        { type: 'heading', text: 'The 4-Bit Grouping Rule', level: 3 },
        { type: 'text', text: 'To convert between binary and hex, simply group binary digits in sets of 4 from right to left:' },
        { type: 'codeBlock', code: 'Binary → Hex:\n  1101 0110 1010 1111\n    D    6    A    F\n  Result: D6AF₁₆\n\nHex → Binary:\n  B  →  1011\n  7  →  0111\n  C  →  1100\n  Result: B7C₁₆ = 1011 0111 1100₂', language: 'text' },
        { type: 'heading', text: 'Why Hex Is Preferred Over Binary', level: 3 },
        { type: 'list', list: [
          'A single byte (8 bits) is always exactly 2 hex digits: 11111111₂ = FF₁₆',
          'Memory addresses fit neatly: 32-bit address = 8 hex digits',
          'Much easier to read: 0xDEADBEEF vs 11011110101011011011111011101111',
          'Less error-prone when typing or copying'
        ] },
        { type: 'table', table: { headers: ['Binary (8-bit)', 'Hex', 'Decimal', 'Use Case'], rows: [['00000000', '00', '0', 'Null / zero'], ['01000001', '41', '65', 'ASCII "A"'], ['11111111', 'FF', '255', 'Max byte value'], ['10101010', 'AA', '170', 'Test pattern'], ['11001010', 'CA', '202', 'IPv4 octet example']], caption: 'Real-World Binary ↔ Hex Examples' } },
        { type: 'callout', callout: { type: 'important', title: 'Key Insight', content: 'Every hex digit is exactly one nibble (4 bits). Two hex digits make one byte (8 bits). This 1:4 ratio is why hex dominates systems programming.' } }
      ]))
    },
    {
      title: 'Digit Groupings', lessonId: lesson6.id, tags: ['grouping','nibble','byte'],
      contentText: 'How binary digits are grouped into nibbles, bytes, and words.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Digit Groupings in Binary', level: 2 },
        { type: 'text', text: 'Binary digits are organized into standard groups for convenience, clarity, and hardware alignment. These groupings form the building blocks of computer architecture.' },
        { type: 'heading', text: 'Standard Groupings', level: 3 },
        { type: 'table', table: { headers: ['Name', 'Size', 'Hex Digits', 'Range (Unsigned)', 'Example'], rows: [['Bit', '1 bit', '¼', '0–1', '1'], ['Nibble', '4 bits', '1', '0–15', '1010 = A'], ['Byte', '8 bits', '2', '0–255', '11001010 = CA'], ['Word', '16 bits', '4', '0–65,535', '1010 1100 0011 1111 = AC3F'], ['Double Word', '32 bits', '8', '0–4,294,967,295', '8 hex digits'], ['Quad Word', '64 bits', '16', '0–18.4 quintillion', '16 hex digits']], caption: 'Binary Group Sizes' } },
        { type: 'heading', text: 'Why Grouping Matters', level: 3 },
        { type: 'text', text: 'Grouping binary digits makes long binary strings readable and maps directly to how hardware processes data:' },
        { type: 'codeBlock', code: 'Without grouping (hard to read):\n1101001011110000101010011100\n\nGrouped in nibbles (much better):\n1101 0010 1111 0000 1010 1001 1100\n  D    2    F    0    A    9    C\n\nGrouped in bytes:\n11010010 11110000 10101001 1100xxxx\n   D2       F0       A9      C0', language: 'text' },
        { type: 'heading', text: 'Octal Groupings (3-bit)', level: 3 },
        { type: 'text', text: 'Octal groups binary digits in sets of 3, which is useful for Unix permissions:' },
        { type: 'codeBlock', code: 'Binary:  111 101 101\nOctal:    7   5   5\n\nThis is \"chmod 755\" — rwxr-xr-x', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Memory Aid', content: 'Nibble = 4 bits (half a byte — think "a nibble is half a bite/byte"). Byte = 8 bits. This naming pattern is one of computing\'s best puns!' } }
      ]))
    },
    {
      title: 'Color-coded Comparison Grid', lessonId: lesson6.id, tags: ['comparison','visual','grid'],
      contentText: 'A visual side-by-side comparison of all four number systems.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Number System Comparison Grid', level: 2 },
        { type: 'text', text: 'This comprehensive grid shows the same values represented across all four major number systems. Use it as a reference to see patterns and relationships between bases.' },
        { type: 'heading', text: 'Complete Comparison: 0–20', level: 3 },
        { type: 'table', table: { headers: ['Decimal', 'Binary', 'Octal', 'Hex'], rows: [['0','0000','0','0'], ['1','0001','1','1'], ['2','0010','2','2'], ['3','0011','3','3'], ['4','0100','4','4'], ['5','0101','5','5'], ['6','0110','6','6'], ['7','0111','7','7'], ['8','1000','10','8'], ['9','1001','11','9'], ['10','1010','12','A'], ['11','1011','13','B'], ['12','1100','14','C'], ['13','1101','15','D'], ['14','1110','16','E'], ['15','1111','17','F'], ['16','10000','20','10'], ['17','10001','21','11'], ['18','10010','22','12'], ['19','10011','23','13'], ['20','10100','24','14']], caption: 'Values 0–20 in All Four Bases' } },
        { type: 'heading', text: 'Key Milestone Values', level: 3 },
        { type: 'table', table: { headers: ['Decimal', 'Binary', 'Octal', 'Hex', 'Significance'], rows: [['0','0','0','0','Zero in all systems'], ['7','111','7','7','Largest single octal digit'], ['8','1000','10','8','First octal carry-over'], ['15','1111','17','F','Largest single hex digit / max nibble'], ['16','10000','20','10','First hex carry-over'], ['127','1111111','177','7F','Max signed byte (7 bits)'], ['128','10000000','200','80','MSB of a byte'], ['255','11111111','377','FF','Max unsigned byte'], ['256','100000000','400','100','First 9-bit value']], caption: 'Important Boundary Values' } },
        { type: 'heading', text: 'Patterns to Notice', level: 3 },
        { type: 'list', list: [
          'Octal "carries" at 8 (after 7 → 10), hex carries at 16 (after F → 10)',
          'Binary adds a digit at every power of 2 (2, 4, 8, 16, 32...)',
          'Hex digits 0–F cover exactly the same range as 4 binary digits (0000–1111)',
          'Octal digits 0–7 cover exactly 3 binary digits (000–111)',
          'The value 255 (FF in hex, 377 in octal) is "all ones" in an 8-bit byte'
        ] },
        { type: 'callout', callout: { type: 'important', title: 'Study Tip', content: 'Try covering one column and converting mentally from another. This builds fluency that is essential for systems programming and debugging.' } }
      ]))
    }
  ]});

  // Lesson 7: Conversion of Number Systems
  const lesson7 = await prisma.lesson.create({ data: { title: 'Conversion of Number Systems' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'Decimal to Binary', lessonId: lesson7.id, tags: ['conversion','decimal','binary'],
      contentText: 'Convert decimal numbers to binary using the division-remainder method.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Decimal to Binary Conversion', level: 2 },
        { type: 'text', text: 'To convert a decimal number to binary, repeatedly divide by 2 and record the remainders. Read the remainders from bottom to top to get the binary result.' },
        { type: 'heading', text: 'The Division-Remainder Method', level: 3 },
        { type: 'codeBlock', code: 'Convert 45₁₀ to Binary:\n\n45 ÷ 2 = 22  remainder 1  ↑\n22 ÷ 2 = 11  remainder 0  |\n11 ÷ 2 = 5   remainder 1  |\n 5 ÷ 2 = 2   remainder 1  | Read\n 2 ÷ 2 = 1   remainder 0  | upward\n 1 ÷ 2 = 0   remainder 1  |\n\nResult: 45₁₀ = 101101₂', language: 'text' },
        { type: 'heading', text: 'The Subtraction Method (Alternative)', level: 3 },
        { type: 'text', text: 'Find the largest power of 2 that fits, subtract it, and repeat:' },
        { type: 'codeBlock', code: 'Convert 200₁₀ to Binary:\n\n200 - 128 (2⁷) = 72  → bit 7 = 1\n 72 -  64 (2⁶) =  8  → bit 6 = 1\n  8 -   8 (2³) =  0  → bit 3 = 1\n                        All other bits = 0\n\nResult: 200₁₀ = 11001000₂', language: 'text' },
        { type: 'heading', text: 'Practice Examples', level: 3 },
        { type: 'table', table: { headers: ['Decimal', 'Division Steps', 'Binary'], rows: [['10', '10→5→2→1→0 (R: 0,1,0,1)', '1010'], ['25', '25→12→6→3→1→0 (R: 1,0,0,1,1)', '11001'], ['100', '100→50→25→12→6→3→1→0', '1100100'], ['255', '8 divisions, all R=1', '11111111']], caption: 'Decimal to Binary Practice' } },
        { type: 'callout', callout: { type: 'tip', title: 'Verification', content: 'Always verify your answer by converting back: add up the powers of 2 where there is a 1. For 101101₂: 32+8+4+1 = 45 ✓' } }
      ]))
    },
    {
      title: 'Binary to Decimal', lessonId: lesson7.id, tags: ['conversion','binary','decimal'],
      contentText: 'Convert binary numbers to decimal using positional expansion.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary to Decimal Conversion', level: 2 },
        { type: 'text', text: 'To convert binary to decimal, multiply each bit by its positional power of 2 and sum all the values. This is called "positional expansion."' },
        { type: 'heading', text: 'Step-by-Step Method', level: 3 },
        { type: 'codeBlock', code: 'Convert 11010110₂ to Decimal:\n\nPosition:  7   6   5   4   3   2   1   0\nBits:      1   1   0   1   0   1   1   0\nPower:    128  64  32  16   8   4   2   1\n\nSum only where bit = 1:\n128 + 64 + 16 + 4 + 2 = 214\n\nResult: 11010110₂ = 214₁₀', language: 'text' },
        { type: 'heading', text: 'The Doubling Method (Alternative)', level: 3 },
        { type: 'text', text: 'Start from the leftmost bit. Double the running total and add the next bit:' },
        { type: 'codeBlock', code: 'Convert 101101₂ using doubling:\n\nStart with 0\n0 × 2 + 1 = 1\n1 × 2 + 0 = 2\n2 × 2 + 1 = 5\n5 × 2 + 1 = 11\n11 × 2 + 0 = 22\n22 × 2 + 1 = 45\n\nResult: 101101₂ = 45₁₀', language: 'text' },
        { type: 'heading', text: 'Practice Examples', level: 3 },
        { type: 'table', table: { headers: ['Binary', 'Expansion', 'Decimal'], rows: [['1001', '8+1', '9'], ['10110', '16+4+2', '22'], ['1111111', '64+32+16+8+4+2+1', '127'], ['10000000', '128', '128']], caption: 'Binary to Decimal Practice' } },
        { type: 'callout', callout: { type: 'info', title: 'Two Methods, Same Result', content: 'The positional expansion method is more intuitive. The doubling method is faster for mental math and is actually how computers process binary internally (shift and add).' } }
      ]))
    },
    {
      title: 'Hex Conversion', lessonId: lesson7.id, tags: ['conversion','hexadecimal','binary','decimal'],
      contentText: 'Convert between hexadecimal and other number systems.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Hexadecimal Conversions', level: 2 },
        { type: 'heading', text: 'Hex ↔ Binary (Direct, 4-bit groups)', level: 3 },
        { type: 'text', text: 'This is the fastest conversion — each hex digit maps to exactly 4 bits:' },
        { type: 'codeBlock', code: 'Hex → Binary:\nA3F₁₆ → A=1010  3=0011  F=1111\nResult: 1010 0011 1111₂\n\nBinary → Hex:\n1101 1011 0010₂ → D=1101  B=1011  2=0010\nResult: DB2₁₆', language: 'text' },
        { type: 'heading', text: 'Hex → Decimal (Positional expansion)', level: 3 },
        { type: 'codeBlock', code: 'Convert 1F4₁₆ to Decimal:\n\n1 × 16² + F × 16¹ + 4 × 16⁰\n= 1 × 256 + 15 × 16 + 4 × 1\n= 256 + 240 + 4\n= 500₁₀', language: 'text' },
        { type: 'heading', text: 'Decimal → Hex (Division by 16)', level: 3 },
        { type: 'codeBlock', code: 'Convert 750₁₀ to Hex:\n\n750 ÷ 16 = 46  remainder 14 (E)  ↑\n 46 ÷ 16 = 2   remainder 14 (E)  | Read\n  2 ÷ 16 = 0   remainder 2  (2)  | upward\n\nResult: 750₁₀ = 2EE₁₆\n\nVerify: 2×256 + 14×16 + 14×1 = 512 + 224 + 14 = 750 ✓', language: 'text' },
        { type: 'heading', text: 'Hex ↔ Octal (via Binary)', level: 3 },
        { type: 'text', text: 'There is no direct shortcut between hex and octal. Convert through binary as an intermediate step:' },
        { type: 'codeBlock', code: 'Convert 5A₁₆ to Octal:\n\nStep 1 — Hex → Binary (4-bit groups):\n  5 = 0101,  A = 1010\n  Binary: 01011010₂\n\nStep 2 — Binary → Octal (3-bit groups):\n  001 011 010\n   1   3   2\n  Octal: 132₈\n\nResult: 5A₁₆ = 132₈', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Best Path', content: 'When converting between any two bases, the fastest route often goes through binary. Hex↔Binary and Octal↔Binary are instant, then you just regroup the bits.' } }
      ]))
    },
    {
      title: 'Step-by-step Conversion Trees', lessonId: lesson7.id, tags: ['conversion','tree','visual'],
      contentText: 'Visualize conversion paths between all number systems.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Conversion Trees: Choosing the Best Path', level: 2 },
        { type: 'text', text: 'Not all conversion paths are equal. Some are direct and fast; others require intermediate steps. A conversion tree helps you pick the most efficient route.' },
        { type: 'heading', text: 'The Conversion Map', level: 3 },
        { type: 'codeBlock', code: '           DECIMAL\n          /       \\\n    ÷2,×2         ÷16,×16\n        /           \\\n    BINARY ←———→ HEXADECIMAL\n    (4-bit groups)\n        \\\n    (3-bit groups)\n          \\\n         OCTAL', language: 'text' },
        { type: 'heading', text: 'Best Conversion Routes', level: 3 },
        { type: 'table', table: { headers: ['From', 'To', 'Best Method', 'Speed'], rows: [['Binary', 'Hex', 'Group 4 bits → map to hex digit', '⚡ Instant'], ['Hex', 'Binary', 'Each hex digit → 4 bits', '⚡ Instant'], ['Binary', 'Octal', 'Group 3 bits → map to octal digit', '⚡ Instant'], ['Octal', 'Binary', 'Each octal digit → 3 bits', '⚡ Instant'], ['Decimal', 'Binary', 'Repeated ÷2, read remainders up', '🔄 Medium'], ['Binary', 'Decimal', 'Sum positional powers of 2', '🔄 Medium'], ['Decimal', 'Hex', 'Repeated ÷16, read remainders up', '🔄 Medium'], ['Hex', 'Decimal', 'Sum positional powers of 16', '🔄 Medium'], ['Hex', 'Octal', 'Hex → Binary → Octal (regroup)', '🐢 Two steps'], ['Octal', 'Hex', 'Octal → Binary → Hex (regroup)', '🐢 Two steps']], caption: 'Optimal Conversion Routes' } },
        { type: 'heading', text: 'Complete Worked Example', level: 3 },
        { type: 'text', text: 'Convert decimal 500 to all other bases:' },
        { type: 'codeBlock', code: 'Decimal 500:\n\n→ Binary (÷2 method):\n  500→250→125→62→31→15→7→3→1→0\n  R:  0   0   1  0  1  1 1 1 1\n  = 111110100₂\n\n→ Hex (group binary in 4s):\n  0001 1111 0100\n    1    F    4\n  = 1F4₁₆\n\n→ Octal (group binary in 3s):\n  111 110 100\n   7   6   4\n  = 764₈\n\n✓ Verify all equal 500:\n  Binary: 256+128+64+32+16+4 = 500\n  Hex: 1×256 + 15×16 + 4 = 500\n  Octal: 7×64 + 6×8 + 4 = 500', language: 'text' },
        { type: 'callout', callout: { type: 'important', title: 'Golden Rule', content: 'Binary is the universal hub. When in doubt, convert to binary first, then regroup bits for the target base. Hex uses 4-bit groups, octal uses 3-bit groups.' } }
      ]))
    }
  ]});

  // Lesson 8: Binary Arithmetic
  const lesson8 = await prisma.lesson.create({ data: { title: 'Binary Arithmetic' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'Binary Addition', lessonId: lesson8.id, tags: ['addition','arithmetic','carry'],
      contentText: 'Learn how to add binary numbers using carry rules.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary Addition', level: 2 },
        { type: 'text', text: 'Binary addition follows the same principles as decimal addition, but with only two digits (0 and 1). When a column sums to 2 or more, you carry to the next column.' },
        { type: 'heading', text: 'The Four Addition Rules', level: 3 },
        { type: 'table', table: { headers: ['A', 'B', 'Sum', 'Carry'], rows: [['0','0','0','0'], ['0','1','1','0'], ['1','0','1','0'], ['1','1','0','1']], caption: 'Binary Addition Rules' } },
        { type: 'callout', callout: { type: 'info', title: 'Key Rule', content: '1 + 1 = 10 in binary (that is 0, carry 1). Think of it like 5 + 5 = 10 in decimal — you write 0 and carry 1.' } },
        { type: 'heading', text: 'Worked Example', level: 3 },
        { type: 'codeBlock', code: '  Add: 1011 (11) + 0110 (6)\n\n    Carry: 1 1 1 0\n           1 0 1 1\n         + 0 1 1 0\n         ─────────\n         1 0 0 0 1\n\n  Result: 10001₂ = 17₁₀\n  Verify: 11 + 6 = 17 ✓', language: 'text' },
        { type: 'heading', text: 'Multi-bit Example', level: 3 },
        { type: 'codeBlock', code: '  Add: 11011011 (219) + 01101010 (106)\n\n    Carry: 1 1 1 1 1 0 1 0\n           1 1 0 1 1 0 1 1\n         + 0 1 1 0 1 0 1 0\n         ─────────────────\n       1 0 1 0 0 0 1 0 1\n\n  Result: 101000101₂ = 325₁₀\n  Verify: 219 + 106 = 325 ✓', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Carry Chain', content: 'When you have 1 + 1 + carry(1) = 11₂, you write 1 and carry 1. Multiple carries in a row create a "carry chain" — this is what limits the speed of hardware adders.' } }
      ]))
    },
    {
      title: 'Subtraction', lessonId: lesson8.id, tags: ['subtraction','arithmetic','borrow'],
      contentText: 'Learn binary subtraction using the borrow method.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary Subtraction', level: 2 },
        { type: 'text', text: 'Binary subtraction works like decimal subtraction. When you subtract a larger digit from a smaller one, you borrow from the next column.' },
        { type: 'heading', text: 'The Four Subtraction Rules', level: 3 },
        { type: 'table', table: { headers: ['A', 'B', 'Difference', 'Borrow'], rows: [['0','0','0','0'], ['0','1','1','1 (borrow)'], ['1','0','1','0'], ['1','1','0','0']], caption: 'Binary Subtraction Rules' } },
        { type: 'callout', callout: { type: 'info', title: 'Borrow Rule', content: '0 − 1 requires a borrow: take 1 from the next column (worth 2 in the current column), so 10₂ − 1₂ = 1₂.' } },
        { type: 'heading', text: 'Worked Example', level: 3 },
        { type: 'codeBlock', code: '  Subtract: 1101 (13) − 0101 (5)\n\n           1 1 0 1\n         − 0 1 0 1\n         ─────────\n           1 0 0 0\n\n  Column 0: 1 − 1 = 0\n  Column 1: 0 − 0 = 0\n  Column 2: 1 − 1 = 0\n  Column 3: 1 − 0 = 1\n\n  Result: 1000₂ = 8₁₀\n  Verify: 13 − 5 = 8 ✓', language: 'text' },
        { type: 'heading', text: 'Example with Borrow', level: 3 },
        { type: 'codeBlock', code: '  Subtract: 10010 (18) − 01011 (11)\n\n  Borrow:  0  1  0  0  0\n           1  0  0  1  0\n         − 0  1  0  1  1\n         ────────────────\n           0  0  1  1  1\n\n  Result: 00111₂ = 7₁₀\n  Verify: 18 − 11 = 7 ✓', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Shortcut', content: 'In hardware, subtraction is rarely done directly. Instead, computers use 2\'s complement addition (covered in the Complements lesson) to perform subtraction using addition circuits.' } }
      ]))
    },
    {
      title: 'Multiplication', lessonId: lesson8.id, tags: ['multiplication','arithmetic','shift'],
      contentText: 'Learn binary multiplication using shift-and-add.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary Multiplication', level: 2 },
        { type: 'text', text: 'Binary multiplication is simpler than decimal because each digit is either 0 or 1. Multiplying by 0 gives 0, multiplying by 1 gives the number itself. The process is: multiply, shift, then add.' },
        { type: 'heading', text: 'Multiplication Rules', level: 3 },
        { type: 'table', table: { headers: ['A', 'B', 'A × B'], rows: [['0','0','0'], ['0','1','0'], ['1','0','0'], ['1','1','1']], caption: 'Binary Multiplication (same as AND gate!)' } },
        { type: 'heading', text: 'Worked Example', level: 3 },
        { type: 'codeBlock', code: '  Multiply: 1101 (13) × 1011 (11)\n\n           1 1 0 1       (13)\n         × 1 0 1 1       (11)\n         ─────────\n           1 1 0 1       (1101 × 1)\n         1 1 0 1 0       (1101 × 1, shifted left 1)\n       0 0 0 0 0 0       (1101 × 0, shifted left 2)\n     1 1 0 1 0 0 0       (1101 × 1, shifted left 3)\n     ─────────────\n   1 0 0 0 1 1 1 1\n\n  Result: 10001111₂ = 143₁₀\n  Verify: 13 × 11 = 143 ✓', language: 'text' },
        { type: 'callout', callout: { type: 'important', title: 'Connection to Hardware', content: 'Binary multiplication is just shift-and-add. This maps directly to hardware: shifting is free (just rewiring), and addition uses adder circuits. This is why computers multiply using shift registers and adders.' } }
      ]))
    },
    {
      title: 'Division', lessonId: lesson8.id, tags: ['division','arithmetic','quotient'],
      contentText: 'Learn binary division using repeated subtraction.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary Division', level: 2 },
        { type: 'text', text: 'Binary division works like long division in decimal. You compare, subtract, and bring down the next bit. Each quotient bit is either 0 (divisor does not fit) or 1 (divisor fits).' },
        { type: 'heading', text: 'Worked Example', level: 3 },
        { type: 'codeBlock', code: '  Divide: 10110 (22) ÷ 11 (3)\n\n          ┌───────\n     11 ) │ 1 0 1 1 0\n          │ \n  Step 1: 10 ÷ 11 → 0 (11 > 10, doesn\'t fit)\n  Step 2: 101 ÷ 11 → 1 (11 ≤ 101)\n          101 − 11 = 10\n  Step 3: 101 ÷ 11 → 1 (bring down 1, 101 ÷ 11)\n          101 − 11 = 10\n  Step 4: 100 ÷ 11 → 1 (bring down 0, 100 ÷ 11)\n          100 − 11 = 1\n\n  Quotient:  0111₂ = 7₁₀\n  Remainder: 1₂ = 1₁₀\n  Verify: 3 × 7 + 1 = 22 ✓', language: 'text' },
        { type: 'heading', text: 'Simple Example', level: 3 },
        { type: 'codeBlock', code: '  Divide: 1100 (12) ÷ 10 (2)\n\n     10 ) │ 1 1 0 0\n  \n  11 ÷ 10 = 1, remainder 1\n  10 ÷ 10 = 1, remainder 0\n  00 ÷ 10 = 0, remainder 0\n\n  Quotient:  110₂ = 6₁₀\n  Remainder: 0\n  Verify: 2 × 6 = 12 ✓', language: 'text' },
        { type: 'callout', callout: { type: 'tip', title: 'Division by Powers of 2', content: 'Dividing by 2 is just shifting right by 1 bit. Dividing by 4 = shift right by 2. Dividing by 2ⁿ = shift right by n bits. The bits that \"fall off\" become the remainder.' } }
      ]))
    },
    {
      title: 'Carry/Borrow Animation', lessonId: lesson8.id, tags: ['carry','borrow','visual','animation'],
      contentText: 'Visualize how carries and borrows propagate through binary arithmetic.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Understanding Carries and Borrows', level: 2 },
        { type: 'text', text: 'Carries (in addition) and borrows (in subtraction) are the core mechanics of binary arithmetic. Understanding how they propagate is key to mastering binary math and understanding hardware limitations.' },
        { type: 'heading', text: 'Carry Propagation in Addition', level: 3 },
        { type: 'codeBlock', code: '  Adding 1111 + 0001 (15 + 1):\n\n  Step 1: Col 0 → 1+1 = 10    write 0, carry 1 →\n  Step 2: Col 1 → 1+0+1 = 10  write 0, carry 1 →\n  Step 3: Col 2 → 1+0+1 = 10  write 0, carry 1 →\n  Step 4: Col 3 → 1+0+1 = 10  write 0, carry 1 →\n  Step 5: Col 4 → carry = 1   write 1\n\n  Result: 10000₂ = 16₁₀\n\n  The carry rippled through ALL 4 columns!\n  This is called a \"carry chain\" or \"carry ripple.\"', language: 'text' },
        { type: 'heading', text: 'Borrow Propagation in Subtraction', level: 3 },
        { type: 'codeBlock', code: '  Subtracting 10000 − 00001 (16 − 1):\n\n  Step 1: Col 0 → 0−1 → borrow! → 10−1 = 1\n  Step 2: Col 1 → 0−0−borrow → borrow! → 10−1 = 1\n  Step 3: Col 2 → 0−0−borrow → borrow! → 10−1 = 1\n  Step 4: Col 3 → 0−0−borrow → borrow! → 10−1 = 1\n  Step 5: Col 4 → 1−0−borrow = 0\n\n  Result: 01111₂ = 15₁₀\n\n  The borrow rippled through ALL 4 columns!\n  Mirror image of the carry chain.', language: 'text' },
        { type: 'heading', text: 'Overflow: When Carries Go Too Far', level: 3 },
        { type: 'text', text: 'If you are working with a fixed number of bits (e.g., 8 bits), a carry out of the highest bit causes overflow — the result does not fit:' },
        { type: 'codeBlock', code: '  8-bit addition: 11111111 + 00000001 (255 + 1)\n\n  Carry ripples through all 8 bits:\n  Result: 1 00000000\n          ↑\n     overflow bit (9th bit)\n\n  In 8 bits: 00000000 = 0 (WRONG!)\n  The correct answer (256) needs 9 bits.\n  This is called arithmetic overflow.', language: 'text' },
        { type: 'table', table: { headers: ['Scenario', 'Pattern', 'What Happens'], rows: [['Max carry chain', '1111 + 1', 'Carry ripples through every column'], ['No carry', '1010 + 0101', 'No carries at all (digits never both 1)'], ['Partial carry', '1010 + 0110', 'Carry in some columns only'], ['Overflow (8-bit)', '11111111 + 1', 'Result exceeds 8 bits']], caption: 'Carry Chain Patterns' } },
        { type: 'callout', callout: { type: 'important', title: 'Hardware Impact', content: 'Carry chains are the bottleneck in addition circuits. A "ripple carry adder" is slow because it waits for carries to propagate. Modern CPUs use "carry lookahead adders" that predict carries in parallel for much faster addition.' } }
      ]))
    }
  ]});

  // Lesson 9: Complements
  const lesson9 = await prisma.lesson.create({ data: { title: 'Complements' } });
  await prisma.topic.createMany({ data: [
    {
      title: "1's Complement", lessonId: lesson9.id, tags: ['complement','ones','inversion'],
      contentText: "Understanding 1's complement representation by inverting all bits.",
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: "1's Complement", level: 2 },
        { type: 'text', text: "1's complement is the simplest way to represent negative numbers in binary. To find the 1's complement, simply flip (invert) every bit: 0 becomes 1, and 1 becomes 0." },
        { type: 'heading', text: "How to Find 1's Complement", level: 3 },
        { type: 'codeBlock', code: "Original:       0 1 0 1 1 0 1 0  (90)\nFlip all bits:   1 0 1 0 0 1 0 1  (-90 in 1's complement)\n\nOriginal:       0 0 0 0 1 1 0 0  (12)\nFlip all bits:   1 1 1 1 0 0 1 1  (-12 in 1's complement)", language: 'text' },
        { type: 'heading', text: "Interpreting 1's Complement Numbers", level: 3 },
        { type: 'text', text: "In 1's complement, the MSB (most significant bit) indicates the sign: 0 = positive, 1 = negative." },
        { type: 'table', table: { headers: ['Binary (8-bit)', "1's Complement Value", 'Type'], rows: [['00000000', '+0', 'Positive zero'], ['00000001', '+1', 'Positive'], ['01111111', '+127', 'Max positive'], ['10000000', '-127', 'Min negative'], ['11111110', '-1', 'Negative'], ['11111111', '-0', 'Negative zero']], caption: "1's Complement Range (8-bit)" } },
        { type: 'callout', callout: { type: 'warning', title: 'The Double Zero Problem', content: "1's complement has two representations for zero: 00000000 (+0) and 11111111 (-0). This complicates hardware design and is why 2's complement is preferred." } },
        { type: 'heading', text: '8-bit Range', level: 3 },
        { type: 'text', text: "With n bits, 1's complement can represent values from -(2^(n-1) - 1) to +(2^(n-1) - 1). For 8 bits: -127 to +127." }
      ]))
    },
    {
      title: "2's Complement", lessonId: lesson9.id, tags: ['complement','twos','negative'],
      contentText: "Understanding 2's complement -- the standard method for signed binary in modern computers.",
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: "2's Complement", level: 2 },
        { type: 'text', text: "2's complement is the standard representation for signed integers in virtually all modern computers. To find the 2's complement: invert all bits (1's complement), then add 1." },
        { type: 'heading', text: "How to Find 2's Complement", level: 3 },
        { type: 'codeBlock', code: "Step 1: Start with the positive number\n  00010100  (20 in decimal)\n\nStep 2: Invert all bits (1's complement)\n  11101011\n\nStep 3: Add 1\n  11101011\n+ 00000001\n----------\n  11101100  (-20 in 2's complement)\n\nVerify: 11101100 + 00010100 = 100000000\n  (The 9th bit overflows, leaving 00000000 = 0) checkmark", language: 'text' },
        { type: 'heading', text: "2's Complement Range (8-bit)", level: 3 },
        { type: 'table', table: { headers: ['Binary', 'Decimal', 'Note'], rows: [['01111111', '+127', 'Maximum positive'], ['01111110', '+126', ''], ['00000001', '+1', ''], ['00000000', '0', 'Only one zero!'], ['11111111', '-1', ''], ['11111110', '-2', ''], ['10000001', '-127', ''], ['10000000', '-128', 'Minimum negative']], caption: "2's Complement Values (8-bit: -128 to +127)" } },
        { type: 'callout', callout: { type: 'important', title: "Why 2's Complement Wins", content: "2's complement solves the double-zero problem (only one zero), has a wider range (-128 to +127 for 8 bits), and allows addition/subtraction to use the same circuit -- no special handling for negative numbers!" } },
        { type: 'heading', text: 'Negation Shortcut', level: 3 },
        { type: 'text', text: "To negate any number in 2's complement, invert and add 1. This works in both directions:" },
        { type: 'codeBlock', code: "+20 to -20:\n  00010100 -> invert -> 11101011 -> +1 -> 11101100\n\n-20 to +20:\n  11101100 -> invert -> 00010011 -> +1 -> 00010100\n\nWorks both ways!", language: 'text' }
      ]))
    },
    {
      title: 'Bit Inversion', lessonId: lesson9.id, tags: ['inversion','NOT','flip'],
      contentText: 'Understanding bit inversion (NOT operation) as the foundation of complements.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Bit Inversion (NOT Operation)', level: 2 },
        { type: 'text', text: 'Bit inversion -- flipping every 0 to 1 and every 1 to 0 -- is the fundamental building block of both complement systems. In hardware, this is performed by the NOT gate.' },
        { type: 'heading', text: 'The NOT Operation', level: 3 },
        { type: 'table', table: { headers: ['Input', 'Output (Inverted)'], rows: [['0', '1'], ['1', '0']], caption: 'NOT Gate Truth Table' } },
        { type: 'heading', text: 'Byte-level Inversion', level: 3 },
        { type: 'codeBlock', code: "Original:  0 1 1 0 1 0 0 1  (0x69 = 105)\nInverted:  1 0 0 1 0 1 1 0  (0x96 = 150)\n\nNotice: Original + Inverted = 11111111 (255)\nAlways true! A number plus its inversion = all 1s.", language: 'text' },
        { type: 'heading', text: 'Inversion Properties', level: 3 },
        { type: 'list', list: [
          'NOT(NOT(x)) = x -- double inversion returns the original',
          'x + NOT(x) = all 1s (e.g., 11111111 for 8 bits)',
          'NOT(0) = all 1s, NOT(all 1s) = 0',
          'Inversion is instant in hardware -- just one NOT gate per bit'
        ] },
        { type: 'heading', text: 'Connection to Complements', level: 3 },
        { type: 'codeBlock', code: "                    Bit Inversion\n                   (NOT operation)\n                         |\n            +------------+------------+\n            |                         |\n      1's Complement            2's Complement\n      (just invert)           (invert + add 1)\n            |                         |\n     Double zero problem       Single zero\n     Rarely used today         Used everywhere", language: 'text' },
        { type: 'callout', callout: { type: 'info', title: 'In Programming', content: "In most languages, the bitwise NOT operator is ~ (tilde). For example: ~0b01101001 = 0b10010110. In C/Java: ~105 gives -106 (in 2's complement, ~x = -(x+1))." } }
      ]))
    },
    {
      title: 'Cascading +1 Animation', lessonId: lesson9.id, tags: ['cascade','add-one','animation'],
      contentText: "Visualize the +1 step in 2's complement and understand how the carry cascades.",
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: "The Cascading +1 in 2's Complement", level: 2 },
        { type: 'text', text: "The +1 step in 2's complement seems simple, but when the inverted number ends in a string of 1s, the carry cascades through multiple bits -- just like adding 1 to 999 in decimal." },
        { type: 'heading', text: 'Simple Case: No Cascade', level: 3 },
        { type: 'codeBlock', code: "Finding -6 in 2's complement (8-bit):\n\n  +6:       00000110\n  Invert:   11111001\n  Add 1:  + 00000001\n           ---------\n  Result:   11111010  <- only bit 0 changed\n\n  The 1 was absorbed immediately (0+1=1).\n  No cascade needed.", language: 'text' },
        { type: 'heading', text: 'Cascade Case: Multiple Bits Change', level: 3 },
        { type: 'codeBlock', code: "Finding -8 in 2's complement (8-bit):\n\n  +8:       00001000\n  Invert:   11110111\n  Add 1:  + 00000001\n           ---------\n  Step 1: bit 0: 1+1 = 10 -> write 0, carry 1\n  Step 2: bit 1: 1+0+1 = 10 -> write 0, carry 1\n  Step 3: bit 2: 1+0+1 = 10 -> write 0, carry 1\n  Step 4: bit 3: 0+0+1 = 1  -> write 1, STOP\n\n  Result:   11111000\n  \n  The carry cascaded through 3 bits!", language: 'text' },
        { type: 'heading', text: 'The Pattern', level: 3 },
        { type: 'table', table: { headers: ['Number', 'Inverted ends in...', '+1 Cascade Length', 'Result'], rows: [['+1', '...0', '0 bits', '-1 = 11111111'], ['+2', '...01', '0 bits', '-2 = 11111110'], ['+4', '...011', '1 bit', '-4 = 11111100'], ['+8', '...0111', '3 bits', '-8 = 11111000'], ['+16', '...01111', '4 bits', '-16 = 11110000'], ['+32', '...011111', '5 bits', '-32 = 11100000']], caption: 'Cascade Length = Number of Trailing 1s After Inversion' } },
        { type: 'callout', callout: { type: 'tip', title: 'Shortcut Rule', content: "Instead of invert-then-add-1, use this shortcut: scan from the right, keep all bits up to and including the first 1 unchanged, then flip everything to the left. Example: 00101000 -> keep '1000', flip '0010' -> 11011000." } }
      ]))
    }
  ]});

  console.log('Seeded 9 lessons with 34 topics successfully!');
  console.log(`  Lesson 1 (id=${lesson1.id}): Intro to Boolean Algebra - 3 topics`);
  console.log(`  Lesson 2 (id=${lesson2.id}): Logic Gates - 3 topics`);
  console.log(`  Lesson 3 (id=${lesson3.id}): Truth Tables - 3 topics`);
  console.log(`  Lesson 4 (id=${lesson4.id}): Simplification - 3 topics`);

  // Lesson 10: Signed and Unsigned Numbers
  const lesson10 = await prisma.lesson.create({ data: { title: 'Signed and Unsigned Numbers' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'MSB (Most Significant Bit)', lessonId: lesson10.id, tags: ['msb','sign','bit'],
      contentText: 'The MSB determines the sign in signed representations and the highest value in unsigned.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'MSB: The Most Significant Bit', level: 2 },
        { type: 'text', text: 'The Most Significant Bit (MSB) is the leftmost bit in a binary number. Its role changes depending on whether the number is interpreted as signed or unsigned.' },
        { type: 'heading', text: 'MSB in Unsigned Numbers', level: 3 },
        { type: 'text', text: 'In unsigned representation, the MSB is simply the highest-value bit:' },
        { type: 'codeBlock', code: '8-bit unsigned: MSB = bit 7 = 2^7 = 128\n\n  1 0 0 0 0 0 0 0 = 128\n  ^\n  MSB contributes 128 to the value\n\n  1 1 1 1 1 1 1 1 = 255 (max unsigned 8-bit)\n  ^\n  MSB still just contributes 128', language: 'text' },
        { type: 'heading', text: 'MSB in Signed Numbers (2\'s Complement)', level: 3 },
        { type: 'text', text: 'In signed representation, the MSB becomes the sign bit:' },
        { type: 'codeBlock', code: 'MSB = 0 -> Positive number\nMSB = 1 -> Negative number\n\n  0 1 1 1 1 1 1 1 = +127 (max positive)\n  ^\n  MSB = 0 -> positive\n\n  1 0 0 0 0 0 0 0 = -128 (min negative)\n  ^\n  MSB = 1 -> negative', language: 'text' },
        { type: 'table', table: { headers: ['Binary', 'MSB', 'Unsigned Value', 'Signed Value'], rows: [['01111111', '0', '127', '+127'], ['10000000', '1', '128', '-128'], ['11111111', '1', '255', '-1'], ['00000000', '0', '0', '0'], ['10000001', '1', '129', '-127']], caption: 'Same Bits, Different Interpretation Based on MSB' } },
        { type: 'callout', callout: { type: 'important', title: 'Key Insight', content: 'The MSB does NOT change. What changes is how we INTERPRET it. The same pattern 10000001 is 129 (unsigned) or -127 (signed). The hardware stores the same bits either way.' } }
      ]))
    },
    {
      title: 'Signed Representation', lessonId: lesson10.id, tags: ['signed','negative','twos-complement'],
      contentText: 'How signed integers represent both positive and negative values.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Signed Number Representation', level: 2 },
        { type: 'text', text: "Signed numbers can represent both positive and negative values. Modern computers use 2's complement as the standard signed representation." },
        { type: 'heading', text: "2's Complement Signed Range", level: 3 },
        { type: 'table', table: { headers: ['Bits', 'Min Value', 'Max Value', 'Total Values'], rows: [['4', '-8', '+7', '16'], ['8', '-128', '+127', '256'], ['16', '-32,768', '+32,767', '65,536'], ['32', '-2,147,483,648', '+2,147,483,647', '4,294,967,296']], caption: 'Signed Integer Ranges by Bit Width' } },
        { type: 'heading', text: 'Reading Signed Numbers', level: 3 },
        { type: 'codeBlock', code: 'If MSB = 0: Read normally (positive)\n  01010110 = 64+16+4+2 = 86\n\nIf MSB = 1: Number is negative\n  Method 1 - Negate to find magnitude:\n  11010110 -> invert -> 00101001 -> +1 -> 00101010 = 42\n  So 11010110 = -42\n\n  Method 2 - MSB weight is negative:\n  11010110 = -128 + 64 + 16 + 4 + 2 = -42\n  (MSB contributes -128 instead of +128)', language: 'text' },
        { type: 'heading', text: 'Signed Arithmetic Just Works', level: 3 },
        { type: 'codeBlock', code: "Adding +5 and -3 using 2's complement:\n\n  00000101  (+5)\n+ 11111101  (-3)\n----------\n  00000010  (+2)  Correct!\n\nThe carry out of bit 7 is discarded.\nNo special subtraction circuit needed!", language: 'text' },
        { type: 'callout', callout: { type: 'info', title: 'In Programming', content: "In C/Java: 'int' is signed (32-bit, -2B to +2B). In Rust: 'i8' is signed 8-bit, 'i32' is signed 32-bit. The compiler generates code that interprets the MSB as a sign bit." } }
      ]))
    },
    {
      title: 'Unsigned Representation', lessonId: lesson10.id, tags: ['unsigned','positive','range'],
      contentText: 'How unsigned integers represent only non-negative values with a wider positive range.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Unsigned Number Representation', level: 2 },
        { type: 'text', text: 'Unsigned numbers can only represent zero and positive values. Every bit contributes to the magnitude, giving a wider positive range than signed numbers of the same bit width.' },
        { type: 'heading', text: 'Unsigned Range', level: 3 },
        { type: 'table', table: { headers: ['Bits', 'Min', 'Max', 'Formula'], rows: [['4', '0', '15', '2^4 - 1'], ['8', '0', '255', '2^8 - 1'], ['16', '0', '65,535', '2^16 - 1'], ['32', '0', '4,294,967,295', '2^32 - 1']], caption: 'Unsigned Integer Ranges' } },
        { type: 'heading', text: 'Signed vs Unsigned: Same Bits, Different Range', level: 3 },
        { type: 'codeBlock', code: '8-bit comparison:\n\nUnsigned: 0 ........... 255\n          |<--- 256 values --->|\n\nSigned:   -128 ... 0 ... +127\n          |<--- 256 values --->|\n\nBoth store 256 different values!\nUnsigned shifts the range to all-positive.', language: 'text' },
        { type: 'heading', text: 'When to Use Unsigned', level: 3 },
        { type: 'list', list: [
          'Memory addresses (always positive)',
          'Array indices and sizes',
          'Pixel color values (0-255 per channel)',
          'Network port numbers (0-65535)',
          'Bitwise operations and flags',
          'Any value that should never be negative'
        ] },
        { type: 'heading', text: 'Overflow Behavior', level: 3 },
        { type: 'codeBlock', code: 'Unsigned 8-bit overflow:\n  255 + 1 = 0     (wraps around)\n  0 - 1 = 255     (wraps around)\n\nSigned 8-bit overflow:\n  127 + 1 = -128   (wraps to negative)\n  -128 - 1 = 127   (wraps to positive)', language: 'text' },
        { type: 'callout', callout: { type: 'warning', title: 'Mixing Signed and Unsigned', content: "Be careful when comparing signed and unsigned in code! In C: if you compare -1 (signed) with 1 (unsigned), -1 gets interpreted as a huge unsigned number (4,294,967,295 for 32-bit), so -1 > 1 becomes TRUE!" } }
      ]))
    },
    {
      title: 'Sign Bit Visualizer', lessonId: lesson10.id, tags: ['sign-bit','visualizer','interactive'],
      contentText: 'Visualize how the sign bit changes the interpretation of binary numbers.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Sign Bit Visualizer', level: 2 },
        { type: 'text', text: 'The sign bit (MSB) is the single most important bit in signed number representation. Flipping just this one bit dramatically changes the interpretation of the entire number.' },
        { type: 'heading', text: 'Flipping the Sign Bit', level: 3 },
        { type: 'codeBlock', code: 'Original:   0 1 1 0 0 1 0 1 = +101 (unsigned) / +101 (signed)\n            ^\nFlip MSB:   1 1 1 0 0 1 0 1 = 229 (unsigned) / -27 (signed)\n            ^\n\nSame lower 7 bits, completely different meaning!\n\nNote: Flipping MSB does NOT simply negate the number.\n  +101 with flipped MSB = -27 (NOT -101)\n  To negate properly, use 2\'s complement (invert all + add 1).', language: 'text' },
        { type: 'heading', text: 'Complete 4-bit Signed vs Unsigned', level: 3 },
        { type: 'table', table: { headers: ['Binary', 'Unsigned', 'Signed', 'MSB'], rows: [['0000', '0', '0', '0'], ['0001', '1', '+1', '0'], ['0010', '2', '+2', '0'], ['0011', '3', '+3', '0'], ['0100', '4', '+4', '0'], ['0101', '5', '+5', '0'], ['0110', '6', '+6', '0'], ['0111', '7', '+7', '0'], ['1000', '8', '-8', '1'], ['1001', '9', '-7', '1'], ['1010', '10', '-6', '1'], ['1011', '11', '-5', '1'], ['1100', '12', '-4', '1'], ['1101', '13', '-3', '1'], ['1110', '14', '-2', '1'], ['1111', '15', '-1', '1']], caption: 'All 4-bit Values: Signed vs Unsigned' } },
        { type: 'heading', text: 'Patterns to Notice', level: 3 },
        { type: 'list', list: [
          'When MSB = 0, signed and unsigned values are IDENTICAL',
          'When MSB = 1, signed values are negative, unsigned are large positive',
          'The unsigned value 128-255 maps to signed -128 to -1',
          'Signed -1 (11111111) = Unsigned 255 (both are all 1s)',
          'Signed -128 (10000000) = Unsigned 128 (MSB only)'
        ] },
        { type: 'callout', callout: { type: 'tip', title: 'Quick Conversion', content: 'To convert an unsigned value (128-255) to its signed equivalent: subtract 256. Example: unsigned 200 -> signed 200 - 256 = -56. To go the other way: add 256. Example: signed -56 -> unsigned -56 + 256 = 200.' } }
      ]))
    }
  ]});

  console.log('Seeded 10 lessons with 38 topics successfully!');

  // Lesson 11: Binary Codes (BCD & ASCII)
  const lesson11 = await prisma.lesson.create({ data: { title: 'Binary Codes (BCD & ASCII)' } });
  await prisma.topic.createMany({ data: [
    {
      title: 'BCD Encoding', lessonId: lesson11.id, tags: ['bcd','encoding','decimal'],
      contentText: 'Binary-Coded Decimal (BCD) represents each decimal digit with 4 binary bits.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Binary-Coded Decimal (BCD)', level: 2 },
        { type: 'text', text: 'BCD is a binary encoding where each decimal digit (0-9) is represented individually with 4 bits. Unlike pure binary, BCD keeps the decimal structure intact.' },
        { type: 'heading', text: 'BCD vs Pure Binary', level: 3 },
        { type: 'codeBlock', code: 'Decimal 47 in pure binary:\n  47 = 00101111  (8 bits, one number)\n\nDecimal 47 in BCD:\n  4 = 0100,  7 = 0111\n  47 = 0100 0111  (8 bits, two separate digits)', language: 'text' },
        { type: 'heading', text: 'BCD Digit Table', level: 3 },
        { type: 'table', table: { headers: ['Decimal', 'BCD', 'Valid?'], rows: [['0', '0000', 'Yes'], ['1', '0001', 'Yes'], ['2', '0010', 'Yes'], ['3', '0011', 'Yes'], ['4', '0100', 'Yes'], ['5', '0101', 'Yes'], ['6', '0110', 'Yes'], ['7', '0111', 'Yes'], ['8', '1000', 'Yes'], ['9', '1001', 'Yes'], ['--', '1010', 'INVALID'], ['--', '1011', 'INVALID'], ['--', '1100', 'INVALID'], ['--', '1101', 'INVALID'], ['--', '1110', 'INVALID'], ['--', '1111', 'INVALID']], caption: 'BCD uses only 10 of 16 possible 4-bit patterns' } },
        { type: 'heading', text: 'Multi-digit BCD Examples', level: 3 },
        { type: 'codeBlock', code: 'Decimal 192 in BCD:\n  1 = 0001,  9 = 1001,  2 = 0010\n  BCD: 0001 1001 0010\n\nDecimal 2024 in BCD:\n  2 = 0010,  0 = 0000,  2 = 0010,  4 = 0100\n  BCD: 0010 0000 0010 0100', language: 'text' },
        { type: 'heading', text: 'Where BCD Is Used', level: 3 },
        { type: 'list', list: [
          'Digital clocks and watches (display decimal digits directly)',
          'Calculators (avoid binary rounding errors)',
          'Financial systems (exact decimal arithmetic)',
          'Seven-segment displays (each digit drives one display)',
          'Embedded systems with decimal I/O'
        ] },
        { type: 'callout', callout: { type: 'warning', title: 'BCD Wastes Space', content: 'BCD uses 4 bits per decimal digit but only 10 of 16 combinations are valid. To store 0-99 in pure binary: 7 bits. In BCD: 8 bits. For large numbers the waste adds up, but the simplicity of decimal conversion is worth it in some applications.' } }
      ]))
    },
    {
      title: 'ASCII Conversion', lessonId: lesson11.id, tags: ['ascii','text','encoding'],
      contentText: 'ASCII encodes text characters as 7-bit binary numbers.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'ASCII: American Standard Code for Information Interchange', level: 2 },
        { type: 'text', text: 'ASCII is a character encoding that maps letters, digits, punctuation, and control characters to 7-bit binary numbers (0-127). It is the foundation of text representation in computers.' },
        { type: 'heading', text: 'Key ASCII Values', level: 3 },
        { type: 'table', table: { headers: ['Char', 'Decimal', 'Binary', 'Hex'], rows: [['A', '65', '1000001', '41'], ['B', '66', '1000010', '42'], ['Z', '90', '1011010', '5A'], ['a', '97', '1100001', '61'], ['b', '98', '1100010', '62'], ['z', '122', '1111010', '7A'], ['0', '48', '0110000', '30'], ['9', '57', '0111001', '39'], ['Space', '32', '0100000', '20'], ['!', '33', '0100001', '21']], caption: 'Common ASCII Character Codes' } },
        { type: 'heading', text: 'ASCII Patterns', level: 3 },
        { type: 'codeBlock', code: "Uppercase letters: A=65 to Z=90\nLowercase letters: a=97 to z=122\nDigit characters:  '0'=48 to '9'=57\n\nCase conversion trick:\n  A (65) = 1000001\n  a (97) = 1100001\n          ^--- bit 5 differs!\n\n  To lowercase: set bit 5 (OR with 0100000 = 32)\n  To uppercase: clear bit 5 (AND with 1011111)\n  Difference: 97 - 65 = 32 (exactly bit 5!)", language: 'text' },
        { type: 'heading', text: 'Encoding a Word', level: 3 },
        { type: 'codeBlock', code: 'Encode \"Hi!\" in ASCII:\n\n  H = 72  = 01001000\n  i = 105 = 01101001\n  ! = 33  = 00100001\n\nBinary: 01001000 01101001 00100001\nHex:    48 69 21\n\nThis is exactly how text files store data!', language: 'text' },
        { type: 'callout', callout: { type: 'info', title: 'ASCII vs Unicode', content: 'ASCII only covers 128 characters (English + basic symbols). Unicode extends this to 150,000+ characters covering all world languages, emoji, and symbols. UTF-8 (the most common Unicode encoding) is backward-compatible with ASCII.' } }
      ]))
    },
    {
      title: 'Character-to-Binary Translator', lessonId: lesson11.id, tags: ['translator','character','binary'],
      contentText: 'Understand how text is converted to binary and back.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'Character-to-Binary Translation', level: 2 },
        { type: 'text', text: 'Every character you type is stored as a binary number. Understanding this translation is fundamental to how computers handle text, files, and communication.' },
        { type: 'heading', text: 'The Translation Process', level: 3 },
        { type: 'codeBlock', code: 'Text to Binary:\n  Character -> ASCII lookup -> Decimal -> Binary\n\n  \"B\" -> ASCII table -> 66 -> 01000010\n  \"5\" -> ASCII table -> 53 -> 00110101\n  \" \" -> ASCII table -> 32 -> 00100000\n\nBinary to Text:\n  Binary -> Decimal -> ASCII lookup -> Character\n\n  01001010 -> 74 -> ASCII table -> \"J\"', language: 'text' },
        { type: 'heading', text: 'Full Word Translation', level: 3 },
        { type: 'codeBlock', code: 'Translate \"Code\" to binary:\n\n  C = 67  -> 01000011\n  o = 111 -> 01101111\n  d = 100 -> 01100100\n  e = 101 -> 01100101\n\nComplete binary: 01000011 01101111 01100100 01100101\nHex:             43 6F 64 65\n\nFun fact: \"Code\" in hex is 43 6F 64 65!', language: 'text' },
        { type: 'heading', text: 'Digit Characters vs Numeric Values', level: 3 },
        { type: 'text', text: 'An important distinction: the character \"5\" and the number 5 are stored differently!' },
        { type: 'table', table: { headers: ['What', 'Stored As', 'Binary', 'Why'], rows: [["Character '5'", 'ASCII 53', '00110101', 'Text encoding'], ['Number 5', 'Integer 5', '00000101', 'Numeric value'], ["Character '0'", 'ASCII 48', '00110000', 'Text encoding'], ['Number 0', 'Integer 0', '00000000', 'Numeric value']], caption: "Character '5' is NOT the same as number 5!" } },
        { type: 'callout', callout: { type: 'tip', title: 'Conversion Trick', content: "To convert an ASCII digit character to its numeric value, subtract 48 (ASCII '0'). For example: '7' (ASCII 55) - '0' (ASCII 48) = 7. In code: int value = charDigit - '0';" } }
      ]))
    },
    {
      title: 'Split-screen Visualizer', lessonId: lesson11.id, tags: ['visualizer','bcd','ascii','comparison'],
      contentText: 'Compare BCD and ASCII side by side to understand their different approaches to encoding.',
      displayContent: JSON.parse(JSON.stringify([
        { type: 'heading', text: 'BCD vs ASCII: Side-by-Side Comparison', level: 2 },
        { type: 'text', text: 'BCD and ASCII are both binary codes, but they serve different purposes. BCD encodes numeric values for calculation; ASCII encodes characters for text display and communication.' },
        { type: 'heading', text: 'Encoding the Same Input: \"42\"', level: 3 },
        { type: 'table', table: { headers: ['Aspect', 'BCD Encoding', 'ASCII Encoding'], rows: [['Input', '42 (number)', '"42" (text)'], ['Approach', 'Each digit -> 4 bits', 'Each character -> 8 bits'], ['Digit 4', '0100', '00110100 (ASCII 52)'], ['Digit 2', '0010', '00110010 (ASCII 50)'], ['Total bits', '8 bits', '16 bits'], ['Result', '0100 0010', '00110100 00110010'], ['Hex', '42', '34 32'], ['Purpose', 'Arithmetic operations', 'Text display/storage']], caption: 'Same Input, Different Encodings' } },
        { type: 'heading', text: 'When to Use Which', level: 3 },
        { type: 'table', table: { headers: ['Feature', 'BCD', 'ASCII'], rows: [['Encodes', 'Digits 0-9 only', 'Letters, digits, symbols (128 chars)'], ['Bits per digit', '4', '7-8'], ['Can represent letters?', 'No', 'Yes'], ['Math operations', 'Direct (with BCD arithmetic)', 'Must convert to number first'], ['Used in', 'Calculators, clocks, meters', 'Text files, keyboards, web'], ['Space efficiency', 'Moderate', 'Standard'], ['Modern relevance', 'Niche (embedded/financial)', 'Universal']], caption: 'BCD vs ASCII Feature Comparison' } },
        { type: 'heading', text: 'Encoding Comparison for 0-9', level: 3 },
        { type: 'table', table: { headers: ['Digit', 'BCD (4-bit)', 'ASCII Binary', 'ASCII Decimal'], rows: [['0', '0000', '0110000', '48'], ['1', '0001', '0110001', '49'], ['2', '0010', '0110010', '50'], ['3', '0011', '0110011', '51'], ['4', '0100', '0110100', '52'], ['5', '0101', '0110101', '53'], ['6', '0110', '0110110', '54'], ['7', '0111', '0110111', '55'], ['8', '1000', '0111000', '56'], ['9', '1001', '0111001', '57']], caption: 'Digits 0-9: BCD vs ASCII' } },
        { type: 'callout', callout: { type: 'important', title: 'The Connection', content: "Notice that ASCII digit codes are simply 0011 concatenated with the BCD code! ASCII '5' = 0011 0101 = 0011 + BCD(5). This is not a coincidence -- ASCII was designed this way to make digit conversion easy." } }
      ]))
    }
  ]});

  console.log('Seeded 11 lessons with 42 topics successfully!');
  console.log(`  Lesson 1 (id=${lesson1.id}): Intro to Boolean Algebra - 3 topics`);
  console.log(`  Lesson 2 (id=${lesson2.id}): Logic Gates - 3 topics`);
  console.log(`  Lesson 3 (id=${lesson3.id}): Truth Tables - 3 topics`);
  console.log(`  Lesson 4 (id=${lesson4.id}): Simplification - 3 topics`);
  console.log(`  Lesson 5 (id=${lesson5.id}): Introduction to Number Systems - 5 topics`);
  console.log(`  Lesson 6 (id=${lesson6.id}): Types of Number Systems - 4 topics`);
  console.log(`  Lesson 7 (id=${lesson7.id}): Conversion of Number Systems - 4 topics`);
  console.log(`  Lesson 8 (id=${lesson8.id}): Binary Arithmetic - 5 topics`);
  console.log(`  Lesson 9 (id=${lesson9.id}): Complements - 4 topics`);
  console.log(`  Lesson 10 (id=${lesson10.id}): Signed and Unsigned Numbers - 4 topics`);
  console.log(`  Lesson 11 (id=${lesson11.id}): Binary Codes (BCD & ASCII) - 4 topics`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

