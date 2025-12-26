FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Use yarn with node-modules linker (not PnP)
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy yarn config and package files
COPY .yarnrc.yml ./
COPY package.json package-lock.json ./

RUN echo "=== Installing with yarn ===" && \
    yarn install && \
    echo "=== node_modules installed ==="

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

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl libc6-compat

# Copy everything from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

RUN mkdir -p uploads

EXPOSE 3001

CMD ["./entrypoint.sh"]
