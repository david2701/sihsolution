import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { categorySchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function categoriesRoutes(fastify: FastifyInstance) {
    // Get all categories
    fastify.get('/', {
        schema: {
            tags: ['Categories'],
            summary: 'Liste des catégories',
            description: 'Récupère toutes les catégories avec le nombre d\'articles',
            response: {
                200: { type: 'array', items: categorySchema },
            },
        },
    }, async () => {
        return prisma.category.findMany({
            orderBy: { order: 'asc' },
            include: { _count: { select: { articles: true, videos: true } } },
        });
    });

    // Get single category
    fastify.get('/:idOrSlug', {
        schema: {
            tags: ['Categories'],
            summary: 'Détail d\'une catégorie',
            params: {
                type: 'object',
                properties: { idOrSlug: { type: 'string' } },
                required: ['idOrSlug'],
            },
            response: { 200: categorySchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { idOrSlug } = request.params as { idOrSlug: string };
        const category = await prisma.category.findFirst({
            where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
            include: { _count: { select: { articles: true, videos: true } } },
        });
        if (!category) return reply.status(404).send({ error: 'Catégorie non trouvée' });
        return category;
    });

    // Create category
    fastify.post('/', {
        preHandler: [requirePermission('categories.create')],
        schema: {
            tags: ['Categories'],
            summary: 'Créer une catégorie',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    image: { type: 'string', nullable: true },
                    isActive: { type: 'boolean', default: true },
                    order: { type: 'integer', default: 0 },
                },
            },
            response: { 200: categorySchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { name, description, image, isActive, order } = request.body as any;
        let slug = slugify(name);
        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) slug = `${slug}-${Date.now()}`;
        return prisma.category.create({
            data: { name, slug, description, image, isActive: isActive ?? true, order: order ?? 0 },
            include: { _count: { select: { articles: true, videos: true } } },
        });
    });

    // Update category
    fastify.put('/:id', {
        preHandler: [requirePermission('categories.update')],
        schema: {
            tags: ['Categories'],
            summary: 'Modifier une catégorie',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    image: { type: 'string', nullable: true },
                    isActive: { type: 'boolean' },
                    order: { type: 'integer' },
                },
            },
            response: { 200: categorySchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { name, description, image, isActive, order } = request.body as any;
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) return reply.status(404).send({ error: 'Catégorie non trouvée' });

        const updateData: any = {};
        if (name) {
            updateData.name = name;
            if (name !== category.name) {
                let slug = slugify(name);
                const existing = await prisma.category.findFirst({ where: { slug, id: { not: id } } });
                if (existing) slug = `${slug}-${Date.now()}`;
                updateData.slug = slug;
            }
        }
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (order !== undefined) updateData.order = order;

        return prisma.category.update({
            where: { id },
            data: updateData,
            include: { _count: { select: { articles: true, videos: true } } },
        });
    });

    // Delete category
    fastify.delete('/:id', {
        preHandler: [requirePermission('categories.delete')],
        schema: {
            tags: ['Categories'],
            summary: 'Supprimer une catégorie',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) return reply.status(404).send({ error: 'Catégorie non trouvée' });
        await prisma.category.delete({ where: { id } });
        return { success: true };
    });
}
