import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';

const historyService = new HistoryService();

// GET: Retrieve search history
router.get('/', async (_req: Request, res: Response) => {
  console.log('GET /api/history called');
  try {
    const historyData = await historyService.getHistory();
    res.json(historyData); // Ensure JSON response
  } catch (error: any) {
    console.error('Error in GET /api/history:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// POST: Add a city to search history
router.post('/', async (req: Request<{},{},{ city: string }>, res: Response) => {
  console.log('POST /api/history called');
  try {
    const { city } = req.body;
    console.log('City received in POST request:', city);

    if (!city || typeof city !== 'string' || city.trim() === '') {
      return res.status(400).json({ error: 'City must be a non-empty string.' });
    }

    await historyService.addCityToHistory(city);
    console.log('City successfully added to history.');
    return res.status(201).json({ message: 'City added to history.' });
  } catch (error: any) {
    console.error('Error in POST /api/history:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// DELETE: Remove a city from search history by its ID
router.delete('/:id', async (req: Request, res: Response) => {
  console.log('DELETE /api/history/:id called with ID:', req.params.id);
  try {
    const { id } = req.params;

    // Validate the id parameter
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid or missing ID parameter.' });
    }

    const deletedEntry = await historyService.deleteCityFromHistory(Number(id));
    if (!deletedEntry) {
      console.warn(`City with ID ${id} not found.`);
      return res.status(404).json({ error: 'Entry not found.' });
    } else {
      return res.json({ message: 'Entry successfully deleted.' });
    }
  } catch (error: any) {
    console.error('Error in DELETE /api/history:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;