#!/bin/bash

# =============================================================================
# SIH Solutions CMS - Docker Installation Script
# =============================================================================
# Only requires: Docker & Docker Compose
# Usage: ./install.sh
# =============================================================================

set -e

# Enable verbose logging
set -x

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           SIH Solutions CMS - Docker Installation              ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "=== Starting installation ==="

# Check Docker
log "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is required but not installed.${NC}"
    echo "Install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
docker --version
echo -e "${GREEN}✓ Docker found${NC}"

# Detect docker compose command (v1 vs v2)
log "Checking Docker Compose..."
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}❌ Docker Compose is required but not installed.${NC}"
    exit 1
fi
$COMPOSE_CMD version
echo -e "${GREEN}✓ Docker Compose found (using: $COMPOSE_CMD)${NC}"

# Clone if needed
if [ ! -f "docker-compose.yml" ]; then
    log "Cloning repository..."
    git clone https://github.com/david2701/sihsolution.git
    cd sihsolution
fi

# Setup environment files
log "Setting up environment files..."

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

# Check disk space
log "Checking disk space..."
df -h

# Check memory
log "Checking memory..."
free -h || cat /proc/meminfo | head -5

# Check network connectivity to npm registry
log "Checking npm registry connectivity..."
curl -I https://registry.npmjs.org/ 2>&1 | head -5

# Clean Docker cache
log "Cleaning Docker build cache..."
docker builder prune -f || true

# Build and start with Docker Compose
log "Building containers (this may take several minutes)..."
$COMPOSE_CMD -f docker-compose.prod.yml build --no-cache --progress=plain 2>&1 | tee build.log

log "Starting containers..."
$COMPOSE_CMD -f docker-compose.prod.yml up -d

# Wait for services
log "Waiting for services to start (15s)..."
sleep 15

# Check container status
log "Checking container status..."
docker ps -a

# Check container logs
log "Checking container logs..."
$COMPOSE_CMD -f docker-compose.prod.yml logs --tail=50

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
echo "  Build log:  cat build.log"
echo ""

log "=== Installation script finished ==="
