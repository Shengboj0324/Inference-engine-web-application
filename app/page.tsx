import Nav from '@/components/nav'
import Hero from '@/components/hero'
import TrustBar from '@/components/trust-bar'
import Problem from '@/components/problem'
import Pipeline from '@/components/pipeline'
import SignalTaxonomy from '@/components/signal-taxonomy'
import Platforms from '@/components/platforms'
import Privacy from '@/components/privacy'
import LLMRouting from '@/components/llm-routing'
import Calibration from '@/components/calibration'
import Benchmarks from '@/components/benchmarks'
import TeamWorkflow from '@/components/team-workflow'
import DeploymentSteps from '@/components/deployment-steps'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <TrustBar />
        <Problem />
        <Pipeline />
        <SignalTaxonomy />
        <Platforms />
        <Privacy />
        <LLMRouting />
        <Calibration />
        <Benchmarks />
        <TeamWorkflow />
        <DeploymentSteps />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

