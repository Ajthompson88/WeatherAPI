import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

const historyService = new HistoryService();

// GET: Retrieve search history
router.get('/', async (_req: Request, res: Response) => {
  try {
    const historyData = await historyService.getHistory();
    return res.json(historyData);
  } catch (error: any) {
    console.error('Error in GET /api/history:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// POST: Add a city to search history
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
    await historyService.addCityToHistory(city);
    return res.json({ message: 'City added to history.' });
  } catch (error: any) {
    console.error('Error in POST /api/history:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// DELETE: Remove a city from search history by its ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEntry = await historyService.deleteCityFromHistory(Number(id));
    if (deletedEntry) {
      return res.json({ message: 'Entry successfully deleted.' });
    } else {
      return res.status(404).json({ error: 'Entry not found.' });
    }
  } catch (error: any) {
    console.error('Error in DELETE /api/history:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;