import { FiMail, FiMapPin } from "react-icons/fi";

export const metadata = {
  title: "About Me",
  description: "Learn more about the mission and story behind Curious Mind.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-20 md:px-8">
      <h1 className="text-4xl font-bold text-white">About Me</h1>
      <p className="mt-6 text-lg text-slate-300">
        I’m a curious writer and researcher who loves making complex ideas simple. My mission is to explore
        science, technology, and the future with clarity and optimism.
      </p>
      <div className="mt-10 grid gap-6 rounded-2xl border border-white/10 bg-[#171744] p-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">Mission</h2>
          <p className="mt-2 text-slate-300">
            Help curious minds build deeper understanding through evidence-based writing and practical insights.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Contact</h2>
          <p className="mt-2 flex items-center gap-2 text-slate-300"><FiMail /> hello@curiousmind.dev</p>
          <p className="mt-2 flex items-center gap-2 text-slate-300"><FiMapPin /> Dhaka, Bangladesh</p>
        </div>
      </div>
    </section>
  );
}
