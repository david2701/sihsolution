import Episode from "@/components/podcast/Episode";
import { Mic } from "lucide-react";

export default function PodcastPage() {
    const episodes = [
        { episodeNumber: 45, title: "La géopolitique de l'eau : La ressource du 21e siècle", description: "Dans cet épisode, nous analysons comment la pénurie d'eau redéfinit les frontières politiques et économiques mondiales.", duration: "45 min", date: "24 Jan 2025" },
        { episodeNumber: 44, title: "Intelligence Artificielle : Alliée ou Ennemie de l'emploi ?", description: "Débat ouvert avec des technologues et des sociologues sur l'avenir du travail.", duration: "38 min", date: "17 Jan 2025" },
        { episodeNumber: 43, title: "Santé mentale à l'ère numérique", description: "Conseils et analyses sur comment maintenir l'équilibre dans un monde hyperconnecté.", duration: "52 min", date: "10 Jan 2025" },
        { episodeNumber: 42, title: "La renaissance de l'exploration spatiale", description: "De Mars et au-delà : les nouvelles missions qui changeront notre compréhension de l'univers.", duration: "41 min", date: "03 Jan 2025" },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex p-3 rounded-full bg-white/10 mb-6 backdrop-blur-sm">
                        <Mic className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">SIH Podcast : Voix du Futur</h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Conversations profondes qui connectent les points. Écoutez-nous chaque semaine.
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <button className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                            Écouter sur Spotify
                        </button>
                        <button className="bg-transparent border border-white/30 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
                            Apple Podcasts
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl space-y-4">
                {episodes.map((ep) => (
                    <Episode key={ep.episodeNumber} {...ep} />
                ))}
            </div>
        </div>
    );
}
