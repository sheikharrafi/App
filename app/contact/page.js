import { getPageContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageContent("contact");
  return {
    title: page?.meta_title || "Contact - Curious Mind",
    description: page?.meta_description || "Get in touch",
  };
}

export default async function ContactPage() {
  const page = await getPageContent("contact");
  const content = page?.content || {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="text-4xl font-bold text-[var(--color-text)]">
        {content.heading || "Contact"}
      </h1>
      <p className="mt-3 text-lg text-[var(--color-text-muted)]">
        {content.description || ""}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {content.email && (
          <div className="rounded-xl border border-white/10 bg-[var(--color-surface)] p-6">
            <h3 className="font-semibold text-[var(--color-text)]">Email</h3>
            <a
              href={`mailto:${content.email}`}
              className="mt-1 text-[var(--color-primary)] hover:underline"
            >
              {content.email}
            </a>
          </div>
        )}
        {content.location && (
          <div className="rounded-xl border border-white/10 bg-[var(--color-surface)] p-6">
            <h3 className="font-semibold text-[var(--color-text)]">Location</h3>
            <p className="mt-1 text-[var(--color-text-muted)]">{content.location}</p>
          </div>
        )}
      </div>
    </div>
  );
}
