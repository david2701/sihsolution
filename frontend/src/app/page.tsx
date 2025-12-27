import HeroSlider from "@/components/home/HeroSlider";
import Banner from "@/components/shared/Banner";
import MustReadSection from "@/components/home/MustReadSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import ScienceTechSection from "@/components/home/ScienceTechSection";
import VideoSection from "@/components/home/VideoSection";
import NewsCard from "@/components/shared/NewsCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// API URL for server-side fetch
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api:3001';

async function getArticles() {
  try {
    const res = await fetch(`${API_URL}/api/articles?status=PUBLISHED&limit=20`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getBanners() {
  try {
    const res = await fetch(`${API_URL}/api/banners`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

async function getVideos() {
  try {
    const res = await fetch(`${API_URL}/api/videos`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

// Helper to format article for components
function formatArticle(article: any) {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category?.name || 'Actualités',
    image: article.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    excerpt: article.excerpt || '',
    author: `${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim() || 'Rédaction',
    source: 'SIH Solutions',
    readingTime: `${Math.ceil((article.content?.length || 0) / 1000)} min de lecture`,
    date: new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
  };
}

export default async function Home() {
  // Fetch data from API
  const [articles, categories, banners, videos] = await Promise.all([
    getArticles(),
    getCategories(),
    getBanners(),
    getVideos(),
  ]);

  // Format articles for display
  const formattedArticles = articles.map(formatArticle);

  // Split articles for different sections
  const mustReadCenter = formattedArticles[0] || {
    title: "Bienvenue sur SIH Solutions",
    category: "Actualités",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    excerpt: "Votre source d'actualités de confiance.",
    author: "Rédaction",
    source: "SIH Solutions",
    readingTime: "1 min de lecture",
    date: "Aujourd'hui"
  };

  const mustReadLeft = formattedArticles[1] || mustReadCenter;
  const mustReadRight = formattedArticles.slice(2, 4).map(a => ({
    title: a.title,
    category: a.category,
    image: a.image,
    source: a.source,
    readingTime: a.readingTime
  }));

  const latestNews = formattedArticles.slice(0, 4);
  const techStories = formattedArticles.slice(4, 9);

  const opinion = formattedArticles.slice(9, 13).map(a => ({
    title: a.title,
    category: a.category,
    author: a.author
  }));

  return (
    <div className="bg-white min-h-screen pb-12">
      <HeroSlider articles={formattedArticles.slice(0, 5)} />

      <Banner />

      {/* MUST READ SECTION */}
      <MustReadSection
        title="À lire absolument"
        leftArticle={mustReadLeft}
        centerArticle={mustReadCenter}
        rightArticles={mustReadRight.length > 0 ? mustReadRight : [{ title: "À venir", category: "Actualités", image: "https://picsum.photos/seed/1/800/400", source: "SIH", readingTime: "1 min" }]}
        moreLink="/category/actualites"
      />

      <Banner />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* --- LEFT COLUMN (MAIN CONTENT) --- */}
          <div className="lg:w-3/4 space-y-12">

            {/* Section: Latest News */}
            <LatestNewsSection articles={latestNews.length > 0 ? latestNews : [{ title: "Aucun article", category: "Info", image: "", excerpt: "Revenez bientôt pour voir les dernières actualités.", date: "Aujourd'hui", source: "SIH", readingTime: "1 min" }]} />

            <Banner />

            {/* Section: Tech & Science */}
            <ScienceTechSection
              title="Science et Technologie"
              articles={techStories.length > 0 ? techStories : [{ title: "À venir", excerpt: "Contenu technologique à venir.", category: "Tech", image: "", author: "SIH", date: "Bientôt", source: "SIH", readingTime: "1 min" }]}
              moreLink="/category/technologie"
            />

          </div>

          {/* --- RIGHT COLUMN (SIDEBAR) --- */}
          <div className="lg:w-1/4 space-y-12">

            {/* Sidebar: Opinion */}
            <section>
              <h3 className="text-xl font-serif font-bold mb-4 border-b-2 border-slate-900 pb-2">Opinion</h3>
              <div className="space-y-4">
                {(opinion.length > 0 ? opinion : [{ title: "À venir", category: "Opinion", author: "Rédaction" }]).map((op, idx) => (
                  <NewsCard key={idx} mode="minimal" {...op} />
                ))}
              </div>
            </section>

            {/* Sidebar: Trending Widget */}
            <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <h3 className="text-xl font-serif font-bold mb-6 text-red-700">Les plus lus</h3>
              <div className="flex flex-col gap-6">
                {formattedArticles.slice(0, 5).map((article, idx) => (
                  <Link key={idx} href={`/article/${article.slug}`} className="flex gap-4 items-start group cursor-pointer">
                    <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-red-200 transition-colors">{idx + 1}</span>
                    <p className="font-serif font-bold leading-snug group-hover:text-red-700 transition-colors">{article.title}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Sidebar Ad */}
            <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest border border-gray-200">
              Publicité
            </div>

          </div>

        </div>
      </div>

      <Banner />

      {/* Full Width Featured Article */}
      {formattedArticles[0] && (
        <section className="relative w-full h-[500px] flex items-center my-12 group overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={formattedArticles[0].image}
              alt={formattedArticles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-2xl">
              <span className="bg-accent text-white px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">{formattedArticles[0].category}</span>
              <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">{formattedArticles[0].title}</h2>
              <Link href={`/article/${formattedArticles[0].slug}`} className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-accent hover:text-white transition-colors">
                Lire l&apos;article <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      <VideoSection videos={videos} />

    </div>
  );
}
