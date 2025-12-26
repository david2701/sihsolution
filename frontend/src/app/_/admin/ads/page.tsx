'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, Megaphone, ExternalLink } from 'lucide-react';

interface Ad { id: string; name: string; position: string; imageUrl?: string; htmlCode?: string; linkUrl?: string; isActive: boolean; startDate?: string; endDate?: string; }

export default function AdsPage() {
    const { hasPermission } = useAuth();
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Ad | null>(null);
    const [formData, setFormData] = useState({ name: '', position: 'sidebar', imageUrl: '', htmlCode: '', linkUrl: '', isActive: true, startDate: '', endDate: '' });

    useEffect(() => { fetchAds(); }, []);

    const fetchAds = async () => { const res = await apiRequest('/api/ads'); setAds(await res.json()); setLoading(false); };

    const openCreate = () => { setEditing(null); setFormData({ name: '', position: 'sidebar', imageUrl: '', htmlCode: '', linkUrl: '', isActive: true, startDate: '', endDate: '' }); setShowModal(true); };
    const openEdit = (a: Ad) => { setEditing(a); setFormData({ name: a.name, position: a.position, imageUrl: a.imageUrl || '', htmlCode: a.htmlCode || '', linkUrl: a.linkUrl || '', isActive: a.isActive, startDate: a.startDate?.split('T')[0] || '', endDate: a.endDate?.split('T')[0] || '' }); setShowModal(true); };

    const handleSubmit = async () => {
        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `/api/ads/${editing.id}` : '/api/ads';
        const payload = { ...formData, startDate: formData.startDate || null, endDate: formData.endDate || null };
        const res = await apiRequest(url, { method, body: JSON.stringify(payload) });
        if (res.ok) { setShowModal(false); fetchAds(); } else { alert((await res.json()).error); }
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/ads/${id}`, { method: 'DELETE' }); fetchAds(); };

    const positions = ['header', 'sidebar', 'inline', 'footer', 'popup'];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Publicités</h1><p className="text-slate-500">{ads.length} publicité(s)</p></div>
                {hasPermission('ads.create') && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouvelle publicité</button>}
            </div>

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : ads.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500"><Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucune publicité</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ads.map(ad => (
                        <div key={ad.id} className="bg-white rounded-xl shadow-sm border p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div><h3 className="font-semibold">{ad.name}</h3><p className="text-sm text-slate-500 capitalize">{ad.position}</p></div>
                                <span className={`px-2 py-1 rounded text-xs ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{ad.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                            {ad.imageUrl && <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-3"><img src={ad.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-slate-400">{ad.startDate && `Du ${new Date(ad.startDate).toLocaleDateString('fr-FR')}`}{ad.endDate && ` au ${new Date(ad.endDate).toLocaleDateString('fr-FR')}`}</div>
                                <div className="flex gap-1">{hasPermission('ads.update') && <button onClick={() => openEdit(ad)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>}{hasPermission('ads.delete') && <button onClick={() => handleDelete(ad.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">{editing ? 'Modifier' : 'Nouvelle publicité'}</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Nom *</label><input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Position *</label><select value={formData.position} onChange={e => setFormData(p => ({ ...p, position: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">{positions.map(pos => <option key={pos} value={pos} className="capitalize">{pos}</option>)}</select></div>
                            <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={formData.imageUrl} onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Ou code HTML</label><textarea value={formData.htmlCode} onChange={e => setFormData(p => ({ ...p, htmlCode: e.target.value }))} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows={3} /></div>
                            <div><label className="block text-sm font-medium mb-1">Lien (URL)</label><input value={formData.linkUrl} onChange={e => setFormData(p => ({ ...p, linkUrl: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Date début</label><input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Date fin</label><input type="date" value={formData.endDate} onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div></div>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />Active</label>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editing ? 'Modifier' : 'Créer'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
