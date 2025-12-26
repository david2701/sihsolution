import NewsCard from "@/components/shared/NewsCard";
import SectionHeader from "@/components/ui/SectionHeader";
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

interface ScienceTechSectionProps {
    title?: string;
    moreLink?: string;
    articles: Article[];
}

export default function ScienceTechSection({ title = "Ciencia y Tecnología", moreLink, articles }: ScienceTechSectionProps) {
    // Expecting 5 articles: 1 Feature + 4 Grid Items
    const [feature, ...gridItems] = articles;

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <SectionHeader title={title} />
                {moreLink && (
                    <Link href={moreLink} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-accent transition-colors mb-8">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Visual Feature (Left Column - 40%) */}
                <div className="lg:col-span-2">
                    <NewsCard
                        mode="hero" // Reuse hero mode for the vertical full-height look, or feature
                        // Actually 'hero' puts text over image. 'feature' puts image top.
                        // Let's use a modified 'feature' or 'standard' but ensure height.
                        // 'hero' is good for immersive "Tech" feel.
                        {...feature}
                        className="h-full min-h-[400px] rounded-xl shadow-sm"
                    />
                </div>

                {/* Grid (Right Column - 60%) */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                        {gridItems.map((item, idx) => (
                            <NewsCard
                                key={idx}
                                mode="standard"
                                {...item}
                                // Clean up the look for the grid: compact image, fewer details?
                                // Standard is fine.
                                className="h-full"
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
