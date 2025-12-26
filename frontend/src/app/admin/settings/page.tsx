'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Save, Palette, Globe, Mail, Share2 } from 'lucide-react';

export default function SettingsPage() {
    const { hasPermission } = useAuth();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        const res = await apiRequest('/api/settings');
        setSettings(await res.json());
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await apiRequest('/api/settings', { method: 'PUT', body: JSON.stringify(settings) });
        setSaving(false);
        alert('Paramètres sauvegardés');
    };

    const updateSetting = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

    if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Paramètres</h1><p className="text-slate-500">Configuration du site</p></div>
                {hasPermission('settings.update') && <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"><Save className="w-5 h-5" />{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>}
            </div>

            <div className="space-y-6">
                {/* Général */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" />Informations générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Nom du site</label><input value={settings.site_name || ''} onChange={e => updateSetting('site_name', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Logo (URL)</label><input value={settings.site_logo || ''} onChange={e => updateSetting('site_logo', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea value={settings.site_description || ''} onChange={e => updateSetting('site_description', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" rows={2} /></div>
                    </div>
                </div>

                {/* Couleurs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-purple-600" />Couleurs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Couleur principale</label><div className="flex gap-2"><input type="color" value={settings.primary_color || '#1e40af'} onChange={e => updateSetting('primary_color', e.target.value)} className="w-12 h-10 border rounded cursor-pointer" /><input value={settings.primary_color || '#1e40af'} onChange={e => updateSetting('primary_color', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /></div></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Couleur secondaire</label><div className="flex gap-2"><input type="color" value={settings.secondary_color || '#dc2626'} onChange={e => updateSetting('secondary_color', e.target.value)} className="w-12 h-10 border rounded cursor-pointer" /><input value={settings.secondary_color || '#dc2626'} onChange={e => updateSetting('secondary_color', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /></div></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Couleur d&apos;accent</label><div className="flex gap-2"><input type="color" value={settings.accent_color || '#f59e0b'} onChange={e => updateSetting('accent_color', e.target.value)} className="w-12 h-10 border rounded cursor-pointer" /><input value={settings.accent_color || '#f59e0b'} onChange={e => updateSetting('accent_color', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" /></div></div>
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-green-600" />Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" value={settings.contact_email || ''} onChange={e => updateSetting('contact_email', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label><input value={settings.contact_phone || ''} onChange={e => updateSetting('contact_phone', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label><input value={settings.contact_address || ''} onChange={e => updateSetting('contact_address', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" /></div>
                    </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Share2 className="w-5 h-5 text-orange-600" />Réseaux sociaux</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label><input value={settings.social_facebook || ''} onChange={e => updateSetting('social_facebook', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" placeholder="https://facebook.com/..." /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Twitter/X</label><input value={settings.social_twitter || ''} onChange={e => updateSetting('social_twitter', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" placeholder="https://twitter.com/..." /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label><input value={settings.social_instagram || ''} onChange={e => updateSetting('social_instagram', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" placeholder="https://instagram.com/..." /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">YouTube</label><input value={settings.social_youtube || ''} onChange={e => updateSetting('social_youtube', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg" placeholder="https://youtube.com/..." /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
