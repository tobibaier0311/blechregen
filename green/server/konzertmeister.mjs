import { parse } from 'parse5'

const MAX_BYTES = 512_000

function attr(node, name) { return node.attrs?.find(value => value.name === name)?.value || '' }
function hasClass(node, name) { return attr(node, 'class').split(/\s+/).includes(name) }
function descendants(node, predicate) {
  const matches = []
  const pending = [node]
  while (pending.length) {
    const current = pending.pop()
    if (predicate(current)) matches.push(current)
    pending.push(...(current.childNodes || []).slice().reverse())
  }
  return matches
}
function find(node, name) { return descendants(node, value => hasClass(value, name))[0] }
function text(node) {
  if (!node || ['script', 'style', 'template'].includes(node.tagName)) return ''
  if (node.nodeName === '#text') return node.value
  return (node.childNodes || []).map(text).join(' ')
}
function clean(node) { return text(node).replace(/\s+/g, ' ').trim() }
function safeLink(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined
  } catch { return undefined }
}

export function berlinToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const value = type => parts.find(part => part.type === type).value
  return `${value('year')}-${value('month')}-${value('day')}`
}

// Adapter für den geprüften deutschen HTML-Export. Fremdes HTML wird nie ausgegeben.
export function parseKonzertmeister(html, { now = new Date() } = {}) {
  if (Buffer.byteLength(html) > MAX_BYTES) throw new Error('EXPORT_TOO_LARGE')
  const document = parse(html)
  const list = find(document, 'km-appointment-list')
  if (!list) throw new Error('EXPORT_FORMAT_CHANGED')
  const rows = descendants(list, node => hasClass(node, 'km-list-item'))
  if (!rows.length) {
    if (!find(list, 'empty-text')) throw new Error('EXPORT_FORMAT_CHANGED')
    return []
  }
  if (rows.length > 100) throw new Error('EXPORT_TOO_MANY_EVENTS')
  const today = berlinToday(now)
  const currentYear = Number(today.slice(0, 4))
  const currentMonth = Number(today.slice(5, 7))
  const months = { jan: 1, januar: 1, feb: 2, februar: 2, mar: 3, marz: 3, maerz: 3, mrz: 3, apr: 4, april: 4, mai: 5, jun: 6, juni: 6, jul: 7, juli: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, okt: 10, oktober: 10, nov: 11, november: 11, dez: 12, dezember: 12 }
  const events = rows.map(row => {
    const title = clean(find(row, 'km-appointment-name'))
    const dayText = clean(find(row, 'km-date'))
    const monthText = clean(find(row, 'km-month')).toLowerCase().replace(/ä/g, 'a').replace(/\./g, '')
    const month = months[monthText]
    const yearText = clean(find(row, 'km-year'))
    const year = yearText ? Number(yearText) : currentYear + (month < currentMonth ? 1 : 0)
    const day = Number(dayText)
    if (!title || title.length > 300 || !/^\d{1,2}$/.test(dayText) || !month || !Number.isInteger(year) || year < 2000 || year > 2200) throw new Error('EXPORT_INVALID_EVENT')
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error('EXPORT_INVALID_DATE')
    const timeText = clean(find(row, 'km-time'))
    let time = '', endTime = ''
    if (timeText && !/^ganzt[aä]gig$/i.test(timeText)) {
      const match = timeText.match(/^(\d{1,2}:\d{2})(?:\s*[-–—]\s*(\d{1,2}:\d{2}))?$/)
      if (!match) throw new Error('EXPORT_INVALID_TIME')
      const normalized = value => {
        if (!value) return ''
        const [hours, minutes] = value.split(':').map(Number)
        if (hours > 23 || minutes > 59) throw new Error('EXPORT_INVALID_TIME')
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      }
      time = normalized(match[1]); endTime = normalized(match[2])
    }
    const calendarCandidate = safeLink(attr(find(row, 'km-app-date') || {}, 'href'))
    const calendarUrl = calendarCandidate && new URL(calendarCandidate).hostname === 'rest.konzertmeister.app' && new URL(calendarCandidate).pathname.startsWith('/api/v1/ical/app/') ? calendarCandidate : undefined
    const external = find(row, 'km-external-link')
    const linkNode = external && descendants(external, node => node.tagName === 'a')[0]
    const url = safeLink(attr(linkNode || {}, 'href'))
    return {
      id: calendarUrl ? new URL(calendarUrl).pathname.split('/').pop() : `${date}-${time}-${title}`,
      title, date, time, endTime,
      location: clean(find(row, 'km-location')).slice(0, 500),
      cancelled: descendants(row, node => hasClass(node, 'cancelled')).length > 0,
      ...(calendarUrl ? { calendarUrl } : {}), ...(url ? { url } : {}),
    }
  })
  return [...new Map(events.filter(event => event.date >= today).map(event => [event.id, event])).values()]
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, 10)
}

export function validateExportUrl(value) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.hostname !== 'rest.konzertmeister.app' || (url.port && url.port !== '443') || url.username || url.password || url.hash || !/^\/api\/v3\/org\/OALS_[a-zA-Z0-9-]+\/upcomingappointments$/.test(url.pathname) || url.searchParams.get('types') !== '2' || url.searchParams.get('lang') !== 'de') throw new Error('EXPORT_URL_INVALID')
  return url.href
}

export async function fetchKonzertmeister(url, { fetchImpl = fetch, now = new Date() } = {}) {
  const response = await fetchImpl(validateExportUrl(url), { redirect: 'error', signal: AbortSignal.timeout(8000), headers: { Accept: 'text/html' } })
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('EXPORT_UNAVAILABLE')
  if (Number(response.headers.get('content-length')) > MAX_BYTES || !response.body) throw new Error('EXPORT_TOO_LARGE')
  const reader = response.body.getReader()
  const chunks = []
  let bytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BYTES) { await reader.cancel(); throw new Error('EXPORT_TOO_LARGE') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return parseKonzertmeister(Buffer.concat(chunks).toString('utf8'), { now })
}
