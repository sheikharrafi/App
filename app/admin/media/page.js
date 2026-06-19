"use client";

import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import toast from "react-hot-toast";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";

export default function AdminMediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    const { data } = await supabaseBrowser.from("media").select("*").order("created_at", { ascending: false });
    setMedia(data || []);
    setLoading(false);
  };


  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabaseBrowser.storage
      .from("media")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabaseBrowser.storage.from("media").getPublicUrl(fileName);

    await supabaseBrowser.from("media").insert({
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_size: file.size,
      file_type: file.type,
    });

    toast.success("Uploaded!");
    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.file_name}"?`)) return;
    const path = item.file_url.split("/media/")[1];
    if (path) await supabaseBrowser.storage.from("media").remove([path]);
    await supabaseBrowser.from("media").delete().eq("id", item.id);
    setMedia(media.filter((m) => m.id !== item.id));
    toast.success("Deleted!");
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="mt-1 text-sm text-slate-400">{media.length} files</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
          {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Upload size={16} />}
          Upload
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Grid */}
      {media.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
          <ImageIcon size={48} className="mx-auto text-slate-600" />
          <p className="mt-3 text-slate-400">No media uploaded yet</p>
          <button onClick={() => fileInputRef.current?.click()} className="mt-3 text-sm text-violet-400 hover:text-violet-300">Upload your first image</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="relative aspect-square">
                <img src={item.file_url} alt={item.file_name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => copyUrl(item.file_url)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"><Copy size={16} /></button>
                  <button onClick={() => handleDelete(item)} className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-slate-400">{item.file_name}</p>
                <p className="text-xs text-slate-600">{(item.file_size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
