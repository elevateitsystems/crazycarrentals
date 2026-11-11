"use client";

import { useState } from "react";
import { faqCategories, faqs, type FaqCategory } from "@/lib/faqs";
import FaqTabs from "./FaqTabs";
import FaqItem from "./FaqItem";

export default function FaqSection({ initialCategory = faqCategories[0] }: { initialCategory?: FaqCategory }) {
  const [category, setCategory] = useState<FaqCategory>(initialCategory);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleCategory = (next: FaqCategory) => {
    setCategory(next);
    setOpenIndex(null);
  };

  return (
    <section className="bg-background px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-12">
      <div className="mx-auto max-w-4xl">
        <FaqTabs tabs={faqCategories} active={category} onSelect={handleCategory} />

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          <span className="font-bold text-foreground">{faqs[category].length}</span> questions in {category}
        </p>

        <div className="mt-3 flex flex-col gap-3">
          {faqs[category].map(({ question, answer }, index) => (
            <FaqItem
              key={`${category}-${question}`}
              id={`faq-${category.replace(/\s+/g, "-").toLowerCase()}-${index}`}
              question={question}
              answer={answer}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}