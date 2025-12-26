import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'path';
import { config } from './config/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import articlesRoutes from './routes/articles.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import pagesRoutes from './routes/pages.routes.js';
import videosRoutes from './routes/videos.routes.js';
import podcastsRoutes from './routes/podcasts.routes.js';
import adsRoutes from './routes/ads.routes.js';
import bannersRoutes from './routes/banners.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import contactRoutes from './routes/contact.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import mediaRoutes from './routes/media.routes.js';
import footerRoutes from './routes/footer.routes.js';
import seoRoutes from './routes/seo.routes.js';
import tagsRoutes from './routes/tags.routes.js';

export async function buildApp() {
    const fastify = Fastify({
        logger: config.nodeEnv === 'development',
    });

    // Register Swagger
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'SIH Solutions CMS API',
                description: 'API complète pour le système de gestion de contenu SIH Solutions',
                version: '1.0.0',
                contact: {
                    name: 'SIH Solutions',
                    email: 'contact@sih-solutions.com',
                },
            },
            servers: [
                { url: 'http://localhost:3001', description: 'Serveur de développement' },
                { url: 'https://api.sih-solutions.com', description: 'Serveur de production' },
            ],
            tags: [
                { name: 'Auth', description: 'Authentification et gestion de session' },
                { name: 'Users', description: 'Gestion des utilisateurs' },
                { name: 'Roles', description: 'Gestion des rôles et permissions' },
                { name: 'Articles', description: 'Gestion des articles' },
                { name: 'Categories', description: 'Gestion des catégories' },
                { name: 'Pages', description: 'Gestion des pages statiques' },
                { name: 'Videos', description: 'Gestion des vidéos' },
                { name: 'Podcasts', description: 'Gestion des podcasts' },
                { name: 'Ads', description: 'Gestion des publicités' },
                { name: 'Banners', description: 'Gestion des bannières' },
                { name: 'Newsletter', description: 'Gestion des abonnés newsletter' },
                { name: 'Contact', description: 'Gestion des messages de contact' },
                { name: 'Settings', description: 'Paramètres du site' },
                { name: 'Media', description: 'Gestion des médias' },
                { name: 'Footer', description: 'Gestion du footer' },
                { name: 'SEO', description: 'Paramètres SEO' },
                { name: 'Tags', description: 'Gestion des tags' },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Token JWT obtenu via /api/auth/login',
                    },
                },
            },
        },
    });

    // Register Swagger UI
    await fastify.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true,
            persistAuthorization: true,
        },
        staticCSP: true,
    });

    // Register CORS
    await fastify.register(cors, {
        origin: [config.frontendUrl, 'http://localhost:3000'],
        credentials: true,
    });

    // Register JWT
    await fastify.register(jwt, {
        secret: config.jwt.secret,
    });

    // Register multipart for file uploads
    await fastify.register(multipart, {
        limits: {
            fileSize: config.upload.maxFileSize,
        },
    });

    // Serve static files (uploads)
    await fastify.register(fastifyStatic, {
        root: path.join(process.cwd(), 'uploads'),
        prefix: '/uploads/',
    });

    // Health check
    fastify.get('/api/health', {
        schema: {
            tags: ['Health'],
            summary: 'Vérifier l\'état de l\'API',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }, async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Register API routes
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(usersRoutes, { prefix: '/api/users' });
    await fastify.register(rolesRoutes, { prefix: '/api/roles' });
    await fastify.register(articlesRoutes, { prefix: '/api/articles' });
    await fastify.register(categoriesRoutes, { prefix: '/api/categories' });
    await fastify.register(pagesRoutes, { prefix: '/api/pages' });
    await fastify.register(videosRoutes, { prefix: '/api/videos' });
    await fastify.register(podcastsRoutes, { prefix: '/api/podcasts' });
    await fastify.register(adsRoutes, { prefix: '/api/ads' });
    await fastify.register(bannersRoutes, { prefix: '/api/banners' });
    await fastify.register(newsletterRoutes, { prefix: '/api/newsletter' });
    await fastify.register(contactRoutes, { prefix: '/api/contact' });
    await fastify.register(settingsRoutes, { prefix: '/api/settings' });
    await fastify.register(mediaRoutes, { prefix: '/api/media' });
    await fastify.register(footerRoutes, { prefix: '/api/footer' });
    await fastify.register(seoRoutes, { prefix: '/api/seo' });
    await fastify.register(tagsRoutes, { prefix: '/api/tags' });

    return fastify;
}
