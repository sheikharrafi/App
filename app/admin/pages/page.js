"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

export default function AdminPagesPage() {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      const { data } = await supabaseBrowser.from("pages").select("*");
      setPages(data || []);
      if (data?.length) setActivePage(data[0]);
      setLoading(false);
    };
    fetchPages();
  }, []);


  const handleSave = async () => {
    if (!activePage) return;
    setSaving(true);
    const { error } = await supabaseBrowser.from("pages").update({
      title: activePage.title,
      content: activePage.content,
      meta_title: activePage.meta_title,
      meta_description: activePage.meta_description,
    }).eq("id", activePage.id);
    if (error) toast.error(error.message);
    else toast.success("Page saved!");
    setSaving(false);
  };

  const updateContent = (key, value) => {
    setActivePage({
      ...activePage,
      content: { ...activePage.content, [key]: value },
    });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pages</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
          <Save size={16} /> Save
        </button>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2">
        {pages.map((page) => (
          <button key={page.id} onClick={() => setActivePage(page)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activePage?.id === page.id ? "bg-violet-500/20 text-violet-300" : "text-slate-400 hover:bg-white/5"}`}>
            {page.title}
          </button>
        ))}
      </div>

      {/* Page editor */}
      {activePage && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{activePage.title} Page Content</h2>
            {Object.entries(activePage.content || {}).map(([key, value]) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm text-slate-300 capitalize">{key.replace(/_/g, " ")}</label>
                {typeof value === "string" && value.length > 100 ? (
                  <textarea value={value} onChange={(e) => updateContent(key, e.target.value)} rows={4} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none resize-none" />
                ) : (
                  <input type="text" value={value || ""} onChange={(e) => updateContent(key, e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
                )}
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">SEO Settings</h3>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Meta Title</label>
              <input type="text" value={activePage.meta_title || ""} onChange={(e) => setActivePage({ ...activePage, meta_title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Meta Description</label>
              <textarea value={activePage.meta_description || ""} onChange={(e) => setActivePage({ ...activePage, meta_description: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none resize-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
