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
Only output valid JSON, no markdown.`;
  }
}

export async function intentRoute(req, res) {
  const { text } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'GEMINI_API_KEY not configured' });
  }
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Missing text' });
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
    if (!intent.params) intent.params = {};
    return res.json({ intent });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Intent extraction failed. Please try again.' });
  }
}
