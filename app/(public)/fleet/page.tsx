
import CommonHeroSection from '@/components/CommonHeroSection'
import FleetSection from './components/FleetSection'

export default function Page() {
  return (
    <>
         <CommonHeroSection
              bedgeText="Accident Replacement  Vehicles"
              title="The Right Vehicle"
              hightlightTitle="For Every Journey"
              image="/rent-a-car-hero.jpg"
              description="From compact city cars to premium SUVs and commercial trucks — we have a vehicle to match your needs."
              />
        <FleetSection/> 
    </>
  )
}
