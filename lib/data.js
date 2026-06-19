import { createServerSupabaseClient } from "./supabase";

// Fetch site settings
export async function getSiteSettings() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}

// Fetch theme settings
export async function getThemeSettings() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("theme_settings").select("*").single();
  return data;
}

// Fetch navigation items
export async function getNavigation() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("navigation")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");
  return data || [];
}

// Fetch footer settings
export async function getFooterData() {
  const supabase = createServerSupabaseClient();
  const [{ data: footer }, { data: socialLinks }] = await Promise.all([
    supabase.from("footer_settings").select("*").single(),
    supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order"),
  ]);
  return { footer, socialLinks: socialLinks || [] };
}

// Fetch all published articles
export async function getPublishedArticles() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, slug, description, image_url, read_time, views, published_at, created_at, featured, categories(id, name, slug, color)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data || [];
}

// Fetch single article by slug
export async function getArticleBySlug(slug) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("*, categories(id, name, slug, color)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

// Increment article views
export async function incrementViews(id) {
  const supabase = createServerSupabaseClient();
  await supabase.rpc("increment_views", { article_id: id }).catch(() => {});
}

// Fetch categories
export async function getCategories() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");
  return data || [];
}

// Fetch homepage sections
export async function getHomeSections() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");
  return data || [];
}

// Fetch page content by key
export async function getPageContent(pageKey) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("page_key", pageKey)
    .eq("is_visible", true)
    .single();
  return data;
}
