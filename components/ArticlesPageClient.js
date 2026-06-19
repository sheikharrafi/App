"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleCard from "./ArticleCard";
import { motion } from "framer-motion";

export default function ArticlesPageClient({ articles, categories }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" || article.categories?.slug === activeCategory;
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[var(--color-text)]"
      >
        All Articles
      </motion.h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        {articles.length} articles published
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-3 py-1 text-sm ${
              activeCategory === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "border border-white/10 text-[var(--color-text-muted)] hover:bg-white/5"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-3 py-1 text-sm ${
                activeCategory === cat.slug
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-white/10 text-[var(--color-text-muted)] hover:bg-white/5"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-[var(--color-text-muted)]">No articles found.</p>
        </div>
      )}
    </div>
  );
}
