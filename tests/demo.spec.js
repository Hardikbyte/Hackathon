const { test, expect } = require('@playwright/test')

test('demo flow returns checkout and screenshot', async ({ request }) => {
  const r = await request.post('/run', { data: { command: 'Book from Kota to Delhi next Friday 2 passengers', site: 'demo' } })
  expect(r.ok()).toBeTruthy()
  const j = await r.json()
  expect(j.ok).toBe(true)
  expect(j.screenshotBase64 || j.screenshot).toBeTruthy()
  expect(j.checkoutUrl).toBeTruthy()
})