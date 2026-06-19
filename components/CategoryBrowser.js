"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CategoryBrowser({ categories, heading }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-[var(--color-text)]"
      >
        {heading || "Browse by Category"}
      </motion.h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/articles?category=${category.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[var(--color-surface)] p-5 transition-all hover:border-white/20 hover:shadow-lg"
              style={{ "--cat-color": category.color }}
            >
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-1">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
