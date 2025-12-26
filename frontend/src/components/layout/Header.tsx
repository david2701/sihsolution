"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Youtube, Mic } from "lucide-react";
import CurrentDate from "./CurrentDate";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { name: "Accueil", href: "/" },
        { name: "Vidéos", href: "/videos", icon: Youtube },
        { name: "Podcast", href: "/podcast", icon: Mic },
        { name: "À propos", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {/* Top Bar */}
            <div className="bg-primary text-white text-sm py-2 px-4 hidden md:block">
                <div className="container mx-auto flex justify-between items-center">
                    <CurrentDate />
                    <div className="flex gap-6 font-medium">
                        <span className="hover:text-accent cursor-pointer transition-colors">S&apos;abonner</span>
                        <Link href="/_/admin/login" className="hover:text-accent cursor-pointer transition-colors">Connexion</Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 h-24 flex items-center justify-between border-b border-gray-100">
                {/* Mobile Menu Button - Left on mobile */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>

                {/* Logo - Centered on mobile, Left on Desktop */}
                <Link href="/" className="flex items-center gap-2 mx-auto md:mx-0 group">
                    <div className="bg-primary text-white px-3 py-2 font-serif font-black text-4xl tracking-tighter group-hover:bg-accent transition-colors">SIH</div>
                    <span className="text-primary font-sans font-bold text-2xl tracking-tight hidden sm:block">SOLUTIONS</span>
                </Link>

                {/* Helper for centering on mobile */}
                <div className="w-8 md:hidden"></div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-base font-bold text-gray-800 hover:text-accent transition-colors flex items-center gap-2 uppercase tracking-wide"
                        >
                            {item.href === "/videos" ? <Youtube className="w-5 h-5 text-red-600" /> :
                                item.href === "/podcast" ? <Mic className="w-5 h-5 text-purple-600" /> : null}
                            {item.name}
                        </Link>
                    ))}

                    <button className="p-3 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-all">
                        <Search className="w-6 h-6" />
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-xl animate-in slide-in-from-top-2">
                    <div className="flex flex-col p-6 space-y-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-3 text-lg font-bold text-gray-800 hover:bg-gray-50 hover:text-accent rounded-lg flex items-center gap-4 border-b border-gray-50 last:border-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.icon && <item.icon className="w-6 h-6" />}
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
