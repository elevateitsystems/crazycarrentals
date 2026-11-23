import { Suspense } from "react";
import FleetListing from "./components/FleetListing";

// Search results have their own route so the fleet stays easy to scan on desktop and mobile.
export default function RentACarPage() {
  return (
    <Suspense>
      <FleetListing />
    </Suspense>
  );
}
