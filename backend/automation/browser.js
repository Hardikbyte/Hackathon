import { chromium } from 'playwright';

export async function createBrowserSession() {
  // Set headless to false for demo/development so users can see the automation
  // Set to true for production
  const headless = process.env.HEADLESS_BROWSER === 'true';
  const browser = await chromium.launch({ 
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  return { browser, context, page };
}

export async function closeBrowserSession(session) {
  if (!session) return;
  try {
    await session.context?.close();
  } catch {
  }
  try {
    await session.browser?.close();
  } catch {
  }
}

export async function getPageSnapshot(page) {
  const url = page.url();
  const title = await page.title().catch(() => '');
  const text = await page.evaluate(() => {
    const getText = (el) => el?.innerText?.replace(/\s+/g, ' ').trim() || '';
    const sections = Array.from(document.querySelectorAll('h1,h2,h3,button,a,label,span,p'))
      .map(getText)
      .filter(Boolean)
      .slice(0, 80);
    const inputs = Array.from(document.querySelectorAll('input,select,textarea'))
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        name: el.getAttribute('name') || '',
        id: el.getAttribute('id') || '',
        placeholder: el.getAttribute('placeholder') || '',
        aria: el.getAttribute('aria-label') || '',
        value: el.value || '',
      }))
      .slice(0, 50);
    return { sections, inputs };
  });
  return JSON.stringify({ url, title, text }, null, 2);
}

function isCssSelector(selector) {
  return selector.startsWith('#') || selector.startsWith('.') || selector.includes('>>') || selector.includes('[');
}

async function resolveLocator(page, selector) {
  if (selector.startsWith('text=')) return page.locator(selector);
  if (selector.startsWith('role=')) {
    const name = selector.replace(/^role=/, '').trim();
    return page.getByRole('button', { name: new RegExp(name, 'i') });
  }
  if (selector.startsWith('label=')) {
    const name = selector.replace(/^label=/, '').trim();
    return page.getByLabel(new RegExp(name, 'i'));
  }
  if (isCssSelector(selector)) return page.locator(selector);
  return page.getByText(new RegExp(selector, 'i')).first();
}

async function fallbackLocator(page, label) {
  const candidates = [
    page.getByLabel(new RegExp(label, 'i')),
    page.getByRole('textbox', { name: new RegExp(label, 'i') }),
    page.getByPlaceholder(new RegExp(label, 'i')),
  ];
  for (const candidate of candidates) {
    if (await candidate.count()) return candidate.first();
  }
  return null;
}

export async function performAction(page, action) {
  const { type, selector, value } = action;
  let locator = await resolveLocator(page, selector);
  if (!locator || !(await locator.count())) {
    locator = await fallbackLocator(page, selector);
  }
  if (!locator || !(await locator.count())) {
    throw new Error(`Selector not found: ${selector}`);
  }

  if (type === 'click') {
    await locator.first().click({ timeout: 10000 });
    return;
  }
  if (type === 'fill') {
    await locator.first().fill(String(value ?? ''), { timeout: 10000 });
    return;
  }
  if (type === 'select') {
    await locator.first().selectOption(String(value ?? ''), { timeout: 10000 });
  }
}

export async function takeScreenshotBase64(page) {
  const buffer = await page.screenshot({ fullPage: true }).catch(() => null);
  if (!buffer) return '';
  return buffer.toString('base64');
}
