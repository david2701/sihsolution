FROM node:20-alpine AS builder

WORKDIR /app

# Copy npmrc for registry config
COPY .npmrc ./

# Copy package files first
COPY package.json package-lock.json ./

# Install ALL dependencies (using ci for cleaner installs in Docker)
RUN npm ci

# Verify next is installed
RUN ls -la node_modules/.bin/ && which npx && npx next --version

# Copy source code individually (NOT node_modules)
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./

# Build the application (using npx to avoid PATH issues)
RUN npx next build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
