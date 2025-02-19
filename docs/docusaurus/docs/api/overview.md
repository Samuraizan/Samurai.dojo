# API Documentation

## Overview

The Samurai Dojo API is built on top of Next.js API routes and Supabase, providing a robust and scalable backend infrastructure. This documentation covers all available endpoints, authentication methods, and data models.

## Authentication

All API requests require authentication using a JWT token. To authenticate:

1. Obtain a token through the authentication endpoint
2. Include the token in the Authorization header:
```http
Authorization: Bearer your-token-here
```

## Base URL

```
Production: https://api.samuraidojo.com
Development: http://localhost:3000/api
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### User Management

#### GET /api/users/profile
Get the current user's profile information.

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "skills": [...],
  "progress": {...}
}
```

### Skills and Progress

#### GET /api/skills
Get available skills and learning paths.

#### POST /api/progress
Update user progress for a specific skill.

## Error Handling

All API errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_INPUT`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Webhooks

Webhooks are available for real-time notifications:
- Progress updates
- Achievement unlocks
- System notifications

## SDK

Official SDK packages:
- [@samurai-dojo/node](https://github.com/samurai-dojo/node-sdk)
- [@samurai-dojo/python](https://github.com/samurai-dojo/python-sdk) 