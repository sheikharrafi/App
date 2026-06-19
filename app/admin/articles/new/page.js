"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import RichTextEditor from "@/components/admin/RichTextEditor";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    const fetchCategories = async () => {
      const { data } = await supabaseBrowser.from("categories").select("id, name").order("sort_order");
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (title) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm({ ...form, title, slug });
  };

  const handleSubmit = async (status) => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);

    const articleData = {
      ...form,
      status,
      category_id: form.category_id || null,
      published_at: status === "published" ? new Date().toISOString() : null,
      meta_title: form.meta_title || form.title,
      meta_description: form.meta_description || form.description,
    };

    const { data, error } = await supabaseBrowser
      .from("articles")
      .insert(articleData)
      .select()
      .single();

    if (error) {
      toast.error(error.message || "Failed to create article");
      setLoading(false);
    } else {
      toast.success(status === "published" ? "Article published!" : "Draft saved!");
      router.push("/admin/articles");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">New Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            <Eye size={16} />
            Publish
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="article-slug"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of the article..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
          />
        </div>

        {/* Content (WYSIWYG) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Content
          </label>
          <RichTextEditor
            content={form.content}
            onChange={(content) => setForm({ ...form, content })}
          />
        </div>

        {/* Two columns */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Category
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Read Time */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Read Time
            </label>
            <input
              type="text"
              value={form.read_time}
              onChange={(e) => setForm({ ...form, read_time: e.target.value })}
              placeholder="5 min read"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Featured Image URL
          </label>
          <input
            type="text"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://... or upload from Media Library"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
          {form.image_url && (
            <img
              src={form.image_url}
              alt="Preview"
              className="mt-2 h-40 w-full rounded-lg object-cover"
            />
          )}
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-500 focus:ring-violet-500"
          />
          <label htmlFor="featured" className="text-sm text-slate-300">
            Featured article (shown on homepage)
          </label>
        </div>

        {/* SEO Section */}
        <details className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-300">
            SEO Settings (optional)
          </summary>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                placeholder="Custom meta title..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                placeholder="Custom meta description..."
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
