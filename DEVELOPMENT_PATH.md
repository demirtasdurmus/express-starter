# TODO - Express Starter Improvements

This document tracks all planned improvements and enhancements for the Express Starter boilerplate, organized by priority and criticality.

## 🔴 Critical (Security and Production Readiness)

### ✅ 1. Security Headers (Helmet)

- **Status**: ✅ Completed
- **Priority**: Critical
- **Impact**: Vulnerable to XSS, clickjacking, and other attacks
- **Implementation**: `src/middleware/helmet.middleware.ts`
- **Notes**: Implemented with CSP configuration

### ✅ 2. CORS Configuration

- **Status**: ✅ Completed
- **Priority**: Critical
- **Impact**: API won't work with frontend apps from different origins
- **Implementation**: `src/middleware/cors.middleware.ts`
- **Notes**: Environment-based origin configuration

### ✅ 3. Rate Limiting

- **Status**: ✅ Completed
- **Priority**: Critical
- **Impact**: Vulnerable to brute-force and DDoS attacks
- **Implementation**: `src/middleware/rate-limit.middleware.ts`
- **Notes**: Configurable via `apiConfig.apiRateLimit`

### ✅ 4. Request Body Parsing

- **Status**: ✅ Completed
- **Priority**: Critical
- **Impact**: POST/PUT/PATCH requests won't parse JSON/URL-encoded bodies
- **Implementation**: `app.ts` - `express.json()` and `express.urlencoded()`
- **Notes**: Size limits configured via `apiConfig.requestBodyLimit`

### ✅ 5. Request Validation Middleware

- **Status**: ✅ Completed
- **Priority**: Critical
- **Impact**: No automatic validation of request bodies/params/query
- **Implementation**: `src/middleware/validate.middleware.ts`
- **Notes**: Reusable Zod validation middleware for body/params/query. Supports Express 5 with proper query handling. Includes i18n support for validation messages.

---

## 🟠 High Priority (Production Features)

### ✅ 6. Health Check Endpoint

- **Status**: ✅ Completed
- **Priority**: High
- **Impact**: No way for load balancers/monitoring to check service health
- **Implementation**: `src/routes/health.route.ts` and `src/controllers/health.controller.ts`
- **Notes**: Returns status, timestamp, and API version. Available at `GET /health`. Includes Swagger documentation.

### ✅ 7. Response Compression

- **Status**: ✅ Completed
- **Priority**: High
- **Impact**: Larger payloads, slower responses
- **Implementation**: `app.ts` - compression middleware
- **Notes**: Automatically compresses responses using gzip/deflate for better performance

### ✅ 8. Structured Logging (Pino)

- **Status**: ✅ Completed
- **Priority**: Medium
- **Impact**: Limited production logging capabilities
- **Implementation**: `src/utils/logger.ts` - Pino-based structured logger
- **Notes**:
  - JSON logging in production, pretty printing in development
  - Environment-based log levels (info in production, debug in development)
  - Security redaction for sensitive data (passwords, tokens, etc.)
  - ISO timestamp formatting

### ✅ 9. Request ID Middleware

- **Status**: ✅ Completed
- **Priority**: Medium
- **Impact**: Harder to trace requests across logs
- **Implementation**: `src/middleware/http-logger.middleware.ts`
- **Notes**:
  - Generates unique UUID per request
  - Adds `X-Request-ID` header to all responses
  - Includes request ID in all log messages
  - Integrated with Pino HTTP logger for production

### ✅ 10. Internationalization (i18n) / Localization

- **Status**: ✅ Completed
- **Priority**: Medium
- **Impact**: Error messages and API responses are hardcoded in English
- **Implementation**:
  - `src/middleware/i18n.middleware.ts` - i18next-based i18n middleware
  - `src/types/i18next.d.ts` - TypeScript type declarations for translation keys
  - `locales/en/translation.json` and `locales/tr/translation.json` - Translation files
- **Features**:
  - Language detection priority: Query param (`?lang=tr`) > Cookie > Accept-Language header
  - Cookie persistence for user language preference (1 year)
  - Type-safe translation keys with autocomplete (`req.t('errors.notFound')`)
  - Zod v4 native locale support for validation error messages
  - Custom error message translation using i18next keys
- **Supported Languages**: English (en) and Turkish (tr)
- **Notes**:
  - Uses i18next with file system backend
  - Full TypeScript support with module augmentation
  - Integrates with Zod v4's built-in locale system

---

## 🟡 Medium Priority (Developer Experience)

### ✅ 11. Docker Support

- **Status**: ✅ Completed
- **Priority**: Medium
- **Impact**: Harder to containerize and deploy
- **Implementation**:
  - `Dockerfile` - Multi-stage build with optimized production image
  - `docker-compose.yml` - Complete Docker Compose configuration with health checks
  - `.dockerignore` - Excludes unnecessary files from build context
- **Features**:
  - Multi-stage build (builder + production stages)
  - Node runs the app directly; container restart policy supervises the process (`restart: unless-stopped` in Compose)
  - Non-root user (nodejs) for security
  - Health checks use `node`/`http.get` against `/health` (no wget/curl in the image)
  - Automatic asset minification in production builds
  - Production dependencies only in final image
  - Environment variable configuration
  - Resource limits and restart policies
- **Notes**:
  - Uses Alpine Linux for smaller image size
  - Dockerfiles activate pnpm via Corepack with the **same patch version as `package.json` → `packageManager`**
  - Swagger documentation works in production (uses dist/ paths)
  - Asset minification runs automatically when NODE_ENV=production
  - Health check endpoint configured for container orchestration

### ✅ 12. API Caching Headers

- **Status**: ✅ Completed
- **Priority**: High
- **Impact**: Sensible Cache-Control for a standard Express server (browser/CDN caching only)
- **Implementation**:
  - `src/middleware/cache-control.middleware.ts` – sets Cache-Control by path (health no-cache, static max-age, API GET no-cache, mutations no-store)
  - `src/utils/cache.ts` – `setCacheControl(res, directives)` for controller overrides
  - Config: `apiConfig.cache` (staticMaxAge, apiDefault, health, swagger)
  - Express built-in ETag (`app.set('etag', 'weak')`) for dynamic responses; `express.static` for static files

### ✅ 13. API Request Timeout

- **Status**: ✅ Completed
- **Priority**: Low
- **Impact**: Long-running requests can hang
- **Implementation**:
  - `connect-timeout` middleware applied globally in `app.ts`
  - Config: `apiConfig.timeout.request` (default: 30000ms / 30 seconds)
  - Sends 503 Service Unavailable when timeout fires
  - Error middleware checks `req.timedout` or `res.headersSent` to prevent double-send
  - Note: Long-running handlers should check `req.timedout` before expensive operations

### ✅ 14. API Response Pagination Helper

- **Status**: ✅ Completed
- **Priority**: Low
- **Impact**: Manual pagination implementation
- **Implementation**: `src/utils/get-pagination-meta.ts`
- **Notes**:
  - Parse `page` and `limit` query params
  - Calculate offset
  - Return pagination metadata in response

### ✅ 15. API Versioning Strategy

- **Status**: ✅ Completed
- **Priority**: Medium
- **Impact**: No versioning pattern
- **Note**:
  - Current API base path: `/api/v1`
  - Only major versions are exposed in URLs (`v1`, `v2`)
  - Minor/patch changes remain within the same major version
  - Swagger/OpenAPI uses `/api/v1` as the server base URL

## 🟢 Low Priority (Nice to Have)

### ✅ 16. Environment-based Swagger UI Protection

- **Status**: ✅ Completed
- **Priority**: Medium
- **Impact**: Swagger UI exposed in production
- **Implemented**:
  - HTTP Basic Auth middleware for `/api-docs` in production and staging
  - Credentials via `API_DOCS_USERNAME` and `API_DOCS_PASSWORD` environment variables
  - Fail-fast validation when credentials are missing in production-like environments
  - Development and test environments remain publicly accessible

### ✅ 17. Metrics/Observability

- **Status**: ✅ Completed
- **Priority**: Low
- **Impact**: No metrics endpoint
- **Implemented**:
  - Prometheus-compatible `/metrics` endpoint
  - Default Node.js/process metrics via `prom-client`
  - HTTP request counter
  - HTTP request duration histogram
  - Stable route labels to avoid high cardinality
  - Structured JSON logs remain stdout-based
- **Out of scope**:
  - Prometheus server
  - Grafana dashboards
  - Loki / log aggregation
  - OpenTelemetry tracing
  - Docker observability stack

### ❌ 18. Database Integration Example

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: No database setup example
- **Needed**: Add example with Prisma/TypeORM/Drizzle
- **Note**: Optional but common in production APIs

### ❌ 19. Authentication/Authorization Example

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: No auth pattern (JWT, sessions, etc.)
- **Needed**: Add example auth middleware/strategy
- **Options**: JWT, Passport.js, or custom implementation

---

## 📝 Notes

- Status legend:
  - ✅ Completed
  - ⚠️ Partial/In Progress
  - ❌ Not Started

- This TODO list is based on industry-standard Express.js boilerplate requirements
- Items are prioritized by security impact and production readiness
- Some items (like database/auth examples) are optional but commonly expected
