export interface IntentResult {
  action: string;
  site?: string;
  params: Record<string, string | number | boolean>;
  raw?: string;
}

export interface StatusUpdate {
  id: string;
  timestamp: number;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  detail?: string;
}

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: number;
  isReplay?: boolean;
}
