import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

const settingSchema = {
    type: 'object',
    properties: {
        key: { type: 'string' },
        value: { type: 'string', nullable: true },
        type: { type: 'string', enum: ['string', 'number', 'boolean', 'json'] },
    },
};

export default async function settingsRoutes(fastify: FastifyInstance) {
    // Get all settings (public)
    fastify.get('/', {
        schema: {
            tags: ['Settings'],
            summary: 'Récupérer les paramètres du site',
            description: 'Retourne tous les paramètres au format clé-valeur',
            response: {
                200: { type: 'object', additionalProperties: true },
            },
        },
    }, async () => {
        const settings = await prisma.siteSetting.findMany();
        const result: Record<string, any> = {};
        for (const s of settings) {
            if (s.type === 'number') result[s.key] = parseFloat(s.value || '0');
            else if (s.type === 'boolean') result[s.key] = s.value === 'true';
            else if (s.type === 'json') {
                try { result[s.key] = JSON.parse(s.value || '{}'); }
                catch { result[s.key] = s.value; }
            }
            else result[s.key] = s.value;
        }
        return result;
    });

    // Get single setting
    fastify.get('/:key', {
        schema: {
            tags: ['Settings'],
            summary: 'Récupérer un paramètre',
            params: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
            response: { 200: settingSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { key } = request.params as { key: string };
        const setting = await prisma.siteSetting.findUnique({ where: { key } });
        if (!setting) return reply.status(404).send({ error: 'Paramètre non trouvé' });
        return setting;
    });

    // Update or create setting
    fastify.put('/:key', {
        preHandler: [requirePermission('settings.update')],
        schema: {
            tags: ['Settings'],
            summary: 'Modifier un paramètre',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] },
            body: {
                type: 'object',
                properties: {
                    value: { type: 'string' },
                    type: { type: 'string', enum: ['string', 'number', 'boolean', 'json'] },
                },
            },
            response: { 200: settingSchema },
        },
    }, async (request) => {
        const { key } = request.params as { key: string };
        const { value, type } = request.body as { value?: string; type?: string };
        return prisma.siteSetting.upsert({
            where: { key },
            update: { value: value ?? '', type: type as any },
            create: { key, value: value ?? '', type: (type as any) || 'string' },
        });
    });

    // Bulk update settings
    fastify.put('/', {
        preHandler: [requirePermission('settings.update')],
        schema: {
            tags: ['Settings'],
            summary: 'Modifier plusieurs paramètres',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['settings'],
                properties: {
                    settings: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                key: { type: 'string' },
                                value: { type: 'string' },
                                type: { type: 'string' },
                            },
                        },
                    },
                },
            },
            response: { 200: successSchema },
        },
    }, async (request) => {
        const { settings } = request.body as { settings: { key: string; value?: string; type?: string }[] };
        await Promise.all(
            settings.map(s =>
                prisma.siteSetting.upsert({
                    where: { key: s.key },
                    update: { value: s.value ?? '', type: s.type as any },
                    create: { key: s.key, value: s.value ?? '', type: (s.type as any) || 'string' },
                })
            )
        );
        return { success: true };
    });
}
