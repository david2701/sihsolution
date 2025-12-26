import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface JWTPayload {
    userId: string;
    email: string;
    roleId: string;
}

export interface UserPayload extends JWTPayload {
    permissions: string[];
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: JWTPayload;
        user: UserPayload;
    }
}

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const decoded = await request.jwtVerify<JWTPayload>();

        // Get user permissions
        const rolePermissions = await prisma.rolePermission.findMany({
            where: { roleId: decoded.roleId },
            include: { permission: true },
        });

        (request as any).user = {
            ...decoded,
            permissions: rolePermissions.map((rp) => rp.permission.name),
        };
    } catch (err) {
        reply.status(401).send({ error: 'Non autorisé' });
    }
}

export function requirePermission(permission: string) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        await authenticate(request, reply);

        const user = (request as any).user as UserPayload | undefined;
        if (!user) return;

        if (!user.permissions.includes(permission)) {
            reply.status(403).send({ error: 'Permission refusée' });
        }
    };
}

export function requireAnyPermission(permissions: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        await authenticate(request, reply);

        const user = (request as any).user as UserPayload | undefined;
        if (!user) return;

        const hasPermission = permissions.some((p) =>
            user.permissions.includes(p)
        );

        if (!hasPermission) {
            reply.status(403).send({ error: 'Permission refusée' });
        }
    };
}

// Helper to get user from request
export function getUser(request: FastifyRequest): UserPayload | undefined {
    return (request as any).user;
}
