'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import { Plus, Edit2, Trash2, Shield, Check, X, FileText } from 'lucide-react';

interface Permission { id: string; name: string; description?: string; module: string; }
interface Role { id: string; name: string; description?: string; permissions: Permission[]; }

export default function RolesPage() {
    const { hasPermission } = useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [allPermissions, setAllPermissions] = useState<{ permissions: Permission[]; grouped: Record<string, Permission[]> }>({ permissions: [], grouped: {} });
    const [loading, setLoading] = useState(true);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

    useEffect(() => { fetchRoles(); fetchPermissions(); }, []);

    const fetchRoles = async () => { const res = await apiRequest('/api/roles'); setRoles(await res.json()); setLoading(false); };
    const fetchPermissions = async () => { const res = await apiRequest('/api/roles/permissions'); setAllPermissions(await res.json()); };

    const openEdit = (role: Role) => { setEditingRole(role); setSelectedPerms(role.permissions.map(p => p.id)); };
    const closeEdit = () => { setEditingRole(null); setSelectedPerms([]); };

    const togglePerm = (id: string) => setSelectedPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    const toggleModule = (perms: Permission[]) => {
        const ids = perms.map(p => p.id);
        const allSelected = ids.every(id => selectedPerms.includes(id));
        setSelectedPerms(prev => allSelected ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
    };

    const handleSave = async () => {
        await apiRequest(`/api/roles/${editingRole!.id}/permissions`, { method: 'PUT', body: JSON.stringify({ permissionIds: selectedPerms }) });
        closeEdit();
        fetchRoles();
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div><h1 className="text-2xl font-bold text-slate-900">Rôles & Permissions</h1><p className="text-slate-500">{roles.length} rôle(s)</p></div>
            </div>

            {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div> : editingRole ? (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Modifier : {editingRole.name}</h2>
                        <div className="flex gap-2"><button onClick={closeEdit} className="px-4 py-2 hover:bg-slate-100 rounded-lg">Annuler</button><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Sauvegarder</button></div>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(allPermissions.grouped).map(([module, perms]) => (
                            <div key={module} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <button onClick={() => toggleModule(perms)} className={`w-5 h-5 rounded border flex items-center justify-center ${perms.every(p => selectedPerms.includes(p.id)) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>{perms.every(p => selectedPerms.includes(p.id)) && <Check className="w-3 h-3" />}</button>
                                    <span className="font-semibold capitalize">{module}</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-8">
                                    {perms.map(p => (
                                        <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={selectedPerms.includes(p.id)} onChange={() => togglePerm(p.id)} className="rounded" />{p.description || p.name}</label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roles.map(role => (
                        <div key={role.id} className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center"><Shield className="w-6 h-6 text-white" /></div>
                                <div className="flex-1"><h3 className="font-semibold text-slate-900">{role.name}</h3><p className="text-sm text-slate-500">{role.description || 'Aucune description'}</p><p className="text-xs text-slate-400 mt-2">{role.permissions.length} permission(s)</p></div>
                            </div>
                            {hasPermission('roles.update') && <button onClick={() => openEdit(role)} className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Modifier les permissions</button>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
