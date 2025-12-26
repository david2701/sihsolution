'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit2, Trash2, FileText, Eye, EyeOff } from 'lucide-react';

interface Page { id: string; title: string; slug: string; content: string; isActive: boolean; order: number; }

export default function PagesPage() {
    const { hasPermission } = useAuth();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Page | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '', isActive: true, order: 0 });

    useEffect(() => { fetchPages(); }, []);

    const fetchPages = async () => { const res = await apiRequest('/api/pages'); setPages(await res.json()); setLoading(false); };

    const openCreate = () => { setEditing(null); setFormData({ title: '', content: '', isActive: true, order: 0 }); setShowModal(true); };
    const openEdit = (p: Page) => { setEditing(p); setFormData({ title: p.title, content: p.content, isActive: p.isActive, order: p.order }); setShowModal(true); };

    const handleSubmit = async () => {
        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `/api/pages/${editing.id}` : '/api/pages';
        const res = await apiRequest(url, { method, body: JSON.stringify(formData) });
        if (res.ok) { setShowModal(false); fetchPages(); } else { alert((await res.json()).error); }
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/pages/${id}`, { method: 'DELETE' }); fetchPages(); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Pages</h1><p className="text-slate-500">{pages.length} page(s)</p></div>
                {hasPermission('pages.create') && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouvelle page</button>}
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : pages.length === 0 ? (
                    <div className="p-8 text-center text-slate-500"><FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucune page</p></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b"><tr><th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Page</th><th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Slug</th><th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th><th className="px-6 py-3"></th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {pages.map(page => (
                                <tr key={page.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium">{page.title}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">/{page.slug}</td>
                                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${page.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{page.isActive ? <><Eye className="w-3 h-3" />Active</> : <><EyeOff className="w-3 h-3" />Inactive</>}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">{hasPermission('pages.update') && <button onClick={() => openEdit(page)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>}{hasPermission('pages.delete') && <button onClick={() => handleDelete(page.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6">{editing ? 'Modifier' : 'Nouvelle page'}</h2>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Titre *</label><input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Contenu *</label><textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={10} /></div>
                            <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />Active</label></div>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editing ? 'Modifier' : 'Créer'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
