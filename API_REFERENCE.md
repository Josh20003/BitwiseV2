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

**Example Request:**
```
GET /calculator/conversion-examples?sourceBase=2&targetBase=10&difficulty=easy
```

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "id": 1,
      "sourceBase": 2,
      "targetBase": 10,
      "sourceValue": "1010",
      "targetValue": "10",
      "difficulty": "easy",
      "category": "introduction",
      "steps": ["...", "..."],
      "explanation": "...",
      "tags": ["binary", "basic"],
      "isActive": true
    }
  ]
}
```

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

**Response:**
```json
{
  "success": true,
  "result": {
    "sourceValue": "1010",
    "sourceBase": 2,
    "conversions": [
      {
        "step": 1,
        "fromBase": 2,
        "toBase": 10,
        "value": "10",
        "steps": ["..."],
        "explanation": "..."
      },
      {
        "step": 2,
        "fromBase": 10,
        "toBase": 8,
        "value": "12",
        "steps": ["..."],
        "explanation": "..."
      },
      {
        "step": 3,
        "fromBase": 8,
        "toBase": 16,
        "value": "A",
        "steps": ["..."],
        "explanation": "..."
      }
    ],
    "finalValue": "A"
  }
}
```

---

## Binary Codes Module Endpoints

### 1. BCD Encoding/Decoding

#### Encode to BCD (Binary Coded Decimal)
**Endpoint:** `POST /calculator/encode-bcd`

**Request:**
```json
{
  "value": "42"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "input": "42",
    "output": "0100 0010",
    "steps": [
      "Digit 4 → 0100",
      "Digit 2 → 0010",
      "Concatenate: 0100 0010"
    ],
    "explanation": "BCD encodes each decimal digit separately as 4-bit binary...",
    "properties": {
      "digitCount": 2,
      "bitCount": 8,
      "isValid": true
    }
  }
}
```

**Request Parameters:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| value | string | 0-9999 | Decimal number to encode |

---

#### Decode from BCD
**Endpoint:** `POST /calculator/decode-bcd`

**Request:**
```json
{
  "value": "0100 0010"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "input": "0100 0010",
    "output": "42",
    "steps": [
      "0100 → Digit 4",
      "0010 → Digit 2",
      "Result: 42"
    ],
    "explanation": "Each 4-bit group decoded to its decimal digit...",
    "properties": {
      "groupCount": 2,
      "isValid": true
    }
  }
}
```

---

### 2. Gray Code Encoding/Decoding

#### Encode to Gray Code
**Endpoint:** `POST /calculator/encode-gray`

**Request:**
```json
{
  "value": "0101"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "input": "0101",
    "inputDecimal": 5,
    "output": "0111",
    "outputDecimal": 7,
    "steps": [
      "Binary: 0101",
      "MSB stays: 0",
      "0⊕1=1: 1",
      "1⊕0=1: 1",
      "0⊕1=1: 1",
      "Gray Code: 0111"
    ],
    "explanation": "Gray code conversion using XOR operation...",
    "properties": {
      "bitLength": 4,
      "singleBitChanges": true
    }
  }
}
```

---

#### Decode from Gray Code
**Endpoint:** `POST /calculator/decode-gray`

**Request:**
```json
{
  "value": "0111"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "input": "0111",
    "inputDecimal": 7,
    "output": "0101",
    "outputDecimal": 5,
    "steps": [
      "Gray Code: 0111",
      "MSB stays: 0",
      "0⊕1=1: 1",
      "1⊕1=0: 0",
      "0⊕1=1: 1",
      "Binary: 0101"
    ],
    "explanation": "Gray to binary conversion reversing XOR operation...",
    "properties": {
      "bitLength": 4
    }
  }
}
```

---

### 3. Hamming Code Calculation

#### Calculate Hamming Code
**Endpoint:** `POST /calculator/hamming-code`

**Request:**
```json
{
  "value": "1010"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "input": "1010",
    "output": "0011010",
    "steps": [
      "Position all bits: _ 1 _ 0 1 _ 0",
      "Calculate parity bits:",
      "P1 (positions 1,3,5,7): 1",
      "P2 (positions 2,3,6,7): 0",
      "P4 (positions 4,5,6,7): 0",
      "Final code: 0011010"
    ],
    "explanation": "Hamming(7,4) code adds 3 parity bits for error correction...",
    "properties": {
      "dataLength": 4,
      "parityLength": 3,
      "totalLength": 7,
      "errorDetection": "single-bit",
      "errorCorrection": "single-bit"
    }
  }
}
```

---

### 4. Binary Codes Reference

#### Get Binary Codes Definitions
**Endpoint:** `GET /calculator/binary-codes`

**Query Parameters:**
| Parameter | Type | Optional | Values |
|-----------|------|----------|--------|
| complexity | string | Yes | simple/moderate/advanced |
| category | string | Yes | encoding/compression/error-detection |

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "id": 1,
      "name": "BCD",
      "fullName": "Binary Coded Decimal",
      "description": "Each decimal digit encoded as 4-bit binary...",
      "complexity": "simple",
      "category": "encoding",
      "encodingRules": {
        "digitMapping": {"0":"0000", "1":"0001", "..":"...."}
      },
      "decodingRules": {
        "groupSize": 4,
        "algorithm": "Decode each 4-bit group separately"
      },
      "examples": [
        {"input": "5", "output": "0101"},
        {"input": "42", "output": "0100 0010"}
      ],
      "applications": ["Digital clocks", "Calculators", "ATMs"],
      "tags": ["basic", "educational"],
      "isActive": true
    },
    {
      "id": 2,
      "name": "Gray Code",
      "fullName": "Reflected Binary Code",
      "description": "Only one bit changes between consecutive numbers...",
      "complexity": "moderate",
      "category": "encoding",
      "applications": ["Rotary encoders", "Error detection"],
      "examples": [
        {"binary": "0000", "gray": "0000"},
        {"binary": "0001", "gray": "0001"},
        {"binary": "0010", "gray": "0011"}
      ]
    },
    {
      "id": 3,
      "name": "Hamming Code",
      "fullName": "Hamming(7,4) Error Correction Code",
      "description": "Detects and corrects single-bit errors...",
      "complexity": "advanced",
      "category": "error-correction",
      "applications": ["Memory systems", "Data transmission"]
    }
  ]
}
```

---

## Assessment Module Endpoints

### Generate Adaptive Quiz
**Endpoint:** `POST /assessment/generate-quiz`

**Request:**
```json
{
  "topicId": 1,
  "difficulty": "intermediate",
  "questionCount": 5
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "sessionId": "uuid",
    "topicId": 1,
    "totalQuestions": 5,
    "difficulty": "intermediate",
    "questions": [
      {
        "id": 1,
        "content": "Convert 1010₂ to decimal",
        "type": "multiple-choice",
        "options": ["8", "10", "12", "14"],
        "bloomLevel": "apply",
        "estimatedTime": 30,
        "tags": ["binary", "conversion"]
      }
    ],
    "createdAt": "2024-05-24T10:00:00Z"
  }
}
```

---

### Submit Quiz Response
**Endpoint:** `POST /assessment/submit-attempt`

**Request:**
```json
{
  "sessionId": "uuid",
  "questionId": 1,
  "answer": "10",
  "timeSpent": 45
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "responseId": "uuid",
    "isCorrect": true,
    "feedback": "Correct! 1010₂ = 10₁₀",
    "explanation": "Using positional notation: (1×8)+(0×4)+(1×2)+(0×1) = 10"
  }
}
```

---

### Evaluate Quiz Session
**Endpoint:** `POST /assessment/evaluate`

**Request:**
```json
{
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "sessionId": "uuid",
    "totalQuestions": 5,
    "correctAnswers": 4,
    "score": 80,
    "percentile": 75,
    "mastery": 0.78,
    "nextDifficulty": "advanced",
    "recommendations": [
      "Review multi-base conversions",
      "Practice hexadecimal conversions"
    ],
    "estimatedTimeToMastery": "2 hours"
  }
}
```

---

## User Progress Endpoints

### Get User Skills
**Endpoint:** `GET /user-progress/skills?userId=1`

**Response:**
```json
{
  "success": true,
  "result": [
    {
      "id": 1,
      "userId": 1,
      "topicId": 1,
      "topicName": "Binary Conversion",
      "masteryLevel": 0.78,
      "emaScore": 0.75,
      "totalAttempts": 12,
      "correctCount": 9,
      "currentLevel": "advanced",
      "lastAttempt": "2024-05-24T10:00:00Z"
    }
  ]
}
```

---

### Get Detailed Progress
**Endpoint:** `GET /user-progress/:userId/progress`

**Response:**
```json
{
  "success": true,
  "result": {
    "userId": 1,
    "totalProgress": 65,
    "skillsProgress": [
      {
        "topicId": 1,
        "topicName": "Binary Conversion",
        "mastery": 0.78,
        "status": "advanced"
      },
      {
        "topicId": 2,
        "topicName": "BCD Encoding",
        "mastery": 0.45,
        "status": "intermediate"
      }
    ]
  }
}
```

---

## Error Codes

| Code | Message | Description | Solution |
|------|---------|-------------|----------|
| 400 | Invalid input | Missing or invalid parameter | Check request parameters |
| 400 | Invalid base | Base not in range 2-36 | Use valid base value |
| 400 | Invalid digit for base | Digit exceeds base range | Use valid digits |
| 404 | Resource not found | ID doesn't exist | Check resource ID |
| 500 | Internal server error | Server error | Check server logs |

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:** 
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1234567890`

---

## Response Format

All endpoints return standardized responses:

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
  "statusCode": 400,
  "timestamp": "2024-05-24T10:00:00Z"
}
```

---

## Example Usage Scenarios

### Scenario 1: Teaching Binary Conversion

```bash
# 1. Get number systems info
GET /calculator/number-systems

# 2. Get simple examples
GET /calculator/conversion-examples?sourceBase=2&targetBase=10&difficulty=easy

# 3. User tries a conversion
POST /calculator/convert
{
  "value": "1010",
  "fromBase": 2,
  "toBase": 10
}

# 4. System provides detailed steps and explanation
```

### Scenario 2: Teaching BCD Encoding

```bash
# 1. Get BCD definition
GET /calculator/binary-codes?complexity=simple

# 2. Encode a number
POST /calculator/encode-bcd
{
  "value": "42"
}

# 3. Get detailed steps showing 4 → 0100, 2 → 0010
```

### Scenario 3: Adaptive Quiz

```bash
# 1. Generate quiz based on current skill level
POST /assessment/generate-quiz
{
  "topicId": 1,
  "difficulty": "intermediate"
}

# 2. User submits answers one by one
POST /assessment/submit-attempt
{
  "sessionId": "uuid",
  "questionId": 1,
  "answer": "value"
}

# 3. Evaluate overall performance
POST /assessment/evaluate
{
  "sessionId": "uuid"
}

# 4. Get updated progress
GET /user-progress/skills?userId=1
```

---

*API Reference Version 2.0 - May 2024*
