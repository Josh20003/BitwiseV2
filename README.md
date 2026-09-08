# Bitwise V2

An adaptive, AI-powered educational platform designed to teach digital systems, computer architecture, and binary logic through interactive tools and quizzes.

---

## Quick Start

Launch the complete application locally using 3 simple terminal steps:

### 1. Database & Backend
```bash
cd bitwise-server
npx prisma migrate dev --name add_converter_binary_codes
npm run start:dev
```
*Backend runs on `http://localhost:3000`*

### 2. Frontend Application
```bash
cd bitwise-ui
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 3. Test API Endpoint (Optional)
```bash
curl -X POST http://localhost:3000/api/calculator/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1010","fromBase":2,"toBase":10}'
```

---

## Features & Learning Modules

- **Number System Converter:** Convert numbers between arbitrary bases (Binary, Octal, Decimal, Hexadecimal, bases 2-36) with step-by-step mathematical explanations.
- **Binary Codes Translator:** Encode and decode BCD (Binary Coded Decimal), Gray Code (Reflected Binary), and Hamming(7,4) error-correcting codes.
- **Adaptive AI Assessment:** AI-driven quiz generation via Groq API, using Bayesian Knowledge Tracing (BKT) and Exponential Moving Average (EMA) mastery scoring.
- **Boolean Logic Engine:** Expression parsing, truth table generation, and Boolean law application tracking.
- **Educational Scaffolding:** Structured lessons, topic tracking, and personal mastery dashboards.

---

## Technology Stack

- **Backend:** NestJS (Node.js), TypeScript, Prisma ORM, PostgreSQL
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, TanStack Router, Shadcn UI
- **AI Integration:** Groq API (Quiz & Adaptive Assessment Generation)

---

## Documentation Directory

Detailed documentation is organized in the [`docs/`](./docs) folder:

- **[Architecture Overview](./docs/ARCHITECTURE.md):** System architecture, data flow diagrams, database relations, and design specs.
- **[API Reference Guide](./docs/API_REFERENCE.md):** Complete reference of all REST endpoints, request/response formats, and error codes.
- **[Modules & Features Guide](./docs/FEATURES.md):** Comprehensive details on each functional module and algorithm.
- **[Deployment & Integration Guide](./docs/DEPLOYMENT_GUIDE.md):** Database migration, server setup, verification procedures, and troubleshooting.
