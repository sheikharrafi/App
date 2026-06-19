"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function Newsletter({ config }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const heading = config?.heading || "Stay Curious";
  const subheading = config?.subheading || "Get the latest articles delivered to your inbox";
  const buttonText = config?.button_text || "Subscribe";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    const { error } = await supabaseBrowser
      .from("newsletter_subscribers")
      .insert({ email: email.trim() });

    if (error) {
      if (error.code === "23505") {
        setStatus("error");
      } else {
        setStatus("error");
      }
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 p-8 text-center md:p-12"
      >
        <h2 className="text-3xl font-bold text-[var(--color-text)]">{heading}</h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-text-muted)]">{subheading}</p>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "..." : buttonText}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-3 text-sm text-green-400">Subscribed successfully!</p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">Already subscribed or invalid email.</p>
        )}
      </motion.div>
    </section>
  );
}
