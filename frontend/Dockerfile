FROM node:20-alpine AS builder

WORKDIR /app

# Use yarn instead of npm (npm has bugs on Alpine)
RUN corepack enable && corepack prepare yarn@stable --activate

# Install dependencies
COPY package.json package-lock.json ./
RUN echo "=== Installing with yarn ===" && \
    yarn install && \
    echo "=== node_modules installed ===" && \
    ls node_modules/.bin/ | head -10

# Copy source code
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./

# Build the application
RUN echo "=== Building Next.js ===" && \
    yarn build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
