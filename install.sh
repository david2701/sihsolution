#!/bin/bash

# =============================================================================
# SIH Solutions CMS - Docker Installation Script
# =============================================================================
# Only requires: Docker & Docker Compose
# Usage: ./install.sh
# =============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           SIH Solutions CMS - Docker Installation              ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is required but not installed.${NC}"
    echo "Install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

# Detect docker compose command (v1 vs v2)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}❌ Docker Compose is required but not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose found (using: $COMPOSE_CMD)${NC}"

# Clone if needed
if [ ! -f "docker-compose.yml" ]; then
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
    cat > .env << 'EOF'
POSTGRES_USER=sih_user
POSTGRES_PASSWORD=sih_secure_password_2024
POSTGRES_DB=sih_cms
JWT_SECRET=super_secret_jwt_key_change_in_production_2024
API_URL=http://api:3001
FRONTEND_URL=http://localhost:8080
ADMIN_EMAIL=admin@sihsolutions.com
ADMIN_PASSWORD=Admin123!
EOF
    echo -e "${GREEN}✓ Created .env${NC}"
fi

# Build and start with Docker Compose
echo ""
echo "🐳 Building and starting containers..."
echo "   This may take a few minutes on first run..."
echo ""

$COMPOSE_CMD -f docker-compose.prod.yml up -d --build

# Wait for services
echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_IP")

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Installation Complete!                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Your CMS is now running!${NC}"
echo ""
echo -e "${GREEN}Access:${NC}"
echo "  🌐 Frontend:    http://${SERVER_IP}:8080"
echo "  🔧 Admin Panel: http://${SERVER_IP}:8080/admin"
echo ""
echo -e "${YELLOW}Admin Credentials:${NC}"
echo "  📧 Email:    admin@sihsolutions.com"
echo "  🔑 Password: Admin123!"
echo ""
echo -e "${YELLOW}Commands:${NC}"
echo "  View logs:  $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo "  Stop:       $COMPOSE_CMD -f docker-compose.prod.yml down"
echo "  Restart:    $COMPOSE_CMD -f docker-compose.prod.yml restart"
echo ""
