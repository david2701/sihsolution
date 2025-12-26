import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { userSchema, errorSchema, successSchema, paginationSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function usersRoutes(fastify: FastifyInstance) {
    // Get all users
    fastify.get('/', {
        preHandler: [requirePermission('users.read')],
        schema: {
            tags: ['Users'],
            summary: 'Liste des utilisateurs',
            description: 'Récupère la liste de tous les utilisateurs',
            security: [{ bearerAuth: [] }],
            response: {
                200: { type: 'array', items: userSchema },
            },
        },
    }, async () => {
        const users = await prisma.user.findMany({
            include: { role: true },
            orderBy: { createdAt: 'desc' },
        });
        return users;
    });

    // Get single user
    fastify.get('/:id', {
        preHandler: [requirePermission('users.read')],
        schema: {
            tags: ['Users'],
            summary: 'Détail d\'un utilisateur',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: { id: { type: 'string', format: 'uuid' } },
                required: ['id'],
            },
            response: {
                200: userSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
        if (!user) return reply.status(404).send({ error: 'Utilisateur non trouvé' });
        return user;
    });

    // Create user
    fastify.post('/', {
        preHandler: [requirePermission('users.create')],
        schema: {
            tags: ['Users'],
            summary: 'Créer un utilisateur',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName', 'roleId'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    avatar: { type: 'string', nullable: true },
                    roleId: { type: 'string', format: 'uuid' },
                    isActive: { type: 'boolean', default: true },
                },
            },
            response: {
                200: userSchema,
                400: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { email, password, firstName, lastName, avatar, roleId, isActive } = request.body as any;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return reply.status(400).send({ error: 'Email déjà utilisé' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, firstName, lastName, avatar, roleId, isActive: isActive ?? true },
            include: { role: true },
        });
        return user;
    });

    // Update user
    fastify.put('/:id', {
        preHandler: [requirePermission('users.update')],
        schema: {
            tags: ['Users'],
            summary: 'Modifier un utilisateur',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: { id: { type: 'string', format: 'uuid' } },
                required: ['id'],
            },
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    avatar: { type: 'string', nullable: true },
                    roleId: { type: 'string', format: 'uuid' },
                    isActive: { type: 'boolean' },
                    password: { type: 'string', minLength: 6 },
                },
            },
            response: {
                200: userSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { email, firstName, lastName, avatar, roleId, isActive, password } = request.body as any;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return reply.status(404).send({ error: 'Utilisateur non trouvé' });

        const updateData: any = {};
        if (email) updateData.email = email;
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (roleId) updateData.roleId = roleId;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (password) updateData.password = await bcrypt.hash(password, 12);

        const updated = await prisma.user.update({
            where: { id },
            data: updateData,
            include: { role: true },
        });
        return updated;
    });

    // Delete user
    fastify.delete('/:id', {
        preHandler: [requirePermission('users.delete')],
        schema: {
            tags: ['Users'],
            summary: 'Supprimer un utilisateur',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: { id: { type: 'string', format: 'uuid' } },
                required: ['id'],
            },
            response: {
                200: successSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return reply.status(404).send({ error: 'Utilisateur non trouvé' });
        await prisma.user.delete({ where: { id } });
        return { success: true };
    });
}
