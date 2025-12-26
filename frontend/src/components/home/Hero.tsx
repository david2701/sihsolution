import NewsCard from "@/components/shared/NewsCard";

export default function Hero() {
    return (
        <section className="container mx-auto px-4 py-8">
            {/* Top Section: Main Hero + Sidebar list */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-b border-spacing-2 border-slate-200 pb-12">

                {/* LEFT COLUMN: Main Feature (8 cols) */}
                <div className="lg:col-span-8">
                    <NewsCard
                        mode="hero"
                        title="Crisis Climática: Líderes mundiales acuerdan nuevas metas de reducción de carbono para 2030"
                        category="Planeta"
                        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
                        excerpt="En una cumbre histórica, las principales potencias económicas han firmado el 'Pacto del Futuro', comprometiéndose a una transición energética acelerada que transformará la industria global."
                        author="Sarah Jenkins"
                        date="Hace 2 horas"
                    />
                </div>

                {/* RIGHT COLUMN: Top Stories Sidebar (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-600">Top Stories</h3>
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    </div>

                    <div className="flex flex-col h-full justify-between gap-2">
                        <NewsCard
                            mode="compact"
                            title="El mercado de valores reacciona positivamente a los datos de empleo de EE.UU."
                            category="Economía"
                            date="Hace 30m"
                            image="https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2000&auto=format&fit=crop"
                        />
                        <NewsCard
                            mode="compact"
                            title="Ucrania: Nuevos desarrollos en el frente este mientras continúa la diplomacia"
                            category="Mundo"
                            date="Hace 1h"
                            image="https://images.unsplash.com/photo-1579308871226-7c385fa19293?q=80&w=2000&auto=format&fit=crop"
                        />
                        <NewsCard
                            mode="compact"
                            title="Apple anuncia su nuevo dispositivo de realidad aumentada revolucionario"
                            category="Tecnología"
                            date="Hace 3h"
                            image="https://images.unsplash.com/photo-1592478411213-61535fdd861d?q=80&w=2000&auto=format&fit=crop"
                        />
                        <NewsCard
                            mode="compact"
                            title="Descubren nueva especie marina en las fosas del Pacífico"
                            category="Ciencia"
                            date="Hace 5h"
                            image="https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2000&auto=format&fit=crop"
                        />
                    </div>
                </div>
            </div>

            {/* SECOND ROW: 4 Columns "Must Read" */}
            <div className="mb-4">
                <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                    <span className="bg-slate-900 text-white px-2 py-1 text-sm uppercase tracking-wider">Must Read</span>
                    <span className="h-px bg-slate-200 flex-grow"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <NewsCard
                        mode="standard"
                        title="La educación en línea está fallando a los estudiantes más vulnerables"
                        category="Educación"
                        image="https://images.unsplash.com/photo-1427504743050-dad37e91d77e?q=80&w=2000&auto=format&fit=crop"
                    />
                    <NewsCard
                        mode="standard"
                        title="¿Es el hidrógeno verde la solución real?"
                        category="Energía"
                        image="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=2000&auto=format&fit=crop"
                    />
                    <NewsCard
                        mode="standard"
                        title="El auge del turismo sostenible en América Latina"
                        category="Viajes"
                        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
                    />
                    <NewsCard
                        mode="standard"
                        title="Entrevista: El director que cambió Hollywood"
                        category="Cine"
                        image="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop"
                    />
                </div>
            </div>

        </section>
    );
}
