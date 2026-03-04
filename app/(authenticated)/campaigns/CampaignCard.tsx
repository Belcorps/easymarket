"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CAMPAIGN_FORMATS, type FormatType } from "@/lib/campaign-formats";

type Campaign = {
  id: string;
  name: string;
  templateId: string;
  formatType?: string | null;
  products: { productId: string }[];
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const formatLabel =
    campaign.formatType && CAMPAIGN_FORMATS[campaign.formatType as FormatType]
      ? CAMPAIGN_FORMATS[campaign.formatType as FormatType].label
      : campaign.templateId;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Supprimer cette campagne ?")) return;
    setDeleting(true);
    const res = await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-violet-500/30 transition-colors flex flex-col">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{campaign.name}</p>
        <p className="text-xs text-slate-400 mt-1">
          {campaign.products.length} produit(s) · {formatLabel}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
        <Link
          href={`/campaigns/${campaign.id}/edit`}
          className="flex-1 text-center py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90"
        >
          Modifier
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="py-1.5 px-3 rounded-lg border border-red-500/50 text-red-400 text-sm font-medium hover:bg-red-500/10 disabled:opacity-50"
        >
          {deleting ? "…" : "Supprimer"}
        </button>
      </div>
    </div>
  );
}
