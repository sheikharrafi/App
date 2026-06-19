"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

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
