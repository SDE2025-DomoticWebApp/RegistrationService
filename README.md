# Registration Service

Creates new users and stores them via Internal Data Adapter.

**Port:** 3003  
**Auth:** None

## Configuration

Create `.env` from `.env.example`:
```
PORT=3003
DATA_ADAPTER_URL=http://localhost:3001
```

## API

### `POST /register`
Body:
```
{ "email": "...", "name": "...", "surname": "...", "password": "...", "location": "lat,lon" }
```

### `GET /health`
Service health check.


## JSON Examples

### `POST /register`
```json
{
  "email": "user@example.com",
  "name": "John",
  "surname": "Doe",
  "password": "securepassword123",
  "location": "45.07,7.69"
}
```

## Capabilities
- Creates new users and stores them via Internal Data Adapter
- Validates basic registration payload

## Run
```
npm install
npm run dev
```
