import Link from "next/link";
import Image from "next/image";

export default function ArticleCard({ article }) {
  const categoryName = article.categories?.name || "Uncategorized";
  const categoryColor = article.categories?.color || "var(--color-primary)";
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-lg hover:shadow-[var(--color-primary)]/5">
        {/* Image */}
        {article.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Category badge */}
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
          >
            {categoryName}
          </span>

          {/* Title */}
          <h3 className="mt-3 text-lg font-semibold text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-2">
              {article.description}
            </p>
          )}

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            {date && <span>{date}</span>}
            {article.read_time && (
              <>
                <span>•</span>
                <span>{article.read_time}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
