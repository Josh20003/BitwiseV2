# Adaptive AI System Setup & Documentation

## Overview

The Bitwise Adaptive AI System uses **Groq API** to dynamically generate assessment questions and provide intelligent feedback based on student performance. It implements **Bayesian Knowledge Tracing (BKT)** to track skill mastery and adapts difficulty levels accordingly.

## 🔧 Setup Instructions

### 1. Get Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Go to API keys section
4. Create a new API key
5. Copy the key

### 2. Configure Environment Variable

Add your Groq API key to `.env`:

```bash
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 3. Verify Configuration

The system is configured to use:
- **Model**: llama-3.3-70b-versatile
- **Temperature**: 0.3 (deterministic, good for assessments)
- **Top P**: 0.9 (focused outputs)
- **Max Retries**: 2

These are set in `src/config/ai.config.ts`.

## 📡 API Endpoints

### Adaptive Learning Endpoints

#### 1. Initialize User Skills
```
POST /api/adaptive/initialize/:userId
```
Initializes all user skills for all topics in the system.

**Response:**
```json
{
  "success": true,
  "data": [...skills array],
  "message": "User skills initialized successfully"
}
```

#### 2. Get User Skills
```
GET /api/adaptive/skills/:userId
```
Retrieves current skill levels across all topics.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": "user123",
      "topicId": 1,
      "level": 0.75,
      "mastery": 0.8,
      "attempts": 10,
      "correct": 8,
      "topic": { ... }
    }
  ]
}
```

#### 3. Get Adaptive Recommendations
```
GET /api/adaptive/recommendations/:userId
```
Gets recommended difficulty level and focus areas based on current mastery.

**Response:**
```json
{
  "success": true,
  "data": {
    "overallMastery": 0.72,
    "recommendedDifficulty": "medium",
    "focusTopics": [
      {
        "topicId": 5,
        "topicTitle": "Karnaugh Maps",
        "lessonId": 2,
        "mastery": 0.45,
        "level": 0.4
      }
    ],
    "reinforcementNeeded": [...]
  }
}
```

#### 4. Update User Skills
```
POST /api/adaptive/update-skills/:userId
Content-Type: application/json

{
  "performanceData": [
    {
      "topicId": 1,
      "correct": 8,
      "total": 10,
      "difficulty": "medium"
    },
    {
      "topicId": 2,
      "correct": 6,
      "total": 10,
      "difficulty": "medium"
    }
  ]
}
```

Uses BKT algorithm to update mastery and knowledge levels based on assessment performance.

**Response:**
```json
{
  "success": true,
  "data": [...updated skills array]
}
```

#### 5. Generate Adaptive Feedback
```
POST /api/adaptive/generate-feedback/:userId
Content-Type: application/json

{
  "performanceData": [
    {
      "topicId": 1,
      "correct": 8,
      "total": 10,
      "difficulty": "medium"
    }
  ]
}
```

Generates AI-powered adaptive feedback based on user performance and current mastery levels.

**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": "Good progress! Continue practicing to strengthen your understanding. Focus on: Topic Name. Some areas need reinforcement through additional practice."
  }
}
```

#### 6. Get Analytics Dashboard
```
GET /api/adaptive/analytics/:userId
```
Comprehensive learning analytics organized by lesson and topic.

**Response:**
```json
{
  "success": true,
  "data": {
    "overallMastery": 0.72,
    "recommendedDifficulty": "medium",
    "skillsByLesson": [
      {
        "lessonId": 1,
        "lessonTitle": "Introduction to Boolean Algebra",
        "skills": [...]
      }
    ],
    "focusAreas": [...],
    "reinforcementNeeded": [...],
    "totalAttempts": 45,
    "totalCorrect": 38
  }
}
```

#### 7. Get Progress Data
```
GET /api/adaptive/progress/:userId
```
Progress visualization data grouped by lesson.

**Response:**
```json
{
  "success": true,
  "data": {
    "individual": [
      {
        "topicTitle": "AND Gates",
        "lessonTitle": "Logic Gates",
        "mastery": 85,
        "level": 80,
        "attempts": 15,
        "accuracy": 87
      }
    ],
    "byLesson": { ... },
    "summary": {
      "avgMastery": 72,
      "avgLevel": 68,
      "totalAttempts": 120,
      "avgAccuracy": 78
    }
  }
}
```

#### 8. Get Enhanced Recommendations
```
GET /api/adaptive/recommendations-enhanced/:userId
```
Advanced recommendations including lesson-level mastery and assessment history.

#### 9. Update Lesson Mastery
```
POST /api/adaptive/update-lesson-mastery/:userId
Content-Type: application/json

{
  "lessonId": 1,
  "assessmentScore": 0.85
}
```

Updates overall mastery score for a lesson based on assessment performance.

**Response:**
```json
{
  "success": true,
  "data": {
    "newMastery": 0.82
  }
}
```

## 🤖 AI-Powered Assessment Generation

The system integrates with Groq to generate adaptive assessments:

### Adaptive Practice Assessment
```
POST /api/assessment/start-adaptive-practice
Content-Type: application/json

{
  "uid": "user123"
}
```

Generates 30 AI-created multiple-choice questions tailored to user's weak areas.

### Lesson Practice Assessment
```
POST /api/assessment/start-lesson-practice
Content-Type: application/json

{
  "uid": "user123",
  "lessonId": 1
}
```

Generates 10 focused questions for a specific lesson.

## 🧠 Bayesian Knowledge Tracing (BKT)

The system uses BKT parameters for different difficulty levels:

```
Easy:   p_learn=0.3, p_forget=0.05, p_guess=0.3, p_slip=0.1
Medium: p_learn=0.2, p_forget=0.1,  p_guess=0.2, p_slip=0.15
Hard:   p_learn=0.1, p_forget=0.15, p_guess=0.1, p_slip=0.2
```

**Mastery Calculation:**
- **Level**: Probability of having learned the skill
- **Mastery**: Overall competency score (0.0-1.0)

Updates are based on:
1. Prior knowledge/mastery
2. Current assessment performance
3. Difficulty level of the assessment

## 📊 Difficulty Progression System

Users progress through difficulty levels based on:
- **First Attempt**: 90%+ score
- **2-5 Attempts**: Average 40%+ to unlock medium
- **5+ Attempts**: 70%+ average to unlock hard

Recommendations appear in the progression status field.

## ⚙️ Configuration

Edit `src/config/ai.config.ts` to:
- Change model (e.g., `llama-3.1-405b-reasoning`)
- Adjust temperature (lower = more deterministic)
- Modify sampling parameters

## 🔐 Security Notes

- Never commit `.env` files with actual API keys
- Use environment-specific configurations
- Validate all user inputs on the backend
- Sanitize performance data before processing

## 📝 Integration Example

### Complete Flow:

1. **Initialize User**
   ```
   POST /api/adaptive/initialize/:userId
   ```

2. **Start Assessment**
   ```
   POST /api/assessment/start-adaptive-practice
   ```

3. **Submit Assessment**
   ```
   POST /api/assessment/submit-adaptive-practice
   ```

4. **Get Updated Recommendations**
   ```
   GET /api/adaptive/recommendations/:userId
   ```

5. **View Analytics**
   ```
   GET /api/adaptive/analytics/:userId
   ```

## 🐛 Troubleshooting

### Issue: "GROQ_API_KEY is empty"
- Ensure `.env` has valid `GROQ_API_KEY`
- Restart the server after updating `.env`

### Issue: Questions fail to generate
- Check Groq API rate limits
- Verify model name is available
- Check network connectivity

### Issue: Empty or invalid questions
- System retries with lower temperature (0.2)
- Check Groq API response format
- Review logs for JSON parsing errors

## 📚 References

- [Groq Documentation](https://groq.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Bayesian Knowledge Tracing](https://en.wikipedia.org/wiki/Bayesian_Knowledge_Tracing)
