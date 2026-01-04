# Build stage
FROM node:22-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine

# Install PM2 globally
RUN npm install -g pm2

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy locales directory for i18n
COPY --from=builder --chown=nodejs:nodejs /app/locales ./locales

# Copy public directory for static assets
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Copy .env.example as reference (actual .env should be mounted or provided via env vars)
COPY --chown=nodejs:nodejs .env.example ./

# Switch to non-root user
USER nodejs

# Expose port (default Express port, adjust if needed)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application with PM2
CMD ["pm2-runtime", "start", "dist/index.js", "--name", "express-app"]
