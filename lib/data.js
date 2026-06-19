import { createServerSupabaseClient } from "./supabase";

// Helper to safely query
async function safeQuery(queryFn) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;
  try {
    return await queryFn(supabase);
  } catch (error) {
    console.error("Database query error:", error);
    return null;
  }
}

// Fetch site settings
export async function getSiteSettings() {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase.from("site_settings").select("*").single();
    return data;
  });
  return result || { site_name: "Curious Mind", tagline: "Exploring the Universe of Knowledge", meta_description: "", maintenance_mode: false };
}

// Fetch theme settings
export async function getThemeSettings() {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase.from("theme_settings").select("*").single();
    return data;
  });
  return result || {
    primary_color: "#8B5CF6",
    secondary_color: "#3B82F6",
    background_color: "#0F0F2E",
    surface_color: "#1a1a3e",
    text_color: "#F8FAFC",
    text_muted_color: "#94A3B8",
    accent_color: "#A78BFA",
    font_family: "Inter",
    font_size_base: "16px",
    font_weight_heading: "700",
    border_radius: "12px",
    dark_mode_default: true,
  };
}

// Fetch navigation items
export async function getNavigation() {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("navigation")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order");
    return data;
  });
  return result || [
    { id: "1", label: "Home", href: "/", sort_order: 1 },
    { id: "2", label: "Articles", href: "/articles", sort_order: 2 },
    { id: "3", label: "Categories", href: "/categories", sort_order: 3 },
    { id: "4", label: "About", href: "/about", sort_order: 4 },
    { id: "5", label: "Contact", href: "/contact", sort_order: 5 },
  ];
}

// Fetch footer settings
export async function getFooterData() {
  const result = await safeQuery(async (supabase) => {
    const [{ data: footer }, { data: socialLinks }] = await Promise.all([
      supabase.from("footer_settings").select("*").single(),
      supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order"),
    ]);
    return { footer, socialLinks: socialLinks || [] };
  });
  return result || { footer: { copyright_text: "© 2026 Curious Mind", description: "Exploring the Universe of Knowledge", show_social_links: true }, socialLinks: [] };
}

// Fetch all published articles
export async function getPublishedArticles() {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, description, image_url, read_time, views, published_at, created_at, featured, categories(id, name, slug, color)")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return data;
  });
  return result || [];
}

// Fetch single article by slug
export async function getArticleBySlug(slug) {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("articles")
      .select("*, categories(id, name, slug, color)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    return data;
  });
  return result;
}

// Fetch categories
export async function getCategories() {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order");
    return data;
  });
  return result || [];
}

// Fetch homepage sections
export async function getHomeSections() {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("sections")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order");
    return data;
  });
  return result || [
    { section_key: "hero", config: { heading: "Welcome to Curious Mind", subheading: "Exploring the Universe of Knowledge", cta_text: "Start Reading", cta_link: "/articles", show_astronaut: true } },
    { section_key: "featured_articles", config: { count: 3, heading: "Latest Articles" } },
    { section_key: "category_browser", config: { heading: "Browse by Category" } },
    { section_key: "newsletter", config: { heading: "Stay Curious", subheading: "Get the latest articles delivered to your inbox", button_text: "Subscribe" } },
  ];
}

// Fetch page content by key
export async function getPageContent(pageKey) {
  const result = await safeQuery(async (supabase) => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("page_key", pageKey)
      .eq("is_visible", true)
      .single();
    return data;
  });
  return result;
}
