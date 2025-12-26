import HeroSlider from "@/components/home/HeroSlider";
import Banner from "@/components/shared/Banner";
import MustReadSection from "@/components/home/MustReadSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import ScienceTechSection from "@/components/home/ScienceTechSection";
import VideoSection from "@/components/home/VideoSection";
import NewsCard from "@/components/shared/NewsCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Mock Data (French)
const mustReadCenter = {
  title: "L'avenir de l'intelligence artificielle générative : Outil ou menace ?",
  category: "Technologie",
  image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
  excerpt: "Des experts du monde entier débattent des implications éthiques et professionnelles de l'adoption massive des modèles de langage avancés.",
  author: "David Vance",
  source: "Wired",
  readingTime: "10 min de lecture",
  date: "Il y a 2h"
};

const mustReadLeft = {
  title: "La crise de l'eau dans les grandes métropoles mondiales",
  category: "Environnement",
  image: "https://images.unsplash.com/photo-1516937941348-c09645f875eb?q=80&w=2000&auto=format&fit=crop",
  excerpt: "Une analyse détaillée de la façon dont des villes comme Mexico et Johannesburg font face au 'Jour Zéro'.",
  author: "Elena Fisher",
  source: "NatGeo",
  readingTime: "5 min de lecture",
  date: "Il y a 4h"
};

const mustReadRight = [
  { title: "Test : iPhone 16 Pro Max", category: "Gadgets", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop", source: "The Verge", readingTime: "8 min de lecture" },
  { title: "Scandale financier à Wall Street", category: "Finance", image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2000&auto=format&fit=crop", source: "Bloomberg", readingTime: "4 min de lecture" }
];

const latestNews = [
  { title: "Les bourses asiatiques clôturent avec de forts gains", category: "Marchés", image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2000&auto=format&fit=crop", excerpt: "Le rebond du secteur technologique propulse les principaux indices après une semaine de volatilité.", date: "Il y a 1h", source: "Bloomberg", readingTime: "3 min" },
  { title: "Une startup logistique lève 50M en série B", category: "Entrepreneuriat", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop", excerpt: "L'entreprise promet de révolutionner le dernier kilomètre avec sa flotte de drones autonomes.", date: "Il y a 3h", source: "TechCrunch", readingTime: "5 min" },
  { title: "Le prix du pétrole se stabilise après l'accord de l'OPEP", category: "Énergie", image: "https://images.unsplash.com/photo-1520695287272-b7a8097d23d7?q=80&w=2000&auto=format&fit=crop", excerpt: "Les pays membres conviennent de maintenir les réductions de production jusqu'à la fin de l'année.", date: "Il y a 6h", source: "Reuters", readingTime: "4 min" },
  { title: "Interview : Un PDG de Fintech explique l'essor des paiements numériques", category: "Finance", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop", excerpt: "L'adoption des portefeuilles mobiles a augmenté de 200% l'année dernière dans la région.", date: "Il y a 12h", source: "Forbes", readingTime: "8 min" }
];

const opinion = [
  { title: "La démocratie à l'ère des algorithmes", category: "Éditorial", author: "Sarah Connor" },
  { title: "Pourquoi nous devons repenser l'urbanisme", category: "Chronique", author: "Mike Ross" },
  { title: "Le coût caché de la fast fashion", category: "Analyse", author: "Elena Fisher" },
  { title: "Lettre du rédacteur : Un nouveau départ", category: "Opinion", author: "J. Jonah Jameson" }
];

const techStories = [
  { title: "La révolution des semi-conducteurs : Pourquoi y a-t-il une pénurie mondiale ?", excerpt: "Une analyse approfondie de la chaîne d'approvisionnement mondiale et de l'impact de la géopolitique.", category: "Technologie", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop", author: "Tech Insider", date: "Il y a 3 jours", source: "The Verge", readingTime: "6 min" },
  { title: "Les nouvelles avancées en fusion nucléaire promettent une énergie propre infinie", excerpt: "Des scientifiques du laboratoire national réussissent une réaction soutenue pendant un certain temps.", category: "Science", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop", author: "Dr. Smith", date: "Hier", source: "Science Daily", readingTime: "4 min" },
  { title: "SpaceX confirme la date de lancement de sa prochaine mission habitée", excerpt: "L'équipage composé de quatre astronautes est déjà en quarantaine.", category: "Espace", image: "https://images.unsplash.com/photo-1516849841032-418b62c17434?q=80&w=2000&auto=format&fit=crop", author: "Elon Team", date: "Il y a 2 jours", source: "Space.com", readingTime: "3 min" },
  { title: "Test : Le nouveau standard de réalité mixte surprend tout le monde", excerpt: "Les lunettes Vision Pro offrent une expérience immersive sans précédent sur le marché.", category: "Gadgets", image: "https://images.unsplash.com/photo-1592478411213-61535fdd861d?q=80&w=2000&auto=format&fit=crop", author: "Mark G.", date: "Il y a 4h", source: "Wired", readingTime: "7 min" },
  { title: "Cybersécurité : Une nouvelle vulnérabilité critique affecte des millions d'appareils", excerpt: "Les experts recommandent de mettre à jour tous les appareils IoT immédiatement après cette découverte.", category: "Sécurité", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop", author: "SecTeam", date: "Il y a 1h", source: "DarkReading", readingTime: "2 min" }
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen pb-12">
      <HeroSlider />

      <Banner />

      {/* MUST READ SECTION (New 3-col layout) */}
      <MustReadSection
        title="À lire absolument"
        leftArticle={mustReadLeft}
        centerArticle={mustReadCenter}
        rightArticles={mustReadRight}
        moreLink="/category/actualites"
      />

      <Banner />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* --- LEFT COLUMN (MAIN CONTENT) --- */}
          <div className="lg:w-3/4 space-y-12">

            {/* Section: Latest News */}
            <LatestNewsSection articles={latestNews} />

            <Banner />

            {/* Section: Tech & Science (Showcase Layout) */}
            <ScienceTechSection
              title="Science et Technologie"
              articles={techStories}
              moreLink="/category/tech"
            />

          </div>

          {/* --- RIGHT COLUMN (SIDEBAR) --- */}
          <div className="lg:w-1/4 space-y-12">

            {/* Sidebar: Opinion */}
            <section>
              <h3 className="text-xl font-serif font-bold mb-4 border-b-2 border-slate-900 pb-2">Opinion</h3>
              <div className="space-y-4">
                {opinion.map((op, idx) => (
                  <NewsCard key={idx} mode="minimal" {...op} />
                ))}
              </div>
            </section>

            {/* Sidebar: Trending Widget */}
            <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <h3 className="text-xl font-serif font-bold mb-6 text-red-700">Les plus lus</h3>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-red-200 transition-colors">1</span>
                  <p className="font-serif font-bold leading-snug group-hover:text-red-700 transition-colors">Les 10 compétences les plus recherchées par les entreprises en 2025</p>
                </div>
                <div className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-red-200 transition-colors">2</span>
                  <p className="font-serif font-bold leading-snug group-hover:text-red-700 transition-colors">Guide complet pour investir dans les obligations vertes</p>
                </div>
                <div className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-red-200 transition-colors">3</span>
                  <p className="font-serif font-bold leading-snug group-hover:text-red-700 transition-colors">Adieu les passeports physiques ? La biométrie prend le contrôle</p>
                </div>
                <div className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-red-200 transition-colors">4</span>
                  <p className="font-serif font-bold leading-snug group-hover:text-red-700 transition-colors">Crise dans le secteur immobilier commercial</p>
                </div>
                <div className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-4xl font-black text-slate-200 leading-none group-hover:text-red-200 transition-colors">5</span>
                  <p className="font-serif font-bold leading-snug group-hover:text-red-700 transition-colors">Nouveau variant de virus détecté en Europe</p>
                </div>
              </div>
            </section>

            {/* Sidebar Ad Object */}
            <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm uppercase tracking-widest border border-gray-200">
              Publicité
            </div>

          </div>

        </div>
      </div>

      <Banner />

      {/* Full Width Section can stay outside the container or inside main, keeping outside for break */}
      <section className="relative w-full h-[500px] flex items-center my-12 group overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"
            alt="Concert"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <span className="bg-accent text-white px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Divertissement</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight">La plus grande tournée de l&apos;histoire arrive en Europe</h2>
            <Link href="#" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-accent hover:text-white transition-colors">
              Voir les détails <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <VideoSection />

    </div>
  );
}
