"use client";

import { useState } from "react";
import { faqCategories, faqs, type FaqCategory } from "@/lib/faqs";
import FaqTabs from "./FaqTabs";
import FaqItem from "./FaqItem";

export default function FaqSection() {
  const [category, setCategory] = useState<FaqCategory>(faqCategories[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleCategory = (next: FaqCategory) => {
    setCategory(next);
    setOpenIndex(null);
  };

  return (
    <section className="bg-background px-6 pb-14 pt-10">
      <div className="mx-auto max-w-4xl">
        <FaqTabs tabs={faqCategories} active={category} onSelect={handleCategory} />

        <div className="mt-7 flex flex-col gap-2">
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