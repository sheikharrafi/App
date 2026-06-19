"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [{ data: nav }, { data: social }, { data: foot }] = await Promise.all([
      supabaseBrowser.from("navigation").select("*").order("sort_order"),
      supabaseBrowser.from("social_links").select("*").order("sort_order"),
      supabaseBrowser.from("footer_settings").select("*").single(),
    ]);
    setNavItems(nav || []);
    setSocialLinks(social || []);
    setFooter(foot);
    setLoading(false);
  };


  const addNavItem = async () => {
    const { error } = await supabaseBrowser.from("navigation").insert({ label: "New Link", href: "/", sort_order: navItems.length });
    if (!error) { fetchAll(); toast.success("Added!"); }
  };

  const updateNav = async (id, field, value) => {
    await supabaseBrowser.from("navigation").update({ [field]: value }).eq("id", id);
    setNavItems(navItems.map((n) => n.id === id ? { ...n, [field]: value } : n));
  };

  const deleteNav = async (id) => {
    await supabaseBrowser.from("navigation").delete().eq("id", id);
    setNavItems(navItems.filter((n) => n.id !== id));
    toast.success("Deleted!");
  };

  const addSocialLink = async () => {
    const { error } = await supabaseBrowser.from("social_links").insert({ platform: "New", url: "https://", sort_order: socialLinks.length });
    if (!error) { fetchAll(); toast.success("Added!"); }
  };

  const updateSocial = async (id, field, value) => {
    await supabaseBrowser.from("social_links").update({ [field]: value }).eq("id", id);
    setSocialLinks(socialLinks.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteSocial = async (id) => {
    await supabaseBrowser.from("social_links").delete().eq("id", id);
    setSocialLinks(socialLinks.filter((s) => s.id !== id));
    toast.success("Deleted!");
  };

  const saveFooter = async () => {
    const { error } = await supabaseBrowser.from("footer_settings").update(footer).eq("id", footer.id);
    if (error) toast.error(error.message);
    else toast.success("Footer saved!");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Navigation & Footer</h1>

      {/* Navigation Menu */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Menu Items</h2>
          <button onClick={addNavItem} className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {navItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2">
              <GripVertical size={14} className="text-slate-600" />
              <input type="text" value={item.label} onChange={(e) => updateNav(item.id, "label", e.target.value)} onBlur={() => toast.success("Saved")} className="flex-1 rounded border-0 bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500" />
              <input type="text" value={item.href} onChange={(e) => updateNav(item.id, "href", e.target.value)} onBlur={() => toast.success("Saved")} className="flex-1 rounded border-0 bg-transparent px-2 py-1 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500" />
              <button onClick={() => updateNav(item.id, "is_visible", !item.is_visible)} className={`rounded px-2 py-0.5 text-xs ${item.is_visible ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {item.is_visible ? "On" : "Off"}
              </button>
              <button onClick={() => deleteNav(item.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Social Links</h2>
          <button onClick={addSocialLink} className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2">
              <input type="text" value={link.platform} onChange={(e) => updateSocial(link.id, "platform", e.target.value)} onBlur={() => toast.success("Saved")} className="w-24 rounded border-0 bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500" />
              <input type="text" value={link.url} onChange={(e) => updateSocial(link.id, "url", e.target.value)} onBlur={() => toast.success("Saved")} className="flex-1 rounded border-0 bg-transparent px-2 py-1 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500" />
              <button onClick={() => deleteSocial(link.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Settings */}
      {footer && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Footer</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Copyright Text</label>
              <input type="text" value={footer.copyright_text} onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Description</label>
              <input type="text" value={footer.description} onChange={(e) => setFooter({ ...footer, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none" />
            </div>
            <button onClick={saveFooter} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">Save Footer</button>
          </div>
        </div>
      )}
    </div>
  );
}
