import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

const seoSettingsSchema = {
    type: 'object',
    properties: {
        siteTitle: { type: 'string', nullable: true },
        siteDescription: { type: 'string', nullable: true },
        defaultOgImage: { type: 'string', nullable: true },
        twitterHandle: { type: 'string', nullable: true },
        googleAnalyticsId: { type: 'string', nullable: true },
        robotsTxt: { type: 'string', nullable: true },
    },
};

export default async function seoRoutes(fastify: FastifyInstance) {
    // Get global SEO settings
    fastify.get('/', {
        schema: {
            tags: ['SEO'],
            summary: 'Récupérer les paramètres SEO globaux',
            response: { 200: seoSettingsSchema },
        },
    }, async () => {
        const settings = await prisma.siteSetting.findMany({
            where: {
                key: {
                    in: ['seo_site_title', 'seo_site_description', 'seo_default_og_image', 'seo_twitter_handle', 'seo_google_analytics_id', 'seo_robots_txt'],
                },
            },
        });
        const result: Record<string, any> = {};
        for (const s of settings) {
            const key = s.key.replace('seo_', '').replace(/_([a-z])/g, (_: string, l: string) => l.toUpperCase());
            result[key] = s.value;
        }
        return result;
    });

    // Update global SEO settings
    fastify.put('/', {
        preHandler: [requirePermission('seo.update')],
        schema: {
            tags: ['SEO'],
            summary: 'Modifier les paramètres SEO globaux',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    siteTitle: { type: 'string', nullable: true },
                    siteDescription: { type: 'string', nullable: true },
                    defaultOgImage: { type: 'string', nullable: true },
                    twitterHandle: { type: 'string', nullable: true },
                    googleAnalyticsId: { type: 'string', nullable: true },
                    robotsTxt: { type: 'string', nullable: true },
                },
            },
            response: { 200: successSchema },
        },
    }, async (request) => {
        const data = request.body as Record<string, any>;
        const keyMap: Record<string, string> = {
            siteTitle: 'seo_site_title',
            siteDescription: 'seo_site_description',
            defaultOgImage: 'seo_default_og_image',
            twitterHandle: 'seo_twitter_handle',
            googleAnalyticsId: 'seo_google_analytics_id',
            robotsTxt: 'seo_robots_txt',
        };

        for (const [propKey, dbKey] of Object.entries(keyMap)) {
            if (data[propKey] !== undefined) {
                await prisma.siteSetting.upsert({
                    where: { key: dbKey },
                    update: { value: data[propKey] },
                    create: { key: dbKey, value: data[propKey], type: 'string' },
                });
            }
        }
        return { success: true };
    });

    // Get article SEO
    fastify.get('/articles/:articleId', {
        schema: {
            tags: ['SEO'],
            summary: 'Récupérer le SEO d\'un article',
            params: { type: 'object', properties: { articleId: { type: 'string', format: 'uuid' } }, required: ['articleId'] },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        metaTitle: { type: 'string', nullable: true },
                        metaDescription: { type: 'string', nullable: true },
                        ogImage: { type: 'string', nullable: true },
                        keywords: { type: 'string', nullable: true },
                    },
                },
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { articleId } = request.params as { articleId: string };
        const seo = await prisma.articleSEO.findUnique({ where: { articleId } });
        if (!seo) return reply.status(404).send({ error: 'SEO non trouvé' });
        return seo;
    });

    // Update or create article SEO
    fastify.put('/articles/:articleId', {
        preHandler: [requirePermission('seo.update')],
        schema: {
            tags: ['SEO'],
            summary: 'Modifier le SEO d\'un article',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { articleId: { type: 'string', format: 'uuid' } }, required: ['articleId'] },
            body: {
                type: 'object',
                properties: {
                    metaTitle: { type: 'string', nullable: true },
                    metaDescription: { type: 'string', nullable: true },
                    ogImage: { type: 'string', nullable: true },
                    keywords: { type: 'string', nullable: true },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        metaTitle: { type: 'string', nullable: true },
                        metaDescription: { type: 'string', nullable: true },
                        ogImage: { type: 'string', nullable: true },
                        keywords: { type: 'string', nullable: true },
                    },
                },
            },
        },
    }, async (request) => {
        const { articleId } = request.params as { articleId: string };
        const data = request.body as any;
        return prisma.articleSEO.upsert({
            where: { articleId },
            update: data,
            create: { articleId, ...data },
        });
    });
}
