'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, Video, Play, X, Check } from 'lucide-react';

interface VideoItem { id: string; title: string; description?: string; embedCode: string; thumbnail?: string; isFeatured: boolean; isActive: boolean; createdAt: string; }

export default function VideosPage() {
    const { hasPermission } = useAuth();
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<VideoItem | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', embedCode: '', thumbnail: '', isFeatured: false, isActive: true });

    useEffect(() => { fetchVideos(); }, []);

    const fetchVideos = async () => { const res = await apiRequest('/api/videos'); const data = await res.json(); setVideos(data.videos || []); setLoading(false); };

    const openCreate = () => { setEditing(null); setFormData({ title: '', description: '', embedCode: '', thumbnail: '', isFeatured: false, isActive: true }); setShowModal(true); };
    const openEdit = (v: VideoItem) => { setEditing(v); setFormData({ title: v.title, description: v.description || '', embedCode: v.embedCode, thumbnail: v.thumbnail || '', isFeatured: v.isFeatured, isActive: v.isActive }); setShowModal(true); };

    const handleSubmit = async () => {
        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `/api/videos/${editing.id}` : '/api/videos';
        const res = await apiRequest(url, { method, body: JSON.stringify(formData) });
        if (res.ok) { setShowModal(false); fetchVideos(); } else { alert((await res.json()).error); }
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/videos/${id}`, { method: 'DELETE' }); fetchVideos(); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Vidéos</h1><p className="text-slate-500">{videos.length} vidéo(s)</p></div>
                {hasPermission('videos.create') && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouvelle vidéo</button>}
            </div>

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(video => (
                        <div key={video.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="aspect-video bg-slate-100 relative">
                                {video.thumbnail ? <img src={video.thumbnail} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Play className="w-12 h-12 text-slate-300" /></div>}
                                {video.isFeatured && <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">À la une</span>}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 truncate">{video.title}</h3>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{video.description || 'Pas de description'}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`text-xs px-2 py-1 rounded ${video.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{video.isActive ? 'Active' : 'Inactive'}</span>
                                    <div className="flex gap-1">
                                        {hasPermission('videos.update') && <button onClick={() => openEdit(video)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>}
                                        {hasPermission('videos.delete') && <button onClick={() => handleDelete(video.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">{editing ? 'Modifier' : 'Nouvelle vidéo'}</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Titre *</label><input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Code Embed *</label><textarea value={formData.embedCode} onChange={e => setFormData(p => ({ ...p, embedCode: e.target.value }))} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows={4} placeholder="<iframe>..." /></div>
                            <div><label className="block text-sm font-medium mb-1">Thumbnail URL</label><input value={formData.thumbnail} onChange={e => setFormData(p => ({ ...p, thumbnail: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={2} /></div>
                            <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData(p => ({ ...p, isFeatured: e.target.checked }))} />À la une</label><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />Active</label></div>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editing ? 'Modifier' : 'Créer'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
