FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --ignore-scripts

COPY . .

FROM node:20-alpine

RUN apk add --no-cache tini

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/src ./src
COPY --from=builder /app/migrations ./migrations

RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "src/app.js"]
