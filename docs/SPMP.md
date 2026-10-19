# Software Project Management Plan (SPMP)

**Project:** Bitwise Extended
**Version:** 2.0 (Mid‑term submission)
**Prepared by:** IT411 – G1‑G8 Team
**Date:** 2026‑10‑17

---

## 1. Overview
### 1.1 Project Summary
Bitwise Extended is an AI‑powered educational platform that expands the original Bitwise MVP with:
- AI‑Tutor panel
- Number System Converter
- Binary Arithmetic Workspace
- Complement Bit Row visualiser
- Dark‑theme UI with micro‑animations
- Token‑conservative backend APIs
- Adaptive quizzes with EMA mastery tracking

The mid‑term deliverable shows the MVP findings have been incorporated, documentation updated, and the system is fully functional, tested and deployed.

### 1.1.1 Purpose, Scope & Objectives
- **Purpose** – Deliver a production‑ready version meeting enhanced functional and non‑functional requirements.
- **Scope** – All source code, docs, and deployment artefacts for frontend, backend and Supabase. Mobile apps are out of scope.
- **Objectives** – UI redesign, AI‑Tutor integration, 100 % test coverage, public deployment, and up‑to‑date artefacts (SRS, SDD, SPMP, STD, RTM).

### 1.1.2 Assumptions & Constraints
- Stable internet for AI services.
- All team members on Windows with modern browsers.
- Supabase free tier limits.
- No external CI/CD beyond GitHub Actions.

### 1.1.3 Deliverables
| Deliverable | Format | Due |
|------------|--------|-----|
| Live System | URL | 2026‑10‑17 |
| Source Code | Git repo | 2026‑10‑17 |
| README | Markdown | 2026‑10‑17 |
| Feature Completion Matrix | Markdown | 2026‑10‑17 |
| SRS, SDD, SPMP, STD, RTM | Markdown | 2026‑10‑17 |
| Defect Log | Markdown | 2026‑10‑17 |
| Usability Report | PDF | 2026‑10‑17 |

## 2. Evolution of Plan
The SPMP is version‑controlled (`docs/SPMP.md`). Updates are PR‑based and tagged after each milestone.

## 3. References
1. IEEE Std 1058‑1998 – Software Project Management Plans.
2. CIT‑U SRS Template 2025‑2026.
3. Repository – https://github.com/Josh20003/BitwiseV2
4. Internal AI assessment API docs.

## 4. Definitions
- **EMA** – Exponential Moving Average (mastery tracking).
- **AI‑Tutor** – LLM‑driven help panel.
- **SPMP, SRS, SDD, STD, RTM** – Standard software engineering documents.
- **SUS** – System Usability Scale.

## 5. Organization
### 5.1 External Structure
- **Acquirer:** CIT‑U
- **Client:** University students & instructors
- **Subcontractors:** None
### 5.2 Internal Structure
```
IT411 – G1‑G8 Team
│
├─ Project Lead – schedule & risk
├─ Front‑end Lead – UI/UX (React + Tailwind)
├─ Backend Lead – NestJS & Supabase
├─ AI Engineer – Prompt engineering
├─ QA Engineer – Test plan & CI
└─ Documentation Lead – SRS/SDD/SPMP
```

## 6. Managerial Process Plans
- **Start‑up:** Estimation ±40 % confidence, staffing 6 members, resources Supabase & GitHub.
- **Work:** Agile 3‑week sprints, CI pipeline (lint, Jest, Cypress, k6).
- **Control:** GitHub Issues for requirements, weekly stand‑ups, burn‑down charts, budget tracked via Supabase dashboard.

## 7. Technical Process Plans
Iterative Agile with tools: React, Tailwind, NestJS, Prisma, Jest, Cypress, k6, GitHub Actions.

## 8. Supporting Process Plans
- **Configuration Management:** Git versioning, `docs/CHANGELOG.md`.
- **Verification & Validation:** Test cases in `docs/STD.md`, traceability via RTM.
- **Documentation:** Markdown in `docs/`, PDFs archived on Drive.
- **Quality Assurance:** Peer reviews, ESLint & Prettier.

## 9. Additional Plans
- **Security:** HTTPS, JWT via Supabase, input validation.
- **Maintenance:** Monthly bug‑fix releases, dependency updates.

---
*Prepared by the Documentation Lead (Berchard) and approved by the team.*

**Project:** Bitwise Extended
**Version:** 2.0 (Mid‑term submission)
**Prepared by:** IT411 – G1‑G8 Team
**Date:** 2026‑10‑17

---

## 1. Overview

### 1.1 Project Summary
Bitwise Extended is an adaptive, AI‑powered educational platform that teaches digital systems, computer architecture, and binary logic through interactive tools, quizzes, and a premium UI. The platform builds on the original Bitwise MVP and adds:
- **Ask AI Tutor** – a collapsible AI‑assistant panel with suggested‑question chips.
- **Number System Converter** – step‑by‑step conversion traces for Binary, Octal, Decimal, Hexadecimal.
- **Binary Arithmetic Workspace** – vertical notation, animated carry/borrow bubbles, paginated trace.
- **Complement Bit Row** – 1’s‑complement flip animation and 2’s‑complement carry cascade.
- Dark‑theme containers (`#090d18`, `#0c101d`) and purple/indigo accent buttons.
- Token‑conservative backend API endpoints (`/api/calculator/...`).
- Adaptive AI‑generated quizzes with EMA mastery tracking and radar‑chart analytics.
- Tool‑Spotlight components that highlight the relevant calculator after each lesson.

The mid‑term deliverable demonstrates that the MVP validation findings have been incorporated, the documentation has been updated, and the system is fully functional, test‑verified, and deployed.

### 1.1.1 Purpose, Scope and Objectives
- **Purpose** – Deliver a production‑ready version of Bitwise Extended that meets the enhanced functional and non‑functional requirements identified during the MVP validation.
- **Scope** – All source code, documentation, and deployment artefacts for the frontend (`bitwise-ui`), backend (`bitwise‑server`), and supporting services (Supabase, AI model). The scope excludes mobile‑native applications and any hardware‑specific integrations.
- **Objectives**
  - Complete UI redesign with premium aesthetics and micro‑animations.
  - Implement AI‑Tutor panel and integrate with the AI assessment service.
  - Provide full test coverage (unit, integration, performance, usability).
  - Deploy a live instance reachable via a public URL.
  - Produce consistent, up‑to‑date artefacts: SRS, SDD, SPMP, STD, RTM, test reports, and a feature‑completion matrix.

### 1.1.2 Assumptions and Constraints
- The project assumes a stable internet connection for AI‑quiz generation.
- All team members have access to a modern browser (Chrome/Firefox/Edge/Safari) on a Windows workstation.
- Supabase free tier limits apply (max 500 MB storage, 100 concurrent connections).
- No additional third‑party services (e.g., CI/CD) beyond GitHub Actions.

### 1.1.3 Project Deliverables
| Deliverable | Description | Format | Delivery Date |
|-------------|-------------|--------|----------------|
| **Live System** | Deployed Bitwise Extended instance | URL | 2026‑10‑17 |
| **Source Code** | GitHub repository with full history | Git repo | 2026‑10‑17 |
| **README** | Setup, build, and deployment instructions | Markdown | 2026‑10‑17 |
| **Feature Completion Matrix** | Mapping of required features to implementation status | Markdown | 2026‑10‑17 |
| **SRS** | Software Requirements Specification | Markdown | 2026‑10‑17 |
| **SDD** | Software Design Description | Markdown | 2026‑10‑17 |
| **SPMP** | This document | Markdown | 2026‑10‑17 |
| **STD** | Software Test Documentation (test plan, cases, results) | Markdown + HTML reports | 2026‑10‑17 |
| **RTM** | Requirements Traceability Matrix | Markdown | 2026‑10‑17 |
| **Defect Log** | Identified issues, status, and retest outcomes | Markdown | 2026‑10‑17 |
| **Usability Report** | SUS scores, participant feedback | PDF | 2026‑10‑17 |

### 1.1.4 Schedule and Budget Summary
- **Schedule** – The project follows a three‑semester timeline (SEM 1: design & MVP, SEM 2: enhancements, SEM 3: validation). The mid‑term milestone (this SPMP) is due **2026‑10‑17**.
- **Budget** – No external budget; expenses are limited to university‑provided AWS credits, Supabase free tier, and incidental software licences (e.g., JetBrains). Estimated total cost ≤ $200.

## 2. Evolution of Plan
The SPMP is stored under version control (`docs/SPMP.md`). Updates are made through pull requests, reviewed by the team lead, and merged to `main`. The file is tagged with a release version after each major milestone.

## 3. References
1. IEEE Std 1058‑1998 – Software Project Management Plans.
2. Cebu Institute of Technology – University SRS Template (2025‑2026).
3. Bitwise Extended repository – https://github.com/Josh20003/BitwiseV2
4. AI assessment API documentation – internal.

## 4. Definitions
- **EMA** – Exponential Moving Average, used for mastery tracking.
- **AI‑Tutor** – Interactive component that forwards user questions to an LLM and returns step‑by‑step explanations.
- **SPMP** – Software Project Management Plan.
- **SRS** – Software Requirements Specification.
- **SDD** – Software Design Description.
- **STD** – Software Test Documentation.
- **RTM** – Requirements Traceability Matrix.
- **SUS** – System Usability Scale.

## 5. Project Organization

### 5.1 External Structure
- **Acquirer:** CIT‑U (Cebu Institute of Technology – University) – provides the educational curriculum and stakeholder feedback.
- **Client:** University students and instructors using the platform.
- **Subcontractors:** None.

### 5.2 Internal Structure
```
IT411 – G1‑G8 Team
│
├─ Project Lead (Arpon) – scope, schedule, and delivery
├─ Front‑end Lead (Lawas) – UI/UX, React, Tailwind
├─ Backend Lead (Arnejo) – NestJS services, Supabase integration
├─ AI Engineer (Menez) – LLM prompts, EMA, quiz generation
├─ QA Engineer (Cotiangco) – Test plan, CI pipeline, performance scripts
└─ Documentation Lead (Berchard) – SRS, SDD, SPMP, STD, RTM
```

### 5.3 Roles and Responsibilities
| Role | Responsibilities |
|------|------------------|
| Project Lead | Overall schedule, risk management, stakeholder communication |
| Front‑end Lead | Implement UI components (AskAI‑Tutor, Converter, Workspace), ensure dark‑theme compliance |
| Backend Lead | Design and expose API endpoints, token‑conservation, Supabase schema |
| AI Engineer | Prompt engineering, token budgeting, integrate with GROQ API |
| QA Engineer | Create/maintain test artefacts, run performance tests, collect SUS data |
| Documentation Lead | Keep SRS, SDD, SPMP, STD, RTM up‑to‑date, manage version control |

## 6. Managerial Process Plans

### 6.1 Start‑up Plan
- **Estimation Plan:** Effort estimated using historical TSP data; ±40 % confidence.
- **Staffing Plan:** 6 team members (full‑time student effort).
- **Resource Acquisition:** Supabase free tier, GitHub repository, Vercel/Render for deployment.
- **Training Plan:** Short workshops on Tailwind, NestJS, and Prompt‑Engineering.

### 6.2 Work Plan
- **Work Activities:** UI redesign, backend API extension, AI‑Tutor integration, testing, documentation.
- **Schedule Allocation:** See `docs/PROJECT_SCHEDULE.xlsx` (Milestone table attached).
- **Resource Allocation:** Development laptops (Windows 10/11), cloud resources as above.
- **Budget Allocation:** Cloud credits, optional JetBrains licence.

### 6.3 Control Plan
- **Requirements Control:** Changes tracked via GitHub Issues linked to the RTM.
- **Schedule Control:** Weekly stand‑ups, burn‑down chart in GitHub Projects.
- **Budget Control:** Monitored via Supabase usage dashboard.
- **Quality Control:** Enforced through CI pipeline (lint, unit tests, coverage ≥ 85 %).
- **Reporting Plan:** Weekly status reports posted to the shared Google Drive folder.
- **Metrics Collection:** Cycle‑time, test pass rate, SUS score.
- **Risk Management:** Identify, assess, and mitigate risks (see Section 5.1.2).
- **Closeout Plan:** Final repository freeze, archive of all artefacts, final presentation.

## 7. Technical Process Plans
- **Process Model:** Iterative Agile (3‑week sprints). Each sprint ends with a demonstrable increment.
- **Methods, Tools, Techniques:** React + Tailwind, NestJS + Prisma, Jest + Cypress, k6 for performance, GitHub Actions for CI/CD.
- **Infrastructure Plan:** Vercel (frontend) & Render (backend) deployments; Supabase for database/auth.
- **Product Acceptance Plan:** Acceptance criteria defined in SRS; final sign‑off by the academic supervisor.

## 8. Supporting Process Plans
- **Configuration Management Plan:** All artefacts versioned in Git; `docs/CHANGELOG.md` records revisions.
- **Verification & Validation Plan:** Test cases in `docs/STD.md`; traceability via RTM.
- **Documentation Plan:** Markdown files stored under `docs/`; generated PDF artefacts archived in Google Drive.
- **Quality Assurance Plan:** Peer reviews for code and documentation; static analysis with ESLint & Prettier.
- **Reviews & Audits:** Bi‑weekly design reviews, sprint demos, and audit of CI logs.
- **Problem Resolution Plan:** Defect log (`docs/DEFECT_LOG.md`) managed in GitHub Issues; priority‑based response.
- **Subcontractor Management Plan:** N/A.
- **Process Improvement Plan:** Retrospectives after each sprint; action items recorded in `docs/RETROSPECTIVE.md`.

## 9. Additional Plans
- **Security Plan:** HTTPS everywhere, JWT auth via Supabase, input validation with NestJS ValidationPipe.
- **Maintenance Plan:** Post‑deployment bug‑fix releases; monthly dependency updates.

## 10. Annexes
- **Annex A – Project Schedule (Gantt chart)** – `docs/PROJECT_SCHEDULE.xlsx`
- **Annex B – Budget Summary** – `docs/BUDGET.xlsx`
- **Annex C – Team Contact List** – `docs/TEAM_CONTACTS.md`
- **Annex D – Glossary** – (see Section 4)

## 11. Index
(Generated automatically by Markdown preview tools.)

---
*Prepared by the Documentation Lead (Berchard Lawrence Lawas) and approved by the team.*
