import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { bannerSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function bannersRoutes(fastify: FastifyInstance) {
    // Get all banners
    fastify.get('/', {
        schema: {
            tags: ['Banners'],
            summary: 'Liste des bannières',
            querystring: {
                type: 'object',
                properties: { isActive: { type: 'string', enum: ['true', 'false'] } },
            },
            response: { 200: { type: 'array', items: bannerSchema } },
        },
    }, async (request) => {
        const { isActive } = request.query as any;
        const where: any = {};
        if (isActive !== undefined) where.isActive = isActive === 'true';
        return prisma.banner.findMany({ where, orderBy: { order: 'asc' } });
    });

    // Create banner
    fastify.post('/', {
        preHandler: [requirePermission('banners.create')],
        schema: {
            tags: ['Banners'],
            summary: 'Créer une bannière',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'imageUrl'],
                properties: {
                    title: { type: 'string' },
                    subtitle: { type: 'string', nullable: true },
                    imageUrl: { type: 'string' },
                    linkUrl: { type: 'string', nullable: true },
                    order: { type: 'integer', default: 0 },
                    isActive: { type: 'boolean', default: true },
                },
            },
            response: { 200: bannerSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const data = request.body as any;
        if (!data.title || !data.imageUrl) return reply.status(400).send({ error: 'Titre et image requis' });
        return prisma.banner.create({ data: { ...data, isActive: data.isActive ?? true, order: data.order ?? 0 } });
    });

    // Update banner
    fastify.put('/:id', {
        preHandler: [requirePermission('banners.update')],
        schema: {
            tags: ['Banners'],
            summary: 'Modifier une bannière',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    subtitle: { type: 'string', nullable: true },
                    imageUrl: { type: 'string' },
                    linkUrl: { type: 'string', nullable: true },
                    order: { type: 'integer' },
                    isActive: { type: 'boolean' },
                },
            },
            response: { 200: bannerSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const banner = await prisma.banner.findUnique({ where: { id } });
        if (!banner) return reply.status(404).send({ error: 'Bannière non trouvée' });
        return prisma.banner.update({ where: { id }, data: request.body as any });
    });

    // Reorder banners
    fastify.put('/reorder', {
        preHandler: [requirePermission('banners.update')],
        schema: {
            tags: ['Banners'],
            summary: 'Réordonner les bannières',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['orders'],
                properties: {
                    orders: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: { id: { type: 'string' }, order: { type: 'integer' } },
                        },
                    },
                },
            },
            response: { 200: successSchema },
        },
    }, async (request) => {
        const { orders } = request.body as { orders: { id: string; order: number }[] };
        await Promise.all(orders.map(o => prisma.banner.update({ where: { id: o.id }, data: { order: o.order } })));
        return { success: true };
    });

    // Delete banner
    fastify.delete('/:id', {
        preHandler: [requirePermission('banners.delete')],
        schema: {
            tags: ['Banners'],
            summary: 'Supprimer une bannière',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const banner = await prisma.banner.findUnique({ where: { id } });
        if (!banner) return reply.status(404).send({ error: 'Bannière non trouvée' });
        await prisma.banner.delete({ where: { id } });
        return { success: true };
    });
}
