import Hero from "../components/hero.tsx"
import Features from "../components/feature.tsx"
import HowItWorks from "../components/how-it-works.tsx"
import CallToAction from "../components/call-to-action.tsx"
import Footer from "../components/footer.tsx"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="flex justify-center items-center">
        <Features />
      </div>
      <HowItWorks />
      <div className="flex justify-center items-center">
        <CallToAction />
      </div>
      <div className="flex justify-center items-center">
        <Footer />
      </div>
    </main>
  )
}

