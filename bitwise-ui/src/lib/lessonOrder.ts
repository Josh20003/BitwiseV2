/**
 * Lesson Display Order Mapping
 *
 * The database lesson IDs don't match the display order on the roadmap.
 * Originally, Boolean Algebra lessons were IDs 1-4. Then 7 prerequisite
 * Number Systems lessons were added as IDs 5-11. On the roadmap, we show
 * Number Systems first (display positions 1-7) then Boolean Algebra
 * (display positions 8-11).
 *
 * This module provides utilities to convert between database IDs and
 * user-facing display numbers.
 */

/** The roadmap display order expressed as database lesson IDs */
export const LESSON_DISPLAY_ORDER = [5, 6, 7, 8, 9, 10, 11, 1, 2, 3, 4] as const;

/** Map from database lesson ID → display position (1-indexed) */
export const DB_ID_TO_DISPLAY: Record<number, number> = {
  5: 1,   // Introduction to Number Systems
  6: 2,   // Types of Number Systems
  7: 3,   // Conversion of Number Systems
  8: 4,   // Binary Arithmetic
  9: 5,   // Complements
  10: 6,  // Signed and Unsigned Numbers
  11: 7,  // Binary Codes (BCD & ASCII)
  1: 8,   // Intro to Boolean Algebra
  2: 9,   // Logic Gates
  3: 10,  // Truth Tables
  4: 11,  // Simplification
};

/**
 * Convert a database lesson ID to its user-facing display number.
 * Falls back to the raw ID if the mapping is not found.
 */
export function getLessonDisplayNumber(dbLessonId: number): number {
  return DB_ID_TO_DISPLAY[dbLessonId] ?? dbLessonId;
}

/**
 * Given a database lesson ID, return the database ID of the NEXT lesson
 * in display order. Returns undefined if this is the last lesson.
 *
 * Display order: 5 → 6 → 7 → 8 → 9 → 10 → 11 → 1 → 2 → 3 → 4
 */
export function getNextLessonDbId(currentDbId: number): number | undefined {
  const idx = LESSON_DISPLAY_ORDER.indexOf(currentDbId as typeof LESSON_DISPLAY_ORDER[number]);
  if (idx === -1 || idx >= LESSON_DISPLAY_ORDER.length - 1) return undefined;
  return LESSON_DISPLAY_ORDER[idx + 1];
}
