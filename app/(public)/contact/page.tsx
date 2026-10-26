import CommonHeroSection from "@/components/CommonHeroSection";
import ContactSection from "../about/components/ContactSection";

export default function ContactPage() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Contact"
        title="Talk to a"
        hightlightTitle="real person."
        image="/generic-hero.jpg"
        description="Questions about a rental or an accident replacement? Call, email or send us a message."
        isCtaOpen={false}
      />
      <ContactSection />
    </>
  );
}
