"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import DashboardClient from "@/components/admin/DashboardClient";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalSubscribers: 0,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabaseBrowser) {
        setLoading(false);
        return;
      }

      try {
        const [
          { count: totalArticles },
          { count: publishedArticles },
          { count: draftArticles },
          { count: totalCategories },
          { count: totalSubscribers },
          { data: recent },
        ] = await Promise.all([
          supabaseBrowser.from("articles").select("*", { count: "exact", head: true }),
          supabaseBrowser.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
          supabaseBrowser.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
          supabaseBrowser.from("categories").select("*", { count: "exact", head: true }),
          supabaseBrowser.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
          supabaseBrowser.from("articles")
            .select("id, title, status, views, created_at, categories(name)")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalArticles: totalArticles || 0,
          publishedArticles: publishedArticles || 0,
          draftArticles: draftArticles || 0,
          totalCategories: totalCategories || 0,
          totalSubscribers: totalSubscribers || 0,
        });
        setRecentArticles(recent || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return <DashboardClient stats={stats} recentArticles={recentArticles} />;
}
