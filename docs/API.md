# 📚 Sidra Content Factory API Documentation

## Overview

This document describes the RESTful API for Sidra Content Factory - an AI-powered content creation platform.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

All endpoints (except login) require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### Ideation

#### POST /ideation/generate
Generate 5 content ideas based on a topic.

**Request Body:**
```json
{
  "topic": "بداية العام الدراسي"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cardId": "uuid-card-id",
    "ideas": [
      {
        "id": "idea-1",
        "topic_id": "uuid-card-id",
        "text": "نصائح عملية للطلاب في بداية العام الدراسي",
        "rationale": "محتوى تعليمي مفيد يساعد الطلاب على الاستعداد للعام الجديد"
      },
      {
        "id": "idea-2",
        "topic_id": "uuid-card-id",
        "text": "رسالة موجهة لأولياء الأمور حول أهمية المشاركة",
        "rationale": "بناء جسر تواصل مع العائلة لضمان نجاح الطلاب"
      }
      // ... 3 more ideas
    ]
  }
}
```

#### POST /ideation/select
Select an idea from the generated options.

**Request Body:**
```json
{
  "cardId": "uuid-card-id",
  "ideaId": "idea-1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nextStep": "copywriting"
  }
}
```

### Copywriting

#### POST /copywriting/compose
Compose copy based on selected idea, tone, and culture context.

**Request Body:**
```json
{
  "cardId": "uuid-card-id",
  "ideaTextSeed": "نصائح عملية للطلاب في بداية العام الدراسي",
  "tone": "friendly",
  "cultureContext": "sudanese"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "copyText": "مرحباً جميعاً! 🌟\n\nمع بداية العام الدراسي الجديد..."
  }
}
```

#### POST /copywriting/approve
Approve and save the final copy.

**Request Body:**
```json
{
  "cardId": "uuid-card-id",
  "edits": "Optional edited version of the copy text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Copy approved and saved successfully"
  }
}
```

## Data Models

### ContentCard
```typescript
interface ContentCard {
  id: string;
  topic: string;
  selectedIdeaId?: string;
  copyText?: string;
  tone?: 'friendly' | 'professional' | 'creative' | 'formal';
  cultureContext?: 'sudanese' | 'british' | 'hybrid';
  platform: string; // Currently 'facebook' only
  status: 'Draft' | 'UnderReview' | 'Approved' | 'Published';
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  auditTrail?: Record<string, any>;
}
```

### IdeaOption
```typescript
interface IdeaOption {
  id: string;
  topicId: string;
  text: string;
  rationale: string;
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production.

## Swagger Documentation

When running the backend locally, you can access the interactive Swagger documentation at:
```
http://localhost:3001/api/docs
```

## SDK Examples

### JavaScript/TypeScript
```typescript
// Using axios
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Generate ideas
const ideas = await api.post('/ideation/generate', {
  topic: 'بداية العام الدراسي'
});

// Compose copy
const copy = await api.post('/copywriting/compose', {
  cardId: 'uuid-card-id',
  ideaTextSeed: 'نصائح عملية للطلاب',
  tone: 'friendly',
  cultureContext: 'sudanese'
});
```