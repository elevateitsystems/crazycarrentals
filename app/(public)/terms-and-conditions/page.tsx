import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RichText from "@/components/RichText";
import { termsMarkdown } from "@/lib/legal/terms";
import { sectionHeadings } from "@/lib/rich-text";

export const metadata: Metadata = {
  title: "Terms and Conditions | TasDrive Rentals",
  description: "The terms and conditions that apply to every TasDrive Rentals vehicle hire.",
};

const sections = sectionHeadings(termsMarkdown);

export default function TermsPage() {
  return (
    <>
      <PageHeader
        badge="Legal"
        title="Terms and"
        highlight="Conditions."
        description="The terms that apply to every TasDrive Rentals vehicle hire. Please read them before you book."
      />

      <section className="bg-background py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[17rem_1fr] lg:px-8">
          <nav aria-label="Terms and Conditions sections" className="lg:sticky lg:top-28 lg:self-start">
            <details className="rounded-2xl border border-border bg-card p-4 open:pb-3 lg:open:pb-4" open>
              <summary className="cursor-pointer text-sm font-semibold text-foreground lg:pointer-events-none lg:list-none">Contents</summary>
              <ol className="mt-3 max-h-[60vh] space-y-1 overflow-y-auto text-[13px]">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      {s.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>

          <article className="min-w-0 max-w-3xl">
            <RichText source={termsMarkdown} />
          </article>
        </div>
      </section>
    </>
  );
}
