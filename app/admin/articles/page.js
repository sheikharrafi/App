"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ArticlesListClient from "@/components/admin/ArticlesListClient";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!supabaseBrowser) {
        setLoading(false);
        return;
      }
      const { data } = await supabaseBrowser
        .from("articles")
        .select("id, title, slug, status, views, featured, created_at, published_at, categories(name)")
        .order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return <ArticlesListClient articles={articles} />;
}
