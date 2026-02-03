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

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

app.post('/api/transcribe', upload.single('audio'), transcribeRoute);
app.post('/api/intent', intentRoute);
app.post('/api/automate', automateRoute);
app.get('/api/status/:runId', statusRoute);
app.get('/api/download-project', downloadProjectRoute);
app.post('/api/github/create', githubCreateRoute);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
