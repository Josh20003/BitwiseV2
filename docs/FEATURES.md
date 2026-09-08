# Bitwise Project - Core Modules & Features Guide

## Project Overview

Bitwise is an adaptive, AI-powered educational platform designed to teach digital systems and binary logic through interactive learning modules. The project is built with a NestJS backend, PostgreSQL database, and React frontend.

---

## Core Modules

### Module 1: Educational Scaffolding (Learn Tab)
**Purpose:** Provides structured lessons on binary logic and digital systems.

**Features:**
- Lesson and Topic management
- User lesson & topic progress tracking
- User mastery tracking using EMA (Exponential Moving Average)

**Database Models:** `Lesson`, `Topic`, `UserLesson`, `UserTopic`, `UserLessonMastery`

---

### Module 2: Number System Converter
**Purpose:** Interactive tool for converting numbers between bases with step-by-step educational explanations.

**Features:**
- Base conversion across Binary (2), Octal (8), Decimal (10), Hexadecimal (16), and arbitrary bases (2-36)
- Step-by-step mathematical breakdown of conversion algorithms
- Multi-step base path conversions
- Stored conversion examples & reference tables

**API Endpoints:**
- `POST /calculator/convert`
- `GET /calculator/number-systems`
- `GET /calculator/conversion-examples`
- `POST /calculator/convert-multi-step`

**Frontend Component:** `bitwise-ui/src/components/NumberSystemConverter.tsx`

---

### Module 3: Binary Codes Translator
**Purpose:** Teaches binary encoding schemes and error-correction codes.

**Supported Encoding Schemes:**
1. **BCD (Binary Coded Decimal):** Encodes each decimal digit as 4-bit binary.
2. **Gray Code (Reflected Binary):** Single-bit difference between consecutive values.
3. **Hamming(7,4) Code:** Single-bit error detection and correction.

**API Endpoints:**
- `POST /calculator/encode-bcd` / `POST /calculator/decode-bcd`
- `POST /calculator/encode-gray` / `POST /calculator/decode-gray`
- `POST /calculator/hamming-code`
- `GET /calculator/binary-codes`

**Frontend Component:** `bitwise-ui/src/components/BinaryCodesConverter.tsx`

---

### Module 4: Adaptive AI Assessment
**Purpose:** Intelligent quiz generation and adaptive difficulty adjustment.

**Features:**
- AI-powered quiz generation using Groq API
- Bayesian Knowledge Tracing (BKT) algorithm
- Exponential Moving Average (EMA) scoring
- Mastery levels: Novice → Beginner → Intermediate → Advanced → Expert
- Learning path recommendations

**API Endpoints:**
- `POST /assessment/generate-quiz`
- `POST /assessment/submit-attempt`
- `POST /assessment/evaluate`
- `GET /user-progress/skills`
- `GET /user-progress/:userId/progress`

---

### Module 5: Boolean Logic
**Purpose:** Analyze and simplify Boolean expressions.

**Features:**
- Expression parsing & simplification
- Truth table generation
- Boolean algebraic laws tracking

---

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference Guide](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Root README](../README.md)
