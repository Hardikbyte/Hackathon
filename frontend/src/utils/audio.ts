const DEFAULT_SAMPLE_RATE = 16000;

const AudioContextRef = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

export async function decodeAudioToMono(
  blob: Blob,
  targetSampleRate: number = DEFAULT_SAMPLE_RATE
): Promise<{ samples: Float32Array; sampleRate: number }> {
  if (!AudioContextRef) {
    throw new Error('Audio decoding not supported in this browser.');
  }

  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContextRef();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);
  await audioCtx.close();

  const outputLength = Math.ceil(decoded.duration * targetSampleRate);
  const offlineCtx = new OfflineAudioContext(1, outputLength, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineCtx.destination);
  source.start(0);
  const rendered = await offlineCtx.startRendering();

  return {
    samples: rendered.getChannelData(0),
    sampleRate: rendered.sampleRate,
  };
}
