import AccidentProcessSection from './components/AccidentProcessSection'
import AccidentReplacementSection from './components/AccidentReplacementSection'
import CtaSection from './components/CtaSection'
import EligibilitySection from './components/EligibilitySection'
import FleetSection from './components/FleetSection'
import HeroSection from './components/HeroSection'
import LocationsSection from './components/LocationsSection'
import SearchSection from './components/SearchSection'
import TestimonialsSection from './components/TestimonialsSection'
import WhyChooseSection from './components/WhyChooseSection'

export default function HomePage() {
  return (
    <>
    <HeroSection/>
    <SearchSection/>
    <WhyChooseSection/>
    <AccidentReplacementSection/>
    <EligibilitySection/>
    <AccidentProcessSection/>
    <FleetSection/>
    <TestimonialsSection/>
    <LocationsSection/>
    <CtaSection/>
    </>
  )
}
