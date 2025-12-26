'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Video,
    Mic,
    Image,
    Megaphone,
    ImageIcon,
    Mail,
    MessageSquare,
    Users,
    Shield,
    Settings,
    Search,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Globe,
    Footprints,
} from 'lucide-react';

type MenuItem = { href: string; icon: any; label: string; permission: string | null };
type MenuDivider = { type: 'divider'; label: string };
type MenuEntry = MenuItem | MenuDivider;

const menuItems: MenuEntry[] = [
    { href: '/_/admin', icon: LayoutDashboard, label: 'Tableau de bord', permission: null },
    { type: 'divider', label: 'Contenu' },
    { href: '/_/admin/articles', icon: FileText, label: 'Articles', permission: 'articles.read' },
    { href: '/_/admin/categories', icon: FolderOpen, label: 'Catégories', permission: 'categories.read' },
    { href: '/_/admin/pages', icon: FileText, label: 'Pages', permission: 'pages.read' },
    { href: '/_/admin/videos', icon: Video, label: 'Vidéos', permission: 'videos.read' },
    { href: '/_/admin/podcasts', icon: Mic, label: 'Podcasts', permission: 'podcasts.read' },
    { href: '/_/admin/media', icon: Image, label: 'Médias', permission: 'media.read' },
    { type: 'divider', label: 'Marketing' },
    { href: '/_/admin/ads', icon: Megaphone, label: 'Publicités', permission: 'ads.read' },
    { href: '/_/admin/banners', icon: ImageIcon, label: 'Bannières', permission: 'banners.read' },
    { href: '/_/admin/newsletter', icon: Mail, label: 'Newsletter', permission: 'newsletter.read' },
    { href: '/_/admin/contact', icon: MessageSquare, label: 'Messages', permission: 'contact.read' },
    { type: 'divider', label: 'Administration' },
    { href: '/_/admin/users', icon: Users, label: 'Utilisateurs', permission: 'users.read' },
    { href: '/_/admin/roles', icon: Shield, label: 'Rôles', permission: 'roles.read' },
    { type: 'divider', label: 'Configuration' },
    { href: '/_/admin/settings', icon: Settings, label: 'Paramètres', permission: 'settings.read' },
    { href: '/_/admin/seo', icon: Search, label: 'SEO', permission: 'seo.read' },
    { href: '/_/admin/footer', icon: Footprints, label: 'Footer', permission: 'footer.read' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, hasPermission, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Si estamos en la página de login, mostrar solo los children sin layout
    const isLoginPage = pathname === '/_/admin/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/_/admin/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/_/admin/login');
    };

    const filteredMenuItems = menuItems.filter(item => {
        if ('type' in item) return true;
        if (!item.permission) return true;
        return hasPermission(item.permission);
    });

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Mobile header */}
            <div className="lg:hidden bg-white shadow-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-bold text-lg">SIH Admin</span>
                <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg text-red-600">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-white p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-bold text-xl">SIH Solutions</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {filteredMenuItems.map((item, idx) => {
                                if ('type' in item && item.type === 'divider') {
                                    return (
                                        <div key={idx} className="pt-4 pb-2">
                                            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{item.label}</span>
                                        </div>
                                    );
                                }
                                if (!('href' in item)) return null;
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white min-h-screen transition-all duration-300 sticky top-0`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-8">
                            {sidebarOpen && <span className="font-bold text-xl">SIH Solutions</span>}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-slate-800 rounded-lg"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="space-y-1">
                            {filteredMenuItems.map((item, idx) => {
                                if ('type' in item && item.type === 'divider') {
                                    if (!sidebarOpen) return null;
                                    return (
                                        <div key={idx} className="pt-4 pb-2">
                                            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{item.label}</span>
                                        </div>
                                    );
                                }
                                if (!('href' in item)) return null;
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                            }`}
                                        title={!sidebarOpen ? item.label : undefined}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {sidebarOpen && <span>{item.label}</span>}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User section */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className={`flex items-center gap-3 p-3 bg-slate-800 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                {sidebarOpen && (
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.role.name}</p>
                                    </div>
                                )}
                                {sidebarOpen && (
                                    <button onClick={handleLogout} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
