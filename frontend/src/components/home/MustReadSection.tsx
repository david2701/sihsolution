import NewsCard from "@/components/shared/NewsCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Article {
    title: string;
    category?: string;
    image?: string;
    excerpt?: string;
    date?: string;
    author?: string;
    source?: string;
    readingTime?: string;
    isVideo?: boolean;
}

interface MustReadSectionProps {
    title?: string;
    moreLink?: string;
    leftArticle: Article;
    centerArticle: Article;
    rightArticles: Article[];
}

export default function MustReadSection({
    title = "À lire absolument",
    moreLink,
    leftArticle,
    centerArticle,
    rightArticles
}: MustReadSectionProps) {
    return (
        <section className="container mx-auto px-4 py-12 bg-white">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-l-4 border-accent pl-4">
                <h2 className="text-3xl font-serif font-black tracking-tight text-slate-900 uppercase leading-none">
                    {title}
                </h2>
                {moreLink && (
                    <Link href={moreLink} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
                        Voir tout <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* Grid Layout: Mobile (1col) -> LG (3cols: 1fr 2fr 1fr) with Vertical Dividers */}
            <div className="grid grid-cols-1 lg:grid-cols-4">

                {/* Center Column (Featured) - Visually Middle (Col 2-3) */}
                <div className="lg:col-span-2 lg:col-start-2 order-1 md:order-1 lg:order-2 flex flex-col lg:px-8">
                    <NewsCard
                        mode="hero"
                        className="h-[500px] lg:h-full rounded-2xl shadow-lg lg:shadow-none border border-slate-100 lg:border-none"
                        {...centerArticle}
                    />
                </div>

                {/* Left Column - Visually Left (Col 1) */}
                <div className="lg:col-span-1 lg:col-start-1 order-2 md:order-2 lg:order-1 flex flex-col lg:pr-8 lg:border-r lg:border-slate-200">
                    <NewsCard
                        mode="standard"
                        className="h-full"
                        {...leftArticle}
                    />
                </div>

                {/* Right Column - Visually Right (Col 4) */}
                <div className="lg:col-span-1 lg:col-start-4 order-3 md:order-3 lg:order-3 flex flex-col gap-6 lg:pl-8 lg:border-l lg:border-slate-200 pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-100 mt-8 lg:mt-0">
                    {rightArticles.map((article, idx) => (
                        <div key={idx} className="flex-1">
                            <NewsCard mode="compact" {...article} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
