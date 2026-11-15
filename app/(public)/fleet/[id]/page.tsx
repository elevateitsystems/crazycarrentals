import { Suspense } from "react";
import CarDetail from "./CarDetail";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <CarDetail id={id} />
    </Suspense>
  );
}
