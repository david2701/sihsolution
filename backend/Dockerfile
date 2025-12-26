FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including dev)
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client
RUN npm run db:generate

# Build TypeScript
RUN npm run build

# Production image - install everything to avoid issues
FROM node:20-alpine

WORKDIR /app

# Install ALL dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy prisma and generate client
COPY prisma ./prisma
RUN npm run db:generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
