import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const client = new GoogleGenerativeAI(key);
  return client.getGenerativeModel({ model: GEMINI_MODEL });
}

async function callGemini(prompt) {
  const model = getGeminiClient();
  if (!model) return null;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a precise JSON generator.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || null;
}

function safeJsonParse(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  const raw = match ? match[0] : text;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function callPlanningLLM(command) {
  const prompt = [
    'Extract structured IRCTC booking fields from the user command.',
    'Return ONLY JSON with keys: from, to, date (YYYY-MM-DD), time (HH:mm or empty).',
    `Command: "${command}"`,
  ].join('\n');
  const response = await callGemini(prompt) || await callOpenAI(prompt);
  return safeJsonParse(response);
}

export async function callAgentLLM({ goal, snapshot, plan, step }) {
  const prompt = [
    'You are a browser automation planner using ReAct.',
    'Return ONLY JSON.',
    'Fields: action (object with type click|fill|select, selector, value?), done (boolean), message (string), plan (array of strings, optional), suggest (string, optional).',
    `Goal: ${goal}`,
    `Step: ${step}`,
    `CurrentPlan: ${JSON.stringify(plan || [])}`,
    `Snapshot: ${snapshot}`,
  ].join('\n');
  const response = await callGemini(prompt) || await callOpenAI(prompt);
  return safeJsonParse(response);
}
