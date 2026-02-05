async function sleep(ms) { await new Promise(r => setTimeout(r, ms)) }

async function tryGoto(page, url, attempts = 3) {
  let lastErr = null
  for (let i = 0; i < attempts; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      return
    } catch (e) {
      lastErr = e
      await sleep(2000)
    }
  }
  throw lastErr
}

module.exports = async function(page, params, _port, statusCb = () => {}) {
  const url = 'https://www.irctc.co.in/nget/train-search'
  statusCb({ status: 'navigating', message: `Opening IRCTC: ${url}` })
  await tryGoto(page, url, 3)
  try {
    await page.locator('input[aria-label="From*"]').click({ timeout: 10000 })
    if (params.from) await page.type('input[aria-label="From*"]', params.from, { delay: 50 })
  } catch {}
  try {
    await page.locator('input[aria-label="To*"]').click({ timeout: 10000 })
    if (params.to) await page.type('input[aria-label="To*"]', params.to, { delay: 50 })
  } catch {}
  try {
    if (params.date) {
      await page.locator('input[aria-label="Journey Date*"]').click({ timeout: 10000 })
      await page.type('input[aria-label="Journey Date*"]', params.date, { delay: 30 })
    }
  } catch {}
  try {
    const searchBtn = page.locator('button:has-text("Search")')
    await searchBtn.click({ timeout: 20000 })
  } catch {}
  statusCb({ status: 'filled', message: `Filled IRCTC form from=${params.from} to=${params.to} date=${params.date}` })
  try {
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 })
  } catch (e) {
    statusCb({ status: 'warning', message: 'Page state changed or closed; continuing' })
  }
  statusCb({ status: 'checkout_ready', message: 'Search results / next step ready' })
}
