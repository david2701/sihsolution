import NewsCard from "@/components/shared/NewsCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Article {
    title: string;
    category?: string;
    image?: string;
    excerpt?: string;
    date?: string;
    author?: string;
    isVideo?: boolean;
}

interface ListSectionProps {
    title: string;
    moreLink?: string;
    articles: Article[];
}

export default function ListSection({ title, moreLink, articles }: ListSectionProps) {
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

            <div className="space-y-8 max-w-4xl mx-auto">
                {articles.map((article, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                        <NewsCard mode="horizontal" {...article} />
                    </div>
                ))}
            </div>
        </section>
    );
}
