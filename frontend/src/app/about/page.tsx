export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pb-16">
            <div className="bg-slate-50 py-16 mb-12 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">À propos de nous</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        SIH Solutions est la nouvelle voix du journalisme numérique. Nous recherchons la vérité avec intégrité et la présentons avec innovation.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="prose prose-lg mx-auto mb-16 text-slate-700">
                    <h2 className="font-serif">Notre Mission</h2>
                    <p>
                        Informer de manière véridique, opportune et impartiale, en utilisant les dernières technologies pour apporter les nouvelles dans tous les coins du monde. Nous croyons au pouvoir de l&apos;information pour transformer les sociétés.
                    </p>
                    <h2 className="font-serif">Notre Vision</h2>
                    <p>
                        Devenir la référence mondiale en actualités numériques, établissant la norme de qualité journalistique et d&apos;expérience utilisateur sur le web moderne.
                    </p>
                </div>

                {/* Team Section */}
                <div className="border-t border-slate-100 pt-16">
                    <h2 className="text-3xl font-serif font-bold text-center mb-12">Notre Équipe</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Marie Dupont", role: "Rédactrice en chef" },
                            { name: "Jean-Pierre Martin", role: "Directeur technique" },
                            { name: "Sophie Bernard", role: "Responsable éditorial" }
                        ].map((member, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto mb-4 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?img=${idx + 10}`} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-accent text-sm font-medium uppercase tracking-wide">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
