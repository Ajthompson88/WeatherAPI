import express from 'express';
import routes from './routes/index.js';
import weatherRoutes from './routes/api/weatherRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

// Dynamically calculate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "client/dist" directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Root route to serve the frontend
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Mount the modular routers
app.use('/api', routes);

// Mount the weather route
app.use('/api/weather', weatherRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
