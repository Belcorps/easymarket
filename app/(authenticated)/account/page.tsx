import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AccountForm } from "./AccountForm";
import { LogoSection } from "./LogoSection";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: { profile: true },
  });
  if (!user?.profile) redirect("/dashboard");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Mon Compte</h1>

      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Informations sur l&apos;entreprise
        </h2>
        <AccountForm
          profileId={user.profile.id}
          defaultValues={{
            storeName: user.profile.storeName,
            phone: user.profile.phone ?? "",
            address: user.profile.address ?? "",
            email: user.email,
          }}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Gestion du logo
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Téléchargez et modifiez le logo de votre entreprise. Vous pouvez
          supprimer l&apos;arrière-plan avec l&apos;IA.
        </p>
        <LogoSection initialLogoUrl={user.profile.logoUrl} />
      </section>

      <p className="mt-4 text-sm text-slate-500">
        <Link href="/dashboard" className="text-violet-300 hover:text-white transition-colors">
          ← Retour au tableau de bord
        </Link>
      </p>
    </div>
  );
}
