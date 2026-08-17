# 1. Base Image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# 2. Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm config set fetch-retries 5 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 120000 && (npm ci || npm install)

# 3. Rebuild source code & Prisma Client
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_BASE_PATH=""
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH}
RUN npx prisma generate
ENV NODE_ENV=production
RUN npm run build

# 4. Production Runner Stage
FROM base AS runner
ENV NODE_ENV=production
ARG PORT=5173
ENV PORT=${PORT}

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
RUN mkdir -p ./public/uploads
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/app ./app
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN sed -i '1s/^\xEF\xBB\xBF//; s/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]

# 5. Development Stage (fallback for docker-compose dev)
FROM base AS development
ENV NODE_ENV=development
ARG PORT=5173
ENV PORT=${PORT}
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN sed -i '1s/^\xEF\xBB\xBF//; s/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh
EXPOSE ${PORT}
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
