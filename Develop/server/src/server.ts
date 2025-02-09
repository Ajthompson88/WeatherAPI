import dotenv from 'dotenv';
import express from 'express';
import weatherRoutes from './routes/api/weatherRoutes';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/weather', weatherRoutes);

// TODO: Implement middleware to connect the routes
app.use(routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
