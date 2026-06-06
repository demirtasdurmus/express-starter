########################################################
# Build stage
# Keep Corepack's pnpm version aligned with package.json "packageManager".
########################################################
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /app

COPY . .

RUN npm config set update-notifier false
RUN pnpm install --frozen-lockfile

RUN MINIFY_ASSETS=true pnpm build

########################################################
# Production stage
########################################################
FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

RUN npm config set update-notifier false
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/locales ./locales
COPY --from=builder --chown=nodejs:nodejs /app/public ./public

USER nodejs

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
