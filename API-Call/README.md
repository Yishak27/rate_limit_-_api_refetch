# API Call Service

Small Express-based service that demonstrates fetching remote JSON with retry logic and basic hardening.

## Table of Contents
- Overview
- Features
- File structure
- Installation
- Configuration (.env)
- Run
- API
- Implementation details
- Error handling & logging
- License

## Overview
This application exposes a single HTTP endpoint which fetches JSON from an external URL using a retry/backoff strategy. It includes common middleware to sanitize input and improve security.

## Features
- Single GET endpoint: /getData
- Fetch with retry/backoff (configurable)
- Basic security hardening:
  - hpp (HTTP parameter pollution)
  - express-mongo-sanitize
  - xss-clean
  - helmet (imported in codebase for use)
- Request logging via morgan and custom console log
- Response compression
- JSON body parsing

## File structure (important files)
- app.js — Express app, middleware, routes, server start
- services/api.services.js — fetch + retry logic (APIService.fetchWithRetry)
- constant/constant.js — retry & timeout constants (RETRY_TIME, RETRY_TIMEOUT)
- package.json — scripts & dependencies
- .env — environment overrides (PORT)

## Installation
1. Clone repository
2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration (.env)
Place a `.env` file in project root to override defaults:
- PORT — port to run the server (default 3091)

Example:
```
PORT=3091
```

## Run
Start server:
```sh
npm run start
```
Server logs the listening port and every incoming request.

## API

GET /getData
- Description: Fetches JSON from a hardcoded external URL (https://jsonplaceholder.typicode.com/posts/1) using APIService.fetchWithRetry.
- Success (200): returns the data object returned by the service (typically includes `status: true`, `message`, and `data` depending on service implementation).
- Client error (400): returned if APIService returns an unsuccessful response shape.
- Server error (500): returned for unexpected exceptions.
- Not found (404): any other unknown route returns "Resource not found".

Example:
```sh
curl http://localhost:3091/getData
```

## Implementation details
- app.js sets up middleware (hpp, mongoSanitize, xss, compression, morgan) and a simple request logger.
- Route /getData delegates to APIService.fetchWithRetry(url).
- Retry behavior (max attempts, delay) is configured in constant/constant.js and implemented inside services/api.services.js.
- Ensure node supports global fetch or include a polyfill for older Node versions.

## Error handling & logging
- Route-level try/catch returns structured 500 responses when unexpected errors occur.
- morgan logs requests to console in dev format.
- A basic console.log prints incoming request URL and method.

## License
See package.json for license and author metadata.
