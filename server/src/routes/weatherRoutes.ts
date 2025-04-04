import { Router } from 'express';
import fetchWeatherByCity from '../service/weatherService.js';
import getSearchHistory from '../service/weatherService.js';
import deleteHistoryEntry from '../service/weatherService.js';

const router = Router();

import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

async function getWeatherByCity(req: Request, res: Response) {
  const city = req.body.city;
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Invalid city parameter' });
  }

  const apiKey = 'your_openweather_api_key'; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}

// Use the function in a route
router.post('/weather', getWeatherByCity);

router.get('/history', async (_req, res, next: NextFunction) => {
  try {
    const history = await getSearchHistory(_req, res, next);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Could not read search history' });
  }
});

router.post('/', async (_req, res, next: NextFunction) => {
  const { city } = _req.body;
  if (!city) {
    return res.status(400).json({ error: 'Please provide a city name' });
  }

  try {
    const weatherData = await fetchWeatherByCity(city, res, next);
    return res.json(weatherData);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error fetching weather' });
  }
});

router.delete('/history/:id', async (_req, res, next: NextFunction) => {
  try {
    const newHistory = await deleteHistoryEntry(_req, res, next);
    res.json(newHistory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
});

export default router;
