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
    ls -la node_modules/ | head -10

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
