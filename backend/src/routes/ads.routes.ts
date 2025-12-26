import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { adSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function adsRoutes(fastify: FastifyInstance) {
    // Get all ads
    fastify.get('/', {
        schema: {
            tags: ['Ads'],
            summary: 'Liste des publicités',
            querystring: {
                type: 'object',
                properties: {
                    position: { type: 'string', description: 'Filtrer par position' },
                    isActive: { type: 'string', enum: ['true', 'false'] },
                },
            },
            response: { 200: { type: 'array', items: adSchema } },
        },
    }, async (request) => {
        const { position, isActive } = request.query as any;
        const where: any = {};
        if (position) where.position = position;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        return prisma.ad.findMany({ where, orderBy: { createdAt: 'desc' } });
    });

    // Get single ad
    fastify.get('/:id', {
        schema: {
            tags: ['Ads'],
            summary: 'Détail d\'une publicité',
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: adSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const ad = await prisma.ad.findUnique({ where: { id } });
        if (!ad) return reply.status(404).send({ error: 'Publicité non trouvée' });
        return ad;
    });

    // Create ad
    fastify.post('/', {
        preHandler: [requirePermission('ads.create')],
        schema: {
            tags: ['Ads'],
            summary: 'Créer une publicité',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name', 'position'],
                properties: {
                    name: { type: 'string' },
                    position: { type: 'string', description: 'header, sidebar, footer, banner, inline' },
                    imageUrl: { type: 'string', nullable: true },
                    htmlCode: { type: 'string', nullable: true },
                    linkUrl: { type: 'string', nullable: true },
                    isActive: { type: 'boolean', default: true },
                    startDate: { type: 'string', format: 'date-time', nullable: true },
                    endDate: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            response: { 200: adSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const data = request.body as any;
        if (!data.name || !data.position) return reply.status(400).send({ error: 'Nom et position requis' });
        return prisma.ad.create({
            data: {
                ...data,
                isActive: data.isActive ?? true,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    });

    // Update ad
    fastify.put('/:id', {
        preHandler: [requirePermission('ads.update')],
        schema: {
            tags: ['Ads'],
            summary: 'Modifier une publicité',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    position: { type: 'string' },
                    imageUrl: { type: 'string', nullable: true },
                    htmlCode: { type: 'string', nullable: true },
                    linkUrl: { type: 'string', nullable: true },
                    isActive: { type: 'boolean' },
                    startDate: { type: 'string', format: 'date-time', nullable: true },
                    endDate: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            response: { 200: adSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const ad = await prisma.ad.findUnique({ where: { id } });
        if (!ad) return reply.status(404).send({ error: 'Publicité non trouvée' });
        const data = request.body as any;
        return prisma.ad.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    });

    // Delete ad
    fastify.delete('/:id', {
        preHandler: [requirePermission('ads.delete')],
        schema: {
            tags: ['Ads'],
            summary: 'Supprimer une publicité',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const ad = await prisma.ad.findUnique({ where: { id } });
        if (!ad) return reply.status(404).send({ error: 'Publicité non trouvée' });
        await prisma.ad.delete({ where: { id } });
        return { success: true };
    });
}
