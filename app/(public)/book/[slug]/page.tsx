import { notFound } from "next/navigation";
import { cars } from "@/lib/cars";
import BookingFlow from "./components/BookingFlow";

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();

  return <BookingFlow car={car} />;
}