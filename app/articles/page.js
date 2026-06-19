import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Articles",
  description: "Browse all articles and filter by category.",
};

export default function ArticlesPage({ searchParams }) {
  const params = searchParams || {};
  const selectedCategory = params.category || "All";
  const articles = getAllArticles();
  const categories = ["All", ...new Set(articles.map((article) => article.category))];

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <h1 className="text-4xl font-bold text-white">Articles</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((category) => (
          <a
            key={category}
            href={category === "All" ? "/articles" : `/articles?category=${encodeURIComponent(category)}`}
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedCategory === category
                ? "bg-violet-500 text-white"
                : "border border-white/20 text-slate-300 hover:border-violet-400"
            }`}
          >
            {category}
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
