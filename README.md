# Express TypeScript Starter Kit

A modern, production-ready Express.js starter template with TypeScript, comprehensive testing, and development tooling.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v22 or higher)
- pnpm

### Installation

```bash
# Clone the repository
git clone git@github.com:demirtasdurmus/express-starter.git
cd express-starter

# Install dependencies
pnpm install

# Create .env file and update the values if needed
cp .env.example .env

# Start the development server with hot reload
pnpm dev
```

## 🚀 Features

- **TypeScript** - Full TypeScript support with strict configuration
- **Express.js** - Fast, unopinionated web framework
- **Security Headers (Helmet)** - Sets various HTTP security headers to protect against common vulnerabilities
- **CORS** - Configurable Cross-Origin Resource Sharing with environment-based origins
- **Rate Limiting** - API rate limiting (100 requests/15min in production, 1000 in development)
- **Body Parsing** - Secure JSON and URL-encoded body parsing with size limits (10MB)
- **Request Validation** - Automatic validation of request body, params, and query using Zod schemas
- **Internationalization (i18n)** - Multi-language support with automatic language detection and type-safe translation keys
- **Response Compression** - Automatic gzip/deflate compression for improved performance
- **Asset Minification** - Automatic minification of JavaScript and CSS files in production builds
- **Health Check** - Health check endpoint at `/health` for load balancers and monitoring
- **Metrics** - Prometheus-compatible metrics endpoint at `/metrics`
- **Structured Logging** - Pino-based structured logging with JSON output in production
- **Request ID** - Automatic request ID generation and tracking via `X-Request-ID` header
- **API Documentation** - Swagger/OpenAPI documentation with interactive UI at `/api-docs` (protected with HTTP Basic Auth in production and staging)
- **Docker Support** - Production-ready Dockerfile and docker-compose.yml for easy containerization
- **Build (tsdown)** - [tsdown](https://github.com/rolldown/tsdown) bundles the app for dev and production with path alias support
- **Testing** - Jest with unit and integration test configurations
- **Code Quality** - ESLint, Prettier, and Husky for code formatting and linting
- **Development** - Hot reload via tsdown watch mode
- **Architecture** - Clean MVC structure with controllers, services, and middleware
- **Static Files** - Built-in static file serving
- **Error Handling** - Comprehensive error handling with proper HTTP status codes

## 📁 Project Structure

```sh
docs/                # Documentation and ADRs
src/
├── config/          # Configuration
├── controllers/     # Request handlers
├── env/             # Environment variables
├── middleware/      # Custom middleware
├── routes/          # Router definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app configuration
└── index.ts         # Server entry point
locales/            # i18n translation files
  ├── en/           # English translations
  └── tr/           # Turkish translations
public/             # Static files
  ├── css/          # CSS files
  ├── js/           # JavaScript files
  └── index.html    # HTML file
scripts/            # Build and utility scripts
__tests__/          # Integration tests
dist/               # Bundled output (tsdown)
coverage/           # Coverage reports
```

## 🏗️ Development

The project uses [tsdown](https://github.com/rolldown/tsdown) for development, production builds, and path alias resolution (`@/` → `src/`). Type checking is handled separately via `tsc --noEmit`.

```bash
pnpm dev              # tsdown watch + runs bundled output
pnpm build            # production bundle (MINIFY_ASSETS=true to also minify static assets)
pnpm start            # run production bundle
pnpm typecheck        # TypeScript type check only
```

### Adding New Routes

1. Create a controller in `src/controllers/`
2. Create a service in `src/services/` (if needed)
3. Create Zod validation schemas in `src/schemas/` for request validation
4. Define routes in `src/routers/` with validation middleware and OpenAPI specification
5. Import and use in `src/app.ts`

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and routes
- **Coverage Reports**: Track test coverage

```bash
# Run all tests
pnpm test

# Run integration tests
pnpm test:int

# Generate coverage report
pnpm test:coverage
```

### Metrics and Observability

The application exposes Prometheus-compatible metrics at `/metrics`.

Included metrics:

- Default Node.js/process metrics
- HTTP request count
- HTTP request duration histogram

The app emits structured JSON logs to stdout in production. External observability infrastructure such as Prometheus, Grafana, Loki, Vector, Promtail, or OpenTelemetry is intentionally not bundled with this starter.

In real deployments, you may want to expose `/metrics` only on an internal network or protect it at the reverse proxy level. This starter leaves `/metrics` public by default.

## 🚀 Deployment

### Local Deployment

1. Build the project: `pnpm build` (static assets are minified when `MINIFY_ASSETS=true`)
2. Set environment variables (especially `NODE_ENV=production`, `CORS_ORIGIN`, `API_DOCS_USERNAME`, and `API_DOCS_PASSWORD`)
3. Start the server: `pnpm start`
4. The server will run on the port specified in the `PORT` environment variable (default: 9000)

### Docker Deployment

The project includes production-ready Docker configuration:

#### Using Docker Compose (Recommended)

1. Update your `.env` file with production values:

2. Build and start the container:

   ```bash
   docker-compose up --build -d
   ```

3. View logs:

   ```bash
   docker logs <container_name> -f
    # or
   docker-compose logs -f
   ```

4. Stop the container:
   ```bash
   docker-compose down
   ```

#### Using Docker Directly

1. Build the image:

   ```bash
   docker build -t express-starter .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name express-starter \
     -p 9000:9000 \
     -e NODE_ENV=production \
     -e PORT=9000 \
     -e HOST=0.0.0.0 \
     -e CORS_ORIGIN=* \
     -e API_DOCS_USERNAME=your-username \
     -e API_DOCS_PASSWORD=your-password \
     express-starter
   ```

### Production Considerations

- Set `NODE_ENV=production` for optimized error handling, security and static asset minification
- Set `HOST=0.0.0.0` when running in Docker to allow external connections
- Configure `CORS_ORIGIN` with your frontend domain(s) (avoid using `*` in production)
- Set `API_DOCS_USERNAME` and `API_DOCS_PASSWORD` to protect `/api-docs` with HTTP Basic Auth in production and staging (the app fails to start if either is missing in those environments; development and test remain public)
- Ensure HTTPS is configured at the reverse proxy/load balancer level
- Monitor rate limiting and adjust limits based on your traffic patterns
- Configure `DEFAULT_LANGUAGE` and `SUPPORTED_LANGUAGES` based on your target audience

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
