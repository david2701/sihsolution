// Common JSON Schema definitions for Swagger documentation

// Pagination schema
export const paginationSchema = {
    type: 'object',
    properties: {
        page: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
        total: { type: 'integer' },
        pages: { type: 'integer' },
    },
};

// Error response schema
export const errorSchema = {
    type: 'object',
    properties: {
        error: { type: 'string' },
    },
};

// Success response schema
export const successSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
    },
};

// User schema
export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        avatar: { type: 'string', nullable: true },
        isActive: { type: 'boolean' },
        role: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        },
        permissions: {
            type: 'array',
            items: { type: 'string' },
        },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

// Article schema
export const articleSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        slug: { type: 'string' },
        content: { type: 'string' },
        excerpt: { type: 'string', nullable: true },
        featuredImage: { type: 'string', nullable: true },
        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
        views: { type: 'integer' },
        publishedAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        category: {
            type: 'object',
            nullable: true,
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
            },
        },
        author: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                avatar: { type: 'string', nullable: true },
            },
        },
        tags: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                },
            },
        },
        seo: {
            type: 'object',
            nullable: true,
            properties: {
                metaTitle: { type: 'string', nullable: true },
                metaDescription: { type: 'string', nullable: true },
                ogImage: { type: 'string', nullable: true },
                keywords: { type: 'string', nullable: true },
            },
        },
    },
};

// Category schema
export const categorySchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string', nullable: true },
        image: { type: 'string', nullable: true },
        isActive: { type: 'boolean' },
        order: { type: 'integer' },
        _count: {
            type: 'object',
            properties: {
                articles: { type: 'integer' },
                videos: { type: 'integer' },
            },
        },
    },
};

// Video schema
export const videoSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        embedCode: { type: 'string' },
        thumbnail: { type: 'string', nullable: true },
        isFeatured: { type: 'boolean' },
        isActive: { type: 'boolean' },
        order: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

// Podcast schema
export const podcastSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        embedCode: { type: 'string' },
        coverImage: { type: 'string', nullable: true },
        duration: { type: 'integer', nullable: true },
        isActive: { type: 'boolean' },
        order: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

// Media schema
export const mediaSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        filename: { type: 'string' },
        originalName: { type: 'string' },
        mimeType: { type: 'string' },
        size: { type: 'integer' },
        path: { type: 'string' },
        alt: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

// Banner schema
export const bannerSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        subtitle: { type: 'string', nullable: true },
        imageUrl: { type: 'string' },
        linkUrl: { type: 'string', nullable: true },
        order: { type: 'integer' },
        isActive: { type: 'boolean' },
    },
};

// Ad schema
export const adSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        position: { type: 'string' },
        imageUrl: { type: 'string', nullable: true },
        htmlCode: { type: 'string', nullable: true },
        linkUrl: { type: 'string', nullable: true },
        isActive: { type: 'boolean' },
        startDate: { type: 'string', format: 'date-time', nullable: true },
        endDate: { type: 'string', format: 'date-time', nullable: true },
    },
};

// Newsletter subscriber schema
export const subscriberSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        isActive: { type: 'boolean' },
        subscribedAt: { type: 'string', format: 'date-time' },
    },
};

// Contact submission schema
export const contactSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        subject: { type: 'string', nullable: true },
        message: { type: 'string' },
        isRead: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

// Role schema
export const roleSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        permissions: {
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
};

// Page schema
export const pageSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        slug: { type: 'string' },
        content: { type: 'string' },
        isActive: { type: 'boolean' },
        order: { type: 'integer' },
    },
};

// Tag schema
export const tagSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        slug: { type: 'string' },
        _count: {
            type: 'object',
            properties: {
                articles: { type: 'integer' },
            },
        },
    },
};
