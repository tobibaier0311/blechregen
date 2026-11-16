import { PageHero } from '../components/SiteChrome'
import { InquiryForm } from '../components/InquiryForm'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Buch uns | BlechRegen', description: 'BlechRegen für einen Auftritt anfragen.' }

export default async function BookingPage() {
  const { settings } = await getSiteData()
  const email = settings.contact?.email || 'blechregen@gmail.com'
  const phone = settings.contact?.phoneNumbers?.[0]?.number
  return <main><PageHero title="Buch uns" intro="Schreibt uns den Anlass, den Ort und euren Wunschtermin."/>
    <section className="green-section"><div className="concept-container green-booking">
      <div><h2 className="green-heading">Kontakt</h2><a className="green-email" href={`mailto:${email}`}>{email}</a>{phone && <p><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></p>}<p className="green-booking-notice">Ihr könnt uns direkt mailen oder hier einen E-Mail-Entwurf vorbereiten. Die Website verschickt keine Nachrichten. Bitte sendet den Entwurf anschließend in eurem E-Mail-Programm ab.</p></div>
      <InquiryForm email={email}/>
    </div></section>
  </main>
}
