import { Play, Clock } from "lucide-react";

interface VideoCardProps {
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    views: string;
}

export default function VideoCard({ title, description, thumbnail, duration, views }: VideoCardProps) {
    return (
        <div className="group cursor-pointer">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-slate-900">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs font-bold text-white rounded">
                    {duration}
                </div>
            </div>
            <div>
                <h3 className="font-bold text-slate-900 leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-1">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                    {description}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>{views} vistas</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hace 2 días</span>
                </div>
            </div>
        </div>
    );
}
