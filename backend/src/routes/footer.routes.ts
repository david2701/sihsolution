import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

const footerSectionSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        order: { type: 'integer' },
        links: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    label: { type: 'string' },
                    url: { type: 'string' },
                    order: { type: 'integer' },
                },
            },
        },
    },
};

export default async function footerRoutes(fastify: FastifyInstance) {
    // Get footer content
    fastify.get('/', {
        schema: {
            tags: ['Footer'],
            summary: 'Récupérer le contenu du footer',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        sections: { type: 'array', items: footerSectionSchema },
                    },
                },
            },
        },
    }, async () => {
        const sections = await prisma.footerSection.findMany({
            include: { links: { orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' },
        });
        return { sections };
    });

    // Create section
    fastify.post('/sections', {
        preHandler: [requirePermission('footer.create')],
        schema: {
            tags: ['Footer'],
            summary: 'Créer une section footer',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string' },
                    order: { type: 'integer', default: 0 },
                },
            },
            response: { 200: footerSectionSchema },
        },
    }, async (request) => {
        const { title, order } = request.body as any;
        return prisma.footerSection.create({
            data: { title, order: order ?? 0 },
            include: { links: true },
        });
    });

    // Update section
    fastify.put('/sections/:id', {
        preHandler: [requirePermission('footer.update')],
        schema: {
            tags: ['Footer'],
            summary: 'Modifier une section footer',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    order: { type: 'integer' },
                },
            },
            response: { 200: footerSectionSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const section = await prisma.footerSection.findUnique({ where: { id } });
        if (!section) return reply.status(404).send({ error: 'Section non trouvée' });
        return prisma.footerSection.update({
            where: { id },
            data: request.body as any,
            include: { links: true },
        });
    });

    // Delete section
    fastify.delete('/sections/:id', {
        preHandler: [requirePermission('footer.delete')],
        schema: {
            tags: ['Footer'],
            summary: 'Supprimer une section footer',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const section = await prisma.footerSection.findUnique({ where: { id } });
        if (!section) return reply.status(404).send({ error: 'Section non trouvée' });
        await prisma.footerSection.delete({ where: { id } });
        return { success: true };
    });

    // Add link to section
    fastify.post('/sections/:sectionId/links', {
        preHandler: [requirePermission('footer.create')],
        schema: {
            tags: ['Footer'],
            summary: 'Ajouter un lien à une section',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { sectionId: { type: 'string', format: 'uuid' } }, required: ['sectionId'] },
            body: {
                type: 'object',
                required: ['label', 'url'],
                properties: {
                    label: { type: 'string' },
                    url: { type: 'string' },
                    order: { type: 'integer', default: 0 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: { id: { type: 'string' }, label: { type: 'string' }, url: { type: 'string' }, order: { type: 'integer' } },
                },
            },
        },
    }, async (request) => {
        const { sectionId } = request.params as { sectionId: string };
        const { label, url, order } = request.body as any;
        return prisma.footerLink.create({ data: { sectionId, label, url, order: order ?? 0 } });
    });

    // Update link
    fastify.put('/links/:id', {
        preHandler: [requirePermission('footer.update')],
        schema: {
            tags: ['Footer'],
            summary: 'Modifier un lien footer',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: { label: { type: 'string' }, url: { type: 'string' }, order: { type: 'integer' } },
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const link = await prisma.footerLink.findUnique({ where: { id } });
        if (!link) return reply.status(404).send({ error: 'Lien non trouvé' });
        return prisma.footerLink.update({ where: { id }, data: request.body as any });
    });

    // Delete link
    fastify.delete('/links/:id', {
        preHandler: [requirePermission('footer.delete')],
        schema: {
            tags: ['Footer'],
            summary: 'Supprimer un lien footer',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const link = await prisma.footerLink.findUnique({ where: { id } });
        if (!link) return reply.status(404).send({ error: 'Lien non trouvé' });
        await prisma.footerLink.delete({ where: { id } });
        return { success: true };
    });
}
