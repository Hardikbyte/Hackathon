const { test, expect } = require('@playwright/test')

test('irctc demo flow (Kota→Delhi) works', async ({ request }) => {
  const r = await request.post('/run', { data: { command: 'Book from Kota to Delhi next Friday 2 passengers', site: 'irctc' } })
  expect(r.ok()).toBeTruthy()
  const j = await r.json()
  expect(j.ok).toBe(true)
  expect(j.params.from.toLowerCase()).toContain('kota')
  expect(j.params.to.toLowerCase()).toContain('delhi')
  expect(j.screenshotBase64 || j.screenshot).toBeTruthy()
})