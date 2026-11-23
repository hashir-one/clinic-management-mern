# Stage 1: Dependencies
FROM docker.io/library/node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production Runner
FROM docker.io/library/node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: run under unprivileged node user
USER node

# Copy dependencies and source code
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
