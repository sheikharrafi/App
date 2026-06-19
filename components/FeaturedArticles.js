"use client";

import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";

export default function FeaturedArticles({ articles, heading }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-[var(--color-text)]"
      >
        {heading || "Latest Articles"}
      </motion.h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
