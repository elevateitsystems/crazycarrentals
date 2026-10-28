import CommonHeroSection from '@/components/CommonHeroSection'
import React from 'react'
import LocationsShowcaseSection from './components/LocationsShowcaseSection'
import LocationHelpSection from './components/LocationHelpSection'

export default function Page() {
  return (
    <>
      <CommonHeroSection
        bedgeText="Launceston Branch"
        title="Our"
        hightlightTitle="Location"
        image="/rent-a-car-hero.jpg"
        description="Wherever you're headed, start here."
      />

      <LocationsShowcaseSection />
      <LocationHelpSection />
    </>
  )
}
