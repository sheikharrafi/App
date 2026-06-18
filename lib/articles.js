import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export function getAllArticles() {
  const fileNames = fs.readdirSync(articlesDirectory).filter((name) => name.endsWith(".mdx"));

  return fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContent = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContent);

      return {
        slug,
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        readTime: data.readTime,
        image: data.image,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getArticleBySlug(slug) {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    content,
    title: data.title,
    description: data.description,
    category: data.category,
    date: data.date,
    readTime: data.readTime,
    image: data.image,
  };
}
