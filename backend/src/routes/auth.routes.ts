import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, getUser } from '../middlewares/auth.middleware.js';
import { userSchema, errorSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function authRoutes(fastify: FastifyInstance) {
    // Login
    fastify.post('/login', {
        schema: {
            tags: ['Auth'],
            summary: 'Connexion utilisateur',
            description: 'Authentifie un utilisateur et retourne un token JWT',
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', description: 'Adresse email' },
                    password: { type: 'string', minLength: 6, description: 'Mot de passe' },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', description: 'Token JWT' },
                        user: userSchema,
                    },
                },
                400: errorSchema,
                401: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { email, password } = request.body as { email: string; password: string };

        if (!email || !password) {
            return reply.status(400).send({ error: 'Email et mot de passe requis' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user || !user.isActive) {
            return reply.status(401).send({ error: 'Identifiants invalides' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return reply.status(401).send({ error: 'Identifiants invalides' });
        }

        // Get user permissions
        const rolePermissions = await prisma.rolePermission.findMany({
            where: { roleId: user.roleId },
            include: { permission: true },
        });

        console.log('DEBUG: roleId:', user.roleId);
        console.log('DEBUG: rolePermissions count:', rolePermissions.length);
        console.log('DEBUG: permissions:', rolePermissions.map((rp) => rp.permission.name));

        const token = fastify.jwt.sign({
            userId: user.id,
            email: user.email,
            roleId: user.roleId,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                role: user.role,
                permissions: rolePermissions.map((rp) => rp.permission.name),
            },
        };
    });

    // Get current user
    fastify.get('/me', {
        preHandler: [authenticate],
        schema: {
            tags: ['Auth'],
            summary: 'Obtenir l\'utilisateur connecté',
            description: 'Retourne les informations de l\'utilisateur actuellement authentifié',
            security: [{ bearerAuth: [] }],
            response: {
                200: userSchema,
                401: errorSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const authUser = getUser(request)!;
        const user = await prisma.user.findUnique({
            where: { id: authUser.userId },
            include: { role: true },
        });

        if (!user) {
            return reply.status(404).send({ error: 'Utilisateur non trouvé' });
        }

        const rolePermissions = await prisma.rolePermission.findMany({
            where: { roleId: user.roleId },
            include: { permission: true },
        });

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            role: user.role,
            permissions: rolePermissions.map((rp) => rp.permission.name),
        };
    });

    // Update profile
    fastify.put('/profile', {
        preHandler: [authenticate],
        schema: {
            tags: ['Auth'],
            summary: 'Mettre à jour le profil',
            description: 'Permet à l\'utilisateur de modifier ses informations personnelles et son mot de passe',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    avatar: { type: 'string', nullable: true },
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string', minLength: 6 },
                },
            },
            response: {
                200: userSchema,
                400: errorSchema,
                404: errorSchema,
            },
        },
    }, async (request, reply) => {
        const { firstName, lastName, avatar, currentPassword, newPassword } = request.body as {
            firstName?: string;
            lastName?: string;
            avatar?: string;
            currentPassword?: string;
            newPassword?: string;
        };

        const authUser = getUser(request)!;
        const user = await prisma.user.findUnique({
            where: { id: authUser.userId },
        });

        if (!user) {
            return reply.status(404).send({ error: 'Utilisateur non trouvé' });
        }

        const updateData: any = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (avatar !== undefined) updateData.avatar = avatar;

        if (currentPassword && newPassword) {
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return reply.status(400).send({ error: 'Mot de passe actuel incorrect' });
            }
            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            include: { role: true },
        });

        return {
            id: updated.id,
            email: updated.email,
            firstName: updated.firstName,
            lastName: updated.lastName,
            avatar: updated.avatar,
            role: updated.role,
        };
    });
}
