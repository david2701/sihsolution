// Public API client for the frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    status: string;
    views: number;
    publishedAt?: string;
    createdAt: string;
    category?: { id: string; name: string; slug: string };
    author: { id: string; firstName: string; lastName: string; avatar?: string };
    tags?: { id: string; name: string; slug: string }[];
    seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string; keywords?: string };
}

export interface Video {
    id: string;
    title: string;
    description?: string;
    embedCode: string;
    thumbnail?: string;
    isFeatured: boolean;
}

export interface Podcast {
    id: string;
    title: string;
    description?: string;
    embedCode: string;
    coverImage?: string;
    duration?: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
}

export interface SiteSettings {
    site_name?: string;
    site_logo?: string;
    site_description?: string;
    primary_color?: string;
    secondary_color?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    social_facebook?: string;
    social_twitter?: string;
    social_instagram?: string;
    social_youtube?: string;
}

// Fetch articles with optional filters
export async function getArticles(options?: {
    status?: string;
    categoryId?: string;
    limit?: number;
    page?: number;
}): Promise<{ articles: Article[]; pagination: any }> {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.categoryId) params.set('categoryId', options.categoryId);
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.page) params.set('page', String(options.page));
    params.set('status', 'PUBLISHED'); // Only published articles for public

    try {
        const res = await fetch(`${API_URL}/api/articles?${params}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch articles');
        return res.json();
    } catch {
        return { articles: [], pagination: { total: 0, pages: 0 } };
    }
}

// Fetch single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${API_URL}/api/articles/${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// Fetch videos
export async function getVideos(limit?: number): Promise<Video[]> {
    try {
        const params = new URLSearchParams();
        if (limit) params.set('limit', String(limit));
        params.set('isActive', 'true');
        const res = await fetch(`${API_URL}/api/videos?${params}`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.videos || [];
    } catch {
        return [];
    }
}

// Fetch podcasts
export async function getPodcasts(limit?: number): Promise<Podcast[]> {
    try {
        const params = new URLSearchParams();
        if (limit) params.set('limit', String(limit));
        params.set('isActive', 'true');
        const res = await fetch(`${API_URL}/api/podcasts?${params}`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.podcasts || [];
    } catch {
        return [];
    }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 300 } });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

// Fetch banners
export async function getBanners(): Promise<Banner[]> {
    try {
        const res = await fetch(`${API_URL}/api/banners?isActive=true`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 300 } });
        if (!res.ok) return {};
        return res.json();
    } catch {
        return {};
    }
}

// Subscribe to newsletter
export async function subscribeNewsletter(email: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return res.ok;
    } catch {
        return false;
    }
}

// Submit contact form
export async function submitContact(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
}): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.ok;
    } catch {
        return false;
    }
}

// Increment article views
export async function incrementViews(articleId: string): Promise<void> {
    try {
        await fetch(`${API_URL}/api/articles/${articleId}/view`, { method: 'POST' });
    } catch {
        // Ignore errors
    }
}

// Format date in French
export function formatDate(date: string): string {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "À l'instant";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Calculate reading time
export function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lecture`;
}
