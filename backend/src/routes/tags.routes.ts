import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { tagSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function tagsRoutes(fastify: FastifyInstance) {
    // Get all tags
    fastify.get('/', {
        schema: {
            tags: ['Tags'],
            summary: 'Liste des tags',
            response: {
                200: { type: 'array', items: tagSchema },
            },
        },
    }, async () => {
        return prisma.tag.findMany({
            include: { _count: { select: { articles: true } } },
            orderBy: { name: 'asc' },
        });
    });

    // Get single tag
    fastify.get('/:idOrSlug', {
        schema: {
            tags: ['Tags'],
            summary: 'Détail d\'un tag',
            params: { type: 'object', properties: { idOrSlug: { type: 'string' } }, required: ['idOrSlug'] },
            response: { 200: tagSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { idOrSlug } = request.params as { idOrSlug: string };
        const tag = await prisma.tag.findFirst({
            where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
            include: { _count: { select: { articles: true } } },
        });
        if (!tag) return reply.status(404).send({ error: 'Tag non trouvé' });
        return tag;
    });

    // Create tag
    fastify.post('/', {
        preHandler: [requirePermission('tags.create')],
        schema: {
            tags: ['Tags'],
            summary: 'Créer un tag',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name'],
                properties: { name: { type: 'string' } },
            },
            response: { 200: tagSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { name } = request.body as { name: string };
        if (!name) return reply.status(400).send({ error: 'Nom requis' });
        let slug = slugify(name);
        const existing = await prisma.tag.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now()}`;
        return prisma.tag.create({
            data: { name, slug },
            include: { _count: { select: { articles: true } } },
        });
    });

    // Update tag
    fastify.put('/:id', {
        preHandler: [requirePermission('tags.update')],
        schema: {
            tags: ['Tags'],
            summary: 'Modifier un tag',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: { name: { type: 'string' } },
            },
            response: { 200: tagSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { name } = request.body as { name?: string };
        const tag = await prisma.tag.findUnique({ where: { id } });
        if (!tag) return reply.status(404).send({ error: 'Tag non trouvé' });
        const updateData: any = {};
        if (name) {
            updateData.name = name;
            if (name !== tag.name) {
                let slug = slugify(name);
                const existing = await prisma.tag.findFirst({ where: { slug, id: { not: id } } });
                if (existing) slug = `${slug}-${Date.now()}`;
                updateData.slug = slug;
            }
        }
        return prisma.tag.update({
            where: { id },
            data: updateData,
            include: { _count: { select: { articles: true } } },
        });
    });

    // Delete tag
    fastify.delete('/:id', {
        preHandler: [requirePermission('tags.delete')],
        schema: {
            tags: ['Tags'],
            summary: 'Supprimer un tag',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const tag = await prisma.tag.findUnique({ where: { id } });
        if (!tag) return reply.status(404).send({ error: 'Tag non trouvé' });
        await prisma.tag.delete({ where: { id } });
        return { success: true };
    });
}
