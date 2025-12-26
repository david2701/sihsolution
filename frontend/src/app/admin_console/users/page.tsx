'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, Users as UsersIcon, Shield, Eye, EyeOff } from 'lucide-react';

interface Role { id: string; name: string; }
interface User { id: string; email: string; firstName: string; lastName: string; role: Role; isActive: boolean; createdAt: string; }

export default function UsersPage() {
    const { hasPermission, user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', roleId: '', isActive: true });

    useEffect(() => { fetchUsers(); fetchRoles(); }, []);

    const fetchUsers = async () => { const res = await apiRequest('/api/users'); setUsers(await res.json()); setLoading(false); };
    const fetchRoles = async () => { const res = await apiRequest('/api/roles'); setRoles(await res.json()); };

    const openCreate = () => { setEditingUser(null); setFormData({ email: '', password: '', firstName: '', lastName: '', roleId: roles[0]?.id || '', isActive: true }); setShowModal(true); };
    const openEdit = (user: User) => { setEditingUser(user); setFormData({ email: user.email, password: '', firstName: user.firstName, lastName: user.lastName, roleId: user.role.id, isActive: user.isActive }); setShowModal(true); };

    const handleSubmit = async () => {
        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
        const payload: any = { firstName: formData.firstName, lastName: formData.lastName, roleId: formData.roleId, isActive: formData.isActive };
        if (!editingUser) { payload.email = formData.email; payload.password = formData.password; } else if (formData.password) { payload.password = formData.password; }
        const res = await apiRequest(url, { method, body: JSON.stringify(payload) });
        if (res.ok) { setShowModal(false); fetchUsers(); } else { alert((await res.json()).error); }
    };

    const handleDelete = async (id: string) => { if (id === currentUser?.id) return alert('Impossible'); if (!confirm('Supprimer ?')) return; await apiRequest(`/api/users/${id}`, { method: 'DELETE' }); fetchUsers(); };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1><p className="text-slate-500">{users.length} utilisateur(s)</p></div>
                {hasPermission('users.create') && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"><Plus className="w-5 h-5" />Nouvel utilisateur</button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? <div className="col-span-full p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : users.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{user.firstName[0]}{user.lastName[0]}</div>
                            <div className="flex-1 min-w-0"><p className="font-semibold text-slate-900">{user.firstName} {user.lastName}</p><p className="text-sm text-slate-500">{user.email}</p><div className="flex items-center gap-1.5 mt-2"><Shield className="w-4 h-4 text-slate-400" /><span className="text-sm">{user.role.name}</span></div></div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between"><span className="text-xs text-slate-400">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                            <div className="flex gap-1">{hasPermission('users.update') && <button onClick={() => openEdit(user)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>}{hasPermission('users.delete') && user.id !== currentUser?.id && <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
                        <h2 className="text-xl font-bold mb-6">{editingUser ? 'Modifier' : 'Créer'}</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4"><input value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} className="px-3 py-2 border rounded-lg" placeholder="Prénom" /><input value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} className="px-3 py-2 border rounded-lg" placeholder="Nom" /></div>
                            {!editingUser && <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Email" />}
                            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Mot de passe" />
                            <select value={formData.roleId} onChange={e => setFormData(p => ({ ...p, roleId: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))} />Actif</label>
                        </div>
                        <div className="mt-6 flex gap-3 justify-end"><button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingUser ? 'Modifier' : 'Créer'}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
