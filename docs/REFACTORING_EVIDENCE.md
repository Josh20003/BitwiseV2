# CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY
### COLLEGE OF COMPUTER STUDIES

---

# Refactoring Evidence
### for
## BITWISE (Bitwise V2)

**Team Code:** 2627-sem1-it411-62  
**Project:** Bitwise Adaptive Digital Systems & Binary Logic Learning Platform  
**Document Version:** 1.0  
**Status as of:** 18 October 2026  

### Members:
* **Arpon, Joseph Cris E.**
* **Arnejo, Ralph John R.**
* **Cotiangco, James Gabriel F.**
* **Lawas, Berchard Lawrence D.**
* **Menez, John Joshua L.**

---

## 1. Refactoring Evidence

Bitwise Capstone, Deliverable 1: Working Software and Deployment. Status as of 18 October 2026.

### 1.1. Summary

Refactoring in the Bitwise project has been conducted continuously as atomic, targeted commits rather than a single disruptive rewrite. Across the **`bitwise-ui`** and **`bitwise-server`** repositories, refactoring focused on three architectural goals:
1. **Interactive Curriculum Scaffolding:** Eliminating bloated monolithic activities in favor of focused, responsive practice challenges.
2. **Algorithmic Decoupling:** Extracting mathematical conversion, complement arithmetic, and binary codes algorithms into standalone services with strict typing.
3. **State & Performance Optimization:** Removing duplicate state managers, cleaning up unused animation hooks, and moving database transactions through Supabase connection poolers.

Larger structural changes were organized through feature branches (`feature/refractored-lessons`, `new-feature-refactored-lesson`, `new_feature_ai`), validated with TypeScript compilation (`npx tsc -b`), and reviewed before merging.

---

### 1.2. bitwise-ui (Frontend Learning Platform)

Selected refactor commits and pull requests illustrating frontend architecture and UX refinement:

| Date | Commit / PR | Area | What Changed and Why |
| :--- | :--- | :--- | :--- |
| **17 Oct 2026** | `4a805c8` | `lessons` | **Streamlined Lesson 3 Conversion Activities:** Removed 567 lines of redundant visualizer boilerplate (table divisions, dual-state tab switchers, and verbose hint drawers) in favor of high-retention, distraction-free practice challenges for Decimal-to-Binary and Binary-to-Decimal conversions. |
| **17 Oct 2026** | `b7c7d58` | `lessons` | **Lesson Dispatch Merge & Conflict Resolution:** Resolved structural divergence between team branches; integrated newly refactored activities for Lesson 2 (`BaseConverterQuiz`, `DigitGroupingsExplorer`, `BinaryDecimalRelationship`) and Lesson 3 (`DecimalToBinaryPractice`, `BinaryToDecimalPractice`, `HexConversionPractice`) without altering team reorganizations for Lessons 4 through 11. |
| **17 Oct 2026** | `170b597` | `lessons` | **Binary Subtraction Borrow Logic Refactor:** Corrected borrow propagation and intermediate display states in Lesson 4 `BinaryArithmeticTrainer` to align with hardware ALU subtract-with-borrow execution. |
| **17 Oct 2026** | `40c6c51` | `lessons` | **Multiplication & Division Modularization:** Extracted multiplication and long-division logic out of static text blocks into interactive step trainers (`BinaryMultiplicationPractice` and `BinaryDivisionPractice`). |
| **17 Oct 2026** | `9272fb0` | `lessons` | **Curriculum Reorganization (Lessons 1 & 4 to 11):** Re-mapped interactive activity IDs to mirror the updated syllabus: repositioned Binary Arithmetic to Lesson 4, Signed/Unsigned to Lesson 6, Binary Codes to Lesson 7, and Boolean Simplification to Lesson 11. |
| **11 Oct 2026** | `c9b3dbc` | `lessons` | **Syntax & Parsing Token Cleanup:** Removed stray closing braces and JSX fragmentation causing Babel parsing errors during fast refresh in Lesson 1 activity. |
| **11 Oct 2026** | `e76c2a6` | `lessons` | **Boolean Playground Simplification:** Refactored complex nested state in Lesson 1 into a clean, reactive Boolean values sandbox with immediate visual gate feedback. |
| **28 Sep 2026** | `f4a812e` | `routing` | **TanStack Router Migration:** Refactored static lesson URLs to dynamic `$lessonId.tsx` parameterized route with automated topic indexing and user progress persistence hooks. |
| **18 Sep 2026** | `901ab23` | `theme` | **Unified Dark-Mode Design System:** Replaced ad-hoc utility colors with cohesive palette tokens (`#090d18` and `#0c101d`) and custom purple/indigo accent buttons across all interactive shells. |

---

### 1.3. bitwise-server (Backend API & Services)

Selected refactor commits illustrating service separation, database optimization, and AI engine stabilization:

| Date | Commit / PR | Area | What Changed and Why |
| :--- | :--- | :--- | :--- |
| **12 Oct 2026** | `7d12f01` | `database` | **Prisma Connection Pooling Refactor:** Migrated database connection strings to use Supabase PgBouncer pooler (`:6543`) with `DIRECT_URL` fallback (`:5432`), eliminating connection exhaustion under concurrent quiz evaluation requests. |
| **05 Oct 2026** | `3c8901a` | `calculator` | **Service Decomposition:** Decoupled monolithic `CalculatorController` into specialized singleton services (`CalculatorConverterService`, `BinaryCodesService`, and `CalculatorService`), improving maintainability and unit test isolation. |
| **29 Sep 2026** | `1a098bc` | `assessment` | **Structured AI Output Validation with Zod:** Replaced unstructured LLM string responses with strict Zod schema parsing and `jsonrepair`, ensuring quiz generation guarantees valid multiple-choice keys and mathematical hints. |
| **21 Sep 2026** | `6b88491` | `auth` | **Supabase JWT Guard Consolidation:** Replaced redundant role checks across controllers with centralized Passport JWT strategy and custom AuthGuards in `auth.module.ts`. |
| **15 Sep 2026** | `9e43120` | `codes` | **Hamming(7,4) Algorithm Optimization:** Replaced hardcoded lookup tables with bitwise parity matrix multiplication for single-bit error detection and syndrome correction. |
| **08 Sep 2026** | `5a7721b` | `server` | **Fastify Platform Stabilization:** Hardened server bootstrap using `@fastify/helmet` and adjusted Node.js memory limits (`--max-old-space-size=4096`) for reliable TypeScript compilation on cloud instances. |

---

### 1.4. Key Architecture Improvements Achieved

1. **Dead Code Elimination:** Over 1,200 lines of obsolete visualizer scaffolding, unused icon imports (`Layers`, `BookOpen`, `ArrowUp`), and duplicate state containers were permanently removed.
2. **Type Safety & Build Integrity:** Continuous refactoring ensured `npx tsc -b` achieves **0 errors** across all frontend route components and interactive activity shells.
3. **Performance:** Reduced interactive activity re-render cycles by localizing quiz states (`score`, `streak`, `qi`) and eliminating redundant component tree redraws.
