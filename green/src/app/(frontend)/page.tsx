import Link from 'next/link'
import Image from 'next/image'
import { GenreTicker } from './components/GenreTicker'
import { HomeSections } from './components/HomeSections'
import { getSiteData } from './lib/data'

export default async function Home() {
  const { home, payload } = await getSiteData()
  const musicians = await payload.find({ collection: 'musicians', limit: 7, sort: 'order' })
  return <main>
    <section className="concept-hero">
      <div className="concept-container concept-hero-inner">
        <div className="concept-hero-grid">
          <div className="concept-hero-copy">
            <h1 className="green-hero-title"><span>Wenn die</span><span>Polka</span><strong>Salsa tanzt</strong></h1>
            <p>{home.hero.text}</p>
            <div className="concept-actions"><Link className="concept-button concept-button-sun" href="/band">Band & Musik</Link><Link className="concept-text-link" href="/booking">Buch uns</Link></div>
          </div>
          <div className="green-hero-logo-stage"><Image className="green-hero-logo" src="/images/BlechRegen%20Logo%20Transparent.png" alt="BlechRegen Logo mit goldener Trompete" width={984} height={1040} sizes="(max-width: 900px) 320px, 480px" priority /></div>
        </div>
      </div>
    </section>
    <GenreTicker />
    <HomeSections musicians={musicians.docs}/>
  </main>
}
