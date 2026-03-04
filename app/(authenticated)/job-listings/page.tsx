export default function JobListingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Offres d&apos;emploi</h1>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">
          Mes Offres d&apos;Emploi Enregistrées
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
          <p className="mb-2">Aucune affiche n&apos;a encore été créée.</p>
          <p>Aucune offre d&apos;emploi enregistrée pour le moment.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-2">
          Créer une Nouvelle Offre d&apos;Emploi
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Choisissez un modèle pour commencer. Vous pouvez modifier la langue du modèle à tout
          moment dans les paramètres.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <div className="aspect-square bg-white/5 flex items-center justify-center text-slate-500 text-sm">
                Offre {i}
              </div>
              <div className="p-2 text-center border-t border-white/10">
                <p className="text-sm font-medium text-white">Modèle offre d&apos;emploi {i}</p>
                <p className="text-xs text-slate-400">1:1</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
