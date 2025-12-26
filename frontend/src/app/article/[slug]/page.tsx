import { getArticleBySlug, formatDate, calculateReadingTime, incrementViews } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar, Facebook, Twitter, Linkedin, Share2, Eye } from "lucide-react";
import Banner from "@/components/shared/Banner";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    // Increment views (fire and forget)
    incrementViews(article.id);

    const readingTime = calculateReadingTime(article.content);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Image */}
            {article.featuredImage && (
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                    <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
            )}

            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto -mt-32 relative z-10 bg-white rounded-t-xl shadow-xl p-6 md:p-10 lg:p-12">
                    {/* Back Link */}
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-accent mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Retour aux actualités</span>
                    </Link>

                    {/* Category */}
                    {article.category && (
                        <Link href={`/category/${article.category.slug}`}>
                            <span className="inline-block bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 hover:bg-accent/90 transition-colors">
                                {article.category.name}
                            </span>
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {article.author.firstName[0]}{article.author.lastName[0]}
                            </div>
                            <div>
                                <span className="font-semibold text-slate-900">{article.author.firstName} {article.author.lastName}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views.toLocaleString()} vues</span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-xl text-slate-600 leading-relaxed mb-8 font-serif italic border-l-4 border-accent pl-4">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <article className="prose prose-lg prose-slate max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-10 pt-8 border-t border-slate-200">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-slate-900">Tags :</span>
                                {article.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/tag/${tag.slug}`}
                                        className="px-3 py-1 bg-slate-100 hover:bg-accent hover:text-white text-slate-600 text-sm rounded-full transition-colors"
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-slate-900">Partager :</span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advertisement */}
                <div className="max-w-4xl mx-auto my-12">
                    <Banner />
                </div>

                {/* Author Box */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-slate-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                            {article.author.firstName[0]}{article.author.lastName[0]}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">À propos de l&apos;auteur</p>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
                                {article.author.firstName} {article.author.lastName}
                            </h3>
                            <p className="text-slate-600">
                                Journaliste spécialisé couvrant les dernières actualités et analyses approfondies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
