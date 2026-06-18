"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiCalendar, FiClock } from "react-icons/fi";

export default function ArticleCard({ article }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#16163d] shadow-lg"
    >
      <Link href={`/blog/${article.slug}`}>
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={480}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-5">
        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300">
          {article.category}
        </span>
        <h3 className="mt-3 text-xl font-semibold text-white">{article.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-300">{article.description}</p>
        <div className="mt-4 flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <FiCalendar /> {article.date}
          </span>
          <span className="flex items-center gap-1">
            <FiClock /> {article.readTime}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
