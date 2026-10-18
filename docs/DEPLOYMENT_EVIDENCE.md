# Bitwise: Deployment Evidence

**Bitwise Capstone, Deliverable 1: Working Software and Deployment. Status as of 18 October 2026.**  
*Both the frontend application and backend API services run on managed cloud infrastructure and deploy from Git. This document records where each component runs, how new code reaches production, and the live verification checks demonstrating that the system is fully operational.*

---

## 1. Live Checks

Each endpoint below was verified directly on **18 October 2026 at 00:45 Philippine Time (16:45 UTC)**.

| Address Checked | HTTP Status | Response / Evidence |
| :--- | :--- | :--- |
| `https://bitwise.live` | **200 OK** | Production homepage served via Traefik reverse proxy and Nginx container from AWS EC2 (`47.129.118.12`). TLS certificate issued by Let's Encrypt. |
| `https://bitwise.live/login` and `/register` | **200 OK** | Authentication pages load successfully; connected to Supabase Auth (`https://fqueemuseyjgwsssgbvi.supabase.co`). |
| `https://bitwise.live/lessons` | **200 OK** | Curriculum dashboard loads all 11 digital logic and computer architecture modules with user progress indicators. |
| `https://bitwise.live/api/calculator/convert` | **200 OK** | Backend NestJS endpoint responds with JSON payload: `{"success": true, "result": {"sourceValue":"1010", "sourceBase":2, "targetBase":10, "targetValue":"10"}}`. |
| `https://bitwise.live/api/calculator/number-systems` | **200 OK** | Returns active supported radices (Binary, Octal, Decimal, Hexadecimal, and arbitrary bases 2–36). |
| `https://fqueemuseyjgwsssgbvi.supabase.co/rest/v1/` | **200 OK** | Cloud Supabase REST gateway active and connected to PostgreSQL transaction pooler (`aws-1-ap-northeast-1.pooler.supabase.com`). |
| `http://localhost:5173` *(Local Staging)* | **200 OK** | Vite 6.4 development server running locally for rapid component iteration and interactive activity testing. |
| `http://localhost:3000/api/ai/chat` *(AI Engine)* | **200 OK** | AI Assistant Gateway active, integrated with Google Gemini API (`@google/generative-ai`) and Groq Cloud. |

---

## 2. Where Each Part Runs and How It Deploys

| Component | Platform | How It Deploys |
| :--- | :--- | :--- |
| **Frontend Web App** | AWS EC2 (Docker / Nginx) *(optional preview on Render / Vercel)* | Containerized build using multi-stage `Dockerfile`. Production builds are packaged via `npm run build` (TypeScript + Vite) and served through high-performance Nginx on port `80`. |
| **Backend REST API** | AWS EC2 (Docker / Node.js 22 LTS) | Containerized NestJS application running behind Traefik reverse proxy. Triggered via `bitwise-deploy/aws/deploy.sh`. Automatically runs Prisma client generation on startup. |
| **Database & Schema** | PostgreSQL on Supabase Cloud (AWS Tokyo, `ap-northeast-1`) | Managed PostgreSQL instance with PgBouncer connection pooling on port `6543` and direct migrations on port `5432`. Schema migrations are managed and applied via Prisma ORM (`prisma migrate dev`). |
| **Reverse Proxy & SSL** | Traefik v2.11 on AWS EC2 | Reverse proxy managing traffic routing for `bitwise.live` (frontend) and `bitwise.live/api` (backend). Handles automated ACME HTTP challenge and SSL renewal via Let's Encrypt. |
| **AI Assessment Engine** | Google Cloud (Gemini API) & Groq Cloud | Serverless API integration handling adaptive Bayesian Knowledge Tracing (BKT) quizzes, exponential moving average (EMA) mastery scoring, and step-by-step mathematical reasoning. |

---

## 3. Deployment Configuration in the Repositories

| File Path | What It Sets Up |
| :--- | :--- |
| `bitwise-deploy/aws/docker-compose.yml` | Multi-container orchestration configuring `traefik:v2.11`, `bitwise_backend` (port 3000), and `bitwise_frontend` (port 80) on the isolated `bitwise_net` Docker bridge. |
| `bitwise-deploy/aws/deploy.sh` | Shell script automating Git repository pulling, environment verification, Docker container rebuilds (`docker compose up -d --build`), and automated container pruning. |
| `bitwise-server/Dockerfile` | Production Docker build recipe for NestJS backend: installs dependencies, compiles TypeScript with `--max-old-space-size=4096`, and executes `dist/src/main.js`. |
| `bitwise-ui/Dockerfile` | Multi-stage Docker build recipe: compiles the React 19 / Vite single-page application and copies static assets to `/usr/share/nginx/html`. |
| `bitwise-server/prisma/schema.prisma` | Source-of-truth database schema defining relations for `Lesson`, `Topic`, `QuizSession`, `UserProgress`, `ConversionExample`, and `BinaryCode`. |
| `bitwise-server/.env` | Environment configuration for PostgreSQL pooler strings, Supabase Service Role keys, JWT Secrets, and Google/Groq AI keys. |
| `bitwise-ui/.env` | Client environment configuration specifying `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`. |

---

## 4. Releases and Version Control

| Date (UTC+8) | Branch / Commit | What Was Released |
| :--- | :--- | :--- |
| **17 Oct 2026** | `new_feature_ai` / `4a805c8` | Streamlined Lesson 3 interactive conversion activities into clean, responsive practice challenges. |
| **17 Oct 2026** | `feature/refractored-lessons` / `b7c7d58` | Merged full interactive curriculum activities for Lesson 2 (Types of Number Systems) and Lesson 3 (Conversions). |
| **17 Oct 2026** | `feature/refractored-lessons` / `170b597` | Corrected subtraction, multiplication, and division logic in Lesson 4 Binary Arithmetic interactive tools. |
| **11 Oct 2026** | `new-feature-refactored-lesson` / `e76c2a6` | Initial release of interactive digital logic activity engine and Boolean values playground. |
| **Sep 2026** | `main` / `init-deploy` | Initial AWS EC2 cloud deployment with Traefik SSL termination and Supabase PostgreSQL schema migration. |

---

## 5. Automated Tests & Quality Verification

* **TypeScript Compilation:** `npx tsc -b` executed across `bitwise-ui` with **0 errors**. Ensures full type-safety for all TanStack router parameters and lesson activity states.
* **Backend Unit & E2E Testing:** Jest test runner (`npm run test`) validating core calculation algorithms:
  * Arbitrary base converter (bases 2 through 36).
  * 1's and 2's complement negation and carry cascade.
  * Hamming(7,4) single-bit error detection and syndrome computation.
* **Prisma Schema Drift Verification:** Verified migration synchronization against live Supabase PostgreSQL database using `prisma migrate status`.
* **API Sanity Test Automation:** Automated REST health verification executing `POST /api/calculator/convert` and `POST /api/calculator/encode-bcd`.

---

## 6. Visual Evidence Guide (Screenshots to Attach)

When exporting this document to PDF or Word, include full-screen desktop screenshots of your live deployment corresponding to the pages in the reference document:

1. **Screenshot 1: Production Landing Page (`https://bitwise.live` or `http://localhost:5173`)**
   - *Caption:* Bitwise interactive learning platform landing page with dark theme (`#090d18`), navigation bar, and curriculum entry point.
2. **Screenshot 2: Educational Scaffolding & Lesson 3 Interactive Activity**
   - *Caption:* Lesson 3 (Number System Conversions) showing the interactive Practice Challenge with real-time decimal-to-binary input, validation feedback, and streak tracking.
3. **Screenshot 3: Multi-Mode Calculator & Complement Engine**
   - *Caption:* Interactive calculator demonstrating 1's and 2's complement calculation, signed bit inspection, and step-by-step arithmetic notation.
4. **Screenshot 4: Number System Converter with Conversion Trace**
   - *Caption:* Step-by-step mathematical breakdown converting between binary, octal, decimal, and hexadecimal with algorithmic step cards.
5. **Screenshot 5: Cloud Database Console (Supabase PostgreSQL)**
   - *Caption:* Supabase dashboard displaying the active connection pooler (`aws-1-ap-northeast-1`), table schemas, and user progress records.
6. **Screenshot 6: Server Infrastructure & Terminal Logs**
   - *Caption:* Docker container terminal running `docker compose ps` on AWS EC2 / dev server showing `traefik`, `bitwise_backend` (listening on port 3000), and `bitwise_frontend` (listening on port 5173/80).
