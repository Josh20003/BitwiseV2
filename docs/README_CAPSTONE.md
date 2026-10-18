# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
### COLLEGE OF COMPUTER STUDIES

---

# README
### for
# BITWISE (BITWISE V2)

**Team Code:** 2627-sem1-it411-62  
**Project:** Bitwise: An Adaptive, AI-Powered Digital Systems & Binary Logic Learning Platform  
**Document Version:** 1.0  
**Status as of:** 18 October 2026  

### Members:
* **Arpon, Joseph Cris E.**
* **Arnejo, Ralph John R.**
* **Cotiangco, James Gabriel F.**
* **Lawas, Berchard Lawrence D.**
* **Menez, John Joshua L.**

---

## Bitwise

**An adaptive, AI-powered educational ecosystem for computer engineering and digital systems.**

$$\text{Curriculum (11 Interactive Lessons)} \longrightarrow \text{Multi-Mode Tools (Calculators \& Converters)} \longrightarrow \text{Cloud Database (Supabase PostgreSQL)} \longrightarrow \text{Adaptive AI Engine (Gemini \& Groq)}$$

```
+---------------------------------------------------------------------------------------------------+
|                                         BITWISE ECOSYSTEM                                         |
+--------------------------+-----------------------------+--------------------+---------------------+
|        Learn Tier        |       Tools Workspace       |     Cloud Tier     |   Assessment Tier   |
|  11 Scaffolding Lessons  |  Arithmetic, Logic, Codes   | Supabase Tokyo RDS |  Adaptive BKT & EMA |
| Interactive Challenges   |  Step-by-step Trace Engine  |  PgBouncer Pooler  |  Gemini & Groq AI   |
+--------------------------+-----------------------------+--------------------+---------------------+
```

`bitwise.live` · `Features` · `Architecture` · `Run It Locally` · `Team`

**React 19** · **TypeScript** · **Vite** · **Tailwind CSS** · **TanStack Router** · **NestJS 11** · **Fastify** · **Prisma ORM** · **PostgreSQL (Supabase)** · **Google Gemini API** · **Groq Cloud** · **Traefik v2.11** · **Docker** · **AWS EC2**

---

## Why Bitwise

Foundational courses in Computer Science and Computer Engineering—specifically Digital Logic Design, Discrete Mathematics, and Computer Organization & Architecture—face a persistent pedagogical challenge:

1. **Abstract Mental Models:** Concepts such as two's complement sign extension, binary borrow cascades, Gray code transitions, and Hamming error syndromes are difficult to visualize on static paper or presentation slides.
2. **Tedious Manual Verification:** Students solving homework exercises spend hours on manual arithmetic or table drawing with no immediate verification of intermediate steps.
3. **One-Size-Fits-All Practice:** Traditional question banks do not dynamically adapt to a learner's mastery level or diagnose the specific mathematical misconception behind an incorrect answer.

**Bitwise** addresses both sides of the digital logic learning pipeline:
- **Interactive Scaffolding:** 11 structured lessons with gamified practice challenges, real-time bit-toggle inputs, dynamic Karnaugh maps, and automated answer validation.
- **Multi-Mode Calculation Workbench:** A robust computational laboratory providing step-by-step mathematical traces for arbitrary base conversions (bases 2–36), binary vertical arithmetic with ALU status flags, and error-correcting codes.
- **Adaptive AI Assessment Engine:** Evaluates student problem-solving in real time using **Bayesian Knowledge Tracing (BKT)** and **Exponential Moving Average (EMA)** scoring, delivering targeted AI hints and personalized question generation.

### North-Star Outcomes
* **Students:** Master the mental mechanics of binary arithmetic and logic gates through self-paced interactive feedback rather than rote memorization.
* **Instant Step Verification:** Verify intermediate steps (carries, borrows, minterms, parity syndromes) in sub-seconds.
* **Continuous Mastery Tracking:** Clear visibility into topic mastery across five competency tiers (Novice $\to$ Expert).

---

## Features

### 1 · Educational Scaffolding (11 Structured Lessons)
Comprehensive, interactive curriculum guiding learners from fundamental bits to complex logic minimization:
* **Lesson 1:** Introduction to Number Systems & Binary Builders
* **Lesson 2:** Types of Number Systems (Nibble, Byte, and Word groupings)
* **Lesson 3:** Number System Conversions (High-yield practice challenges for Decimal $\leftrightarrow$ Binary and Hex $\leftrightarrow$ Octal)
* **Lesson 4:** Binary Arithmetic (Vertical Addition, Subtraction with borrow, Multiplication, and Division)
* **Lesson 5:** Complements & Inversion (1's and 2's complement mental models)
* **Lesson 6:** Signed and Unsigned Representation (Sign-magnitude vs. two's complement ranges)
* **Lesson 7:** Binary Codes (BCD, Gray Code, and ASCII encodings)
* **Lesson 8:** Introduction to Boolean Algebra & Basic Laws
* **Lesson 9:** Logic Gates & Circuit Simulation (Interactive gate wiring)
* **Lesson 10:** Truth Table Construction & Multi-variable Evaluation
* **Lesson 11:** Logic Simplification (Interactive 2, 3, and 4-variable Karnaugh Maps & Boolean Law Matcher)

### 2 · Multi-Mode Calculator & Arithmetic Workspace
A dedicated laboratory for step-by-step binary manipulation:
* **Vertical Arithmetic:** Interactive step navigation showing carries, borrows, and partial products.
* **Hardware ALU Flags:** Real-time inspection of Zero ($Z$), Carry ($C$), Overflow ($V$), and Sign ($S$) flags.
* **1's & 2's Complement Negation:** Bitwise inversion visualizer and end-around carry handlers.

### 3 · Number System Converter & Error-Correcting Codes
* **Universal Base Converter:** Converts between Binary, Octal, Decimal, Hexadecimal, and arbitrary bases (2–36) with algorithmic division and expansion step cards.
* **Hamming(7,4) Code:** Interactive bit-flipping simulator demonstrating single-bit error detection and syndrome parity correction.
* **BCD & Gray Code:** Real-time encoding and decoding preserving single-bit transition properties.

### 4 · Adaptive AI Assessment & Ask AI Tutor
* **Adaptive Quiz Engine:** Dynamically generates problems adjusted to user skill level via Groq API and Google Gemini API.
* **Knowledge Tracing (BKT & EMA):** Bayesian estimation of concept mastery after each problem submission.
* **Context-Aware Socratic AI:** Integrated tutor panel providing step explanations and error diagnostics without giving away direct answers.

### Across the Platform
* **Cohesive Dark Theme:** High-contrast, accessibility-focused palette (`#090d18` and `#0c101d`) with custom purple/indigo accenting.
* **Zero Client Secret Leakage:** All AI inference and database transactions are secured behind the NestJS backend and Supabase Service Role keys.
* **High-Performance Architecture:** Zero-runtime CSS with Tailwind, sub-200ms interaction latency, and sub-300ms micro-animations.

---

## Architecture

```
                             [ CLIENTS ]
                                  |
              +-------------------+-------------------+
              |                                       |
     Web Application (Desktop/Tablet)         Mobile Browser
     React 19 + Vite + TanStack Router        Responsive Touch Layout
              |                                       |
              +-------------------+-------------------+
                                  |
                           HTTPS (Port 443)
                                  |
                     [ REVERSE PROXY & SSL ]
                     Traefik v2.11 (AWS EC2)
                     Automated Let's Encrypt TLS
                                  |
              +-------------------+-------------------+
              |                                       |
      Path: / (Port 80)                       Path: /api (Port 3000)
    [ FRONTEND CONTAINER ]                    [ BACKEND API CONTAINER ]
    Nginx Alpine (Static Bundle)              NestJS 11 + Fastify Runtime
                                                      |
                                      +---------------+---------------+
                                      |                               |
                              [ DATABASE TIER ]               [ AI CLOUD TIER ]
                         Supabase PostgreSQL (Tokyo)         Google Gemini API
                          PgBouncer Pooler (:6543)             Groq Cloud API
```

### Module Boundaries
* **Client Isolation:** The frontend never connects directly to PostgreSQL or LLM vendor APIs; all requests flow through the typed NestJS backend.
* **Stateless Calculations:** Conversion algorithms and complement arithmetic execute deterministically in pure backend services, guaranteeing instantaneous response times.
* **Database Connection Pooling:** Prisma connects through Supabase's PgBouncer pooler (`:6543`) to support high-concurrency classroom quiz sessions without connection exhaustion.

---

## Backend Feature Packages

`bitwise-server/src/*`, each encapsulating its controllers, services, DTOs, and Prisma queries:

| Package | Responsibility |
| :--- | :--- |
| `auth` | Supabase JWT verification, role management, and Passport authentication strategies |
| `calculator` | Base conversions (2–36), multi-step paths, BCD, Gray code, and Hamming(7,4) code |
| `assessment` | Adaptive quiz session orchestration, BKT probability estimation, and EMA mastery scoring |
| `lessons` | Lesson content retrieval, topic ordering, progress tracking, and completion verification |
| `progress` | User skill matrix, attempt histories, and performance analytics |
| `ai` | Google Gemini and Groq API orchestration, Socratic prompt construction, and response sanitization |
| `common` | Global error filters, Fastify helmet security headers, and Zod validation pipes |

---

## Tech Stack

| Product | Stack | Hosting |
| :--- | :--- | :--- |
| **Frontend Web App** | React 19, TypeScript 5.8, Vite 6.4, Tailwind CSS, TanStack Router, Radix UI | AWS EC2 (Docker / Nginx) |
| **Backend REST API** | NestJS 11, Fastify, TypeScript, Node.js 22 LTS, Prisma ORM 6.15 | AWS EC2 (Docker) |
| **Database & Auth** | PostgreSQL 16 (PgBouncer connection pooler), Supabase Auth | Supabase Cloud (AWS Tokyo `ap-northeast-1`) |
| **AI Inference** | Google Gemini API (`@google/generative-ai`), Groq Cloud API, Vercel AI SDK | Cloud APIs |
| **Reverse Proxy & SSL** | Traefik v2.11, Let's Encrypt ACME HTTP Challenge | AWS EC2 |
| **Infrastructure** | Ubuntu 22.04 LTS, Docker Compose V2, Elastic IP (`47.129.118.12`) | AWS EC2 |

---

## Repository Layout

```
bitwise/
├── bitwise-deploy/
│   └── aws/
│       ├── docker-compose.yml    # Production container orchestration
│       ├── deploy.sh             # Automated server deployment script
│       └── README.md             # AWS setup & maintenance guide
├── bitwise-server/
│   ├── src/                      # NestJS application modules
│   ├── prisma/
│   │   ├── schema.prisma         # Database models & relations
│   │   └── migrations/           # Versioned SQL migrations
│   ├── Dockerfile                # Production backend container build
│   └── package.json
├── bitwise-ui/
│   ├── src/
│   │   ├── components/           # Reusable UI & interactive lesson activities
│   │   ├── routes/               # TanStack Router dynamic route tree
│   │   └── lib/                  # Styling tokens, state stores, and utilities
│   ├── Dockerfile                # Production frontend Nginx container build
│   └── package.json
└── docs/                         # Capstone deliverables, SRS, SDD, and architectural documentation
    ├── ARCHITECTURE.md
    ├── API_REFERENCE.md
    ├── FEATURES.md
    ├── DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_EVIDENCE.md
    └── REFACTORING_EVIDENCE.md
```

---

## Where the Documentation Lives

| File Path | What It Covers |
| :--- | :--- |
| `README.md` | Quick start, local development prerequisites, and project overview |
| `docs/ARCHITECTURE.md` | Complete system architecture, database ERD, data flow diagrams, and module specs |
| `docs/API_REFERENCE.md` | Full REST endpoint specifications, request payloads, response schemas, and error codes |
| `docs/FEATURES.md` | In-depth documentation of all 5 functional modules and interactive algorithms |
| `docs/DEPLOYMENT_GUIDE.md` | Step-by-step database migration, service integration, and verification procedures |
| `docs/DEPLOYMENT_EVIDENCE.md` | Capstone Deliverable 1: Live checks, cloud hostings, and operational evidence |
| `docs/REFACTORING_EVIDENCE.md` | Capstone Deliverable 1: Git commit history, structural refactoring, and code reduction |

---

## Local Setup: Bitwise

Secrets and environment variables are strictly managed through `.env` files (never committed to version control).

### 1. Prerequisites
* **Node.js:** `v20.x` or `v22.x LTS`
* **npm:** `v10.x` or higher
* **Git**
* Cloud database credentials (Supabase PostgreSQL)

### 2. Backend Setup (`bitwise-server`)
```bash
cd bitwise-server

# Install dependencies and generate Prisma Client
npm install

# Verify database connection and run schema migrations
npx prisma migrate dev

# Start development server with hot-reload
npm run start:dev
```
*Backend API initializes on `http://localhost:3000`.*

### 3. Frontend Setup (`bitwise-ui`)
```bash
cd bitwise-ui

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend application opens on `http://localhost:5173`.*

### 4. Sanity Verification
Test the calculation endpoint via terminal:
```bash
curl -X POST http://localhost:3000/api/calculator/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1010","fromBase":2,"toBase":10}'
```
Expected response:
```json
{"success": true, "result": {"sourceValue":"1010", "sourceBase":2, "targetBase":10, "targetValue":"10"}}
```

---

## Deployment Summary

| Surface | URL | Platform |
| :--- | :--- | :--- |
| **Production Website** | `https://bitwise.live` | AWS EC2 (Docker / Nginx via Traefik) |
| **Production API Gateway** | `https://bitwise.live/api` | AWS EC2 (Docker / NestJS via Traefik) |
| **Database Cluster** | `aws-1-ap-northeast-1.pooler.supabase.com` | Supabase Cloud (PostgreSQL 16) |
| **Staging / Preview** | `http://localhost:5173` | Local Vite Dev Server |

---

## Principles the Code Holds To

1. **Strict Type Safety:** Zero tolerance for `any` types in algorithmic calculations, ensuring conversion results never produce JavaScript floating-point rounding errors.
2. **Deterministic Fallbacks:** Core calculation tools (Boolean simplification, base conversion, complement math) execute locally in deterministic TypeScript services—they never fail even if third-party AI APIs experience downtime.
3. **Database Connection Reuse:** All backend data access leverages PgBouncer transaction pooling to eliminate PostgreSQL connection leaks under heavy student concurrency.
4. **Pedagogical Clarity Over Brevity:** Intermediate steps (carries, borrows, partial minterms) are always explicitly computed and retained in response payloads to maximize learning value.

---

## Licence

**Academic Capstone Project. All rights reserved.**

Copyright © 2026 Bitwise Team. This software and its source code are the proprietary property of the Bitwise capstone team and **Cebu Institute of Technology – University**. No part of this project may be copied, modified, distributed, or used in any form without explicit written permission from the authors.

---

## Team

**Capstone Project, IT411 Section 62**  
*College of Computer Studies, Cebu Institute of Technology – University.*

| Name | Role |
| :--- | :--- |
| **Menez, John Joshua L.** | Project Lead / Full-Stack & UI Systems Developer |
| **Arnejo, Ralph John R.** | Lead Frontend Developer / Interactive Lesson Architect |
| **Arpon, Joseph Cris E.** | Backend Developer / Database & Calculator Engine |
| **Cotiangco, James Gabriel F.** | AI Integration Engineer / Assessment & QA Lead |
| **Lawas, Berchard Lawrence D.** | DevOps & Systems Documentation Specialist |

**Adviser:** Dr. / Prof. *(Add Adviser Name)*  

*Built for students tired of confusing binary tables and educators seeking truly interactive digital logic learning.*
