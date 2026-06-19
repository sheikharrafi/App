"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Save, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabaseBrowser.from("site_settings").select("*").single();
      setSettings(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabaseBrowser.from("site_settings").update(settings).eq("id", settings.id);
    if (error) toast.error(error.message);
    else toast.success("Settings saved!");
    setSaving(false);
  };

  if (loading || !settings) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="mt-1 text-sm text-slate-400">General website configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
          <Save size={16} /> Save
        </button>
      </div>

      {/* General */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">General</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Site Name</label>
            <input type="text" value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Tagline</label>
            <input type="text" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Meta Description (SEO)</label>
            <textarea value={settings.meta_description} onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Logo URL</label>
            <input type="text" value={settings.logo_url || ""} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Favicon URL</label>
            <input type="text" value={settings.favicon_url || ""} onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Maintenance Mode</h2>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="maintenance" checked={settings.maintenance_mode} onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })} className="h-4 w-4 rounded border-white/10 bg-white/5 text-violet-500" />
          <label htmlFor="maintenance" className="text-sm text-slate-300">Enable maintenance mode (site will be hidden from visitors)</label>
        </div>
        {settings.maintenance_mode && (
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Maintenance Message</label>
            <input type="text" value={settings.maintenance_message} onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
          </div>
        )}
      </div>
    </div>
  );
}
