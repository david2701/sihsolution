import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8 border-l-4 border-accent pl-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">
                {title}
            </h2>
            {href && (
                <Link
                    href={href}
                    className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
                >
                    Ver más <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    );
}
