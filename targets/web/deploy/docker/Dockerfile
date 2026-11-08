# __Product__ web — production image: the Next.js standalone server (apps/web). Built by App Platform from deploy/digitalocean/app.yaml.
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS base
# The distribution's security fixes land between two digest bumps of the base image (CVE-2026-85091, zlib, krizaka-internal#2773).
RUN apk upgrade --no-cache && apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

# 1. Dependencies, from the lockfile only
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile --ignore-scripts

# 2. Build
FROM base AS builder
COPY --from=deps /app ./
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production
# Settings inlined or read at build (App Platform passes them as build arguments): the commit shown as the version, and
# whether search engines may index the deployment (off on every dev one).
ARG APP_COMMIT_SHA
ARG APP_SEARCH_INDEXING
ENV APP_COMMIT_SHA=$APP_COMMIT_SHA APP_SEARCH_INDEXING=$APP_SEARCH_INDEXING
RUN pnpm --filter @__PRODUCT__/web build

# 3. Run
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS runner
# The shipped image takes the distribution's security fixes too (krizaka-internal#2773).
RUN apk upgrade --no-cache
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider "http://localhost:3000/api/healthz" || exit 1
CMD ["node", "apps/web/server.js"]
