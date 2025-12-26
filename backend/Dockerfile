FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with verbose logging
COPY package.json package-lock.json ./
RUN echo "=== Installing dependencies ===" && \
    npm install --legacy-peer-deps && \
    echo "=== Verifying node_modules ===" && \
    ls -la node_modules/.bin/ | head -20 && \
    echo "=== Prisma version ===" && \
    ./node_modules/.bin/prisma --version

# Copy source code
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client
RUN echo "=== Generating Prisma client ===" && \
    ./node_modules/.bin/prisma generate

# Build TypeScript
RUN echo "=== Building TypeScript ===" && \
    npm run build

# Production image - COPY from builder instead of reinstalling
FROM node:20-alpine

WORKDIR /app

# Copy EVERYTHING from builder (node_modules included with generated prisma client)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
