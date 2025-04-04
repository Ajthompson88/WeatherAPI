import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
const historyRouter = Router();
const historyFilePath = path.join(__dirname,'./WeatherAPI/server.searchHistory.json' );
// GET the search history
historyRouter.get('/history', async (_req, res) => {
    try {
        const data = await fs.readFile(historyFilePath, 'utf-8');
        const history = JSON.parse(data);
        res.json(history);
    }
    catch (error) {
        console.error('Error reading search history:', error);
        res.status(500).json({ error: 'Error reading search history' });
    }
});
// POST a new search term to the history
historyRouter.post('/history', async (_req, res) => {
    const newEntry = _req.body;
    try {
        const data = await fs.readFile(historyFilePath, 'utf-8');
        const history = JSON.parse(data);
        history.push(newEntry);
        await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2));
        res.status(201).json({ message: 'Search history updated' });
    }
    catch (error) {
        console.error('Error updating search history:', error);
        res.status(500).json({ error: 'Error updating search history' });
    }
});
// DELETE a specific history entry by id
historyRouter.delete('/history/:id', async (_req, res) => {
    const idToDelete = _req.params.id;
    try {
        const data = await fs.readFile(historyFilePath, 'utf-8');
        let history = JSON.parse(data);
        history = history.filter((entry) => entry.id !== idToDelete);
        await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2));
        res.json({ message: 'History entry deleted' });
    }
    catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ error: 'Error deleting history entry' });
    }
});
export default historyRouter;
