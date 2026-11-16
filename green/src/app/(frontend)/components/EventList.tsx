'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Appointment = {
  id: string
  title: string
  date: string
  time: string
  endTime: string
  location: string
  cancelled: boolean
  calendarUrl?: string
  url?: string
}
type Status = 'loading' | 'ready' | 'setup' | 'error'
const REFRESH_MS = 15 * 60 * 1000
const monthYear = new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric', timeZone: 'Europe/Berlin' })

function safeLink(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password }
  catch { return false }
}
function validEvent(value: unknown): value is Appointment {
  if (!value || typeof value !== 'object') return false
  const event = value as Record<string, unknown>
  return ['id', 'title', 'date', 'time', 'endTime', 'location'].every(key => typeof event[key] === 'string') &&
    typeof event.cancelled === 'boolean' && /^\d{4}-\d{2}-\d{2}$/.test(String(event.date)) &&
    !Number.isNaN(Date.parse(`${event.date}T12:00:00Z`)) &&
    (!event.calendarUrl || safeLink(event.calendarUrl)) && (!event.url || safeLink(event.url))
}

export function EventList({ limit = 10, compact = false }: { limit?: number; compact?: boolean }) {
  const [events, setEvents] = useState<Appointment[] | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [retrying, setRetrying] = useState(false)
  const active = useRef<AbortController | null>(null)
  const lastFetch = useRef(0)
  const load = useCallback(async () => {
    if (active.current) return
    const controller = new AbortController()
    active.current = controller
    const timeout = setTimeout(() => controller.abort(), 12000)
    setRetrying(true)
    try {
      const response = await fetch('/api/termine', { signal: controller.signal, headers: { Accept: 'application/json' }, cache: 'no-store' })
      const data = await response.json()
      if (active.current !== controller) return
      if (!response.ok) {
        if (response.status === 503 && data.error === 'not_configured') { setStatus('setup'); return }
        throw new Error('Termine nicht erreichbar')
      }
      if (!Array.isArray(data.events) || !data.events.every(validEvent)) throw new Error('Unerwartete Termindaten')
      setEvents(data.events)
      setStatus('ready')
      lastFetch.current = Date.now()
    } catch {
      if (active.current === controller) setStatus('error')
    } finally {
      clearTimeout(timeout)
      if (active.current === controller) { active.current = null; setRetrying(false) }
    }
  }, [])

  useEffect(() => {
    void load()
    const refresh = () => { if (document.visibilityState === 'visible' && Date.now() - lastFetch.current >= REFRESH_MS) void load() }
    const timer = setInterval(refresh, REFRESH_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
      const controller = active.current
      active.current = null
      controller?.abort()
    }
  }, [load])

  const visible = events?.slice(0, limit)
  return <div className={`green-appointments${compact ? ' green-appointments-compact' : ''}`}>
    <noscript><p>Für aktuelle Termine bitte JavaScript aktivieren oder <a href="mailto:blechregen@gmail.com">bei uns nachfragen</a>.</p></noscript>
    <div role="status" aria-live="polite">
      {status === 'loading' && <p className="green-appointments-notice">Termine werden geladen …</p>}
      {status === 'setup' && <p className="green-appointments-notice">Unsere Terminliste wird gerade eingerichtet.</p>}
      {status === 'error' && <div className="green-appointments-notice"><p>{events !== null ? 'Die Termine konnten gerade nicht aktualisiert werden. Ihr seht den zuletzt geladenen Stand.' : 'Die Termine sind gerade nicht abrufbar. Bitte versucht es später noch einmal.'}</p><button className="green-events-retry" type="button" disabled={retrying} onClick={() => void load()}>{retrying ? 'Wird geladen …' : 'Erneut versuchen'}</button></div>}
      {status === 'ready' && visible?.length === 0 && <p className="green-appointments-notice">Aktuell sind keine öffentlichen Auftritte angekündigt.</p>}
    </div>
    {visible && visible.length > 0 && <ol className="green-appointment-list" aria-label="Kommende öffentliche Auftritte">{visible.map(event => <li key={event.id} className={event.cancelled ? 'is-cancelled' : undefined}>
      <time className="green-appointment-date" dateTime={event.date}>
        <span className="green-appointment-day">{event.date.slice(-2)}</span>
        <span>{monthYear.format(new Date(`${event.date}T12:00:00Z`))}</span>
        {event.time && <span className="green-appointment-time">{event.time}{!compact && event.endTime ? `–${event.endTime}` : ''} Uhr</span>}
      </time>
      <div className="green-appointment-detail">
        {event.cancelled && <p className="green-appointment-cancelled">Abgesagt</p>}
        {compact ? <h3>{event.title}</h3> : <h2>{event.title}</h2>}
        {event.location && <p>{event.location}</p>}
        {!event.cancelled && (event.url || event.calendarUrl) && <div className="green-appointment-links">{event.url && <a href={event.url} rel="noopener noreferrer" target="_blank">Veranstaltung</a>}{event.calendarUrl && <a href={event.calendarUrl} rel="noopener noreferrer">In den Kalender</a>}</div>}
      </div>
    </li>)}</ol>}
    {events !== null && <p className="green-appointments-source">Termine aus <a href="https://konzertmeister.app" target="_blank" rel="noopener noreferrer">Konzertmeister</a></p>}
  </div>
}
