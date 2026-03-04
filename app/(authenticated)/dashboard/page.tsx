import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login?callbackUrl=/dashboard");

  const userId = await prisma.user.findUnique({ where: { email: session.user.email } }).then((u) => u?.id);

  let campaignsCount = 0;
  let productsTotal = 0;
  let categoriesCount = 0;
  let brandsCount = 0;
  try {
    [campaignsCount, productsTotal, categoriesCount, brandsCount] = await Promise.all([
      userId ? prisma.campaign.count({ where: { userId } }) : 0,
      prisma.product.count(),
      prisma.product.findMany({ select: { category: true }, where: { category: { not: null } }, distinct: ["category"] }).then((r) => r.length),
      prisma.product.findMany({ select: { brand: true }, where: { brand: { not: null } }, distinct: ["brand"] }).then((r) => r.length),
    ]);
  } catch {
    // Prisma client pas régénéré ou tables absentes : exécuter "npx prisma generate" puis "npx prisma migrate dev"
  }

  const cardClass = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-center gap-3";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Tableau de Bord</h1>
        <p className="text-slate-400">
          Consultez les statistiques générales de votre compte et du système.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Mes Statistiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Campagnes Totales", value: String(campaignsCount), icon: "▣" },
            { label: "Annonces Totales", value: "0", icon: "◈" },
            { label: "Offres d'Emploi Totales", value: "0", icon: "◇" },
            { label: "Modèle Préféré", value: "N/A", icon: "★" },
          ].map((stat) => (
            <div key={stat.label} className={cardClass}>
              <span className="text-2xl text-violet-400">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Statistiques Générales</h2>
        <p className="text-sm text-slate-400 mb-3">Produits en base de données</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={cardClass}>
            <span className="text-2xl text-violet-400">📦</span>
            <div>
              <p className="text-2xl font-bold text-white">{productsTotal}</p>
              <p className="text-sm text-slate-400">Produits en BD</p>
            </div>
          </div>
          <div className={cardClass}>
            <span className="text-2xl text-teal-400">📁</span>
            <div>
              <p className="text-2xl font-bold text-white">{categoriesCount}</p>
              <p className="text-sm text-slate-400">Catégories Totales</p>
            </div>
          </div>
          <div className={cardClass}>
            <span className="text-2xl text-violet-400">🏷️</span>
            <div>
              <p className="text-2xl font-bold text-white">{brandsCount}</p>
              <p className="text-sm text-slate-400">Marques Totales</p>
            </div>
          </div>
        </div>
        {(session.user as { isAdmin?: boolean }).isAdmin === true && (
          <div className="mt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-violet-500/50 transition-all"
            >
              <span className="text-2xl text-violet-400">⚙</span>
              <div>
                <p className="text-sm font-bold text-white">Admin</p>
                <p className="text-xs text-slate-400">Gérer les produits</p>
              </div>
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Affiches Récentes</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
          <p className="mb-2">Aucune affiche n&apos;a encore été créée.</p>
          <p>
            Pour commencer, créez une nouvelle affiche depuis la page{" "}
            <Link href="/campaigns" className="text-violet-300 hover:text-white font-medium">
              Mes Campagnes
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
