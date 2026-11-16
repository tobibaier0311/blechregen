import test from 'node:test'
import assert from 'node:assert/strict'
import { parseKonzertmeister, fetchKonzertmeister, validateExportUrl, berlinToday } from '../green/server/konzertmeister.mjs'
import { createEventsHandler } from '../green/server/events-handler.mjs'

const now = new Date('2026-11-02T18:00:00Z')
const exportUrl = 'https://rest.konzertmeister.app/api/v3/org/OALS_test/upcomingappointments?types=2&lang=de&hash=test-signature'
const request = () => new Request('https://example.invalid/api/termine')
const env = { KONZERTMEISTER_EXPORT_URL: exportUrl, KONZERTMEISTER_PUBLIC_EXPORT_CONFIRMED: 'true' }
const row = ({ title = 'TEST: kein echter Auftritt', day = '07', month = 'Dez.', year = '2026', time = '19:00 - 20:30', cancelled = false, external = 'https://example.invalid/event' } = {}) => `
<div class="km-list-item">
 <a class="km-app-date ${cancelled ? 'cancelled' : ''}" href="https://rest.konzertmeister.app/api/v1/ical/app/SHAP_test?excludeMeetingPoints=true">
  ${year ? `<div class="km-year">${year}</div>` : ''}<div class="km-date">${day}</div><div class="km-month">${month}</div><div class="km-time">${time}</div>
 </a>
 <div class="km-app-main"><div class="km-appointment-name">${title}</div><div class="km-location"><a href="https://example.invalid/maps">Testort &amp; Testsaal</a></div>
 <div class="km-description">NICHT_UEBERNEHMEN</div><div class="km-creator">PRIVATE_PERSON</div><div class="km-external-link"><a href="${external}">Details</a></div></div>
</div>`
const html = value => `<html><body><div class="km-appointment-list">${value}</div><script>throw new Error('Nicht ausführen')</script></body></html>`
const upstream = value => new Response(value, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } })

test('normalisiert deutschen Export und übernimmt nur öffentliche Anzeigefelder', () => {
  const [event] = parseKonzertmeister(html(row()), { now })
  assert.deepEqual(event, { id: 'SHAP_test', title: 'TEST: kein echter Auftritt', date: '2026-12-07', time: '19:00', endTime: '20:30', location: 'Testort & Testsaal', cancelled: false, calendarUrl: 'https://rest.konzertmeister.app/api/v1/ical/app/SHAP_test?excludeMeetingPoints=true', url: 'https://example.invalid/event' })
  assert(!JSON.stringify(event).includes('NICHT_UEBERNEHMEN'))
  assert(!JSON.stringify(event).includes('PRIVATE_PERSON'))
})
test('erkennt Absagen, ganztägige Termine und fehlende optionale Ortsangaben', () => {
  const source = html(row({ cancelled: true, time: 'Ganztägig', external: 'javascript:alert(1)' })).replace(/<div class="km-location">.*?<\/div>/, '')
  const [event] = parseKonzertmeister(source, { now })
  assert.equal(event.cancelled, true)
  assert.equal(event.time, '')
  assert.equal(event.location, '')
  assert.equal(event.url, undefined)
})
test('behandelt Umlaute, Jahreswechsel und Berliner Datum ohne UTC-Verschiebung', () => {
  assert.equal(parseKonzertmeister(html(row({ month: 'März', year: '2027' })), { now })[0].date, '2027-03-07')
  assert.equal(parseKonzertmeister(html(row({ month: 'Jan.', year: '' })), { now })[0].date, '2027-01-07')
  assert.equal(berlinToday(new Date('2026-12-31T23:30:00Z')), '2027-01-01')
})
test('gültige leere Liste wird von kaputtem Export unterschieden', () => {
  assert.deepEqual(parseKonzertmeister(html('<div class="empty-text">Keine Termine</div>'), { now }), [])
  assert.throws(() => parseKonzertmeister('<html>Wartung</html>', { now }), /FORMAT_CHANGED/)
  assert.throws(() => parseKonzertmeister(html(''), { now }), /FORMAT_CHANGED/)
  assert.throws(() => parseKonzertmeister(html(row({ title: '' })), { now }), /INVALID_EVENT/)
  assert.throws(() => parseKonzertmeister(html(row({ day: '31', month: 'Feb.', year: '2027' })), { now }), /INVALID_DATE/)
  assert.throws(() => parseKonzertmeister(html(row({ time: '25:99' })), { now }), /INVALID_TIME/)
})
test('entfernt vergangene Termine, sortiert und dedupliziert', () => {
  const rows = row({ year: '2025' }) + row() + row() + row({ day: '06' }).replace('SHAP_test', 'SHAP_earlier')
  assert.deepEqual(parseKonzertmeister(html(rows), { now }).map(event => event.date), ['2026-12-06', '2026-12-07'])
})
test('Exportziel ist fest auf Konzertmeister, deutsche Auftritte und HTTPS begrenzt', () => {
  assert.equal(validateExportUrl(exportUrl), exportUrl)
  for (const value of ['http://127.0.0.1/', 'https://rest.konzertmeister.app.evil.invalid/api/', exportUrl.replace('types=2', 'types=1'), exportUrl.replace('lang=de', 'lang=en'), exportUrl.replace('https://', 'https://user:password@')]) assert.throws(() => validateExportUrl(value))
})
test('Abruf verhindert Weiterleitungen, setzt Timeout und akzeptiert nur begrenztes HTML', async () => {
  let called = false
  const events = await fetchKonzertmeister(exportUrl, { now, fetchImpl: async (url, options) => {
    called = true
    assert.equal(url, exportUrl)
    assert.equal(options.redirect, 'error')
    assert(options.signal instanceof AbortSignal)
    return upstream(html(row()))
  } })
  assert(called); assert.equal(events.length, 1)
  await assert.rejects(fetchKonzertmeister(exportUrl, { fetchImpl: async () => new Response('no', { status: 500 }) }), /UNAVAILABLE/)
  await assert.rejects(fetchKonzertmeister(exportUrl, { fetchImpl: async () => new Response('{}', { headers: { 'content-type': 'application/json' } }) }), /UNAVAILABLE/)
  await assert.rejects(fetchKonzertmeister(exportUrl, { fetchImpl: async () => upstream('x'.repeat(512001)) }), /TOO_LARGE/)
})
test('ohne ausdrückliche öffentliche Freigabe erfolgt überhaupt kein Abruf', async () => {
  for (const values of [{}, { ...env, KONZERTMEISTER_PUBLIC_EXPORT_CONFIRMED: 'false' }, { ...env, KONZERTMEISTER_EXPORT_URL: 'https://example.invalid' }]) {
    const handler = createEventsHandler({ env: values, fetchImpl: () => { throw new Error('Darf nicht aufgerufen werden') } })
    const response = await handler(request())
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('Netlify-CDN-Cache-Control'), 'no-store')
    assert.deepEqual(await response.json(), { error: 'not_configured' })
  }
})
test('Funktionsantwort ist JSON und für 15 Minuten am Netlify CDN cachebar', async () => {
  const handler = createEventsHandler({ env, now: () => now, fetchImpl: async () => upstream(html(row())) })
  const response = await handler(request())
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(response.headers.get('Netlify-CDN-Cache-Control'), 'public, durable, max-age=900')
  const body = await response.text()
  assert.equal(JSON.parse(body).events.length, 1)
  assert(!body.includes('test-signature'))
  assert(!body.includes('<div'))
})
test('Fehler und POST werden nicht als leere, erfolgreiche Liste gecacht', async () => {
  const handler = createEventsHandler({ env, fetchImpl: async () => { throw new Error(exportUrl) } })
  const failed = await handler(request())
  assert.equal(failed.status, 502)
  assert.equal(failed.headers.get('Netlify-CDN-Cache-Control'), 'no-store')
  assert.deepEqual(await failed.json(), { error: 'temporarily_unavailable' })
  const post = await handler(new Request('https://example.invalid/api/termine', { method: 'POST' }))
  assert.equal(post.status, 405)
  assert.equal(post.headers.get('Allow'), 'GET')
})
