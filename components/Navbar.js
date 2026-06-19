"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

export default function Navbar({ settings, navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Don't show on admin routes
  if (pathname.startsWith("/admin")) return null;

  const siteName = settings?.site_name || "Curious Mind";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={siteName} className="h-8" />
          ) : (
            <span className="text-xl">🧠</span>
          )}
          <span className="text-lg font-bold text-[var(--color-text)]">{siteName}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 lg:flex">
          {(navItems || []).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target={item.is_external ? "_blank" : undefined}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[var(--color-text-muted)] lg:hidden"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--color-background)] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {(navItems || []).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
