'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Image,
    X,
    Search,
    Plus,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

// Utility to generate slug from title
const slugify = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
        .replace(/\s+/g, '-')            // Replace spaces with -
        .replace(/-+/g, '-')             // Replace multiple - with single -
        .trim();
};

interface Category {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

export default function ArticleEditor() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';
    const articleId = isNew ? null : (params.id as string);

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        categoryId: '',
        status: 'DRAFT',
        tagIds: [] as string[],
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: '',
        },
    });

    useEffect(() => {
        fetchCategories();
        fetchTags();
        if (articleId) {
            fetchArticle();
        }
    }, [articleId]);

    const fetchCategories = async () => {
        const res = await apiRequest('/api/categories');
        const data = await res.json();
        setCategories(data);
    };

    const fetchTags = async () => {
        const res = await apiRequest('/api/tags');
        const data = await res.json();
        setAllTags(data);
    };

    const fetchArticle = async () => {
        try {
            const res = await apiRequest(`/api/articles/${articleId}`);
            if (res.ok) {
                const article = await res.json();
                setFormData({
                    title: article.title,
                    content: article.content,
                    excerpt: article.excerpt || '',
                    featuredImage: article.featuredImage || '',
                    categoryId: article.categoryId || '',
                    status: article.status,
                    tagIds: article.tags?.map((t: Tag) => t.id) || [],
                    seo: {
                        metaTitle: article.seo?.metaTitle || '',
                        metaDescription: article.seo?.metaDescription || '',
                        keywords: article.seo?.keywords || '',
                    },
                });
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? '/api/articles' : `/api/articles/${articleId}`;

            const res = await apiRequest(url, {
                method,
                body: JSON.stringify({
                    ...formData,
                    categoryId: formData.categoryId || null,
                }),
            });

            if (res.ok) {
                router.push('/admin/articles');
            } else {
                const error = await res.json();
                alert(error.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const toggleTag = (tagId: string) => {
        setFormData(prev => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter(id => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin_console/articles"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isNew ? 'Nouvel article' : 'Modifier l\'article'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Titre *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        title: newTitle,
                                        // Auto-generate slug for new articles
                                        ...(isNew ? { seo: { ...prev.seo, metaTitle: prev.seo.metaTitle || newTitle } } : {})
                                    }));
                                }}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Titre de l'article"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Contenu *</label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                placeholder="Écrivez le contenu de l'article..."
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Extrait</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Court résumé de l'article"
                            />
                        </div>

                        {/* SEO */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">SEO</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Meta titre</label>
                                    <input
                                        type="text"
                                        value={formData.seo.metaTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Titre pour les moteurs de recherche"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Meta description</label>
                                    <textarea
                                        value={formData.seo.metaDescription}
                                        onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                        placeholder="Description pour les moteurs de recherche"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Mots-clés</label>
                                    <input
                                        type="text"
                                        value={formData.seo.keywords}
                                        onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }))}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="mot1, mot2, mot3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="DRAFT">Brouillon</option>
                                <option value="PUBLISHED">Publié</option>
                                <option value="ARCHIVED">Archivé</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Aucune catégorie</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Image à la une</label>
                            {formData.featuredImage ? (
                                <div className="relative">
                                    <img
                                        src={formData.featuredImage}
                                        alt="Featured"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={formData.featuredImage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="URL de l'image"
                                />
                            )}
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.tagIds.includes(tag.id)
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                                {allTags.length === 0 && (
                                    <p className="text-sm text-slate-500">Aucun tag disponible</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
