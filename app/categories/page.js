import { getCategories } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories - Curious Mind",
  description: "Browse articles by category",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-bold text-[var(--color-text)]">Categories</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">Browse articles by topic</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/articles?category=${cat.slug}`}
            className="group rounded-2xl border border-white/10 bg-[var(--color-surface)] p-8 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-lg"
          >
            <span className="text-4xl">{cat.icon}</span>
            <h2 className="mt-4 text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
              {cat.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {cat.description || "Explore articles in this category"}
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-[var(--color-primary)]">
              Browse articles →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
