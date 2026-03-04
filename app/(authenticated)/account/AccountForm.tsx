"use client";

import { useState } from "react";

type Props = {
  profileId: string;
  defaultValues: {
    storeName: string;
    phone: string;
    address: string;
    email: string;
  };
};

export function AccountForm({ defaultValues }: Props) {
  const [storeName, setStoreName] = useState(defaultValues.storeName);
  const [phone, setPhone] = useState(defaultValues.phone);
  const [address, setAddress] = useState(defaultValues.address);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeName, phone, address }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setMessage({ type: "ok", text: "Enregistré." });
    } else {
      setMessage({ type: "error", text: data.error || "Erreur." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <p
          className={`text-sm p-3 rounded-xl ${
            message.type === "ok"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {message.text}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Nom du magasin</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500/50 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Adresse</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500/50 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
        <input
          type="email"
          value={defaultValues.email}
          disabled
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500"
        />
        <p className="text-xs text-slate-500 mt-1">L&apos;e-mail ne peut pas être modifié ici.</p>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 text-white font-medium hover:opacity-95 disabled:opacity-50 transition-opacity"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
