# Bitwise V2 - Architecture & Implementation Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BITWISE PLATFORM V2                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND LAYER                         │  │
│  │              (React + TypeScript + Vite)                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌────────────────────┐  ┌────────────────────┐         │  │
│  │  │ NumberSystem       │  │ BinaryCodeConverter│         │  │
│  │  │ Converter          │  │ - BCD Tab          │         │  │
│  │  │ - Input Form       │  │ - Gray Code Tab    │         │  │
│  │  │ - Step Display     │  │ - Hamming Tab      │         │  │
│  │  │ - Quick Reference  │  │ - Comparison Table │         │  │
│  │  └────────┬───────────┘  └────────┬───────────┘         │  │
│  │           │                       │                     │  │
│  │  ┌────────────────────────────────────────────┐         │  │
│  │  │      API Service Layer (HTTP)              │         │  │
│  │  │  - fetch('/api/calculator/convert')        │         │  │
│  │  │  - fetch('/api/calculator/encode-bcd')     │         │  │
│  │  │  - fetch('/api/calculator/encode-gray')    │         │  │
│  │  └────────────────────────────────────────────┘         │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ▲                                      │
│                           │ HTTP/REST                            │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    BACKEND LAYER                         │  │
│  │           (NestJS + TypeScript + Node.js)                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │          CONTROLLERS                             │    │  │
│  │  ├─────────────────────────────────────────────────┤    │  │
│  │  │                                                  │    │  │
│  │  │  CalculatorController                           │    │  │
│  │  │  ├── POST /convert                             │    │  │
│  │  │  ├── POST /convert-multi-step                  │    │  │
│  │  │  ├── GET /number-systems                       │    │  │
│  │  │  ├── GET /conversion-examples                  │    │  │
│  │  │  ├── POST /encode-bcd                          │    │  │
│  │  │  ├── POST /decode-bcd                          │    │  │
│  │  │  ├── POST /encode-gray                         │    │  │
│  │  │  ├── POST /decode-gray                         │    │  │
│  │  │  ├── POST /hamming-code                        │    │  │
│  │  │  └── GET /binary-codes                         │    │  │
│  │  │                                                  │    │  │
│  │  │  AssessmentController                           │    │  │
│  │  │  ├── POST /generate-quiz                       │    │  │
│  │  │  ├── POST /submit-attempt                      │    │  │
│  │  │  └── POST /evaluate                            │    │  │
│  │  │                                                  │    │  │
│  │  │  AdaptiveController                             │    │  │
│  │  │  └── GET /recommend                            │    │  │
│  │  │                                                  │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                       ▼                                   │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │          SERVICES                               │    │  │
│  │  ├─────────────────────────────────────────────────┤    │  │
│  │  │                                                  │    │  │
│  │  │  CalculatorService (Boolean Algebra)            │    │  │
│  │  │  ├── simplifyExpression()                       │    │  │
│  │  │  ├── generateTruthTable()                       │    │  │
│  │  │  └── applyLaws()                                │    │  │
│  │  │                                                  │    │  │
│  │  │  CalculatorConverterService                     │    │  │
│  │  │  ├── convertNumber()                            │    │  │
│  │  │  ├── toDecimal()                                │    │  │
│  │  │  ├── fromDecimal()                              │    │  │
│  │  │  ├── getConversionExamples()                    │    │  │
│  │  │  ├── convertMultiStep()                         │    │  │
│  │  │  └── validateNumber()                           │    │  │
│  │  │                                                  │    │  │
│  │  │  BinaryCodesService                             │    │  │
│  │  │  ├── encodeBCD() / decodeBCD()                 │    │  │
│  │  │  ├── encodeGrayCode() / decodeGrayCode()       │    │  │
│  │  │  ├── calculateHammingCode()                     │    │  │
│  │  │  └── getBinaryCodes()                           │    │  │
│  │  │                                                  │    │  │
│  │  │  AssessmentService (AI Quiz Generation)         │    │  │
│  │  │  ├── generateQuiz()                             │    │  │
│  │  │  ├── evaluateAnswer()                           │    │  │
│  │  │  └── calculateScore()                           │    │  │
│  │  │                                                  │    │  │
│  │  │  AdaptiveService (Mastery Tracking)             │    │  │
│  │  │  ├── calculateBKT()                             │    │  │
│  │  │  ├── calculateEMA()                             │    │  │
│  │  │  └── recommendNextTopic()                       │    │  │
│  │  │                                                  │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                       ▼                                   │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │          DATA ACCESS LAYER                       │    │  │
│  │  ├─────────────────────────────────────────────────┤    │  │
│  │  │                                                  │    │  │
│  │  │  PrismaService (ORM)                             │    │  │
│  │  │  ├── user.findOne()                             │    │  │
│  │  │  ├── lesson.findMany()                          │    │  │
│  │  │  ├── numberSystem.create()                      │    │  │
│  │  │  ├── conversionExample.create()                 │    │  │
│  │  │  ├── binaryCode.findMany()                      │    │  │
│  │  │  ├── quizQuestion.findOne()                     │    │  │
│  │  │  ├── userProgress.update()                      │    │  │
│  │  │  └── attempt.create()                           │    │  │
│  │  │                                                  │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                       ▼                                   │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │      DATABASE (PostgreSQL)                       │    │  │
│  │  ├─────────────────────────────────────────────────┤    │  │
│  │  │                                                  │    │  │
│  │  │  Users & Authentication                         │    │  │
│  │  │  Lessons & Topics                               │    │  │
│  │  │  ├── Lesson                                     │    │  │
│  │  │  ├── Topic                                      │    │  │
│  │  │  └── UserLesson, UserTopic, UserLessonMastery  │    │  │
│  │  │                                                  │    │  │
│  │  │  Number Systems (Module 2)                      │    │  │
│  │  │  ├── NumberSystem                               │    │  │
│  │  │  └── ConversionExample                          │    │  │
│  │  │                                                  │    │  │
│  │  │  Binary Codes (Module 3)                        │    │  │
│  │  │  └── BinaryCode                                 │    │  │
│  │  │                                                  │    │  │
│  │  │  Assessment (Module 4)                          │    │  │
│  │  │  ├── QuizQuestion                               │    │  │
│  │  │  ├── QuizSession                                │    │  │
│  │  │  ├── QuizResponse                               │    │  │
│  │  │  ├── Attempt                                    │    │  │
│  │  │  ├── UserSkill                                  │    │  │
│  │  │  ├── UserProgress                               │    │  │
│  │  │  └── LearningPath                               │    │  │
│  │  │                                                  │    │  │
│  │  │  Boolean Logic (Module 1)                       │    │  │
│  │  │  └── BooleanExample                             │    │  │
│  │  │                                                  │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Number System Converter Flow

```
USER INPUT
    │
    ▼
┌──────────────────────────┐
│ NumberSystemConverter UI │
│ (React Component)        │
└────────────┬─────────────┘
             │ (HTTP POST)
             ▼
┌──────────────────────────┐
│ CalculatorController     │
│ POST /convert            │
└────────────┬─────────────┘
             │ (Validate)
             ▼
┌──────────────────────────────────┐
│ CalculatorConverterService       │
│ - convertNumber()                │
│ - toDecimal()                    │
│ - fromDecimal()                  │
│ - Generate steps & explanation   │
└────────────┬─────────────────────┘
             │ (Create if needed)
             ▼
┌──────────────────────────────────┐
│ PrismaService                    │
│ conversionExample.create()       │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ PostgreSQL Database              │
│ ConversionExample table          │
└──────────────────────────────────┘
             │
             ▼
   HTTP RESPONSE (JSON)
             │
             ▼
┌──────────────────────────────────┐
│ Frontend Component               │
│ Display: Result + Steps + Explain│
└──────────────────────────────────┘
             │
             ▼
        USER SEES
    Conversion Result
```

### Binary Code Encoding Flow

```
USER INPUT (e.g., "42" for BCD)
    │
    ▼
┌──────────────────────────┐
│ BinaryCodesConverter UI  │
│ (React Component)        │
└────────────┬─────────────┘
             │ (HTTP POST)
             ▼
┌──────────────────────────┐
│ CalculatorController     │
│ POST /encode-bcd         │
└────────────┬─────────────┘
             │ (Validate)
             ▼
┌──────────────────────────────────┐
│ BinaryCodesService               │
│ - encodeBCD()                    │
│ - Split into digits              │
│ - Map each to 4-bit binary       │
│ - Generate steps & explanation   │
└────────────┬─────────────────────┘
             │
             ▼
   HTTP RESPONSE (JSON)
{
  input: "42",
  output: "0100 0010",
  steps: [...],
  explanation: "..."
}
             │
             ▼
┌──────────────────────────────────┐
│ Frontend Component               │
│ Display: Encoded value + Steps   │
└──────────────────────────────────┘
             │
             ▼
        USER SEES
    "0100 0010" with steps
```

### Adaptive Quiz Flow

```
USER STARTS QUIZ
    │
    ▼
┌──────────────────────────┐
│ AssessmentController     │
│ POST /generate-quiz      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ AssessmentService                │
│ - Get user mastery level         │
│ - Call Groq API for AI generation│
│ - Generate appropriate difficulty│
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ PrismaService                    │
│ - quizSession.create()           │
│ - quizQuestion.createMany()      │
└────────────┬─────────────────────┘
             │
             ▼
        RETURN QUIZ
             │
             ▼
    USER ANSWERS QUESTIONS
             │
             ▼
┌──────────────────────────────────┐
│ AssessmentController             │
│ POST /submit-attempt             │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ AssessmentService                │
│ - Evaluate answer                │
│ - Update BKT parameters          │
│ - Calculate EMA score            │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ PrismaService                    │
│ - quizResponse.create()          │
│ - userProgress.update()          │
│ - attempt.create()               │
└────────────┬─────────────────────┘
             │
             ▼
    QUIZ EVALUATION RESULTS
             │
    ┌────────┴────────┐
    ▼                 ▼
CALCULATE NEXT    UPDATE USER
DIFFICULTY        SKILL LEVEL
    │                 │
    └────────┬────────┘
             ▼
    SHOW RESULTS & RECOMMENDATIONS
```

---

## Database Schema Relationships

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ name                │
└────────┬────────────┘
         │
         ├─────────────────────────────┬──────────────────┐
         │                             │                  │
         ▼                             ▼                  ▼
    ┌─────────────┐          ┌──────────────┐   ┌──────────────┐
    │ UserLesson  │          │ UserProgress │   │ LearningPath │
    │ (M:N)       │          │ (M:N)        │   │ (M:N)        │
    └──────┬──────┘          └──────┬───────┘   └──────┬───────┘
           │                        │                  │
           ▼                        ▼                  ▼
    ┌─────────────┐          ┌──────────────┐   ┌──────────────┐
    │  Lesson     │          │ UserSkill    │   │   Lesson     │
    │             │          │              │   │              │
    └──────┬──────┘          └──────────────┘   └──────────────┘
           │
           ▼
    ┌──────────────┐
    │    Topic     │
    │              │
    └──────┬───────┘
           │
           ├─────────────────┬─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌────────────┐    ┌────────────┐  ┌──────────────┐
    │ UserTopic  │    │ Attempt    │  │ UserLesson   │
    │            │    │            │  │ Mastery      │
    └────────────┘    └────────────┘  └──────────────┘


┌──────────────────────────────┐
│     NUMBER SYSTEMS           │
├──────────────────────────────┤
│ NumberSystem                 │
│ - id, name, base, digits     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ ConversionExample            │
│ - sourceBase → targetBase    │
│ - sourceValue → targetValue  │
│ - steps, explanation, tags   │
└──────────────────────────────┘


┌──────────────────────────────┐
│    BINARY CODES              │
├──────────────────────────────┤
│ BinaryCode                   │
│ - id, name, complexity       │
│ - encodingRules, examples    │
└──────────────────────────────┘


┌──────────────────────────────┐
│     ASSESSMENT               │
├──────────────────────────────┤
│ QuizSession                  │
│ ├─ QuizQuestion              │
│ │  └─ QuizResponse           │
│ ├─ userId, topicId           │
│ └─ status, score             │
└──────────────────────────────┘
```

---

## Security Features

- **Input Validation:** All numeric inputs validated, base range checked (2-36), digit validity verified, SQL injection prevention via Prisma.
- **Error Handling:** Comprehensive try-catch blocks, descriptive error messages, proper HTTP status codes, no stack traces exposed.
- **Authentication:** JWT-based authentication, protected endpoints, user isolation in data queries.
- **CORS Configuration:** Restricted to approved origins, credentials handled securely.

---

## Related Documentation

- [API Reference](./API_REFERENCE.md) - Endpoint reference with examples
- [Features Guide](./FEATURES.md) - Module & feature breakdown
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Setup & deployment instructions
- [Root README](../README.md) - Main repository entry point
