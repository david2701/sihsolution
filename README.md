# SIH Solutions CMS

Sistema de gestión de contenido completo con backend API (Fastify), frontend (Next.js) y panel de administración.

## 🚀 Instalación Rápida

```bash
# Clonar e instalar
git clone https://github.com/david2701/sihsolution.git
cd sihsolution
chmod +x install.sh
./install.sh
```

## 🛠️ Requisitos

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (incluido en Docker)

## 📁 Estructura

```
├── backend/          # API Fastify + Prisma
├── frontend/         # Next.js 15
├── docker-compose.yml
└── install.sh
```

## 🔑 Accesos

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:3000 | - |
| Admin | http://localhost:3000/admin | admin@sihsolutions.com / Admin123! |
| API Docs | http://localhost:3001/docs | - |

## 📚 API Endpoints

- `/api/auth` - Autenticación
- `/api/articles` - Artículos
- `/api/categories` - Categorías
- `/api/videos` - Videos
- `/api/podcasts` - Podcasts
- `/api/media` - Medios
- `/api/settings` - Configuración
- `/api/newsletter` - Newsletter
- `/api/contact` - Contacto

## 🐳 Docker

```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 Licencia

MIT
