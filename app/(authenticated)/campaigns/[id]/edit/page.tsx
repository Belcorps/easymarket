import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { FormatType } from "@/lib/campaign-formats";
import { CampaignEditor } from "../../CampaignEditor";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const { id } = await params;
  const campaign = await prisma.campaign.findFirst({
    where: { id },
    include: {
      products: { include: { product: true }, orderBy: { order: "asc" } },
    },
  });
  if (!campaign) notFound();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });
  if (!user || campaign.userId !== user.id) redirect("/campaigns");
  if (!user.profile) redirect("/account");

  type CampaignWithFormat = typeof campaign & { formatType?: string };
  const c = campaign as CampaignWithFormat;
  return (
    <CampaignEditor
      templateId={campaign.templateId}
      marketName={user.profile.storeName}
      campaignId={campaign.id}
      initialCampaign={{
        name: campaign.name,
        formatType: (c.formatType ?? "instagram_post_portrait") as FormatType,
        startDate: campaign.startDate?.toISOString().slice(0, 10) ?? "",
        endDate: campaign.endDate?.toISOString().slice(0, 10) ?? "",
        showAddress: campaign.showAddress,
        showPhone: campaign.showPhone,
        showDiscountPct: campaign.showDiscountPct,
        language: campaign.language,
        language2: campaign.language2 ?? "",
        currency: campaign.currency,
        products: campaign.products.map((cp) => ({
          productId: cp.productId,
          product: cp.product,
          order: cp.order,
          oldPrice: cp.oldPrice ?? "",
          newPrice: cp.newPrice ?? "",
          halal: cp.halal,
          bio: cp.bio,
          vegan: cp.vegan,
          newIcon: cp.newIcon,
        })),
      }}
    />
  );
}
