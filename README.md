# Registration Service

Creates new users and stores them via Internal Data Adapter.

**Port:** 3003  
**Auth:** None

## Configuration

`.env`
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

## Run
```
npm install
npm run dev
```
