########################################################
# Build stage
########################################################
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts

RUN NODE_ENV=production pnpm build

########################################################
# Production stage
########################################################
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

RUN npm config set update-notifier false
RUN npm install -g pm2@6

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/locales ./locales
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

CMD ["pm2-runtime", "start", "dist/index.js", "--name", "express-starter-template"]