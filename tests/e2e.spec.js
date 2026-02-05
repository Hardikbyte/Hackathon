const { test, expect } = require('@playwright/test')

test('full user journey opens checkout', async ({ page, request }) => {
  const r = await request.post('/run', { data: { command: 'Book from Kota to Delhi next Friday 2 passengers', site: 'demo' } })
  const j = await r.json()
  expect(j.ok).toBe(true)
  const url = j.checkoutUrl
  await page.goto(url)
  await expect(page.locator('text=Checkout')).toBeVisible()
})