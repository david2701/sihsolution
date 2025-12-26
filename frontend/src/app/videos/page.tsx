import VideoCard from "@/components/videos/VideoCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Youtube } from "lucide-react";

export default function VideosPage() {
    const videos = [
        { title: "Analyse : L'impact des cryptomonnaies en 2025", description: "Des experts discutent de l'avenir de la finance décentralisée et de son adoption mondiale.", thumbnail: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2000&auto=format&fit=crop", duration: "12:45", views: "15k" },
        { title: "Interview exclusive avec le Président", description: "Nous discutons des nouvelles politiques d'infrastructure et d'éducation.", thumbnail: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2000&auto=format&fit=crop", duration: "45:20", views: "120k" },
        { title: "Technologie Verte : Mythe ou Réalité ?", description: "Court documentaire sur les véritables implications de l'énergie solaire.", thumbnail: "https://images.unsplash.com/photo-1542601906990-24d4c16419d4?q=80&w=2000&auto=format&fit=crop", duration: "22:15", views: "8.5k" },
        { title: "Sports : Résumé de la finale de la Coupe du Monde", description: "Tous les buts et meilleurs moments du match de l'année.", thumbnail: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000&auto=format&fit=crop", duration: "10:30", views: "300k" },
        { title: "Gastronomie : Les saveurs du futur", description: "Un chef international nous montre la cuisine imprimée en 3D.", thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop", duration: "15:00", views: "45k" },
        { title: "Tourisme spatial : Guide pour débutants", description: "Tout ce que vous devez savoir avant votre premier voyage en orbite.", thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop", duration: "18:20", views: "22k" },
    ];

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Channel Header */}
            <div className="bg-slate-900 text-white py-12 mb-8">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
                        <Youtube className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-serif font-bold mb-2">Chaîne SIH TV</h1>
                        <p className="text-slate-400 max-w-2xl">
                            Reportages approfondis, interviews exclusives et couverture vidéo des actualités les plus importantes. Abonnez-vous pour ne rien manquer.
                        </p>
                    </div>
                    <div className="ml-auto">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-colors">
                            S&apos;abonner
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Featured Video */}
                <div className="mb-12">
                    <SectionHeader title="Vidéo à la une" />
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
                        {/* Placeholder for Iframe */}
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                            <div className="text-center">
                                <Youtube className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Lecteur vidéo principal</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                            Documentaire : Les océans en 2025
                        </h2>
                        <p className="text-lg text-slate-600">
                            Un regard cinématographique sur les efforts mondiaux pour nettoyer nos mers et restaurer les écosystèmes clés.
                        </p>
                    </div>
                </div>

                {/* Video Grid */}
                <SectionHeader title="Dernières vidéos" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((vid, idx) => (
                        <VideoCard key={idx} {...vid} />
                    ))}
                </div>
            </div>
        </div>
    );
}
