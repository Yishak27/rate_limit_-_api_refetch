# Rate Limit Service

Lightweight Express service that enforces per-user rate limits with MongoDB-backed counters. Designed for clarity, safety, and easy local development.

## Table of contents
- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [API](#api)
- [Example requests](#example-requests)
- [Important files](#important-files)
- [Development notes & troubleshooting](#development-notes--troubleshooting)
- [License](#license)
- [Contributing](#contributing)

## Overview
This project exposes a single protected POST endpoint (`/data`). A middleware-level rate limiter tracks requests per user (via an identifier header) and enforces a configurable request window using MongoDB for persistence.

## Features
- Per-user rate limiting persisted in MongoDB
- Configurable window and limits via constants
- Security middleware: Helmet, CORS, HPP, express-mongo-sanitize, xss-clean
- Compression and request logging (morgan)
- Minimal, testable code surface

## Requirements
- Node.js 16+ (or compatible)
- npm
- Running MongoDB instance (local or remote)
- .env file in project root

## Quick start
1. Install deps:
   ```sh
   npm install
   ```
2. Create a `.env` file in the project root with:
   ```
   PORT=3090
   DATABASE_CON_STRING=mongodb://<user>:<pass>@host:port/dbname
   ```
3. Start server:
   ```sh
   npm start
   ```
4. POST to `/data` with required header `x-user-id` (see API below).

## Configuration
- Rate limit constants live in constants/constant.js (default values shown)
  - RATE_LIMIT: 5 (requests)
  - WINDOW_MS: 60000 (1 minute)
- Change constants or env vars to tune behavior.

## API

POST /data
- Description: Simple endpoint protected by the rate limiter.
- Required header: `x-user-id` — unique identifier for the requester (used to track limits).
- Success response: 200 JSON
  ```json
  { "status": true, "message": "Success." }
  ```
- Error responses:
  - 400 — missing/invalid input or header
  - 429 — rate limit exceeded
  - 500 — server / DB error

## Example requests

Curl:
```sh
curl -X POST http://localhost:3090/data \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{}'
```

Node (fetch):
```js
fetch('http://localhost:3090/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-user-id': 'user123' },
  body: JSON.stringify({})
});
```

## Important files
- app.js — application bootstrap, middleware registration, routes
- middleware/rateLimiter.js — rate limiting middleware
- schema/rateLimit.schema.js — Mongoose model for counters
- constants/constant.js — limit & window config
- package.json — scripts & dependencies

## Development notes & troubleshooting
- Logging: morgan prints requests to console. Use a production logger for deployments.
- MongoDB: verify `DATABASE_CON_STRING` and ensure network access. Check console output for connection errors.
- Missing `x-user-id` header will result in client error / limiter rejection.
- To debug limits, inspect the RateLimit collection in MongoDB — documents store counters and timestamps.
- For high throughput or clustering, consider Redis or a distributed rate limiter.

## Contributing
- Open issues or PRs for improvements.
- Keep changes focused: tests, clear commit messages, and small refactors are preferred.

## License
Author: Ermiyas (Yishak)
See package.json for license metadata.
