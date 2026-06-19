import { getPageContent } from "@/lib/data";

export async function generateMetadata() {
  const page = await getPageContent("about");
  return {
    title: page?.meta_title || "About - Curious Mind",
    description: page?.meta_description || "Learn more about Curious Mind",
  };
}

export default async function AboutPage() {
  const page = await getPageContent("about");
  const content = page?.content || {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-bold text-[var(--color-text)]">
        {content.heading || "About"}
      </h1>

      {content.image_url && (
        <img
          src={content.image_url}
          alt="About"
          className="mt-8 h-64 w-full rounded-2xl object-cover"
        />
      )}

      <div className="mt-8 space-y-6 text-lg text-[var(--color-text-muted)]">
        <p>{content.content || ""}</p>
        {content.mission && (
          <div className="rounded-xl border border-white/10 bg-[var(--color-surface)] p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Our Mission</h2>
            <p className="mt-2">{content.mission}</p>
          </div>
        )}
      </div>
    </div>
  );
}
