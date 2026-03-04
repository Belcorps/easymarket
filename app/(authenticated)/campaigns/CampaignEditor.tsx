"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TemplatePreview, type TemplateData, type TemplateProduct } from "@/components/templates/TemplatePreview";
import { CAMPAIGN_FORMATS, type FormatType } from "@/lib/campaign-formats";
import { ProductPickerModal } from "./ProductPickerModal";

type ProductInCampaign = {
  productId: string;
  product: { id: string; name: string; brand: string | null; category: string | null; imageUrl: string | null; unit: string | null };
  order: number;
  oldPrice: string;
  newPrice: string;
  halal: boolean;
  bio: boolean;
  vegan: boolean;
  newIcon: boolean;
};

type Props = {
  templateId: string;
  marketName: string;
  campaignId: string | null;
  initialCampaign?: {
    name: string;
    formatType: FormatType;
    startDate: string;
    endDate: string;
    showAddress: boolean;
    showPhone: boolean;
    showDiscountPct: boolean;
    language: string;
    language2: string;
    currency: string;
    products: ProductInCampaign[];
  };
};

export function CampaignEditor({ templateId, marketName, campaignId, initialCampaign }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialCampaign?.name ?? "Nouvelle Campagne");
  const [formatType, setFormatType] = useState<FormatType>(initialCampaign?.formatType ?? "instagram_post_portrait");
  const [startDate, setStartDate] = useState(initialCampaign?.startDate ?? new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(initialCampaign?.endDate ?? "");
  const [showAddress, setShowAddress] = useState(initialCampaign?.showAddress ?? true);
  const [showPhone, setShowPhone] = useState(initialCampaign?.showPhone ?? true);
  const [showDiscountPct, setShowDiscountPct] = useState(initialCampaign?.showDiscountPct ?? false);
  const [language, setLanguage] = useState(initialCampaign?.language ?? "fr");
  const [language2, setLanguage2] = useState(initialCampaign?.language2 ?? "");
  const [currency, setCurrency] = useState(initialCampaign?.currency ?? "€");
  const [products, setProducts] = useState<ProductInCampaign[]>(initialCampaign?.products ?? []);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const templateData: TemplateData = {
    marketName,
    products: products.map((p) => ({
      name: p.product.name,
      imageUrl: p.product.imageUrl,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      unit: p.product.unit,
    })),
    campaignName: name,
    startDate,
    endDate,
    showAddress,
    showPhone,
    language,
    currency,
  };

  function addProducts(selected: { id: string; name: string; brand: string | null; category: string | null; imageUrl: string | null; unit: string | null }[]) {
    const next = products.length;
    setProducts((prev) => [
      ...prev,
      ...selected.map((p, i) => ({
        productId: p.id,
        product: p,
        order: next + i,
        oldPrice: "",
        newPrice: "",
        halal: false,
        bio: false,
        vegan: false,
        newIcon: false,
      })),
    ]);
    setShowProductPicker(false);
  }

  function updateProduct(index: number, updates: Partial<ProductInCampaign>) {
    setProducts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }

  function removeProduct(index: number) {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    const payload = {
      name,
      formatType,
      startDate: startDate || null,
      endDate: endDate || null,
      showAddress,
      showPhone,
      showDiscountPct,
      language,
      language2: language2 || null,
      currency,
      products: products.map((p, i) => ({
        productId: p.productId,
        order: i,
        oldPrice: p.oldPrice,
        newPrice: p.newPrice,
        halal: p.halal,
        bio: p.bio,
        vegan: p.vegan,
        newIcon: p.newIcon,
      })),
    };
    const url = campaignId ? `/api/campaigns/${campaignId}` : "/api/campaigns";
    const method = campaignId ? "PATCH" : "POST";
    const body = campaignId ? payload : { ...payload, templateId };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      if (data.id) router.push(`/campaigns/${data.id}/edit`);
      else router.push("/campaigns");
      router.refresh();
    } else {
      setError(data.error || "Erreur lors de l'enregistrement.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/campaigns" className="text-violet-300 hover:text-white font-medium">
          ← Retour
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-white/10 rounded-lg bg-white/5 text-white px-2 py-1.5"
          >
            <option value="fr">FR Français</option>
            <option value="tr">TR Türkçe</option>
            <option value="de">DE Deutsch</option>
            <option value="en">EN English</option>
          </select>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-300">Format visuel :</span>
          <select
            value={formatType}
            onChange={(e) => setFormatType(e.target.value as FormatType)}
            className="text-sm border border-white/10 rounded-lg px-3 py-2 bg-white/5 text-white"
          >
            {(Object.keys(CAMPAIGN_FORMATS) as FormatType[]).map((key) => (
              <option key={key} value={key}>
                {CAMPAIGN_FORMATS[key].label} ({CAMPAIGN_FORMATS[key].width}×{CAMPAIGN_FORMATS[key].height})
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex justify-center">
          <TemplatePreview templateId={templateId} data={templateData} formatType={formatType} className="flex-shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold text-white mb-3">Produits ({products.length})</h3>
          <button
            type="button"
            onClick={() => setShowProductPicker(true)}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 mb-4"
          >
            + Ajouter un produit
          </button>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div
                key={`${p.productId}-${i}`}
                className="border border-white/10 rounded-lg p-3 flex gap-3 items-start"
              >
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  {p.product.imageUrl ? (
                    <img src={p.product.imageUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{p.product.name}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-xs text-slate-400">Ancien prix</label>
                      <input
                        type="text"
                        value={p.oldPrice}
                        onChange={(e) => updateProduct(i, { oldPrice: e.target.value })}
                        placeholder="1,99"
                        className="w-full px-2 py-1 text-sm border border-white/10 rounded bg-white/5 text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Nouveau prix</label>
                      <input
                        type="text"
                        value={p.newPrice}
                        onChange={(e) => updateProduct(i, { newPrice: e.target.value })}
                        placeholder="1,29"
                        className="w-full px-2 py-1 text-sm border border-white/10 rounded bg-white/5 text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                  {!p.product.imageUrl && (
                    <p className="text-xs text-amber-300 bg-amber-500/20 mt-2 px-2 py-1 rounded">
                      Photo : ajoutez-la dans Admin pour ce produit, puis ré-ajoutez le produit ici.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["halal", "bio", "vegan", "newIcon"].map((key) => (
                      <label key={key} className="flex items-center gap-1 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={p[key as keyof ProductInCampaign] as boolean}
                          onChange={(e) => updateProduct(i, { [key]: e.target.checked })}
                          className="rounded"
                        />
                        {key === "newIcon" ? "New" : key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(i)}
                  className="text-red-400 hover:underline text-sm shrink-0"
                >
                  Suppr.
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold text-white mb-3">Détails de la campagne</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Nouvelle Campagne</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold text-white mb-3">Paramètres de l&apos;affiche</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={showAddress}
                  onChange={(e) => setShowAddress(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Afficher l&apos;adresse sur l&apos;affiche</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Afficher le téléphone sur l&apos;affiche</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={showDiscountPct}
                  onChange={(e) => setShowDiscountPct(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Afficher le pourcentage de réduction</span>
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-400">Langue actuelle: {language.toUpperCase()}</p>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Ajouter une 2ème langue</label>
                <select
                  value={language2}
                  onChange={(e) => setLanguage2(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                >
                  <option value="">Laisser vide</option>
                  <option value="tr">Türkçe</option>
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Devise</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white"
                >
                  <option value="€">€ (Euro)</option>
                  <option value="£">£</option>
                  <option value="$">$</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showProductPicker && (
        <ProductPickerModal
          onClose={() => setShowProductPicker(false)}
          onSelect={addProducts}
          excludeIds={products.map((p) => p.productId)}
        />
      )}
    </div>
  );
}
