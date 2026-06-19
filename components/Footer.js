"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";

const iconMap = {
  FaTwitter: FaTwitter,
  FaGithub: FaGithub,
  FaLinkedin: FaLinkedin,
  FaYoutube: FaYoutube,
  FaInstagram: FaInstagram,
  FaFacebook: FaFacebook,
};

export default function Footer({ footerData, settings }) {
  const pathname = usePathname();

  // Don't show on admin routes
  if (pathname.startsWith("/admin")) return null;

  const { footer, socialLinks } = footerData || {};
  const siteName = settings?.site_name || "Curious Mind";

  return (
    <footer className="border-t border-white/10 bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo & Description */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-lg font-bold text-[var(--color-text)]">{siteName}</span>
          </Link>
          <p className="mt-3 max-w-md text-sm text-[var(--color-text-muted)]">
            {footer?.description || "Exploring the Universe of Knowledge"}
          </p>

          {/* Social Links */}
          {footer?.show_social_links && socialLinks?.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((link) => {
                const IconComponent = iconMap[link.icon] || FaGithub;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--color-text)]"
                    title={link.platform}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          )}

          {/* Copyright */}
          <p className="mt-8 text-xs text-[var(--color-text-muted)]">
            {footer?.copyright_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
