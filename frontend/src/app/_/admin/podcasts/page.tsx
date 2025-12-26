'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, Mic, Headphones } from 'lucide-react';

interface Podcast { id: string; title: string; description?: string; embedCode: string; coverImage?: string; duration?: number; isActive: boolean; createdAt: string; }

export default function PodcastsPage() {
    const { hasPermission } = useAuth();
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Podcast | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', embedCode: '', coverImage: '', duration: 0, isActive: true });

    useEffect(() => { fetchPodcasts(); }, []);

    const fetchPodcasts = async () => { const res = await apiRequest('/api/podcasts'); const data = await res.json(); setPodcasts(data.podcasts || []); setLoading(false); };

    const openCreate = () => { setEditing(null); setFormData({ title: '', description: '', embedCode: '', coverImage: '', duration: 0, isActive: true }); setShowModal(true); };
    const openEdit = (p: Podcast) => { setEditing(p); setFormData({ title: p.title, description: p.description || '', embedCode: p.embedCode, coverImage: p.coverImage || '', duration: p.duration || 0, isActive: p.isActive }); setShowModal(true); };

    const handleSubmit = async () => {
        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `/api/podcasts/${editing.id}` : '/api/podcasts';
        const res = await apiRequest(url, { method, body: JSON.stringify(formData) });
        if (res.ok) { setShowModal(false); fetchPodcasts(); } else { alert((await res.json()).error); }
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/podcasts/${id}`, { method: 'DELETE' }); fetchPodcasts(); };

    const formatDuration = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s.toString().padStart(2, '0')}`; };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Podcasts</h1><p className="text-slate-500">{podcasts.length} podcast(s)</p></div>
                {hasPermission('podcasts.create') && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouveau podcast</button>}
            </div>

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : (
                <div className="space-y-4">
                    {podcasts.map(podcast => (
                        <div key={podcast.id} className="bg-white rounded-xl shadow-sm border flex gap-4 p-4">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {podcast.coverImage ? <img src={podcast.coverImage} alt="" className="w-full h-full object-cover" /> : <Headphones className="w-10 h-10 text-slate-300" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900">{podcast.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{podcast.description || 'Pas de description'}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                    {podcast.duration && <span>{formatDuration(podcast.duration)}</span>}
                                    <span className={podcast.isActive ? 'text-green-600' : ''}>{podcast.isActive ? 'Actif' : 'Inactif'}</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {hasPermission('podcasts.update') && <button onClick={() => openEdit(podcast)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>}
                                {hasPermission('podcasts.delete') && <button onClick={() => handleDelete(podcast.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
                        <h2 className="text-xl font-bold mb-6">{editing ? 'Modifier' : 'Nouveau podcast'}</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Titre *</label><input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Code Embed *</label><textarea value={formData.embedCode} onChange={e => setFormData(p => ({ ...p, embedCode: e.target.value }))} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows={3} placeholder="<iframe>..." /></div>
                            <div><label className="block text-sm font-medium mb-1">Cover Image URL</label><input value={formData.coverImage} onChange={e => setFormData(p => ({ ...p, coverImage: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Durée (secondes)</label><input type="number" value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />Actif</label>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editing ? 'Modifier' : 'Créer'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
