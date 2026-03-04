import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CampaignCard } from "./CampaignCard";

const TEMPLATES = [
  { id: "template1", name: "Ramazan Promo" },
  { id: "template2", name: "Super Kampanya" },
  { id: "template3", name: "Kampanya Vert" },
  { id: "template4", name: "Minimal Sombre" },
  { id: "template5", name: "Offre du jour" },
];

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login?callbackUrl=/campaigns");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const campaigns = user
    ? await prisma.campaign.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        include: { products: { include: { product: true } } },
      })
    : [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Mes Campagnes</h1>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Mes éléments enregistrés</h2>
        {campaigns.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
            <p className="mb-2">Aucune affiche n&apos;a encore été créée.</p>
            <p>Aucune campagne enregistrée pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {campaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={{
                  id: c.id,
                  name: c.name,
                  templateId: c.templateId,
                  formatType: (c as { formatType?: string }).formatType,
                  products: c.products,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-2">Sélectionner un modèle</h2>
        <p className="text-slate-400 text-sm mb-2">
          Choisissez un modèle pour commencer. Vous pouvez modifier la langue et le format (Instagram, Facebook, Reel) dans l’éditeur.
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Formats : Instagram Post (4:5, 1:1), Facebook Post (4:5), Reel/Story (9:16).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TEMPLATES.map((t) => (
            <Link
              key={t.id}
              href={`/campaigns/new?template=${t.id}`}
              className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-violet-500/50 transition-all"
            >
              <div className="aspect-[4/5] bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-white/10">
                <span className="text-4xl">▣</span>
              </div>
              <div className="p-3 text-center border-t border-white/10">
                <p className="text-sm font-medium text-white">{t.name}</p>
                <span className="inline-block mt-2 text-xs font-medium text-violet-300">
                  Sélectionner ce modèle
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
