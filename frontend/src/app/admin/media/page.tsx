'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Image, Trash2, Upload, Search, Copy, Check } from 'lucide-react';

interface MediaItem { id: string; filename: string; originalName: string; mimeType: string; size: number; path: string; alt?: string; createdAt: string; }

export default function MediaPage() {
    const { hasPermission } = useAuth();
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => { fetchMedia(); }, [search]);

    const fetchMedia = async () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        const res = await apiRequest(`/api/media?${params}`);
        const data = await res.json();
        setMedia(data.media || []);
        setLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        setUploading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) formData.append('files', files[i]);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/media/upload-multiple`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        });
        setUploading(false);
        fetchMedia();
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/media/${id}`, { method: 'DELETE' }); fetchMedia(); };

    const copyUrl = (path: string) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${path}`;
        navigator.clipboard.writeText(url);
        setCopied(path);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatSize = (bytes: number) => { if (bytes < 1024) return bytes + ' B'; if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / 1048576).toFixed(1) + ' MB'; };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Médiathèque</h1><p className="text-slate-500">{media.length} fichier(s)</p></div>
                {hasPermission('media.create') && (
                    <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 cursor-pointer">
                        <Upload className="w-5 h-5" />{uploading ? 'Upload...' : 'Uploader'}
                        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg" /></div>
            </div>

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : media.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500"><Image className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucun média</p></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                            <div className="aspect-square bg-slate-100 relative">
                                <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${item.path}`} alt={item.alt || ''} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => copyUrl(item.path)} className="p-2 bg-white rounded-lg">{copied === item.path ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}</button>
                                    {hasPermission('media.delete') && <button onClick={() => handleDelete(item.id)} className="p-2 bg-white rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>}
                                </div>
                            </div>
                            <div className="p-2"><p className="text-xs text-slate-600 truncate">{item.originalName}</p><p className="text-xs text-slate-400">{formatSize(item.size)}</p></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
