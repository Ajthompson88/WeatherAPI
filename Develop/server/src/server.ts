import dotenv from 'dotenv';
import express from 'express';
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../client/public')));
app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use(htmlRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});