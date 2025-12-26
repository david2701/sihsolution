"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        const success = await subscribeNewsletter(email);
        setLoading(false);
        if (success) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-serif font-black tracking-tighter text-white">
                                SIH<span className="text-accent">.</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Actualités avec une perspective moderne.
                            Information véridique et directe pour le monde d&apos;aujourd&apos;hui.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6">Catégories</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="#" className="hover:text-accent transition-colors">Politique</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Technologie</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Économie</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Sports</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Culture</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6">Entreprise</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-accent transition-colors">À propos</Link></li>
                            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Conditions d&apos;utilisation</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Confidentialité</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-6">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Recevez les actualités les plus importantes dans votre boîte mail.</p>
                        {subscribed ? (
                            <p className="text-green-400 text-sm">✓ Merci pour votre inscription !</p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre adresse email"
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-accent"
                                        required
                                    />
                                    <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-2.5" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-accent hover:bg-rose-700 text-white font-bold py-2 rounded text-sm transition-colors disabled:opacity-50"
                                >
                                    {loading ? "..." : "S'abonner"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © 2025 SIH Solutions. Tous droits réservés.
                    </p>
                    <div className="flex gap-6 text-gray-500 text-xs">
                        <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
