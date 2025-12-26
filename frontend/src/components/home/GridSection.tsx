import NewsCard from "@/components/shared/NewsCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Article {
    mode?: "hero" | "feature" | "standard" | "compact" | "minimal";
    title: string;
    category?: string;
    image?: string;
    excerpt?: string;
    date?: string;
    author?: string;
    isVideo?: boolean;
}

interface GridSectionProps {
    title: string;
    moreLink?: string;
    articles: Article[];
    columns?: 3 | 4;
}

export default function GridSection({ title, moreLink, articles, columns = 4 }: GridSectionProps) {
    const gridCols = columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

    return (
        <section className="container mx-auto px-4 py-8 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <SectionHeader title={title} />
                {moreLink && (
                    <Link href={moreLink} className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-primary hover:text-accent transition-colors">
                        Ver más <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>

            <div className={`grid ${gridCols} gap-6`}>
                {articles.map((article, idx) => (
                    <NewsCard key={idx} mode="standard" {...article} />
                ))}
            </div>
        </section>
    );
}
