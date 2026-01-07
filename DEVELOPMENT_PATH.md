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
  - PM2 for process management
  - Non-root user (nodejs) for security
  - Health checks with wget/curl support
  - Automatic asset minification in production builds
  - Production dependencies only in final image
  - Environment variable configuration
  - Resource limits and restart policies
- **Notes**:
  - Uses Alpine Linux for smaller image size
  - Swagger documentation works in production (uses dist/ paths)
  - Asset minification runs automatically when NODE_ENV=production
  - Health check endpoint configured for container orchestration

### ❌ 12. Metrics/Observability

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: Limited production monitoring
- **Needed**: Add Prometheus metrics or similar
- **Options**:
  - Prometheus metrics endpoint
  - OpenTelemetry integration
  - Custom metrics middleware

### ❌ 13. API Caching Headers

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: No cache control for static/dynamic content
- **Needed**: Add cache-control middleware
- **Use Cases**:
  - Static files: long cache
  - API responses: no-cache or short cache
  - Public endpoints: appropriate cache headers

### ❌ 14. API Request Timeout

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: Long-running requests can hang
- **Needed**: Add timeout middleware
- **Implementation**: Set timeout per route or globally

### ❌ 15. API Versioning Strategy

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: No versioning pattern
- **Needed**:
  - Add `/api/v1/` structure, or
  - Header-based versioning (`Accept: application/vnd.api+json;version=1`)
- **Note**: Choose one approach and document it

### ❌ 16. Environment-based Swagger UI Protection

- **Status**: ❌ Not Started
- **Priority**: High
- **Impact**: Swagger UI exposed in production
- **Needed**:
  - Add authentication middleware for `/api-docs` in production
  - Or conditionally disable Swagger UI in production
  - Options: Basic auth, API key, or disable entirely

---

## 🟢 Low Priority (Nice to Have)

### ❌ 17. Database Integration Example

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: No database setup example
- **Needed**: Add example with Prisma/TypeORM/Drizzle
- **Note**: Optional but common in production APIs

### ❌ 18. Authentication/Authorization Example

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: No auth pattern (JWT, sessions, etc.)
- **Needed**: Add example auth middleware/strategy
- **Options**: JWT, Passport.js, or custom implementation

### ❌ 19. API Response Pagination Helper

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: Manual pagination implementation
- **Needed**: Add pagination utility/middleware
- **Features**:
  - Parse `page` and `limit` query params
  - Calculate offset
  - Return pagination metadata in response

---

## 📝 Notes

- Status legend:
  - ✅ Completed
  - ⚠️ Partial/In Progress
  - ❌ Not Started

- This TODO list is based on industry-standard Express.js boilerplate requirements
- Items are prioritized by security impact and production readiness
- Some items (like database/auth examples) are optional but commonly expected
