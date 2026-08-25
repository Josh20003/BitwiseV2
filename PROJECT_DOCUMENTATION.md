# Bitwise Project - Complete Implementation Guide

## Project Overview

Bitwise is an adaptive, AI-powered educational platform designed to teach digital systems and binary logic through interactive learning modules. The project is built on modern web technologies with a NestJS backend and React frontend.

## Project Architecture

### Technology Stack

**Backend:**
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL with Prisma ORM
- **AI/ML:** Groq API for adaptive quiz generation
- **Language:** TypeScript

**Frontend:**
- **Framework:** React 19 with TypeScript
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS
- **UI Components:** Custom shadcn/ui components
- **Build Tool:** Vite

## Core Modules

### Module 1: Educational Scaffolding (Learn Tab)
**Purpose:** Provides structured lessons on binary logic and digital systems

**Components:**
- Lessons (topics with structured learning content)
- Topics (specific concepts within lessons)
- User Lesson Progress tracking
- User Topic Progress tracking
- User Lesson Mastery tracking

**API Endpoints:**
- `GET /lessons` - Get all lessons
- `GET /lessons/:id` - Get specific lesson
- `GET /lessons/:id/topics` - Get topics for a lesson
- `POST /user-progress/lesson/:lessonId` - Track lesson progress

**Database Models:**
- `Lesson` - Lesson metadata and content
- `Topic` - Individual topics within lessons
- `UserLesson` - User's lesson progress
- `UserTopic` - User's topic progress
- `UserLessonMastery` - Mastery tracking per lesson

---

### Module 2: Number System Converter
**Purpose:** Educational tool for converting numbers between different bases

**Features:**
- Convert between Binary (base 2), Octal (base 8), Decimal (base 10), Hexadecimal (base 16)
- Step-by-step conversion process with explanations
- Multi-step conversion paths
- Conversion examples and history

**API Endpoints:**
- `POST /calculator/convert` - Convert number between bases
- `GET /calculator/conversion-examples` - Get example conversions
- `GET /calculator/number-systems` - Get available number systems
- `POST /calculator/convert-multi-step` - Multi-base conversion

**Database Models:**
- `NumberSystem` - Definitions of number systems
- `ConversionExample` - Saved conversion examples
- `UserProgress` - User's conversion mastery

**Service Methods:**
```typescript
convertNumber(value, fromBase, toBase) -> ConversionResult
getConversionExamples(sourceBase, targetBase, difficulty)
getNumberSystems()
convertMultiStep(value, fromBase, basePath)
validateNumber(value, base)
```

**Example Usage:**
```bash
POST /calculator/convert
{
  "value": "1010",
  "fromBase": 2,
  "toBase": 10
}
# Response: { "sourceValue": "1010", "targetValue": "10", "steps": [...] }
```

---

### Module 3: Binary Codes Translator
**Purpose:** Teaches binary encoding schemes and their applications

**Supported Codes:**
1. **BCD (Binary Coded Decimal)**
   - Encodes each decimal digit as 4-bit binary
   - Used in digital clocks and calculators

2. **Gray Code (Reflected Binary)**
   - Only one bit changes between consecutive numbers
   - Used in rotary encoders and error detection

3. **Hamming Code**
   - Single-bit error detection and correction
   - Used in memory systems

**API Endpoints:**
- `POST /calculator/encode-bcd` - Encode to BCD
- `POST /calculator/decode-bcd` - Decode from BCD
- `POST /calculator/encode-gray` - Encode to Gray Code
- `POST /calculator/decode-gray` - Decode from Gray Code
- `POST /calculator/hamming-code` - Calculate Hamming code
- `GET /calculator/binary-codes` - Get code definitions

**Database Models:**
- `BinaryCode` - Code definitions with rules and examples

**Service Methods:**
```typescript
encodeBCD(decimalValue) -> BinaryCodeResult
decodeBCD(bcdValue) -> BinaryCodeResult
encodeGrayCode(binaryValue) -> BinaryCodeResult
decodeGrayCode(grayValue) -> BinaryCodeResult
calculateHammingCode(dataValue) -> BinaryCodeResult
getBinaryCodes(complexity)
```

**Example Usage:**
```bash
POST /calculator/encode-bcd
{ "value": "42" }
# Response: { "input": "42", "output": "0100 0010", "steps": [...] }
```

---

### Module 4: Adaptive AI Assessment & Progress Analytics
**Purpose:** Intelligent quiz generation and adaptive difficulty adjustment

**Features:**
- AI-powered quiz generation using Groq API
- Adaptive difficulty based on user mastery (Bayesian Knowledge Tracing)
- EMA (Exponential Moving Average) scoring
- Comprehensive progress tracking
- Mastery level determination (Novice → Expert)

**API Endpoints:**
- `POST /assessment/generate-quiz` - Generate adaptive quiz
- `POST /assessment/submit-attempt` - Submit quiz responses
- `POST /assessment/evaluate` - Evaluate quiz answers
- `GET /user-progress/skills` - Get user skills
- `GET /user-progress/:userId/progress` - Get detailed progress
- `GET /adaptive/recommend` - Get learning recommendations

**Database Models:**
- `QuizQuestion` - Questions with Bloom's taxonomy levels
- `QuizSession` - Individual quiz attempts
- `QuizResponse` - User's answers
- `UserProgress` - EMA scores and mastery levels
- `Attempt` - Historical attempts with feedback
- `UserSkill` - BKT parameters per topic

**Adaptive Algorithm:**
```typescript
// BKT (Bayesian Knowledge Tracing)
interface BKTParameters {
  pLearn: number;    // Probability of learning (0.3)
  pForget: number;   // Probability of forgetting (0.05)
  pGuess: number;    // Probability of guessing (0.1)
  pSlip: number;     // Probability of error when knowing (0.1)
}

// Calculate next difficulty based on:
// 1. Current mastery level (0-1 scale)
// 2. Recent performance (last 5 attempts)
// 3. Bloom's taxonomy level readiness
// 4. Topic-specific difficulty
```

**Mastery Levels:**
- **0.0-0.2:** Novice (Unknown)
- **0.2-0.4:** Beginner (Starting to learn)
- **0.4-0.6:** Intermediate (Developing skill)
- **0.6-0.8:** Advanced (Proficient)
- **0.8-1.0:** Expert (Master)

---

## Boolean Logic Module (Integrated)

**Purpose:** Simplify and analyze Boolean expressions

**Features:**
- Expression parsing and simplification
- Truth table generation
- Law application tracking
- Step-by-step simplification with explanations

**Examples in Database:**
- Identity Law: `(A ∧ T) ∨ F`
- De Morgan's Law: `¬(A ∧ B) → ¬A ∨ ¬B`
- Absorption: `X ∨ (X ∧ Y) → X`
- Distribution: `(A ∨ B) ∧ (A ∨ ¬B) → A`

**Database Model:**
- `BooleanExample` - Stored examples with difficulty and laws used

---

## Database Schema Summary

```prisma
// Core Learning
model Lesson
model Topic
model UserLesson
model UserTopic
model UserLessonMastery

// Module 2: Number Systems
model NumberSystem
model ConversionExample

// Module 3: Binary Codes
model BinaryCode

// Module 4: Assessment
model QuizQuestion
model QuizSession
model QuizResponse
model Attempt
model UserProgress
model UserSkill
model LearningPath

// Boolean Logic
model BooleanExample
```

---

## Frontend Components Structure

### Converter Components
- **NumberSystemConverter** - Base conversion tool
  - Input validation
  - Step-by-step explanation
  - Quick reference guide

- **BinaryCodesConverter** - Binary encoding tool
  - Tabs for BCD, Gray Code, Hamming
  - Live encoding/decoding
  - Comparison tables

### Assessment Components
- **AssessmentComponent** - Quiz interface
- **QuizSessionManager** - Session tracking
- **ProgressDashboard** - Mastery visualization
- **LearningRecommendation** - Adaptive suggestions

### Educational Components
- **LessonContent** - Interactive lessons
- **TopicExplorer** - Topic navigation
- **ProgressRadar** - Mastery visualization

---

## API Response Format

### Standard Success Response
```json
{
  "success": true,
  "result": {
    "data": "...",
    "metadata": {...}
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## Key Implementation Details

### Number System Conversion Algorithm
1. Parse input value
2. Convert to decimal (base 10) as intermediate
3. Convert from decimal to target base
4. Generate steps showing remainder divisions

### Gray Code Algorithm
1. First bit stays the same
2. Each subsequent bit = XOR of previous binary bit and current gray bit
3. Creates sequence where only one bit changes per step

### BCD Encoding
1. Split decimal number into digits
2. Convert each digit to 4-bit binary
3. Concatenate all binary groups

### Adaptive Difficulty Calculation
```typescript
nextDifficulty = calculateDifficulty(
  currentMasteryLevel,
  recentPerformance,
  bloomerLevel,
  topicSpecificFactors
);
```

---

## Setup & Running Instructions

### Backend Setup
```bash
cd bitwise-server
npm install
npx prisma migrate dev
npm run start:dev
```

### Frontend Setup
```bash
cd bitwise-ui
npm install
npm run dev
```

### Environment Variables (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/bitwise
DIRECT_URL=postgresql://user:password@localhost:5432/bitwise
GROQ_API_KEY=your_groq_api_key
```

---

## Testing the Implementation

### Test Number System Converter
```bash
curl -X POST http://localhost:3000/api/calculator/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1010","fromBase":2,"toBase":10}'
```

### Test Binary Code Encoding
```bash
curl -X POST http://localhost:3000/api/calculator/encode-bcd \
  -H "Content-Type: application/json" \
  -d '{"value":"42"}'
```

### Test Quiz Generation
```bash
curl -X POST http://localhost:3000/api/assessment/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topicId":1,"difficulty":"intermediate"}'
```

---

## Quality Assurance Checklist

✅ **Database:**
- [x] Prisma schema complete with all models
- [x] Migrations created
- [x] Indexes added for performance

✅ **Backend Services:**
- [x] CalculatorService - Boolean logic
- [x] CalculatorConverterService - Base conversion
- [x] BinaryCodesService - Binary encoding
- [x] AssessmentService - AI quiz generation
- [x] AdaptiveService - BKT implementation

✅ **Controllers:**
- [x] CalculatorController with all endpoints
- [x] AssessmentController with all endpoints
- [x] AdaptiveController with recommendations

✅ **Frontend Components:**
- [x] NumberSystemConverter
- [x] BinaryCodesConverter
- [x] Assessment interface
- [x] Progress dashboard

✅ **API Documentation:**
- [x] All endpoints documented
- [x] Response formats specified
- [x] Example requests provided

---

## Performance Optimizations

1. **Database:** Indexed frequently queried fields
2. **Caching:** EMA scores cached in UserProgress
3. **Pagination:** Quiz responses paginated
4. **Lazy Loading:** Components loaded on demand

---

## Security Considerations

1. **Input Validation:** All inputs sanitized
2. **Auth:** Protected routes with JWT
3. **CORS:** Configured appropriately
4. **Rate Limiting:** API rate limits applied

---

## Future Enhancements

1. Add circuit simulator for digital logic
2. Implement Karnaugh map solver
3. Add multiplayer quiz competitions
4. Real-time progress synchronization
5. Mobile app with offline support
6. Video tutorials for each topic
7. Community forum for discussion
8. Certification system with badges

---

## Support & Documentation

- **API Documentation:** `/api-docs`
- **Error Handling:** All errors return standard format
- **Logging:** Comprehensive logging in all services
- **Type Safety:** Full TypeScript coverage

---

*Last Updated: May 24, 2026*
*Version: 2.0 - Complete Implementation*
