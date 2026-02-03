import { pipeline } from '@xenova/transformers';

const DEFAULT_MODEL = process.env.TRANSCRIBE_MODEL || 'Xenova/whisper-small';
const FALLBACK_MODEL = process.env.TRANSCRIBE_FALLBACK_MODEL || '';
const DEFAULT_LANGUAGE = process.env.TRANSCRIBE_LANGUAGE || 'en';
const MAX_AUDIO_BYTES = Number(process.env.TRANSCRIBE_MAX_AUDIO_BYTES || 0) || 0;
const SUPPORTED_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
  'audio/m4a',
  'audio/flac',
  'audio/x-flac',
]);
const ASR_CACHE = new Map();

async function getAsr(model) {
  if (!ASR_CACHE.has(model)) {
    ASR_CACHE.set(model, pipeline('automatic-speech-recognition', model));
  }
  return ASR_CACHE.get(model);
}

function parseAsrOutput(output) {
  if (!output) return '';
  if (typeof output === 'string') return output;
  if (typeof output.text === 'string') return output.text;
  if (Array.isArray(output.chunks)) {
    return output.chunks.map((chunk) => chunk?.text).filter(Boolean).join(' ');
  }
  if (Array.isArray(output)) {
    return output.map((chunk) => chunk?.text).filter(Boolean).join(' ');
  }
  return '';
}

export async function transcribeRoute(req, res) {
  const file = req.file;
  if (!file || !file.buffer) {
    return res.status(400).json({ ok: false, message: 'No audio file provided' });
  }
  if (file.mimetype && !SUPPORTED_MIME_TYPES.has(file.mimetype)) {
    return res.status(400).json({
      ok: false,
      message: 'Unsupported audio type',
      received: file.mimetype,
      allowed: Array.from(SUPPORTED_MIME_TYPES),
    });
  }
  if (MAX_AUDIO_BYTES && file.buffer.length > MAX_AUDIO_BYTES) {
    return res.status(413).json({
      ok: false,
      message: 'Audio file is too large',
      maxBytes: MAX_AUDIO_BYTES,
      receivedBytes: file.buffer.length,
    });
  }
  if (file.buffer.length < 512) {
    return res.status(400).json({ ok: false, message: 'Audio file is too small to transcribe' });
  }
  try {
    const modelsToTry = [DEFAULT_MODEL, FALLBACK_MODEL].filter(Boolean);
    let lastError;
    for (const model of modelsToTry) {
      try {
        const asr = await getAsr(model);
        const output = await asr(file.buffer, {
          language: DEFAULT_LANGUAGE,
          task: 'transcribe',
        });
        const text = parseAsrOutput(output);
        return res.json({ ok: true, text, model });
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('Unknown transcription error');
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      ok: false,
      message: 'Transcription failed. Please try again.',
      detail: e.message,
    });
  }
}
