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

interface FeatureSectionProps {
    title: string;
    moreLink?: string;
    mainArticle: Article;
    sideArticles: Article[];
}

export default function FeatureSection({ title, moreLink, mainArticle, sideArticles }: FeatureSectionProps) {
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feature - Left 2 Cols */}
                <div className="lg:col-span-2">
                    <NewsCard mode="feature" {...mainArticle} />
                </div>

                {/* Side List - Right 1 Col */}
                <div className="space-y-6 flex flex-col justify-between">
                    {sideArticles.map((article, idx) => (
                        <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <NewsCard mode="compact" {...article} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
