# Bitwise API Reference Guide

## Base URL
```
http://localhost:3000/api
```

---

## Calculator Module Endpoints

### 1. Number System Conversion

#### Convert Number Between Bases
**Endpoint:** `POST /calculator/convert`

**Request:**
```json
{
  "value": "1010",
  "fromBase": 2,
  "toBase": 10
}
```

**Response (Success):**
```json
{
  "success": true,
  "result": {
    "sourceValue": "1010",
    "sourceBase": 2,
    "targetValue": "10",
    "targetBase": 10,
    "steps": [
      "1010₂ = (1×2³) + (0×2²) + (1×2¹) + (0×2⁰)",
      "= 8 + 0 + 2 + 0",
      "= 10₁₀"
    ],
    "explanation": "Binary to Decimal conversion using positional notation..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid digit '2' for base 2",
  "statusCode": 400
}
```

**Parameters:**
| Field | Type | Range | Required | Description |
|-------|------|-------|----------|-------------|
| value | string | - | Yes | Number value to convert |
| fromBase | number | 2-36 | Yes | Source number base |
| toBase | number | 2-36 | Yes | Target number base |

**Supported Bases:**
- Binary (2): digits 0-1
- Octal (8): digits 0-7
- Decimal (10): digits 0-9
- Hexadecimal (16): digits 0-9, A-F

---

### 2. Number System Information

#### Get All Number Systems
**Endpoint:** `GET /calculator/number-systems`

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "id": 1,
      "name": "Binary",
      "base": 2,
      "digits": "0-1",
      "description": "Base-2 number system...",
      "examples": ["0", "1", "10", "11", "100"]
    },
    {
      "id": 2,
      "name": "Octal",
      "base": 8,
      "digits": "0-7",
      "description": "Base-8 number system...",
      "examples": ["0", "7", "10", "77", "100"]
    },
    {
      "id": 3,
      "name": "Decimal",
      "base": 10,
      "digits": "0-9",
      "description": "Base-10 number system...",
      "examples": ["0", "9", "10", "99", "100"]
    },
    {
      "id": 4,
      "name": "Hexadecimal",
      "base": 16,
      "digits": "0-9, A-F",
      "description": "Base-16 number system...",
      "examples": ["0", "F", "10", "FF", "100"]
    }
  ]
}
```

---

### 3. Conversion Examples

#### Get Conversion Examples
**Endpoint:** `GET /calculator/conversion-examples`

**Query Parameters:**
| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| sourceBase | number | Yes | Filter by source base |
| targetBase | number | Yes | Filter by target base |
| difficulty | string | Yes | Filter by difficulty (easy/medium/hard) |

---

### 4. Multi-Step Conversions

#### Convert Through Multiple Bases
**Endpoint:** `POST /calculator/convert-multi-step`

**Request:**
```json
{
  "value": "1010",
  "fromBase": 2,
  "basePath": [10, 8, 16]
}
```

---

## Binary Codes Module Endpoints

### 1. BCD Encoding/Decoding

#### Encode to BCD (Binary Coded Decimal)
**Endpoint:** `POST /calculator/encode-bcd`

**Request:** `{"value": "42"}`

**Response:** `{"success": true, "result": {"input": "42", "output": "0100 0010", ...}}`

#### Decode from BCD
**Endpoint:** `POST /calculator/decode-bcd`

**Request:** `{"value": "0100 0010"}`

---

### 2. Gray Code Encoding/Decoding

#### Encode to Gray Code
**Endpoint:** `POST /calculator/encode-gray`

**Request:** `{"value": "0101"}`

#### Decode from Gray Code
**Endpoint:** `POST /calculator/decode-gray`

**Request:** `{"value": "0111"}`

---

### 3. Hamming Code Calculation

#### Calculate Hamming Code
**Endpoint:** `POST /calculator/hamming-code`

**Request:** `{"value": "1010"}`

---

### 4. Binary Codes Reference

#### Get Binary Codes Definitions
**Endpoint:** `GET /calculator/binary-codes`

---

## Assessment Module Endpoints

### Generate Adaptive Quiz
**Endpoint:** `POST /assessment/generate-quiz`

### Submit Quiz Response
**Endpoint:** `POST /assessment/submit-attempt`

### Evaluate Quiz Session
**Endpoint:** `POST /assessment/evaluate`

---

## User Progress Endpoints

### Get User Skills
**Endpoint:** `GET /user-progress/skills?userId=1`

### Get Detailed Progress
**Endpoint:** `GET /user-progress/:userId/progress`

---

## Response Format

All endpoints return standardized JSON responses:

**Success (200, 201):**
```json
{
  "success": true,
  "result": { ... }
}
```

**Error (400, 404, 500):**
```json
{
  "success": false,
  "error": "Description of error",
  "statusCode": 400
}
```

---

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Features Guide](./FEATURES.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Root README](../README.md)
