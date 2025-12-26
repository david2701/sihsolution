import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission, authenticate, getUser } from '../middlewares/auth.middleware.js';
import { articleSchema, paginationSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export default async function articlesRoutes(fastify: FastifyInstance) {
    // Get all articles (with filters)
    fastify.get('/', {
        schema: {
            tags: ['Articles'],
            summary: 'Liste des articles',
            description: 'Récupère la liste des articles avec filtres et pagination',
            querystring: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
                    categoryId: { type: 'string', format: 'uuid' },
                    authorId: { type: 'string', format: 'uuid' },
                    page: { type: 'integer', default: 1, minimum: 1 },
                    limit: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
                    search: { type: 'string' },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        articles: { type: 'array', items: articleSchema },
                        pagination: paginationSchema,
                    },
                },
            },
        },
    }, async (request) => {
        const { status, categoryId, authorId, page = '1', limit = '20', search } = request.query as {
            status?: string;
            categoryId?: string;
            authorId?: string;
            page?: string;
            limit?: string;
            search?: string;
        };

        const where: any = {};
        if (status) where.status = status;
        if (categoryId) where.categoryId = categoryId;
        if (authorId) where.authorId = authorId;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                include: {
                    category: true,
                    author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                    seo: true,
                    tags: { include: { tag: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.article.count({ where }),
        ]);

        return {
            articles: articles.map((a) => ({
                ...a,
                tags: a.tags.map((t) => t.tag),
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        };
    });

    // Get single article by id or slug
    fastify.get('/:idOrSlug', {
        schema: {
            tags: ['Articles'],
            summary: 'Détail d\'un article',
            description: 'Récupère un article par son ID ou son slug',
            params: {
                type: 'object',
                properties: {
                    idOrSlug: { type: 'string', description: 'ID ou slug de l\'article' },
                },
                required: ['idOrSlug'],
            },
            response: {
                200: articleSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { idOrSlug } = request.params as { idOrSlug: string };

        const article = await prisma.article.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            include: {
                category: true,
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                seo: true,
                tags: { include: { tag: true } },
            },
        });

        if (!article) {
            return reply.status(404).send({ error: 'Article non trouvé' });
        }

        return {
            ...article,
            tags: article.tags.map((t) => t.tag),
        };
    });

    // Create article
    fastify.post('/', {
        preHandler: [requirePermission('articles.create')],
        schema: {
            tags: ['Articles'],
            summary: 'Créer un article',
            description: 'Crée un nouvel article',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                    title: { type: 'string', minLength: 1, description: 'Titre de l\'article' },
                    content: { type: 'string', minLength: 1, description: 'Contenu de l\'article (HTML)' },
                    excerpt: { type: 'string', nullable: true, description: 'Extrait/résumé' },
                    featuredImage: { type: 'string', nullable: true, description: 'URL de l\'image à la une' },
                    categoryId: { type: 'string', format: 'uuid', nullable: true },
                    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' },
                    publishedAt: { type: 'string', format: 'date-time', nullable: true },
                    tagIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                    seo: {
                        type: 'object',
                        properties: {
                            metaTitle: { type: 'string' },
                            metaDescription: { type: 'string' },
                            ogImage: { type: 'string' },
                            keywords: { type: 'string' },
                        },
                    },
                },
            },
            response: {
                200: articleSchema,
                400: errorSchema,
                401: errorSchema,
                403: errorSchema,
            },
        },
    }, async (request, reply) => {
        const {
            title, content, excerpt, featuredImage, categoryId, status, publishedAt, tagIds,
            seo
        } = request.body as {
            title: string;
            content: string;
            excerpt?: string;
            featuredImage?: string;
            categoryId?: string;
            status?: string;
            publishedAt?: string;
            tagIds?: string[];
            seo?: {
                metaTitle?: string;
                metaDescription?: string;
                ogImage?: string;
                keywords?: string;
            };
        };

        if (!title || !content) {
            return reply.status(400).send({ error: 'Titre et contenu requis' });
        }

        let slug = slugify(title);
        const existingSlug = await prisma.article.findUnique({ where: { slug } });
        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                featuredImage,
                categoryId,
                authorId: getUser(request)!.userId,
                status: (status as any) || 'DRAFT',
                publishedAt: publishedAt ? new Date(publishedAt) : undefined,
                tags: tagIds ? {
                    create: tagIds.map((id) => ({ tagId: id })),
                } : undefined,
                seo: seo ? { create: seo } : undefined,
            },
            include: {
                category: true,
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                seo: true,
                tags: { include: { tag: true } },
            },
        });

        return {
            ...article,
            tags: article.tags.map((t) => t.tag),
        };
    });

    // Update article
    fastify.put('/:id', {
        preHandler: [requirePermission('articles.update')],
        schema: {
            tags: ['Articles'],
            summary: 'Modifier un article',
            description: 'Met à jour un article existant',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                },
                required: ['id'],
            },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    excerpt: { type: 'string', nullable: true },
                    featuredImage: { type: 'string', nullable: true },
                    categoryId: { type: 'string', format: 'uuid', nullable: true },
                    status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
                    publishedAt: { type: 'string', format: 'date-time', nullable: true },
                    tagIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                    seo: {
                        type: 'object',
                        properties: {
                            metaTitle: { type: 'string' },
                            metaDescription: { type: 'string' },
                            ogImage: { type: 'string' },
                            keywords: { type: 'string' },
                        },
                    },
                },
            },
            response: {
                200: articleSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const {
            title, content, excerpt, featuredImage, categoryId, status, publishedAt, tagIds,
            seo
        } = request.body as {
            title?: string;
            content?: string;
            excerpt?: string;
            featuredImage?: string;
            categoryId?: string | null;
            status?: string;
            publishedAt?: string | null;
            tagIds?: string[];
            seo?: {
                metaTitle?: string;
                metaDescription?: string;
                ogImage?: string;
                keywords?: string;
            };
        };

        const article = await prisma.article.findUnique({ where: { id } });
        if (!article) {
            return reply.status(404).send({ error: 'Article non trouvé' });
        }

        const updateData: any = {};
        if (title) {
            updateData.title = title;
            if (title !== article.title) {
                let slug = slugify(title);
                const existingSlug = await prisma.article.findFirst({
                    where: { slug, id: { not: id } }
                });
                if (existingSlug) {
                    slug = `${slug}-${Date.now()}`;
                }
                updateData.slug = slug;
            }
        }
        if (content !== undefined) updateData.content = content;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (status) updateData.status = status;
        if (publishedAt !== undefined) {
            updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
        }

        // Update tags
        if (tagIds !== undefined) {
            await prisma.articleTag.deleteMany({ where: { articleId: id } });
            if (tagIds.length > 0) {
                await prisma.articleTag.createMany({
                    data: tagIds.map((tagId) => ({ articleId: id, tagId })),
                });
            }
        }

        // Update SEO
        if (seo !== undefined) {
            await prisma.articleSEO.upsert({
                where: { articleId: id },
                update: seo,
                create: { articleId: id, ...seo },
            });
        }

        const updated = await prisma.article.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                seo: true,
                tags: { include: { tag: true } },
            },
        });

        return {
            ...updated,
            tags: updated.tags.map((t) => t.tag),
        };
    });

    // Increment views
    fastify.post('/:id/view', {
        schema: {
            tags: ['Articles'],
            summary: 'Incrémenter les vues',
            description: 'Incrémente le compteur de vues d\'un article',
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                },
                required: ['id'],
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        views: { type: 'integer' },
                    },
                },
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const article = await prisma.article.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        return { views: article.views };
    });

    // Delete article
    fastify.delete('/:id', {
        preHandler: [requirePermission('articles.delete')],
        schema: {
            tags: ['Articles'],
            summary: 'Supprimer un article',
            description: 'Supprime définitivement un article',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                },
                required: ['id'],
            },
            response: {
                200: successSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };

        const article = await prisma.article.findUnique({ where: { id } });
        if (!article) {
            return reply.status(404).send({ error: 'Article non trouvé' });
        }

        await prisma.article.delete({ where: { id } });

        return { success: true };
    });
}
