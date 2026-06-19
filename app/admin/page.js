import { createSupabaseServerClient } from "@/lib/supabase-admin";
import DashboardClient from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch stats
  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: draftArticles },
    { count: totalCategories },
    { count: totalSubscribers },
    { data: recentArticles },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("id, title, status, views, created_at, categories(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = {
    totalArticles: totalArticles || 0,
    publishedArticles: publishedArticles || 0,
    draftArticles: draftArticles || 0,
    totalCategories: totalCategories || 0,
    totalSubscribers: totalSubscribers || 0,
  };

  return <DashboardClient stats={stats} recentArticles={recentArticles || []} />;
}
