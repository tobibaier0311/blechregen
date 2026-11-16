import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('http://127.0.0.1:3004/', { waitUntil: 'networkidle' })
    const measurements = await page.locator('.ticker-track').evaluate(track => {
      const animation = track.getAnimations()[0]
      animation.pause()
      animation.currentTime = 0
      const sets = [...track.children]
      const parts = [...track.querySelectorAll('.ticker-word, .ticker-star')].map(el => el.getBoundingClientRect())
      const gaps = parts.slice(1).map((rect, index) => rect.left - parts[index].right)
      const duration = Number(animation.effect.getTiming().duration)
      animation.currentTime = duration - 1
      const beforeWrap = sets[1].getBoundingClientRect().left
      animation.currentTime = duration + 1
      const afterWrap = sets[0].getBoundingClientRect().left
      animation.currentTime = 0
      return { gaps, seamDifference: Math.abs(beforeWrap - afterWrap), widths: sets.map(el => el.getBoundingClientRect().width) }
    })
    assert(Math.max(...measurements.gaps) - Math.min(...measurements.gaps) < 1, `${width}px: gleichmäßige Abstände einschließlich Übergang`)
    assert(measurements.seamDifference < 1, `${width}px: nahtloser Animationsdurchlauf`)
    assert(measurements.widths.every(value => Math.abs(value - measurements.widths[0]) < 1), `${width}px: identische Gruppenbreiten`)
    assert(measurements.widths[0] * 3 >= width, `${width}px: keine leeren Enden während der Bewegung`)
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px: kein horizontaler Überlauf`)
    assert.equal(await page.locator('.concept-ticker button').count(), 0)
    await page.locator('.concept-ticker').screenshot({ path: `/tmp/blechregen-ticker-${width}.png` })
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  await page.reload({ waitUntil: 'networkidle' })
  assert.equal(await page.locator('.ticker-track').evaluate(el => getComputedStyle(el).animationName), 'none')
  assert.equal(await page.locator('.ticker-set:visible').count(), 1)
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  console.log('Laufband geprüft: fünf Breiten, gleiche Abstände bis über die Naht, nahtloser Durchlauf, keine Leerstellen, keine Buttons und reduzierte Bewegung.')
} finally {
  await browser.close()
}
