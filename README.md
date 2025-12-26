# Express TypeScript Starter Kit

A modern, production-ready Express.js starter template with TypeScript, comprehensive testing, and development tooling.

## 🚀 Features

- **TypeScript** - Full TypeScript support with strict configuration
- **Express.js** - Fast, unopinionated web framework
- **Testing** - Jest with unit and integration test configurations
- **Code Quality** - ESLint, Prettier, and Husky for code formatting and linting
- **Development** - Hot reload with TypeScript watch mode
- **Architecture** - Clean MVC structure with controllers, services, and middleware
- **Static Files** - Built-in static file serving

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── env/             # Environment variables
├── middleware/      # Custom middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── app.ts           # Express app configuration
└── index.ts         # Server entry point

__tests__/              # Integration tests
dist/               # Compiled JavaScript output
public/             # Static files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone git@github.com:demirtasdurmus/express-starter.git
cd express-starter

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

## 📜 Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build TypeScript to JavaScript           |
| `npm start`             | Start production server                  |
| `npm test`              | Run unit tests                           |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run test:int`      | Run integration tests                    |
| `npm run lint`          | Lint and fix code                        |
| `npm run format:write`  | Format code with Prettier                |
| `npm run clean`         | Clean build artifacts                    |

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and routes
- **Coverage Reports**: Track test coverage

```bash
# Run all tests
npm test

# Run integration tests
npm run test:int

# Generate coverage report
npm run test:coverage
```

## 🏗️ Development

### Adding New Routes

1. Create a controller in `src/controllers/`
2. Create a service in `src/services/` (if needed)
3. Define routes in `src/routes/`
4. Import and use in `src/app.ts`

### Example API Endpoint

The starter includes a sample endpoint at `/api/samples` that demonstrates the MVC pattern.

## 🔧 Configuration

- **TypeScript**: Configured in `tsconfig.json` with strict settings
- **ESLint**: Code linting rules in `eslint.config.mts`
- **Prettier**: Code formatting in `.prettierrc`
- **Jest**: Testing configuration in `jest.config.ts`

## 📦 Dependencies

### Production

- `express` - Web framework
- `zod` - Data validation

### Development

- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `eslint` - Code linting
- `prettier` - Code formatting
- `husky` - Git hooks
- `supertest` - HTTP testing

## 🚀 Deployment

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. The server will run on the port specified in the `PORT` environment variable (default: 3000)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
