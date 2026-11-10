import PageHeader from "@/components/PageHeader";
import ContactSection from "../about/components/ContactSection";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        badge="Contact"
        title="Talk to a"
        highlight="real person."
        description="Questions about a rental or an accident replacement? Call, email or send us a message."
      />
      <ContactSection />
    </>
  );
}
