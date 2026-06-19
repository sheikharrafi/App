"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Mail, Trash2, Download } from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabaseBrowser.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });
      setSubscribers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    await supabaseBrowser.from("newsletter_subscribers").delete().eq("id", id);
    setSubscribers(subscribers.filter((s) => s.id !== id));
    toast.success("Removed!");
  };

  const exportCSV = () => {
    const csv = "Email,Date\n" + subscribers.map((s) => `${s.email},${s.subscribed_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
    toast.success("Exported!");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="mt-1 text-sm text-slate-400">{subscribers.length} subscribers</p>
        </div>
        {subscribers.length > 0 && (
          <button onClick={exportCSV} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
          <Mail size={48} className="mx-auto text-slate-600" />
          <p className="mt-3 text-slate-400">No subscribers yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-white/10 text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Email</th>
              <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Date</th>
              <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Status</th>
              <th className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Action</th>
            </tr></thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm text-white">{sub.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${sub.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{sub.is_active ? "Active" : "Inactive"}</span></td>
                  <td className="px-4 py-3"><button onClick={() => handleDelete(sub.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
