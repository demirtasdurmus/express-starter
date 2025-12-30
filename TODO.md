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

### ⚠️ 5. Request Validation Middleware

- **Status**: ⚠️ Partial
- **Priority**: Critical
- **Impact**: No automatic validation of request bodies/params/query
- **Current State**: `parseWithZod` utility exists but no Express middleware wrapper
- **Needed**: Create reusable Zod validation middleware for body/params/query
- **Files**: `src/utils/parse-with-zod.ts` exists, needs middleware wrapper

---

## 🟠 High Priority (Production Features)

### ❌ 6. Health Check Endpoint

- **Status**: ❌ Not Started
- **Priority**: High
- **Impact**: No way for load balancers/monitoring to check service health
- **Needed**: Create `/health` or `/healthz` endpoint
- **Suggested Implementation**:
  - Basic health check: `GET /health`
  - Detailed health check: `GET /health/detailed` (optional)

### ❌ 7. Response Compression

- **Status**: ❌ Not Started
- **Priority**: High
- **Impact**: Larger payloads, slower responses
- **Needed**:
  - Install: `pnpm add compression @types/compression`
  - Add compression middleware to `app.ts`

### ✅ 8. Request Size Limits

- **Status**: ✅ Completed
- **Priority**: High
- **Impact**: Vulnerable to DoS via large payloads
- **Implementation**: Configured in `app.ts` via `apiConfig.requestBodyLimit`
- **Notes**: Already implemented with body parser limits

### ⚠️ 9. Request Validation Middleware (Zod Integration)

- **Status**: ⚠️ Partial
- **Priority**: High
- **Impact**: Manual validation in each controller
- **Current State**: `parseWithZod` utility exists
- **Needed**: Create Express middleware that validates body/params/query with Zod schemas
- **Example**: `validateBody(schema)`, `validateParams(schema)`, `validateQuery(schema)`

### ❌ 10. Environment-based Swagger UI Protection

- **Status**: ❌ Not Started
- **Priority**: High
- **Impact**: Swagger UI exposed in production
- **Needed**:
  - Add authentication middleware for `/api-docs` in production
  - Or conditionally disable Swagger UI in production
  - Options: Basic auth, API key, or disable entirely

---

## 🟡 Medium Priority (Developer Experience)

### ❌ 11. Docker Support

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: Harder to containerize and deploy
- **Needed**:
  - Create `Dockerfile`
  - Create `docker-compose.yml` (optional but recommended)
  - Add `.dockerignore`

### ❌ 12. Database Integration Example

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: No database setup example
- **Needed**: Add example with Prisma/TypeORM/Drizzle
- **Note**: Optional but common in production APIs

### ❌ 13. Authentication/Authorization Example

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: No auth pattern (JWT, sessions, etc.)
- **Needed**: Add example auth middleware/strategy
- **Options**: JWT, Passport.js, or custom implementation

### ❌ 14. Request ID Middleware

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: Harder to trace requests across logs
- **Needed**:
  - Generate unique request ID per request
  - Add to response headers (`X-Request-ID`)
  - Include in all log messages

### ❌ 15. API Versioning Strategy

- **Status**: ❌ Not Started
- **Priority**: Medium
- **Impact**: No versioning pattern
- **Needed**:
  - Add `/api/v1/` structure, or
  - Header-based versioning (`Accept: application/vnd.api+json;version=1`)
- **Note**: Choose one approach and document it

### ⚠️ 16. Structured Logging (Winston/Pino)

- **Status**: ⚠️ Partial
- **Priority**: Medium
- **Impact**: Limited production logging capabilities
- **Current State**: Basic logger exists in `src/utils/logger.ts`
- **Needed**: Upgrade to structured logging library (Winston or Pino)
- **Benefits**: JSON logging, multiple transports, log levels, production-ready

### ⚠️ 17. Graceful Shutdown Improvements

- **Status**: ⚠️ Partial
- **Priority**: Medium
- **Impact**: May drop in-flight requests
- **Current State**: `src/utils/shutdown-gracefully.ts` exists
- **Needed**: Enhance with connection draining
- **Improvements**:
  - Wait for in-flight requests to complete
  - Reject new connections during shutdown
  - Set proper timeout

---

## 🟢 Low Priority (Nice to Have)

### ❌ 18. API Response Pagination Helper

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: Manual pagination implementation
- **Needed**: Add pagination utility/middleware
- **Features**:
  - Parse `page` and `limit` query params
  - Calculate offset
  - Return pagination metadata in response

### ❌ 19. Request Sanitization

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: XSS risk from user input
- **Needed**: Add `express-validator` or similar
- **Note**: Can be combined with validation middleware

### ❌ 20. API Caching Headers

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: No cache control for static/dynamic content
- **Needed**: Add cache-control middleware
- **Use Cases**:
  - Static files: long cache
  - API responses: no-cache or short cache
  - Public endpoints: appropriate cache headers

### ❌ 21. Metrics/Observability

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: Limited production monitoring
- **Needed**: Add Prometheus metrics or similar
- **Options**:
  - Prometheus metrics endpoint
  - OpenTelemetry integration
  - Custom metrics middleware

### ❌ 22. API Request Timeout

- **Status**: ❌ Not Started
- **Priority**: Low
- **Impact**: Long-running requests can hang
- **Needed**: Add timeout middleware
- **Implementation**: Set timeout per route or globally

---

## 📊 Summary

### Completed (✅): 4 items

- Security Headers (Helmet)
- CORS Configuration
- Rate Limiting
- Request Body Parsing
- Request Size Limits

### Partial (⚠️): 3 items

- Request Validation Middleware (needs Express middleware wrapper)
- Structured Logging (basic logger exists, needs upgrade)
- Graceful Shutdown (exists but could be enhanced)

### Not Started (❌): 15 items

- Health Check Endpoint
- Response Compression
- Swagger UI Protection
- Docker Support
- Database Integration Example
- Authentication/Authorization Example
- Request ID Middleware
- API Versioning Strategy
- API Response Pagination Helper
- Request Sanitization
- API Caching Headers
- Metrics/Observability
- API Request Timeout

### Total Progress: 7/22 (32%)

---

## 🎯 Recommended Next Steps

### Immediate (Critical)

1. **Request Validation Middleware** - Create Zod validation middleware wrapper
2. **Health Check Endpoint** - Essential for production deployments

### Next Sprint (High Priority)

3. **Response Compression** - Easy win for performance
4. **Swagger UI Protection** - Security concern for production
5. **Request ID Middleware** - Improves debugging and observability

### Future Enhancements (Medium/Low Priority)

6. Docker support
7. Structured logging upgrade
8. Authentication example
9. Database integration example

---

## 📝 Notes

- Status legend:
  - ✅ Completed
  - ⚠️ Partial/In Progress
  - ❌ Not Started

- This TODO list is based on industry-standard Express.js boilerplate requirements
- Items are prioritized by security impact and production readiness
- Some items (like database/auth examples) are optional but commonly expected
