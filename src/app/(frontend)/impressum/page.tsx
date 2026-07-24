import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Impressum | BlechRegen' }
export default async function LegalPage() { const { settings } = await getSiteData(); const address = settings.contact?.address; return <main><PageHero eyebrow="Rechtliches" title="Impressum" intro="Angaben gemäß § 5 DDG." /><section className="legal section-wrap"><h2>BlechRegen</h2>{address?.street && <p>{address.street}<br />{address.postalCode} {address.city}</p>}<h2>Kontakt</h2><p>E-Mail: <a href={`mailto:${settings.contact?.email || 'blechregen@gmail.com'}`}>{settings.contact?.email || 'blechregen@gmail.com'}</a></p><p className="legal-note">Bitte die vollständigen rechtlich erforderlichen Angaben vor Veröffentlichung im CMS ergänzen und juristisch prüfen lassen.</p></section></main> }
