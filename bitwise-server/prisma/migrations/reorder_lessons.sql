-- ============================================================
-- Migration: Re-order lesson IDs to match display order
-- ============================================================
-- Current IDs:  1-4 = Boolean Algebra,  5-11 = Number Systems
-- Target IDs:   1-7 = Number Systems,   8-11 = Boolean Algebra
--
-- Mapping:
--   Old 5  → New 1   (Introduction to Number Systems)
--   Old 6  → New 2   (Types of Number Systems)
--   Old 7  → New 3   (Conversion of Number Systems)
--   Old 8  → New 4   (Binary Arithmetic)
--   Old 9  → New 5   (Complements)
--   Old 10 → New 6   (Signed and Unsigned Numbers)
--   Old 11 → New 7   (Binary Codes)
--   Old 1  → New 8   (Intro to Boolean Algebra)
--   Old 2  → New 9   (Logic Gates)
--   Old 3  → New 10  (Truth Tables)
--   Old 4  → New 11  (Simplification)
-- ============================================================

BEGIN;

-- Step 1: Temporarily drop foreign key constraints
-- (Prisma uses implicit FK names based on model relations)
ALTER TABLE "Topic" DROP CONSTRAINT IF EXISTS "Topic_lessonId_fkey";
ALTER TABLE "UserLesson" DROP CONSTRAINT IF EXISTS "UserLesson_lessonId_fkey";
ALTER TABLE "UserLessonMastery" DROP CONSTRAINT IF EXISTS "UserLessonMastery_lessonId_fkey";

-- Step 2: Move all lesson IDs to temporary range (100+) to avoid conflicts
UPDATE "Lesson" SET id = id + 100;
UPDATE "Topic" SET "lessonId" = "lessonId" + 100;
UPDATE "UserLesson" SET "lessonId" = "lessonId" + 100;
UPDATE "UserLessonMastery" SET "lessonId" = "lessonId" + 100;
UPDATE "LearningPath" SET "lessonId" = "lessonId" + 100;

-- Step 3: Remap from temporary IDs to final IDs
-- Number Systems: 105-111 → 1-7
UPDATE "Lesson" SET id = 1 WHERE id = 105;
UPDATE "Lesson" SET id = 2 WHERE id = 106;
UPDATE "Lesson" SET id = 3 WHERE id = 107;
UPDATE "Lesson" SET id = 4 WHERE id = 108;
UPDATE "Lesson" SET id = 5 WHERE id = 109;
UPDATE "Lesson" SET id = 6 WHERE id = 110;
UPDATE "Lesson" SET id = 7 WHERE id = 111;

-- Boolean Algebra: 101-104 → 8-11
UPDATE "Lesson" SET id = 8  WHERE id = 101;
UPDATE "Lesson" SET id = 9  WHERE id = 102;
UPDATE "Lesson" SET id = 10 WHERE id = 103;
UPDATE "Lesson" SET id = 11 WHERE id = 104;

-- Topic.lessonId
UPDATE "Topic" SET "lessonId" = 1 WHERE "lessonId" = 105;
UPDATE "Topic" SET "lessonId" = 2 WHERE "lessonId" = 106;
UPDATE "Topic" SET "lessonId" = 3 WHERE "lessonId" = 107;
UPDATE "Topic" SET "lessonId" = 4 WHERE "lessonId" = 108;
UPDATE "Topic" SET "lessonId" = 5 WHERE "lessonId" = 109;
UPDATE "Topic" SET "lessonId" = 6 WHERE "lessonId" = 110;
UPDATE "Topic" SET "lessonId" = 7 WHERE "lessonId" = 111;
UPDATE "Topic" SET "lessonId" = 8  WHERE "lessonId" = 101;
UPDATE "Topic" SET "lessonId" = 9  WHERE "lessonId" = 102;
UPDATE "Topic" SET "lessonId" = 10 WHERE "lessonId" = 103;
UPDATE "Topic" SET "lessonId" = 11 WHERE "lessonId" = 104;

-- UserLesson.lessonId
UPDATE "UserLesson" SET "lessonId" = 1 WHERE "lessonId" = 105;
UPDATE "UserLesson" SET "lessonId" = 2 WHERE "lessonId" = 106;
UPDATE "UserLesson" SET "lessonId" = 3 WHERE "lessonId" = 107;
UPDATE "UserLesson" SET "lessonId" = 4 WHERE "lessonId" = 108;
UPDATE "UserLesson" SET "lessonId" = 5 WHERE "lessonId" = 109;
UPDATE "UserLesson" SET "lessonId" = 6 WHERE "lessonId" = 110;
UPDATE "UserLesson" SET "lessonId" = 7 WHERE "lessonId" = 111;
UPDATE "UserLesson" SET "lessonId" = 8  WHERE "lessonId" = 101;
UPDATE "UserLesson" SET "lessonId" = 9  WHERE "lessonId" = 102;
UPDATE "UserLesson" SET "lessonId" = 10 WHERE "lessonId" = 103;
UPDATE "UserLesson" SET "lessonId" = 11 WHERE "lessonId" = 104;

-- UserLessonMastery.lessonId
UPDATE "UserLessonMastery" SET "lessonId" = 1 WHERE "lessonId" = 105;
UPDATE "UserLessonMastery" SET "lessonId" = 2 WHERE "lessonId" = 106;
UPDATE "UserLessonMastery" SET "lessonId" = 3 WHERE "lessonId" = 107;
UPDATE "UserLessonMastery" SET "lessonId" = 4 WHERE "lessonId" = 108;
UPDATE "UserLessonMastery" SET "lessonId" = 5 WHERE "lessonId" = 109;
UPDATE "UserLessonMastery" SET "lessonId" = 6 WHERE "lessonId" = 110;
UPDATE "UserLessonMastery" SET "lessonId" = 7 WHERE "lessonId" = 111;
UPDATE "UserLessonMastery" SET "lessonId" = 8  WHERE "lessonId" = 101;
UPDATE "UserLessonMastery" SET "lessonId" = 9  WHERE "lessonId" = 102;
UPDATE "UserLessonMastery" SET "lessonId" = 10 WHERE "lessonId" = 103;
UPDATE "UserLessonMastery" SET "lessonId" = 11 WHERE "lessonId" = 104;

-- LearningPath.lessonId
UPDATE "LearningPath" SET "lessonId" = 1 WHERE "lessonId" = 105;
UPDATE "LearningPath" SET "lessonId" = 2 WHERE "lessonId" = 106;
UPDATE "LearningPath" SET "lessonId" = 3 WHERE "lessonId" = 107;
UPDATE "LearningPath" SET "lessonId" = 4 WHERE "lessonId" = 108;
UPDATE "LearningPath" SET "lessonId" = 5 WHERE "lessonId" = 109;
UPDATE "LearningPath" SET "lessonId" = 6 WHERE "lessonId" = 110;
UPDATE "LearningPath" SET "lessonId" = 7 WHERE "lessonId" = 111;
UPDATE "LearningPath" SET "lessonId" = 8  WHERE "lessonId" = 101;
UPDATE "LearningPath" SET "lessonId" = 9  WHERE "lessonId" = 102;
UPDATE "LearningPath" SET "lessonId" = 10 WHERE "lessonId" = 103;
UPDATE "LearningPath" SET "lessonId" = 11 WHERE "lessonId" = 104;

-- Step 4: Reset the autoincrement sequence to max(id) + 1
SELECT setval(pg_get_serial_sequence('"Lesson"', 'id'), (SELECT MAX(id) FROM "Lesson"));

-- Step 5: Restore foreign key constraints
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_lessonId_fkey"
  FOREIGN KEY ("lessonId") REFERENCES "Lesson"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserLesson" ADD CONSTRAINT "UserLesson_lessonId_fkey"
  FOREIGN KEY ("lessonId") REFERENCES "Lesson"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserLessonMastery" ADD CONSTRAINT "UserLessonMastery_lessonId_fkey"
  FOREIGN KEY ("lessonId") REFERENCES "Lesson"(id) ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;

-- Verify
SELECT id, title FROM "Lesson" ORDER BY id;
