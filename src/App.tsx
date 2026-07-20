import { MotionConfig } from 'framer-motion'
import { TrackProvider } from '@/lib/useTrackState'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Nav } from '@/components/Nav'
import { Hero } from '@/sections/Hero'
import { WiseJourney } from '@/sections/WiseJourney'
import { BuildTracks } from '@/sections/BuildTracks'
import { EnterTheLab } from '@/sections/EnterTheLab'
import { PowerCircle } from '@/sections/PowerCircle'
import { BehindTheWings } from '@/sections/BehindTheWings'
import { WiseConnect } from '@/sections/WiseConnect'
import { Footer } from '@/sections/Footer'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TrackProvider>
        <SmoothScroll>
          <Nav />
          <main>
            <Hero />
            <WiseJourney />
            <BuildTracks />
            <EnterTheLab />
            <PowerCircle />
            <BehindTheWings />
            <WiseConnect />
          </main>
          <Footer />
        </SmoothScroll>
      </TrackProvider>
    </MotionConfig>
  )
}

export default App
