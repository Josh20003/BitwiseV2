const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const topics = await prisma.topic.findMany({
    where: { lessonId: 1 },
    select: { id: true, title: true }
  });
  console.log('Lesson 1 topics:', topics);
  
  const allTopics = await prisma.topic.findMany({
    select: { id: true, title: true, lessonId: true }
  });
  // count how many topics per lesson
  const counts = {};
  allTopics.forEach(t => {
    counts[t.lessonId] = (counts[t.lessonId] || 0) + 1;
  });
  console.log('Topic counts per lesson:', counts);
  console.log('All topics: ', allTopics.map(t => t.title).join(', '));
}

run().catch(console.error).finally(() => prisma.$disconnect());
