'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/auth';
import {
    FileText,
    Users,
    Eye,
    Mail,
    MessageSquare,
    TrendingUp,
    Calendar,
    BarChart3,
} from 'lucide-react';

interface DashboardStats {
    articles: { total: number; published: number; drafts: number };
    users: number;
    subscribers: number;
    messages: { total: number; unread: number };
    views: number;
    recentArticles: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch data in parallel
            const [articlesRes, usersRes, newsletterRes, contactRes] = await Promise.all([
                apiRequest('/api/articles?limit=5'),
                apiRequest('/api/users'),
                apiRequest('/api/newsletter'),
                apiRequest('/api/contact'),
            ]);

            const articles = await articlesRes.json();
            const users = await usersRes.json();
            const newsletter = await newsletterRes.json();
            const contact = await contactRes.json();

            setStats({
                articles: {
                    total: articles.pagination?.total || 0,
                    published: articles.articles?.filter((a: any) => a.status === 'PUBLISHED').length || 0,
                    drafts: articles.articles?.filter((a: any) => a.status === 'DRAFT').length || 0,
                },
                users: Array.isArray(users) ? users.length : 0,
                subscribers: newsletter.pagination?.total || 0,
                messages: {
                    total: contact.pagination?.total || 0,
                    unread: contact.unreadCount || 0,
                },
                views: articles.articles?.reduce((sum: number, a: any) => sum + (a.views || 0), 0) || 0,
                recentArticles: articles.articles || [],
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-64"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">Bienvenue dans votre espace d&apos;administration</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={FileText}
                    label="Articles"
                    value={stats?.articles.total || 0}
                    subtext={`${stats?.articles.published || 0} publiés, ${stats?.articles.drafts || 0} brouillons`}
                    color="blue"
                />
                <StatCard
                    icon={Users}
                    label="Utilisateurs"
                    value={stats?.users || 0}
                    subtext="Équipe éditoriale"
                    color="green"
                />
                <StatCard
                    icon={Mail}
                    label="Abonnés Newsletter"
                    value={stats?.subscribers || 0}
                    subtext="Inscriptions actives"
                    color="purple"
                />
                <StatCard
                    icon={MessageSquare}
                    label="Messages"
                    value={stats?.messages.total || 0}
                    subtext={`${stats?.messages.unread || 0} non lus`}
                    color="orange"
                />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Views Chart Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Statistiques de vues
                        </h2>
                        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2">
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                            <option>12 derniers mois</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p>Total des vues: {stats?.views.toLocaleString() || 0}</p>
                            <p className="text-sm">Graphique disponible prochainement</p>
                        </div>
                    </div>
                </div>

                {/* Recent Articles */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Articles récents
                    </h2>
                    <div className="space-y-4">
                        {stats?.recentArticles.slice(0, 5).map((article: any) => (
                            <div key={article.id} className="flex gap-3 group">
                                <div className="w-16 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    {article.featuredImage && (
                                        <img
                                            src={article.featuredImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm text-slate-900 truncate group-hover:text-blue-600">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {new Date(article.createdAt).toLocaleDateString('fr-FR')} • {article.views || 0} vues
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentArticles || stats.recentArticles.length === 0) && (
                            <p className="text-slate-500 text-sm text-center py-4">Aucun article</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    subtext,
    color,
}: {
    icon: any;
    label: string;
    value: number;
    subtext: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{value.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">{subtext}</p>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
