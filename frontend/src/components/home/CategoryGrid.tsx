import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { PlayCircle } from "lucide-react";

interface Article {
    id: number;
    title: string;
    category: string;
    image: string;
    date: string;
    isVideo?: boolean;
}

interface CategoryGridProps {
    title: string;
    link: string;
    articles: Article[];
}

export default function CategoryGrid({ title, link, articles }: CategoryGridProps) {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
                <SectionHeader title={title} href={link} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.map((article) => (
                        <Link key={article.id} href="#" className="group block">
                            <div className="relative aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden mb-3">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {article.isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                        <PlayCircle className="w-12 h-12 text-white opacity-90 drop-shadow-lg" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded">
                                    {article.category.toUpperCase()}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug group-hover:text-accent transition-colors line-clamp-3">
                                {article.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2">{article.date}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
