import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import LandingFooter from '../components/LandingFooter'
import './landing.css'

/**
 * Landing Page Component
 * 
 * Clean, modular landing page showcasing the Library Retrieval Management System.
 * Built with reusable components for easy maintenance and updates.
 */
export default function LandingPage() {
  return (
    <div className="landing-root">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LandingFooter />
    </div>
  )
}
