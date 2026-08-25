const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const lessons = await prisma.lesson.findMany({ select: { id: true, title: true } });
  console.log(lessons);
  const topics = await prisma.topic.findMany({ where: { lessonId: 1 } });
  console.log('topics for lesson 1', topics);
}

run().catch(console.error).finally(() => prisma.$disconnect());
