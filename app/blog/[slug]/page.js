import { getArticleBySlug, getPublishedArticles } from "@/lib/data";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.description,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getPublishedArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const categoryName = article.categories?.name || "Uncategorized";
  const categoryColor = article.categories?.color || "#8B5CF6";
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8">
      {/* Category badge */}
      <span
        className="rounded-full px-3 py-1 text-xs font-medium"
        style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
      >
        {categoryName}
      </span>

      {/* Title */}
      <h1 className="mt-4 text-4xl font-bold text-[var(--color-text)]">
        {article.title}
      </h1>

      {/* Meta */}
      <p className="mt-3 text-[var(--color-text-muted)]">{article.description}</p>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {date} {article.read_time && `• ${article.read_time}`}
      </p>

      {/* Featured image */}
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="mt-8 h-auto w-full rounded-2xl object-cover"
        />
      )}

      {/* Article content (HTML from WYSIWYG editor) */}
      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text-muted)] prose-strong:text-[var(--color-text)] prose-a:text-[var(--color-primary)]"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Related Articles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
