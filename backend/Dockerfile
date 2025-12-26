FROM node:20-alpine AS builder

WORKDIR /app

# Set npm registry to public
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Set npm registry to public
RUN npm config set registry https://registry.npmjs.org/

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --only=production

# Copy prisma and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/index.js"]
