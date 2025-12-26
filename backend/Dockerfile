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
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client
RUN echo "=== Generating Prisma ===" && \
    yarn prisma generate

# Build TypeScript
RUN echo "=== Building ===" && \
    yarn build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
