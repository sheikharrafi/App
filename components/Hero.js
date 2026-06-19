"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GiAstronautHelmet } from "react-icons/gi";

export default function Hero({ config }) {
  const heading = config?.heading || "Welcome to Curious Mind";
  const subheading = config?.subheading || "Exploring the Universe of Knowledge";
  const ctaText = config?.cta_text || "Start Reading";
  const ctaLink = config?.cta_link || "/articles";
  const showAstronaut = config?.show_astronaut !== false;

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Floating astronaut */}
        {showAstronaut && (
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 inline-block"
          >
            <GiAstronautHelmet className="text-6xl text-[var(--color-primary)] md:text-8xl" />
          </motion.div>
        )}

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold leading-tight text-[var(--color-text)] md:text-6xl"
        >
          {heading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-text-muted)] md:text-xl"
        >
          {subheading}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3 font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[var(--color-primary)]/25"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
