'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, ImageIcon, GripVertical } from 'lucide-react';

interface Banner { id: string; title: string; subtitle?: string; imageUrl: string; linkUrl?: string; order: number; isActive: boolean; }

export default function BannersPage() {
    const { hasPermission } = useAuth();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({ title: '', subtitle: '', imageUrl: '', linkUrl: '', isActive: true });

    useEffect(() => { fetchBanners(); }, []);

    const fetchBanners = async () => { const res = await apiRequest('/api/banners'); setBanners(await res.json()); setLoading(false); };

    const openCreate = () => { setEditing(null); setFormData({ title: '', subtitle: '', imageUrl: '', linkUrl: '', isActive: true }); setShowModal(true); };
    const openEdit = (b: Banner) => { setEditing(b); setFormData({ title: b.title, subtitle: b.subtitle || '', imageUrl: b.imageUrl, linkUrl: b.linkUrl || '', isActive: b.isActive }); setShowModal(true); };

    const handleSubmit = async () => {
        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `/api/banners/${editing.id}` : '/api/banners';
        const res = await apiRequest(url, { method, body: JSON.stringify(formData) });
        if (res.ok) { setShowModal(false); fetchBanners(); } else { alert((await res.json()).error); }
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/banners/${id}`, { method: 'DELETE' }); fetchBanners(); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Bannières</h1><p className="text-slate-500">{banners.length} bannière(s)</p></div>
                {hasPermission('banners.create') && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouvelle bannière</button>}
            </div>

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : banners.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500"><ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucune bannière</p></div>
            ) : (
                <div className="space-y-4">
                    {banners.map(banner => (
                        <div key={banner.id} className="bg-white rounded-xl shadow-sm border flex gap-4 p-4">
                            <div className="w-40 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0"><img src={banner.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{banner.title}</h3>
                                <p className="text-sm text-slate-500">{banner.subtitle || 'Pas de sous-titre'}</p>
                                <span className={`mt-2 inline-block px-2 py-1 rounded text-xs ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{banner.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div className="flex gap-1">{hasPermission('banners.update') && <button onClick={() => openEdit(banner)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>}{hasPermission('banners.delete') && <button onClick={() => handleDelete(banner.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
                        <h2 className="text-xl font-bold mb-6">{editing ? 'Modifier' : 'Nouvelle bannière'}</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Titre *</label><input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Sous-titre</label><input value={formData.subtitle} onChange={e => setFormData(p => ({ ...p, subtitle: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Image URL *</label><input value={formData.imageUrl} onChange={e => setFormData(p => ({ ...p, imageUrl: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Lien (URL)</label><input value={formData.linkUrl} onChange={e => setFormData(p => ({ ...p, linkUrl: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />Active</label>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editing ? 'Modifier' : 'Créer'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
