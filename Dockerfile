########################################################
# Build stage
########################################################
FROM node:22-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy source files
COPY . .

# Install dependencies (skip scripts to avoid husky)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build the application (set NODE_ENV for minification)
RUN NODE_ENV=production pnpm build

########################################################
# Production stage
########################################################
FROM node:22-alpine

# Enable corepack for pnpm (for project dependencies)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install PM2 globally using npm (simpler for global packages)
RUN npm config set update-notifier false
RUN npm install -g pm2

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copy built application from builder stage and locales and public files
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/locales ./locales
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

# Switch to non-root user
USER nodejs

# Start application with PM2
CMD ["pm2-runtime", "start", "dist/index.js", "--name", "express-starter-template"]