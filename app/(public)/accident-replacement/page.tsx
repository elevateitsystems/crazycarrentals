import React from "react";
import AccidentProcessSection from "../components/AccidentProcessSection";
import AccidentReplacementSection from "../components/AccidentReplacementSection";
import CtaSection from "../components/CtaSection";
import AccidentREplacementHeroSection from "./components/AccidentReplacementHeroSection";

export default function Page() {
  return (
    <>
      <AccidentREplacementHeroSection />
      <AccidentProcessSection />
      <AccidentReplacementSection />
      <div className="mx-auto max-w-7xl my-22 rounded-[19px] overflow-hidden">
        <CtaSection />
      </div>
    </>
  );
}
