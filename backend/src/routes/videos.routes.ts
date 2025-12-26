import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { videoSchema, errorSchema, successSchema, paginationSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function videosRoutes(fastify: FastifyInstance) {
    // Get all videos
    fastify.get('/', {
        schema: {
            tags: ['Videos'],
            summary: 'Liste des vidéos',
            description: 'Récupère toutes les vidéos avec filtres optionnels',
            querystring: {
                type: 'object',
                properties: {
                    isActive: { type: 'string', enum: ['true', 'false'] },
                    isFeatured: { type: 'string', enum: ['true', 'false'] },
                    categoryId: { type: 'string', format: 'uuid' },
                    limit: { type: 'integer', default: 20 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        videos: { type: 'array', items: videoSchema },
                    },
                },
            },
        },
    }, async (request) => {
        const { isActive, isFeatured, categoryId, limit = '20' } = request.query as any;
        const where: any = {};
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
        if (categoryId) where.categoryId = categoryId;

        const videos = await prisma.video.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
        });
        return { videos };
    });

    // Get single video
    fastify.get('/:id', {
        schema: {
            tags: ['Videos'],
            summary: 'Détail d\'une vidéo',
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: videoSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const video = await prisma.video.findUnique({ where: { id }, include: { category: true } });
        if (!video) return reply.status(404).send({ error: 'Vidéo non trouvée' });
        return video;
    });

    // Create video
    fastify.post('/', {
        preHandler: [requirePermission('videos.create')],
        schema: {
            tags: ['Videos'],
            summary: 'Créer une vidéo',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'embedCode'],
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    embedCode: { type: 'string', description: 'Code embed YouTube/Vimeo' },
                    thumbnail: { type: 'string', nullable: true },
                    categoryId: { type: 'string', format: 'uuid', nullable: true },
                    isFeatured: { type: 'boolean', default: false },
                    isActive: { type: 'boolean', default: true },
                    order: { type: 'integer', default: 0 },
                },
            },
            response: { 200: videoSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { title, description, embedCode, thumbnail, categoryId, isFeatured, isActive, order } = request.body as any;
        if (!title || !embedCode) return reply.status(400).send({ error: 'Titre et code embed requis' });
        return prisma.video.create({
            data: { title, description, embedCode, thumbnail, categoryId, isFeatured: isFeatured ?? false, isActive: isActive ?? true },
            include: { category: true },
        });
    });

    // Update video
    fastify.put('/:id', {
        preHandler: [requirePermission('videos.update')],
        schema: {
            tags: ['Videos'],
            summary: 'Modifier une vidéo',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    embedCode: { type: 'string' },
                    thumbnail: { type: 'string', nullable: true },
                    categoryId: { type: 'string', format: 'uuid', nullable: true },
                    isFeatured: { type: 'boolean' },
                    isActive: { type: 'boolean' },
                    order: { type: 'integer' },
                },
            },
            response: { 200: videoSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const data = request.body as any;
        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return reply.status(404).send({ error: 'Vidéo non trouvée' });
        return prisma.video.update({ where: { id }, data, include: { category: true } });
    });

    // Delete video
    fastify.delete('/:id', {
        preHandler: [requirePermission('videos.delete')],
        schema: {
            tags: ['Videos'],
            summary: 'Supprimer une vidéo',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return reply.status(404).send({ error: 'Vidéo non trouvée' });
        await prisma.video.delete({ where: { id } });
        return { success: true };
    });
}
