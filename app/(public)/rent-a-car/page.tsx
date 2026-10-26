import { Suspense } from "react";
import CommonHeroSection from "@/components/CommonHeroSection";
import SearchSection from "../components/SearchSection";
import FleetListing from "./components/FleetListing";

export default function RentACarPage() {
  return (
    <>
      <CommonHeroSection
      bedgeText="Car Rental"
      title="Rent a Car in"
      hightlightTitle="Tasmania"
      image="/rent-a-car-hero.jpg"
      description="Rent a car for your next trip, or get a replacement vehicle after an accident — all from one trusted Tasmanian team."
      isCtaOpen={false}
      />
      <SearchSection />

      <Suspense>
        <FleetListing />
      </Suspense>
    </>
  );
}
