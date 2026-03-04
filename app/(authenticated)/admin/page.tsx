import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminProducts } from "./AdminProducts";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");
  if ((session.user as { isAdmin?: boolean }).isAdmin !== true) redirect("/dashboard");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const categories = await prisma.product
    .findMany({ select: { category: true }, where: { category: { not: null } }, distinct: ["category"] })
    .then((r) => r.map((c) => c.category).filter(Boolean) as string[]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="text-slate-400 mt-1">Produits en base de données</p>
      </div>
      <AdminProducts initialProducts={products} categories={categories} />
    </div>
  );
}
