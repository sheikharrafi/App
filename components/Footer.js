import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b22] px-4 py-12 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">Curious <span className="text-violet-400">Mind</span></p>
          <p className="mt-2 text-sm text-slate-400">Science, technology, and ideas for a smarter future.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <Link href="/">Home</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="GitHub"><FaGithub /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="mailto:hello@curiousmind.dev" aria-label="Email"><FaEnvelope /></a>
        </div>
      </div>
      <p className="mx-auto mt-8 w-full max-w-7xl text-xs text-slate-500">© {new Date().getFullYear()} Curious Mind. All rights reserved.</p>
    </footer>
  );
}
