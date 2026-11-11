import SectionHeading from "@/components/SectionHeading";
import { contactInfo } from "@/lib/contact";
import ContactForm from "./ContactForm";
import ContactInfoItem from "./ContactInfoItem";

export default function ContactSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[88rem] items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="lg:pt-2">
          <SectionHeading align="left" eyebrow="Get in Touch" title="We'd love to hear from you." />

          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Whether you have a question about a rental, need help with an accident replacement application, or
            just want to talk to a real person — we&apos;re here.
          </p>

          <ul className="mt-8 space-y-4">
            {contactInfo.map((item) => (
              <ContactInfoItem key={item.label} {...item} />
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
