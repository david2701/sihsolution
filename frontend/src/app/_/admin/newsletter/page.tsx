'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Mail, Trash2, Download, Users } from 'lucide-react';

interface Subscriber { id: string; email: string; isActive: boolean; subscribedAt: string; }

export default function NewsletterPage() {
    const { hasPermission } = useAuth();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => { fetchSubscribers(); }, [pagination.page]);

    const fetchSubscribers = async () => {
        const res = await apiRequest(`/api/newsletter?page=${pagination.page}&limit=50`);
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setPagination(p => ({ ...p, pages: data.pagination?.pages || 1, total: data.pagination?.total || 0 }));
        setLoading(false);
    };

    const handleDelete = async (id: string) => { if (!confirm('Supprimer cet abonné ?')) return; await apiRequest(`/api/newsletter/${id}`, { method: 'DELETE' }); fetchSubscribers(); };

    const handleExport = () => { window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/newsletter/export?isActive=true`, '_blank'); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Newsletter</h1><p className="text-slate-500">{pagination.total} abonné(s)</p></div>
                <button onClick={handleExport} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700"><Download className="w-5 h-5" />Exporter CSV</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : subscribers.length === 0 ? (
                    <div className="p-8 text-center text-slate-500"><Users className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucun abonné</p></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b"><tr><th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th><th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th><th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th><th className="px-6 py-3"></th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                            {subscribers.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium">{sub.email}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{sub.isActive ? 'Actif' : 'Inactif'}</span></td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-6 py-4 text-right">{hasPermission('newsletter.delete') && <button onClick={() => handleDelete(sub.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
