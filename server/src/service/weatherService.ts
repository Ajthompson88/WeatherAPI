import { Router } from 'express';
import axios from 'axios';

const weatherRouter = Router();

// Example route for fetching weather data
weatherRouter.get('/weather', async (_req, res) => {
  try {
    const weatherData = await getWeatherByCity(_req.query.city as string);
    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather' });
  }
});

weatherRouter.delete('/history', async (_req, res) => {
  const id = _req.query.id as string; // Type assertion
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const newHistory = await deleteHistoryEntry(id);
    return res.json(newHistory);
  } catch (err) {
    return res.status(500).json({ error: 'Error deleting history entry' });
  }
});

export default weatherRouter;

async function getWeatherByCity(city: string) {
  if (!city || typeof city !== 'string') {
    throw new Error('Invalid city parameter');
  }

  const apiKey = process.env.OPENWEATHER_API_KEY; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

async function deleteHistoryEntry(id: string) {
  // Implement the logic to delete a history entry
  return { message: `History entry with ID ${id} deleted` };
}

