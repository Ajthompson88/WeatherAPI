import express from 'express';
import { Router, type Request, type Response } from 'express';
import WeatherService from '../../service/weatherService.js';

const app = express();
const router = Router();

app.use(express.json()); // Add this middleware to parse JSON request bodies

// POST: Retrieve weather data for a given city
router.post('/', async (req: Request, res: Response) => {
  console.log('POST /api/weather called');
  try {
    const { city } = req.body;
    console.log('City received in POST request:', city);

    if (!city || typeof city !== 'string' || city.trim() === '') {
      console.warn('Invalid city provided');
      return res.status(400).json({ error: 'City must be a non-empty string.' });
    }

    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log('Weather data retrieved:', weatherData);
    return res.json(weatherData);
  } catch (error: any) {
    console.error('Error in POST /api/weather:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;