import { contactInfo } from "@/lib/contact";
import ContactForm from "./ContactForm";
import ContactInfoItem from "./ContactInfoItem";
import SectionBadge from "./SectionBadge";

export default function ContactSection() {
  return (
    <section className="bg-background py-18">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-24 lg:px-0">
        <div className="lg:pt-2">
          <SectionBadge>Get in Touch</SectionBadge>

          <h1 className="mt-4 max-w-md text-[2.4rem] font-bold leading-[1.15] tracking-tight text-foreground">
            We&apos;d love to hear from you.
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-6.5 text-muted-foreground">
            Whether you have a question about a rental, need help with an accident replacement application, or
            just want to talk to a real person — we&apos;re here.
          </p>

          <ul className="mt-8 space-y-5">
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