import { getPublishedArticles, getCategories, getHomeSections, getPageContent } from "@/lib/data";
import Hero from "@/components/Hero";
import FeaturedArticles from "@/components/FeaturedArticles";
import CategoryBrowser from "@/components/CategoryBrowser";
import Newsletter from "@/components/Newsletter";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [articles, categories, sections, pageData] = await Promise.all([
    getPublishedArticles(),
    getCategories(),
    getHomeSections(),
    getPageContent("home"),
  ]);

  // Get section configs
  const heroSection = sections.find((s) => s.section_key === "hero");
  const articlesSection = sections.find((s) => s.section_key === "featured_articles");
  const categorySection = sections.find((s) => s.section_key === "category_browser");
  const newsletterSection = sections.find((s) => s.section_key === "newsletter");

  const featuredCount = articlesSection?.config?.count || 3;
  const featuredArticles = articles.slice(0, featuredCount);

  return (
    <div>
      {/* Hero Section */}
      {heroSection && (
        <Hero config={heroSection.config} />
      )}

      {/* Featured Articles */}
      {articlesSection && (
        <FeaturedArticles
          articles={featuredArticles}
          heading={articlesSection.config?.heading}
        />
      )}

      {/* Category Browser */}
      {categorySection && (
        <CategoryBrowser
          categories={categories}
          heading={categorySection.config?.heading}
        />
      )}

      {/* Newsletter */}
      {newsletterSection && (
        <Newsletter config={newsletterSection.config} />
      )}
    </div>
  );
}
