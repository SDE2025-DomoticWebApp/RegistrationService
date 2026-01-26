# Registration Service

## Overview

The Registration Service handles new user registration for the domotic web application. It validates user input, securely hashes passwords, and creates new user accounts by communicating with the Internal Data Adapter.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Password Hashing**: bcryptjs
- **HTTP Client**: axios
- **Type**: CommonJS

## Architecture

The service follows a layered architecture:
- **Routes Layer**: HTTP endpoint definitions
- **Service Layer**: Business logic for user registration
- **Client Layer**: Communication with Internal Data Adapter
- **Utils Layer**: Password hashing utilities

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3003
DATA_ADAPTER_URL=http://localhost:3001
```

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Port number for the service | 3003 | No |
| DATA_ADAPTER_URL | Base URL of Internal Data Adapter | - | Yes |

## API Endpoints

### Registration

#### Register New User
```http
POST /register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "Jane",
  "surname": "Smith",
  "password": "secure_password123"
}
```

**Response (Success):**
```http
HTTP/1.1 201 Created
```

**Status Codes:**
- `201 Created` - User registered successfully (no response body)
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid registration (specific business rule violation)
- `409 Conflict` - User with this email already exists (from Data Adapter)
- `500 Internal Server Error` - Server error

**Example Usage with curl:**
```bash
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "Jane",
    "surname": "Smith",
    "password": "secure_password123"
  }'
```

**Field Validation:**
- `email`: Required, must be a valid email format
- `name`: Required, non-empty string
- `surname`: Required, non-empty string
- `password`: Required, non-empty string

---

### Health Check

#### Check Service Health
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Service is running

## Registration Flow

1. **Client sends user data**: New user submits registration details to `/register`
2. **Validate input**: Service checks that all required fields are present
3. **Hash password**: Password is securely hashed using bcryptjs (10 salt rounds)
4. **Create user**: Service sends hashed password and user data to Internal Data Adapter
5. **Handle response**: Returns success (201) or appropriate error

## Password Security

### Hashing
- Passwords are hashed using bcryptjs with a salt round factor of 10
- Plain-text passwords are **never stored** in the database
- Only the hashed password is transmitted to the Internal Data Adapter

### Hashing Process
```javascript
// Example: "mypassword123" becomes something like:
// "$2a$10$N9qo8uLOickgx2ZMRZoMye1yNMC5L8Qi9Z7a9mC0cHqnT8YhcjKBi"
```

### Best Practices
- Passwords should meet minimum complexity requirements (implement in client or add validation here)
- Consider adding password strength validation
- Never log or expose passwords in error messages

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm
- Internal Data Adapter must be running

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file with the required variables (see Configuration section).

### Run the Service

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The service will start on port 3003 (or the port specified in the PORT environment variable).

## Project Structure

```
RegistrationService/
├── src/
│   ├── clients/
│   │   └── dataAdapter.clients.js  # HTTP client for Internal Data Adapter
│   ├── config/
│   │   └── config.js               # Configuration management
│   ├── routes/
│   │   └── registration.routes.js  # Registration endpoint definitions
│   ├── services/
│   │   └── registration.services.js # Registration business logic
│   ├── utils/
│   │   └── password.js             # Password hashing utilities
│   └── app.js                      # Express application setup
├── .env                            # Environment variables (not in git)
├── .gitignore
├── package.json
└── README.md
```

## Dependencies

### Production Dependencies
- `axios` (v1.13.2): HTTP client for service communication
- `bcryptjs` (v3.0.3): Password hashing
- `dotenv` (v17.2.3): Environment variable management
- `express` (v5.2.1): Web framework

### Development Dependencies
- `nodemon` (v3.1.11): Auto-reload during development

## Service Dependencies

This service depends on:
- **Internal Data Adapter** (port 3001): For user creation

This service is consumed by:
- Client applications (web, mobile) for user registration

## Error Handling

The service handles various error scenarios:

| Error Code | Message | Scenario |
|------------|---------|----------|
| 400 | Email, name, surname and password required | Missing required fields |
| 401 | Invalid registration | Business rule violation |
| 409 | User already exists | Duplicate email (from Data Adapter) |
| 500 | Internal server error | Database or service error |

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

### Error Propagation
- `409 Conflict`: Caught from Internal Data Adapter when email already exists
- Other errors are caught and returned as `500 Internal Server Error`

## User Flow Example

### Successful Registration
```bash
# Step 1: Register a new user
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John",
    "surname": "Doe",
    "password": "mySecurePass123"
  }'

# Response: HTTP 201 Created

# Step 2: Login with the new credentials (using Auth Service)
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "mySecurePass123"
  }'

# Response: {"token": "eyJhbGc..."}
```

### Failed Registration (Duplicate Email)
```bash
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@example.com",
    "name": "Jane",
    "surname": "Smith",
    "password": "password123"
  }'

# Response: HTTP 409 Conflict
# {"error": "User already exists"}
```

## Testing

### Test Registration Endpoint
```bash
# Successful registration
curl -v -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","surname":"User","password":"testpass123"}'

# Missing fields
curl -v -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'

# Duplicate email
curl -v -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@example.com","name":"Test","surname":"User","password":"testpass123"}'
```

## Security Considerations

### Input Validation
- All required fields are validated before processing
- Consider adding:
  - Email format validation (regex)
  - Password strength requirements
  - Name/surname length limits
  - SQL injection protection (handled by Internal Data Adapter)

### Password Requirements (Recommended)
Implement these checks before accepting registration:
- Minimum length: 8 characters
- Must contain: uppercase, lowercase, number, special character
- Cannot be common passwords (use a dictionary check)
- Cannot contain user's email or name

### Rate Limiting
Consider implementing rate limiting to prevent:
- Automated registration attacks
- Email enumeration attacks
- Resource exhaustion

## Future Enhancements

- Add email format validation
- Implement password strength requirements
- Add email verification flow (send confirmation email)
- Implement CAPTCHA for bot prevention
- Add username uniqueness check
- Support for social authentication (OAuth)
- Add terms of service acceptance
- Implement duplicate detection with better error messages
- Add registration analytics and monitoring
- Support for account activation workflow

## Integration with Other Services

### Post-Registration Flow
After successful registration, users should:
1. Receive a confirmation email (to be implemented)
2. Login using the Auth Service
3. Access protected resources with JWT token

### Service Communication
```
Client Application
       ↓
Registration Service (port 3003)
       ↓
Internal Data Adapter (port 3001)
       ↓
SQLite Database
```

## Troubleshooting

### Common Issues

**Issue**: Registration returns 500 error
- **Solution**: Check if Internal Data Adapter is running on port 3001

**Issue**: User created but cannot login
- **Solution**: Verify password hashing is working correctly (check if hash starts with `$2a$` or `$2b$`)

**Issue**: "User already exists" error for new email
- **Solution**: Check the database directly to confirm user doesn't exist; may be a casing issue

### Logging
To enable detailed logging, add console.log statements in:
- `registration.services.js`: Log hash generation
- `dataAdapter.clients.js`: Log HTTP requests/responses
- `registration.routes.js`: Log incoming requests
