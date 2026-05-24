# Bitwise Project - Deployment & Integration Guide

## Overview

This guide walks you through deploying the completed Bitwise implementation and integrating the newly created services and components into your project.

---

## Phase 1: Database Migration

### Step 1.1: Prepare Database
```bash
cd c:\Users\BERCHARD\Desktop\BITWISE\BitwiseV2\bitwise-server
```

### Step 1.2: Run Prisma Migration
```bash
npx prisma migrate dev --name add_converter_binary_codes
```

**What this does:**
- Creates new tables: NumberSystem, ConversionExample, BinaryCode, QuizQuestion, QuizSession, QuizResponse, UserProgress, LearningPath
- Maintains existing tables (Lesson, Topic, UserSkill, Attempt, etc.)
- Creates all foreign key relationships
- Adds performance indexes

**Expected output:**
```
✓ Generated migration files in ./prisma/migrations
✓ Created database tables
✓ Applied seed script (if configured)
```

### Step 1.3: Verify Migration
```bash
npx prisma db push
npx prisma db seed
```

---

## Phase 2: Backend Service Integration

### Step 2.1: Verify Service Files

Check that these files exist:
- ✅ `bitwise-server/src/calculator/calculator-converter.service.ts`
- ✅ `bitwise-server/src/calculator/binary-codes.service.ts`
- ✅ `bitwise-server/src/calculator/calculator.controller.ts` (updated)
- ✅ `bitwise-server/src/calculator/calculator.module.ts` (updated)

### Step 2.2: Verify Dependencies

All services should be properly imported. Check `calculator.module.ts`:

```typescript
import { CalculatorService } from './calculator.service';
import { CalculatorConverterService } from './calculator-converter.service';
import { BinaryCodesService } from './binary-codes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CalculatorController],
  providers: [CalculatorService, CalculatorConverterService, BinaryCodesService],
  exports: [CalculatorService, CalculatorConverterService, BinaryCodesService],
})
export class CalculatorModule {}
```

### Step 2.3: Build Backend
```bash
npm run build
```

### Step 2.4: Start Backend Development Server
```bash
npm run start:dev
```

**Check for these success messages:**
```
[NestFactory] Starting Nest application...
[InstanceLoader] PrismaModule dependencies initialized
[InstanceLoader] CalculatorModule dependencies initialized
[RoutesResolver] CalculatorController mapped successfully
Application listening on port 3000
```

---

## Phase 3: Frontend Component Integration

### Step 3.1: Verify Component Files

Check that these files exist:
- ✅ `bitwise-ui/src/components/NumberSystemConverter.tsx`
- ✅ `bitwise-ui/src/components/BinaryCodesConverter.tsx`

### Step 3.2: Create Component Barrel Export

If it doesn't exist, create or update `bitwise-ui/src/components/index.ts`:

```typescript
// Export all components
export { NumberSystemConverter } from './NumberSystemConverter';
export { BinaryCodesConverter } from './BinaryCodesConverter';
// ... other existing exports
```

### Step 3.3: Add Routes to Router Configuration

Update your route configuration to include new routes. In `bitwise-ui/src/routes/`, add:

```typescript
// routes/converter.route.tsx
import { NumberSystemConverter } from '../components/NumberSystemConverter';

export const converterRoute = {
  path: 'converter',
  component: NumberSystemConverter,
  meta: { title: 'Number System Converter' }
};

// routes/binary-codes.route.tsx
import { BinaryCodesConverter } from '../components/BinaryCodesConverter';

export const binaryCodesRoute = {
  path: 'binary-codes',
  component: BinaryCodesConverter,
  meta: { title: 'Binary Codes Translator' }
};
```

### Step 3.4: Build Frontend
```bash
cd ../bitwise-ui
npm install
npm run build
```

### Step 3.5: Start Frontend Development Server
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

---

## Phase 4: API Testing

### Test 4.1: Test Number System Converter Endpoint

```bash
# Windows PowerShell
$body = @{
    value = "1010"
    fromBase = 2
    toBase = 10
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/convert" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected response:**
```json
{
  "success": true,
  "result": {
    "sourceValue": "1010",
    "targetValue": "10",
    "steps": [
      "1010₂ = (1×2³) + (0×2²) + (1×2¹) + (0×2⁰)",
      "= 8 + 0 + 2 + 0",
      "= 10₁₀"
    ],
    "explanation": "..."
  }
}
```

### Test 4.2: Test BCD Encoding Endpoint

```bash
$body = @{
    value = "42"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/encode-bcd" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected response:**
```json
{
  "success": true,
  "result": {
    "input": "42",
    "output": "0100 0010",
    "steps": [
      "4 → 0100 (binary)",
      "2 → 0010 (binary)",
      "Combined: 0100 0010"
    ],
    "explanation": "..."
  }
}
```

### Test 4.3: Test Gray Code Encoding

```bash
$body = @{
    value = "0101"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/encode-gray" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Test 4.4: Test Get Number Systems

```bash
Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/number-systems" `
  -Method GET
```

### Test 4.5: Test Get Binary Codes

```bash
Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/binary-codes" `
  -Method GET
```

---

## Phase 5: Frontend Testing

### Test 5.1: Access Number System Converter Component

1. Navigate to: `http://localhost:5173/converter`
2. Test inputs:
   - Value: `1010`
   - From Base: `2`
   - To Base: `10`
3. Verify:
   - Conversion result displays
   - Step-by-step explanation shows
   - No console errors

### Test 5.2: Access Binary Codes Converter Component

1. Navigate to: `http://localhost:5173/binary-codes`
2. Test BCD tab:
   - Enter decimal: `42`
   - Verify: `0100 0010` output
   - Check steps display
3. Test Gray Code tab:
   - Enter binary: `0101`
   - Verify output and steps

### Test 5.3: Verify API Integration

Open browser DevTools (F12) → Network tab:
1. Convert number - should show:
   - `POST /api/calculator/convert` → Status 200
   - Response body contains conversion result
2. Encode BCD - should show:
   - `POST /api/calculator/encode-bcd` → Status 200
   - Response contains encoded result

---

## Phase 6: Full Integration Testing

### Integration Test 6.1: Complete Number Conversion Flow

```bash
# 1. Convert Binary to Decimal
$body1 = @{value="1111"; fromBase=2; toBase=10} | ConvertTo-Json
$result1 = Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/convert" `
  -Method POST -Headers @{"Content-Type"="application/json"} -Body $body1
# Expected: 15

# 2. Convert Decimal to Hexadecimal
$body2 = @{value="15"; fromBase=10; toBase=16} | ConvertTo-Json
$result2 = Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/convert" `
  -Method POST -Headers @{"Content-Type"="application/json"} -Body $body2
# Expected: F
```

### Integration Test 6.2: Complete Binary Code Flow

```bash
# 1. Encode number in BCD
$body1 = @{value="255"} | ConvertTo-Json
$result1 = Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/encode-bcd" `
  -Method POST -Headers @{"Content-Type"="application/json"} -Body $body1

# 2. Decode result
$encoded = $result1.result.output
$body2 = @{value=$encoded} | ConvertTo-Json
$result2 = Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/decode-bcd" `
  -Method POST -Headers @{"Content-Type"="application/json"} -Body $body2
# Expected: Original value (255)
```

---

## Phase 7: Performance Verification

### Verify 7.1: Check Database Indexes

```bash
npx prisma db introspect
```

Should list indexes created for:
- ConversionExample (sourceBase, targetBase, difficulty)
- BinaryCode (complexity, category)
- UserProgress (userId, masteryLevel)

### Verify 7.2: Monitor API Response Times

Test converter endpoint with timing:
```bash
Measure-Command {
    Invoke-WebRequest -Uri "http://localhost:3000/api/calculator/convert" `
      -Method POST `
      -Headers @{"Content-Type"="application/json"} `
      -Body (@{value="11111111"; fromBase=2; toBase=16} | ConvertTo-Json)
}
```

**Expected:** < 100ms response time

### Verify 7.3: Check Server Memory Usage

In terminal running `npm run start:dev`:
- Should stabilize around 50-100MB
- No memory leaks with repeated API calls

---

## Common Issues & Solutions

### Issue: "Cannot find module 'prisma'"

**Solution:**
```bash
cd bitwise-server
npm install
npx prisma generate
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run start:dev -- --port 3001
```

### Issue: "CORS error from frontend"

**Solution:** Verify CORS is enabled in `main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
});
```

### Issue: "API endpoint returns 404"

**Solution:**
```bash
# Verify routes are properly registered
curl http://localhost:3000/api/calculator/number-systems

# Check controller decorators
# Should have @Controller('calculator') at class level
```

### Issue: "Components not rendering"

**Solution:**
```bash
# Clear Vite cache
rm -r bitwise-ui/node_modules/.vite

# Rebuild
npm run build

# Restart dev server
npm run dev
```

---

## Deployment Checklist

Before deploying to production:

### Backend
- [ ] Environment variables configured (.env)
- [ ] Database migrations applied
- [ ] Build successful: `npm run build`
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Input validation working
- [ ] Rate limiting configured

### Frontend
- [ ] Build successful: `npm run build`
- [ ] Components render correctly
- [ ] API integration tested
- [ ] Error messages user-friendly
- [ ] Responsive design verified
- [ ] Performance optimized

### Database
- [ ] All migrations applied
- [ ] Seed data loaded
- [ ] Indexes created
- [ ] Backup configured
- [ ] Connection pooling enabled

---

## Monitoring Commands

### Monitor Database Connections
```bash
npx prisma studio
```

### View API Logs
```bash
# In the npm run start:dev terminal, check output
# Should show each request and response status
```

### Test Database Query
```bash
npx prisma db execute
# Query: SELECT COUNT(*) FROM "NumberSystem";
# Should return at least 4 rows
```

---

## Next Steps

1. ✅ Complete Phase 1: Database Migration
2. ✅ Complete Phase 2: Backend Integration
3. ✅ Complete Phase 3: Frontend Integration
4. ✅ Complete Phase 4: API Testing
5. ✅ Complete Phase 5: Frontend Testing
6. ✅ Complete Phase 6: Full Integration Testing
7. Deploy to AWS (see `bitwise-deploy/` directory)

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation in `PROJECT_DOCUMENTATION.md`
3. Check backend logs: `npm run start:dev`
4. Check frontend console: Browser DevTools (F12)

---

*This guide covers implementation version 2.0 with all 4 modules completed.*
