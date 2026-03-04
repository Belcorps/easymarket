"use client";

import { useState, useRef } from "react";
import { removeBackgroundInBrowser } from "@/lib/removeBackground";

type Props = {
  initialLogoUrl: string | null;
};

export function LogoSection({ initialLogoUrl }: Props) {
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [removeBgLoading, setRemoveBgLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("removeBg", "false");
    const res = await fetch("/api/upload/logo", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    e.target.value = "";
    if (res.ok && data.logoUrl) {
      setLogoUrl(data.logoUrl);
    } else {
      setError(data.error || "Erreur lors du téléchargement.");
    }
  }

  async function handleRemoveBg() {
    if (!logoUrl) return;
    setError("");
    setRemoveBgLoading(true);
    try {
      const imageSrc = logoUrl.startsWith("http") ? logoUrl : `${window.location.origin}${logoUrl}`;
      const blob = await removeBackgroundInBrowser(imageSrc);
      const formData = new FormData();
      formData.set("file", blob, "logo.png");
      formData.set("removeBg", "false");
      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.logoUrl) {
        setLogoUrl(data.logoUrl + "?t=" + Date.now());
      } else {
        setError(data.error || "Erreur lors de l’upload du logo.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Suppression du fond impossible. Réessayez."
      );
    } finally {
      setRemoveBgLoading(false);
    }
  }

  async function handleRemoveLogo() {
    setError("");
    const res = await fetch("/api/upload/logo", {
      method: "DELETE",
    });
    if (res.ok) {
      setLogoUrl(null);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Erreur.");
    }
  }

  return (
    <div className="flex items-start gap-6">
      <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden shrink-0">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-slate-500 text-sm">Aucun logo</span>
        )}
      </div>
      <div className="flex-1">
        {error && (
          <p className="text-sm text-red-300 bg-red-500/20 border border-red-500/30 p-2 rounded-xl mb-2">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 text-white text-sm font-medium hover:opacity-95 disabled:opacity-50"
          >
            {uploading ? "Téléchargement..." : "Télécharger le logo"}
          </button>
          <button
            type="button"
            onClick={handleRemoveBg}
            disabled={!logoUrl || removeBgLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/80 text-white text-sm font-medium hover:bg-violet-600 disabled:opacity-50 border border-violet-500/50"
            title="Supprimer l'arrière-plan (IA) dans le navigateur, gratuit"
          >
            {removeBgLoading ? "Traitement (1ère fois peut prendre 1–2 min)…" : "Supprimer l'arrière-plan (IA)"}
          </button>
          {logoUrl && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/50 text-red-300 text-sm font-medium hover:bg-red-500/20"
            >
              Retirer le logo
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          JPG, PNG, WebP. « Supprimer l&apos;arrière-plan (IA) » : traitement dans le
          navigateur (gratuit). Le premier appel peut prendre 1–2 minutes (téléchargement du modèle).
        </p>
      </div>
    </div>
  );
}
