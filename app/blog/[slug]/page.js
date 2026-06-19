import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default function BlogPostPage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const relatedArticles = getAllArticles()
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2);

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8">
      <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">{article.category}</span>
      <h1 className="mt-4 text-4xl font-bold text-white">{article.title}</h1>
      <p className="mt-3 text-slate-300">{article.description}</p>
      <p className="mt-2 text-sm text-slate-400">{article.date} • {article.readTime}</p>

      <Image
        src={article.image}
        alt={article.title}
        width={1200}
        height={630}
        className="mt-8 h-auto w-full rounded-2xl object-cover"
        priority
      />

      <div className="prose prose-invert mt-10 max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-slate-100">
        <MDXRemote source={article.content} />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Related Articles</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {relatedArticles.map((related) => (
            <ArticleCard key={related.slug} article={related} />
          ))}
        </div>
      </section>
    </article>
  );
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}
