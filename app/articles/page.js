import { getPublishedArticles, getCategories } from "@/lib/data";
import ArticlesPageClient from "@/components/ArticlesPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles - Curious Mind",
  description: "Browse all articles",
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(),
    getCategories(),
  ]);

  return <ArticlesPageClient articles={articles} categories={categories} />;
}
