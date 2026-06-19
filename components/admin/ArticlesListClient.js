"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import {
  PenLine,
  Trash2,
  Eye,
  Search,
  Filter,
  Plus,
  Star,
} from "lucide-react";

export default function ArticlesListClient({ articles: initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const { error } = await supabaseBrowser.from("articles").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete article");
    } else {
      setArticles(articles.filter((a) => a.id !== id));
      toast.success("Article deleted");
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    const { error } = await supabaseBrowser
      .from("articles")
      .update({ featured: !currentFeatured })
      .eq("id", id);

    if (!error) {
      setArticles(
        articles.map((a) =>
          a.id === id ? { ...a, featured: !currentFeatured } : a
        )
      );
      toast.success(currentFeatured ? "Removed from featured" : "Added to featured");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="mt-1 text-sm text-slate-400">
            {articles.length} total articles
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
        {filteredArticles.length === 0 ? (
          <div className="py-12 text-center">
            <PenLine size={40} className="mx-auto text-slate-600" />
            <p className="mt-3 text-slate-400">No articles found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">
                  Title
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">
                  Category
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">
                  Views
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {article.featured && (
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      )}
                      <span className="font-medium text-white truncate max-w-[250px]">
                        {article.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">
                      {article.categories?.name || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-slate-400">
                      <Eye size={12} />
                      {article.views}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFeatured(article.id, article.featured)}
                        className={`rounded p-1.5 transition-colors ${
                          article.featured
                            ? "text-yellow-400 hover:bg-yellow-500/10"
                            : "text-slate-500 hover:bg-white/10 hover:text-yellow-400"
                        }`}
                        title="Toggle featured"
                      >
                        <Star size={14} />
                      </button>
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="rounded p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                        title="Edit"
                      >
                        <PenLine size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
