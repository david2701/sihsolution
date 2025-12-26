"use client";

import { useState, useEffect } from "react";
import { PlayCircle, Clock, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { getVideos, Video as ApiVideo } from "@/lib/api";

interface Video {
    id: string;
    title: string;
    category: string;
    image: string;
    duration: string;
    date: string;
    author: string;
}

const fallbackVideos: Video[] = [
    {
        id: "1",
        title: "Documentaire : Les gardiens de l'Arctique",
        category: "Original",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop",
        duration: "24:15",
        date: "Aujourd'hui",
        author: "SIH Docs"
    },
    {
        id: "2",
        title: "Résumé hebdomadaire des marchés financiers",
        category: "Finance",
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2000&auto=format&fit=crop",
        duration: "05:30",
        date: "Hier",
        author: "MarketWatch"
    },
    {
        id: "3",
        title: "Interview : L'art de la diplomatie moderne",
        category: "Politique",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop",
        duration: "45:00",
        date: "Il y a 2 jours",
        author: "Global Politics"
    },
    {
        id: "4",
        title: "Technologie : Nous testons la voiture volante",
        category: "Test",
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2000&auto=format&fit=crop",
        duration: "12:45",
        date: "Il y a 3 jours",
        author: "Tech Lab"
    },
    {
        id: "5",
        title: "L'architecture du futur : Villes durables",
        category: "Design",
        image: "https://images.unsplash.com/photo-1486749963842-83b6329fc0a4?q=80&w=2000&auto=format&fit=crop",
        duration: "18:20",
        date: "Il y a 5 jours",
        author: "Arch Digest"
    }
];

export default function VideoSection() {
    const [videos, setVideos] = useState<Video[]>(fallbackVideos);
    const [activeVideo, setActiveVideo] = useState<Video>(fallbackVideos[0]);

    useEffect(() => {
        getVideos(5).then(apiVideos => {
            if (apiVideos && apiVideos.length > 0) {
                const mapped = apiVideos.map((v, i) => ({
                    id: v.id,
                    title: v.title,
                    category: "Vidéo",
                    image: v.thumbnail || fallbackVideos[i % fallbackVideos.length].image,
                    duration: "10:00",
                    date: "Récent",
                    author: "SIH"
                }));
                setVideos(mapped);
                setActiveVideo(mapped[0]);
            }
        });
    }, []);

    return (
        <section className="bg-slate-950 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8 border-l-4 border-accent pl-4">
                    <h2 className="text-3xl font-serif font-bold text-white">Multimédia & Vidéo</h2>
                    <a href="/videos" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        Voir tout <ChevronRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">

                    {/* Main Player Display (2/3) */}
                    <div className="lg:col-span-2 h-full flex flex-col">
                        <div className="relative w-full aspect-video lg:aspect-auto lg:flex-1 bg-black rounded-xl overflow-hidden group shadow-2xl">
                            <img
                                src={activeVideo.image}
                                alt={activeVideo.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle className="w-20 h-20 text-white opacity-90 drop-shadow-lg group-hover:scale-110 transition-transform duration-300 cursor-pointer" />
                            </div>

                            {/* Overlay Info */}
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-accent text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                        {activeVideo.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <Clock className="w-3 h-3" /> {activeVideo.duration}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-2">
                                    {activeVideo.title}
                                </h3>
                                <p className="text-slate-300 text-sm md:text-base max-w-2xl text-opacity-80">
                                    Présenté par {activeVideo.author} • Publié {activeVideo.date}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Playlist Sidebar (1/3) */}
                    <div className="lg:col-span-1 h-full flex flex-col">
                        <div className="bg-slate-900 rounded-xl p-6 h-full flex flex-col border border-slate-800">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-800 pb-2 flex justify-between items-center">
                                En lecture
                                <span className="text-accent">1 / {videos.length}</span>
                            </h4>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {videos.map((video) => (
                                    <div
                                        key={video.id}
                                        onClick={() => setActiveVideo(video)}
                                        className={clsx(
                                            "group flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300",
                                            activeVideo.id === video.id
                                                ? "bg-white/10 border-l-2 border-accent"
                                                : "hover:bg-white/5 border-l-2 border-transparent"
                                        )}
                                    >
                                        <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-black">
                                            <img src={video.image} alt={video.title} className="w-full h-full object-cover opacity-80" />
                                            {activeVideo.id === video.id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h5 className={clsx(
                                                "text-sm font-bold leading-snug mb-1 line-clamp-2",
                                                activeVideo.id === video.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                                            )}>
                                                {video.title}
                                            </h5>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                                <span>{video.duration}</span>
                                                <span>•</span>
                                                <span className={activeVideo.id === video.id ? "text-accent" : ""}>{video.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 py-3 text-xs font-bold uppercase tracking-widest border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors text-slate-300">
                                Voir la bibliothèque complète
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `}</style>
        </section>
    );
}
