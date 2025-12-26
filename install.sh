#!/bin/bash

# =============================================================================
# SIH Solutions CMS - Installation Script
# =============================================================================
# Usage: curl -fsSL https://raw.githubusercontent.com/david2701/sihsolution/main/install.sh | bash
# Or: ./install.sh
# =============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           SIH Solutions CMS - Installation                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check requirements
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is required but not installed.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $1 found${NC}"
}

echo ""
echo "📋 Checking requirements..."
check_command node
check_command npm
check_command docker
check_command docker-compose

# Clone if not in the directory
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    echo ""
    echo "📥 Cloning repository..."
    git clone https://github.com/david2701/sihsolution.git
    cd sihsolution
fi

# Setup environment files
echo ""
echo "🔧 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env 2>/dev/null || echo "POSTGRES_PASSWORD=sih_secure_password_2024" > .env
    echo -e "${GREEN}✓ Created .env${NC}"
fi

# Start PostgreSQL with Docker
echo ""
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres
sleep 5

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client
echo ""
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo ""
echo "🗄️ Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init

# Seed the database
echo ""
echo "🌱 Seeding database..."
npx prisma db seed

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build frontend
echo ""
echo "🏗️ Building frontend..."
cd frontend
npm run build
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Installation Complete!                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}To start the application:${NC}"
echo ""
echo "  1. Start backend:  cd backend && npm run dev"
echo "  2. Start frontend: cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}Or use Docker:${NC}"
echo ""
echo "  docker-compose up -d"
echo ""
echo -e "${GREEN}Access:${NC}"
echo "  🌐 Frontend:    http://localhost:3000"
echo "  🔧 Admin Panel: http://localhost:3000/admin"
echo "  📚 API Docs:    http://localhost:3001/docs"
echo ""
echo -e "${YELLOW}Admin Credentials:${NC}"
echo "  📧 Email:    admin@sihsolutions.com"
echo "  🔑 Password: Admin123!"
echo ""
