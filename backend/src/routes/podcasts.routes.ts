import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { podcastSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function podcastsRoutes(fastify: FastifyInstance) {
    // Get all podcasts
    fastify.get('/', {
        schema: {
            tags: ['Podcasts'],
            summary: 'Liste des podcasts',
            querystring: {
                type: 'object',
                properties: {
                    isActive: { type: 'string', enum: ['true', 'false'] },
                    limit: { type: 'integer', default: 20 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        podcasts: { type: 'array', items: podcastSchema },
                    },
                },
            },
        },
    }, async (request) => {
        const { isActive, limit = '20' } = request.query as any;
        const where: any = {};
        if (isActive !== undefined) where.isActive = isActive === 'true';
        const podcasts = await prisma.podcast.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
        });
        return { podcasts };
    });

    // Get single podcast
    fastify.get('/:id', {
        schema: {
            tags: ['Podcasts'],
            summary: 'Détail d\'un podcast',
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: podcastSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const podcast = await prisma.podcast.findUnique({ where: { id } });
        if (!podcast) return reply.status(404).send({ error: 'Podcast non trouvé' });
        return podcast;
    });

    // Create podcast
    fastify.post('/', {
        preHandler: [requirePermission('podcasts.create')],
        schema: {
            tags: ['Podcasts'],
            summary: 'Créer un podcast',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'embedCode'],
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    embedCode: { type: 'string', description: 'Code embed Spotify/Apple Podcasts' },
                    coverImage: { type: 'string', nullable: true },
                    duration: { type: 'integer', nullable: true, description: 'Durée en secondes' },
                    isActive: { type: 'boolean', default: true },
                    order: { type: 'integer', default: 0 },
                },
            },
            response: { 200: podcastSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { title, description, embedCode, coverImage, duration, isActive, order } = request.body as any;
        if (!title || !embedCode) return reply.status(400).send({ error: 'Titre et code embed requis' });
        return prisma.podcast.create({
            data: { title, description, embedCode, coverImage, duration, isActive: isActive ?? true },
        });
    });

    // Update podcast
    fastify.put('/:id', {
        preHandler: [requirePermission('podcasts.update')],
        schema: {
            tags: ['Podcasts'],
            summary: 'Modifier un podcast',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    embedCode: { type: 'string' },
                    coverImage: { type: 'string', nullable: true },
                    duration: { type: 'integer', nullable: true },
                    isActive: { type: 'boolean' },
                    order: { type: 'integer' },
                },
            },
            response: { 200: podcastSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const data = request.body as any;
        const podcast = await prisma.podcast.findUnique({ where: { id } });
        if (!podcast) return reply.status(404).send({ error: 'Podcast non trouvé' });
        return prisma.podcast.update({ where: { id }, data });
    });

    // Delete podcast
    fastify.delete('/:id', {
        preHandler: [requirePermission('podcasts.delete')],
        schema: {
            tags: ['Podcasts'],
            summary: 'Supprimer un podcast',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const podcast = await prisma.podcast.findUnique({ where: { id } });
        if (!podcast) return reply.status(404).send({ error: 'Podcast non trouvé' });
        await prisma.podcast.delete({ where: { id } });
        return { success: true };
    });
}
