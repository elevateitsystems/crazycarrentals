import CarDetail from "./CarDetail";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CarDetail id={id} />;
}
