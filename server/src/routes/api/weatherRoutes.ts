import express from 'express';
import { Router, type Request, type Response } from 'express';
import WeatherService, { Weather } from '../../service/weatherService.js';

const app = express();
const router = Router();

app.use(express.json()); // Add this middleware to parse JSON request bodies

// POST: Retrieve weather data for a given city
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body as { city: string };
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    // Call the static method directly on the class
    const weatherData = await WeatherService.getWeatherForCity(city);

    const formattedData = weatherData.map((weather: Weather) => ({
      city: weather.city,
      date: weather.date,
      icon: weather.icon,
      iconDescription: weather.iconDescription,
      tempF: weather.tempF,
      windSpeed: weather.windSpeed,
      humidity: weather.humidity,
    }));

    return res.json(formattedData);
  } catch (error: any) {
    console.error('Error in POST /api/weather:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;