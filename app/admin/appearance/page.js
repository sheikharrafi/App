"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Save, RotateCcw } from "lucide-react";

export default function AdminAppearancePage() {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      const { data } = await supabaseBrowser.from("theme_settings").select("*").single();
      setTheme(data);
      setLoading(false);
    };
    fetchTheme();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabaseBrowser.from("theme_settings").update(theme).eq("id", theme.id);
    if (error) toast.error(error.message);
    else toast.success("Theme saved!");
    setSaving(false);
  };

  const resetDefaults = () => {
    setTheme({
      ...theme,
      primary_color: "#8B5CF6",
      secondary_color: "#3B82F6",
      background_color: "#0F0F2E",
      surface_color: "#1a1a3e",
      text_color: "#F8FAFC",
      text_muted_color: "#94A3B8",
      accent_color: "#A78BFA",
      font_family: "Inter",
      font_size_base: "16px",
      border_radius: "12px",
    });
    toast.success("Reset to defaults (save to apply)");
  };

  if (loading || !theme) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  const ColorInput = ({ label, field }) => (
    <div className="flex items-center gap-3">
      <input type="color" value={theme[field]} onChange={(e) => setTheme({ ...theme, [field]: e.target.value })} className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <p className="text-xs text-slate-500">{theme[field]}</p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Appearance</h1>
          <p className="mt-1 text-sm text-slate-400">Customize your website theme</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefaults} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Colors */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Colors</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorInput label="Primary Color" field="primary_color" />
          <ColorInput label="Secondary Color" field="secondary_color" />
          <ColorInput label="Background Color" field="background_color" />
          <ColorInput label="Surface Color" field="surface_color" />
          <ColorInput label="Text Color" field="text_color" />
          <ColorInput label="Muted Text Color" field="text_muted_color" />
          <ColorInput label="Accent Color" field="accent_color" />
        </div>
      </div>

      {/* Typography */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Typography</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Font Family</label>
            <select value={theme.font_family} onChange={(e) => setTheme({ ...theme, font_family: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Space Grotesk">Space Grotesk</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Base Font Size</label>
            <select value={theme.font_size_base} onChange={(e) => setTheme({ ...theme, font_size_base: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
              <option value="14px">14px (Small)</option>
              <option value="16px">16px (Default)</option>
              <option value="18px">18px (Large)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Border Radius</label>
            <select value={theme.border_radius} onChange={(e) => setTheme({ ...theme, border_radius: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
              <option value="0px">None</option>
              <option value="4px">Small (4px)</option>
              <option value="8px">Medium (8px)</option>
              <option value="12px">Large (12px)</option>
              <option value="16px">Extra Large (16px)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Heading Weight</label>
            <select value={theme.font_weight_heading} onChange={(e) => setTheme({ ...theme, font_weight_heading: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Custom CSS</h2>
        <p className="text-xs text-slate-500">Add custom CSS for advanced styling</p>
        <textarea value={theme.custom_css || ""} onChange={(e) => setTheme({ ...theme, custom_css: e.target.value })} placeholder="/* Your custom CSS here */" rows={6} className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-green-400 placeholder-slate-600 focus:border-violet-500 focus:outline-none resize-none" />
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-white/10 p-6" style={{ backgroundColor: theme.background_color }}>
        <h2 className="text-lg font-semibold" style={{ color: theme.text_color }}>Preview</h2>
        <p className="mt-2" style={{ color: theme.text_muted_color }}>This is how your text will look.</p>
        <button className="mt-3 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: theme.primary_color, borderRadius: theme.border_radius }}>
          Primary Button
        </button>
        <button className="mt-3 ml-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: theme.secondary_color, borderRadius: theme.border_radius }}>
          Secondary Button
        </button>
      </div>
    </div>
  );
}
