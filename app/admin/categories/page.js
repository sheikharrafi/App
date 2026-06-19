"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, FolderOpen } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "", icon: "📁", color: "#8B5CF6" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabaseBrowser.from("categories").select("*").order("sort_order");
    setCategories(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newCat.name.trim()) { toast.error("Name is required"); return; }
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabaseBrowser.from("categories").insert({ ...newCat, slug, sort_order: categories.length });
    if (error) { toast.error(error.message); }
    else { toast.success("Category added!"); setNewCat({ name: "", slug: "", description: "", icon: "📁", color: "#8B5CF6" }); setShowForm(false); fetchCategories(); }
  };

  const handleUpdate = async (id, field, value) => {
    const { error } = await supabaseBrowser.from("categories").update({ [field]: value }).eq("id", id);
    if (error) toast.error(error.message);
    else { setCategories(categories.map((c) => c.id === id ? { ...c, [field]: value } : c)); toast.success("Updated!"); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const { error } = await supabaseBrowser.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setCategories(categories.filter((c) => c.id !== id)); toast.success("Deleted!"); }
  };

  const toggleVisibility = async (id, current) => {
    await handleUpdate(id, "is_visible", !current);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="mt-1 text-sm text-slate-400">{categories.length} categories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="text" placeholder="Category name" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
            <input type="text" placeholder="Icon (emoji)" value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
          </div>
          <input type="text" placeholder="Description" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
          <div className="flex items-center gap-3">
            <input type="color" value={newCat.color} onChange={(e) => setNewCat({ ...newCat, color: e.target.value })} className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent" />
            <button onClick={handleAdd} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">Save</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:bg-white/5">Cancel</button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <span className="text-2xl">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white">{cat.name}</p>
              <p className="text-xs text-slate-500">{cat.description || "No description"}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
              <button onClick={() => toggleVisibility(cat.id, cat.is_visible)} className={`rounded px-2 py-1 text-xs ${cat.is_visible ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {cat.is_visible ? "Visible" : "Hidden"}
              </button>
              <button onClick={() => handleDelete(cat.id, cat.name)} className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
