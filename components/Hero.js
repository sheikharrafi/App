"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import { FaUserAstronaut } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-24 md:px-8 md:pt-32">
      <div className="cosmic-stars" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold leading-tight text-white md:text-6xl"
          >
            Exploring Ideas. Understanding the Future.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-slate-300"
          >
            Knowledge is Power - Thoughts, discoveries, and deep dives into Science,
            Technology, Math, and Knowledge.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/articles"
              className="rounded-full bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-400"
            >
              Latest Articles
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-slate-500 px-6 py-3 font-semibold text-slate-100 transition hover:border-blue-400"
            >
              About Me
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" }}
          className="mx-auto flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30 ring-1 ring-white/20 md:h-96 md:w-96"
        >
          <FaUserAstronaut className="text-8xl text-slate-100 md:text-9xl" />
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        className="mt-12 flex justify-center text-slate-300"
      >
        <FiArrowDown className="text-2xl" aria-label="Scroll down" />
      </motion.div>
    </section>
  );
}
