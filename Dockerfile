# Vectorr — Node.js backend for Coolify deployment
# Multi-stage build: compile TypeScript, bundle dependencies, run Next.js

FROM node:20-alpine AS base
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# ============================================================================
# Stage 1: Dependencies (cached layer)
# ============================================================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ============================================================================
# Stage 2: Builder (compile TypeScript, build Next.js)
# ============================================================================
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ============================================================================
# Stage 3: Runtime (minimal production image)
# ============================================================================
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy compiled app and dependencies from builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/schema.sql ./schema.sql

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

# Expose port (Coolify default)
EXPOSE 3000

# Health check (using curl to avoid DNS resolution issues with localhost)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
