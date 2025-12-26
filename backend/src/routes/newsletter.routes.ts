import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { subscriberSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function newsletterRoutes(fastify: FastifyInstance) {
    // Get all subscribers
    fastify.get('/', {
        preHandler: [requirePermission('newsletter.read')],
        schema: {
            tags: ['Newsletter'],
            summary: 'Liste des abonnés',
            security: [{ bearerAuth: [] }],
            response: { 200: { type: 'array', items: subscriberSchema } },
        },
    }, async () => {
        return prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
    });

    // Subscribe (public)
    fastify.post('/subscribe', {
        schema: {
            tags: ['Newsletter'],
            summary: 'S\'abonner à la newsletter',
            description: 'Endpoint public pour l\'inscription à la newsletter',
            body: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } },
            },
            response: {
                200: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } },
                400: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { email } = request.body as { email: string };
        if (!email) return reply.status(400).send({ error: 'Email requis' });

        const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (existing) {
            if (existing.isActive) return { success: true, message: 'Déjà inscrit' };
            await prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true } });
            return { success: true, message: 'Réinscription effectuée' };
        }

        await prisma.newsletterSubscriber.create({ data: { email } });
        return { success: true, message: 'Inscription réussie' };
    });

    // Unsubscribe (public)
    fastify.post('/unsubscribe', {
        schema: {
            tags: ['Newsletter'],
            summary: 'Se désabonner de la newsletter',
            body: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } },
            },
            response: { 200: successSchema },
        },
    }, async (request) => {
        const { email } = request.body as { email: string };
        await prisma.newsletterSubscriber.updateMany({ where: { email }, data: { isActive: false } });
        return { success: true };
    });

    // Export subscribers
    fastify.get('/export', {
        preHandler: [requirePermission('newsletter.read')],
        schema: {
            tags: ['Newsletter'],
            summary: 'Exporter les abonnés en CSV',
            security: [{ bearerAuth: [] }],
            response: {
                200: { type: 'string', description: 'Fichier CSV' },
            },
        },
    }, async (request, reply) => {
        const subscribers = await prisma.newsletterSubscriber.findMany({ where: { isActive: true } });
        const csv = ['email,subscribedAt', ...subscribers.map(s => `${s.email},${s.subscribedAt.toISOString()}`)].join('\n');
        reply.type('text/csv').header('Content-Disposition', 'attachment; filename=subscribers.csv');
        return csv;
    });

    // Delete subscriber
    fastify.delete('/:id', {
        preHandler: [requirePermission('newsletter.delete')],
        schema: {
            tags: ['Newsletter'],
            summary: 'Supprimer un abonné',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } });
        if (!subscriber) return reply.status(404).send({ error: 'Abonné non trouvé' });
        await prisma.newsletterSubscriber.delete({ where: { id } });
        return { success: true };
    });
}
