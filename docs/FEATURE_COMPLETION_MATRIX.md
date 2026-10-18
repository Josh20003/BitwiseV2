# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
### COLLEGE OF COMPUTER STUDIES

---

# Feature Completion Matrix
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

## 1. Feature Completion Matrix

Bitwise capstone, Deliverable 1: Working Software and Deployment. Status as of 18 October 2026.

**Implemented** means built and switched on. **Partial** means built with a gap noted in the last column. **N/A** means the feature does not belong on that surface.

### 1.1. Feature Matrix

| Feature | Website | Mobile (Android) | Backend | Desktop | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sign-up and login (email and password; student or educator)** | Implemented | Implemented | Implemented | Implemented | Supabase JWT session persistence. Student registration is self-service; educator and admin roles are provisioned directly in the database. |
| **Google sign-in (OAuth 2.0)** | Implemented | Partial | Implemented | Implemented | Supabase OAuth integration. On mobile devices, redirect popups are blocked inside Facebook and Messenger in-app webviews. |
| **Password reset by email recovery link** | Implemented | Implemented | Implemented | Implemented | Triggers Supabase recovery email with a secure time-limited token leading to the password reset form. |
| **Email verification** | Partial | Partial | Implemented | Partial | Supabase email verification active. Unverified users can use anonymous calculators; a banner prompts verification to save progress. |
| **Guest / anonymous practice mode** | Implemented | Implemented | Implemented | Implemented | Full access to all 11 lessons, calculators, converters, and circuit tools without login; learning progress is not saved to cloud. |
| **Learner profile & mastery dashboard** | Implemented | Implemented | Implemented | Implemented | Displays EMA mastery scores across 5 competency tiers (Novice to Expert), completed lesson badges, and streak telemetry. |
| **Educational scaffolding (11 structured lessons)** | Implemented | Implemented | Implemented | Implemented | Full curriculum covering base systems, arithmetic, complements, binary codes, logic gates, truth tables, and K-maps. |
| **Interactive bit-toggle & base builders** | Implemented | Implemented | Implemented | Implemented | Interactive 8-bit toggle builders, place-value weights, Nibble/Byte/Word grouping explorers, and real-time decimal recalculation. |
| **High-yield conversion challenges (Lesson 3)** | Implemented | Implemented | Implemented | Implemented | Practice challenges for Decimal $\leftrightarrow$ Binary and Hex $\leftrightarrow$ Octal with real-time input checking, hints, and streak tracking. |
| **Binary vertical arithmetic trainers (Lesson 4)** | Implemented | Implemented | Implemented | Implemented | Interactive step navigation showing carries, borrows, and partial products for addition, subtraction, multiplication, and division. |
| **1's and 2's complement negation workbench** | Implemented | Implemented | Implemented | Implemented | Visualizes bitwise inversion, end-around carry addition, and two's complement sign extension for positive and negative numbers. |
| **Signed representation & ALU hardware flags** | Implemented | Implemented | Implemented | Implemented | Real-time calculation and display of Zero ($Z$), Carry ($C$), Overflow ($V$), and Sign ($S$) flags across 4-bit, 8-bit, and 16-bit words. |
| **Binary codes translator (BCD, Gray, ASCII)** | Implemented | Implemented | Implemented | Implemented | Bidirectional encoding and decoding for 4-bit BCD, reflected Gray code single-bit transitions, and 7-bit ASCII tables. |
| **Hamming(7,4) error detection & correction** | Implemented | Implemented | Implemented | Implemented | Interactive parity generator ($p_1, p_2, p_4$) with syndrome calculation; allows users to flip single bits and observe auto-correction. |
| **Boolean algebra simplification & law matcher** | Implemented | Implemented | Implemented | Implemented | Step-by-step expression parser and simplifier applying De Morgan's, Idempotent, Absorption, and Distributive laws with proofs. |
| **Dynamic truth table generator** | Implemented | Implemented | Implemented | Implemented | Evaluates arbitrary boolean expressions up to 5 variables ($A, B, C, D, E$); dynamically renders $2^N$ row tables with sub-terms. |
| **Karnaugh Map (K-Map) solver & loop visualizer** | Implemented | Partial | Implemented | Implemented | 2, 3, and 4-variable K-maps with Gray code indexing and minterm toggling (0/1/X). Mobile screens require horizontal panning on 4-variable grids. |
| **Digital circuit simulator canvas** | Implemented | Partial | N/A | Implemented | Drag-and-drop gates (AND, OR, NOT, NAND, NOR, XOR, XNOR), switches, and LEDs with live wire routing. Touch dragging is difficult on small screens. |
| **Universal base converter (bases 2–36)** | Implemented | Implemented | Implemented | Implemented | Converts between arbitrary bases 2 through 36 with algorithmic division table cards and positional polynomial expansion traces. |
| **Multi-step base path conversions** | Implemented | Implemented | Implemented | Implemented | Routes arbitrary base conversions through an explicit intermediate decimal bridge (Base $A \to 10 \to$ Base $B$) for pedagogical clarity. |
| **Adaptive AI quiz generation (Groq & Gemini)** | Implemented | Implemented | Implemented | Implemented | Dynamically generates 10-item adaptive quizzes partitioned into Easy/Medium/Hard based on user EMA; pre-compiled fallback on quota exhaustion. |
| **Bayesian Knowledge Tracing (BKT) engine** | Implemented | Implemented | Implemented | Implemented | Probabilistic mastery model updating slip, guess, transition, and mastery probabilities after each attempt. Cold-start begins at $P(L_0) = 0.2$. |
| **Exponential Moving Average (EMA) scoring** | Implemented | Implemented | Implemented | Implemented | Computes running EMA score ($\alpha = 0.3$) per topic, updating student competency tiers (Novice, Beginner, Intermediate, Advanced, Expert). |
| **Socratic AI tutor ("BitBot" Ask AI panel)** | Implemented | Implemented | Implemented | Implemented | Context-aware conversational tutor providing guided hints and misconception diagnostics without spoiling answers; multi-key rotation enabled. |
| **Dynamic learning path recommendations** | Implemented | Implemented | Implemented | Implemented | Recommends prerequisite lesson reviews or advanced challenge sets based on the student's lowest EMA mastery scores via `/adaptive/recommend`. |
| **Global interactive onboarding tour** | Implemented | Implemented | N/A | Implemented | Guided step-by-step spotlight tour introducing newcomers to curriculum navigation, toolbars, and AI tutor features; responsive touch tooltips. |
| **Educator & cohort analytics telemetry** | Partial | N/A | Implemented | Partial | Backend endpoints provide cohort mastery distribution and API token usage; web frontend currently exposes learner-level progress views. |
| **Offline desktop application** | N/A | N/A | N/A | Not implemented | Platform is served via desktop web browsers and local Vite/Node development server. Standalone offline Electron packaging is planned for future release. |
| **Native mobile application (Google Play APK)** | N/A | Not implemented | N/A | N/A | Platform is delivered as a touch-optimized responsive web app (PWA); standalone native Android APK is not published to Google Play Store. |
| **Account deletion (self-service data purge)** | Not implemented | Not implemented | Partial | Not implemented | Account deletion currently requires manual administrator database purge in Supabase; self-service delete button is not yet exposed in user UI. |

---

### 1.2. Known Limitations

* **Platforms:** Bitwise is built as a web-first cloud platform. Mobile access is supported through responsive browser layouts (tested on Android Chrome and iOS Safari) and progressive web app (PWA) installation; there is no native Google Play APK or Apple App Store listing. Standalone desktop packaging (Electron) is not yet released; desktop access is via web browser or local Node/Vite development server.
* **Circuit Simulator on Touchscreens:** The digital circuit simulator canvas is fully interactive on desktop and tablet viewports, but gate dragging, precise wire routing between small pin terminals, and multi-select deletion are constrained on compact mobile phone screens (< 600px width).
* **Karnaugh Map Variable Limits:** The K-Map minimization engine supports 2-variable (4 cells), 3-variable (8 cells), and 4-variable (16 cells) grids. 5-variable (32 cells) and 6-variable (64 cells) 3D hyper-cube maps are not implemented in the current release.
* **AI Engine & API Quota Fallbacks:** Dynamic quiz generation and BitBot Socratic tutoring rely on Google Gemini API (`gemini-1.5-flash`) and Groq Cloud. When external API rate limits are exceeded or network connectivity drops, the service gracefully falls back to pre-compiled static question banks and rule-based pedagogical hints.
* **Bayesian Knowledge Tracing (BKT) Cold-Start:** The BKT probabilistic engine initializes student mastery at a prior of $P(L_0) = 0.2$. For learners with zero historical quiz attempts, the initial question difficulty spread requires 3 to 5 submitted items before accurately reflecting individual ability.
* **Base Converter Numeric Precision:** The universal base converter supports arbitrary bases 2 through 36 for integer values up to 64-bit precision. Floating-point conversions (radix point) are supported for standard fractions; recurring fractional base expansions are rounded and truncated to 8 fractional places.
* **Hamming(7,4) Error Boundary:** The error-correcting codes module implements standard Hamming(7,4) single-error correction (SEC). Double-bit errors are detected as parity syndrome anomalies but cannot be automatically corrected without Hamming(8,4) SEC-DED extensions.
* **Production Deployment Checks:** The release on 18 October 2026 was validated end-to-end on AWS EC2 (`https://bitwise.live`) and Supabase PostgreSQL. Multi-key AI rotation and session restoration were verified on production, while heavy concurrent quiz stress tests were executed on local staging.
* **Guest vs. Authenticated Persistence:** Guests can freely execute all interactive lessons, calculators, converters, and circuit tools without credentials. However, persistent progress saving, streak telemetry, and EMA mastery records require an authenticated Supabase account.
* **Accounts and Admin Provisioning:** User registration and password recovery are self-service via Supabase Auth. Google OAuth sign-in requires popup permissions and may fail inside embedded social webviews (e.g., Messenger or Instagram in-app browsers). The educator/admin role cannot be self-assigned in the client and must be provisioned directly in the database.
* **Not Built from the Original Vision:** Standalone native mobile APK/iOS apps, real-time multi-user collaborative circuit breadboards, automated hardware HDL/Verilog synthesis export, and automated educator LMS (Canvas/Moodle) gradebook synchronization.
