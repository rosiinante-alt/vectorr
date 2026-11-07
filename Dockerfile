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

# `next build` collects page data, which imports server modules that throw when
# their configuration is missing. The real values arrive at runtime through the
# container environment; these build-time placeholders only satisfy module load.
ARG NEXT_PUBLIC_SUPABASE_URL="https://build.invalid"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="build-placeholder"
ARG NEXT_PUBLIC_SITE_URL="https://vectroy.com"
ARG POLAR_ACCESS_TOKEN="build-placeholder"
ARG POLAR_SERVER="production"
ARG SUPABASE_SERVICE_ROLE_KEY="build-placeholder"
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    POLAR_ACCESS_TOKEN=$POLAR_ACCESS_TOKEN \
    POLAR_SERVER=$POLAR_SERVER \
    SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

RUN npm run build

# ============================================================================
# Stage 3: Runtime (minimal production image)
# ============================================================================
FROM node:20-alpine

WORKDIR /app

# Install dumb-init and wget for health checks
RUN apk add --no-cache dumb-init wget

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

# Health check (use container's internal IP or hostname)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 node server.js"]
