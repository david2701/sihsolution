'use client';

import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from '@/lib/auth';
import {
    Plus,
    Edit2,
    Trash2,
    FolderOpen,
    GripVertical,
    X,
    Check,
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    order: number;
    isActive: boolean;
    articleCount: number;
}

export default function CategoriesPage() {
    const { hasPermission } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await apiRequest('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) return;

        const res = await apiRequest('/api/categories', {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setFormData({ name: '', description: '', image: '', isActive: true });
            setShowCreate(false);
            fetchCategories();
        }
    };

    const handleUpdate = async (id: string) => {
        const res = await apiRequest(`/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setEditingId(null);
            setFormData({ name: '', description: '', image: '', isActive: true });
            fetchCategories();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        const res = await apiRequest(`/api/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchCategories();
        } else {
            const error = await res.json();
            alert(error.error || 'Erreur lors de la suppression');
        }
    };

    const startEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            isActive: category.isActive,
        });
        setShowCreate(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', image: '', isActive: true });
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Catégories</h1>
                    <p className="text-slate-500">{categories.length} catégorie(s)</p>
                </div>
                {hasPermission('categories.create') && (
                    <button
                        onClick={() => { setShowCreate(true); setEditingId(null); }}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvelle catégorie
                    </button>
                )}
            </div>

            {/* Create Form */}
            {showCreate && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Nouvelle catégorie</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Nom de la catégorie *"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="URL de l'image"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                        rows={2}
                    />
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 rounded border-slate-300"
                            />
                            <span className="text-sm text-slate-600">Active</span>
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>Aucune catégorie</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {categories.map((category) => (
                            <div key={category.id} className="p-4 hover:bg-slate-50 transition-colors">
                                {editingId === category.id ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="px-4 py-2.5 border border-slate-300 rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                                className="px-4 py-2.5 border border-slate-300 rounded-lg"
                                                placeholder="URL de l'image"
                                            />
                                        </div>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
                                            rows={2}
                                            placeholder="Description"
                                        />
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                    className="w-4 h-4 rounded"
                                                />
                                                <span className="text-sm">Active</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <button onClick={cancelEdit} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleUpdate(category.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {category.image ? (
                                                <img src={category.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <FolderOpen className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-slate-900">{category.name}</p>
                                                {!category.isActive && (
                                                    <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-500 rounded">Inactive</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">{category.articleCount} article(s)</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasPermission('categories.update') && (
                                                <button
                                                    onClick={() => startEdit(category)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {hasPermission('categories.delete') && (
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
