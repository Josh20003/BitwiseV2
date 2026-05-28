const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "UserTopic", "UserLesson", "UserLessonMastery", "UserSkill", "Topic", "Lesson" CASCADE;');
  console.log('Truncated all tables!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
