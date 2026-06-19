"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if already logged in or if hash contains access_token
  useEffect(() => {
    const checkAuth = async () => {
      if (!supabaseBrowser) {
        setChecking(false);
        return;
      }

      // If URL has access_token in hash, Supabase will handle it
      if (window.location.hash && window.location.hash.includes("access_token")) {
        // Supabase client auto-detects hash tokens
        const { data: { session }, error } = await supabaseBrowser.auth.getSession();
        
        if (session) {
          // Auto-add as admin if first user
          const { data: existingAdmins } = await supabaseBrowser
            .from("admin_users")
            .select("id")
            .limit(1);

          if (!existingAdmins || existingAdmins.length === 0) {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            if (user) {
              await supabaseBrowser.from("admin_users").insert({
                user_id: user.id,
                email: user.email,
                display_name: user.user_metadata?.full_name || user.email,
                avatar_url: user.user_metadata?.avatar_url || null,
                role: "admin",
              });
            }
          }

          router.push("/admin");
          return;
        }
      }

      // Check existing session
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (session) {
        router.push("/admin");
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, [router]);

  const handleGoogleLogin = async () => {
    if (!supabaseBrowser) {
      setError("Supabase not configured");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/login`,
      },
    });

    if (error) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F2E]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F2E]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-4xl">🧠</div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your website
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <FcGoogle className="text-xl" />
              <span className="font-medium">Sign in with Google</span>
            </>
          )}
        </button>

        {/* Info text */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Only authorized admins can access this panel.
          <br />
          First login will be auto-registered as admin.
        </p>
      </div>
    </div>
  );
}
