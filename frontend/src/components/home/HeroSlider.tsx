"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import clsx from "clsx";
import { getArticles, formatDate, Article } from "@/lib/api";

// Fallback mock data until API is connected
const fallbackStories = [
    {
        id: "1",
        slug: "crise-climatique",
        category: { name: "Monde" },
        title: "Crise Climatique : Les dirigeants mondiaux conviennent de nouveaux objectifs",
        excerpt: "Lors d'un sommet historique, les principales puissances économiques ont signé le 'Pacte pour l'Avenir', s'engageant à une transition énergétique accélérée.",
        featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: { firstName: "Sarah", lastName: "Jenkins" }
    },
    {
        id: "2",
        slug: "marches-mondiaux",
        category: { name: "Économie" },
        title: "Les marchés mondiaux réagissent à la baisse des taux",
        excerpt: "Wall Street clôture avec des gains record après l'annonce de la Réserve fédérale sur la nouvelle politique monétaire pour 2025.",
        featuredImage: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2000&auto=format&fit=crop",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        author: { firstName: "Michael", lastName: "Chen" }
    },
    {
        id: "3",
        slug: "apple-ar",
        category: { name: "Technologie" },
        title: "Apple présente sa vision pour l'avenir de la réalité augmentée",
        excerpt: "Le géant technologique dévoile son appareil le plus ambitieux à ce jour, promettant de changer notre façon d'interagir avec le monde numérique.",
        featuredImage: "https://images.unsplash.com/photo-1592478411213-61535fdd861d?q=80&w=2000&auto=format&fit=crop",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        author: { firstName: "Elena", lastName: "Rodriguez" }
    },
    {
        id: "4",
        slug: "mission-mars",
        category: { name: "Science" },
        title: "Mission Mars : Nouvelles découvertes d'eau",
        excerpt: "Le rover Perseverance envoie des données confirmant l'existence d'anciens lacs souterrains sur la planète rouge.",
        featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        author: { firstName: "Dr. Alan", lastName: "Grant" }
    },
    {
        id: "5",
        slug: "longevite",
        category: { name: "Santé" },
        title: "Nouveaux traitements pour la longévité",
        excerpt: "Des chercheurs découvrent une protéine clé qui pourrait ralentir le vieillissement cellulaire chez les humains.",
        featuredImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2000&auto=format&fit=crop",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        author: { firstName: "Dr.", lastName: "House" }
    }
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [stories, setStories] = useState<any[]>(fallbackStories);

    useEffect(() => {
        // Try to fetch from API
        getArticles({ limit: 5, status: 'PUBLISHED' }).then(data => {
            if (data.articles && data.articles.length > 0) {
                setStories(data.articles);
            }
        });
    }, []);

    // Auto-rotate
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stories.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, stories.length]);

    const activeStory = stories[currentIndex];
    if (!activeStory) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[600px]">

                {/* MAIN SLIDE AREA (8 cols) */}
                <div className="lg:col-span-8 relative h-[500px] lg:h-full group overflow-hidden rounded-xl bg-slate-900">
                    {/* Background Image */}
                    <div className="absolute inset-0 transition-opacity duration-700">
                        <img
                            src={activeStory.featuredImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"}
                            alt={activeStory.title}
                            key={activeStory.featuredImage}
                            className="w-full h-full object-cover opacity-90 animate-in fade-in duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    </div>

                    {/* FLOATING CARD CONTENT */}
                    <div className="absolute z-10 flex items-center bottom-4 left-4 right-4 top-auto md:top-8 md:bottom-8 md:left-8 md:right-auto md:w-[450px]">
                        <div className="bg-white shadow-2xl rounded-sm border-l-4 border-accent h-auto flex flex-col justify-center animate-in slide-in-from-left-4 fade-in duration-500 p-5 md:p-8 md:min-h-[300px]" key={activeStory.id}>
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-1 tracking-widest">
                                    {activeStory.category?.name || 'Actualités'}
                                </span>
                                <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {formatDate(activeStory.createdAt)}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-900 leading-tight mb-3 md:mb-4 hover:text-accent cursor-pointer transition-colors">
                                <Link href={`/article/${activeStory.slug}`}>{activeStory.title}</Link>
                            </h1>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">
                                {activeStory.excerpt}
                            </p>
                            <div className="mt-auto">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Par {activeStory.author?.firstName} {activeStory.author?.lastName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR NAVIGATION (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                        <h3 className="font-serif font-bold text-lg">À la une</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)} className="p-1 hover:bg-slate-100 rounded">
                                <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                            <button onClick={() => setCurrentIndex((prev) => (prev + 1) % stories.length)} className="p-1 hover:bg-slate-100 rounded">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {stories.map((story, idx) => (
                            <div
                                key={story.id}
                                onClick={() => { setCurrentIndex(idx); setIsAutoPlaying(false); }}
                                className={clsx(
                                    "p-4 cursor-pointer transition-all border-b border-slate-100 last:border-0 hover:bg-white group",
                                    currentIndex === idx ? "bg-white border-l-4 border-l-accent shadow-sm" : "bg-transparent border-l-4 border-l-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                <div className="flex gap-3">
                                    <span className={clsx("text-lg font-black leading-none", currentIndex === idx ? "text-accent" : "text-slate-300")}>
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <h4 className={clsx("font-serif font-bold text-base leading-tight mb-2 group-hover:text-accent transition-colors", currentIndex === idx ? "text-slate-900" : "text-slate-600")}>
                                            {story.title}
                                        </h4>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                            {story.category?.name || 'Actualités'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-100 text-center border-t border-slate-200">
                        <Link href="/articles" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                            Voir toutes les actualités
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
