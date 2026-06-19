import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteSettings, getThemeSettings, getNavigation, getFooterData } from "@/lib/data";
import DynamicTheme from "@/components/DynamicTheme";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings?.site_name || "Curious Mind",
    description: settings?.meta_description || "Exploring the Universe of Knowledge",
    icons: settings?.favicon_url ? { icon: settings.favicon_url } : undefined,
  };
}

export default async function RootLayout({ children }) {
  const [settings, theme, navItems, footerData] = await Promise.all([
    getSiteSettings(),
    getThemeSettings(),
    getNavigation(),
    getFooterData(),
  ]);

  // If maintenance mode is on, show maintenance page (except admin routes)
  const isMaintenanceMode = settings?.maintenance_mode;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme={theme?.dark_mode_default ? "dark" : "light"}>
          <DynamicTheme theme={theme} />
          <Navbar settings={settings} navItems={navItems} />
          <main className="min-h-screen">
            {isMaintenanceMode ? (
              <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
                <span className="text-6xl">🔧</span>
                <h1 className="mt-6 text-3xl font-bold text-white">Under Maintenance</h1>
                <p className="mt-3 text-slate-400">{settings?.maintenance_message}</p>
              </div>
            ) : (
              children
            )}
          </main>
          <Footer footerData={footerData} settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  );
}
