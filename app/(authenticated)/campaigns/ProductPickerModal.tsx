"use client";

import { useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  imageUrl: string | null;
  unit: string | null;
};

export function ProductPickerModal({
  onClose,
  onSelect,
  excludeIds,
}: {
  onClose: () => void;
  onSelect: (products: Product[]) => void;
  excludeIds: string[];
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    setLoading(true);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setCategories(data.categories ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [q, category]);

  const available = products.filter((p) => !excludeIds.includes(p.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddSelection() {
    const toAdd = available.filter((p) => selected.has(p.id));
    onSelect(toAdd);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="rounded-2xl border border-white/10 bg-[#0c0c1a] shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Ajouter un produit</h2>
          <span className="text-sm text-slate-400">Total: {total} produits</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-4 border-b border-white/10 flex gap-2 flex-wrap">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un nom de produit ou une marque..."
            className="flex-1 min-w-[200px] px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white text-sm"
          >
            <option value="">Tous les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-slate-400 text-sm">Chargement...</p>
          ) : available.length === 0 ? (
            <p className="text-slate-400 text-sm">Aucun produit trouvé. Ajoutez-en depuis Admin.</p>
          ) : (
            available.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2 rounded-lg border border-white/10 hover:bg-white/5"
              >
                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.brand ?? "—"} · {p.category ?? "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selected.has(p.id) ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {selected.has(p.id) ? "Sélectionné" : "Ajouter"}
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleAddSelection}
            disabled={selected.size === 0}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            Ajouter la sélection ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}
