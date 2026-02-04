import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { transcribeRoute } from './routes/transcribe.js';
import { intentRoute } from './routes/intent.js';
import { automateRoute } from './routes/automate.js';
import { statusRoute } from './routes/status.js';
import { downloadProjectRoute } from './routes/downloadProject.js';
import { githubCreateRoute } from './routes/githubCreate.js';
import { createStatusBus } from './automation/statusBus.js';
import { voiceCommandRoute } from './routes/voiceCommand.js';
import { createRun, addUpdate } from './automation/runStore.js';
import { runAgent } from './automation/agent.js';

const app = express();
const PORT = process.env.PORT || 4000;
const WS_PORT = process.env.WS_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const bus = createStatusBus({ port: WS_PORT });
bus.onCommand((command) => {
  const runId = createRun(command);
  const queued = {
    status: 'progress',
    message: 'Command received. Starting automation...',
    step: 1,
    totalSteps: 8,
    done: false,
    runId,
    timestamp: Date.now(),
  };
  addUpdate(runId, queued);
  bus.broadcast(queued);
  runAgent({ command, bus, runId });
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

app.post('/api/transcribe', upload.single('audio'), transcribeRoute);
app.post('/api/intent', intentRoute);
app.post('/api/automate', automateRoute(bus));
app.get('/api/status/:runId', statusRoute);
app.get('/api/download-project', downloadProjectRoute);
app.post('/api/github/create', githubCreateRoute);
app.post('/api/voice-command', voiceCommandRoute(bus));

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`WebSocket running at ws://localhost:${WS_PORT}`);
});
