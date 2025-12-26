"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { submitContact } from "@/lib/api";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setLoading(true);
        const result = await submitContact(formData);
        setLoading(false);

        if (result) {
            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-serif font-bold text-center text-slate-900 mb-12">Contactez-nous</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2">

                    {/* Contact Info */}
                    <div className="bg-primary p-12 text-white">
                        <h2 className="text-2xl font-serif font-bold mb-6">Informations de contact</h2>
                        <p className="text-slate-300 mb-8 leading-relaxed">
                            Vous avez une nouvelle à partager ou souhaitez faire de la publicité chez nous ? Nous sommes là pour vous écouter.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Appelez-nous</p>
                                    <p className="font-medium">+33 1 23 45 67 89</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Écrivez-nous</p>
                                    <p className="font-medium">contact@sih-solutions.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Rendez-nous visite</p>
                                    <p className="font-medium">123 Rue Principale, Paris, France</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-12">
                        {success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
                                <p className="text-slate-600">Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 text-accent hover:underline"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Nom complet *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="Votre nom"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="exemple@email.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Sujet</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="Sujet de votre message"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Message *</label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? "Envoi..." : "Envoyer le message"} <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
