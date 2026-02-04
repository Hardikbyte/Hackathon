import { parseCommand } from './planner.js';
import { callAgentLLM } from './llm.js';
import { addUpdate } from './runStore.js';
import { createBrowserSession, closeBrowserSession, getPageSnapshot, performAction, takeScreenshotBase64 } from './browser.js';

const IRCTC_URL = 'https://www.irctc.co.in/nget/train-search';

function buildStatus({ status, message, step, totalSteps, screenshot, done, runId }) {
  return {
    status,
    message,
    step,
    totalSteps,
    screenshot,
    done,
    runId,
    timestamp: Date.now(),
  };
}

async function pushUpdate(bus, runId, payload) {
  addUpdate(runId, payload);
  bus.broadcast(payload);
}

async function retry(action, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await action(attempt);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

async function dismissPopups(page) {
  const candidates = [
    page.getByRole('button', { name: /ok|accept|continue|later|got it|close/i }),
    page.getByRole('button', { name: /yes/i }),
  ];
  for (const candidate of candidates) {
    if (await candidate.count()) {
      try {
        await candidate.first().click({ timeout: 2000 });
      } catch {
      }
    }
  }
}

async function selectDate(page, isoDate) {
  if (!isoDate) return;
  const [year, month, day] = isoDate.split('-').map(Number);
  const dateInput = page.getByRole('textbox', { name: /date|journey date/i });
  if (!(await dateInput.count())) return;
  await dateInput.first().click({ timeout: 5000 });
  const targetMonth = month - 1;
  for (let i = 0; i < 12; i += 1) {
    const header = await page.locator('.ui-datepicker-title, .ui-datepicker-title span, .ui-datepicker-header').first().innerText().catch(() => '');
    const headerLower = header.toLowerCase();
    if (headerLower.includes(String(year)) && headerLower.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)) {
      const monthIndex = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].findIndex((m) => headerLower.includes(m));
      if (monthIndex === targetMonth) break;
    }
    const nextBtn = page.getByRole('button', { name: /next/i }).first();
    if (await nextBtn.count()) {
      await nextBtn.click();
    } else {
      break;
    }
  }
  const dayButton = page.getByRole('link', { name: new RegExp(`^${day}$`) });
  if (await dayButton.count()) {
    await dayButton.first().click();
  } else {
    const fallback = page.getByText(new RegExp(`^${day}$`)).first();
    if (await fallback.count()) await fallback.click();
  }
}

async function checkCaptcha(page) {
  const captcha = page.locator('img[alt*="captcha" i], input[id*="captcha" i], input[name*="captcha" i]');
  return (await captcha.count()) > 0;
}

async function ensureLoginIfNeeded(page, bus, runId) {
  const loginForm = page.locator('input[type="password"], input[aria-label*="password" i]');
  if ((await loginForm.count()) === 0) return false;
  await pushUpdate(bus, runId, buildStatus({
    status: 'progress',
    message: 'Login required. Please login and solve CAPTCHA in the browser window.',
    step: 0,
    totalSteps: 0,
    done: false,
    runId,
  }));
  const hasCaptcha = await checkCaptcha(page);
  if (hasCaptcha) {
    await pushUpdate(bus, runId, buildStatus({
      status: 'progress',
      message: 'CAPTCHA detected. Waiting for manual solve.',
      step: 0,
      totalSteps: 0,
      done: false,
      runId,
    }));
  }
  for (let i = 0; i < 120; i += 1) {
    if ((await loginForm.count()) === 0) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

async function detectNoTrains(page) {
  const noTrains = page.getByText(/no trains|no results|not available/i);
  return (await noTrains.count()) > 0;
}

async function clickFirstBookNow(page) {
  const bookNow = page.getByRole('button', { name: /book now|available/i }).first();
  if (await bookNow.count()) {
    await bookNow.click();
    return true;
  }
  return false;
}

export async function runAgent({ command, bus, runId }) {
  const parsed = await parseCommand(command);
  const session = await createBrowserSession();
  let step = 1;
  const totalSteps = 8;
  try {
    await pushUpdate(bus, runId, buildStatus({ status: 'progress', message: 'Launching browser...', step, totalSteps, done: false, runId }));
    await retry(() => session.page.goto(IRCTC_URL, { waitUntil: 'domcontentloaded' }));
    await dismissPopups(session.page);
    step += 1;
    await pushUpdate(bus, runId, buildStatus({ status: 'progress', message: 'Filling search form...', step, totalSteps, done: false, runId }));

    await retry(async () => {
      await performAction(session.page, { type: 'fill', selector: 'label=From', value: parsed.from });
      await session.page.keyboard.press('Enter');
      await performAction(session.page, { type: 'fill', selector: 'label=To', value: parsed.to });
      await session.page.keyboard.press('Enter');
    });

    await retry(() => selectDate(session.page, parsed.date));
    step += 1;
    await pushUpdate(bus, runId, buildStatus({ status: 'progress', message: 'Submitting search...', step, totalSteps, done: false, runId }));
    await retry(() => performAction(session.page, { type: 'click', selector: 'text=Search' }));

    await session.page.waitForTimeout(3000);
    if (await detectNoTrains(session.page)) {
      await pushUpdate(bus, runId, buildStatus({
        status: 'error',
        message: 'No trains found for selected date. Try nearby dates or different times.',
        step,
        totalSteps,
        done: true,
        runId,
      }));
      return;
    }

    step += 1;
    await pushUpdate(bus, runId, buildStatus({ status: 'progress', message: 'Selecting train...', step, totalSteps, done: false, runId }));
    await clickFirstBookNow(session.page);

    step += 1;
    await pushUpdate(bus, runId, buildStatus({ status: 'progress', message: 'Waiting for login or passenger details...', step, totalSteps, done: false, runId }));
    await ensureLoginIfNeeded(session.page, bus, runId);

    step += 1;
    await pushUpdate(bus, runId, buildStatus({ status: 'progress', message: 'Reviewing booking details...', step, totalSteps, done: false, runId }));

    const snapshot = await getPageSnapshot(session.page);
    const reactResult = await callAgentLLM({
      goal: `Book IRCTC ticket from ${parsed.from} to ${parsed.to} on ${parsed.date} ${parsed.time || ''}`.trim(),
      snapshot,
      plan: [],
      step,
    });

    if (reactResult?.action) {
      await retry(() => performAction(session.page, reactResult.action));
    }

    const finalSnapshot = await getPageSnapshot(session.page);
    await pushUpdate(bus, runId, buildStatus({
      status: 'success',
      message: 'Checkout ready. Please review before payment.',
      step: totalSteps,
      totalSteps,
      done: true,
      runId,
      screenshot: await takeScreenshotBase64(session.page),
      snapshot: finalSnapshot,
    }));
  } catch (err) {
    const screenshot = await takeScreenshotBase64(session.page).catch(() => '');
    await pushUpdate(bus, runId, buildStatus({
      status: 'error',
      message: err?.message || 'Automation failed.',
      step,
      totalSteps,
      done: true,
      runId,
      screenshot,
    }));
  } finally {
    await closeBrowserSession(session);
  }
}
