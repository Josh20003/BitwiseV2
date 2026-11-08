import { buildLocalLessonQuestions } from './lesson-quiz-fallback';

describe('Local lesson quiz content', () => {
  it.each([
    ['Introduction to Number Systems', ['Binary', 'Decimal', 'Octal', 'Hexadecimal']],
    ['Types of Number Systems', ['Binary ↔ Decimal', 'Binary ↔ Hex', 'Digit Groupings']],
    ['Conversion of Number Systems', ['Decimal to Binary', 'Binary to Decimal', 'Hex Conversion']],
    ['Binary Arithmetic', ['Addition', 'Subtraction', 'Multiplication', 'Division']],
    ['Complements', ["1's Complement", "2's Complement", 'Applications']],
    ['Signed and Unsigned Numbers', ['Unsigned', 'Signed', 'Ranges']],
    ['Binary Codes (BCD & ASCII)', ['BCD', 'ASCII', 'Applications']],
    ['Intro to Boolean Algebra', ['Introduction', 'Values', 'Applications']],
    ['Logic Gates', ['AND OR NOT', 'NAND NOR', 'XOR XNOR']],
    ['Truth Tables', ['Construction', 'Reading', 'Gates']],
    ['Simplification', ['Boolean Laws', 'Karnaugh Maps', 'Examples']],
  ])('builds ten non-placeholder questions for %s', (lessonTitle, titles) => {
    const context = {
      lessonId: 2, lessonTitle, totalQuestions: 10,
      topics: titles.map((topicTitle, index) => ({
        topicId: index + 1, topicTitle, mastery: 0.5, difficulty: 'medium' as const,
        questionCount: index === 0 ? 4 : titles.length === 4 ? 2 : 3,
        contentText: '', tags: [],
      })),
    };
    const questions = buildLocalLessonQuestions(context);
    expect(questions).toHaveLength(10);
    for (const q of questions) {
      expect(new Set(q.options.map(o => o.text)).size).toBe(4);
      expect(q.options.filter(o => o.isCorrect)).toHaveLength(1);
      expect(q.options.find(o => o.id === q.answerId)?.isCorrect).toBe(true);
      expect(q.stem).not.toMatch(/\[Fallback\]|could not be generated/);
    }
  });

  it('computes a binary-to-hexadecimal relationship correctly', () => {
    const [q] = buildLocalLessonQuestions({ lessonId: 2, lessonTitle: 'Types of Number Systems', totalQuestions: 1, topics: [{topicId: 22, topicTitle: 'Binary ↔ Hex', mastery: 0, difficulty: 'easy', questionCount: 1, contentText: '', tags: []}] });
    expect(q.stem).toBe('What hexadecimal value equals binary 101?');
    expect(q.options.find(o => o.isCorrect)?.text).toBe('5');
  });
});
