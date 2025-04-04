import { Router } from 'express';
import path from 'path';
const htmlRouter = Router();
// Serve the main index.html file
htmlRouter.get('/', (_req, res) => {
// Adjust the path if index.html is located elsewhere
res.sendFile(path.join(__dirname, '../index.html'));
});
export default htmlRouter;
