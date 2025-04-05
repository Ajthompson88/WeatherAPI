import { Router, type Request, type Response } from 'express';
const router = Router();

import WeatherService from '../../service/weatherService.js';

// POST: Retrieve weather data for a given city
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      throw new Error('City name is required');
    }
    const weatherData = await WeatherService.getWeatherData(city);
    res.json(weatherData);
  } catch (error: any) {
    console.error('Error in POST /api/weather:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// GET: Retrieve weather data for a given city via query parameter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.query as { city: string };
    if (!city) {
      throw new Error('City query parameter is required');
    }
    const weatherData = await WeatherService.getWeatherData(city);
    res.json(weatherData);
  } catch (error: any) {
    console.error('Error in GET /api/weather:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;