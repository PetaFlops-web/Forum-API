# Forum API

Backend API untuk aplikasi forum/thread. Project ini memakai Clean Architecture, JWT authentication, PostgreSQL, integration test, Swagger documentation, Docker, dan Nginx reverse proxy.

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Database | PostgreSQL |
| Authentication | JWT access token + refresh token |
| Password Hashing | bcryptjs |
| Testing | Vitest + Supertest |
| API Docs | Swagger UI |
| Container | Docker + Docker Compose |
| Reverse Proxy | Nginx |

## Features

- User registration and login
- Access token and refresh token authentication
- Refresh token persistence and invalidation on logout
- Create thread
- Get thread detail with comments
- Add comment to thread
- Soft-delete own comment
- Request logging middleware
- Basic rate limiting middleware
- Health check endpoint with database status
- Swagger API documentation
- Unit and integration tests

## Architecture

```text
src/
├── Domains/              # Entities and repository contracts
├── Applications/         # Use cases and application security contracts
├── Infrastructures/      # PostgreSQL repositories, HTTP server, security adapters
├── Interfaces/http/api/  # Route handlers and route definitions
└── app.js                # Application entry point
```

The project keeps business rules in use cases and domain entities. HTTP handlers, database adapters, JWT, and password hashing stay in the infrastructure/interface layers.

## API Endpoints

### Users and Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/users` | No | Register user |
| `POST` | `/authentications` | No | Login and receive tokens |
| `PUT` | `/authentications` | No | Refresh access token |
| `DELETE` | `/authentications` | No | Logout and invalidate refresh token |

### Threads and Comments

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/threads` | Yes | Create thread |
| `GET` | `/threads/:threadId` | No | Get thread detail |
| `POST` | `/threads/:threadId/comments` | Yes | Add comment |
| `DELETE` | `/threads/:threadId/comments/:commentId` | Yes | Delete own comment |

### System

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | App and database health check |
| `GET` | `/api-docs` | No | Swagger documentation |

## Quick Demo

### Register

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123","fullname":"Demo User"}'
```

<details>
<summary>Response</summary>

```json
{
  "status": "success",
  "data": {
    "addedUser": {
      "id": "user-ViSminTjW7cUqBbhJqM52",
      "username": "demo",
      "fullname": "Demo User"
    }
  }
}
```
</details>

### Login

```bash
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{"username":"dicoding","password":"secret"}'
```

<details>
<summary>Response</summary>

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```
</details>

### Create Thread (authenticated)

```bash
ACCESS="<accessToken from login>"  # paste token from login response

curl -X POST http://localhost:5000/threads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS" \
  -d '{"title":"Tips Node.js","body":"Share tips terbaik!"}'
```

<details>
<summary>Response</summary>

```json
{
  "status": "success",
  "data": {
    "addedThread": {
      "id": "thread-ByKn9FR3V9VBdEBM",
      "title": "Tips Node.js",
      "owner": "user-I0XQxATMWx0pqY5cJO_pn"
    }
  }
}
```
</details>

### Get Thread Detail

```bash
curl -s http://localhost:5000/threads/thread-ByKn9FR3V9VBdEBM
```

<details>
<summary>Response</summary>

```json
{
  "status": "success",
  "data": {
    "thread": {
      "id": "thread-ByKn9FR3V9VBdEBM",
      "title": "Tips Node.js",
      "body": "Share tips terbaik!",
      "date": "2026-07-25T11:26:12.532Z",
      "username": "dicoding",
      "comments": []
    }
  }
}
```
</details>

### Health Check

```bash
curl http://localhost:5000/health
```

<details>
<summary>Response</summary>

```json
{
  "status": "success",
  "data": {
    "uptime": 477.47,
    "timestamp": "2026-07-25T18:25:52.915Z",
    "database": {
      "status": "connected",
      "latency": "4ms"
    },
    "memory": {
      "rss": "73MB",
      "heapUsed": "14MB"
    }
  }
}
```
</details>

### Swagger UI

Explore all endpoints interactively at:

```text
http://localhost:5000/api-docs
```

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL
- npm

### Install

```bash
npm install
cp .env.example .env
```

Edit `.env` sesuai database lokal:

```env
NODE_ENV=development
PORT=5000
PGHOST=localhost
PGPORT=5432
PGUSER=forumuser
PGPASSWORD=forumpassword
PGDATABASE=forum_api
ACCESS_TOKEN_KEY=your_super_secret_access_token_key_here
REFRESH_TOKEN_KEY=your_super_secret_refresh_token_key_here
ACCESS_TOKEN_AGE=1800
```

### Database Migration

```bash
npm run migrate up
```

### Seed Sample Data

```bash
npm run seed
```

Creates:

- **3 users** — `dicoding`, `alice`, `bob` (password: `secret`)
- **2 threads** — sample discussions
- **5 comments** — conversation across threads

### Run App

```bash
npm run start:dev
```

App berjalan di:

```text
http://localhost:5000
```

Swagger docs:

```text
http://localhost:5000/api-docs
```

## Docker Setup

Docker Compose menjalankan:

| Service | Host Port | Container Port |
| --- | ---: | ---: |
| app | `5000` | `5000` |
| postgres | `5433` | `5432` |
| nginx | `8080` | `80` |

> Host port `5433` dan `8080` dipakai agar tidak bentrok dengan PostgreSQL lokal di `5432` dan web server lokal di `80`.

### Start

```bash
docker compose up -d --build
```

### Check

```bash
docker compose ps
curl http://localhost:5000/health
curl http://localhost:8080/health
```

Expected health response:

```json
{
  "status": "success",
  "data": {
    "database": {
      "status": "connected"
    }
  }
}
```

### Stop

```bash
docker compose down
```

## Testing

Run all tests:

```bash
npm test
```

Latest local verification:

```text
Test Files  39 passed (39)
Tests       132 passed (132)
```

Run coverage:

```bash
npm run test:coverage
```

Run lint:

```bash
npm run lint
```

## Environment Files

- `.env.example` is safe to commit as a template.
- `.env` and `.test.env` are ignored because they may contain local credentials or secrets.

## Project Structure

```text
Forum-API/
├── migrations/                         # PostgreSQL migrations
├── src/
│   ├── Applications/
│   │   ├── security/                    # Security contracts
│   │   └── use_case/                    # Business use cases
│   ├── Commons/
│   │   ├── config.js                    # Environment config
│   │   └── exceptions/                  # Custom errors
│   ├── Domains/
│   │   ├── authentications/
│   │   ├── comments/
│   │   ├── threads/
│   │   └── users/
│   ├── Infrastructures/
│   │   ├── database/postgres/           # PostgreSQL pool
│   │   ├── http/                        # Express server, middleware, Swagger
│   │   ├── repository/                  # PostgreSQL repository implementations
│   │   └── security/                    # JWT and bcrypt adapters
│   ├── Interfaces/http/api/             # HTTP handlers and routes
│   └── app.js
├── tests/                               # Test helpers and integration tests
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── nginx.docker.conf
├── vitest.config.js
└── package.json
```

## License

ISC
