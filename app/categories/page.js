import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Categories",
  description: "Explore all categories and related articles.",
};

export default function CategoriesPage({ searchParams }) {
  const params = searchParams || {};
  const selectedCategory = params.category;
  const articles = getAllArticles();

  const grouped = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});

  const categoriesToRender = selectedCategory
    ? Object.keys(grouped).filter((category) => category === selectedCategory)
    : Object.keys(grouped);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20 md:px-8">
      <h1 className="text-4xl font-bold text-white">Categories</h1>
      <div className="mt-8 space-y-8">
        {categoriesToRender.map((category) => (
          <div key={category} className="rounded-2xl border border-white/10 bg-[#171744] p-6">
            <h2 className="text-2xl font-semibold text-violet-300">{category}</h2>
            <ul className="mt-4 space-y-3">
              {grouped[category].map((article) => (
                <li key={article.slug}>
                  <Link href={`/blog/${article.slug}`} className="text-slate-200 hover:text-blue-300">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
