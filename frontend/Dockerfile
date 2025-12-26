FROM node:20-alpine AS builder

WORKDIR /app

# Use yarn with node-modules linker (not PnP)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy yarn config and package files
COPY .yarnrc.yml ./
COPY package.json package-lock.json ./

RUN echo "=== Installing with yarn (node-modules mode) ===" && \
    yarn install && \
    echo "=== Checking node_modules ===" && \
    ls -la node_modules/ | head -10 && \
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
