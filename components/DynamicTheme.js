"use client";

import { useEffect } from "react";

export default function DynamicTheme({ theme }) {
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary_color);
    root.style.setProperty("--color-secondary", theme.secondary_color);
    root.style.setProperty("--color-background", theme.background_color);
    root.style.setProperty("--color-surface", theme.surface_color);
    root.style.setProperty("--color-text", theme.text_color);
    root.style.setProperty("--color-text-muted", theme.text_muted_color);
    root.style.setProperty("--color-accent", theme.accent_color);
    root.style.setProperty("--font-family", theme.font_family);
    root.style.setProperty("--font-size-base", theme.font_size_base);
    root.style.setProperty("--font-weight-heading", theme.font_weight_heading);
    root.style.setProperty("--border-radius", theme.border_radius);

    // Inject custom CSS if any
    let customStyle = document.getElementById("custom-admin-css");
    if (theme.custom_css) {
      if (!customStyle) {
        customStyle = document.createElement("style");
        customStyle.id = "custom-admin-css";
        document.head.appendChild(customStyle);
      }
      customStyle.textContent = theme.custom_css;
    } else if (customStyle) {
      customStyle.remove();
    }
  }, [theme]);

  return null;
}
