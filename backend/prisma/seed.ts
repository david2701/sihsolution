import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Define all permissions
const permissions = [
    // Articles
    { name: 'articles.create', description: 'Créer des articles', module: 'articles' },
    { name: 'articles.read', description: 'Lire les articles', module: 'articles' },
    { name: 'articles.update', description: 'Modifier les articles', module: 'articles' },
    { name: 'articles.delete', description: 'Supprimer les articles', module: 'articles' },

    // Categories
    { name: 'categories.create', description: 'Créer des catégories', module: 'categories' },
    { name: 'categories.read', description: 'Lire les catégories', module: 'categories' },
    { name: 'categories.update', description: 'Modifier les catégories', module: 'categories' },
    { name: 'categories.delete', description: 'Supprimer les catégories', module: 'categories' },

    // Pages
    { name: 'pages.create', description: 'Créer des pages', module: 'pages' },
    { name: 'pages.read', description: 'Lire les pages', module: 'pages' },
    { name: 'pages.update', description: 'Modifier les pages', module: 'pages' },
    { name: 'pages.delete', description: 'Supprimer les pages', module: 'pages' },

    // Videos
    { name: 'videos.create', description: 'Créer des vidéos', module: 'videos' },
    { name: 'videos.read', description: 'Lire les vidéos', module: 'videos' },
    { name: 'videos.update', description: 'Modifier les vidéos', module: 'videos' },
    { name: 'videos.delete', description: 'Supprimer les vidéos', module: 'videos' },

    // Podcasts
    { name: 'podcasts.create', description: 'Créer des podcasts', module: 'podcasts' },
    { name: 'podcasts.read', description: 'Lire les podcasts', module: 'podcasts' },
    { name: 'podcasts.update', description: 'Modifier les podcasts', module: 'podcasts' },
    { name: 'podcasts.delete', description: 'Supprimer les podcasts', module: 'podcasts' },

    // Ads
    { name: 'ads.create', description: 'Créer des publicités', module: 'ads' },
    { name: 'ads.read', description: 'Lire les publicités', module: 'ads' },
    { name: 'ads.update', description: 'Modifier les publicités', module: 'ads' },
    { name: 'ads.delete', description: 'Supprimer les publicités', module: 'ads' },

    // Banners
    { name: 'banners.create', description: 'Créer des bannières', module: 'banners' },
    { name: 'banners.read', description: 'Lire les bannières', module: 'banners' },
    { name: 'banners.update', description: 'Modifier les bannières', module: 'banners' },
    { name: 'banners.delete', description: 'Supprimer les bannières', module: 'banners' },

    // Newsletter
    { name: 'newsletter.read', description: 'Voir les abonnés', module: 'newsletter' },
    { name: 'newsletter.delete', description: 'Supprimer les abonnés', module: 'newsletter' },

    // Contact
    { name: 'contact.read', description: 'Lire les messages', module: 'contact' },
    { name: 'contact.delete', description: 'Supprimer les messages', module: 'contact' },

    // Users
    { name: 'users.create', description: 'Créer des utilisateurs', module: 'users' },
    { name: 'users.read', description: 'Voir les utilisateurs', module: 'users' },
    { name: 'users.update', description: 'Modifier les utilisateurs', module: 'users' },
    { name: 'users.delete', description: 'Supprimer les utilisateurs', module: 'users' },

    // Roles
    { name: 'roles.create', description: 'Créer des rôles', module: 'roles' },
    { name: 'roles.read', description: 'Voir les rôles', module: 'roles' },
    { name: 'roles.update', description: 'Modifier les rôles', module: 'roles' },
    { name: 'roles.delete', description: 'Supprimer les rôles', module: 'roles' },

    // Media
    { name: 'media.create', description: 'Uploader des médias', module: 'media' },
    { name: 'media.read', description: 'Voir les médias', module: 'media' },
    { name: 'media.delete', description: 'Supprimer les médias', module: 'media' },

    // Settings
    { name: 'settings.read', description: 'Voir les paramètres', module: 'settings' },
    { name: 'settings.update', description: 'Modifier les paramètres', module: 'settings' },

    // SEO
    { name: 'seo.read', description: 'Voir les paramètres SEO', module: 'seo' },
    { name: 'seo.update', description: 'Modifier les paramètres SEO', module: 'seo' },

    // Footer
    { name: 'footer.read', description: 'Voir le footer', module: 'footer' },
    { name: 'footer.update', description: 'Modifier le footer', module: 'footer' },
];

async function main() {
    console.log('🌱 Starting seed...');

    // Create permissions
    console.log('📝 Creating permissions...');
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { name: perm.name },
            update: perm,
            create: perm,
        });
    }

    // Create roles
    console.log('👥 Creating roles...');

    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: { description: 'Administrateur avec tous les droits' },
        create: {
            name: 'Admin',
            description: 'Administrateur avec tous les droits',
        },
    });

    const writerRole = await prisma.role.upsert({
        where: { name: 'Écrivain' },
        update: { description: 'Peut créer et gérer les articles' },
        create: {
            name: 'Écrivain',
            description: 'Peut créer et gérer les articles',
        },
    });

    const assistantRole = await prisma.role.upsert({
        where: { name: 'Assistant' },
        update: { description: 'Accès en lecture seule' },
        create: {
            name: 'Assistant',
            description: 'Accès en lecture seule',
        },
    });

    // Assign all permissions to Admin
    console.log('🔐 Assigning permissions to Admin...');
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id },
            },
            update: {},
            create: { roleId: adminRole.id, permissionId: perm.id },
        });
    }

    // Assign writer permissions
    console.log('🔐 Assigning permissions to Écrivain...');
    const writerPermNames = [
        'articles.create', 'articles.read', 'articles.update', 'articles.delete',
        'categories.read',
        'media.create', 'media.read', 'media.delete',
    ];
    const writerPerms = await prisma.permission.findMany({
        where: { name: { in: writerPermNames } },
    });
    for (const perm of writerPerms) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: { roleId: writerRole.id, permissionId: perm.id },
            },
            update: {},
            create: { roleId: writerRole.id, permissionId: perm.id },
        });
    }

    // Assign assistant permissions (read only)
    console.log('🔐 Assigning permissions to Assistant...');
    const assistantPermNames = [
        'articles.read', 'categories.read', 'media.read',
    ];
    const assistantPerms = await prisma.permission.findMany({
        where: { name: { in: assistantPermNames } },
    });
    for (const perm of assistantPerms) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: { roleId: assistantRole.id, permissionId: perm.id },
            },
            update: {},
            create: { roleId: assistantRole.id, permissionId: perm.id },
        });
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin123!',
        12
    );

    await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL || 'admin@sihsolutions.com' },
        update: {},
        create: {
            email: process.env.ADMIN_EMAIL || 'admin@sihsolutions.com',
            password: hashedPassword,
            firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
            lastName: process.env.ADMIN_LAST_NAME || 'SIH',
            roleId: adminRole.id,
            isActive: true,
        },
    });

    // Create default site settings
    console.log('⚙️ Creating default settings...');
    const defaultSettings = [
        { key: 'site_name', value: 'SIH Solutions', type: 'string' },
        { key: 'site_description', value: 'Votre source d\'actualités', type: 'string' },
        { key: 'site_logo', value: '', type: 'string' },
        { key: 'primary_color', value: '#1e40af', type: 'string' },
        { key: 'secondary_color', value: '#dc2626', type: 'string' },
        { key: 'accent_color', value: '#f59e0b', type: 'string' },
        { key: 'contact_email', value: 'contact@sihsolutions.com', type: 'string' },
        { key: 'contact_phone', value: '', type: 'string' },
        { key: 'contact_address', value: '', type: 'string' },
        { key: 'social_facebook', value: '', type: 'string' },
        { key: 'social_twitter', value: '', type: 'string' },
        { key: 'social_instagram', value: '', type: 'string' },
        { key: 'social_linkedin', value: '', type: 'string' },
        { key: 'social_youtube', value: '', type: 'string' },
    ];

    for (const setting of defaultSettings) {
        await prisma.siteSetting.upsert({
            where: { key: setting.key },
            update: {},
            create: setting,
        });
    }

    // Create default Global SEO
    console.log('🔍 Creating default SEO settings...');
    const existingSeo = await prisma.globalSEO.findFirst();
    if (!existingSeo) {
        await prisma.globalSEO.create({
            data: {
                siteName: 'SIH Solutions',
                defaultTitle: 'SIH Solutions - Actualités',
                defaultDescription: 'Votre source d\'actualités et d\'informations',
            },
        });
    }

    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
