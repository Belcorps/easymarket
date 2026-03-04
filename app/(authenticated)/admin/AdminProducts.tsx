"use client";

import { useState, useRef } from "react";
import { removeBackgroundInBrowser } from "@/lib/removeBackground";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  imageUrl: string | null;
  unit: string | null;
};

export function AdminProducts({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: string[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeBg, setRemoveBg] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File, removeBackground: boolean): Promise<string | null> {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("removeBg", removeBackground ? "true" : "false");
    const res = await fetch("/api/upload/product", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.imageUrl) return data.imageUrl;
    return null;
  }

  async function uploadBlob(blob: Blob): Promise<string | null> {
    const file = new File([blob], "image.png", { type: blob.type || "image/png" });
    return uploadImage(file, false);
  }

  async function handleRemoveBackground() {
    if (!imageFile && !imageUrl) return;
    setError("");
    setUploading(true);
    try {
      const source = imageFile ?? (imageUrl!.startsWith("http") ? imageUrl! : `${typeof window !== "undefined" ? window.location.origin : ""}${imageUrl!}`);
      const blob = await removeBackgroundInBrowser(source);
      const url = await uploadBlob(blob);
      if (url) {
        setImageUrl(url);
        setImageFile(null);
      } else {
        setError("Erreur lors de l’upload après suppression du fond.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression du fond impossible. Réessayez.");
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    let finalImageUrl = imageUrl;
    if (imageFile && !finalImageUrl) {
      if (removeBg) {
        try {
          const blob = await removeBackgroundInBrowser(imageFile);
          finalImageUrl = (await uploadBlob(blob)) ?? undefined;
        } catch {
          finalImageUrl = (await uploadImage(imageFile, false)) ?? undefined;
        }
      } else {
        finalImageUrl = (await uploadImage(imageFile, false)) ?? undefined;
      }
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        brand: brand.trim() || undefined,
        category: category.trim() || undefined,
        unit: unit.trim() || undefined,
        imageUrl: finalImageUrl || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setProducts((prev) => [data, ...prev]);
      setName("");
      setBrand("");
      setCategory("");
      setUnit("");
      setImageUrl(null);
      setImageFile(null);
      setShowForm(false);
    } else {
      setError(data.error || "Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function startEdit(p: Product) {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand ?? "");
    setCategory(p.category ?? "");
    setUnit(p.unit ?? "");
    setImageUrl(p.imageUrl);
    setImageFile(null);
    setError("");
  }

  function cancelEdit() {
    setEditingProduct(null);
    setName("");
    setBrand("");
    setCategory("");
    setUnit("");
    setImageUrl(null);
    setImageFile(null);
    setError("");
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setError("");
    setSaving(true);
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const url = await uploadImage(imageFile, removeBg);
      finalImageUrl = url ?? imageUrl;
    }
    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        brand: brand.trim() || null,
        category: category.trim() || null,
        unit: unit.trim() || null,
        imageUrl: finalImageUrl ?? null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setProducts((prev) =>
        prev.map((prod) => (prod.id === editingProduct.id ? data : prod))
      );
      cancelEdit();
    } else {
      setError(data.error || "Erreur lors de la modification.");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(null);
    }
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Total : <strong className="text-white">{products.length}</strong> produits
        </p>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
        >
          {showForm ? "Annuler" : "+ Ajouter un produit"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4"
        >
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">{error}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nom du produit</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Islak mendil 100 yaprak"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Marque</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Sleepy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Catégorie</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categories-list"
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Produits de nettoyage"
              />
              <datalist id="categories-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unité (ex. Gram, Paket)</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Paket, Gram"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Photo du produit</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onFileChange}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
              >
                Choisir une photo
              </button>
              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={(!imageFile && !imageUrl) || uploading}
                className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
                title="Gratuit, traitement dans le navigateur"
              >
                {uploading ? "Traitement (1ère fois ~1–2 min)…" : "Supprimer l'arrière-plan (IA)"}
              </button>
            </div>
            {(imageFile || imageUrl) && (
              <div className="mt-2 w-24 h-24 rounded-lg border border-white/10 overflow-hidden bg-white/5">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                ) : (
                  imageFile && (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )
                )}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG ou WebP. Arrière-plan (IA) : gratuit, dans le navigateur.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Ajout..." : "Ajouter à la base"}
          </button>
        </form>
      )}

      {editingProduct && (
        <form
          onSubmit={handleEdit}
          className="rounded-2xl border border-violet-500/30 bg-white/5 p-4 space-y-4"
        >
          <h3 className="font-semibold text-white">Modifier le produit</h3>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">{error}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nom du produit</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Islak mendil 100 yaprak"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Marque</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Sleepy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Catégorie</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categories-list-edit"
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Produits de nettoyage"
              />
              <datalist id="categories-list-edit">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unité (ex. Gram, Paket)</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="ex. Paket, Gram"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Photo du produit</label>
            <input
              ref={editFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImageUrl(null);
                }
                e.target.value = "";
              }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
              >
                Changer la photo
              </button>
              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={(!imageFile && !imageUrl) || uploading}
                className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
                title="Gratuit, dans le navigateur"
              >
                {uploading ? "Traitement (1ère fois ~1–2 min)…" : "Supprimer l'arrière-plan (IA)"}
              </button>
              {(imageUrl || imageFile) && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl(null);
                    setImageFile(null);
                  }}
                  className="px-3 py-2 rounded-lg border border-white/20 text-slate-300 text-sm font-medium hover:bg-white/10"
                >
                  Retirer la photo
                </button>
              )}
            </div>
            {(imageFile || imageUrl) && (
              <div className="mt-2 w-24 h-24 rounded-lg border border-white/10 overflow-hidden bg-white/5">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                ) : (
                  imageFile && (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 text-sm font-medium hover:bg-white/10"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-3 font-medium text-slate-300 w-14">Photo</th>
                <th className="text-left p-3 font-medium text-slate-300">Nom</th>
                <th className="text-left p-3 font-medium text-slate-300">Marque</th>
                <th className="text-left p-3 font-medium text-slate-300">Catégorie</th>
                <th className="text-left p-3 font-medium text-slate-300">Unité</th>
                <th className="w-20 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-white">{p.name}</td>
                  <td className="p-3 text-slate-400">{p.brand ?? "—"}</td>
                  <td className="p-3 text-slate-400">{p.category ?? "—"}</td>
                  <td className="p-3 text-slate-400">{p.unit ?? "—"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="text-violet-300 hover:text-white text-xs font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:underline text-xs"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            Aucun produit. Ajoutez-en un pour les utiliser dans les campagnes.
          </div>
        )}
      </div>
    </div>
  );
}
