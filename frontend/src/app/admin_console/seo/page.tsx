'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Save, Search, Globe } from 'lucide-react';

export default function SEOPage() {
    const { hasPermission } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seo, setSeo] = useState({ siteName: '', defaultTitle: '', defaultDescription: '', defaultOgImage: '', googleAnalyticsId: '', robotsTxt: '', customHeadCode: '' });

    useEffect(() => { fetchSEO(); }, []);

    const fetchSEO = async () => { const res = await apiRequest('/api/seo/global'); setSeo(await res.json()); setLoading(false); };

    const handleSave = async () => {
        setSaving(true);
        await apiRequest('/api/seo/global', { method: 'PUT', body: JSON.stringify(seo) });
        setSaving(false);
        alert('SEO sauvegardé');
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">SEO Global</h1><p className="text-slate-500">Paramètres de référencement</p></div>
                {hasPermission('seo.update') && <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"><Save className="w-5 h-5" />{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>}
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" />Métadonnées par défaut</h3>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Nom du site</label><input value={seo.siteName} onChange={e => setSeo(p => ({ ...p, siteName: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium mb-1">Titre par défaut</label><input value={seo.defaultTitle || ''} onChange={e => setSeo(p => ({ ...p, defaultTitle: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                        <div><label className="block text-sm font-medium mb-1">Description par défaut</label><textarea value={seo.defaultDescription || ''} onChange={e => setSeo(p => ({ ...p, defaultDescription: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg" rows={3} /></div>
                        <div><label className="block text-sm font-medium mb-1">Image OG par défaut (URL)</label><input value={seo.defaultOgImage || ''} onChange={e => setSeo(p => ({ ...p, defaultOgImage: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-green-600" />Analytics & Code</h3>
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Google Analytics ID</label><input value={seo.googleAnalyticsId || ''} onChange={e => setSeo(p => ({ ...p, googleAnalyticsId: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg" placeholder="G-XXXXXXXXXX" /></div>
                        <div><label className="block text-sm font-medium mb-1">robots.txt</label><textarea value={seo.robotsTxt || ''} onChange={e => setSeo(p => ({ ...p, robotsTxt: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg font-mono text-sm" rows={4} /></div>
                        <div><label className="block text-sm font-medium mb-1">Code personnalisé (head)</label><textarea value={seo.customHeadCode || ''} onChange={e => setSeo(p => ({ ...p, customHeadCode: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg font-mono text-sm" rows={4} placeholder="<!-- Scripts, meta tags... -->" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
