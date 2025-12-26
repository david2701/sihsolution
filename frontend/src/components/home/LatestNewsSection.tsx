import NewsCard from "@/components/shared/NewsCard";
import SectionHeader from "@/components/ui/SectionHeader";

interface Article {
    title: string;
    category?: string;
    image?: string;
    excerpt?: string;
    date?: string;
    author?: string; // Can serve as Author Name
    source?: string; // e.g. "CNN", "BBC"
    readingTime?: string; // e.g. "5 min read"
    isVideo?: boolean;
}

interface LatestNewsSectionProps {
    title?: string;
    articles: Article[];
}

export default function LatestNewsSection({ title = "Les dernières actualités", articles }: LatestNewsSectionProps) {
    // We expect at least 4 articles for the best layout
    const [feature, secondary, ...rest] = articles;

    return (
        <section>
            <SectionHeader title={title} />
            <div className="flex flex-col gap-8">

                {/* Top Row: Asymmetrical Split (2/3 + 1/3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature (Left, Larger) */}
                    <div className="md:col-span-2">
                        <NewsCard mode="standard" {...feature} className="h-full" />
                    </div>

                    {/* Secondary (Right, Taller/Narrower feel) */}
                    <div className="md:col-span-1 border-l border-gray-100 pl-8 md:pl-0 md:border-l-0">
                        {/* Visually separating it slightly if needed, but grid gap handles it */}
                        <NewsCard mode="standard" {...secondary} className="h-full" />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 w-full" />

                {/* Bottom Row: 2 or 3 columns depending on remaining items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {rest.map((article, idx) => (
                        <div key={idx} className={idx < 2 ? "block" : "hidden md:block"}>
                            <NewsCard mode="horizontal" {...article} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
