import CommonHeroSection from '@/components/CommonHeroSection'
import React from 'react'
import LocationsShowcaseSection from './components/LocationsShowcaseSection'
import LocationHelpSection from './components/LocationHelpSection'

export default function Page() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Our Locations"
        title="Wherever you're headed,"
        hightlightTitle="start here."
        image="/rent-a-car-hero.jpg"
        description="Pick up and return your vehicle at convenient locations across Tasmania, including Hobart Airport."
      />

      <LocationsShowcaseSection />
      <LocationHelpSection />
    </>
  )
}
