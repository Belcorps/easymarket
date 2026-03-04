import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CampaignEditor } from "../CampaignEditor";

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login?callbackUrl=/campaigns/new");

  const { template } = await searchParams;
  const templateId = template && ["template1", "template2", "template3", "template4", "template5"].includes(template)
    ? template
    : "template1";

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });
  if (!user?.profile) redirect("/account");

  return (
    <CampaignEditor
      templateId={templateId}
      marketName={user.profile.storeName}
      campaignId={null}
    />
  );
}
