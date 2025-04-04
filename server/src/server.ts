import express from 'express';
import htmlRouter from './routes/htmlRoutes.js';
import weatherRouter from './routes/weatherRoutes.js';
import historyRouter from './service/historyService.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the modular routers
app.use('/', htmlRouter);
app.use('/', weatherRouter);
app.use('/', historyRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
