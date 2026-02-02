import fetch from 'node-fetch';

const WISPR_URL = 'https://platform-api.wisprflow.ai/api/v1/dash/api';

export async function transcribeRoute(req, res) {
  const file = req.file;
  const apiKey = process.env.WISPR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'WISPR_API_KEY not configured' });
  }
  if (!file || !file.buffer) {
    return res.status(400).json({ message: 'No audio file provided' });
  }
  try {
    const base64Audio = file.buffer.toString('base64');
    const body = {
      audio: base64Audio,
      language: ['en'],
    };
    const response = await fetch(WISPR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || data.error || 'Wispr transcription failed',
      });
    }
    return res.json({ text: data.text || '' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Transcription failed. Please try again.' });
  }
}
