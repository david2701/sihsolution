import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requirePermission } from '../middlewares/auth.middleware.js';
import { roleSchema, errorSchema, successSchema } from '../schemas/index.js';

const prisma = new PrismaClient();

export default async function rolesRoutes(fastify: FastifyInstance) {
    // Get all roles
    fastify.get('/', {
        preHandler: [requirePermission('roles.read')],
        schema: {
            tags: ['Roles'],
            summary: 'Liste des rôles',
            security: [{ bearerAuth: [] }],
            response: { 200: { type: 'array', items: roleSchema } },
        },
    }, async () => {
        return prisma.role.findMany({
            include: { permissions: { include: { permission: true } } },
        }).then(roles => roles.map(r => ({
            ...r,
            permissions: r.permissions.map(p => p.permission),
        })));
    });

    // Get all permissions
    fastify.get('/permissions', {
        preHandler: [requirePermission('roles.read')],
        schema: {
            tags: ['Roles'],
            summary: 'Liste des permissions',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            description: { type: 'string', nullable: true },
                            module: { type: 'string' },
                        },
                    },
                },
            },
        },
    }, async () => {
        return prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { name: 'asc' }] });
    });

    // Get single role
    fastify.get('/:id', {
        preHandler: [requirePermission('roles.read')],
        schema: {
            tags: ['Roles'],
            summary: 'Détail d\'un rôle',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: roleSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const role = await prisma.role.findUnique({
            where: { id },
            include: { permissions: { include: { permission: true } } },
        });
        if (!role) return reply.status(404).send({ error: 'Rôle non trouvé' });
        return { ...role, permissions: role.permissions.map(p => p.permission) };
    });

    // Create role
    fastify.post('/', {
        preHandler: [requirePermission('roles.create')],
        schema: {
            tags: ['Roles'],
            summary: 'Créer un rôle',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    permissionIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                },
            },
            response: { 200: roleSchema, 400: errorSchema },
        },
    }, async (request, reply) => {
        const { name, description, permissionIds } = request.body as any;
        if (!name) return reply.status(400).send({ error: 'Nom requis' });
        const role = await prisma.role.create({
            data: {
                name,
                description,
                permissions: permissionIds ? { create: permissionIds.map((id: string) => ({ permissionId: id })) } : undefined,
            },
            include: { permissions: { include: { permission: true } } },
        });
        return { ...role, permissions: role.permissions.map(p => p.permission) };
    });

    // Update role
    fastify.put('/:id', {
        preHandler: [requirePermission('roles.update')],
        schema: {
            tags: ['Roles'],
            summary: 'Modifier un rôle',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    permissionIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                },
            },
            response: { 200: roleSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const { name, description, permissionIds } = request.body as any;
        const role = await prisma.role.findUnique({ where: { id } });
        if (!role) return reply.status(404).send({ error: 'Rôle non trouvé' });

        if (permissionIds) {
            await prisma.rolePermission.deleteMany({ where: { roleId: id } });
            await prisma.rolePermission.createMany({ data: permissionIds.map((pId: string) => ({ roleId: id, permissionId: pId })) });
        }

        const updated = await prisma.role.update({
            where: { id },
            data: { name, description },
            include: { permissions: { include: { permission: true } } },
        });
        return { ...updated, permissions: updated.permissions.map(p => p.permission) };
    });

    // Delete role
    fastify.delete('/:id', {
        preHandler: [requirePermission('roles.delete')],
        schema: {
            tags: ['Roles'],
            summary: 'Supprimer un rôle',
            security: [{ bearerAuth: [] }],
            params: { type: 'object', properties: { id: { type: 'string', format: 'uuid' } }, required: ['id'] },
            response: { 200: successSchema, 404: errorSchema },
        },
    }, async (request, reply) => {
        const { id } = request.params as { id: string };
        const role = await prisma.role.findUnique({ where: { id } });
        if (!role) return reply.status(404).send({ error: 'Rôle non trouvé' });
        await prisma.role.delete({ where: { id } });
        return { success: true };
    });
}
