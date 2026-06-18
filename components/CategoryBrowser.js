"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaAtom, FaCode, FaCalculator, FaLightbulb, FaRocket, FaSatelliteDish } from "react-icons/fa";
import { categoryCardData } from "@/lib/constants";

const icons = {
  Science: FaAtom,
  Technology: FaCode,
  Mathematics: FaCalculator,
  Knowledge: FaLightbulb,
  Innovation: FaRocket,
  Discovery: FaSatelliteDish,
};

export default function CategoryBrowser() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <h2 className="text-3xl font-bold text-white">Explore by Category</h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCardData.map((category) => {
          const Icon = icons[category.name];
          return (
            <motion.div key={category.name} whileHover={{ scale: 1.02 }}>
              <Link
                href={`/categories?category=${encodeURIComponent(category.name)}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#171744] p-5 transition hover:border-violet-400/40"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{category.name}</p>
                  <p className="text-sm text-slate-400">{category.count} articles</p>
                </div>
                <Icon className="text-2xl text-violet-300" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
