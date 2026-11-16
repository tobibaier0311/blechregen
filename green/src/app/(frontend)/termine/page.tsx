import { PageHero } from '../components/SiteChrome'
import { EventList } from '../components/EventList'

export const metadata = { title: 'Termine | BlechRegen', description: 'Die nächsten öffentlichen Auftritte von BlechRegen.' }

export default function EventsPage() {
  return <main><PageHero title="Termine" intro="Unsere nächsten öffentlichen Auftritte."/><section className="green-section"><div className="concept-container"><EventList/></div></section></main>
}
