import { Suspense } from "react";
import SearchSection from "../components/SearchSection";
import FleetListing from "./components/FleetListing";

// The reservation form leads the page (no hero image); results use the full page width below it.
export default function RentACarPage() {
  return (
    <>
      <Suspense>
        <SearchSection />
      </Suspense>

      <Suspense>
        <FleetListing />
      </Suspense>
    </>
  );
}
