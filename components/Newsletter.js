"use client";

import { motion } from "framer-motion";
import { FaFlask } from "react-icons/fa";

export default function Newsletter() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/20 to-blue-600/20 p-8 md:p-12"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
              <FaFlask /> Stay Curious
            </p>
            <h3 className="mt-3 text-3xl font-bold text-white">Get new insights in your inbox</h3>
            <p className="mt-2 max-w-2xl text-slate-300">
              Weekly science and technology deep-dives, practical recommendations, and thought-provoking reads.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/20 bg-[#0F0F2E] px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              Subscribe
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
