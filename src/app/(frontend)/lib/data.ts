import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getSiteData() {
  const payload = await getPayload({ config })
  const [home, settings] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1, draft: false }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
  ])
  return { home, settings, payload }
}

export function eventPlace(event: { venueName: string; address?: { city?: null | string } }) {
  return [event.venueName, event.address?.city].filter(Boolean).join(' · ')
}

export const dateShort = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' })
export const dateLong = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
export const timeShort = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' })
