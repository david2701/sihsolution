'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { MessageSquare, Trash2, Mail, MailOpen, Eye } from 'lucide-react';

interface Message { id: string; name: string; email: string; subject?: string; message: string; isRead: boolean; createdAt: string; }

export default function ContactPage() {
    const { hasPermission } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selected, setSelected] = useState<Message | null>(null);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        const res = await apiRequest('/api/contact');
        const data = await res.json();
        setMessages(data.submissions || []);
        setUnreadCount(data.unreadCount || 0);
        setLoading(false);
    };

    const markAsRead = async (id: string) => { await apiRequest(`/api/contact/${id}/read`, { method: 'PUT' }); fetchMessages(); };
    const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await apiRequest(`/api/contact/${id}`, { method: 'DELETE' }); setSelected(null); fetchMessages(); };

    const openMessage = (msg: Message) => { setSelected(msg); if (!msg.isRead) markAsRead(msg.id); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Messages</h1><p className="text-slate-500">{unreadCount} non lu(s)</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : messages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500"><MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Aucun message</p></div>
                        ) : (
                            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                {messages.map(msg => (
                                    <div key={msg.id} onClick={() => openMessage(msg)} className={`p-4 cursor-pointer hover:bg-slate-50 ${selected?.id === msg.id ? 'bg-blue-50' : ''} ${!msg.isRead ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">{msg.isRead ? <MailOpen className="w-4 h-4 text-slate-400" /> : <Mail className="w-4 h-4 text-blue-600" />}</div>
                                            <div className="min-w-0"><p className={`truncate ${!msg.isRead ? 'font-semibold' : ''}`}>{msg.name}</p><p className="text-sm text-slate-500 truncate">{msg.subject || 'Sans objet'}</p><p className="text-xs text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</p></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selected ? (
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div><h2 className="text-xl font-semibold">{selected.subject || 'Sans objet'}</h2><p className="text-sm text-slate-500">{selected.name} &lt;{selected.email}&gt;</p><p className="text-xs text-slate-400 mt-1">{new Date(selected.createdAt).toLocaleString('fr-FR')}</p></div>
                                {hasPermission('contact.delete') && <button onClick={() => handleDelete(selected.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-5 h-5" /></button>}
                            </div>
                            <div className="prose prose-slate max-w-none"><p className="whitespace-pre-wrap">{selected.message}</p></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500"><Eye className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p>Sélectionnez un message</p></div>
                    )}
                </div>
            </div>
        </div>
    );
}
