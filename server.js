const express = require('express')
const path = require('path')
const { chromium } = require('playwright')
const { getAdapter } = require('./adapters')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function formatDate(d) {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

const dows = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
}

function nextDow(dow) {
  const now = new Date()
  const target = dows[dow.toLowerCase()]
  if (target === undefined) return null
  const diff = ((target - now.getDay() + 7) % 7) || 7
  const res = new Date(now)
  res.setDate(now.getDate() + diff)
  return formatDate(res)
}

function parseCommand(text) {
  const lower = (text || '').toLowerCase()
  let from = null
  let to = null
  let date = null
  let passengers = null
  let mode = null
  let roundTrip = false
  let timeOfDay = null
  const m = lower.match(/from\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s|$)/i)
  if (m) {
    from = m[1].trim().replace(/\s+/g, ' ')
    to = m[2].trim().replace(/\s+/g, ' ')
  }
  const dmatch = lower.match(/(?:next|coming)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i)
  if (dmatch) {
    date = nextDow(dmatch[1])
  }
  const iso = lower.match(/(\d{4}-\d{2}-\d{2})/)
  if (!date && iso) {
    date = iso[1]
  }
  if (!date) {
    const rel = lower.match(/tomorrow|today/)
    if (rel) {
      const now = new Date()
      if (rel[0] === 'tomorrow') now.setDate(now.getDate() + 1)
      date = formatDate(now)
    }
  }
  const numWord = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }
  const p1 = lower.match(/(?:for\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(passenger|people|persons|adults|seats)/)
  if (p1) {
    const n = p1[1]
    passengers = numWord[n] || parseInt(n, 10)
  }
  const p2 = lower.match(/for\s+(one|two|three|four|five|six|seven|eight|nine|ten)\b/)
  if (!passengers && p2) {
    passengers = numWord[p2[1]]
  }
  if (lower.includes('round trip') || lower.includes('return')) roundTrip = true
  if (lower.includes('train')) mode = 'train'
  else if (lower.includes('flight') || lower.includes('plane')) mode = 'flight'
  else if (lower.includes('bus')) mode = 'bus'
  const tod = lower.match(/\b(morning|afternoon|evening|night)\b/)
  if (tod) timeOfDay = tod[1]
  let intent = null
  if (lower.includes('book') && (lower.includes('ticket') || lower.includes('train') || lower.includes('flight'))) intent = 'book_ticket'
  return { intent, from, to, date, passengers, mode, roundTrip, timeOfDay }
}

app.post('/run', async (req, res) => {
  try {
    const { command, site, headless } = req.body
    const params = parseCommand(command || '')
    if (!params.intent) return res.status(400).json({ ok: false, error: 'Unrecognized intent', params })
    const adapter = getAdapter(site || 'demo')
    const browser = await chromium.launch({ headless: headless !== undefined ? !!headless : !!process.env.HEADLESS })
    const context = await browser.newContext()
    const page = await context.newPage()
    await adapter(page, params, PORT)
    const screenshotPath = path.join(__dirname, 'public', 'last.png')
    await page.screenshot({ path: screenshotPath, fullPage: true })
    const finalUrl = page.url()
    await browser.close()
    const missing = []
    if (!params.from) missing.push('from')
    if (!params.to) missing.push('to')
    if (!params.date) missing.push('date')
    res.json({ ok: true, site: site || 'demo', params, missing, checkoutUrl: finalUrl, screenshot: '/last.png' })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Voice agent server listening at http://localhost:${PORT}/`)
})
