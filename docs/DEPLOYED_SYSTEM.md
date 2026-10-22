# Bitwise: Deployed System

**Bitwise capstone, deliverable 1: Working Software and Deployment. Status as of 18 October 2026.**  
Bitwise is deployed and running in production. Students, educators, and evaluators access the web platform at `https://bitwise.live`, served by the NestJS backend API at `https://bitwise.live/api`. Cloud database storage and user authentication are powered by Supabase PostgreSQL (Tokyo region). The adaptive assessment engine integrates Google Gemini and Groq Cloud. Every public service below answered normally when checked on 18 October 2026.

---

## Live URLs

| Component | URL | Hosted on | Status (18 Oct 2026) |
| :--- | :--- | :--- | :--- |
| **Bitwise Website** *(Students, Educators, Guests)* | [https://bitwise.live](https://bitwise.live) | AWS EC2 (Docker / Nginx via Traefik), Elastic IP `47.129.118.12` | **Online**, served with Let's Encrypt TLS certificate |
| **Bitwise Backend API** | [https://bitwise.live/api](https://bitwise.live/api)<br>*(health check: `/api/calculator/convert`)* | AWS EC2 (Docker / NestJS 11 + Fastify), port 3000 | **Online**, health check returns `200 OK` with JSON result |
| **Cloud Database & Auth (Supabase)** | [https://fqueemuseyjgwsssgbvi.supabase.co](https://fqueemuseyjgwsssgbvi.supabase.co) | Supabase Cloud (AWS Tokyo `ap-northeast-1`) | **Online**, PgBouncer transaction pooler active |
| **Number System Converter API** | `https://bitwise.live/api/calculator/number-systems` | AWS EC2 (NestJS) | **Online**, returns active radix specifications (bases 2–36) |
| **Adaptive AI Assessment Service** | `https://bitwise.live/api/ai/chat` | Google Cloud (Gemini API) & Groq Cloud | **Online**, ready for BKT quiz generation and Socratic hints |
| **Local Staging Environment** | `http://localhost:5173` *(UI)*<br>`http://localhost:3000` *(API)* | Local development workstation (Vite 6.4 + NestJS) | **Online**, verified operational |

---

## Demo Accounts

Production supports both authenticated user tracking and open-access guest modes. Evaluators may either use the demo credentials prepared by the team below or register a personal student account, which takes less than one minute.

| Role | What the role can do | Email | Password | How to get this role yourself |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Learner)** | Complete 11 structured lessons, solve interactive practice challenges, take AI-generated adaptive quizzes with Bayesian Knowledge Tracing (BKT) and EMA mastery tracking, view personal skill dashboard. | `[to fill in]` | `[to fill in]` | Sign up at [https://bitwise.live/register](https://bitwise.live/register) with email and password or Google OAuth. Verify account via confirmation email. |
| **Guest (Anonymous)** | Freely access all multi-mode calculators (Boolean Algebra, Binary Arithmetic, 1's & 2's Complements) and base converters. Experiment with lesson activities without persistent progress saving. | *(No login required)* | *(No login required)* | Navigate directly to [https://bitwise.live](https://bitwise.live) or [https://bitwise.live/lessons](https://bitwise.live/lessons) and start practicing immediately. |
| **Administrator / Educator** | Oversee curriculum topics, inspect student cohort mastery distributions, review adaptive quiz telemetry, and monitor API token usage. | `[to fill in]` | `[to fill in]` | Not self-service. Admin accounts are provisioned directly in the database or provided by the team for evaluation panels. |

---

## Access Notes

* **Website Access:** Open [https://bitwise.live](https://bitwise.live) and log in at `/login`. After logging in, students are redirected to their personalized learning dashboard and curriculum overview.
* **Curriculum & Scaffolding Navigation:** Navigate to `/lessons` to access all 11 digital logic modules. Interactive activities (such as Decimal-to-Binary practice in Lesson 3) provide immediate validation badges, streak scoring, and live input checking.
* **Multi-Mode Calculators:** Direct access is available via `/calculator` and `/converter`. These tools provide step-by-step algorithmic division and expansion traces without requiring active login.
* **Adaptive AI Quizzes:** When taking an assessment, the system runs Bayesian Knowledge Tracing (BKT) and Exponential Moving Average (EMA) to adjust question difficulty dynamically. The AI tutor provides guided hints without spoiling answers.
* **Local Staging Walkthrough:** For offline panel demonstrations, the system can run locally with zero external network dependencies (except AI APIs) by executing `npm run start:dev` in `bitwise-server` (port 3000) and `npm run dev` in `bitwise-ui` (port 5173).
