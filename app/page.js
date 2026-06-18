import Hero from "@/components/Hero";
import FeaturedArticles from "@/components/FeaturedArticles";
import CategoryBrowser from "@/components/CategoryBrowser";
import Newsletter from "@/components/Newsletter";
import { getAllArticles } from "@/lib/articles";

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);

  return (
    <>
      <Hero />
      <FeaturedArticles articles={articles} />
      <CategoryBrowser />
      <Newsletter />
    </>
  );
}
