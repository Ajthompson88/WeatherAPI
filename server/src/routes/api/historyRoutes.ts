import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

// GET: Retrieve search history
router.get('/', async (_req: Request, res: Response) => {
  // For example, if no query parameter is provided:
  if (!(_req.query && _req.query.id)) {
    return res.status(400).json({ error: 'ID is required' });
  }
  try {
    // Your logic to get history here, e.g.:
    const historyData = await HistoryService.getHistory();
    return res.json(historyData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST: Add a city to search history
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
    await HistoryService.addCityToHistory(city);
    return res.json({ message: 'City added to history.' });
  } catch (error: any) {
    console.error('Error in POST /api/history:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// DELETE: Remove a city from search history by its id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEntry = await HistoryService.deleteCityFromHistory(Number(id));
    if (deletedEntry) {
      res.json({ message: 'Entry successfully deleted.' });
    } else {
      res.status(404).json({ error: 'Entry not found.' });
    }
  } catch (error: any) {
    console.error('Error in DELETE /api/history:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;