import { createSupabaseServerClient } from "@/lib/supabase-admin";
import ArticlesListClient from "@/components/admin/ArticlesListClient";

export default async function AdminArticlesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, status, views, featured, created_at, published_at, categories(name)")
    .order("created_at", { ascending: false });

  return <ArticlesListClient articles={articles || []} />;
}
