# Express TypeScript Starter Kit

A modern, production-ready Express.js starter template with TypeScript, comprehensive testing, and development tooling.

## 🚀 Features

- **TypeScript** - Full TypeScript support with strict configuration
- **Express.js** - Fast, unopinionated web framework
- **Security Headers (Helmet)** - Sets various HTTP security headers to protect against common vulnerabilities
- **CORS** - Configurable Cross-Origin Resource Sharing with environment-based origins
- **Rate Limiting** - API rate limiting (100 requests/15min in production, 1000 in development)
- **Body Parsing** - Secure JSON and URL-encoded body parsing with size limits (10MB)
- **Request Validation** - Automatic validation of request body, params, and query using Zod schemas
- **API Documentation** - Swagger/OpenAPI documentation with interactive UI at `/api-docs`
- **Testing** - Jest with unit and integration test configurations
- **Code Quality** - ESLint, Prettier, and Husky for code formatting and linting
- **Development** - Hot reload with TypeScript watch mode
- **Architecture** - Clean MVC structure with controllers, services, and middleware
- **Static Files** - Built-in static file serving
- **Error Handling** - Comprehensive error handling with proper HTTP status codes

## 📁 Project Structure

```sh
src/
├── config/          # Configuration
├── controllers/     # Request handlers
├── env/             # Environment variables
├── middleware/      # Custom middleware
├── routes/          # Route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app configuration
└── index.ts         # Server entry point

__tests__/          # Integration tests
dist/               # Compiled JavaScript output
public/             # Static files
coverage/           # Coverage reports
```

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

## 🏗️ Development

### Adding New Routes

1. Create a controller in `src/controllers/`
2. Create a service in `src/services/` (if needed)
3. Create Zod validation schemas in `src/schemas/` for request validation
4. Define routes in `src/routes/` with validation middleware and OpenAPI specification
5. Import and use in `src/app.ts`

#### Request Validation

The starter includes a reusable validation middleware that uses Zod schemas:

```typescript
import { createSampleSchema } from '../schemas/sample';
import { validate } from '../middleware/validate.middleware';

router.post('/', validate({ validationMap: 'body', schema: createSampleSchema }), createController);
```

The `validate` middleware supports:

- `body` - Validates request body
- `params` - Validates URL parameters
- `query` - Validates query string parameters

### Example API Endpoint

The starter includes CRUD endpoints for a sample resource that demonstrates:

- MVC pattern (Model-View-Controller)
- Request validation with Zod schemas
- Error handling
- Swagger/OpenAPI documentation

## 🔧 Configuration

- **TypeScript**: Configured in `tsconfig.json` with strict settings
- **ESLint**: Code linting rules in `eslint.config.mts`
- **Prettier**: Code formatting in `.prettierrc`
- **Jest**: Testing configuration in `jest.config.ts` and `jest-int.config.ts`

## 📦 Dependencies

### Production

- `express` - Web framework
- `dotenv` - Load env variables
- `helmet` - Security headers middleware
- `cors` - Cross-Origin Resource Sharing middleware
- `express-rate-limit` - Rate limiting middleware
- `zod` - Data validation
- `http-status` - Error library construction
- `swagger-jsdoc` and `swagger-ui-express` - Swagger documentation and UI

### Development

- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `eslint` - Code linting
- `prettier` - Code formatting
- `husky` - Git hooks
- `supertest` - HTTP testing
- `tsc-files` - TypeScript files checker

## 🚀 Deployment

1. Build the project: `pnpm build`
2. Set environment variables (especially `NODE_ENV=production` and `CORS_ORIGIN`)
3. Start the server: `pnpm start`
4. The server will run on the port specified in the `PORT` environment variable (default: 8080)

### Production Considerations

- Set `NODE_ENV=production` for optimized error handling and security
- Configure `CORS_ORIGIN` with your frontend domain(s)
- Consider protecting the `/api-docs` endpoint in production (Swagger UI)
- Ensure HTTPS is configured at the reverse proxy/load balancer level
- Monitor rate limiting and adjust limits based on your traffic patterns

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
