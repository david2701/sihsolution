import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { contactSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function contactRoutes(fastify: FastifyInstance) {
    // Get all submissions
    fastify.get('/', {
        preHandler: [requirePermission('contact.read')],
        schema: {
            tags: ['Contact'],
            summary: 'Liste des messages',
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: { isRead: { type: 'string', enum: ['true', 'false'] } },
            },
            response: { 200: { type: 'array', items: contactSchema } },
        },
    }, async (request) => {
        const { isRead } = request.query as any;
        const where: any = {};
        if (isRead !== undefined) where.isRead = isRead === 'true';
        return prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' } });
    });

    // Submit contact (public)
    fastify.post('/', {
        schema: {
            tags: ['Contact'],
            summary: 'Envoyer un message',
            description: 'Endpoint public pour le formulaire de contact',
            body: {
                type: 'object',
                required: ['name', 'email', 'message'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    subject: { type: 'string', nullable: true },
                    message: { type: 'string' },
                },
            },
            response: { 200: successSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { name, email, message, subject } = request.body as any;
        if (!name || !email || !message) return reply.status(400).send({ error: 'Nom, email et message requis' });
        await prisma.contactSubmission.create({ data: { name, email, subject, message } });
        return { success: true };
    });

    // Mark as read/unread
    fastify.put('/:id', {
        preHandler: [requirePermission('contact.update')],
        schema: {
            tags: ['Contact'],
            summary: 'Modifier le statut d\'un message',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: { isRead: { type: 'boolean' } },
            },
            response: { 200: contactSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const submission = await prisma.contactSubmission.findUnique({ where: { id } });
        if (!submission) return reply.status(404).send({ error: 'Message non trouvé' });
        return prisma.contactSubmission.update({ where: { id }, data: request.body as any });
    });

    // Delete submission
    fastify.delete('/:id', {
        preHandler: [requirePermission('contact.delete')],
        schema: {
            tags: ['Contact'],
            summary: 'Supprimer un message',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const submission = await prisma.contactSubmission.findUnique({ where: { id } });
        if (!submission) return reply.status(404).send({ error: 'Message non trouvé' });
        await prisma.contactSubmission.delete({ where: { id } });
        return { success: true };
    });
}
