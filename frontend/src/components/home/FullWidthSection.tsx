import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface FullWidthSectionProps {
    image: string;
    category: string;
    title: string;
    description: string;
    linkText: string;
    href: string;
}

export default function FullWidthSection({ image, category, title, description, linkText, href }: FullWidthSectionProps) {
    return (
        <section className="relative w-full h-[500px] flex items-center my-12 group overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="max-w-2xl">
                    <span className="bg-accent text-white px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">
                        {category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
                        {description}
                    </p>
                    <Link
                        href={href}
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-accent hover:text-white transition-colors"
                    >
                        {linkText} <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
