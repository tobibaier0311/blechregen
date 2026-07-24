import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Kontakt | BlechRegen' }
export default async function ContactPage() { const { settings } = await getSiteData(); const email = settings.contact?.email || 'blechregen@gmail.com'; const phone = settings.contact?.phoneNumbers?.[0]?.number || '+49 160 7790533'; return <main><PageHero eyebrow="Servus, hola, hallo" title="Reden wir über Musik." intro="Booking, Rückfragen oder einfach ein freundlicher Gruß – hier erreicht ihr uns ohne Umwege." /><section className="contact-page section-wrap"><a href={`mailto:${email}`}><span>E-Mail</span><strong>{email}</strong><b>↗</b></a><a href={`tel:${phone.replace(/\s/g, '')}`}><span>Telefon</span><strong>{phone}</strong><b>↗</b></a>{settings.socialMedia?.instagram && <a href={settings.socialMedia.instagram} rel="noreferrer" target="_blank"><span>Social</span><strong>Instagram</strong><b>↗</b></a>}</section></main> }
