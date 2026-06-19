"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import RichTextEditor from "@/components/admin/RichTextEditor";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    image_url: "",
    category_id: "",
    status: "draft",
    read_time: "5 min read",
    featured: false,
    meta_title: "",
    meta_description: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      const [{ data: article }, { data: cats }] = await Promise.all([
        supabaseBrowser.from("articles").select("*").eq("id", params.id).single(),
        supabaseBrowser.from("categories").select("id, name").order("sort_order"),
      ]);

      if (article) {
        setForm({
          title: article.title || "",
          slug: article.slug || "",
          description: article.description || "",
          content: article.content || "",
          image_url: article.image_url || "",
          category_id: article.category_id || "",
          status: article.status || "draft",
          read_time: article.read_time || "5 min read",
          featured: article.featured || false,
          meta_title: article.meta_title || "",
          meta_description: article.meta_description || "",
        });
      }
      setCategories(cats || []);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  const handleSave = async (status) => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);

    const updateData = {
      ...form,
      status,
      category_id: form.category_id || null,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const { error } = await supabaseBrowser
      .from("articles")
      .update(updateData)
      .eq("id", params.id);

    if (error) {
      toast.error(error.message || "Failed to update");
    } else {
      toast.success("Article updated!");
      router.push("/admin/articles");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const { error } = await supabaseBrowser.from("articles").delete().eq("id", params.id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Article deleted");
      router.push("/admin/articles");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
            <Trash2 size={16} />
          </button>
          <button onClick={() => handleSave("draft")} disabled={saving} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50">
            <Save size={16} /> Draft
          </button>
          <button onClick={() => handleSave("published")} disabled={saving} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
            <Eye size={16} /> Publish
          </button>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Content</label>
          <RichTextEditor content={form.content} onChange={(content) => setForm({ ...form, content })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none">
              <option value="">Select category</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Read Time</label>
            <input type="text" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Featured Image URL</label>
          <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-500" />
          <label htmlFor="featured" className="text-sm text-slate-300">Featured article</label>
        </div>
      </div>
    </div>
  );
}
