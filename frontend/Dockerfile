FROM node:20-alpine AS builder

WORKDIR /app

# Set npm registry explicitly
RUN npm config set registry https://registry.npmjs.org/

# Copy package files first
COPY package.json package-lock.json ./

# Install ALL dependencies
RUN npm install

# Copy source code individually (NOT node_modules)
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./

# Build the application
RUN npm run build

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
