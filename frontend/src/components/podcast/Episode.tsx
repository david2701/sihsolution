import { Play, Calendar, Clock, Share2 } from "lucide-react";

interface EpisodeProps {
    title: string;
    description: string;
    duration: string;
    date: string;
    episodeNumber: number;
}

export default function Episode({ title, description, duration, date, episodeNumber }: EpisodeProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Play Button */}
                <button className="flex-shrink-0 w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-accent transition-colors shadow-lg">
                    <Play className="w-6 h-6 ml-1" />
                </button>

                <div className="flex-grow">
                    <div className="flex items-center gap-2 text-xs font-bold text-accent mb-1 uppercase tracking-wider">
                        Episodio {episodeNumber}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {description}
                    </p>
                    <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {duration}</span>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors ml-auto md:ml-0">
                            <Share2 className="w-3 h-3" /> Compartir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
