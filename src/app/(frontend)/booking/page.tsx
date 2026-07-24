import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Booking | BlechRegen', description: 'BlechRegen für Biergarten, Hochzeit, Vereinsfest oder private Feier buchen.' }

export default async function BookingPage() {
  const { settings } = await getSiteData()
  const email = settings.contact?.email || 'blechregen@gmail.com'
  const phone = settings.contact?.phoneNumbers?.[0]?.number || '+49 160 7790533'
  return <main><PageHero eyebrow="Ihr plant. Wir spielen." title="Gute Musik beginnt mit einer kurzen Nachricht." intro="Erzählt uns, was ihr vorhabt. Wir melden uns persönlich und schauen gemeinsam, was zu eurem Anlass passt." tone="yellow" />
    <section className="occasions section-wrap"><p className="eyebrow">Passt besonders gut</p><div>{['Biergarten & Frühschoppen', 'Hochzeit & private Feier', 'Vereins- & Firmenfest', 'Festival & Kulturabend'].map((item, index) => <article key={item}><span>0{index + 1}</span><h2>{item}</h2></article>)}</div></section>
    <section className="booking-form-wrap"><div className="booking-copy"><p className="eyebrow">Direkter Draht</p><h2>Ein paar Eckdaten reichen fürs Erste.</h2><p>Kein Callcenter, kein Ticketsystem. Eure Anfrage landet direkt bei uns.</p><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></div><form className="booking-form" action={`mailto:${email}`} encType="text/plain" method="post"><label>Name / Organisation<input name="Name" required /></label><label>E-Mail<input name="E-Mail" required type="email" /></label><div className="form-row"><label>Anlass<select name="Anlass"><option>Biergarten / Frühschoppen</option><option>Hochzeit / private Feier</option><option>Vereins- / Firmenfest</option><option>Festival / Kulturabend</option><option>Anderer Anlass</option></select></label><label>Wunschtermin<input name="Termin" type="date" /></label></div><label>Ort<input name="Ort" /></label><label>Was habt ihr vor?<textarea name="Nachricht" required rows={6} /></label><button className="button button-accent" type="submit">Anfrage vorbereiten ↗</button><small>Beim Absenden öffnet sich euer E-Mail-Programm. Es werden keine Daten auf dieser Website gespeichert.</small></form></section>
  </main>
}
