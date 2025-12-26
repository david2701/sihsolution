import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission, getUser } from '../middlewares/auth.middleware.js';
import { mediaSchema, errorSchema, successSchema } from '../schemas/index.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export default async function mediaRoutes(fastify: FastifyInstance) {
    // Get all media
    fastify.get('/', {
        preHandler: [requirePermission('media.read')],
        schema: {
            tags: ['Media'],
            summary: 'Liste des médias',
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    type: { type: 'string', description: 'Filtrer par type MIME' },
                    page: { type: 'integer', default: 1 },
                    limit: { type: 'integer', default: 50 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        media: { type: 'array', items: mediaSchema },
                        pagination: {
                            type: 'object',
                            properties: { total: { type: 'integer' }, page: { type: 'integer' }, pages: { type: 'integer' } },
                        },
                    },
                },
            },
        },
    }, async (request) => {
        const { type, page = '1', limit = '50' } = request.query as any;
        const where: any = {};
        if (type) where.mimeType = { startsWith: type };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [media, total] = await Promise.all([
            prisma.media.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
            prisma.media.count({ where }),
        ]);
        return { media, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } };
    });

    // Upload single file
    fastify.post('/upload', {
        preHandler: [requirePermission('media.create')],
        schema: {
            tags: ['Media'],
            summary: 'Uploader un fichier',
            security: [{ bearerAuth: [] }],
            consumes: ['multipart/form-data'],
            response: { 200: mediaSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const data = await request.file();
        if (!data) return reply.status(400).send({ error: 'Aucun fichier fourni' });

        const filename = `${uuidv4()}${path.extname(data.filename)}`;
        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const buffer = await data.toBuffer();
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);

        return prisma.media.create({
            data: {
                filename,
                originalName: data.filename,
                mimeType: data.mimetype,
                size: buffer.length,
                path: `/uploads/${filename}`,
                uploadedById: getUser(request)!.userId,
            },
        });
    });

    // Upload multiple files
    fastify.post('/upload-multiple', {
        preHandler: [requirePermission('media.create')],
        schema: {
            tags: ['Media'],
            summary: 'Uploader plusieurs fichiers',
            security: [{ bearerAuth: [] }],
            consumes: ['multipart/form-data'],
            response: {
                200: { type: 'array', items: mediaSchema },
            },
        },
    }, async (request) => {
        const files = request.files();
        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const uploaded = [];
        for await (const data of files) {
            const filename = `${uuidv4()}${path.extname(data.filename)}`;
            const buffer = await data.toBuffer();
            await fs.writeFile(path.join(uploadDir, filename), buffer);

            const media = await prisma.media.create({
                data: {
                    filename,
                    originalName: data.filename,
                    mimeType: data.mimetype,
                    size: buffer.length,
                    path: `/uploads/${filename}`,
                    uploadedById: getUser(request)!.userId,
                },
            });
            uploaded.push(media);
        }
        return uploaded;
    });

    // Update media alt text
    fastify.put('/:id', {
        preHandler: [requirePermission('media.update')],
        schema: {
            tags: ['Media'],
            summary: 'Modifier un média',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: { alt: { type: 'string', nullable: true } },
            },
            response: { 200: mediaSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { alt } = request.body as { alt?: string };
        const media = await prisma.media.findUnique({ where: { id } });
        if (!media) return reply.status(404).send({ error: 'Média non trouvé' });
        return prisma.media.update({ where: { id }, data: { alt } });
    });

    // Delete media
    fastify.delete('/:id', {
        preHandler: [requirePermission('media.delete')],
        schema: {
            tags: ['Media'],
            summary: 'Supprimer un média',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const media = await prisma.media.findUnique({ where: { id } });
        if (!media) return reply.status(404).send({ error: 'Média non trouvé' });

        try {
            await fs.unlink(path.join(process.cwd(), 'uploads', media.filename));
        } catch { /* ignore */ }

        await prisma.media.delete({ where: { id } });
        return { success: true };
    });
}
