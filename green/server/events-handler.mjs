import { fetchKonzertmeister, validateExportUrl } from './konzertmeister.mjs'

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    'Netlify-CDN-Cache-Control': status === 200 ? 'public, durable, max-age=900' : 'no-store',
  } })
}

export function createEventsHandler({ env = process.env, fetchImpl = fetch, now = () => new Date() } = {}) {
  return async function eventsHandler(request) {
    if (request.method !== 'GET') {
      const response = json({ error: 'method_not_allowed' }, 405)
      response.headers.set('Allow', 'GET')
      return response
    }
    if (!env.KONZERTMEISTER_EXPORT_URL || env.KONZERTMEISTER_PUBLIC_EXPORT_CONFIRMED !== 'true') return json({ error: 'not_configured' }, 503)
    try { validateExportUrl(env.KONZERTMEISTER_EXPORT_URL) }
    catch { return json({ error: 'not_configured' }, 503) }
    try {
      const updatedAt = now()
      const events = await fetchKonzertmeister(env.KONZERTMEISTER_EXPORT_URL, { fetchImpl, now: updatedAt })
      return json({ events, updatedAt: updatedAt.toISOString() })
    } catch {
      // Keine Export-URL, Signatur oder upstream Fehlertexte an Besucher ausgeben.
      return json({ error: 'temporarily_unavailable' }, 502)
    }
  }
}
