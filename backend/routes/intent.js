import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let systemPrompt = '';
try {
  systemPrompt = readFileSync(join(__dirname, '../../prompts/gemini-intent.txt'), 'utf8');
} catch {
  try {
    systemPrompt = readFileSync(join(__dirname, '../prompts/gemini-intent.txt'), 'utf8');
  } catch {
  systemPrompt = `You are an intent extractor for a voice-controlled browser automation app.
Given a user transcript, output a JSON object with: "action" (e.g. book_train, book_flight, search), "site" (e.g. irctc, goibibo), and "params" (object with from, to, date, passengers, etc.).
Also include "steps": an array of 3-7 short todo items to complete the task.
Only output valid JSON, no markdown.`;
  }
}

function normalizeSteps(steps) {
  let list = steps;
  if (typeof list === 'string') list = [list];
  if (!Array.isArray(list)) list = [];
  const cleaned = list
    .map((step) => (typeof step === 'string' ? step.trim() : ''))
    .filter(Boolean);
  const unique = [];
  const seen = new Set();
  for (const step of cleaned) {
    const key = step.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(step);
    }
  }
  return unique.slice(0, 7);
}

function buildStepsFromIntent(intent) {
  const action = intent?.action || 'unknown';
  const site = intent?.site ? String(intent.site) : '';
  const params = intent?.params && typeof intent.params === 'object' ? intent.params : {};

  const siteLabel = site ? site.toUpperCase() : '';
  const fromTo = params.from && params.to
    ? `Enter ${params.from} to ${params.to}`
    : 'Enter origin and destination';
  const date = params.date ? `Select date ${params.date}` : 'Select travel date';
  const passengers = params.passengers
    ? `Choose ${params.passengers} passenger${Number(params.passengers) === 1 ? '' : 's'}`
    : 'Choose passenger count';

  if (action === 'book_train') {
    return [
      `Open ${siteLabel || 'train booking site'}`,
      fromTo,
      date,
      passengers,
      'Search trains',
      'Pick train/class and proceed to booking',
      'Confirm traveler details and pay',
    ];
  }
  if (action === 'search_train') {
    return [
      `Open ${siteLabel || 'train booking site'}`,
      fromTo,
      date,
      passengers,
      'Search trains',
      'Review available trains',
    ];
  }
  if (action === 'book_flight') {
    return [
      `Open ${siteLabel || 'flight booking site'}`,
      fromTo,
      date,
      passengers,
      'Search flights',
      'Pick a flight and proceed to booking',
      'Confirm traveler details and pay',
    ];
  }
  if (action === 'search_flight') {
    return [
      `Open ${siteLabel || 'flight booking site'}`,
      fromTo,
      date,
      passengers,
      'Search flights',
      'Review available flights',
    ];
  }
  if (action === 'open_site') {
    return [
      `Open ${siteLabel || 'the requested site'}`,
      'Navigate to the relevant section',
      'Confirm the next action with the user',
    ];
  }
  if (action === 'cancel') {
    return [
      `Open ${siteLabel || 'booking site'}`,
      'Locate the booking or order',
      'Select cancel option',
      'Confirm cancellation',
      'Check refund status',
    ];
  }
  if (action === 'help') {
    return [
      'Ask the user what they want to do',
      'Offer example commands',
      'Confirm details before proceeding',
    ];
  }
  return [
    'Ask the user to repeat or clarify the request',
    'Offer example commands',
    'Confirm the action and required details',
  ];
}

export async function intentRoute(req, res) {
  const { text } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  if (!apiKey) {
    return res.status(500).json({ ok: false, message: 'GEMINI_API_KEY not configured' });
  }
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ ok: false, message: 'Missing text' });
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = systemPrompt + '\n\nUser said: ' + text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const raw = response?.text?.() ?? '';
    let intent;
    try {
      const cleaned = raw.replace(/```json?\s*/g, '').replace(/\s*```/g, '').trim();
      intent = JSON.parse(cleaned);
    } catch {
      intent = { action: 'unknown', params: {}, raw };
    }
    if (!intent.action) intent.action = 'unknown';
    if (!intent.params || typeof intent.params !== 'object') intent.params = {};
    intent.steps = normalizeSteps(intent.steps);
    if (!intent.steps.length) {
      intent.steps = buildStepsFromIntent(intent);
    }
    return res.json({ ok: true, intent, todos: intent.steps });
  } catch (e) {
    console.error('Intent extraction error:', e);
    return res.status(500).json({
      ok: false,
      message: 'Intent extraction failed. Please try again.',
      detail: e?.message || 'Unknown error',
      status: e?.status,
      statusText: e?.statusText,
      errorDetails: e?.errorDetails,
      model: modelName,
    });
  }
}
