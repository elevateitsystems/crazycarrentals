import { Suspense } from "react";
import BookingFlow from "./components/BookingFlow";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <BookingFlow carId={id} />
    </Suspense>
  );
}
