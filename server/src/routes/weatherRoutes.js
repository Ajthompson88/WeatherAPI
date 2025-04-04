import { Router } from 'express';
import getWeatherByCity from '../service/weatherService';
import getSearchHistory from '../service/weatherService';
import deleteHistoryEntry from '../service/weatherService';
const router = Router();
router.get('/history', async (_req, res, next) => {
    try {
        const history = await getSearchHistory(_req, res, next);
        res.json(history);
    }
    catch (err) {
        res.status(500).json({ error: 'Could not read search history' });
    }
});
router.post('/', async (_req, res) => {
    const { city } = _req.body;
    if (!city) {
        return res.status(400).json({ error: 'Please provide a city name' });
    }
    try {
        const weatherData = await getWeatherByCity(city);
        return res.json(weatherData);
    }
    catch (err) {
        return res.status(500).json({ error: err.message || 'Error fetching weather' });
    }
});
router.delete('/history/:id', async (_req, res) => {
    const id = _req.params.id;
    try {
        const newHistory = await deleteHistoryEntry(id);
        res.json(newHistory);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete history entry' });
    }
});
export default router;
