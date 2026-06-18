import ArticleCard from "./ArticleCard";

export default function FeaturedArticles({ articles }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <h2 className="text-3xl font-bold text-white">Latest from the Lab</h2>
      <p className="mt-2 text-slate-300">New ideas, breakthroughs, and thought experiments.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
