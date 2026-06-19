"use client";

import Link from "next/link";
import { FileText, FolderOpen, Mail, Eye, PenLine, Clock } from "lucide-react";

export default function DashboardClient({ stats, recentArticles }) {
  const statCards = [
    {
      label: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Published",
      value: stats.publishedArticles,
      icon: Eye,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Drafts",
      value: stats.draftArticles,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Subscribers",
      value: stats.totalSubscribers,
      icon: Mail,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
        >
          <PenLine size={16} />
          New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Articles</h2>
          <Link
            href="/admin/articles"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            View all →
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={40} className="mx-auto text-slate-600" />
            <p className="mt-2 text-slate-400">No articles yet</p>
            <Link
              href="/admin/articles/new"
              className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Create your first article →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="font-medium text-white hover:text-violet-300 truncate block"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">
                      {article.categories?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      article.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {article.status}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Eye size={12} />
                    {article.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Write Article", href: "/admin/articles/new", icon: "✍️" },
          { label: "Manage Categories", href: "/admin/categories", icon: "📂" },
          { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
          { label: "Change Theme", href: "/admin/appearance", icon: "🎨" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-medium text-white">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
