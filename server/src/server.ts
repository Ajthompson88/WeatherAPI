import express from 'express';
import routes from './routes/index.js';

import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the modular routers
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
