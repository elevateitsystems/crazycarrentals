
import PageHeader from "@/components/PageHeader";
import FleetSection from './components/FleetSection'

export default function Page() {
  return (
    <>
         <PageHeader
                badge="Our Fleet"
                title="The Right Vehicle"
                highlight="For Every Journey"
                description="From compact city cars to premium SUVs and commercial trucks — we have a vehicle to match your needs."
                actions={[{ label: "Rent a Car", href: "/rent-a-car" }, { label: "Locations", href: "/locations" }]}
              />
        <FleetSection/> 
    </>
  )
}
