# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
### COLLEGE OF COMPUTER STUDIES

---

# GitHub Repositories
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

## Repositories

| Repository | URL | What is inside | History |
| :--- | :--- | :--- | :--- |
| **BitwiseV2 (Monorepo)** | [https://github.com/Josh20003/BitwiseV2](https://github.com/Josh20003/BitwiseV2) | `bitwise-ui/` (React 19, Vite, Tailwind CSS frontend), `bitwise-server/` (NestJS 11, Fastify, Prisma ORM backend), `bitwise-deploy/` (Traefik, Docker Compose, AWS EC2 automation), `docs/` (Architecture, API specs, SRS, SDD, deployment & refactoring guides) | Active version control since inception; 28+ branches, multiple merged pull requests, and continuous commits tracking curriculum restructuring and AI engine integration. |
| **Bitwise Deployment (Sub-module / Infra)** | [https://github.com/Josh20003/BitwiseV2/tree/main/bitwise-deploy](https://github.com/Josh20003/BitwiseV2/tree/main/bitwise-deploy) | `aws/docker-compose.yml`, `aws/deploy.sh`, Traefik reverse proxy configs, Let's Encrypt automated SSL renewal, secrets management runbooks, and EC2 troubleshooting docs. | Maintained alongside monorepo releases; versioned multi-container production recipes for cloud deployment. |

---

## Contributors (BitwiseV2, Main & Active Branches)

*Counts reflect development roles and merged contributions across the monorepo:*

| Team Member | Role | Key Contributions |
| :--- | :--- | :--- |
| **Menez, John Joshua L.** | Project Lead / Full-Stack & UI Systems Developer | Platform architecture, Lesson 1–3 interactive activity implementation, component refactoring, and Supabase integration. |
| **Arnejo, Ralph John R.** | Lead Frontend Developer / Lesson Architect | Curriculum reorganization (Lessons 4–11), Boolean logic playground, Multiplication/Division interactive trainers, and subtraction borrow logic. |
| **Arpon, Joseph Cris E.** | Backend Developer / Database Engineer | NestJS calculator microservices (`CalculatorConverterService`, `BinaryCodesService`), Prisma schema migrations, and Supabase PgBouncer pooler setup. |
| **Cotiangco, James Gabriel F.** | AI Integration Engineer / Assessment & QA | Google Gemini API & Groq Cloud orchestration, Bayesian Knowledge Tracing (BKT), Exponential Moving Average (EMA) scoring, and unit testing. |
| **Lawas, Berchard Lawrence D.** | DevOps & Systems Documentation Specialist | AWS EC2 Docker deployment, Traefik reverse proxy with Let's Encrypt SSL, repository documentation, SRS/SDD compliance, and deployment evidence. |

---

## Branches and Workflow

* **`main` (Production):** The production-ready branch. Code is deployed to the live cloud server (`https://bitwise.live`) through automated Docker Compose deployment scripts (`bitwise-deploy/aws/deploy.sh`).
* **`new/features` (Staging / Integration):** The primary integration branch where validated feature branches are merged and verified before cutting releases to `main`.
* **Feature Branches (`new_feature_ai`, `feature/refractored-lessons`, `new-feature-refactored-lesson`):** Modular branches isolating curriculum reorganizations, interactive challenge streamlining, and AI assessment prompts.
* **Continuous Testing & Quality Gates:**
  * Strict TypeScript compilation verification (`npx tsc -b`) with **0 errors** before any merge.
  * Prisma migration validation (`npx prisma migrate dev`) ensuring zero database drift against the live Supabase PostgreSQL cluster.
  * Jest test runner (`npm run test`) validating mathematical precision for base conversions (bases 2–36) and Hamming(7,4) error-correcting codes.
* **House Commit Style:** Commit messages follow semantic conventions: a clear prefix (`feat:`, `fix:`, `refactor:`, `docs:`) followed by a concise subject explaining what changed and the pedagogical or architectural reason why.

---

## Repository Deep-Dive: BitwiseV2

| Item | Details |
| :--- | :--- |
| **Repository URL** | [https://github.com/Josh20003/BitwiseV2.git](https://github.com/Josh20003/BitwiseV2.git) |
| **Visibility** | Public / Institutional Capstone Access |
| **Default Branch** | `main` |
| **Active Staging Branches** | `new_feature_ai`, `feature/refractored-lessons`, `new/features` |
| **Latest Commits on Active Track** | • `4a805c8`: *refactor: streamline Lesson 3 interactive activities to practice challenges*<br>• `b7c7d58`: *Merge branch 'new-feature-refactored-lesson' into feature/refractored-lessons: add Lesson 2 and 3 interactive activities*<br>• `1a642a6`: *feat: add interactive activities for number systems and conversions* |
| **Live System** | [https://bitwise.live](https://bitwise.live) |
| **Deployment Platform** | AWS EC2 (`47.129.118.12`) with Traefik v2.11 reverse proxy, Docker Compose V2, and Let's Encrypt TLS termination. Connected to Supabase Cloud PostgreSQL in Tokyo (`ap-northeast-1`). |
| **Key Components** | • **`bitwise-ui/`:** Single-page app built on React 19, TypeScript, Vite, Tailwind CSS, TanStack Router, and custom dark-theme tokens (`#090d18`, `#0c101d`).<br>• **`bitwise-server/`:** High-throughput API server built on NestJS 11, Fastify engine, and Prisma ORM.<br>• **`bitwise-deploy/`:** Multi-container orchestration recipes and automated deployment scripts. |
| **Tech Stack** | • **Frontend:** React 19 · Vite 6.4 · TypeScript 5.8 · Tailwind CSS · TanStack Router · Radix UI<br>• **Backend:** NestJS 11 · Fastify · Node.js 22 LTS · Prisma ORM 6.15<br>• **Database:** PostgreSQL 16 on Supabase (PgBouncer connection pooler on port 6543)<br>• **AI Integration:** Google Gemini API (`@google/generative-ai`), Groq Cloud API, Vercel AI SDK<br>• **Infrastructure:** AWS EC2 (Ubuntu 22.04 LTS), Docker, Traefik v2.11 |
| **Recent Functional Change** | Streamlined Lesson 3 interactive activities into focused, high-retention practice challenges for Decimal-to-Binary and Binary-to-Decimal conversions, removing visualizer boilerplate and duplicate state machines. |

---

## Infrastructure & Deployment Repository: bitwise-deploy

| Item | Details |
| :--- | :--- |
| **Directory Location** | `bitwise-deploy/aws/` inside the primary Bitwise repository |
| **Deployment Platform** | AWS EC2 Instance running Docker Engine (v24+) and Docker Compose V2 plugin |
| **Key Configuration Files** | • `docker-compose.yml`: Defines `traefik`, `bitwise_backend`, and `bitwise_frontend` services on isolated `bitwise_net` bridge.<br>• `deploy.sh`: Production deployment automation script executing Git pull, environment check, Docker build, and container pruning.<br>• `SECRETS_MANAGEMENT.md` & `TROUBLESHOOTING.md`: Security guides and operational runbooks. |
| **Domain & Routing** | • `https://bitwise.live` &rarr; Frontend Nginx container (port 80)<br>• `https://bitwise.live/api` &rarr; Backend NestJS API container (port 3000)<br>• Automated HTTP to HTTPS redirect handled by Traefik middleware |
| **SSL / TLS Encryption** | Automated Let's Encrypt ACME HTTP challenge (`myresolver`) storing certificates in persistent Docker volume. |
| **Relationship to Bitwise Monorepo** | Houses the complete deployment automation pipeline, bridging application code changes with cloud infrastructure. |

---

## Repository URL Evidence

When exporting to PDF, include full screenshots of the GitHub repository interface corresponding to your project:

1. **Screenshot 1: GitHub Repository Overview (`https://github.com/Josh20003/BitwiseV2`)**
   - *Caption:* Root repository view displaying file structure (`bitwise-deploy/`, `bitwise-server/`, `bitwise-ui/`, `docs/`), branch count, and latest commit metadata.
2. **Screenshot 2: GitHub Commits History (`https://github.com/Josh20003/BitwiseV2/commits/`)**
   - *Caption:* Chronological commit history showing team contributions, feature merges, and descriptive commit messages following project conventions.
3. **Screenshot 3: Active Branches & Pull Requests (`https://github.com/Josh20003/BitwiseV2/branches`)**
   - *Caption:* Branch overview highlighting `main`, `new/features`, `feature/refractored-lessons`, and `new_feature_ai`.
4. **Screenshot 4: Deployment Configuration & Infrastructure Files (`bitwise-deploy/aws/`)**
   - *Caption:* Version-controlled Docker Compose and shell script deployment automation recipes in the GitHub repository.
