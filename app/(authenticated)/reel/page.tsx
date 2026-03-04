export default function ReelPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Reel</h1>

      <section>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-slate-400 mb-6">
          <p className="mb-2">Aucune affiche n&apos;a encore été créée.</p>
          <p>Aucune campagne enregistrée pour le moment.</p>
        </div>

        <div className="max-w-sm">
          <h2 className="text-lg font-semibold text-white mb-3">Vidéo Exemple</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden aspect-[9/16] flex items-center justify-center">
            <div className="text-slate-400 text-center p-4">
              <p className="text-4xl mb-2">▶</p>
              <p className="text-sm">Format 9:16</p>
              <p className="text-xs mt-1">Reel (bientôt disponible)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
