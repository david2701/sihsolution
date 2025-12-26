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

    // =============================================
    // DEMO CONTENT
    // =============================================
    console.log('📰 Creating demo categories...');
    const categories = [
        { name: 'Politique', slug: 'politique', description: 'Actualités politiques nationales et internationales', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800' },
        { name: 'Économie', slug: 'economie', description: 'Marchés financiers, entreprises et tendances économiques', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800' },
        { name: 'Technologie', slug: 'technologie', description: 'Innovations, startups et actualités tech', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
        { name: 'Sport', slug: 'sport', description: 'Football, basketball, tennis et autres sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800' },
        { name: 'Culture', slug: 'culture', description: 'Musique, cinéma, art et événements culturels', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800' },
    ];

    const createdCategories: { id: string; slug: string }[] = [];
    for (const cat of categories) {
        const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
        if (!existing) {
            const created = await prisma.category.create({ data: cat });
            createdCategories.push({ id: created.id, slug: created.slug });
        } else {
            createdCategories.push({ id: existing.id, slug: existing.slug });
        }
    }

    // Get admin user for articles
    const adminUser = await prisma.user.findUnique({
        where: { email: process.env.ADMIN_EMAIL || 'admin@sihsolutions.com' }
    });

    if (adminUser) {
        console.log('📝 Creating demo articles...');
        const articleTemplates = [
            { title: 'Les nouvelles réformes gouvernementales', category: 'politique', excerpt: 'Analyse des dernières mesures annoncées par le gouvernement.' },
            { title: 'Élections régionales : les enjeux', category: 'politique', excerpt: 'Tour d\'horizon des candidats et des programmes.' },
            { title: 'Relations internationales en mutation', category: 'politique', excerpt: 'Comment les alliances géopolitiques évoluent-elles ?' },
            { title: 'Le marché boursier en hausse', category: 'economie', excerpt: 'Les indices affichent des gains significatifs cette semaine.' },
            { title: 'Start-ups : les levées de fonds record', category: 'economie', excerpt: 'L\'écosystème entrepreneurial ne connaît pas la crise.' },
            { title: 'Inflation : quelles perspectives ?', category: 'economie', excerpt: 'Les économistes partagent leurs prévisions.' },
            { title: 'L\'IA révolutionne l\'industrie', category: 'technologie', excerpt: 'Comment l\'intelligence artificielle transforme les entreprises.' },
            { title: 'Cybersécurité : les nouvelles menaces', category: 'technologie', excerpt: 'Les experts alertent sur les vulnérabilités émergentes.' },
            { title: 'Smartphones 2025 : quoi de neuf ?', category: 'technologie', excerpt: 'Les innovations à attendre cette année.' },
            { title: 'Victoire historique en finale', category: 'sport', excerpt: 'Un match mémorable qui restera dans les annales.' },
            { title: 'Transferts : le mercato s\'emballe', category: 'sport', excerpt: 'Les dernières rumeurs et confirmations.' },
            { title: 'Jeux Olympiques : préparatifs', category: 'sport', excerpt: 'Les athlètes intensifient leur entraînement.' },
            { title: 'Festival de musique : programmation', category: 'culture', excerpt: 'Les artistes qui enflammeront la scène cet été.' },
            { title: 'Cinéma : les films à ne pas manquer', category: 'culture', excerpt: 'Notre sélection des sorties du mois.' },
            { title: 'Exposition exceptionnelle au musée', category: 'culture', excerpt: 'Une rétrospective unique à découvrir.' },
        ];

        const loremContent = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <h2>Les points clés</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
        <ul><li>Premier point important</li><li>Deuxième élément à retenir</li><li>Conclusion et perspectives</li></ul>
        <h2>Analyse approfondie</h2>
        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>`;

        for (let i = 0; i < articleTemplates.length; i++) {
            const template = articleTemplates[i];
            const category = createdCategories.find(c => c.slug === template.category);
            const slug = template.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

            const existing = await prisma.article.findUnique({ where: { slug } });
            if (!existing && category) {
                await prisma.article.create({
                    data: {
                        title: template.title,
                        slug,
                        content: loremContent,
                        excerpt: template.excerpt,
                        featuredImage: `https://picsum.photos/seed/${i + 1}/800/400`,
                        categoryId: category.id,
                        authorId: adminUser.id,
                        status: 'PUBLISHED',
                        publishedAt: new Date(),
                        views: Math.floor(Math.random() * 5000),
                    },
                });
            }
        }
    }

    console.log('🖼️ Creating demo banners...');
    const banners = [
        { title: 'Bienvenue sur SIH Solutions', subtitle: 'Votre source d\'actualités de confiance', imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200', linkUrl: '/articles', order: 1 },
        { title: 'Abonnez-vous à notre newsletter', subtitle: 'Restez informé des dernières actualités', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200', linkUrl: '/newsletter', order: 2 },
        { title: 'Découvrez nos podcasts', subtitle: 'L\'actualité en audio', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200', linkUrl: '/podcasts', order: 3 },
    ];

    for (const banner of banners) {
        const existing = await prisma.banner.findFirst({ where: { title: banner.title } });
        if (!existing) {
            await prisma.banner.create({ data: banner });
        }
    }

    console.log('📄 Creating demo pages...');
    const pages = [
        { title: 'À propos', slug: 'a-propos', content: '<h1>À propos de SIH Solutions</h1><p>SIH Solutions est votre source d\'actualités fiable et indépendante. Fondé en 2020, nous nous engageons à fournir une information de qualité, vérifiée et accessible à tous.</p><h2>Notre mission</h2><p>Informer, analyser et décrypter l\'actualité pour vous aider à comprendre le monde qui vous entoure.</p><h2>Notre équipe</h2><p>Une équipe de journalistes passionnés et expérimentés, dédiés à l\'excellence éditoriale.</p>', isActive: true, order: 1 },
        { title: 'Contact', slug: 'contact', content: '<h1>Contactez-nous</h1><p>Nous sommes à votre écoute. N\'hésitez pas à nous contacter pour toute question, suggestion ou collaboration.</p><h2>Email</h2><p>contact@sihsolutions.com</p><h2>Adresse</h2><p>123 Rue de la Presse, 75001 Paris, France</p>', isActive: true, order: 2 },
        { title: 'Mentions légales', slug: 'mentions-legales', content: '<h1>Mentions légales</h1><p>Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance en l\'économie numérique.</p><h2>Éditeur</h2><p>SIH Solutions SARL</p><h2>Hébergeur</h2><p>Hébergé en France</p>', isActive: true, order: 3 },
    ];

    for (const page of pages) {
        const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
        if (!existing) {
            await prisma.page.create({ data: page });
        }
    }

    console.log('📺 Creating demo videos...');
    const videos = [
        { title: 'L\'interview exclusive', description: 'Rencontre avec les acteurs de l\'actualité', embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>', thumbnail: 'https://picsum.photos/seed/vid1/400/225', isFeatured: true },
        { title: 'Le débat de la semaine', description: 'Analyse et confrontation des idées', embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>', thumbnail: 'https://picsum.photos/seed/vid2/400/225', isFeatured: false },
    ];

    for (const video of videos) {
        const existing = await prisma.video.findFirst({ where: { title: video.title } });
        if (!existing) {
            await prisma.video.create({ data: { ...video, publishedAt: new Date() } });
        }
    }

    console.log('🎙️ Creating demo podcasts...');
    const podcasts = [
        { title: 'Le podcast du matin', description: 'Votre briefing quotidien en 10 minutes', embedCode: '<iframe src="https://open.spotify.com/embed/show/example" width="100%" height="232" frameborder="0"></iframe>', coverImage: 'https://picsum.photos/seed/pod1/400/400', duration: 600 },
        { title: 'Décryptage hebdo', description: 'L\'analyse approfondie de la semaine', embedCode: '<iframe src="https://open.spotify.com/embed/show/example" width="100%" height="232" frameborder="0"></iframe>', coverImage: 'https://picsum.photos/seed/pod2/400/400', duration: 2400 },
    ];

    for (const podcast of podcasts) {
        const existing = await prisma.podcast.findFirst({ where: { title: podcast.title } });
        if (!existing) {
            await prisma.podcast.create({ data: { ...podcast, publishedAt: new Date() } });
        }
    }

    console.log('📢 Creating demo ads...');
    const ads = [
        { name: 'Sidebar Ad 1', position: 'sidebar', imageUrl: 'https://picsum.photos/seed/ad1/300/250', linkUrl: 'https://example.com', isActive: true },
        { name: 'Header Ad', position: 'header', imageUrl: 'https://picsum.photos/seed/ad2/728/90', linkUrl: 'https://example.com', isActive: true },
    ];

    for (const ad of ads) {
        const existing = await prisma.ad.findFirst({ where: { name: ad.name } });
        if (!existing) {
            await prisma.ad.create({ data: ad });
        }
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
