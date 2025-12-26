'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, Save, Footprints, Link as LinkIcon, X } from 'lucide-react';

interface FooterLink { id: string; label: string; url: string; order: number; }
interface FooterSection { id: string; title: string; content?: string; order: number; links: FooterLink[]; }

export default function FooterPage() {
    const { hasPermission } = useAuth();
    const [sections, setSections] = useState<FooterSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [newSection, setNewSection] = useState({ title: '', content: '' });
    const [showCreate, setShowCreate] = useState(false);
    const [newLink, setNewLink] = useState<{ sectionId: string; label: string; url: string } | null>(null);

    useEffect(() => { fetchFooter(); }, []);

    const fetchFooter = async () => { const res = await apiRequest('/api/footer'); const data = await res.json(); setSections(data.sections || []); setLoading(false); };

    const createSection = async () => {
        if (!newSection.title) return;
        await apiRequest('/api/footer/sections', { method: 'POST', body: JSON.stringify(newSection) });
        setNewSection({ title: '', content: '' });
        setShowCreate(false);
        fetchFooter();
    };

    const deleteSection = async (id: string) => { if (!confirm('Supprimer cette section ?')) return; await apiRequest(`/api/footer/sections/${id}`, { method: 'DELETE' }); fetchFooter(); };

    const addLink = async () => {
        if (!newLink?.label || !newLink?.url) return;
        await apiRequest(`/api/footer/sections/${newLink.sectionId}/links`, { method: 'POST', body: JSON.stringify({ label: newLink.label, url: newLink.url }) });
        setNewLink(null);
        fetchFooter();
    };

    const deleteLink = async (id: string) => { await apiRequest(`/api/footer/links/${id}`, { method: 'DELETE' }); fetchFooter(); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Footer</h1><p className="text-slate-500">{sections.length} section(s)</p></div>
                {hasPermission('footer.update') && <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouvelle section</button>}
            </div>

            {showCreate && (
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h3 className="font-semibold mb-4">Nouvelle section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><input value={newSection.title} onChange={e => setNewSection(p => ({ ...p, title: e.target.value }))} className="px-4 py-2.5 border rounded-lg" placeholder="Titre *" /><input value={newSection.content} onChange={e => setNewSection(p => ({ ...p, content: e.target.value }))} className="px-4 py-2.5 border rounded-lg" placeholder="Contenu (optionnel)" /></div>
                    <div className="flex gap-2 justify-end"><button onClick={() => setShowCreate(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={createSection} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Créer</button></div>
                </div>
            )}

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : sections.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500"><Footprints className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucune section</p></div>
            ) : (
                <div className="space-y-6">
                    {sections.map(section => (
                        <div key={section.id} className="bg-white rounded-xl shadow-sm border">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold">{section.title}</h3>
                                <div className="flex gap-1">{hasPermission('footer.update') && <button onClick={() => deleteSection(section.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                            </div>
                            <div className="p-4">
                                {section.content && <p className="text-sm text-slate-500 mb-4">{section.content}</p>}
                                <div className="space-y-2">
                                    {section.links.map(link => (
                                        <div key={link.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                            <LinkIcon className="w-4 h-4 text-slate-400" />
                                            <span className="flex-1">{link.label}</span>
                                            <span className="text-sm text-slate-400 truncate max-w-xs">{link.url}</span>
                                            {hasPermission('footer.update') && <button onClick={() => deleteLink(link.id)} className="p-1 text-slate-400 hover:text-red-600"><X className="w-4 h-4" /></button>}
                                        </div>
                                    ))}
                                </div>
                                {hasPermission('footer.update') && (
                                    newLink?.sectionId === section.id ? (
                                        <div className="mt-4 flex gap-2"><input value={newLink.label} onChange={e => setNewLink(p => p ? { ...p, label: e.target.value } : null)} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="Label" /><input value={newLink.url} onChange={e => setNewLink(p => p ? { ...p, url: e.target.value } : null)} className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="URL" /><button onClick={addLink} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Ajouter</button><button onClick={() => setNewLink(null)} className="px-3 py-2 hover:bg-slate-100 rounded-lg text-sm">Annuler</button></div>
                                    ) : (
                                        <button onClick={() => setNewLink({ sectionId: section.id, label: '', url: '' })} className="mt-4 text-sm text-blue-600 hover:underline">+ Ajouter un lien</button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
