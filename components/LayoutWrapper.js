"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeProvider from "@/components/ThemeProvider";
import DynamicTheme from "@/components/DynamicTheme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState(null);
  const [theme, setTheme] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Use defaults
        setSettings({ site_name: "Curious Mind", tagline: "Exploring the Universe of Knowledge", maintenance_mode: false });
        setTheme({ primary_color: "#8B5CF6", secondary_color: "#3B82F6", background_color: "#0F0F2E", surface_color: "#1a1a3e", text_color: "#F8FAFC", text_muted_color: "#94A3B8", accent_color: "#A78BFA", font_family: "Inter", font_size_base: "16px", font_weight_heading: "700", border_radius: "12px", dark_mode_default: true });
        setNavItems([{ id: "1", label: "Home", href: "/" }, { id: "2", label: "Articles", href: "/articles" }, { id: "3", label: "Categories", href: "/categories" }, { id: "4", label: "About", href: "/about" }, { id: "5", label: "Contact", href: "/contact" }]);
        setFooterData({ footer: { copyright_text: "\u00a9 2026 Curious Mind", description: "Exploring the Universe of Knowledge", show_social_links: true }, socialLinks: [] });
        setLoading(false);
        return;
      }

      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const [
          { data: siteData },
          { data: themeData },
          { data: navData },
          { data: footerSettings },
          { data: socialData },
        ] = await Promise.all([
          supabase.from("site_settings").select("*").single(),
          supabase.from("theme_settings").select("*").single(),
          supabase.from("navigation").select("*").eq("is_visible", true).order("sort_order"),
          supabase.from("footer_settings").select("*").single(),
          supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order"),
        ]);

        setSettings(siteData || { site_name: "Curious Mind", maintenance_mode: false });
        setTheme(themeData);
        setNavItems(navData || []);
        setFooterData({ footer: footerSettings, socialLinks: socialData || [] });
      } catch (err) {
        console.error("Failed to fetch layout data:", err);
        setSettings({ site_name: "Curious Mind", maintenance_mode: false });
        setNavItems([{ id: "1", label: "Home", href: "/" }, { id: "2", label: "Articles", href: "/articles" }, { id: "3", label: "Categories", href: "/categories" }, { id: "4", label: "About", href: "/about" }, { id: "5", label: "Contact", href: "/contact" }]);
        setFooterData({ footer: { copyright_text: "\u00a9 2026 Curious Mind", description: "Exploring the Universe of Knowledge", show_social_links: true }, socialLinks: [] });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Don't show layout on admin routes
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F2E]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  // Maintenance mode
  if (settings?.maintenance_mode) {
    return (
      <ThemeProvider>
        <DynamicTheme theme={theme} />
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0F2E] px-4 text-center">
          <span className="text-6xl">🔧</span>
          <h1 className="mt-6 text-3xl font-bold text-white">Under Maintenance</h1>
          <p className="mt-3 text-slate-400">{settings?.maintenance_message}</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DynamicTheme theme={theme} />
      <Navbar settings={settings} navItems={navItems} />
      <main className="min-h-screen">{children}</main>
      <Footer footerData={footerData} settings={settings} />
    </ThemeProvider>
  );
}
