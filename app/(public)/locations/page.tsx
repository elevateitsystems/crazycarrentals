import PageHeader from "@/components/PageHeader";
import React from 'react'
import LocationsShowcaseSection from './components/LocationsShowcaseSection'
import LocationHelpSection from './components/LocationHelpSection'

export default function Page() {
  return (
    <>
      <PageHeader
        badge="Launceston Branch"
        title="Our"
        highlight="Location"
        description="Wherever you're headed, start here."
      />

      <LocationsShowcaseSection />
      <LocationHelpSection />
    </>
  )
}
