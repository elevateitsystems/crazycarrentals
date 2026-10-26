import AdminBookingDetail from "./AdminBookingDetail";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminBookingDetail id={id} />;
}
