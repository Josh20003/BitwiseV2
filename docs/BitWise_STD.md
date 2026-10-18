# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
### COLLEGE OF COMPUTER STUDIES
---
# Software Test Document (STD)
## System Name: BitWise V2
**Document Version:** 1.0  
**Date:** October 18, 2026  
**Status:** Initial Draft  
**Target Application:** BitWise Educational Platform (Digital Systems & Computer Architecture)

---

## Change History

| Version | Date | Author | Description of Change |
| :--- | :--- | :--- | :--- |
| **1.0** | October 18, 2026 | Ralph John R. Arnejo & BitWise Dev Team | Initial creation of Software Test Document based on CIT-U CCS Template. Covers System Overview, Test Approach, Test Plan, Core Functional Test Cases, and Appendix Logs. |

---

## Table of Contents
1. [Introduction](#1-introduction)  
   1.1 [System Overview](#11-system-overview)  
   1.2 [Test Approach](#12-test-approach)  
   1.3 [Definitions and Acronyms](#13-definitions-and-acronyms)  
2. [Test Plan](#2-test-plan)  
   2.1 [Features to be Tested](#21-features-to-be-tested)  
   2.2 [Features not to be Tested](#22-features-not-to-be-tested)  
   2.3 [Testing Tools and Environment](#23-testing-tools-and-environment)  
3. [Test Cases](#3-test-cases)  
   - [3.1 Case-01: Number System Conversion (Decimal to Hexadecimal)](#31-case-01-number-system-conversion-decimal-to-hexadecimal)  
   - [3.2 Case-02: Binary Arithmetic Addition with Carry](#32-case-02-binary-arithmetic-addition-with-carry)  
   - [3.3 Case-03: Binary Codes - Hamming(7,4) Error Detection and Correction](#33-case-03-binary-codes---hamming74-error-detection-and-correction)  
   - [3.4 Case-04: Binary Codes - Reflected Gray Code Encoding](#34-case-04-binary-codes---reflected-gray-code-encoding)  
   - [3.5 Case-05: AI Adaptive Practice Initialization & Assessment History](#35-case-05-ai-adaptive-practice-initialization--assessment-history)  
   - [3.6 Case-06: AI Service Fallback Mechanism on API Outage](#36-case-06-ai-service-fallback-mechanism-on-api-outage)  
   - [3.7 Case-07: AI Quiz Score Submission & EMA Mastery Update](#37-case-07-ai-quiz-score-submission--ema-mastery-update)  
   - [3.8 Case-08: JWT Authentication Guard on Protected Endpoints](#38-case-08-jwt-authentication-guard-on-protected-endpoints)  
4. [Appendix (Test Logs)](#appendix-test-logs)  
   - [A.1 Log for Test Execution](#a1-log-for-test-execution)  
   - [A.2 Test Results Summary](#a2-test-results-summary)  
   - [A.3 Incident / Defect Report](#a3-incident--defect-report)  

---

# 1. Introduction

## 1.1 System Overview
**BitWise V2** is an adaptive, AI-powered interactive educational web platform engineered to assist computer science and computer engineering students in mastering fundamental digital design, binary computation, and computer architecture. The platform transforms abstract mathematical and logical concepts into engaging, interactive learning modules with step-by-step algorithmic breakdowns and personalized difficulty scaling.

The platform is designed around a three-tier modular architecture:
1. **Frontend Presentation Tier**: Developed with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Shadcn UI**. Provides an accessible, responsive user interface featuring step-by-step conversion visualization, interactive truth table viewers, and student mastery analytics.
2. **Backend Application Tier**: Built using **NestJS (Node.js)** with modular services:
   - **Calculator & Number Converter Module**: Multi-base conversions (Bases 2 through 36) with detailed arithmetic derivations, complements (1's and 2's), and binary arithmetic.
   - **Binary Codes Translator Module**: Encodes and decodes BCD (Binary Coded Decimal), Gray Code (Reflected Binary), and Hamming(7,4) Single Error Correction (SEC) codes with syndrome parity bit matrices.
   - **Adaptive AI Assessment Module**: Connects to high-reasoning LLM APIs (Google Gemini / Groq API) using the Vercel AI SDK to generate syllabus-bounded multiple choice quizzes with mathematical derivations. Employs **Bayesian Knowledge Tracing (BKT)** and **Exponential Moving Average (EMA)** algorithms to track topic mastery and dynamically calibrate question difficulty.
   - **Boolean Logic Module**: Performs Boolean expression parsing, simplification tracking, and truth table generation.
3. **Data Persistence Tier**: Powered by **PostgreSQL** interfaced through **Prisma ORM**, recording user accounts, lesson histories, attempt logs, and mastery indices, guarded by Supabase Auth and JWT session tokens.

## 1.2 Test Approach
The testing approach for BitWise V2 is a hybrid **Black-Box and White-Box verification and validation strategy** designed to ensure mathematical precision, system resilience, security, and algorithmic compliance:

1. **Unit Testing (White-Box)**:
   - Isolates computational logic within services (`CalculatorConverterService`, `BinaryCodesService`, `AdaptiveService`).
   - Verifies mathematical boundaries, edge cases (zero values, high-radix numbers, bit overflow), parity matrix computations, and BKT probability recalculations.
   - Tooling: Jest test runner and `ts-jest`.
2. **Integration & API Testing**:
   - Assesses the end-to-end communication between HTTP request pipelines, NestJS dependency injection containers, Zod validation pipes, and Prisma database transactions.
   - Tests fallback resilience when external network requests (such as AI API providers) time out or fail.
   - Tooling: Supertest and NestJS Test Modules.
3. **End-to-End (E2E) Functional Testing (Black-Box)**:
   - Executes real HTTP requests against a running test server instance without mocking internal service code to validate public endpoints and error codes.
4. **AI Generation Validation & Test Oracle Verification**:
   - Validates generated quiz structures against strict JSON schema definitions (verifying 4 distinct choices, valid answer key index 0-3, and mathematical derivation).
   - Utilizes BitWise's deterministic converter engines as an automated "Test Oracle" to cross-verify the correctness of AI-generated answers.

## 1.3 Definitions and Acronyms

### Definitions
- **Hamming(7,4) Code**: A linear block error-correcting code that encodes 4 data bits into 7 bits by appending 3 parity bits, capable of detecting and correcting any single-bit transmission error.
- **Gray Code (Reflected Binary)**: A binary numeral system where two successive numeric values differ by exactly one binary digit (bit).
- **Binary Coded Decimal (BCD)**: A digital encoding method where each decimal digit (0–9) is represented by its four-bit binary sequence.
- **Bayesian Knowledge Tracing (BKT)**: A probabilistic statistical model used to evaluate a student's latent mastery state of a skill based on sequential observation of correct and incorrect responses.
- **Exponential Moving Average (EMA)**: A weighted scoring calculation giving more weight to recent assessment attempts to model learning improvement.
- **Test Oracle**: A reference standard or deterministic algorithm used to verify whether the output produced by an AI model or calculator is mathematically correct.
- **Pass/Fail Criteria**: Explicit technical standards (e.g., status codes, response times, exact mathematical string equality) determining test validity.

### Acronyms
| Acronym | Definition |
| :--- | :--- |
| **API** | Application Programming Interface |
| **BCD** | Binary Coded Decimal |
| **BKT** | Bayesian Knowledge Tracing |
| **CCS** | College of Computer Studies |
| **CIT-U** | Cebu Institute of Technology - University |
| **E2E** | End-to-End |
| **EMA** | Exponential Moving Average |
| **JWT** | JSON Web Token |
| **LLM** | Large Language Model |
| **MSB / LSB** | Most Significant Bit / Least Significant Bit |
| **ORM** | Object-Relational Mapping (Prisma) |
| **RDBMS** | Relational Database Management System (PostgreSQL) |
| **SEC** | Single Error Correction |
| **STD** | Software Test Document |
| **UI / UX** | User Interface / User Experience |

---

# 2. Test Plan

## 2.1 Features to be Tested
- **F-01: Number System Conversion Engine**: Arbitrary radix conversions (bases 2 to 36), step-by-step mathematical breakdown, invalid digit validation.
- **F-02: Binary Arithmetic Engine**: Binary addition, subtraction, multiplication, and division with carry/borrow tracking.
- **F-03: Binary Code Translator**: BCD encoding/decoding, Gray Code encoding/decoding, Hamming(7,4) parity bit generation, and single-bit syndrome error correction.
- **F-04: AI Adaptive Quiz Generation**: Prompt boundary compliance, JSON schema adherence, difficulty calibration (Easy/Medium/Hard based on EMA), and fallback question retrieval.
- **F-05: Student Mastery Analytics**: BKT probability updates and EMA calculations based on quiz submissions.
- **F-06: Authentication & Authorization Security**: JWT route protection, guard bypass testing, and user-isolated progress data.

## 2.2 Features not to be Tested
- **Third-Party LLM Infrastructure**: Internal deep learning weight updates, tensor latency, and host network infrastructure of Google AI and Groq servers.
- **External OAuth / Database Hosting**: Physical uptime and hardware failovers of Supabase or remote cloud providers.
- **Browser Rendering Engine Internals**: V8/SpiderMonkey native JavaScript engine compilation speeds.

## 2.3 Testing Tools and Environment

### Hardware & Environment Specifications
- **Operating System:** Windows 11 / Linux (Ubuntu 22.04 LTS)
- **Node.js Runtime:** v20.x or higher
- **Package Manager:** npm v10.x
- **Database Engine:** PostgreSQL 15+ (local instance or Supabase cloud)
- **Client Browsers:** Google Chrome (Latest), Mozilla Firefox (Latest), Microsoft Edge (Latest)

### Software & Testing Libraries
- **Unit & Integration Test Framework:** Jest v29.7.0, `ts-jest` v29.2.5
- **HTTP / E2E Assertion Framework:** Supertest v7.0.0
- **Validation Library:** Zod v3.25 / `class-validator`
- **Mocking Utilities:** `@nestjs/testing` Module Mocks

---

# 3. Test Cases

### 3.1 Case-01: Number System Conversion (Decimal to Hexadecimal)
- **3.1.1 Purpose:** Verify that the system accurately converts a positive decimal integer into its hexadecimal representation with complete step-by-step arithmetic steps.
- **3.1.2 Inputs:**
  - Route: `POST /calculator/convert`
  - Payload:
    ```json
    {
      "value": "255",
      "fromBase": 10,
      "toBase": 16
    }
    ```
- **3.1.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `201 Created`
  - Response Body Contains: `result.targetValue === "FF"`
  - Step Explanation: Must contain step division breakdown showing quotient `15`, remainder `15` ('F').
  - **Pass Criteria:** `targetValue` equals `"FF"` and status is `201`.
- **3.1.4 Test Procedure:**
  1. Boot the NestJS test application via Supertest.
  2. Dispatch a POST request to `/calculator/convert` with the given JSON payload.
  3. Validate HTTP status code and parse the response payload.
  4. Assert `res.body.result.targetValue === 'FF'`.

---

### 3.2 Case-02: Binary Arithmetic Addition with Carry
- **3.2.1 Purpose:** Verify that the binary arithmetic engine properly computes the sum of two binary strings and handles carry propagation.
- **3.2.2 Inputs:**
  - Route: `POST /calculator/arithmetic`
  - Payload:
    ```json
    {
      "operand1": "1010",
      "operand2": "0101",
      "operation": "+"
    }
    ```
- **3.2.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `201 Created`
  - Response Body Contains: `result.result === "1111"`
  - **Pass Criteria:** Calculated binary result matches `"1111"` with no decimal conversion discrepancies.
- **3.2.4 Test Procedure:**
  1. Send POST request to `/calculator/arithmetic` with operands `"1010"` and `"0101"`.
  2. Verify response status is `201`.
  3. Confirm `res.body.result.result === "1111"`.

---

### 3.3 Case-03: Binary Codes - Hamming(7,4) Error Detection and Correction
- **3.3.1 Purpose:** Verify that the Hamming(7,4) engine successfully detects and corrects a flipped single bit in a 7-bit codeword.
- **3.3.2 Inputs:**
  - Route: `POST /calculator/hamming-code`
  - Payload:
    ```json
    {
      "action": "decode",
      "codeword": "1000110"
    }
    ```
- **3.3.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `201 Created`
  - Response Contains: Identified error position, corrected bit, and recovered 4-bit data word.
  - **Pass Criteria:** Error index correctly identifies the altered bit and returns the corrected original data bits.
- **3.3.4 Test Procedure:**
  1. Encode 4-bit data `"1010"` to obtain valid 7-bit codeword.
  2. Introduce an intentional 1-bit error (e.g., flip bit at index 3).
  3. Post mutated codeword to `/calculator/hamming-code`.
  4. Assert error is detected at index 3 and corrected value restores the original data.

---

### 3.4 Case-04: Binary Codes - Reflected Gray Code Encoding
- **3.4.1 Purpose:** Confirm that standard binary numbers are properly converted to Reflected Gray Code according to the XOR algorithm ($G_i = B_i \oplus B_{i+1}$).
- **3.4.2 Inputs:**
  - Route: `POST /calculator/encode-gray`
  - Payload:
    ```json
    {
      "binary": "1100"
    }
    ```
- **3.4.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `201 Created`
  - Expected Gray Code: `"1010"`
  - **Pass Criteria:** `res.body.result.grayCode === "1010"`.
- **3.4.4 Test Procedure:**
  1. Dispatch POST request with binary `"1100"`.
  2. Verify HTTP response code `201`.
  3. Assert `res.body.result.grayCode === "1010"`.

---

### 3.5 Case-05: AI Adaptive Practice Initialization & Assessment History
- **3.5.1 Purpose:** Verify that the assessment controller correctly initializes adaptive practice sessions and retrieves user assessment history via JWT-guarded routes.
- **3.5.2 Inputs:**
  - Route 1: `POST /assessment/start-adaptive-practice`
    ```json
    {
      "uid": "test-user-123"
    }
    ```
  - Route 2: `GET /assessment/history/test-user-123`
- **3.5.3 Expected Outputs & Pass/Fail Criteria:**
  - Route 1 HTTP Status: `201 Created` with `{ "success": true, "data": { ... } }` containing questions array.
  - Route 2 HTTP Status: `200 OK` with `{ "success": true, "data": [ ... ] }`.
  - **Pass Criteria:** `res.body.success === true` and question data is returned without server errors.
- **3.5.4 Test Procedure:**
  1. Initialize test application with overridden `JwtAuthGuard`.
  2. Send POST request to `/assessment/start-adaptive-practice` with payload `{ "uid": "test-user-123" }`.
  3. Validate HTTP 201 and confirm `res.body.success` is true.
  4. Send GET request to `/assessment/history/test-user-123` and assert HTTP 200 with user history.

---

### 3.6 Case-06: AI Service Fallback Mechanism on API Outage
- **3.6.1 Purpose:** Ensure that when external AI API keys are unavailable or rate-limited, the system seamlessly serves curated fallback questions without server errors.
- **3.6.2 Inputs:**
  - Environment: Set invalid/empty `GOOGLE_AI_API_KEY`.
  - Trigger: Request quiz for topic `"binary-arithmetic"`.
- **3.6.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `200 OK`
  - Server Log: Records warning: *"Valid API key not found, using fallback questions"*.
  - Response Body: Delivers pre-verified questions from the local question repository.
  - **Pass Criteria:** Zero uncaught 500 Internal Server Errors; student session continues uninterrupted.
- **3.6.4 Test Procedure:**
  1. Initialize `AiQuizService` with mocked invalid API key credentials.
  2. Call `generateQuiz('test-user-id', 'binary-arithmetic')`.
  3. Check that the returned question array contains valid, curated fallback items.

---

### 3.7 Case-07: AI Quiz Score Submission & EMA Mastery Update
- **3.7.1 Purpose:** Verify that submitting an LLM-generated quiz score updates the user's assessment records and recalibrates their Exponential Moving Average (EMA) mastery.
- **3.7.2 Inputs:**
  - Route: `POST /assessment/ai-quiz/submit`
  - Payload:
    ```json
    {
      "userId": "test-user-123",
      "topic": "Boolean Algebra",
      "score": 90,
      "answersJson": { "q1": "A", "q2": "B" }
    }
    ```
- **3.7.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `201 Created`
  - Response Body: `{ "success": true, "data": { ... } }` containing updated EMA mastery values.
  - Database: `ema_mastery` record updated for `test-user-123` and topic `"Boolean Algebra"`.
  - **Pass Criteria:** HTTP 201 received, `res.body.success === true`, and new EMA reflects the processed quiz score.
- **3.7.4 Test Procedure:**
  1. Dispatch POST request to `/assessment/ai-quiz/submit` with score payload.
  2. Verify HTTP response code `201`.
  3. Assert `res.body.success === true` and verify updated EMA data object.
---

### 3.8 Case-08: JWT Authentication Guard on Protected Endpoints
- **3.8.1 Purpose:** Ensure unauthenticated requests without valid bearer tokens are rejected with HTTP 401 Unauthorized.
- **3.8.2 Inputs:**
  - Route: `GET /adaptive/skills/test-user-123`
  - Header: Empty (No `Authorization` header provided).
- **3.8.3 Expected Outputs & Pass/Fail Criteria:**
  - HTTP Status: `401 Unauthorized`
  - **Pass Criteria:** Request is denied access and no user data is exposed.
- **3.8.4 Test Procedure:**
  1. Execute GET request to `/adaptive/skills/test-user-123` without an Authorization header.
  2. Assert response status is `401`.

---

# Appendix (Test Logs)

## A.1 Log for Test Execution
Below is a sample test log execution output run via Jest (`npm run test:e2e`):

```text
PASS test/calculator.e2e-spec.ts
  CalculatorController (e2e)
    √ /calculator/convert (POST) - should convert decimal 255 to hex FF (42 ms)
    √ /calculator/arithmetic (POST) - should add 1010 and 0101 (28 ms)

PASS test/adaptive.e2e-spec.ts
  AdaptiveController (e2e)
    √ /adaptive/skills/:userId (GET) - should fetch user skills (35 ms)
    √ /adaptive/recommendations/:userId (GET) - should fetch adaptive recommendations (31 ms)

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        2.842 s
Ran all test suites in e2e configuration.
```

---

## A.2 Test Results Summary

| Test Case ID | Test Case Name | Execution Status | Defect Reference | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Decimal to Hexadecimal Conversion | **PASSED** | None | Computed exact value `'FF'` with step logs. |
| **TC-02** | Binary Arithmetic Addition | **PASSED** | None | Proper carry propagation confirmed (`'1111'`). |
| **TC-03** | Hamming(7,4) Error Correction | **PASSED** | None | Corrected single bit error at index 3. |
| **TC-04** | Gray Code Encoding | **PASSED** | None | Standard XOR reflection confirmed. |
| **TC-05** | AI Adaptive Quiz Generation | **PASSED** | None | 100% schema match with derivation keys. |
| **TC-06** | AI Service Fallback Mechanism | **PASSED** | None | Successfully delivered fallback on empty key. |
| **TC-07** | BKT & EMA Progress Calculation | **PASSED** | None | EMA score weighted accurately. |
| **TC-08** | JWT Guard Route Protection | **PASSED** | None | Denied unauthenticated access with 401. |

---

## A.3 Incident / Defect Report

| Incident ID | Date Reported | Severity | Related Test Case | Description | Resolution / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **INC-001** | Oct 16, 2026 | Medium | TC-05 | Intermittent JSON parsing failure when LLM wrapped JSON in conversational text. | **Resolved**: Enforced strict regex extraction `\[[\s\S]*\]` and integrated structured output schema. |
| **INC-002** | Oct 17, 2026 | Low | TC-01 | Radix inputs above 36 caused uncaught range error. | **Resolved**: Added Zod validation constraint capping `fromBase` and `toBase` between 2 and 36. |
