const fs = require('fs');

let content = fs.readFileSync('prisma/seed.ts', 'utf8');

// Find the boundaries
const boolStart = content.indexOf('  // Lesson 1: Intro to Boolean Algebra');
const numSysStart = content.indexOf('  // Lesson 5: Introduction to Number Systems');

const header = content.substring(0, boolStart);
const booleanAlgebraBlocks = content.substring(boolStart, numSysStart);

// We need to find where the Number Systems blocks end.
// There are intermediate console.logs that we should just remove or move.
// Let's find the start of the final console.log block
const finalLogsStart = content.indexOf("  console.log('Seeded 11 lessons with 35 topics successfully!');");

const numberSystemsBlocks = content.substring(numSysStart, finalLogsStart);

// Now let's remove intermediate console.logs from numberSystemsBlocks and booleanAlgebraBlocks if any
function removeIntermediateLogs(text) {
  // Regex to remove console.log blocks that look like the ones at line 513 and 578
  return text.replace(/  console\.log\('Seeded .*? successfully!'\);\n(  console\.log\(`  Lesson .*?\);\n)*/gs, '');
}

const cleanBool = removeIntermediateLogs(booleanAlgebraBlocks);
const cleanNum = removeIntermediateLogs(numberSystemsBlocks);

// Let's rewrite the final console logs to match the new order
const finalFooter = `  console.log('Seeded 11 lessons with 35 topics successfully!');
  console.log(\`  Lesson 1 (id=\${lesson5.id}): Introduction to Number Systems - 4 topics\`);
  console.log(\`  Lesson 2 (id=\${lesson6.id}): Types of Number Systems - 3 topics\`);
  console.log(\`  Lesson 3 (id=\${lesson7.id}): Conversion of Number Systems - 3 topics\`);
  console.log(\`  Lesson 4 (id=\${lesson8.id}): Binary Arithmetic - 4 topics\`);
  console.log(\`  Lesson 5 (id=\${lesson9.id}): Complements - 3 topics\`);
  console.log(\`  Lesson 6 (id=\${lesson10.id}): Signed and Unsigned Numbers - 3 topics\`);
  console.log(\`  Lesson 7 (id=\${lesson11.id}): Binary Codes (BCD & ASCII) - 3 topics\`);
  console.log(\`  Lesson 8 (id=\${lesson1.id}): Intro to Boolean Algebra - 3 topics\`);
  console.log(\`  Lesson 9 (id=\${lesson2.id}): Logic Gates - 3 topics\`);
  console.log(\`  Lesson 10 (id=\${lesson3.id}): Truth Tables - 3 topics\`);
  console.log(\`  Lesson 11 (id=\${lesson4.id}): Simplification - 3 topics\`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
`;

const newContent = header + cleanNum + cleanBool + finalFooter;

// Note: The variables are still named lesson1..4 for Boolean and lesson5..11 for NumSys.
// That is perfectly fine for Node.js execution. The DB auto-increment will assign IDs 1-7 to NumSys and 8-11 to Boolean!

fs.writeFileSync('prisma/seed.ts', newContent);
console.log('seed.ts has been rewritten!');
