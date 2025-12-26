"use client";

export default function BreakingNewsBar() {
    return (
        <div className="bg-slate-100 border-b border-slate-200 py-3">
            <div className="container mx-auto px-4 flex items-center gap-4 text-sm font-medium">
                <span className="bg-red-600 text-white px-3 py-1 font-bold uppercase tracking-wider text-xs animate-pulse">
                    Breaking
                </span>
                <div className="flex-grow overflow-hidden relative h-6">
                    <div className="absolute animate-marquee whitespace-nowrap flex gap-12 items-center h-full">
                        <span className="text-slate-700 flex items-center gap-2"><strong className="text-slate-900">Urgente:</strong> Sismo de 6.5 grados sacude la costa oeste • No se reportan daños mayores por el momento.</span>
                        <span className="text-slate-700 flex items-center gap-2"><strong className="text-slate-900">Deportes:</strong> España anuncia su convocatoria oficial para el mundial.</span>
                        <span className="text-slate-700 flex items-center gap-2"><strong className="text-slate-900">Economía:</strong> Bitcoin supera los 80k dólares por primera vez en el año.</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    animation: marquee 25s linear infinite;
                }
            `}</style>
        </div>
    );
}
