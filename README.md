# Registration Service

## Overview

Handles new user registration, validates input, securely hashes passwords, and creates user accounts via Internal Data Adapter.

**Port:** 3003 | **Auth Required:** No (public registration)

## Architecture Position

```
Web GUI
   ↓
RegistrationService (THIS SERVICE)
   ↓
Internal Data Adapter
```

## Configuration

**.env**
```env
PORT=3003
DATA_ADAPTER_URL=http://localhost:3001
```

## API Endpoints

### Registration
**POST /register**
```json
Request: {
  "email": "user@example.com",
  "name": "John",
  "surname": "Doe",
  "password": "securepass123"
}
Response: 201 Created (no body)
```

**Response Codes:**
- `201` - User created successfully
- `400` - Missing required fields
- `401` - Invalid registration
- `409` - User already exists
- `500` - Server error

### Health
**GET /health** - Service health check

## Registration Flow

1. Client submits user details
2. Service validates required fields
3. Password hashed with bcryptjs (10 salt rounds)
4. User created via Internal Data Adapter
5. Returns 201 on success

## Quick Start

```bash
npm install
npm run dev  # Development mode (port 3003)
```

## Tech Stack

Node.js, Express.js, bcryptjs, axios

## Service Dependencies

**Consumed by:** Web GUI

**Depends on:** Internal Data Adapter

## Security Features

- Passwords hashed before storage (never stored in plain text)
- bcryptjs with 10 salt rounds
- Duplicate email detection
- Input validation

## Recommended Enhancements

- Email format validation
- Password strength requirements (min 8 chars, complexity)
- Email verification flow
- CAPTCHA for bot prevention
- Rate limiting

## Testing

```bash
# Successful registration
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","surname":"User","password":"pass123"}'

# Duplicate email (should fail)
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Another","surname":"User","password":"pass456"}'
```

## User Flow

```
1. User registers → RegistrationService (201 Created)
2. User logs in → AuthService (JWT token)
3. User accesses app → AggregatorService (with JWT)
```
