module.exports = async function(page, params, port) {
  const url = `http://localhost:${port}/demo.html`
  await page.goto(url)
  await page.fill('#from', params.from || '')
  await page.fill('#to', params.to || '')
  if (params.date) await page.fill('#date', params.date)
  await page.click('#proceed')
  await page.waitForLoadState('networkidle')
}
