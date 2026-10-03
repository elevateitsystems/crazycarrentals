import React from "react";
import RentACarHeroSection from "./components/RentACarHeroSection";
import SearchSection from "../components/SearchSection";
import FleetListing from "./components/FleetListing";

export default function RentACarPage() {
  return (
    <>
      <RentACarHeroSection />
      <SearchSection />

      <FleetListing />
    </>
  );
}
