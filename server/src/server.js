import express from 'express';
import htmlRouter from './routes/htmlRoutes';
import weatherRouter from './routes/weatherRoutes';
import historyRouter from './service/historyService';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Mount the modular routers
app.use('/', htmlRouter);
app.use('/', weatherRouter);
app.use('/', historyRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
