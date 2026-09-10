# Bitwise Project - Deployment & Integration Guide

## Overview

This guide walks you through deploying the Bitwise implementation and integrating backend services and frontend components.

---

## Phase 1: Database Migration

### Step 1.1: Prepare Database & Run Prisma Migration
```bash
cd bitwise-server
npx prisma migrate dev --name add_converter_binary_codes
```

**What this does:**
- Creates/updates tables: `NumberSystem`, `ConversionExample`, `BinaryCode`, `QuizQuestion`, `QuizSession`, `QuizResponse`, `UserProgress`, `LearningPath`
- Maintains existing tables (`Lesson`, `Topic`, `UserSkill`, `Attempt`, etc.)
- Sets up foreign key relationships and performance indexes.

---

## Phase 2: Backend Service Integration

### Step 2.1: Verify Service Files & Module Configuration

Ensure the following services are registered in `bitwise-server/src/calculator/calculator.module.ts`:
- `CalculatorConverterService`
- `BinaryCodesService`
- `CalculatorService`

### Step 2.2: Start Backend Server
```bash
cd bitwise-server
npm run build
npm run start:dev
```
Verify output shows `Application listening on port 3000`.

---

## Phase 3: Frontend Component Integration

### Step 3.1: Component Setup
The core interactive components are:
- `bitwise-ui/src/components/NumberSystemConverter.tsx`
- `bitwise-ui/src/components/BinaryCodesConverter.tsx`

### Step 3.2: Start Frontend Server
```bash
cd bitwise-ui
npm install
npm run dev
```
Verify output shows `ready at http://localhost:5173`.

---

## Phase 4: Integration Verification Checklist

### Pre-Deployment Verification
- [x] **Database:** Run `npx prisma migrate dev` and verify schema update.
- [x] **Backend:** Run `npm run build` and ensure zero TypeScript errors.
- [x] **Frontend:** Run `npm run build` and check for missing component dependencies or broken routing.
- [x] **API Sanity Checks:**
  - `POST /calculator/convert` (Binary ↔ Decimal ↔ Hex)
  - `POST /calculator/encode-bcd` (BCD Encoding)
  - `POST /calculator/encode-gray` (Gray Code Conversion)
  - `POST /assessment/generate-quiz` (Adaptive Quiz Generation)

---

## Common Issues & Troubleshooting

### Issue: "Cannot find module 'prisma'"
```bash
cd bitwise-server
npm install
npx prisma generate
```

### Issue: "Port 3000 already in use"
```bash
# Find and terminate process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference Guide](./API_REFERENCE.md)
- [Features Guide](./FEATURES.md)
- [Root README](../README.md)
