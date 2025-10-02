# -----------------------------
# Builder stage
# -----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# App source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# --- Build-time envs (safe defaults). Compose can override with real values.
ARG KINDE_ISSUER_URL=dummy
ARG KINDE_CLIENT_ID=dummy
ARG KINDE_CLIENT_SECRET=dummy
ARG KINDE_SITE_URL=dummy
ARG RESEND_API_KEY=dummy
ARG OPENAI_API_KEY=dummy
ARG INNGEST_EVENT_KEY=dummy
ARG INNGEST_SIGNING_KEY=dummy
ARG NEWS_API_KEY=dummy

ENV KINDE_ISSUER_URL=$KINDE_ISSUER_URL
ENV KINDE_CLIENT_ID=$KINDE_CLIENT_ID
ENV KINDE_CLIENT_SECRET=$KINDE_CLIENT_SECRET
ENV KINDE_SITE_URL=$KINDE_SITE_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV INNGEST_EVENT_KEY=$INNGEST_EVENT_KEY
ENV INNGEST_SIGNING_KEY=$INNGEST_SIGNING_KEY
ENV NEWS_API_KEY=$NEWS_API_KEY

# Build Next.js (standalone output requires next.config output:"standalone")
RUN npm run build

# -----------------------------
# Runner stage
# -----------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone server and assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
