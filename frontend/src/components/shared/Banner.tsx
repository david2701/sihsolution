export default function Banner({ fullWidth = false }: { fullWidth?: boolean }) {
    return (
        <div className={`my-8 ${fullWidth ? 'w-full' : 'container mx-auto px-4'}`}>
            <div className="w-full h-32 md:h-48 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
                <span className="text-sm font-semibold uppercase tracking-widest mb-1">Publicidad</span>
                <span className="text-xs">Espacio reservado para banner</span>
            </div>
        </div>
    );
}
