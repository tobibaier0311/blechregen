import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
const base = process.env.GREEN_TEST_URL || 'http://127.0.0.1:3004'

// Reine Testdaten: werden nur in diesem Browserlauf injiziert, nie in die Website geschrieben.
const events = [
  { id: 'test-1', title: 'Testkonzert im Beispielsall', date: '2099-06-07', time: '19:00', endTime: '20:30', location: 'Testadresse, Regensburg', cancelled: false, calendarUrl: 'https://rest.konzertmeister.app/api/v1/ical/app/SHAP_test', url: 'https://example.invalid/event' },
  { id: 'test-2', title: 'Testtermin abgesagt', date: '2099-06-14', time: '18:00', endTime: '', location: 'Testort', cancelled: true },
  { id: 'test-3', title: '<img src=x onerror=alert(1)> Nur Testtext', date: '2099-07-01', time: '', endTime: '', location: 'Eine sehr lange Testadresse zum Prüfen des Zeilenumbruchs auf schmalen Handydisplays', cancelled: false },
  { id: 'test-4', title: 'Vierter Testtermin', date: '2099-08-01', time: '11:00', endTime: '', location: '', cancelled: false },
]
const browser = await chromium.launch()
const errors = []
try {
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  let mode = 'success'
  await page.route('**/api/termine**', route => {
    const payload = mode === 'empty' ? { events: [], updatedAt: '2099-01-01T00:00:00Z' } : mode === 'setup' ? { error: 'not_configured' } : mode === 'error' ? { error: 'temporarily_unavailable' } : mode === 'invalid' ? { events: [{ ...events[0], url: 'javascript:alert(1)' }] } : { events, updatedAt: '2099-01-01T00:00:00Z' }
    return route.fulfill({ status: mode === 'setup' ? 503 : mode === 'error' ? 502 : 200, contentType: 'application/json', body: JSON.stringify(payload) })
  })
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const path of ['/', '/termine/']) {
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.waitForSelector('.green-appointment-list > li', { timeout: 15000 })
      assert.equal(await page.locator('.green-appointment-list > li').count(), path === '/' ? 3 : 4)
      assert.equal(await page.locator('.green-appointment-list .is-cancelled').count(), 1)
      assert.equal(await page.locator('.green-appointment-detail img').count(), 0, 'Fremder Text wird nicht als HTML eingefügt')
      assert.equal(await page.locator('.is-cancelled a').count(), 0)
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path}: kein Überlauf bei ${width}px`)
      if (path === '/termine/' && [390, 1440].includes(width)) await page.screenshot({ path: `/tmp/blechregen-events-${width}-TESTDATEN.png`, fullPage: true })
    }
  }
  for (const [state, message] of [['empty', 'keine öffentlichen Auftritte'], ['setup', 'wird gerade eingerichtet'], ['error', 'nicht abrufbar'], ['invalid', 'nicht abrufbar']]) {
    mode = state
    await page.goto(base + '/termine/', { waitUntil: 'networkidle' })
    await page.waitForFunction(value => document.querySelector('.green-appointments [role="status"]')?.textContent?.includes(value), message)
    assert((await page.locator('.green-appointments [role="status"]').innerText()).includes(message), `${state}: passender Zustand`)
    assert.equal(await page.locator('.green-appointment-list > li').count(), 0)
  }
  mode = 'success'
  await page.getByRole('button', { name: 'Erneut versuchen' }).click()
  await page.waitForSelector('.green-appointment-list > li')
  assert.equal(await page.locator('.green-appointment-list > li').count(), 4)
  mode = 'error'
  await page.evaluate(() => Date.now = () => 9999999999999)
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
  await page.waitForFunction(() => document.querySelector('.green-appointments [role="status"]')?.textContent?.includes('zuletzt geladenen Stand'))
  assert.equal(await page.locator('.green-appointment-list > li').count(), 4, 'Bereits geladene Termine bleiben bei Fehlern sichtbar')
  assert.deepEqual(errors, [])
  console.log('Eigene Terminliste: Desktop/Mobil, Startseitenlimit, Absage, reine Textausgabe, leere Liste, Einrichtung, Fehler, ungültige Daten, Wiederholen und letzter geladener Stand geprüft. Nur injizierte Testdaten.')
} finally { await browser.close() }
