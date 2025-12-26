import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import clsx from "clsx";

interface NewsCardProps {
    mode?: "feature" | "standard" | "compact" | "minimal" | "hero" | "horizontal";
    title: string;
    category?: string;
    image?: string;
    excerpt?: string;
    date?: string;
    author?: string; // Can serve as Author Name
    source?: string; // e.g. "CNN", "BBC"
    readingTime?: string; // e.g. "5 min read"
    isVideo?: boolean;
    className?: string;
    dark?: boolean;
}

export default function NewsCard({
    mode = "standard",
    title,
    category,
    image,
    excerpt,
    date,
    author,
    source,
    readingTime,
    isVideo = false,
    className,
    dark = false,
}: NewsCardProps) {

    // HERO MODE: Central Featured Card
    if (mode === "hero") {
        return (
            <Link href="#" className={clsx("group relative block h-full min-h-[500px] w-full overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow", className)}>
                <img
                    src={image || "/placeholder.jpg"}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {isVideo && <PlayCircle className="absolute inset-0 m-auto h-16 w-16 text-white opacity-80 drop-shadow-xl group-hover:scale-110 transition-transform" />}

                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    {category && (
                        <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">
                            {category}
                        </span>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                    {source && (
                        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-widest">
                            <span>{source}</span>
                            {date && <span>• {date}</span>}
                        </div>
                    )}
                    <h2 className="mb-3 text-2xl md:text-4xl font-serif font-black leading-tight text-white drop-shadow-md">
                        {title}
                    </h2>
                    {excerpt && (
                        <p className="mb-4 text-base md:text-lg text-gray-200 line-clamp-2 md:line-clamp-3 leading-relaxed opacity-90">
                            {excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-xs font-bold text-white/70 uppercase tracking-widest">
                        {author && <span>Por {author}</span>}
                        {readingTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime}</span>}
                    </div>
                </div>
            </Link>
        );
    }

    // FEATURE/STANDARD MODE (Left Column)
    if (mode === "standard" || mode === "feature") {
        return (
            <Link href="#" className={clsx("group block h-full flex flex-col", className)}>
                {image && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-4">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isVideo && <PlayCircle className="absolute inset-0 m-auto h-12 w-12 text-white opacity-90 drop-shadow-lg" />}
                    </div>
                )}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase">
                            {source && <span className="text-slate-900">{source}</span>}
                            {date && <span>{date}</span>}
                        </div>
                        {category && <span className="text-xs font-bold uppercase text-red-600 tracking-wider">{category}</span>}
                    </div>

                    <h3 className={clsx(
                        "text-xl md:text-2xl font-serif font-bold leading-tight mb-3 group-hover:text-blue-900 transition-colors",
                        dark ? "text-white" : "text-slate-900"
                    )}>
                        {title}
                    </h3>

                    {excerpt && <p className={clsx("text-sm leading-relaxed line-clamp-3 mb-4 flex-1", dark ? "text-slate-300" : "text-slate-600")}>{excerpt}</p>}

                    {readingTime && (
                        <div className="mt-auto pt-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            {readingTime}
                        </div>
                    )}
                </div>
            </Link>
        );
    }

    // COMPACT MODE (Right Column Stack)
    if (mode === "compact") {
        return (
            <Link href="#" className={clsx("group flex gap-4 items-stretch py-4 border-b last:border-0", dark ? "border-slate-800" : "border-slate-100", className)}>
                {image && (
                    <div className="w-24 md:w-32 aspect-square shrink-0 bg-slate-100 overflow-hidden rounded-lg relative">
                        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {isVideo && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><PlayCircle className="w-8 h-8 text-white" /></div>}
                    </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider">
                        {category && <span className="text-red-600">{category}</span>}
                        {readingTime && <span className="text-slate-400">{readingTime}</span>}
                    </div>
                    <h4 className={clsx(
                        "font-serif font-bold text-lg leading-snug group-hover:text-blue-900 transition-colors mb-1 line-clamp-3",
                        dark ? "text-white" : "text-slate-900"
                    )}>
                        {title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        {source && <span className="text-slate-600">{source}</span>}
                        {date && <span>{date}</span>}
                    </div>
                </div>
            </Link>
        );
    }

    // MINIMAL MODE: Just text (List style)
    if (mode === "minimal") {
        return (
            <Link href="#" className={clsx("group block py-2 border-b last:border-0", dark ? "border-slate-800" : "border-slate-100", className)}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    {category && <span className="text-xs font-bold text-slate-500 uppercase">{category}</span>}
                </div>
                <h4 className={clsx(
                    "text-base font-serif font-medium group-hover:text-accent group-hover:underline decoration-1 underline-offset-4 transition-all",
                    dark ? "text-gray-200" : "text-slate-800"
                )}>
                    {title}
                </h4>
            </Link>
        );
    }

    // HORIZONTAL MODE: Image Left, Text Right (Wider than compact)
    if (mode === "horizontal") {
        return (
            <Link href="#" className={clsx("group flex flex-col md:flex-row gap-6 items-start", className)}>
                <div className="relative aspect-video w-full md:w-2/5 shrink-0 overflow-hidden bg-slate-100">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {isVideo && <PlayCircle className="absolute inset-0 m-auto h-12 w-12 text-white opacity-90 drop-shadow-lg" />}
                </div>
                <div className="flex-1 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-2 mb-2">
                        {category && <span className="text-xs font-bold uppercase tracking-wider text-accent">{category}</span>}
                        {date && <span className={clsx("text-xs font-medium", dark ? "text-slate-400" : "text-slate-500")}>• {date}</span>}
                    </div>
                    <h3 className={clsx(
                        "text-xl md:text-2xl font-serif font-bold leading-tight mb-3 group-hover:text-accent transition-colors",
                        dark ? "text-white" : "text-slate-900"
                    )}>
                        {title}
                    </h3>
                    {excerpt && <p className={clsx("text-sm line-clamp-3", dark ? "text-slate-300" : "text-slate-600")}>{excerpt}</p>}
                    {author && <span className={clsx("mt-3 text-xs font-medium uppercase tracking-wide", dark ? "text-slate-500" : "text-slate-400")}>Por {author}</span>}
                </div>
            </Link>
        );
    }

    // STANDARD MODE (Default)
    return (
        <Link href="#" className={clsx("group block", className)}>
            {image && (
                <div className="relative aspect-[3/2] mb-3 overflow-hidden bg-slate-100">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {isVideo && <PlayCircle className="absolute inset-0 m-auto h-12 w-12 text-white opacity-90 drop-shadow-lg" />}
                </div>
            )}
            <div className="flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    {category && <span className="text-xs font-bold uppercase text-accent">{category}</span>}
                </div>
                <h3 className={clsx(
                    "text-lg font-serif font-bold leading-snug group-hover:text-accent transition-colors mb-2",
                    dark ? "text-white" : "text-slate-900"
                )}>
                    {title}
                </h3>
                {excerpt && <p className={clsx("text-sm line-clamp-2", dark ? "text-slate-400" : "text-slate-500")}>{excerpt}</p>}
                {(author || date) && (
                    <div className={clsx("mt-2 flex items-center gap-2 text-xs", dark ? "text-slate-500" : "text-slate-400")}>
                        {date && <span>{date}</span>}
                    </div>
                )}
            </div>
        </Link>
    );
}
