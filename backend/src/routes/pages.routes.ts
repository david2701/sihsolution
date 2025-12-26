import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { pageSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function pagesRoutes(fastify: FastifyInstance) {
    // Get all pages
    fastify.get('/', {
        schema: {
            tags: ['Pages'],
            summary: 'Liste des pages statiques',
            response: { 200: { type: 'array', items: pageSchema } },
        },
    }, async () => {
        return prisma.page.findMany({ orderBy: { order: 'asc' } });
    });

    // Get single page
    fastify.get('/:idOrSlug', {
        schema: {
            tags: ['Pages'],
            summary: 'Détail d\'une page',
            params: { type: 'object', properties: { idOrSlug: { type: 'string' } }, required: ['idOrSlug'] },
            response: { 200: pageSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { idOrSlug } = request.params as { idOrSlug: string };
        const page = await prisma.page.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } });
        if (!page) return reply.status(404).send({ error: 'Page non trouvée' });
        return page;
    });

    // Create page
    fastify.post('/', {
        preHandler: [requirePermission('pages.create')],
        schema: {
            tags: ['Pages'],
            summary: 'Créer une page',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    isActive: { type: 'boolean', default: true },
                    order: { type: 'integer', default: 0 },
                },
            },
            response: { 200: pageSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { title, content, isActive, order } = request.body as any;
        if (!title || !content) return reply.status(400).send({ error: 'Titre et contenu requis' });
        let slug = slugify(title);
        const existing = await prisma.page.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now()}`;
        return prisma.page.create({ data: { title, slug, content, isActive: isActive ?? true, order: order ?? 0 } });
    });

    // Update page
    fastify.put('/:id', {
        preHandler: [requirePermission('pages.update')],
        schema: {
            tags: ['Pages'],
            summary: 'Modifier une page',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    isActive: { type: 'boolean' },
                    order: { type: 'integer' },
                },
            },
            response: { 200: pageSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const page = await prisma.page.findUnique({ where: { id } });
        if (!page) return reply.status(404).send({ error: 'Page non trouvée' });
        const { title, content, isActive, order } = request.body as any;
        const updateData: any = {};
        if (title) {
            updateData.title = title;
            if (title !== page.title) {
                let slug = slugify(title);
                const existing = await prisma.page.findFirst({ where: { slug, id: { not: id } } });
                if (existing) slug = `${slug}-${Date.now()}`;
                updateData.slug = slug;
            }
        }
        if (content !== undefined) updateData.content = content;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (order !== undefined) updateData.order = order;
        return prisma.page.update({ where: { id }, data: updateData });
    });

    // Delete page
    fastify.delete('/:id', {
        preHandler: [requirePermission('pages.delete')],
        schema: {
            tags: ['Pages'],
            summary: 'Supprimer une page',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const page = await prisma.page.findUnique({ where: { id } });
        if (!page) return reply.status(404).send({ error: 'Page non trouvée' });
        await prisma.page.delete({ where: { id } });
        return { success: true };
    });
}
